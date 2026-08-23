from dataclasses import dataclass

from sqlalchemy import select

from ..extensions import db
from ..models import Task


class TaskNotFound(Exception):
    pass


class TaskValidationError(Exception):
    def __init__(self, fields: dict[str, str]):
        super().__init__("参数校验失败")
        self.fields = fields


@dataclass(frozen=True)
class TaskPage:
    items: list[Task]
    page: int
    pages: int
    total: int


def list_tasks(page: int = 1, per_page: int = 20, keyword: str = "") -> TaskPage:
    statement = select(Task)
    if keyword:
        statement = statement.where(Task.title.contains(keyword))
    statement = statement.order_by(Task.created_at.desc())
    result = db.paginate(statement, page=max(page, 1), per_page=min(per_page, 50))
    return TaskPage(result.items, result.page, result.pages, result.total)


def create_task(data: dict) -> Task:
    title = str(data.get("title", "")).strip()
    if not title:
        raise TaskValidationError({"title": "请输入任务标题"})
    if len(title) > 120:
        raise TaskValidationError({"title": "任务标题不能超过 120 个字符"})

    task = Task(title=title)
    db.session.add(task)
    db.session.commit()
    return task


def update_task(task_id: int, data: dict) -> Task:
    task = db.session.get(Task, task_id)
    if task is None:
        raise TaskNotFound(f"任务 {task_id} 不存在")

    try:
        if "title" in data:
            task.rename(str(data["title"]))
    except ValueError as exc:
        raise TaskValidationError({"title": str(exc)}) from exc

    if "completed" in data:
        if not isinstance(data["completed"], bool):
            raise TaskValidationError({"completed": "completed 必须是布尔值"})
        task.completed = data["completed"]

    db.session.commit()
    return task


def delete_task(task_id: int) -> None:
    task = db.session.get(Task, task_id)
    if task is None:
        raise TaskNotFound(f"任务 {task_id} 不存在")
    db.session.delete(task)
    db.session.commit()
