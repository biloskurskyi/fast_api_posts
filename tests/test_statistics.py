from datetime import UTC, date, datetime, time, timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from tests.factories import auth_headers, create_comment, create_post, create_user

TODAY = date.today()
YESTERDAY = TODAY - timedelta(days=1)
TOMORROW = TODAY + timedelta(days=1)


def at(day: date, hour: int = 12, minute: int = 0) -> datetime:
    return datetime.combine(day, time(hour, minute), tzinfo=UTC)


def test_the_breakdown_counts_total_and_blocked_comments_per_day(
    client: TestClient, db: Session
) -> None:
    author = create_user(db, "author")
    post = create_post(db, author)
    commenter = create_user(db, "commenter")
    create_comment(db, post, commenter, info="Clean one", created_at=at(YESTERDAY))
    create_comment(db, post, commenter, info="Clean two", created_at=at(YESTERDAY))
    create_comment(
        db, post, commenter, info="Blocked", blocked_at=at(YESTERDAY), created_at=at(YESTERDAY)
    )
    create_comment(db, post, commenter, info="Today", created_at=at(TODAY))

    response = client.get(
        "/statistics/daily-comments",
        params={"date_from": YESTERDAY.isoformat(), "date_to": TODAY.isoformat()},
        headers=auth_headers(author),
    )

    assert response.status_code == 200
    assert response.json() == [
        {"date": YESTERDAY.isoformat(), "total_comments": 3, "blocked_comments": 1},
        {"date": TODAY.isoformat(), "total_comments": 1, "blocked_comments": 0},
    ]


def test_another_users_posts_never_appear_in_the_callers_numbers(
    client: TestClient, db: Session
) -> None:
    caller = create_user(db, "caller")
    stranger = create_user(db, "stranger")
    commenter = create_user(db, "commenter")
    theirs = create_post(db, stranger, title="Theirs")
    create_comment(db, create_post(db, caller), commenter, info="Mine", created_at=at(TODAY))
    create_comment(db, theirs, commenter, info="Theirs", created_at=at(TODAY))

    response = client.get(
        "/statistics/daily-comments",
        params={"date_from": TODAY.isoformat(), "date_to": TODAY.isoformat()},
        headers=auth_headers(caller),
    )

    assert response.json() == [
        {"date": TODAY.isoformat(), "total_comments": 1, "blocked_comments": 0}
    ]


def test_a_comment_late_on_the_final_day_is_included(client: TestClient, db: Session) -> None:
    author = create_user(db, "author")
    post = create_post(db, author)
    late = at(YESTERDAY, hour=23, minute=59)
    create_comment(db, post, create_user(db, "commenter"), info="Late", created_at=late)

    response = client.get(
        "/statistics/daily-comments",
        params={"date_from": YESTERDAY.isoformat(), "date_to": YESTERDAY.isoformat()},
        headers=auth_headers(author),
    )

    assert response.json() == [
        {"date": YESTERDAY.isoformat(), "total_comments": 1, "blocked_comments": 0}
    ]


def test_a_comment_outside_the_range_is_excluded(client: TestClient, db: Session) -> None:
    author = create_user(db, "author")
    post = create_post(db, author)
    commenter = create_user(db, "commenter")
    create_comment(db, post, commenter, info="Earlier", created_at=at(TODAY - timedelta(days=3)))
    create_comment(db, post, commenter, info="In range", created_at=at(YESTERDAY))

    response = client.get(
        "/statistics/daily-comments",
        params={"date_from": YESTERDAY.isoformat(), "date_to": YESTERDAY.isoformat()},
        headers=auth_headers(author),
    )

    assert response.json() == [
        {"date": YESTERDAY.isoformat(), "total_comments": 1, "blocked_comments": 0}
    ]


def test_rows_come_back_in_date_order(client: TestClient, db: Session) -> None:
    author = create_user(db, "author")
    post = create_post(db, author)
    commenter = create_user(db, "commenter")
    days = [TODAY - timedelta(days=offset) for offset in (0, 3, 1, 2)]
    for day in days:
        create_comment(db, post, commenter, info=day.isoformat(), created_at=at(day))

    response = client.get(
        "/statistics/daily-comments",
        params={"date_from": (TODAY - timedelta(days=3)).isoformat(), "date_to": TODAY.isoformat()},
        headers=auth_headers(author),
    )

    assert [row["date"] for row in response.json()] == sorted(day.isoformat() for day in days)


def test_a_range_without_comments_is_an_empty_list(client: TestClient, db: Session) -> None:
    author = create_user(db, "author")
    create_post(db, author)

    response = client.get(
        "/statistics/daily-comments",
        params={"date_from": YESTERDAY.isoformat(), "date_to": TODAY.isoformat()},
        headers=auth_headers(author),
    )

    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.parametrize(
    "params",
    [
        {"date_from": TODAY.isoformat(), "date_to": YESTERDAY.isoformat()},
        {"date_from": TOMORROW.isoformat(), "date_to": TOMORROW.isoformat()},
        {"date_from": TODAY.isoformat(), "date_to": TOMORROW.isoformat()},
        {"date_from": TODAY.isoformat()},
        {"date_from": "not-a-date", "date_to": TODAY.isoformat()},
    ],
)
def test_invalid_ranges_are_rejected(
    client: TestClient, db: Session, params: dict[str, str]
) -> None:
    response = client.get(
        "/statistics/daily-comments", params=params, headers=auth_headers(create_user(db, "author"))
    )

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"


def test_the_breakdown_requires_authentication(client: TestClient) -> None:
    response = client.get(
        "/statistics/daily-comments",
        params={"date_from": TODAY.isoformat(), "date_to": TODAY.isoformat()},
    )

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "not_authenticated"
