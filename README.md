# fast_api_posts

A posts-and-comments API on FastAPI: user registration and authentication, publishing posts,
commenting with profanity moderation, a delayed auto-reply from the post author, and daily
comment statistics.

Stack: FastAPI · SQLAlchemy 2 · PostgreSQL 16 · Pydantic 2 · Alembic · Docker Compose.

## Running

The project runs **only through Docker Compose**.

1. Clone the repository to your local machine.
2. Create a `.env` file in the project root from the template:

   ```sh
   cp .env.example .env
   ```

   Then replace the placeholders with your own values — first of all `POSTGRES_PASSWORD`
   and `SECRET_KEY`. Every key is listed in `.env.example`.

   > `DATABASE_URL` must use the `postgresql+psycopg://` scheme — the psycopg 3 driver.

3. Start the containers:

   ```sh
   docker compose up --build
   ```

Alembic migrations are applied automatically on application start.

- API — http://127.0.0.1:8000
- Swagger — http://127.0.0.1:8000/docs
- PostgreSQL — on host port **5864**

### Configuration

| Key | Default | Meaning |
|---|---|---|
| `POSTGRES_USER` · `POSTGRES_PASSWORD` · `POSTGRES_DB` | — | Credentials the `db` container is created with |
| `DATABASE_URL` | — | DSN the application connects with; must match the three keys above |
| `DB_POOL_SIZE` | `20` | Persistent connections in the SQLAlchemy pool |
| `DB_MAX_OVERFLOW` | `25` | Extra connections allowed above the pool size under load |
| `SECRET_KEY` | — | JWT signing key, **at least 32 characters** |
| `ALGORITHM` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Token lifetime |
| `AUTO_REPLY_POLL_INTERVAL_SECONDS` | `5` | How often the background worker looks for due replies |
| `AUTO_REPLY_BATCH_SIZE` | `100` | Maximum replies delivered per worker cycle |
| `MAX_REQUEST_BODY_BYTES` | `1048576` | Request body size limit (1 MiB) |

`SECRET_KEY` is validated at startup: a shorter value makes the application refuse to boot
rather than sign tokens with a weak key.

### Tests and linter

```sh
docker compose --profile test run --rm tests
docker compose --profile lint run --rm lint
```

Both services sit behind a Compose profile, so `docker compose up` boots only `db` and `app`.
The test suite builds a disposable `<POSTGRES_DB>_test` database from the Alembic head and drops
it on teardown.

## Authentication

`POST /sessions` returns a JWT. The token is then passed in a header:

```
Authorization: Bearer <access_token>
```

In Swagger this is the **Authorize** button.

## Error format

Every error is returned with a machine-readable code:

```json
{"error": {"code": "post_not_found", "message": "Post not found"}}
```

| Code | HTTP | When |
|---|---|---|
| `validation_error` | 422 | Body, query or path parameters failed validation |
| `not_authenticated` | 401 | The endpoint requires a token and none was sent |
| `invalid_token` | 401 | The token is malformed, expired, or its user no longer exists |
| `invalid_credentials` | 401 | Wrong username or password on login |
| `inactive_user` | 401 | The account is deactivated — on login and on every authenticated request |
| `username_taken` | 400 | Registration with an already registered username |
| `post_not_found` | 404 | No such post |
| `comment_not_found` | 404 | No such comment, or it is blocked and you are not its author |
| `forbidden` | 403 | The resource exists but belongs to someone else |
| `payload_too_large` | 413 | The request body exceeds `MAX_REQUEST_BODY_BYTES` |
| `internal_error` | 500 | Unhandled server-side failure; details go to the log, never to the client |

Errors raised by the framework outside this list keep their HTTP status and get a code derived
from the status name — for example `method_not_allowed` for 405.

## Limits

- **Request body** — larger than `MAX_REQUEST_BODY_BYTES` (1 MiB by default) is rejected with 413
  before the handler runs.
- **Integer inputs are bounded.** Path identifiers accept `1 … 2147483647` and `skip` accepts
  `0 … 2147483647`, so an out-of-range number is a 422 rather than a database error.

## Endpoints

«auth» means a token is required.

### Service

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/health` | public | Service health check |

### Users and sessions

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/users` | public | Register a user → 201 |
| POST | `/sessions` | public | Log in, issue a JWT → 200 |

Registration body (JSON):

```json
{
    "username": "string",
    "password": "string"
}
```

`username` — 3–50 characters, allowed `A-Z a-z 0-9 _ . -`; `password` — 8–72 bytes (the bcrypt
limit; non-ASCII characters take more than one byte each).

Response:

```json
{
    "id": 1,
    "username": "string",
    "is_active": true
}
```

Login body — **form-data** (`application/x-www-form-urlencoded`), fields `username` and
`password`. This is exactly the format the Swagger Authorize button uses. Response:

```json
{
    "access_token": "string",
    "token_type": "bearer"
}
```

