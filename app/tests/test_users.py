import pytest


def test_register_user_success(client, setup_database):
    user_data = {
        "username": "testuser",
        "password": "TestPassword123",
        "is_active": True,
        "is_superuser": False
    }

    response = client.post("/users/register", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == user_data["username"]
    assert "id" in data
    assert data["is_active"] == user_data["is_active"]
    assert data["is_superuser"] == user_data["is_superuser"]


def test_register_user_duplicate_username(client, setup_database):
    user_data = {
        "username": "testuser",
        "password": "AnotherPassword123",
        "is_active": True,
        "is_superuser": False
    }

    response = client.post("/users/register", json=user_data)
    assert response.status_code == 400
    assert response.json() == {"detail": "User with this username already registered"}


# /login

def test_login_success(client, setup_database):
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
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_login_fail(client, setup_database):
    user_data = {
        "username": "testuser",
        "password": "TestPassword123",
        "is_active": True,
        "is_superuser": False
    }

    client.post("/users/register", json=user_data)

    login_data = {
        "username": "testuser",
        "password": "WrongPassword"
    }

    response = client.post("/users/login", json=login_data)
    assert response.status_code == 400
    assert response.json() == {"detail": "Incorrect username or password"}
