from app import create_app
from app.extensions import db
from config import TestingConfig


def make_client():
    app = create_app(TestingConfig)
    context = app.app_context()
    context.push()
    db.create_all()
    return app, app.test_client(), context


def test_task_crud():
    app, client, context = make_client()
    try:
        created = client.post("/api/tasks", json={"title": "学习 JSON"})
        assert created.status_code == 201
        task_id = created.get_json()["data"]["id"]

        listed = client.get("/api/tasks")
        assert listed.status_code == 200
        assert listed.get_json()["meta"]["total"] == 1

        updated = client.patch(f"/api/tasks/{task_id}", json={"completed": True})
        assert updated.get_json()["data"]["completed"] is True

        deleted = client.delete(f"/api/tasks/{task_id}")
        assert deleted.status_code == 204
    finally:
        db.drop_all()
        context.pop()


def test_blank_title_returns_field_error():
    app, client, context = make_client()
    try:
        response = client.post("/api/tasks", json={"title": "  "})
        assert response.status_code == 422
        assert "title" in response.get_json()["error"]["fields"]
    finally:
        db.drop_all()
        context.pop()
