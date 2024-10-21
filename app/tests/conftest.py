import warnings
from datetime import datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app

DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
warnings.filterwarnings("ignore", category=DeprecationWarning)


@pytest.fixture(scope="module")
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="module")
def client(setup_database):
    app.dependency_overrides[get_db] = lambda: TestingSessionLocal()
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="module")
def user_token(client):
    user_data = {
        "username": "testuser",
        "password": "TestPassword123",
        "is_active": True,
        "is_superuser": False
    }
    client.post("/users/register", json=user_data)
    login_data = {
        "username": "testuser",
        "password": "TestPassword123"
    }
    response = client.post("/users/login", json=login_data)
    return response.json()["access_token"]


@pytest.fixture(scope="module")
def post_with_comments(client, user_token):
    headers = {"Authorization": f"Bearer {user_token}"}
    post_data = {
        "title": "Post with Comments",
        "content": "This post will have comments."
    }
    response = client.post("/posts/", json=post_data, headers=headers)
    return response.json()
