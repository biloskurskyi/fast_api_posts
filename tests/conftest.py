from collections.abc import Generator
from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine, make_url
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.core.database import get_db
from app.main import app

ALEMBIC_CONFIG_PATH = Path(__file__).resolve().parents[1] / "alembic.ini"


@pytest.fixture(scope="session")
def database_url() -> Generator[str, None, None]:
    url = make_url(settings.database_url)
    test_url = url.set(database=f"{url.database}_test")
    admin_engine = create_engine(url.set(database="postgres"), isolation_level="AUTOCOMMIT")

    with admin_engine.connect() as connection:
        connection.execute(text(f'DROP DATABASE IF EXISTS "{test_url.database}"'))
        connection.execute(text(f'CREATE DATABASE "{test_url.database}"'))

    yield test_url.render_as_string(hide_password=False)

    with admin_engine.connect() as connection:
        connection.execute(text(f'DROP DATABASE IF EXISTS "{test_url.database}"'))
    admin_engine.dispose()


@pytest.fixture(scope="session")
def engine(database_url: str) -> Generator[Engine, None, None]:
    alembic_config = Config(str(ALEMBIC_CONFIG_PATH))
    alembic_config.set_main_option("sqlalchemy.url", database_url)
    command.upgrade(alembic_config, "head")

    engine = create_engine(database_url)
    yield engine
    engine.dispose()


@pytest.fixture
def db(engine: Engine) -> Generator[Session, None, None]:
    connection = engine.connect()
    transaction = connection.begin()
    session = sessionmaker(bind=connection, join_transaction_mode="create_savepoint")()

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db: Session) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        yield db

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
