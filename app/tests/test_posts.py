import pytest


def test_create_post_success(client, user_token):
    headers = {"Authorization": f"Bearer {user_token}"}
    post_data = {
        "title": "Test Post",
        "content": "This is a test post content."
    }
    response = client.post("/posts/", json=post_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == post_data["title"]
    assert data["content"] == post_data["content"]
    assert "id" in data


def test_get_post_success(client, user_token):
    headers = {"Authorization": f"Bearer {user_token}"}
    post_data = {
        "title": "Test Post",
        "content": "This is a test post content."
    }
    create_response = client.post("/posts/", json=post_data, headers=headers)
    post_id = create_response.json()["id"]

    response = client.get(f"/posts/{post_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == post_id
    assert data["title"] == post_data["title"]


def test_get_all_posts(client, user_token):
    headers = {"Authorization": f"Bearer {user_token}"}
    response = client.get("/posts/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_update_post_success(client, user_token):
    headers = {"Authorization": f"Bearer {user_token}"}
    post_data = {
        "title": "Test Post",
        "content": "This is a test post content."
    }
    create_response = client.post("/posts/", json=post_data, headers=headers)
    post_id = create_response.json()["id"]

    updated_data = {
        "title": "Updated Post Title",
        "content": "Updated content for the test post."
    }
    update_response = client.put(f"/posts/{post_id}", json=updated_data, headers=headers)
    assert update_response.status_code == 200
    assert update_response.json()["title"] == updated_data["title"]


def test_delete_post_success(client, user_token):
    headers = {"Authorization": f"Bearer {user_token}"}
    post_data = {
        "title": "Test Post to Delete",
        "content": "This post will be deleted."
    }
    create_response = client.post("/posts/", json=post_data, headers=headers)
    post_id = create_response.json()["id"]

    delete_response = client.delete(f"/posts/{post_id}", headers=headers)
    assert delete_response.status_code == 204

    # Attempt to retrieve the deleted post
    response = client.get(f"/posts/{post_id}")
    assert response.status_code == 404


def test_delete_post_forbidden(client, user_token):
    headers = {"Authorization": f"Bearer {user_token}"}
    post_data = {
        "title": "Another Test Post",
        "content": "This post is owned by the test user."
    }
    create_response = client.post("/posts/", json=post_data, headers=headers)
    post_id = create_response.json()["id"]

    # Create another user and try to delete the post
    another_user_data = {
        "username": "anotheruser",
        "password": "AnotherPassword123",
        "is_active": True,
        "is_superuser": False
    }
    client.post("/users/register", json=another_user_data)
    another_login_data = {
        "username": "anotheruser",
        "password": "AnotherPassword123"
    }
    another_response = client.post("/users/login", json=another_login_data)
    another_user_token = another_response.json()["access_token"]

    another_headers = {"Authorization": f"Bearer {another_user_token}"}
    delete_response = client.delete(f"/posts/{post_id}", headers=another_headers)
    assert delete_response.status_code == 403
    assert delete_response.json() == {"detail": "You do not have a permission to delete this post"}
