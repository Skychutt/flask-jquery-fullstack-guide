# Flask Forge 全栈学习项目

在线学习站点：<https://skychutt.github.io/flask-jquery-fullstack-guide/>

本项目包含两部分：

1. 根目录的 `index.html` 是可直接双击打开的中文全栈学习站点，不需要启动服务器。
2. `demo/` 是配套的 Flask + SQLAlchemy + jQuery AJAX 可运行演示，用一条完整的任务 CRUD 链路展示课程中的工程结构。

## 学习站点

直接打开 `index.html`。站点包含：

- 27 个系统章节、151 个深度小节和 27 组章节自测
- Python Web 必备语法与面向对象、SOLID 和分层设计
- Python 面向对象深挖：对象创建、self、属性查找、property、MRO、super、多态、组合与依赖注入
- Python 进阶：装饰器、闭包、生成器、Protocol、上下文和并发模型
- HTTP、JSON、Flask、Jinja、应用工厂和 Blueprint
- REST API 规范、Schema、幂等、乐观锁、版本演进和 OpenAPI
- Flask WSGI、上下文、生命周期、中间件和常用扩展生态
- Flask 路由原理：URL Map、Rule、endpoint、转换器、404/405、Blueprint、钩子和 Response
- JavaScript 变量、类型、函数、对象、Promise、事件循环和浏览器存储
- jQuery DOM、事件委托、表单、AJAX 与 JSON API 联调
- 前后端对接全链路：jQuery → HTTP/JSON → Flask Route → Service → ORM/事务 → DOM 状态
- SQL、SQLAlchemy、复杂查询、执行计划、索引、锁、事务与迁移
- 登录认证、对象授权、CSRF、XSS、SQL 注入与上传安全
- pytest、调试、日志、缓存、后台任务和生产部署
- Git、分支协作、代码评审、CI/CD 和纵向切片工作流
- TaskFlow 毕业项目规格与逐项验收清单
- 冷暖色阅读模式、全文搜索、代码复制、章节折叠、练习测验和本地学习进度

## 运行配套演示

项目已经包含本地虚拟环境和初始化后的空数据库，可以直接：

```powershell
cd demo
.\.venv\Scripts\Activate.ps1
python run.py
```

如果在另一台电脑重新安装，请查看 `demo/README.md`。测试命令：

```powershell
cd demo
.\.venv\Scripts\python.exe -m pytest -q
```

学习建议：先学习前 8 章建立 Python、HTTP、JSON 与 API 基础，再边读 Flask、JavaScript、jQuery、数据库与安全章节边修改 demo，最后学习工程协作、性能与部署，并依据最终章从空目录独立完成毕业项目。
