from flask import Blueprint, jsonify, request

from ..services import task_service

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.get("/tasks")
def task_list():
    page = request.args.get("page", 1, type=int)
    keyword = request.args.get("q", "", type=str).strip()
    result = task_service.list_tasks(page=page, keyword=keyword)
    return jsonify(
        data=[task.to_dict() for task in result.items],
        meta={
            "page": result.page,
            "pages": result.pages,
            "total": result.total,
        },
    )


@bp.post("/tasks")
def task_create():
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify(error={"code": "INVALID_JSON", "message": "请求体必须是 JSON 对象"}), 400
    task = task_service.create_task(data)
    return jsonify(data=task.to_dict()), 201


@bp.patch("/tasks/<int:task_id>")
def task_update(task_id: int):
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify(error={"code": "INVALID_JSON", "message": "请求体必须是 JSON 对象"}), 400
    task = task_service.update_task(task_id, data)
    return jsonify(data=task.to_dict())


@bp.delete("/tasks/<int:task_id>")
def task_delete(task_id: int):
    task_service.delete_task(task_id)
    return "", 204
