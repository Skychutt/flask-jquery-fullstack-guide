from flask import Flask, jsonify

from config import Config

from .extensions import db
from .services.task_service import TaskNotFound, TaskValidationError


def create_app(config_object=Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)

    from .blueprints.api import bp as api_bp
    from .blueprints.main import bp as main_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)
    register_error_handlers(app)
    register_commands(app)
    return app


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(TaskValidationError)
    def handle_validation_error(error):
        return jsonify(
            error={
                "code": "VALIDATION_ERROR",
                "message": str(error),
                "fields": error.fields,
            }
        ), 422

    @app.errorhandler(TaskNotFound)
    def handle_not_found(error):
        return jsonify(error={"code": "TASK_NOT_FOUND", "message": str(error)}), 404

    @app.errorhandler(404)
    def handle_http_not_found(_error):
        return jsonify(error={"code": "NOT_FOUND", "message": "请求的资源不存在"}), 404


def register_commands(app: Flask) -> None:
    @app.cli.command("init-db")
    def init_db_command():
        """创建演示数据库表。"""
        db.create_all()
        print("数据库已初始化。")