Login takes the same time whether or not the username exists — an unknown username is still
verified against a dummy hash, so the response time does not leak which accounts are registered.

### Auto-reply settings

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/users/me/auto-reply-settings` | auth | Current settings |
| PUT | `/users/me/auto-reply-settings` | auth | Update settings |

Body (JSON):

```json
{
    "auto_reply_enabled": true,
    "auto_reply_text": "string",
    "auto_reply_delay_seconds": 0
}
```

`auto_reply_text` — up to 500 characters, `auto_reply_delay_seconds` — 0–86400.
If `auto_reply_enabled` is `true`, the text cannot be empty.

When auto-reply is on, every new comment on this user's post creates a deferred job. After
`auto_reply_delay_seconds` a background worker publishes a reply on behalf of the post author in
the form `"{commenter_username}, {auto_reply_text}"`. Jobs are stored in the database, so they
survive an application restart.

Two details worth knowing:

- A comment **blocked by moderation schedules no reply** — the author is not made to answer text
  the filter rejected.
- The delay is a floor, not an exact time. The worker wakes every
  `AUTO_REPLY_POLL_INTERVAL_SECONDS` and takes up to `AUTO_REPLY_BATCH_SIZE` jobs per cycle,
  locking them with `FOR UPDATE SKIP LOCKED` so that several application instances never deliver
  the same reply twice.

### Posts

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/posts` | public | List posts |
| POST | `/posts` | auth | Create a post → 201 |
| GET | `/posts/{post_id}` | public | Post by ID |
| PUT | `/posts/{post_id}` | auth, owner | Full update of a post |
| DELETE | `/posts/{post_id}` | auth, owner | Delete a post → 204 |

List parameters: `skip` (≥ 0, default 0), `limit` (1–100, default 10). Newest first.

Create and update body (JSON):

```json
{
    "title": "string",
    "content": "string"
}
```

`title` — 1–200 characters, `content` — 1–10000. The author is taken from the token and cannot be
substituted through the request body. Deleting a post cascades to its comments.

Response:

```json
{
    "id": 1,
    "title": "string",
    "content": "string",
    "owner_id": 1
}
```

### Comments

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/posts/{post_id}/comments` | public | Comments on a post |
| POST | `/posts/{post_id}/comments` | auth | Create a comment → 201 |
| GET | `/comments/{comment_id}` | public | Comment by ID |
| PUT | `/comments/{comment_id}` | auth, owner | Update a comment |
| DELETE | `/comments/{comment_id}` | auth, owner | Delete a comment → 204 |

List parameters: `skip` and `limit`, as for posts. Oldest first.

Create and update body (JSON):

```json
{
    "info": "string"
}
```

`info` — 1–2000 characters. The post is identified by the URL, not by the request body.

Response:

```json
{
    "id": 1,
    "info": "string",
    "post_id": 1,
    "owner_id": 1,
    "blocked_at": null,
    "created_at": "2026-08-02T12:30:00.123456Z"
}
```

### Moderation

Every comment is checked for profanity on creation and on every edit. A blocked comment is stored
in full, and `blocked_at` is set to the time it was blocked.

Blocked comments are not shown to other readers, but **the author always sees their own comment
along with `blocked_at`** — the block is not hidden from them. The author can edit the comment: if
the new text is clean, the block is lifted.

To anyone else a blocked comment is simply absent — it is skipped in listings, and requesting it
directly returns 404 `comment_not_found` rather than 403, so the block does not reveal that the
comment exists.

An auto-reply goes through the same moderation as an ordinary comment.

### Statistics

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/statistics/daily-comments` | auth | Daily comment breakdown |

Example:

```
GET /statistics/daily-comments?date_from=2026-01-01&date_to=2026-08-02
```

The `date_from` and `date_to` parameters are required, format `YYYY-MM-DD`. Both bounds are
inclusive. `date_from` cannot be later than `date_to`, and `date_to` cannot be in the future —
otherwise 422.

Statistics count **only comments on the posts of the user making the request**. Days without
comments are absent from the response. Response:

```json
[
    {"date": "2026-08-01", "total_comments": 12, "blocked_comments": 2},
    {"date": "2026-08-02", "total_comments": 5, "blocked_comments": 0}
]
```

## Layout

Application code lives in `app/`. Dependencies flow inward — a layer never imports from the one
outside it.

| Directory | Holds |
|---|---|
| `app/api/routes/` | Route handlers: resolve validated input, call one service method, serialize the result |
| `app/schemas/` | Pydantic models — request validation and response shaping |
| `app/services/` | All business logic, side effects and transaction boundaries |
| `app/repositories/` | Queries and find-or-fail lookups |
| `app/models/` | SQLAlchemy models: columns and relations |
| `app/core/` | Settings, engine and session, security, error handling, request limits |
| `app/workers/` | The auto-reply background worker, started from the application lifespan |
| `alembic/versions/` | Migrations — the only path by which the schema changes |
