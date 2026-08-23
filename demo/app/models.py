from datetime import datetime, timezone

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column

from .extensions import db


class Task(db.Model):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc), nullable=False
    )

    def rename(self, title: str) -> None:
        normalized = title.strip()
        if not normalized:
            raise ValueError("任务标题不能为空")
        if len(normalized) > 120:
            raise ValueError("任务标题不能超过 120 个字符")
        self.title = normalized

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "completed": self.completed,
            "created_at": self.created_at.isoformat(),
        }
