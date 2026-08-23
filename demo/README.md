# TaskFlow 演示项目

这是学习站点配套的最小完整纵向切片：Flask 应用工厂、Blueprint、Service、SQLAlchemy、JSON API、jQuery AJAX 和 pytest 测试都在其中。

## 运行

```powershell
cd demo
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
flask --app run.py init-db
python run.py
```

浏览器访问终端显示的本地地址。运行测试：

```powershell
pytest -q
```

这个演示故意只实现“任务 CRUD”纵向切片。认证、权限、CSRF、迁移和生产部署请按照主学习站第 14、16、18 章逐步加入，而不是把示例代码直接当作生产成品。
