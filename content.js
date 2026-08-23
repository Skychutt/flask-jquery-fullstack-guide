(function () {
  "use strict";

  const esc = value => String(value).replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
  const B = (language, source) => `<div class="code-block"><div class="code-label"><span>${language}</span><button class="copy-code">复制代码</button></div><pre><code>${esc(source.trim())}</code></pre></div>`;
  const N = text => `<div class="note">${text}</div>`;
  const W = text => `<div class="warning">${text}</div>`;
  const P = text => `<div class="practice">动手练习：${text}</div>`;

  const course = [
    {
      title: "开始之前：全栈地图与开发环境",
      subtitle: "先看清浏览器、服务器、数据库如何协作，再开始写代码",
      duration: "45 分钟",
      keywords: "路线 环境 Python pip venv IDE 浏览器 客户端 服务器",
      intro: "本章建立全局心智模型，并准备可重复的 Python 开发环境。学完后你应该能解释一次网页请求经过了哪些组件，能创建虚拟环境、安装依赖、启动 Flask，并知道遇到环境问题从哪里排查。",
      sections: [
        {
          title: "1.1 一个全栈 Web 应用究竟由什么组成",
          content: `<p><strong>前端</strong>运行在浏览器中，负责结构（HTML）、外观（CSS）与交互（JavaScript/jQuery）；<strong>后端</strong>运行在服务器上，负责业务规则、身份认证、数据读写和 API；<strong>数据库</strong>持久保存用户、订单等记录。HTTP 是浏览器与后端之间的通信协议，JSON 常作为传输数据的格式。</p>
          <p>典型过程是：用户点击按钮 → jQuery 收集表单 → AJAX 发出 HTTP 请求 → Flask 路由匹配 → 服务层处理业务 → SQLAlchemy 访问数据库 → Flask 返回 JSON → jQuery 更新局部 DOM。任何一个环节都可能失败，所以开发者需要能沿着这条链路逐段定位。</p>
          <table class="data-table"><thead><tr><th>层</th><th>主要职责</th><th>本课程技术</th><th>常见错误</th></tr></thead><tbody><tr><td>浏览器表现层</td><td>展示、输入、交互</td><td>HTML/CSS/jQuery</td><td>选择器失效、事件重复</td></tr><tr><td>接口层</td><td>接收请求、返回响应</td><td>Flask Blueprint</td><td>状态码或 Content-Type 错</td></tr><tr><td>业务层</td><td>规则、事务、权限</td><td>Service + Python OOP</td><td>逻辑散落在路由</td></tr><tr><td>数据层</td><td>持久化与查询</td><td>SQLAlchemy</td><td>N+1、事务遗漏</td></tr></tbody></table>
          ${N("学习全栈不是把三门语法拼在一起，而是掌握层与层之间的契约：输入是什么、输出是什么、错误怎么表达、状态由谁保存。")}`
        },
        {
          title: "1.2 安装 Python、虚拟环境与依赖管理",
          content: `<p>推荐使用 Python 3.11 或更新的稳定版本。先用 <code>python --version</code> 确认命令指向正确解释器。每个项目创建独立虚拟环境，避免不同项目的 Flask、SQLAlchemy 版本互相污染。在 Windows PowerShell 中可按下面操作：</p>
          ${B("powershell", `python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
python -m pip install --upgrade pip
pip install Flask Flask-SQLAlchemy Flask-Migrate python-dotenv
pip freeze > requirements.txt`)}
          <p><code>python -m pip</code> 比直接写 <code>pip</code> 更可靠，因为它明确使用当前 Python 对应的 pip。<code>requirements.txt</code> 锁定可复现依赖；团队成员运行 <code>pip install -r requirements.txt</code> 即可获得一致环境。不要把 <code>.venv</code>、密钥文件或运行时数据库提交到 Git。</p>
          ${W("如果 PowerShell 阻止激活脚本，可在当前用户范围调整执行策略，或不激活环境，直接使用 .venv\\Scripts\\python.exe 运行命令。不要为了省事关闭系统级安全策略。")}`
        },
        {
          title: "1.3 第一个可验证的 Flask 请求",
          content: `<p>最小应用帮助你验证“解释器—依赖—端口—浏览器”整条链路。<code>Flask(__name__)</code> 创建应用实例；装饰器把 URL 和函数建立映射；视图函数的返回值被 Flask 转成 HTTP 响应。</p>
          ${B("python · app.py", `from flask import Flask, jsonify

app = Flask(__name__)

@app.get("/")
def index():
    return "<h1>Hello Flask</h1>"

@app.get("/api/health")
def health():
    return jsonify(status="ok"), 200

if __name__ == "__main__":
    app.run(debug=True)`)}
          <p>运行 <code>python app.py</code>，访问终端显示的地址。开发模式会自动重载并显示详细错误，<strong>绝不能用于生产环境</strong>。如果端口被占用，换端口；如果导入失败，确认终端已进入正确虚拟环境；如果浏览器连不上，确认进程仍在运行且 URL/端口一致。</p>
          ${P("添加 /api/me 路由，返回 name、skills 数组和 learning 布尔值，随后在浏览器开发者工具 Network 面板查看响应头与响应体。")}`
        },
        {
          title: "1.4 如何使用这套手册",
          content: `<p>推荐四轮学习法：第一轮按顺序阅读并手敲短代码；第二轮运行示例项目并用开发者工具观察网络请求；第三轮不看答案实现一个同类需求；第四轮以本手册为索引查漏补缺。遇到概念先问“它解决什么问题”，再记 API。</p>
          <ul><li><strong>会读：</strong>能解释代码为什么工作。</li><li><strong>会改：</strong>能改变字段、规则和界面而不破坏其他部分。</li><li><strong>会写：</strong>面对空目录能自行拆层与实现。</li><li><strong>会查：</strong>知道错误属于浏览器、网络、路由、业务还是数据库。</li></ul>
          ${N("每章末尾的完成按钮只保存在当前浏览器的 localStorage 中，不会上传。真正的完成标准是能独立做出练习，而不是看完页面。")}`
        }
      ],
      quiz: {question: "一次 AJAX 请求中，业务规则最适合放在哪一层？", options: ["CSS 样式层", "Flask 路由函数的每个分支里", "独立的业务服务层", "jQuery 动画回调里"], answer: 2}
    },
    {
      title: "Python Web 必备语法",
      subtitle: "数据类型、控制流、函数、模块、异常与上下文管理器",
      duration: "2.5 小时",
      keywords: "Python list dict tuple set function lambda comprehension exception module context manager typing",
      intro: "Flask 很轻，因此大量能力直接来自 Python。本章只讲 Web 开发高频且容易踩坑的语法，并把每个语法放入真实后端场景。",
      sections: [
        {
          title: "2.1 数据类型、可变性与引用",
          content: `<p>常用内置类型包括 <code>int</code>、<code>float</code>、<code>bool</code>、<code>str</code>、<code>None</code>，容器包括 <code>list</code>、<code>tuple</code>、<code>dict</code>、<code>set</code>。列表和字典可变；字符串、数字和元组不可变。变量保存的是对象引用，不是“盒子里的值”，这会影响参数传递和默认值。</p>
          ${B("python", `user = {"id": 1, "name": "Lin", "roles": ["editor"]}
name = user.get("name", "匿名")       # 缺失时给默认值
role_names = ",".join(user["roles"])

# 浅复制只复制最外层；roles 仍指向同一个列表
copy_user = user.copy()
copy_user["roles"].append("admin")
assert "admin" in user["roles"]

# 需要完全独立时使用深复制，但应先审视数据设计
from copy import deepcopy
safe_copy = deepcopy(user)`)}
          <p>判断空集合直接写 <code>if not items</code>；判断是否为 None 写 <code>is None</code> 而不是 <code>== None</code>；金额不要用二进制浮点数，使用 <code>Decimal</code>；时间使用带时区的 <code>datetime</code>。</p>
          ${W("永远不要把可变对象作为函数默认值，例如 def add(item, bucket=[])。默认对象只创建一次，会跨调用共享。用 None 作为哨兵并在函数内创建。")}`
        },
        {
          title: "2.2 控制流、推导式与迭代",
          content: `<p><code>if/elif/else</code> 表达分支，<code>for</code> 遍历可迭代对象，<code>while</code> 适合条件驱动循环。<code>enumerate</code> 提供索引，<code>zip</code> 并行遍历，列表/字典推导式适合简单映射和筛选；逻辑复杂时使用普通循环，优先可读性。</p>
          ${B("python", `rows = [
    {"id": 1, "name": "A", "active": True},
    {"id": 2, "name": "B", "active": False},
]

active_names = [row["name"] for row in rows if row["active"]]
users_by_id = {row["id"]: row for row in rows}

for position, row in enumerate(rows, start=1):
    print(position, row["name"])

# 生成器表达式按需产生值，适合大数据流
total = sum(row["id"] for row in rows)`)}
          <p><code>any()</code> 用于“至少一个成立”，<code>all()</code> 用于“全部成立”。后端权限校验、表单验证中非常常见。避免在循环中重复访问数据库；先批量查出数据，再在内存中组合，或让 SQL 完成聚合。</p>`
        },
        {
          title: "2.3 函数、参数与类型标注",
          content: `<p>函数是拆分业务逻辑的第一工具。一个好函数职责单一、命名体现意图、输入输出明确、尽量不依赖隐藏全局状态。位置参数适合稳定且直观的输入，关键字参数增强调用可读性；<code>*args</code> 收集位置参数，<code>**kwargs</code> 收集关键字参数，但业务 API 不应滥用。</p>
          ${B("python", `from typing import Any

def build_response(
    data: Any = None,
    *,
    message: str = "ok",
    code: int = 0,
) -> dict[str, Any]:
    """星号后的参数必须按关键字传递。"""
    return {"code": code, "message": message, "data": data}

payload = build_response(
    [{"id": 1}],
    message="users loaded",
)

def add_tag(tag: str, tags: list[str] | None = None) -> list[str]:
    result = [] if tags is None else list(tags)
    result.append(tag)
    return result`)}
          <p>类型标注不会在运行时自动验证，但能让 IDE、mypy 等工具提前发现错误，并且是极好的文档。纯函数相同输入总产生相同输出且没有副作用，最容易测试；数据库写入、发邮件等副作用应集中在边界层。</p>`
        },
        {
          title: "2.4 模块、包、导入与配置",
          content: `<p>一个 <code>.py</code> 文件是模块，含 <code>__init__.py</code> 的目录通常作为包。使用绝对导入表达清晰边界，例如 <code>from app.services.user_service import create_user</code>。循环导入通常说明模块职责不清，Flask 中也可通过应用工厂、扩展延迟绑定解决。</p>
          ${B("text · 推荐结构", `project/
├─ app/
│  ├─ __init__.py          # create_app
│  ├─ extensions.py        # db、migrate 等未绑定实例
│  ├─ models/
│  ├─ blueprints/
│  └─ services/
├─ tests/
├─ config.py
├─ requirements.txt
└─ run.py`)}
          <p><code>if __name__ == "__main__"</code> 只在文件被直接运行时成立，被导入时不执行。配置分为代码内非秘密默认值与环境变量中的部署差异/密钥。不要在源码里硬编码数据库密码或 SECRET_KEY。</p>`
        },
        {
          title: "2.5 异常、资源清理与调试思维",
          content: `<p>异常是错误从深层代码向调用者传播的机制。只捕获你能处理的具体异常；保留原始上下文；不要用裸 <code>except:</code> 吞掉编程错误。<code>else</code> 在无异常时执行，<code>finally</code> 无论如何执行。上下文管理器 <code>with</code> 确保文件、锁、连接被释放。</p>
          ${B("python", `class ValidationError(Exception):
    pass

def parse_age(raw: str) -> int:
    try:
        age = int(raw)
    except (TypeError, ValueError) as exc:
        raise ValidationError("年龄必须是整数") from exc
    if not 0 <= age <= 150:
        raise ValidationError("年龄超出有效范围")
    return age

try:
    age = parse_age("abc")
except ValidationError as exc:
    print(exc)

with open("settings.json", encoding="utf-8") as file:
    content = file.read()`)}
          <p>排错时读完整 traceback：最后一行是异常类型与消息，向上找第一个属于自己项目的文件行。先构造最小复现，再检查输入、类型、边界条件和外部状态。日志记录上下文，但不要输出密码、Token、Cookie 等秘密。</p>
          ${P("写 parse_page(raw) 函数：None 或空字符串返回 1；非整数抛 ValidationError；小于 1 返回 1；大于 100 返回 100，并为五种输入写断言。")}`
        }
      ],
      quiz: {question: "为什么不应使用列表作为函数参数的默认值？", options: ["列表不能传入函数", "默认列表会在多次调用之间共享", "列表无法序列化", "Flask 不支持列表"], answer: 1}
    },
    {
      title: "Python 面向对象：从类到协作对象",
      subtitle: "类、实例、封装、继承、多态、组合与特殊方法",
      duration: "3 小时",
      keywords: "OOP class object self init property inheritance polymorphism composition dataclass abstract",
      intro: "面向对象不是把函数塞进 class，而是把状态和操作这些状态的规则放在一起，并通过稳定接口让对象协作。本章将直接连接到 Flask 的模型、服务、策略与依赖设计。",
      sections: [
        {
          title: "3.1 类、实例、属性与方法",
          content: `<p><strong>类</strong>是对象的类型与行为定义，<strong>实例</strong>是运行时具体对象。<code>self</code> 指向当前实例；<code>__init__</code> 初始化已创建的对象。实例属性属于每个对象，类属性由类共享。方法第一个参数写 self 是约定且最清晰。</p>
          ${B("python", `class User:
    species = "human"                 # 类属性

    def __init__(self, username: str, email: str) -> None:
        self.username = username       # 实例属性
        self.email = email
        self._active = True            # 单下划线表示内部使用约定

    def deactivate(self) -> None:
        self._active = False

    def display_name(self) -> str:
        return self.username or self.email.split("@")[0]

alice = User("alice", "alice@example.com")
alice.deactivate()`)}
          <p>把“修改状态的规则”放进对象，而不是让任意调用方直接改字段。例如订单不能从 shipped 回到 pending，应提供 <code>order.ship()</code> 并在方法内验证状态转换。这样不变量集中在一处。</p>`
        },
        {
          title: "3.2 封装、property、类方法与静态方法",
          content: `<p>Python 没有强制 private，双下划线会名称改写但不是安全边界。真正的封装是调用者只依赖公开接口。<code>@property</code> 让计算或校验后的属性以字段形式访问；<code>@classmethod</code> 常做替代构造器；<code>@staticmethod</code> 是与类概念相关但无需实例/类状态的函数。</p>
          ${B("python", `from datetime import datetime

class Product:
    def __init__(self, name: str, price_cents: int) -> None:
        self.name = name
        self.price_cents = price_cents

    @property
    def price_yuan(self) -> float:
        return self.price_cents / 100

    @classmethod
    def from_dict(cls, data: dict) -> "Product":
        return cls(data["name"], int(data["price_cents"]))

    @staticmethod
    def is_valid_sku(value: str) -> bool:
        return len(value) == 8 and value.isalnum()`)}
          <p>property 中避免隐蔽的数据库查询或昂贵计算，否则一个看似普通的 <code>user.orders</code> 可能触发大量 I/O。对外部输入的构造建议使用单独 DTO/Schema 验证，而不是让模型接受任意字典。</p>`
        },
        {
          title: "3.3 继承、多态与抽象接口",
          content: `<p>继承表达稳定的“is-a”关系，多态让调用方只依赖共同接口。抽象基类可以声明契约，但 Python 也支持鸭子类型：只要对象提供所需方法即可。继承层次不要过深；Web 业务通常组合比继承更灵活。</p>
          ${B("python", `from abc import ABC, abstractmethod

class Notifier(ABC):
    @abstractmethod
    def send(self, recipient: str, message: str) -> None:
        raise NotImplementedError

class EmailNotifier(Notifier):
    def send(self, recipient: str, message: str) -> None:
        print(f"Email to {recipient}: {message}")

class FakeNotifier(Notifier):
    def __init__(self) -> None:
        self.messages = []

    def send(self, recipient: str, message: str) -> None:
        self.messages.append((recipient, message))

def welcome_user(email: str, notifier: Notifier) -> None:
    notifier.send(email, "欢迎加入")`)}
          <p>生产环境传入 EmailNotifier，测试传入 FakeNotifier，这就是<strong>依赖倒置</strong>的直接收益。调用方不关心通知通过邮件、短信还是日志发送。</p>`
        },
        {
          title: "3.4 优先组合：把变化的能力装配起来",
          content: `<p>组合表达“has-a”：订单服务拥有仓储与支付网关。相比继承，组合能在运行时替换部件，测试也更容易。构造器注入把依赖显式列出来，避免函数内部偷偷创建难以替换的全局对象。</p>
          ${B("python", `class OrderService:
    def __init__(self, repository, payment_gateway, notifier):
        self.repository = repository
        self.payment_gateway = payment_gateway
        self.notifier = notifier

    def pay(self, order_id: int) -> None:
        order = self.repository.get_or_fail(order_id)
        order.ensure_payable()
        receipt = self.payment_gateway.charge(order.total_cents)
        order.mark_paid(receipt.id)
        self.repository.save(order)
        self.notifier.send(order.user_email, "支付成功")`)}
          ${N("模型对象维护自身不变量；服务对象编排多个模型和外部依赖；仓储对象隐藏数据访问；路由只把 HTTP 输入转换为服务调用，再把结果转换为 HTTP 输出。")}`
        },
        {
          title: "3.5 dataclass、特殊方法与对象表示",
          content: `<p><code>@dataclass</code> 自动生成初始化、比较与展示方法，适合值对象、命令、DTO，不等同于 ORM 模型。<code>__repr__</code> 为开发者提供明确表示，<code>__eq__</code> 定义相等，<code>__hash__</code> 决定能否作为集合元素。不要在 repr 中泄露密码哈希或 Token。</p>
          ${B("python", `from dataclasses import dataclass
from decimal import Decimal

@dataclass(frozen=True)
class Money:
    amount: Decimal
    currency: str = "CNY"

    def __post_init__(self) -> None:
        if self.amount < 0:
            raise ValueError("金额不能为负")

    def __add__(self, other: "Money") -> "Money":
        if self.currency != other.currency:
            raise ValueError("币种不同，不能相加")
        return Money(self.amount + other.amount, self.currency)`)}
          ${P("设计 Cart 类：内部维护 CartItem 列表；提供 add、remove、total_cents；数量必须大于 0；调用方不能绕过规则直接修改内部列表。")}`
        }
      ],
      quiz: {question: "测试时希望把真实邮件发送器换成假的记录器，最适合的设计是？", options: ["在函数中硬编码创建发送器", "使用全局变量", "通过构造器注入统一接口的对象", "让所有类继承 Flask"], answer: 2}
    },
    {
      title: "OOP 工程化：SOLID、分层与设计模式",
      subtitle: "把面向对象用于可维护的 Flask 业务，而不是制造复杂度",
      duration: "2 小时",
      keywords: "SOLID repository service DTO factory strategy dependency injection design pattern",
      intro: "本章把 OOP 转成工程决策：何时拆类、层之间如何依赖、常用模式解决什么问题，以及怎样避免过度设计。",
      sections: [
        {
          title: "4.1 SOLID 的实用解释",
          content: `<ul><li><strong>S 单一职责：</strong>类只有一个主要变化原因。路由不同时负责校验、SQL、发邮件和拼 HTML。</li><li><strong>O 开闭原则：</strong>增加新策略时扩展实现，不改稳定编排流程。</li><li><strong>L 里氏替换：</strong>子类型必须能在父类型出现处正确工作，不能偷偷收紧输入或破坏承诺。</li><li><strong>I 接口隔离：</strong>依赖方只看自己需要的小接口，不被迫实现巨型 Service。</li><li><strong>D 依赖倒置：</strong>高层业务依赖抽象契约，不直接依赖第三方支付 SDK 的细节。</li></ul>
          <p>SOLID 是发现耦合的工具，不是要求每个函数一个类。若只有一个简单实现且不会替换，直接函数通常更好。先从清晰模块与测试开始，出现真实变化方向后再抽象。</p>`
        },
        {
          title: "4.2 Flask 中的分层边界",
          content: `<table class="data-table"><thead><tr><th>组件</th><th>允许知道</th><th>不应承担</th></tr></thead><tbody><tr><td>Route / Controller</td><td>HTTP、Schema、Service</td><td>复杂业务与手写 SQL</td></tr><tr><td>Schema / DTO</td><td>字段、格式、验证规则</td><td>数据库提交、发邮件</td></tr><tr><td>Service</td><td>业务流程、Repository 接口</td><td>request、HTML、状态码</td></tr><tr><td>Repository</td><td>ORM、查询、持久化</td><td>HTTP 与展示逻辑</td></tr><tr><td>Model / Entity</td><td>自身状态与不变量</td><td>浏览器请求细节</td></tr></tbody></table>
          ${B("python · 路由保持薄", `@bp.post("/users")
def create_user_route():
    command = CreateUserCommand.from_json(request.get_json())
    user = current_app.user_service.create(command)
    return jsonify(UserDTO.from_model(user).to_dict()), 201`)}
          <p>服务层不导入 <code>request</code> 或 <code>jsonify</code>，因此可以被 CLI、定时任务、测试或另一种 Web 框架复用。对于小项目，可以先用 blueprints + services + models 三层，Repository 在查询复杂或需要替换数据源时再引入。</p>`
        },
        {
          title: "4.3 常用设计模式及其真实场景",
          content: `<p><strong>Factory</strong>：应用工厂根据配置创建 Flask app；<strong>Strategy</strong>：折扣、登录、文件存储策略可替换；<strong>Adapter</strong>：把第三方 SDK 转成内部统一接口；<strong>Repository</strong>：隔离持久化；<strong>Decorator</strong>：登录/权限校验；<strong>Observer/Event</strong>：订单完成后通知多个订阅者。</p>
          ${B("python · 策略模式", `class DiscountStrategy:
    def discount(self, subtotal: int) -> int:
        return 0

class VipDiscount(DiscountStrategy):
    def discount(self, subtotal: int) -> int:
        return min(int(subtotal * 0.1), 5000)

class PricingService:
    def __init__(self, strategy: DiscountStrategy):
        self.strategy = strategy

    def total(self, subtotal: int) -> int:
        return subtotal - self.strategy.discount(subtotal)`)}
          ${W("模式名称不是目标。复制粘贴比抽象更容易逆转；当你能指出重复变化、测试困难或外部耦合时，模式才有价值。")}`
        },
        {
          title: "4.4 领域异常与错误边界",
          content: `<p>业务层抛出与 HTTP 无关的异常，例如 <code>UserNotFound</code>、<code>EmailAlreadyExists</code>、<code>PermissionDenied</code>。接口层统一把它们映射为 404、409、403 等响应。这样错误语义稳定且避免每条路由复制 try/except。</p>
          ${B("python", `class DomainError(Exception):
    status_code = 400
    error_code = "DOMAIN_ERROR"

class EmailAlreadyExists(DomainError):
    status_code = 409
    error_code = "EMAIL_EXISTS"

@app.errorhandler(DomainError)
def handle_domain_error(error):
    payload = {
        "error": {
            "code": error.error_code,
            "message": str(error),
        }
    }
    return jsonify(payload), error.status_code`)}
          <p>异常用于异常路径，不用来代替普通分支。错误响应要让前端能程序化识别，不能只返回变化的中文句子；生产环境不要把 traceback、SQL 或服务器路径返回给客户端。</p>`
        }
      ],
      quiz: {question: "业务服务层为什么不应直接使用 Flask 的 request 对象？", options: ["request 速度慢", "会让业务与 HTTP 环境耦合，难复用和测试", "request 不能读取 JSON", "Flask 禁止在类里导入"], answer: 1}
    },
    {
      title: "HTTP、浏览器与 Web 安全基础",
      subtitle: "方法、URL、请求响应、状态码、Header、Cookie、同源与 CORS",
      duration: "2.5 小时",
      keywords: "HTTP URL GET POST PUT PATCH DELETE header cookie session status code CORS same origin HTTPS",
      intro: "Flask 只是 HTTP 服务器应用框架。理解协议后，路由、表单、AJAX、会话和安全问题都会变得有因可循。",
      sections: [
        {
          title: "5.1 URL 与一次 HTTP 报文",
          content: `<p>URL 由协议、主机、端口、路径、查询字符串和片段组成。例如 <code>https://api.example.com:443/users/42?fields=name#top</code>。片段不会发送到服务器；查询参数适合筛选、排序、分页，不应承载密码。</p>
          ${B("http", `POST /api/users?invite=true HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>

{"name":"Lin","email":"lin@example.com"}

HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/users/42

{"data":{"id":42,"name":"Lin"}}`)}
          <p>请求包含起始行、请求头、空行、可选请求体；响应包含状态行、响应头、空行和可选响应体。<code>Content-Type</code> 描述发送内容，<code>Accept</code> 描述期望响应格式，二者不要混淆。</p>`
        },
        {
          title: "5.2 HTTP 方法、幂等性与 REST 资源",
          content: `<table class="data-table"><thead><tr><th>方法</th><th>语义</th><th>幂等</th><th>典型路由</th></tr></thead><tbody><tr><td>GET</td><td>读取，不改变业务状态</td><td>是</td><td>GET /users/42</td></tr><tr><td>POST</td><td>创建资源或触发命令</td><td>通常否</td><td>POST /users</td></tr><tr><td>PUT</td><td>整体替换指定资源</td><td>是</td><td>PUT /users/42</td></tr><tr><td>PATCH</td><td>部分更新</td><td>按设计</td><td>PATCH /users/42</td></tr><tr><td>DELETE</td><td>删除</td><td>是</td><td>DELETE /users/42</td></tr></tbody></table>
          <p>幂等表示相同请求重复执行后的服务器状态与执行一次相同，不表示响应一定相同。GET 不应删除数据，因为浏览器预取、爬虫或缓存可能自动访问。REST 路径以名词资源为中心，用方法表达动作；复杂业务命令可用 <code>POST /orders/42/cancel</code>。</p>`
        },
        {
          title: "5.3 状态码与错误语义",
          content: `<ul><li><strong>2xx：</strong>200 成功；201 已创建；204 成功但无响应体。</li><li><strong>3xx：</strong>301/308 永久重定向；302/303 临时跳转；304 使用缓存。</li><li><strong>4xx：</strong>400 格式/参数错误；401 未认证；403 已认证但无权；404 不存在；409 状态冲突；422 语义校验失败；429 频率过高。</li><li><strong>5xx：</strong>服务器未正确处理有效请求，500 是通用错误，502/503/504 常见于代理和上游服务。</li></ul>
          <p>不要所有情况都返回 200 再在 JSON 中写失败，浏览器、监控、缓存和通用客户端都依赖状态码。也不要把用户输入错误返回 500。API 错误应包含稳定错误码、用户可读消息、可选字段错误和请求追踪 ID。</p>`
        },
        {
          title: "5.4 Cookie、Session、Token 与状态",
          content: `<p>HTTP 本身无状态。Cookie 是浏览器按域和路径自动保存/发送的小段数据；Flask 默认 Session 把签名数据放在 Cookie 中，签名防篡改但<strong>不加密</strong>，不能存秘密或大量数据。服务器端 Session 则只把随机 ID 放 Cookie，数据放 Redis/数据库。</p>
          <p>Cookie 关键属性：<code>HttpOnly</code> 阻止 JavaScript 读取以降低 XSS 窃取风险；<code>Secure</code> 仅通过 HTTPS；<code>SameSite=Lax/Strict</code> 降低 CSRF；<code>Max-Age/Expires</code> 控制寿命。Bearer Token 通常由前端显式放入 Authorization 头，不要盲目把长期 Token 放 localStorage。</p>
          ${N("认证回答‘你是谁’，授权回答‘你能做什么’。Session 和 JWT 是状态传递方案，不是完整权限模型。")}`
        },
        {
          title: "5.5 同源策略、CORS、HTTPS 与浏览器工具",
          content: `<p>协议、主机、端口三者任一不同即不同源。浏览器同源策略限制脚本读取跨源响应；CORS 是服务器通过响应头明确允许哪些源、方法和请求头。带凭据请求不能使用通配源，生产环境应精确白名单。</p>
          <p>某些跨源请求先发送 OPTIONS 预检。CORS 不是认证也不是服务器防火墙，非浏览器客户端不受它约束。HTTPS 保证传输机密性与完整性，登录、Cookie、Token 都必须在生产环境使用 HTTPS。</p>
          ${P("打开浏览器开发者工具 Network：观察 Request URL、Method、Status、Request Headers、Payload、Response、Timing。故意请求一个不存在路由，比较 404 的响应。")}`
        }
      ],
      quiz: {question: "用户已登录但没有删除管理员账号的权限，API 最合适返回？", options: ["200", "401", "403", "500"], answer: 2}
    },
    {
      title: "JSON 与前后端数据契约",
      subtitle: "语法、类型映射、序列化、Flask JSON API 与边界值处理",
      duration: "2.5 小时",
      keywords: "JSON serialization deserialization jsonify get_json Content-Type date Decimal Unicode schema API contract",
      intro: "JSON 是前后端协作最常用的数据格式。本章从字符级语法讲到生产 API 设计，重点解决 Python 对象不能直接 JSON 化、日期金额精度、请求类型和统一响应结构等真实问题。",
      sections: [
        {
          title: "6.1 JSON 是什么，和 Python 字典有什么区别",
          content: `<p>JSON（JavaScript Object Notation）是<strong>文本数据交换格式</strong>，不是 Python 对象，也不是 JavaScript 独有对象。它只有 object、array、string、number、boolean、null 六类值。键必须是双引号字符串；字符串也必须双引号；不能写注释、尾逗号、单引号、undefined、函数或日期字面量。</p>
          ${B("json · 合法示例", `{
  "id": 42,
  "name": "小林",
  "active": true,
  "score": null,
  "roles": ["editor", "reviewer"],
  "profile": {"city": "杭州"}
}`)}
          <table class="data-table"><thead><tr><th>JSON</th><th>Python 解码后</th><th>注意</th></tr></thead><tbody><tr><td>object</td><td>dict</td><td>JSON 键只能是字符串</td></tr><tr><td>array</td><td>list</td><td>顺序保留</td></tr><tr><td>string</td><td>str</td><td>标准编码通常 UTF-8</td></tr><tr><td>number</td><td>int / float</td><td>大整数与小数有跨语言精度问题</td></tr><tr><td>true / false</td><td>True / False</td><td>大小写不同</td></tr><tr><td>null</td><td>None</td><td>表示缺失值但语义需约定</td></tr></tbody></table>
          ${W("把 Python 字典直接转成 str 得到的文本通常包含单引号和 True/None，不是合法 JSON。必须使用 json.dumps 或 Flask jsonify。")}`
        },
        {
          title: "6.2 序列化与反序列化",
          content: `<p><strong>序列化</strong>把内存对象编码成可传输文本/字节，<strong>反序列化</strong>做相反过程。<code>dumps/loads</code> 在字符串与对象之间转换，<code>dump/load</code> 对文件对象操作。读取外部 JSON 后仍须验证，能解析不代表数据可信或满足业务规则。</p>
          ${B("python", `import json

user = {"id": 1, "name": "小林", "active": True}

text = json.dumps(
    user,
    ensure_ascii=False,   # 中文直接显示，不转成 \\uXXXX
    indent=2,             # 适合开发查看，API 可省略以减小体积
)
restored = json.loads(text)

with open("user.json", "w", encoding="utf-8") as file:
    json.dump(user, file, ensure_ascii=False, indent=2)

with open("user.json", encoding="utf-8") as file:
    loaded = json.load(file)`)}
          <p>永远不要用 <code>eval()</code> 解析 JSON，它会执行代码。JSON 解析器也不等于防止超大输入，应在 Web 服务器/Flask 层限制请求体大小。</p>`
        },
        {
          title: "6.3 Flask 接收与返回 JSON",
          content: `<p>客户端发送 JSON 时设置 <code>Content-Type: application/json</code>。Flask 中 <code>request.get_json()</code> 解析请求体；现代 Flask 也能直接返回 dict/list，但 <code>jsonify</code> 意图更明确且适合统一写法。先判断顶层类型，再逐字段验证。</p>
          ${B("python · API 路由", `from flask import Blueprint, jsonify, request

bp = Blueprint("users_api", __name__, url_prefix="/api/users")

@bp.post("")
def create_user():
    data = request.get_json(silent=False)
    if not isinstance(data, dict):
        return jsonify(error={
            "code": "INVALID_JSON",
            "message": "请求体必须是 JSON 对象",
        }), 400

    name = str(data.get("name", "")).strip()
    if not name:
        return jsonify(error={
            "code": "VALIDATION_ERROR",
            "message": "参数校验失败",
            "fields": {"name": "姓名不能为空"},
        }), 422

    user = {"id": 42, "name": name}
    return jsonify(data=user), 201`)}
          <p><code>silent=True</code> 会在解析失败时返回 None，可能把“错误 JSON”和“空值”混在一起；通常让框架产生 415/400，再用统一错误处理器格式化。<code>request.form</code> 读取表单编码，不用于 JSON；<code>request.args</code> 读取查询参数。</p>`
        },
        {
          title: "6.4 日期、Decimal、Enum 与自定义对象",
          content: `<p>JSON 不认识 datetime、Decimal、UUID、Enum 或 ORM 实例。最稳妥做法是在 DTO/Schema 层显式转成基础类型。日期时间用 ISO 8601 并包含时区，如 <code>2026-08-19T14:30:00+08:00</code>；金额可用最小货币单位整数（分），或用字符串防止浮点误差；ID 极大时也可用字符串。</p>
          ${B("python", `from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from decimal import Decimal
from enum import Enum

class Role(Enum):
    ADMIN = "admin"

@dataclass
class UserDTO:
    id: int
    name: str

def to_json_dict(user, price: Decimal) -> dict:
    return {
        "user": asdict(UserDTO(user.id, user.name)),
        "created_at": user.created_at.astimezone(timezone.utc).isoformat(),
        "price": format(price, ".2f"),
        "role": Role.ADMIN.value,
    }`)}
          <p>不要直接 <code>jsonify(model.__dict__)</code>：它会混入 ORM 内部状态、敏感字段、不可序列化对象，并让数据库结构泄漏成 API 契约。显式 DTO 也能控制字段权限，比如普通用户看不到 email。</p>`
        },
        {
          title: "6.5 设计稳定的 JSON API 契约",
          content: `<p>团队应约定字段命名（常用 snake_case）、时间/金额格式、分页结构、空值语义和错误结构。成功结构可以统一为 <code>{data, meta}</code>，错误统一为 <code>{error: {code, message, fields, request_id}}</code>。不必为了“统一”给每个响应再套多层无意义 code。</p>
          ${B("json · 分页响应", `{
  "data": [
    {"id": 1, "name": "Ada"},
    {"id": 2, "name": "Lin"}
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 87,
    "pages": 5
  }
}`)}
          <p>区分“字段缺失”和“字段显式为 null”：PATCH 中缺失通常表示不修改，null 可能表示清空。API 一旦被前端或第三方使用就形成契约；删除字段、改变类型属于破坏性变更。可通过版本路径、兼容期和契约测试管理演进。</p>
          ${P("为文章对象设计 JSON：包含 id、title、author 摘要、tags、带时区 created_at；再设计 422 字段错误和分页列表响应。用 json.dumps/loads 验证往返。")}`
        }
      ],
      quiz: {question: "下面哪一个是合法 JSON？", options: ["{'active': True}", "{name: 'Lin'}", "{\"active\": true, \"score\": null}", "{\"created\": new Date()}"], answer: 2}
    },
    {
      title: "Flask 核心：应用、路由、请求与响应",
      subtitle: "掌握微框架的运行机制与最常用 API",
      duration: "3 小时",
      keywords: "Flask app route request response redirect url_for abort context g current_app hook",
      intro: "本章进入 Flask 主体。你将掌握路由匹配、参数获取、响应构造、上下文与请求生命周期，并能写出边界清晰的页面和 API。",
      sections: [
        {
          title: "7.1 应用对象、路由规则与端点",
          content: `<p><code>Flask(__name__)</code> 让框架定位模板和静态资源。路由规则由路径、方法、host 等组成，默认 endpoint 是视图函数名。<code>url_for</code> 根据 endpoint 反向生成 URL，避免路径修改后散落的硬编码失效。</p>
          ${B("python", `from flask import Flask, url_for

app = Flask(__name__)

@app.get("/articles/")
def article_list():
    return "文章列表"

@app.get("/articles/<int:article_id>")
def article_detail(article_id: int):
    return f"文章 {article_id}"

with app.test_request_context():
    assert url_for("article_detail", article_id=8) == "/articles/8"`)}
          <p>常用转换器有 string、int、float、path、uuid。尾斜杠具有语义：规则以斜杠结尾时，访问不带斜杠地址通常会重定向；反之多余斜杠可能 404。endpoint 在整个应用中必须唯一，蓝图会自动加前缀。</p>`
        },
        {
          title: "7.2 获取请求数据：路径、查询、表单、JSON 与文件",
          content: `<table class="data-table"><thead><tr><th>来源</th><th>Flask API</th><th>示例</th></tr></thead><tbody><tr><td>路径参数</td><td>视图函数参数</td><td>/users/&lt;int:id&gt;</td></tr><tr><td>查询字符串</td><td>request.args</td><td>?page=2&amp;q=flask</td></tr><tr><td>表单</td><td>request.form</td><td>application/x-www-form-urlencoded</td></tr><tr><td>JSON</td><td>request.get_json()</td><td>application/json</td></tr><tr><td>上传文件</td><td>request.files</td><td>multipart/form-data</td></tr><tr><td>请求头</td><td>request.headers</td><td>Authorization</td></tr></tbody></table>
          ${B("python", `from flask import request

@app.get("/search")
def search():
    keyword = request.args.get("q", "", type=str).strip()
    page = request.args.get("page", 1, type=int)
    tags = request.args.getlist("tag")
    user_agent = request.headers.get("User-Agent", "unknown")
    return {"q": keyword, "page": page, "tags": tags}`)}
          <p>所有客户端输入都不可信。转换类型不等于完成校验：仍要检查长度、范围、枚举、关联资源存在与当前用户权限。不要把请求对象传到业务深层。</p>`
        },
        {
          title: "7.3 返回值、Response、重定向与错误",
          content: `<p>视图可返回字符串、dict/list、Response，或 <code>(body, status)</code>、<code>(body, status, headers)</code>。模板页面通常返回 render_template；创建后可 redirect 到详情页；不存在资源用 abort(404) 或领域异常。</p>
          ${B("python", `from flask import abort, make_response, redirect, url_for

@app.post("/articles")
def create_article():
    article = service.create(request.form)
    response = redirect(url_for("article_detail", article_id=article.id))
    response.headers["X-Resource-Id"] = str(article.id)
    return response, 303

@app.get("/download-demo")
def download_demo():
    response = make_response("id,name\\n1,Lin\\n")
    response.headers["Content-Type"] = "text/csv; charset=utf-8"
    response.headers["Content-Disposition"] = "attachment; filename=users.csv"
    return response`)}
          <p>POST 后页面跳转使用 Post/Redirect/Get，刷新时不会重复提交。API 创建通常直接返回 JSON + 201 + Location。响应头用于缓存、安全、下载和追踪，但业务数据通常放响应体。</p>`
        },
        {
          title: "7.4 应用上下文、请求上下文与 g",
          content: `<p><code>current_app</code> 代理当前应用，<code>request</code> 代理当前请求，<code>g</code> 保存一次请求内共享的临时对象。它们依靠上下文工作，在无上下文的后台线程或普通脚本中访问会报 RuntimeError。</p>
          ${B("python", `from flask import g

@app.before_request
def load_current_user():
    user_id = session.get("user_id")
    g.user = db.session.get(User, user_id) if user_id else None

@app.teardown_request
def close_request(exception=None):
    # Flask-SQLAlchemy 通常会自行清理 session；这里展示钩子语义
    if exception:
        current_app.logger.warning("request failed", exc_info=exception)`)}
          <p>常用生命周期钩子：before_request 在路由前；after_request 接收并返回响应；teardown_request 无论成功失败都执行，适合释放资源但不适合改变响应。钩子要轻量，避免让每个请求都承担不必要查询。</p>`
        },
        {
          title: "7.5 模板渲染、静态资源与安全转义",
          content: `<p>Jinja 模板负责服务器端 HTML 渲染。默认自动转义来自变量的 HTML 特殊字符，防止常见 XSS。静态资源放 <code>static/</code>，模板放 <code>templates/</code>，引用使用 <code>url_for('static', filename='css/app.css')</code>。</p>
          ${B("jinja2", `{% extends "base.html" %}
{% block content %}
  <h1>{{ article.title }}</h1>
  <p>{{ article.body }}</p>
  {% if current_user %}
    <span>你好，{{ current_user.name }}</span>
  {% endif %}
  {% for tag in article.tags %}
    <a href="{{ url_for('article.list', tag=tag.name) }}">
      {{ tag.name }}
    </a>
  {% else %}
    <span>暂无标签</span>
  {% endfor %}
{% endblock %}`)}
          ${W("不要对用户提交内容随意使用 Jinja 的 safe 过滤器，它会关闭转义。若业务必须允许富文本，使用可靠白名单清洗库限制标签与属性。")}`
        }
      ],
      quiz: {question: "为什么模板和重定向中推荐使用 url_for？", options: ["它会自动连接数据库", "它按 endpoint 生成 URL，减少硬编码", "它能加密路径", "它让 GET 变成 POST"], answer: 1}
    },
    {
      title: "Flask 工程化：应用工厂、配置与蓝图",
      subtitle: "把单文件原型组织成可测试、可扩展的真实项目",
      duration: "2.5 小时",
      keywords: "application factory blueprint config extension environment dotenv logging structure circular import",
      intro: "单文件适合验证想法，真实项目需要应用工厂、蓝图、集中扩展和分环境配置。本章给出推荐目录与每个文件的职责。",
      sections: [
        {
          title: "8.1 应用工厂解决了什么",
          content: `<p>应用工厂 <code>create_app(config_name)</code> 在需要时创建应用，使测试可创建隔离实例、开发/生产配置可切换、扩展可延迟绑定，也显著减少循环导入。模块顶层不要依赖尚未创建的 app。</p>
          ${B("python · app/__init__.py", `from flask import Flask
from .extensions import db, migrate

def create_app(config_object="config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    migrate.init_app(app, db)

    from .blueprints.main import bp as main_bp
    from .blueprints.api import bp as api_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp, url_prefix="/api")

    register_error_handlers(app)
    return app`)}
          ${B("python · app/extensions.py", `from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
migrate = Migrate()`)}
          <p>扩展对象先创建但不绑定具体 app，在工厂中 <code>init_app</code>。视图中通过 current_app 获取配置，模型通过 db 使用会话。</p>`
        },
        {
          title: "8.2 蓝图与模块边界",
          content: `<p>Blueprint 是一组路由、模板、静态资源和钩子的注册单元，不是独立应用。可按业务域拆分 auth、users、articles，避免按技术类型把全部路由放一个超大文件。蓝图 endpoint 形如 <code>auth.login</code>。</p>
          ${B("python · app/blueprints/auth/__init__.py", `from flask import Blueprint

bp = Blueprint("auth", __name__, template_folder="templates")

from . import routes  # 在 bp 创建后导入，避免循环依赖`)}
          ${B("python · app/blueprints/auth/routes.py", `from flask import render_template
from . import bp

@bp.get("/login")
def login_page():
    return render_template("auth/login.html")`)}
          <p>若 routes 文件越来越大，可按资源分成 views.py、api.py，但不要让蓝图互相导入内部实现。跨域协作通过 service 或公开接口完成。</p>`
        },
        {
          title: "8.3 配置类、环境变量与秘密",
          content: `<p>配置优先级通常为：安全默认值 → 环境配置类 → 环境变量覆盖。<code>.env</code> 仅用于本地便利并加入 .gitignore；部署平台注入真正环境变量。<code>SECRET_KEY</code> 必须随机、足够长且生产环境固定，改变会让现有会话失效。</p>
          ${B("python · config.py", `import os
from datetime import timedelta

class BaseConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAX_CONTENT_LENGTH = 8 * 1024 * 1024
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "sqlite:///dev.db"
    )

class ProductionConfig(BaseConfig):
    SESSION_COOKIE_SECURE = True
    SQLALCHEMY_DATABASE_URI = os.environ["DATABASE_URL"]`)}
          ${W("不要给生产秘密提供看似可用的默认值。os.environ['KEY'] 在缺失时尽早失败，比应用带着错误默认密钥上线更安全。")}`
        },
        {
          title: "8.4 推荐目录与依赖方向",
          content: `${B("text", `app/
├─ __init__.py              # 应用工厂、全局注册
├─ extensions.py            # db / migrate / login_manager
├─ models/                  # ORM 模型
├─ blueprints/
│  ├─ auth/                 # routes / forms / templates
│  ├─ main/
│  └─ api/
├─ services/                # 业务用例
├─ repositories/            # 可选：复杂数据访问
├─ schemas/                 # 输入验证与输出 DTO
├─ templates/
└─ static/
   ├─ css/
   └─ js/
tests/
migrations/
config.py
run.py
.env.example
requirements.txt`)}
          <p>依赖方向应大致从外向内：routes → services → models/repository 接口。models 不应反向导入 routes。第三方客户端包装在 infrastructure/adapters 中。文件名服务于理解，不必机械复制大型架构。</p>
          ${P("把单文件 hello 应用改造成 create_app + main blueprint；创建 DevelopmentConfig 和 TestingConfig；用 flask --app run:app routes 查看路由表。")}`
        },
        {
          title: "8.5 CLI 命令、日志与启动入口",
          content: `<p>自定义 Flask CLI 适合初始化管理员、导入数据和维护任务。日志应包含时间、级别、模块、消息与请求 ID；生产环境输出到标准输出，由平台收集。不要用 print 代替可分级日志。</p>
          ${B("python", `import click
from flask import current_app

def register_commands(app):
    @app.cli.command("seed")
    @click.option("--count", default=10, type=int)
    def seed(count):
        """插入开发用示例数据。"""
        current_app.user_service.seed(count)
        click.echo(f"created {count} users")

# 执行：flask --app run.py seed --count 20`)}
          <p>启动入口保持极简：<code>app = create_app()</code>。生产由 WSGI 服务器导入它，不调用 app.run。启动阶段验证必需配置、数据库连接和外部依赖，避免运行一段时间后才发现配置缺失。</p>`
        }
      ],
      quiz: {question: "应用工厂最重要的收益是什么？", options: ["自动生成 HTML", "能创建不同配置的独立 app，利于测试与扩展绑定", "不再需要数据库", "让 Python 变成前端语言"], answer: 1}
    },
    {
      title: "Jinja、HTML、CSS 与浏览器 DOM 基础",
      subtitle: "为 jQuery 打牢前端结构、样式、模板与可访问性基础",
      duration: "2 小时",
      keywords: "HTML semantic CSS DOM Jinja template inheritance form accessibility data attribute",
      intro: "jQuery 操作的是 DOM，因此必须先理解 HTML 元素树、CSS 选择器、模板渲染和表单语义。本章让后端生成的页面成为稳定、可访问的前端基础。",
      sections: [
        {
          title: "9.1 语义化 HTML 与 DOM 树",
          content: `<p>浏览器把 HTML 解析成 DOM 树。元素是节点，具有父子、兄弟关系和属性。使用 header/nav/main/section/article/footer 表达结构；按钮行为使用 button，导航使用 a，不要用 div 模拟所有交互。</p>
          ${B("html", `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>任务管理</title>
</head>
<body>
  <main>
    <h1>我的任务</h1>
    <form id="task-form">
      <label for="task-title">任务标题</label>
      <input id="task-title" name="title" required maxlength="100">
      <button type="submit">添加</button>
    </form>
    <ul id="task-list" aria-live="polite"></ul>
  </main>
</body>
</html>`)}
          <p>id 在页面内唯一，适合组件根节点；class 可复用，适合样式和行为；<code>data-*</code> 保存元素关联的非敏感数据。表单控件必须有 name 才会参与传统表单提交。</p>`
        },
        {
          title: "9.2 CSS 选择器、盒模型与布局",
          content: `<p>jQuery 与 CSS 共享大部分选择器知识。<code>#id</code>、<code>.class</code>、<code>[name=value]</code>、后代空格、直接子代 <code>></code>、伪类 <code>:checked</code> 都很常用。CSS 盒模型由 content、padding、border、margin 构成，推荐全局 <code>box-sizing: border-box</code>。</p>
          ${B("css", `* { box-sizing: border-box; }

.task-list {
  display: grid;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #dbe2ea;
}

@media (max-width: 640px) {
  .task-item { align-items: stretch; flex-direction: column; }
}`)}
          <p>Flex 适合一维排列，Grid 适合二维网格。交互状态由 CSS class 描述，jQuery 只切换 class，而不是在 JS 中堆大量内联 style。</p>`
        },
        {
          title: "9.3 Jinja 模板继承、include 与宏",
          content: `<p>基础模板定义全站骨架与 block，子模板只覆盖页面内容。include 适合局部片段，macro 类似模板函数，适合表单控件或分页组件。模板只做简单展示判断，不应执行复杂业务查询。</p>
          ${B("jinja2 · base.html", `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>{% block title %}任务系统{% endblock %}</title>
  <link rel="stylesheet" href="{{ url_for('static', filename='css/app.css') }}">
</head>
<body>
  {% include "_navbar.html" %}
  <main>{% block content %}{% endblock %}</main>
  <script src="{{ url_for('static', filename='vendor/jquery.min.js') }}"></script>
  {% block scripts %}{% endblock %}
</body>
</html>`)}
          ${B("jinja2 · tasks/index.html", `{% extends "base.html" %}
{% block title %}任务列表 · {{ super() }}{% endblock %}
{% block content %}
  <ul id="task-list">
    {% for task in tasks %}
      {% include "tasks/_item.html" %}
    {% else %}
      <li class="empty">暂无任务</li>
    {% endfor %}
  </ul>
{% endblock %}`)}`
        },
        {
          title: "9.4 表单、可访问性与前后端渐进增强",
          content: `<p>label 与 input 关联，错误信息用 aria-describedby，动态区域用适度的 aria-live。键盘焦点必须可见，弹窗需要焦点管理，图片需要有意义 alt。按钮必须注明 type，避免表单内默认 submit 造成意外提交。</p>
          <p>渐进增强意味着基础 HTML 表单在 JavaScript 失效时仍能提交并得到服务器页面；有 JS 时用 AJAX 提升体验。对内部工具或明确要求的 SPA 可以依赖 JS，但仍要处理加载、空、成功、失败、禁用等全部 UI 状态。</p>
          ${N("前端校验改善体验，后端校验保障安全。用户可以绕过浏览器规则直接调用 API，所以 required、maxlength 永远不能代替服务器验证。")}
          ${P("做一个含 title、priority、due_date 的任务表单：正确关联 label；显示字段错误；Enter 可提交；保存中禁用按钮；成功后把新任务插入列表。")}`
        }
      ],
      quiz: {question: "为什么表单的 input 即使有 required，后端仍需验证？", options: ["required 只在 Chrome 生效", "客户端规则可被绕过，后端必须守住数据边界", "Flask 看不到 HTML", "jQuery 会删除 required"], answer: 1}
    },
    {
      title: "jQuery 核心：选择、操作与链式编程",
      subtitle: "用稳定的 DOM 操作构建清晰、可维护的页面交互",
      duration: "3 小时",
      keywords: "jQuery selector DOM traversal attr prop data class css html text append remove chain ready",
      intro: "jQuery 的价值在于统一 DOM 查询、事件、动画与 AJAX API。本章从 $ 函数讲起，建立元素集合、链式调用、DOM 读写和性能边界的正确心智模型。",
      sections: [
        {
          title: "10.1 引入 jQuery、DOM Ready 与 $ 对象",
          content: `<p>把 jQuery 文件放在自己的 <code>static/vendor/</code> 可离线使用，也可以使用带完整性校验的 CDN。业务脚本必须在 jQuery 之后加载。<code>$(fn)</code> 在 DOM 构建完成后执行；若 script 使用 defer 并位于 head，也能保证 DOM 可用。</p>
          ${B("html", `<script src="/static/vendor/jquery-3.7.1.min.js"></script>
<script src="/static/js/app.js"></script>`)}
          ${B("javascript", `$(function () {
  const $form = $("#task-form");
  const $list = $("#task-list");

  console.log("DOM 已可操作", $form.length);
});`)}
          <p>变量名前加 <code>$</code> 是团队约定，表示里面是 jQuery 对象。DOM 原生元素和 jQuery 包装对象 API 不同：<code>$element[0]</code> 取原生节点，<code>$(domElement)</code> 包装成 jQuery 对象。空集合调用多数 jQuery 方法不会报错，因此关键节点应检查 length。</p>`
        },
        {
          title: "10.2 选择器、筛选与遍历",
          content: `<p>高频选择器：ID、class、标签、属性、状态。先选择组件根节点，再用 <code>.find()</code> 缩小范围，比反复从 document 全局搜索更清楚。<code>closest</code> 向祖先查找，<code>children</code> 只看直接子元素，<code>siblings</code> 看兄弟，<code>filter/not/eq/first/last</code> 筛选集合。</p>
          ${B("javascript", `const $panel = $("#user-panel");
const $enabledInputs = $panel.find("input:not(:disabled)");
const $checkedRoles = $panel.find("input[name='roles']:checked");

$(event.target)
  .closest(".user-row")
  .find(".status")
  .text("已更新");

const selectedValues = $checkedRoles.map(function () {
  return this.value;
}).get();`)}
          <p>选择器是从右向左匹配的，现代浏览器已很快，但超大页面仍应避免频繁复杂全局选择。缓存重复使用的集合；动态插入后旧集合不会自动包含新元素，需要重新查询或使用事件委托。</p>`
        },
        {
          title: "10.3 text、html、val、attr、prop 与 data",
          content: `<table class="data-table"><thead><tr><th>方法</th><th>用途</th><th>安全/语义</th></tr></thead><tbody><tr><td>.text()</td><td>读取/写入纯文本</td><td>用户内容首选，会转义</td></tr><tr><td>.html()</td><td>读取/写入 HTML</td><td>不可信内容会导致 XSS</td></tr><tr><td>.val()</td><td>表单值</td><td>checkbox 需结合 :checked</td></tr><tr><td>.attr()</td><td>HTML 属性</td><td>适合 href、aria-*、data-*</td></tr><tr><td>.prop()</td><td>DOM 当前属性</td><td>checked、disabled 使用它</td></tr><tr><td>.data()</td><td>关联 JS 数据</td><td>有缓存语义，和 attr 不完全同步</td></tr></tbody></table>
          ${B("javascript", `const $save = $("#save-button");
$save.prop("disabled", true).text("保存中…");

const title = $("#title").val().trim();
$("#preview").text(title);              // 安全显示用户文本
$("#dialog").attr("aria-hidden", "false");

const userId = Number($(".user-row").first().attr("data-user-id"));

// 高风险：永远不要直接插入后端返回的用户输入
// $("#preview").html(response.user_bio);`)}
          ${W("html()、append(string) 和模板字符串都可能把字符串解析成 HTML。若字符串含用户可控内容，使用 text() 或先创建节点再用 text 填充。")}`
        },
        {
          title: "10.4 创建、插入、删除与 class 状态",
          content: `<p>常用插入方法：append/prepend 插入内部，before/after 插入同级；remove 删除元素及数据事件，detach 暂时移除并保留关联，empty 清空子节点。界面状态使用 addClass/removeClass/toggleClass/hasClass 表达。</p>
          ${B("javascript", `function renderTask(task) {
  const $item = $("<li>", {
    class: "task-item",
    "data-task-id": task.id
  });

  $("<span>", { class: "task-title" })
    .text(task.title)
    .appendTo($item);

  $("<button>", {
    type: "button",
    class: "delete-task",
    text: "删除",
    "aria-label": "删除任务 " + task.title
  }).appendTo($item);

  return $item;
}

$("#task-list").prepend(renderTask({ id: 8, title: "学习 Flask" }));`)}
          <p>渲染大量元素时先构建数组/DocumentFragment 再一次插入，减少布局重算。删除服务器资源成功后再 remove，或做带回滚的乐观更新。</p>`
        },
        {
          title: "10.5 链式调用、each/map 与插件边界",
          content: `<p>多数写操作返回原 jQuery 集合，因此可链式调用；读取方法通常返回值并结束链。<code>each</code> 执行副作用，<code>map(...).get()</code> 生成普通数组。回调中传统 function 的 this 指向当前 DOM 元素；箭头函数不会重新绑定 this。</p>
          ${B("javascript", `$(".flash-message")
  .addClass("is-visible")
  .attr("role", "status")
  .delay(2500)
  .fadeOut(200);

$(".price").each(function () {
  const cents = Number($(this).attr("data-cents"));
  $(this).text((cents / 100).toFixed(2) + " 元");
});`)}
          ${P("做一个用户列表组件：安全渲染名字；按 data-user-id 定位行；启用/禁用按钮用 prop；选中行切换 class；列表为空时显示空状态。")}`
        }
      ],
      quiz: {question: "要更新 checkbox 当前是否选中，应优先使用哪个方法？", options: [".attr('checked')", ".prop('checked')", ".html('checked')", ".css('checked')"], answer: 1}
    },
    {
      title: "jQuery 事件、表单与组件组织",
      subtitle: "事件传播、委托、命名空间、防抖与可维护模块",
      duration: "3 小时",
      keywords: "jQuery event on off delegation submit preventDefault propagation debounce namespace form serialize module",
      intro: "交互系统的核心是事件。本章讲透事件对象、冒泡与委托，并解决重复绑定、动态节点失效、连续请求和表单状态管理等常见问题。",
      sections: [
        {
          title: "11.1 on、事件对象与默认行为",
          content: `<p><code>.on(event, handler)</code> 绑定事件。回调收到 event，其中 target 是最初触发节点，currentTarget 是当前处理节点。<code>preventDefault()</code> 阻止链接跳转或表单提交；<code>stopPropagation()</code> 阻止冒泡，应谨慎使用，因为可能破坏外层组件。</p>
          ${B("javascript", `$("#task-form").on("submit", function (event) {
  event.preventDefault();

  const title = $(this).find("[name='title']").val().trim();
  if (!title) {
    $("#title-error").text("请输入任务标题");
    return;
  }
  saveTask({ title: title });
});

$("#open-help").on("click", function (event) {
  event.preventDefault();
  openHelpDialog();
});`)}
          <p>表单逻辑绑定 submit 而不是按钮 click，这样键盘 Enter、辅助技术和其他提交方式都能工作。不要 return false 代替明确的 preventDefault + stopPropagation，因为语义不清。</p>`
        },
        {
          title: "11.2 事件冒泡与动态元素委托",
          content: `<p>大多数事件从目标元素向祖先冒泡。事件委托把监听器绑定在稳定祖先上，再用选择器匹配目标，所以后来动态添加的按钮也能响应，并减少监听器数量。</p>
          ${B("javascript", `const $taskList = $("#task-list");

$taskList.on("click.tasks", ".delete-task", function () {
  const $row = $(this).closest(".task-item");
  const taskId = Number($row.attr("data-task-id"));
  deleteTask(taskId, $row);
});

$taskList.on("change.tasks", ".task-toggle", function () {
  const $row = $(this).closest(".task-item");
  $row.toggleClass("is-done", this.checked);
});

// 组件销毁时只移除自己的命名空间
$taskList.off(".tasks");`)}
          <p>委托目标应尽量靠近组件，而非把所有事件都绑 document。mouseenter/leave、focus/blur 等事件的冒泡特性不同，jQuery 做了部分规范化；输入框实时变化通常使用 input 事件。</p>`
        },
        {
          title: "11.3 表单收集、校验与 UI 状态机",
          content: `<p><code>serialize()</code> 产生 URL 编码字符串，<code>serializeArray()</code> 产生 name/value 数组，适合传统表单；JSON API 通常显式构建对象以正确表达布尔、数字和数组。文件上传必须用 FormData。</p>
          ${B("javascript", `function readTaskForm($form) {
  return {
    title: $form.find("[name='title']").val().trim(),
    priority: Number($form.find("[name='priority']").val()),
    completed: $form.find("[name='completed']").prop("checked"),
    tags: $form.find("[name='tags']:checked").map(function () {
      return this.value;
    }).get()
  };
}

function setSubmitting($form, active) {
  $form.attr("aria-busy", String(active));
  $form.find(":input").prop("disabled", active);
  $form.find("[type='submit']").text(active ? "保存中…" : "保存");
}`)}
          <p>把页面想成状态机：idle → validating → submitting → success/error。无论请求成功失败，都要恢复按钮；错误要靠近字段显示；重复提交要禁用或使用幂等键。</p>`
        },
        {
          title: "11.4 防抖、节流与请求竞态",
          content: `<p>搜索框每次输入都请求会浪费资源。<strong>防抖</strong>在停止操作一段时间后执行，适合搜索；<strong>节流</strong>限制固定时间内最多执行一次，适合滚动。更隐蔽的问题是旧请求后返回，覆盖新结果，应取消旧 jqXHR 或比较请求序号。</p>
          ${B("javascript", `function debounce(fn, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

let pendingSearch = null;
$("#search").on("input", debounce(function () {
  const query = this.value.trim();
  if (pendingSearch) pendingSearch.abort();
  pendingSearch = $.getJSON("/api/tasks", { q: query })
    .done(renderResults)
    .fail(function (xhr, status) {
      if (status !== "abort") showError("搜索失败");
    });
}, 300));`)}
          ${P("实现即时搜索：300ms 防抖、空关键词显示默认列表、新请求取消旧请求、加载中状态、无结果状态、网络失败重试按钮。")}`
        },
        {
          title: "11.5 模块化组织 jQuery 页面",
          content: `<p>不要把所有逻辑放一个巨大 document.ready。按组件建立私有状态和公开 init/destroy；缓存根元素；所有查询限制在根元素内；事件使用命名空间；API 请求集中到单独 client。</p>
          ${B("javascript", `const TaskList = (function () {
  let $root;

  function init(selector) {
    $root = $(selector);
    if (!$root.length) return;
    $root.on("click.taskList", ".delete-task", onDelete);
  }

  function onDelete(event) {
    const $row = $(event.currentTarget).closest(".task-item");
    TaskApi.remove($row.data("taskId")).done(function () {
      $row.remove();
    });
  }

  function destroy() {
    if ($root) $root.off(".taskList");
  }

  return { init: init, destroy: destroy };
})();`)}
          <p>页面小的时候 IIFE 足够；现代项目可使用 ES Modules。无论形式如何，都要把 DOM 渲染、事件协调、API 通信与纯数据转换分开。</p>`
        }
      ],
      quiz: {question: "动态添加的删除按钮也要响应点击，最佳做法是？", options: ["每秒重新绑定一次", "在稳定父元素上使用事件委托", "把 onclick 字符串写进 HTML", "每次点击刷新页面"], answer: 1}
    },
    {
      title: "AJAX：jQuery 与 Flask 的完整 JSON 联调",
      subtitle: "请求配置、Promise 回调、错误处理、CSRF 与 CRUD",
      duration: "3.5 小时",
      keywords: "AJAX $.ajax getJSON POST JSON stringify jqXHR promise done fail always CRUD CSRF loading error",
      intro: "本章把 JSON、HTTP、Flask 与 jQuery 连成一条完整链路。你将实现无需刷新页面的 CRUD，并能处理加载、校验、冲突、未登录、服务器异常和网络中断。",
      sections: [
        {
          title: "12.1 $.ajax 配置与 jqXHR 生命周期",
          content: `<p><code>$.ajax</code> 返回 jqXHR，它兼具取消请求和 Promise 风格回调。<code>method</code> 是 HTTP 方法；<code>url</code> 是地址；<code>data</code> 是发送内容；<code>contentType</code> 描述请求体；<code>dataType</code> 告诉 jQuery 如何解析响应。两者是最常混淆的选项。</p>
          ${B("javascript", `function createTask(payload) {
  return $.ajax({
    url: "/api/tasks",
    method: "POST",
    contentType: "application/json; charset=UTF-8",
    dataType: "json",
    data: JSON.stringify(payload),
    timeout: 10000
  });
}

createTask({ title: "完成 Flask 课程", priority: 2 })
  .done(function (response, textStatus, xhr) {
    renderTask(response.data);
    console.log("status", xhr.status); // 201
  })
  .fail(function (xhr, textStatus) {
    handleApiError(xhr, textStatus);
  })
  .always(function () {
    setSubmitting($("#task-form"), false);
  });`)}
          <p>GET 的 data 会编码进查询字符串；发送 JSON 必须 JSON.stringify。若 Flask 返回正确 application/json，通常无需 dataType。不要同时混用 success/error 与 done/fail 风格，以免流程分散。</p>`
        },
        {
          title: "12.2 Flask CRUD API 与状态码",
          content: `${B("python", `@bp.get("/tasks")
def list_tasks():
    page = request.args.get("page", 1, type=int)
    result = task_service.list(page=page, per_page=20)
    return jsonify(data=[t.to_dict() for t in result.items], meta={
        "page": result.page,
        "pages": result.pages,
        "total": result.total,
    })

@bp.post("/tasks")
def create_task():
    task = task_service.create(request.get_json())
    return jsonify(data=task.to_dict()), 201

@bp.patch("/tasks/<int:task_id>")
def update_task(task_id):
    task = task_service.update(task_id, request.get_json())
    return jsonify(data=task.to_dict())

@bp.delete("/tasks/<int:task_id>")
def delete_task(task_id):
    task_service.delete(task_id)
    return "", 204`)}
          <p>前端删除遇到 204 时不要尝试读取 JSON。列表 API 提供分页而非一次返回全部。更新 API 必须做资源存在、字段白名单、权限、版本冲突和业务不变量校验。</p>`
        },
        {
          title: "12.3 集中处理 API 错误",
          content: `<p>失败不等同于“服务器挂了”。先按状态码处理：401 引导登录；403 提示权限；404 移除已不存在资源；409 提示冲突并刷新；422 把 fields 映射到表单；429 尊重 Retry-After；5xx 显示可重试通用消息并记录 request_id。</p>
          ${B("javascript", `function handleApiError(xhr, textStatus) {
  if (textStatus === "timeout") {
    return showToast("请求超时，请重试");
  }

  const payload = xhr.responseJSON || {};
  const error = payload.error || {};

  if (xhr.status === 422 && error.fields) {
    return showFieldErrors(error.fields);
  }
  if (xhr.status === 401) {
    window.location.assign("/login?next=" + encodeURIComponent(location.pathname));
    return;
  }
  if (xhr.status === 0) {
    return showToast("网络不可用，请检查连接");
  }
  showToast(error.message || "操作失败，请稍后再试");
}`)}
          <p>前端显示服务端 message 前要确认它是面向用户且不含内部细节。未知响应当作不可信输入。开发环境在 Network 面板查看实际响应，不要只看控制台一句 “AJAX error”。</p>`
        },
        {
          title: "12.4 CSRF、Cookie 会话与 AJAX",
          content: `<p>浏览器会自动带同站 Cookie，所以攻击网站可能诱导用户向你的站点发修改请求，这就是 CSRF。使用 Flask-WTF 的 CSRF 保护或服务端生成 Token，AJAX 在自定义头里发送。SameSite 是额外防线，不应是唯一防线。</p>
          ${B("html + javascript", `<meta name="csrf-token" content="{{ csrf_token() }}">
<script>
  $.ajaxSetup({
    beforeSend: function (xhr, settings) {
      const unsafe = !/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type);
      if (unsafe) {
        xhr.setRequestHeader(
          "X-CSRFToken",
          $("meta[name='csrf-token']").attr("content")
        );
      }
    }
  });
</script>`)}
          <p>跨源带 Cookie 时，前端需要 credentials（jQuery 的 xhrFields.withCredentials），后端必须返回精确 Access-Control-Allow-Origin 与 Allow-Credentials；但同站 Flask + jQuery 项目通常无需 CORS，部署成同一域最简单安全。</p>`
        },
        {
          title: "12.5 乐观更新、幂等与用户体验",
          content: `<p>悲观更新等服务器成功再改 UI，简单可靠；乐观更新先改 UI，失败回滚，适合高成功率且可逆操作。创建订单/支付等不可重复操作应使用幂等键，服务端保存键与结果，重试返回同一结果。</p>
          ${B("javascript", `function toggleTask($row, completed) {
  const previous = $row.hasClass("is-done");
  $row.toggleClass("is-done", completed).addClass("is-saving");

  $.ajax({
    url: "/api/tasks/" + $row.data("taskId"),
    method: "PATCH",
    contentType: "application/json",
    data: JSON.stringify({ completed: completed })
  }).fail(function () {
    $row.toggleClass("is-done", previous);
    showToast("保存失败，已恢复原状态");
  }).always(function () {
    $row.removeClass("is-saving");
  });
}`)}
          ${P("完成任务 CRUD：列表分页、创建、勾选完成、编辑、确认删除；统一加载/错误状态；422 显示字段错误；所有修改请求带 CSRF Token。")}`
        }
      ],
      quiz: {question: "$.ajax 中 contentType 与 dataType 分别描述什么？", options: ["请求体格式与期望响应解析格式", "响应格式与请求方法", "URL 与 Cookie", "超时与缓存"], answer: 0}
    },
    {
      title: "SQL 与 SQLAlchemy 数据建模",
      subtitle: "关系数据库、ORM 模型、关联、查询、事务与迁移",
      duration: "4 小时",
      keywords: "SQL database SQLAlchemy ORM model relationship foreign key query transaction migration index N+1 pagination",
      intro: "数据库不是一个能自动保存对象的黑盒。本章先理解关系模型与 SQL，再使用 SQLAlchemy 建模、查询和管理事务，最后用迁移安全演进结构。",
      sections: [
        {
          title: "13.1 关系数据库与 SQL 最小必备",
          content: `<p>表由列和行组成；主键唯一标识行；外键表达表间引用；NOT NULL、UNIQUE、CHECK 等约束在最靠近数据处守住完整性。规范化减少重复，必要的反规范化要有明确性能理由和同步策略。</p>
          ${B("sql", `CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  created_at TIMESTAMP NOT NULL
);

SELECT u.id, u.name, COUNT(t.id) AS task_count
FROM users AS u
LEFT JOIN tasks AS t ON t.user_id = u.id
WHERE u.created_at >= '2026-01-01'
GROUP BY u.id, u.name
HAVING COUNT(t.id) >= 3
ORDER BY task_count DESC
LIMIT 20 OFFSET 0;`)}
          <p>SQL 执行逻辑大致从 FROM/JOIN、WHERE、GROUP BY、HAVING、SELECT、ORDER BY 到 LIMIT。永远使用参数绑定，不要字符串拼接用户输入。索引加速读但增加写入与存储成本，常建在过滤、连接、排序列上。</p>`
        },
        {
          title: "13.2 SQLAlchemy 2.x 模型与字段",
          content: `${B("python", `from datetime import datetime, timezone
from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.extensions import db

class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(80))
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc)
    )
    tasks: Mapped[list["Task"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )

class Task(db.Model):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120))
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    owner: Mapped[User] = relationship(back_populates="tasks")`)}
          <p>Python default 在插入时执行；server_default 在数据库侧执行。nullable、unique 与 index 是不同概念。外键约束引用列，但 relationship 是 ORM 导航。级联删除需要慎重确认业务语义。</p>`
        },
        {
          title: "13.3 查询、分页、关联加载与 N+1",
          content: `${B("python", `from sqlalchemy import select
from sqlalchemy.orm import selectinload

statement = (
    select(User)
    .where(User.name.ilike(f"%{keyword}%"))
    .options(selectinload(User.tasks))
    .order_by(User.created_at.desc())
)
users = db.session.scalars(statement).all()

user = db.get_or_404(User, user_id)

page = db.paginate(
    select(Task).where(Task.user_id == user_id).order_by(Task.id.desc()),
    page=page_number,
    per_page=20,
    max_per_page=100,
)`)}
          <p>N+1 指先查 N 个用户，再为每个用户各查一次任务。使用 selectinload 或 joinedload 预加载，但不是所有关联都无脑加载。通过 SQL 日志和性能分析确认查询次数。分页必须有稳定排序；大数据深翻页可用游标分页。</p>`
        },
        {
          title: "13.4 事务、并发与一致性",
          content: `<p>事务满足原子性：一组操作要么都成功要么都失败。<code>flush</code> 把待处理 SQL 发给数据库以获得 ID，但不提交；<code>commit</code> 提交；发生异常必须 rollback 后 session 才能继续使用。事务尽量短，不要在事务内等待用户或慢速外部 API。</p>
          ${B("python", `from sqlalchemy.exc import IntegrityError

def create_user(email: str, name: str) -> User:
    user = User(email=email.lower(), name=name)
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError as exc:
        db.session.rollback()
        raise EmailAlreadyExists(email) from exc
    return user`)}
          <p>先查询 email 不存在再插入仍有竞态，真正唯一性必须靠数据库 UNIQUE 约束并捕获冲突。库存扣减、余额变化可用原子 UPDATE、行锁或乐观版本号，具体选择取决于数据库和吞吐。</p>`
        },
        {
          title: "13.5 迁移、种子数据与备份",
          content: `<p>Flask-Migrate/Alembic 记录 schema 演进。基本流程：修改模型 → 生成迁移 → 人工审查 → 在测试库升级 → 备份生产数据 → 部署升级。自动生成无法理解重命名意图，可能把改名识别成删列+加列，必须审查。</p>
          ${B("powershell", `flask --app run.py db init
flask --app run.py db migrate -m "create users and tasks"
flask --app run.py db upgrade
flask --app run.py db current
flask --app run.py db history`)}
          <p>生产迁移要考虑锁表、回滚与旧代码兼容。安全做法常分阶段：先新增可空列 → 部署写入新旧列 → 回填 → 切换读取 → 最后加约束/删旧列。迁移文件应提交版本控制，数据库文件和备份不提交。</p>
          ${P("建立 User 与 Task 一对多模型；写查询获取某用户未完成任务并分页；验证重复 email 被数据库拒绝；生成并审查一次迁移。")}`
        }
      ],
      quiz: {question: "为何不能只通过‘先查询是否存在’保证 email 唯一？", options: ["SELECT 不支持字符串", "并发请求可能同时查到不存在，必须有数据库 UNIQUE 约束", "Flask 会缓存 email", "JSON 会删除重复值"], answer: 1}
    },
    {
      title: "认证、授权与 Web 安全",
      subtitle: "密码、Session、权限、CSRF、XSS、SQL 注入与安全响应头",
      duration: "4 小时",
      keywords: "authentication authorization password hash session login Flask-Login RBAC CSRF XSS SQL injection security JWT rate limit",
      intro: "安全不是上线前加的插件，而是贯穿输入、存储、输出和权限检查的设计。本章构建 Session 登录流程，并系统覆盖 Web 常见攻击面。",
      sections: [
        {
          title: "14.1 密码存储与注册登录流程",
          content: `<p>绝不保存明文密码，也不要自己实现加密算法。使用 Werkzeug 的安全密码哈希（底层采用适合密码的慢哈希配置），每个密码自动带盐。登录时用恒定设计的 check 函数比较。注册还需规范化 email、唯一约束和密码策略。</p>
          ${B("python", `from werkzeug.security import check_password_hash, generate_password_hash

class User(db.Model):
    password_hash: Mapped[str] = mapped_column(String(255))

    def set_password(self, password: str) -> None:
        if len(password) < 10:
            raise ValidationError("密码至少 10 位")
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

# 登录失败统一提示“邮箱或密码错误”，避免枚举账号`)}
          <p>生产登录需限速、记录异常行为、可选多因素认证。密码重置 Token 应随机、一次性、短时有效，数据库保存其哈希而非原值。修改密码后可使其他会话失效。</p>`
        },
        {
          title: "14.2 Flask-Login 与安全 Session",
          content: `<p>Flask-Login 管理 current_user、login_required、登录/登出和 remember cookie，但不会替你做权限模型。user_loader 从 Session 中的用户 ID 加载用户。登录成功前校验 next 参数只能跳转到本站，防止开放重定向。</p>
          ${B("python", `from flask_login import LoginManager, login_required, login_user, logout_user

login_manager = LoginManager()
login_manager.login_view = "auth.login"

@login_manager.user_loader
def load_user(user_id: str):
    return db.session.get(User, int(user_id))

@bp.post("/login")
def login():
    user = db.session.scalar(select(User).where(User.email == form.email.data))
    if user is None or not user.check_password(form.password.data):
        return render_template("auth/login.html", error="邮箱或密码错误"), 401
    login_user(user, remember=form.remember.data, fresh=True)
    return redirect(url_for("main.index"))

@bp.post("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("main.index"))`)}
          <p>登出改变状态，应使用 POST 并带 CSRF，不用 GET。敏感操作可要求 fresh login。配置 Secure、HttpOnly、SameSite，并在 HTTPS 反向代理下正确识别原始协议。</p>`
        },
        {
          title: "14.3 授权：对象级权限而不只是角色",
          content: `<p>RBAC 通过角色聚合权限，例如 admin/editor/viewer；但还需对象级授权：普通用户只能编辑自己的文章。前端隐藏按钮只是体验，后端每个读写接口都必须检查。</p>
          ${B("python", `from functools import wraps
from flask_login import current_user

def permission_required(permission):
    def decorator(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            if not current_user.can(permission):
                abort(403)
            return view(*args, **kwargs)
        return wrapped
    return decorator

@bp.patch("/articles/<int:article_id>")
@login_required
def update_article(article_id):
    article = db.get_or_404(Article, article_id)
    if article.author_id != current_user.id and not current_user.can("article:any_edit"):
        abort(403)
    return service.update(article, request.get_json())`)}
          <p>防止 IDOR（不安全直接对象引用）：不能因为用户猜到 /orders/123 就返回订单。查询时可直接限定 owner_id，避免先拿到再忘记检查。</p>`
        },
        {
          title: "14.4 XSS、CSRF、SQL 注入与文件风险",
          content: `<table class="data-table"><thead><tr><th>风险</th><th>根因</th><th>主要防护</th></tr></thead><tbody><tr><td>XSS</td><td>不可信内容作为 HTML/脚本执行</td><td>输出转义、text()、CSP、富文本白名单</td></tr><tr><td>CSRF</td><td>浏览器自动携带认证 Cookie</td><td>CSRF Token、SameSite、验证 Origin</td></tr><tr><td>SQL 注入</td><td>拼接 SQL 结构</td><td>参数绑定、ORM、输入白名单</td></tr><tr><td>路径穿越</td><td>用户输入拼文件路径</td><td>安全文件名、固定根目录、随机存储名</td></tr><tr><td>SSRF</td><td>服务端请求用户提供 URL</td><td>域/IP 白名单、阻断内网与重定向</td></tr></tbody></table>
          ${B("python · 错误与正确 SQL", `# 错误：用户输入改变 SQL 结构
sql = "SELECT * FROM users WHERE email = '" + email + "'"

# 正确：参数与 SQL 结构分离
user = db.session.scalar(select(User).where(User.email == email))

# 原生 SQL 也必须绑定参数
row = db.session.execute(
    text("SELECT id FROM users WHERE email = :email"),
    {"email": email},
).first()`)}
          ${W("ORM 降低 SQL 注入风险，但动态排序字段、原生 text、LIKE 通配和拼接表名仍需白名单。任何安全防护都要结合上下文，而不是依赖单个库。")}`
        },
        {
          title: "14.5 安全基线与上线检查",
          content: `<ul><li>生产关闭 debug，异常不返回堆栈；依赖保持更新并扫描漏洞。</li><li>所有入口做长度、类型、格式和权限验证；上传限制大小、类型并隔离存储。</li><li>HTTPS 全站启用；Cookie 安全属性；SECRET_KEY 与数据库凭据由环境注入。</li><li>设置 CSP、X-Content-Type-Options、Referrer-Policy、合理的 frame-ancestors。</li><li>登录、验证码、重置、敏感 API 做限速；关键操作留审计日志。</li><li>数据库最小权限、定期加密备份并实际演练恢复。</li></ul>
          <p>安全日志记录谁、何时、对什么资源、做了什么、结果如何，但不记录密码、完整 Token、Session Cookie 和敏感个人信息。对用户返回 request_id，内部用它关联日志。</p>
          ${P("为示例应用补齐：密码哈希、登录/登出 POST、login_required、任务所有权、CSRF、Cookie 安全配置、统一 401/403 JSON 错误与登录限速设计。")}`
        }
      ],
      quiz: {question: "模板中隐藏‘删除’按钮是否足以完成授权？", options: ["足够，因为用户看不到", "不足，后端接口必须再次检查角色和资源所有权", "只需把按钮设为 disabled", "只要使用 HTTPS 就足够"], answer: 1}
    },
    {
      title: "表单验证、文件上传与常见业务能力",
      subtitle: "处理真实输入、上传、邮件、分页、搜索与后台任务边界",
      duration: "3 小时",
      keywords: "form validation Flask-WTF file upload secure_filename email pagination search background task Celery",
      intro: "真实应用不只有 CRUD。本章讲表单 Schema、文件上传、邮件、搜索与耗时任务，让你能实现常见产品需求而不破坏安全和用户体验。",
      sections: [
        {
          title: "15.1 服务端验证的层次",
          content: `<p>验证分为语法层（类型、格式、长度）、业务层（email 可用、状态允许）、权限层（当前用户可执行）和数据库约束层（唯一、外键）。WTForms/Marshmallow/Pydantic 等可减少字段解析重复，但业务规则仍需 Service/Model 承担。</p>
          ${B("python · Flask-WTF", `from flask_wtf import FlaskForm
from wtforms import BooleanField, PasswordField, StringField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, Length

class RegisterForm(FlaskForm):
    name = StringField("姓名", validators=[DataRequired(), Length(min=2, max=80)])
    email = StringField("邮箱", validators=[DataRequired(), Email(), Length(max=255)])
    password = PasswordField("密码", validators=[DataRequired(), Length(min=10, max=128)])
    confirm = PasswordField("确认密码", validators=[EqualTo("password")])
    accept_terms = BooleanField("同意条款", validators=[DataRequired()])
    submit = SubmitField("注册")`)}
          <p>先规范化再验证/存储：字符串 strip，email 统一规则，枚举转合法值。不要对密码 strip，因为空格可能是密码的一部分。错误信息既要友好，也不能暴露账户是否存在等敏感信息。</p>`
        },
        {
          title: "15.2 安全文件上传",
          content: `<p>浏览器上传使用 multipart/form-data，Flask 从 request.files 读取。原始文件名不可信，可能包含路径；扩展名也不能证明真实类型。限制请求大小、允许类型、像素/文件内容，生成随机存储名，并把上传目录与可执行代码隔离。</p>
          ${B("python", `from pathlib import Path
from uuid import uuid4
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

def save_image(file_storage, upload_dir: Path) -> str:
    original = secure_filename(file_storage.filename or "")
    extension = original.rsplit(".", 1)[-1].lower() if "." in original else ""
    if extension not in ALLOWED_EXTENSIONS:
        raise ValidationError("仅支持 PNG/JPG/WEBP")

    stored_name = f"{uuid4().hex}.{extension}"
    target = upload_dir / stored_name
    file_storage.save(target)
    return stored_name`)}
          <p>生产建议对象存储+预签名 URL；下载使用 Content-Disposition；私有文件每次下载检查权限。图像处理库要更新，解压文件需防 zip bomb 与路径穿越。</p>`
        },
        {
          title: "15.3 jQuery 使用 FormData 上传并显示进度",
          content: `${B("javascript", `const formData = new FormData($("#profile-form")[0]);

$.ajax({
  url: "/api/profile/avatar",
  method: "POST",
  data: formData,
  processData: false,   // 不让 jQuery 转成查询字符串
  contentType: false,  // 让浏览器设置含 boundary 的 multipart 类型
  xhr: function () {
    const xhr = $.ajaxSettings.xhr();
    xhr.upload.addEventListener("progress", function (event) {
      if (event.lengthComputable) {
        const percent = Math.round(event.loaded / event.total * 100);
        $("#upload-progress").val(percent).text(percent + "%");
      }
    });
    return xhr;
  }
}).done(function (response) {
  $("#avatar").attr("src", response.data.url);
});`)}
          <p><code>processData:false</code> 和 <code>contentType:false</code> 是 FormData 的关键。前端可预览和检查大小，但后端必须重复验证。对象 URL 用完应 revokeObjectURL。</p>`
        },
        {
          title: "15.4 邮件、搜索与后台任务",
          content: `<p>注册邮件、报告生成等慢任务不应阻塞请求。请求中创建任务记录并放入队列，立刻返回 202 + task_id；后台 Worker 执行，前端轮询状态或使用 SSE/WebSocket。Celery/RQ 需要 Redis/RabbitMQ 等基础设施，小项目先评估复杂度。</p>
          ${B("json · 异步任务响应", `{
  "data": {
    "task_id": "report_8f31",
    "status": "queued",
    "status_url": "/api/jobs/report_8f31"
  }
}`)}
          <p>邮件包含一次性 Token 链接，不在 URL 中放敏感明文。搜索先从数据库索引和 LIKE/全文搜索开始；规模上升再引入 Elasticsearch 等系统。所有外部调用设置连接/读取超时、有限重试和幂等。</p>
          ${P("实现头像上传：前端预览/进度，后端 2MB 限制、白名单、随机文件名；再设计一个导出 CSV 的异步任务状态 API。")}`
        }
      ],
      quiz: {question: "使用 FormData 上传文件时，jQuery $.ajax 的关键配置是？", options: ["dataType: 'html'", "processData:false 且 contentType:false", "async:false", "cache:true"], answer: 1}
    },
    {
      title: "测试、调试、日志与代码质量",
      subtitle: "用 pytest 建立安全网，系统定位前后端与数据库问题",
      duration: "3.5 小时",
      keywords: "pytest unit integration test fixture client mock coverage debug logging traceback lint format type",
      intro: "可维护项目的标志不是从不出错，而是错误能被快速发现、定位且不会反复出现。本章覆盖单元测试、接口集成测试、数据库隔离、前端调试、结构化日志和质量工具。",
      sections: [
        {
          title: "16.1 测试金字塔与测试边界",
          content: `<p><strong>单元测试</strong>验证纯函数、领域对象和服务规则，快且定位精确；<strong>集成测试</strong>验证 Flask 路由、数据库、序列化等组合；<strong>端到端测试</strong>驱动真实浏览器验证关键用户路径，数量少但价值高。不要只追求覆盖率数字，要覆盖业务风险和边界条件。</p>
          <p>每个测试遵循 Arrange—Act—Assert：准备数据、执行行为、断言结果。测试名描述场景与期望，例如 <code>test_create_task_rejects_blank_title</code>。一个测试只验证一个核心行为，但可以有多个相关断言。</p>
          ${B("python · 纯单元测试", `import pytest

def test_money_rejects_negative_amount():
    with pytest.raises(ValueError, match="不能为负"):
        Money(Decimal("-0.01"))

def test_vip_discount_has_upper_limit():
    strategy = VipDiscount()
    assert strategy.discount(100_000) == 5_000`)}
          ${N("先测试业务核心，再测试框架胶水。能写出简单测试通常也说明职责边界足够清晰。")}`
        },
        {
          title: "16.2 pytest Fixture 与 Flask 测试客户端",
          content: `${B("python · tests/conftest.py", `import pytest
from app import create_app
from app.extensions import db

@pytest.fixture()
def app():
    app = create_app("config.TestingConfig")
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def user(app):
    user = User(email="test@example.com", name="Tester")
    user.set_password("safe-password-123")
    db.session.add(user)
    db.session.commit()
    return user`)}
          ${B("python · API 测试", `def test_create_task_returns_201(client, auth_headers):
    response = client.post(
        "/api/tasks",
        json={"title": "write tests", "priority": 2},
        headers=auth_headers,
    )

    assert response.status_code == 201
    payload = response.get_json()
    assert payload["data"]["title"] == "write tests"

def test_create_task_rejects_blank_title(client, auth_headers):
    response = client.post("/api/tasks", json={"title": "  "}, headers=auth_headers)
    assert response.status_code == 422
    assert "title" in response.get_json()["error"]["fields"]`)}
          <p>测试配置使用独立数据库、关闭真实邮件/支付、启用 TESTING。测试之间必须隔离，不能依赖执行顺序。SQLite 与生产 PostgreSQL 行为有差异，关键 SQL 最终要在同类型数据库的 CI 环境测试。</p>`
        },
        {
          title: "16.3 Mock、Fake 与外部依赖",
          content: `<p>Mock 用于验证协作调用，Fake 是可工作的简化实现。优先依赖注入 Fake，而不是对深层模块路径打补丁。不要 mock 被测对象内部细节，否则重构会导致大量无意义测试失败。</p>
          ${B("python", `class FakePaymentGateway:
    def __init__(self, should_fail=False):
        self.should_fail = should_fail
        self.charges = []

    def charge(self, amount_cents):
        if self.should_fail:
            raise PaymentUnavailable("gateway offline")
        self.charges.append(amount_cents)
        return Receipt(id="fake-receipt")

def test_order_payment_charges_exact_total():
    gateway = FakePaymentGateway()
    service = OrderService(FakeOrderRepo(), gateway, FakeNotifier())
    service.pay(order_id=1)
    assert gateway.charges == [12_500]`)}
          <p>时间、随机数、网络和队列都是需控制的非确定性边界。外部 HTTP 客户端设置超时，并在测试中模拟成功、超时、4xx、5xx 与畸形响应。</p>`
        },
        {
          title: "16.4 前后端联合调试方法",
          content: `<ol><li>在 Network 确认请求是否真正发出、URL/方法是否正确。</li><li>检查请求头 Content-Type/CSRF/Cookie 和 Payload。</li><li>查看 Flask 访问日志，确认是否匹配路由以及状态码。</li><li>读 traceback 第一个项目代码位置，检查变量值与输入。</li><li>打开 SQL 日志确认查询和参数，必要时在事务内复现。</li><li>检查响应状态、Content-Type、JSON 结构，再看前端回调是否正确处理。</li><li>检查 DOM 是否存在、选择器是否命中、事件是否重复绑定。</li></ol>
          ${B("javascript · 全局开发期诊断", `$(document).ajaxError(function (_event, xhr, settings, error) {
  console.error("AJAX failed", {
    url: settings.url,
    method: settings.type,
    status: xhr.status,
    response: xhr.responseJSON || xhr.responseText,
    error: error
  });
});`)}
          <p>全局 ajaxError 适合诊断/监控，不应替代组件自己的用户反馈。禁止使用同步 AJAX（async:false），它会冻结页面。</p>`
        },
        {
          title: "16.5 日志、质量工具与持续集成",
          content: `<p>日志级别：DEBUG 诊断细节；INFO 关键正常事件；WARNING 可恢复异常；ERROR 请求失败；CRITICAL 服务不可用。使用参数化日志而非先拼字符串；日志包含 request_id/user_id/resource_id，但对个人信息做最小化。</p>
          ${B("python", `current_app.logger.info(
    "task created",
    extra={
        "request_id": g.request_id,
        "user_id": current_user.id,
        "task_id": task.id,
    },
)

try:
    payment.charge(total)
except PaymentError:
    current_app.logger.exception("payment failed")
    raise`)}
          <p>推荐组合：Ruff 做 lint/格式，mypy 做类型检查，pytest 做测试与覆盖率，pre-commit 在提交前运行快速检查，CI 在每次推送执行完整检查和安全扫描。工具规则从小集合开始，避免一次引入大量噪声。</p>
          ${P("为注册、登录、创建/修改/删除任务各写成功和失败测试；模拟未登录、无权限、重复 email、空标题、数据库冲突；确保测试可重复独立运行。")}`
        }
      ],
      quiz: {question: "哪类逻辑最适合优先写快速单元测试？", options: ["纯业务规则与值对象", "浏览器完整登录流程", "真实第三方支付网络", "生产负载均衡器"], answer: 0}
    },
    {
      title: "性能、缓存、并发与可观测性",
      subtitle: "先测量瓶颈，再优化查询、响应与耗时工作",
      duration: "2.5 小时",
      keywords: "performance cache Redis concurrency async Celery Gunicorn profiling metrics tracing pagination compression CDN",
      intro: "性能优化的第一原则是测量。多数 Flask 应用的瓶颈来自数据库查询、外部 I/O 和返回过多数据，而不是 Python 语法。本章建立从浏览器到数据库的性能诊断与扩展方法。",
      sections: [
        {
          title: "17.1 性能预算与测量",
          content: `<p>先定义目标：P95 API 延迟、吞吐、错误率、页面核心指标、数据库查询次数。浏览器看 Network Timing 与 Performance；服务器记录每请求耗时；数据库看慢查询和 EXPLAIN；压力测试在与生产相似环境进行。</p>
          ${B("python · 请求计时", `import time
from uuid import uuid4

@app.before_request
def start_timer():
    g.started_at = time.perf_counter()
    g.request_id = request.headers.get("X-Request-ID", uuid4().hex)

@app.after_request
def log_request(response):
    duration_ms = (time.perf_counter() - g.started_at) * 1000
    response.headers["X-Request-ID"] = g.request_id
    current_app.logger.info(
        "request completed method=%s path=%s status=%s duration_ms=%.1f",
        request.method, request.path, response.status_code, duration_ms,
    )
    return response`)}
          <p>平均值会掩盖长尾，关注 P50/P95/P99。优化前保留基线，优化后用相同负载比较。不要在生产日志记录完整请求体。</p>`
        },
        {
          title: "17.2 数据库与 API 优化顺序",
          content: `<ol><li>消除 N+1，选择正确关联加载。</li><li>只选择需要列，列表不返回大文本/Blob。</li><li>增加由真实查询证明需要的复合索引。</li><li>分页并限制 per_page；大数据使用游标分页。</li><li>批量写入/更新，减少往返。</li><li>缩短事务，检查锁等待。</li></ol>
          <p>API 支持字段筛选、条件请求和压缩；静态文件交给 Web 服务器/CDN，使用带内容哈希文件名和长期缓存。避免将每个请求都需要的数据重复计算。</p>
          ${B("http · 条件缓存", `ETag: "task-list-user42-v8"
Cache-Control: private, max-age=60

GET /api/tasks HTTP/1.1
If-None-Match: "task-list-user42-v8"

HTTP/1.1 304 Not Modified`)}
          <p>含用户私有数据不能标记 public。缓存键必须包含所有影响结果的维度（用户、语言、权限、查询参数），否则会造成数据泄漏。</p>`
        },
        {
          title: "17.3 Redis 缓存与失效策略",
          content: `<p>Cache-aside：先读缓存，未命中查数据库并写缓存。难点不是 set/get，而是失效：数据更新后删哪些键、并发击穿怎么办、过期时间如何抖动。缓存是派生数据，数据库通常是真源。</p>
          ${B("python · 伪代码", `def get_public_article(article_id: int):
    key = f"article:v2:{article_id}"
    cached = redis.get(key)
    if cached:
        return json.loads(cached)

    article = repository.get_published_or_fail(article_id)
    payload = ArticleDTO.from_model(article).to_dict()
    redis.setex(key, 300, json.dumps(payload, ensure_ascii=False))
    return payload

def update_article(article_id: int, command):
    article = repository.update(article_id, command)
    redis.delete(f"article:v2:{article_id}")
    return article`)}
          <p>不要缓存高度个性化敏感响应，除非键和隔离经过审查。缓存短暂不可用时应降级访问数据库而非整个服务崩溃，同时防止雪崩。</p>`
        },
        {
          title: "17.4 WSGI 并发、后台任务与实时能力",
          content: `<p>Flask WSGI 应用由生产服务器的多个进程/线程处理请求。进程内全局变量不能作为共享状态或锁，因为多进程不共享且重启丢失。共享状态放数据库/Redis。CPU 密集工作会占用 Worker，I/O 慢调用也需超时。</p>
          <p>长任务放队列；定时任务使用调度器但保证幂等与单实例；实时单向通知可考虑 SSE，双向通信用 WebSocket，但会改变部署模型。先确认轮询无法满足再增加基础设施。</p>
          ${W("debug 重载器会启动额外进程，开发时把任务调度放应用启动代码可能执行两次。生产也可能多个 Worker 各执行一次。调度必须独立或使用分布式锁。")}`
        },
        {
          title: "17.5 可观测性与容量思维",
          content: `<p>可观测性三支柱：日志解释离散事件，指标显示趋势和告警，追踪串联跨服务调用。至少监控请求量、延迟、错误率、数据库连接池、队列积压、Worker 使用率、缓存命中率和磁盘。</p>
          <p>健康检查分 liveness（进程活着）和 readiness（能否接流量）。readiness 可检查关键依赖但要轻量。告警围绕用户影响与服务目标，不为每个单次 500 叫醒人。</p>
          ${P("为任务列表记录请求耗时和 SQL 次数；制造 N+1 并修复；加入 per_page 上限；设计私有响应 Cache-Control；列出服务的 6 个核心监控指标。")}`
        }
      ],
      quiz: {question: "给用户私有任务列表做缓存时最重要的缓存键维度是？", options: ["只使用固定字符串 tasks", "至少包含用户身份和影响结果的查询条件", "只包含当天日期", "只包含浏览器名称"], answer: 1}
    },
    {
      title: "生产部署与毕业全栈项目",
      subtitle: "从本地代码到线上服务，并用完整项目完成能力闭环",
      duration: "5 小时 + 项目",
      keywords: "deployment production Gunicorn Waitress Nginx reverse proxy Docker env database migration backup CI CD checklist capstone",
      intro: "最后一章把应用交付到生产，并给出一个可独立完成的任务协作系统规格。完成验收清单后，你已经具备从需求、建模、接口、前端到部署的完整开发路径。",
      sections: [
        {
          title: "18.1 开发服务器与生产服务器的区别",
          content: `<p><code>app.run(debug=True)</code> 只为开发，性能、安全和稳定性都不适合公网。生产使用 WSGI 服务器：Linux 常用 Gunicorn，Windows 可用 Waitress；前面通常有 Nginx/平台代理负责 TLS、静态资源、请求大小和超时。</p>
          ${B("bash · Linux Gunicorn", `gunicorn "run:create_app()" \
  --bind 0.0.0.0:8000 \
  --workers 4 \
  --threads 2 \
  --timeout 30 \
  --access-logfile - \
  --error-logfile -`)}
          ${B("powershell · Windows Waitress", `waitress-serve --host=0.0.0.0 --port=8000 --call run:create_app`)}
          <p>Worker 数量需要压测，不能机械套公式。反向代理后使用 ProxyFix 时只信任实际代理层数，错误配置会让攻击者伪造来源协议/IP。静态文件可由 Nginx/CDN 服务，小站也可由平台托管。</p>`
        },
        {
          title: "18.2 配置、数据库迁移与发布流程",
          content: `<p>一次可靠发布：CI 运行 lint/类型/测试 → 构建不可变制品 → 备份数据库 → 执行兼容迁移 → 部署新版本 → 健康检查与冒烟测试 → 观察指标 → 必要时回滚代码。迁移回滚常比代码回滚难，因此 schema 采用向前兼容的扩展/收缩策略。</p>
          ${B("text · 生产环境变量示例", `FLASK_ENV=production
SECRET_KEY=<随机长密钥，由平台注入>
DATABASE_URL=postgresql+psycopg://user:password@db/app
SESSION_COOKIE_SECURE=true
LOG_LEVEL=INFO
MAIL_API_KEY=<秘密>
REDIS_URL=redis://redis:6379/0`)}
          <p>密钥不写镜像、不写日志、不放前端。数据库连接池大小要与 Worker 总数和数据库上限匹配。发布前确认迁移、备份与恢复流程，发布后检查 5xx、延迟、登录和核心写路径。</p>`
        },
        {
          title: "18.3 Docker 与部署平台的最低认知",
          content: `<p>容器把运行时、依赖和应用打包成一致镜像，但数据库和上传文件不能随容器生命周期消失。使用非 root 用户、多阶段构建、固定依赖版本、.dockerignore、健康检查。配置在运行时注入。</p>
          ${B("dockerfile", `FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

RUN useradd --create-home appuser
USER appuser

EXPOSE 8000
CMD ["gunicorn", "run:app", "--bind", "0.0.0.0:8000", "--workers", "3"]`)}
          <p>镜像内不运行开发重载器。多个服务用托管数据库/Redis；上传使用持久卷或对象存储。Docker Compose 适合本地组合依赖，不等同于完整生产编排。</p>`
        },
        {
          title: "18.4 毕业项目：TaskFlow 协作任务系统",
          content: `<p><strong>产品目标：</strong>用户注册登录后创建项目，在项目内管理任务、成员和评论；列表支持筛选、分页和 AJAX 局部更新。管理员能审计异常操作。这个规模覆盖全栈核心，又能逐步迭代。</p>
          <table class="data-table"><thead><tr><th>迭代</th><th>功能</th><th>验收重点</th></tr></thead><tbody><tr><td>M1</td><td>用户、项目、任务基础 CRUD</td><td>应用工厂、蓝图、模型迁移、模板继承</td></tr><tr><td>M2</td><td>Session 登录、成员角色、对象权限</td><td>密码哈希、CSRF、401/403、所有权</td></tr><tr><td>M3</td><td>jQuery AJAX 创建/编辑/删除/筛选</td><td>JSON 契约、422 字段错误、加载/回滚</td></tr><tr><td>M4</td><td>评论、头像、邮件通知、审计</td><td>安全上传、后台任务、日志</td></tr><tr><td>M5</td><td>测试、性能、容器与部署</td><td>关键路径测试、N+1、备份、HTTPS</td></tr></tbody></table>
          ${B("text · 核心数据模型", `User(id, email, name, password_hash, role, created_at)
Project(id, name, owner_id, created_at)
Membership(user_id, project_id, role)
Task(id, project_id, assignee_id, title, description,
     status, priority, due_at, version, created_at, updated_at)
Comment(id, task_id, author_id, body, created_at)
AuditLog(id, actor_id, action, resource_type,
         resource_id, metadata_json, created_at)`)}
          <p>先画实体关系与权限矩阵，再设计 URL 和 JSON；随后后端测试驱动实现 API，最后接 jQuery。不要先花大量时间做视觉而业务边界未确定。每次只完成一条可运行的纵向切片。</p>`
        },
        {
          title: "18.5 从零开发的标准操作清单",
          content: `<ol><li><strong>需求：</strong>写用户故事、输入输出、异常与非功能要求。</li><li><strong>建模：</strong>实体、关系、约束、状态转换、权限矩阵。</li><li><strong>契约：</strong>路由、方法、JSON Schema、状态码、错误码、分页。</li><li><strong>工程：</strong>虚拟环境、应用工厂、蓝图、配置、扩展、迁移。</li><li><strong>后端：</strong>DTO 校验 → Service 规则 → ORM 事务 → Route 响应。</li><li><strong>前端：</strong>语义 HTML → 组件根节点 → 事件委托 → AJAX → 全状态 UI。</li><li><strong>安全：</strong>认证、对象授权、CSRF、XSS 输出、上传、限速、秘密。</li><li><strong>质量：</strong>单元/接口测试、格式/类型、日志、错误追踪。</li><li><strong>性能：</strong>测量、查询次数、索引、分页、缓存边界。</li><li><strong>交付：</strong>生产服务器、环境变量、迁移、HTTPS、备份、监控和回滚。</li></ol>
          ${N("真正独立开发的标准：你能在没有教程逐行指引时，把一个模糊需求拆成数据模型、权限、接口、页面状态与测试，并能解释每个选择的代价。")}`
        },
        {
          title: "18.6 毕业验收：做到这些就算真正入门",
          content: `<ul><li>能从空目录创建应用工厂、蓝图、配置和数据库迁移。</li><li>能解释 request/form/json/files 的差别，并设计一致 JSON 错误结构。</li><li>能用 OOP 将领域对象、服务与外部依赖分开，而不过度设计。</li><li>能设计一对多、多对多模型，正确处理事务、唯一约束、分页和 N+1。</li><li>能完成注册登录、Session、CSRF、对象级权限、密码重置基本设计。</li><li>能用 jQuery 事件委托与 AJAX 完成 CRUD，处理加载、空、成功、422、401、409、500 和断网。</li><li>能解释并防御 XSS、CSRF、SQL 注入、IDOR、恶意上传。</li><li>能写业务单测与 API 集成测试，借助 Network、日志和 SQL 逐层排错。</li><li>能使用生产 WSGI 服务、环境变量、数据库备份迁移与 HTTPS 上线。</li><li>能在 README 中清楚写出安装、配置、迁移、运行、测试和部署方法。</li></ul>
          ${P("关掉本手册，从空目录独立完成 TaskFlow 的 M1；遇到问题先自己定位所属层，再回来搜索。完成后让另一位使用者按 README 在新环境启动并完成一次注册—建项目—建任务—退出流程。")}`
        }
      ],
      quiz: {question: "生产部署 Flask 时，哪项做法正确？", options: ["直接暴露 debug 开发服务器", "把 SECRET_KEY 提交到 Git", "使用 WSGI 服务器、环境变量、迁移备份与 HTTPS", "把上传文件只放容器临时层"], answer: 2}
    }
  ];

  const pythonAdvanced = {
    title: "Python 进阶机制与工程能力",
    subtitle: "装饰器、生成器、类型系统、上下文与并发模型",
    duration: "4 小时",
    keywords: "decorator closure iterator generator typing Protocol Generic context manager async await thread process GIL packaging",
    intro: "这一章补齐从“会写 Python”到“能读懂 Flask 与第三方库源码”之间的知识。重点不是炫技，而是知道装饰器、生成器、类型协议和并发模型为什么会出现在真实 Web 项目里。",
    sections: [
      {
        title: "进阶 1：Python 对象模型、身份、相等与生命周期",
        content: `<p>Python 中一切皆对象。变量绑定到对象，赋值通常不会复制。<code>id()</code> 表示对象身份，<code>is</code> 比较身份，<code>==</code> 调用相等协议。除 None、True/False 等单例判断外，业务值应使用 ==。CPython 主要通过引用计数并辅以循环垃圾回收，但业务代码不应依赖具体回收时刻释放关键资源。</p>
        ${B("python", `a = {"roles": ["editor"]}
b = a
c = a.copy()

assert a is b
assert a is not c
assert a == c

c["roles"].append("admin")
assert a["roles"] == ["editor", "admin"]  # 浅复制共享嵌套列表

# 资源生命周期用 with 明确表达，不依赖 __del__
with open("audit.log", "a", encoding="utf-8") as stream:
    stream.write("user logged in\\n")`)}
        <p>不可变对象更适合做值对象和缓存键；可变对象需要明确所有权。ORM Session 中同一主键通常由 identity map 保持为同一实例，这会影响对象比较、缓存和测试。</p>`
      },
      {
        title: "进阶 2：闭包、作用域与装饰器",
        content: `<p>闭包让内部函数记住外层局部变量。查找遵循 LEGB：Local、Enclosing、Global、Built-in。装饰器接收函数并返回新函数，Flask 的 route、login_required、缓存和权限校验都依赖它。必须用 functools.wraps 保留原函数名称和文档，否则 Flask endpoint 或调试工具可能混乱。</p>
        ${B("python", `from functools import wraps
from time import perf_counter

def timed(label: str):
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            started = perf_counter()
            try:
                return function(*args, **kwargs)
            finally:
                elapsed = (perf_counter() - started) * 1000
                print(f"{label}: {elapsed:.1f}ms")
        return wrapper
    return decorator

@timed("load users")
def load_users(page: int):
    return repository.list(page)`)}
        <p>装饰器执行顺序从下往上包裹，调用时从上往下进入。需要参数的装饰器通常三层函数。不要让通用装饰器偷偷修改数据库事务或吞异常。</p>`
      },
      {
        title: "进阶 3：迭代器、生成器与流式数据",
        content: `<p>可迭代对象实现 <code>__iter__</code>，迭代器还实现 <code>__next__</code>。生成器函数使用 yield，执行时返回生成器并按需产生值，适合大 CSV、日志、分页 API 或流式响应。它节省内存，但数据库连接必须在迭代结束前保持可用。</p>
        ${B("python", `from collections.abc import Iterator

def iter_user_rows(batch_size: int = 1000) -> Iterator[str]:
    yield "id,email\\n"
    last_id = 0
    while True:
        users = repository.after_id(last_id, limit=batch_size)
        if not users:
            break
        for user in users:
            yield f"{user.id},{user.email}\\n"
        last_id = users[-1].id

@bp.get("/exports/users.csv")
def export_users():
    return current_app.response_class(
        iter_user_rows(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=users.csv"},
    )`)}
        <p>生成器只能消费一次。yield from 可转发子生成器。流式输出已发送的部分无法轻易撤回，因此尽量在开始响应前完成权限和参数检查。</p>`
      },
      {
        title: "进阶 4：类型标注、Protocol、泛型与边界",
        content: `<p>类型标注描述开发时契约。Protocol 支持结构化子类型：对象只要具有所需方法就符合协议，无需显式继承。Generic 让容器/仓储保留元素类型。<code>Any</code> 会关闭检查，应集中在外部库或动态 JSON 边界，验证后转换为明确 DTO。</p>
        ${B("python", `from dataclasses import dataclass
from typing import Generic, Protocol, TypeVar

T = TypeVar("T")

class Repository(Protocol, Generic[T]):
    def get(self, entity_id: int) -> T | None: ...
    def save(self, entity: T) -> None: ...

@dataclass(frozen=True)
class CreateTask:
    title: str
    owner_id: int

class TaskService:
    def __init__(self, repository: Repository[Task]) -> None:
        self.repository = repository`)}
        <p>运行时输入验证与静态类型检查解决不同问题。HTTP JSON 即使被标注 dict 也仍然不可信。推荐逐步给公共函数、Service 和 DTO 加类型，而非一次给所有局部变量加注解。</p>`
      },
      {
        title: "进阶 5：上下文管理器、描述符与 dataclass 深入",
        content: `<p>上下文管理器用 <code>__enter__/__exit__</code> 或 contextlib.contextmanager 实现，适合事务、计时、临时目录、锁。property 本质上是描述符；SQLAlchemy mapped_column 和 relationship 也利用描述符拦截属性访问。</p>
        ${B("python", `from contextlib import contextmanager

@contextmanager
def transaction(session):
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise

with transaction(db.session) as session:
    session.add(Order(user_id=42))
    session.add(AuditLog(action="order.created"))`)}
        <p>dataclass 的 frozen 表达值对象不可变，slots 可减少大量实例内存，但会影响动态属性与部分框架。领域实体是否使用 dataclass 取决于 ORM 集成，不要为了少写 __init__ 强行套用。</p>`
      },
      {
        title: "进阶 6：线程、进程、asyncio 与 GIL",
        content: `<p>I/O 密集任务大部分时间等待网络/磁盘，可用线程或异步并发；CPU 密集任务需要多进程或专门计算服务。CPython 的 GIL 使同一进程多个线程不能同时执行多数 Python 字节码，但 I/O 等待时会释放。并发不等于并行。</p>
        <table class="data-table"><thead><tr><th>模型</th><th>适合</th><th>主要风险</th></tr></thead><tbody><tr><td>线程</td><td>少量阻塞 I/O、现有同步库</td><td>共享状态竞态、上下文传递</td></tr><tr><td>多进程</td><td>CPU 密集、进程隔离</td><td>序列化与内存开销</td></tr><tr><td>asyncio</td><td>大量并发 I/O 且全链路异步</td><td>同步阻塞调用卡住事件循环</td></tr><tr><td>任务队列</td><td>长任务、重试、跨请求</td><td>幂等、监控、最终一致性</td></tr></tbody></table>
        ${B("python", `import asyncio

async def fetch_profile(client, user_id: int):
    response = await client.get(f"/users/{user_id}", timeout=5.0)
    response.raise_for_status()
    return response.json()

async def fetch_many(client, user_ids):
    return await asyncio.gather(
        *(fetch_profile(client, user_id) for user_id in user_ids)
    )`)}
        <p>传统 Flask 是 WSGI/同步请求模型，即使允许 async view，部署栈与扩展也可能同步。不要仅因看到 async 关键字就获得性能；先确认等待点、驱动支持和并发上限。</p>`
      },
      {
        title: "进阶 7：包管理、pyproject 与可维护代码",
        content: `<p>requirements.txt 适合部署固定依赖；pyproject.toml 可统一项目元数据、构建系统和 Ruff/pytest/mypy 配置。直接依赖与间接依赖要区分，升级需阅读变更记录并运行测试。锁定版本不是永不升级，而是让升级成为可控事件。</p>
        ${B("toml · pyproject.toml", `[project]
name = "taskflow"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
  "Flask>=3.1,<4",
  "Flask-SQLAlchemy>=3.1,<4",
]

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-q"

[tool.ruff]
line-length = 100
target-version = "py311"`)}
        <p>模块导入不应执行数据库连接、网络请求或不可逆动作。公共模块写清接口，副作用放函数中，启动入口显式调用。这样测试收集、CLI 和多 Worker 启动更稳定。</p>
        ${P("给现有 TaskService 定义 Repository Protocol 与内存 Fake；写 timed 装饰器；用生成器导出 10 万条模拟任务但保持低内存；为公共 API 补完整类型标注。")}`
      }
    ],
    quiz: {question: "Flask 的 route 装饰器为什么通常需要保留原函数元数据？", options: ["让数据库更快", "endpoint、调试和文档工具可能依赖函数名称与签名", "否则 JSON 不能解析", "为了绕过 GIL"], answer: 1}
  };

  const apiDesign = {
    title: "REST API 设计、校验与长期演进",
    subtitle: "从能调用的接口走向稳定、可文档化、可兼容的契约",
    duration: "4 小时",
    keywords: "REST API schema validation pagination filtering sorting idempotency ETag version OpenAPI webhook",
    intro: "API 是前后端和第三方之间的长期合同。本章深入资源建模、字段校验、分页筛选、幂等、并发控制、版本管理和 OpenAPI，使接口不因业务增长而迅速失控。",
    sections: [
      {
        title: "API 1：从业务动作识别资源与边界",
        content: `<p>先识别稳定名词：用户、项目、任务、成员关系、评论，再决定集合与单项 URL。路由不等同于数据库表；例如当前用户资料可用 <code>/api/me</code>，项目邀请是有生命周期的资源，可建 <code>/projects/8/invitations</code>。</p>
        ${B("text", `GET    /api/projects                 # 项目集合
POST   /api/projects                 # 创建项目
GET    /api/projects/42              # 单个项目
PATCH  /api/projects/42              # 部分更新
DELETE /api/projects/42              # 删除

GET    /api/projects/42/tasks        # 项目下任务集合
POST   /api/projects/42/tasks
POST   /api/tasks/91/transitions     # 状态转换命令/资源`)}
        <p>不要把所有行为都做成 <code>/doSomething</code>，也不要为追求纯 REST 扭曲业务。关键是语义一致、可预测、权限边界清晰。嵌套 URL 通常不超过两层，深层关系可用过滤参数表达。</p>`
      },
      {
        title: "API 2：输入 Schema、字段白名单与规范化",
        content: `<p>Schema 应区分创建、整体替换、部分更新和响应。PATCH 中字段缺失表示不改变，显式 null 可能表示清空；禁止客户端写 id、owner_id、created_at 等服务器字段。先解析类型与长度，再在 Service 验证跨字段/数据库规则。</p>
        ${B("python · 手写轻量校验", `ALLOWED_UPDATE_FIELDS = {"title", "description", "priority", "due_at"}

def parse_task_patch(data: object) -> dict:
    if not isinstance(data, dict):
        raise InvalidPayload("必须是 JSON 对象")

    unknown = set(data) - ALLOWED_UPDATE_FIELDS
    if unknown:
        raise InvalidPayload(f"不支持字段: {sorted(unknown)}")

    result = {}
    if "title" in data:
        title = str(data["title"]).strip()
        if not 1 <= len(title) <= 120:
            raise FieldError("title", "长度必须在 1 到 120 之间")
        result["title"] = title
    return result`)}
        <p>Schema 库可以生成错误与文档，但不要让 ORM 模型直接接收任意 payload。规范化规则必须一致，否则注册保存的 email 与登录查询规则不同会产生幽灵账号。</p>`
      },
      {
        title: "API 3：分页、筛选、排序、搜索与字段选择",
        content: `<p>列表接口必须限制返回规模。页码分页易理解，但数据频繁变化时可能重复/遗漏；游标分页以稳定排序键继续，适合时间线和大数据。所有排序字段建立白名单，不能把用户字符串拼进 SQL ORDER BY。</p>
        ${B("http", `GET /api/tasks?
  project_id=42&
  status=todo,in_progress&
  assignee_id=7&
  q=flask&
  sort=-created_at,title&
  page=2&
  per_page=20`)}
        ${B("json · 游标分页", `{
  "data": [{"id": 91, "title": "Review API"}],
  "meta": {
    "has_more": true,
    "next_cursor": "eyJpZCI6OTEsImNyZWF0ZWRfYXQiOiIyMDI2..."
  },
  "links": {
    "next": "/api/tasks?cursor=eyJpZCI6OTEs...&limit=20"
  }
}`)}
        <p>游标应签名或视作不透明字符串，客户端不能依赖其内部结构。模糊搜索要限制长度并考虑索引；复杂全文搜索再引入专用方案。</p>`
      },
      {
        title: "API 4：幂等键、重试与重复请求",
        content: `<p>网络超时不代表服务器没执行，客户端可能重试。创建支付、订单、发券等操作使用 Idempotency-Key。服务器在用户/操作范围内保存键、请求摘要、状态和响应；相同键相同请求返回原结果，相同键不同请求返回 409。</p>
        ${B("http", `POST /api/orders HTTP/1.1
Idempotency-Key: 2c15c3f8-66f0-4d18-b810-5a76d8e87b34
Content-Type: application/json

{"product_id":42,"quantity":1}`)}
        <p>GET/PUT/DELETE 在语义上幂等，但具体副作用如每次发通知可能破坏幂等。任务队列重试也需业务幂等：使用唯一约束、状态机或去重表，而不是假设只执行一次。</p>`
      },
      {
        title: "API 5：并发更新、ETag 与乐观锁",
        content: `<p>两位用户同时编辑时，最后写入会静默覆盖前者。给记录增加 version 或 updated_at，响应返回 ETag，更新时要求 If-Match。版本不匹配返回 412/409，并让用户合并或刷新。</p>
        ${B("http", `GET /api/tasks/42
→ ETag: "task-42-v7"

PATCH /api/tasks/42
If-Match: "task-42-v7"
Content-Type: application/json

{"title":"新的标题"}

→ 412 Precondition Failed
{"error":{"code":"STALE_VERSION","message":"任务已被其他用户修改"}}`)}
        <p>数据库侧可用 <code>UPDATE ... WHERE id=? AND version=?</code> 并检查影响行数，成功后 version+1。高冲突资源可能需要行锁，但锁会降低并发并引发死锁。</p>`
      },
      {
        title: "API 6：版本、OpenAPI、契约测试与 Webhook",
        content: `<p>优先做向后兼容演进：新增可选字段、保留旧字段过渡、客户端忽略未知字段。删除字段、改类型或改语义才需要新版本。版本可在 URL 或 Header，团队必须统一。OpenAPI 描述路径、Schema、认证和错误，可生成文档/客户端并做契约测试。</p>
        ${B("yaml · OpenAPI 片段", `paths:
  /api/tasks/{task_id}:
    get:
      summary: 获取任务
      parameters:
        - in: path
          name: task_id
          required: true
          schema: { type: integer }
      responses:
        "200":
          description: 成功
        "404":
          description: 任务不存在`)}
        <p>Webhook 是你的服务器主动 POST 给订阅方。请求需签名、带事件 ID 与时间戳；接收方应快速返回 2xx，异步处理并按事件 ID 去重；发送方指数退避重试、记录投递状态并允许人工重放。</p>
        ${P("为 TaskFlow 设计 OpenAPI：至少含创建、分页列表、PATCH 乐观锁和错误 Schema；再写 6 条契约测试验证字段类型、状态码和错误码。")}`
      }
    ],
    quiz: {question: "客户端因超时重试创建订单，避免重复订单最可靠的接口设计是？", options: ["把 POST 换成 GET", "使用服务端校验的 Idempotency-Key", "让前端等待更久", "在按钮上换颜色"], answer: 1}
  };

  const flaskInternals = {
    title: "Flask 运行机制、扩展生态与深度定制",
    subtitle: "理解 WSGI、上下文、生命周期、中间件和扩展边界",
    duration: "4 小时",
    keywords: "WSGI request context application context LocalProxy middleware hook signal extension Flask-Caching Flask-Limiter mail",
    intro: "掌握常用 API 后，再理解 Flask 如何把 WSGI environ 变成 request、如何管理上下文、扩展如何绑定应用，以及中间件和代理如何改变请求。这样遇到上下文错误、代理协议和多 Worker 问题时不再靠猜。",
    sections: [
      {
        title: "机制 1：WSGI 调用协议与请求分发",
        content: `<p>WSGI 约定服务器调用 <code>application(environ, start_response)</code>。environ 包含方法、路径、请求头和输入流；应用调用 start_response 提供状态和头，再返回字节迭代器。Flask 实例本身是 WSGI application，开发服务器/Waitress/Gunicorn 是 WSGI server。</p>
        ${B("python · 极简 WSGI", `def application(environ, start_response):
    path = environ.get("PATH_INFO", "/")
    body = f"path={path}".encode("utf-8")
    start_response("200 OK", [
        ("Content-Type", "text/plain; charset=utf-8"),
        ("Content-Length", str(len(body))),
    ])
    return [body]`)}
        <p>Flask 的大致流程：创建请求上下文 → before_request → URL 匹配与视图 → 错误处理 → after_request → WSGI 响应 → teardown。响应开始发送后再抛异常，通常无法改变已发状态码。</p>`
      },
      {
        title: "机制 2：LocalProxy、应用上下文与请求上下文",
        content: `<p><code>request</code>、<code>session</code>、<code>g</code>、<code>current_app</code> 看似全局，实际是 LocalProxy，根据当前执行上下文转发到正确对象。请求上下文通常自动推入应用上下文；CLI 和测试可能需要手动 app.app_context。</p>
        ${B("python", `def rebuild_search_index(app):
    with app.app_context():
        users = db.session.scalars(select(User)).all()
        current_app.search.index(users)

# 错误：把 request 对象传给新线程后继续使用
# 正确：在线程创建前提取所需的普通值
user_id = current_user.id
locale = request.accept_languages.best_match(["zh", "en"])
queue.enqueue(send_report, user_id=user_id, locale=locale)`)}
        <p>不要在后台任务依赖请求上下文，因为请求早已结束。传稳定 ID 和普通数据，在任务中创建自己的应用上下文和数据库 Session。</p>`
      },
      {
        title: "机制 3：钩子、错误处理器与响应处理顺序",
        content: `<p>before_request 可返回响应以短路视图；after_request 必须返回 response；teardown_request 适合释放资源且不能可靠改变响应。蓝图级钩子仅作用于蓝图，app 级钩子作用全局。错误处理按异常类和状态码寻找最具体处理器。</p>
        ${B("python", `@app.before_request
def attach_request_context():
    g.request_id = request.headers.get("X-Request-ID", uuid4().hex)

@app.after_request
def add_common_headers(response):
    response.headers["X-Request-ID"] = g.request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    return response

@app.errorhandler(HTTPException)
def handle_http_error(error):
    if request.path.startswith("/api/"):
        return jsonify(error={"code": error.name.upper().replace(" ", "_"),
                              "message": error.description}), error.code
    return render_template("errors/http.html", error=error), error.code`)}
        <p>同一个异常对页面和 API 的表示不同。错误处理器自身也可能出错，务必简单，并为 404、422、500 写测试。</p>`
      },
      {
        title: "机制 4：扩展的 init_app 模式与常用生态",
        content: `<table class="data-table"><thead><tr><th>能力</th><th>常见扩展/方案</th><th>需要理解</th></tr></thead><tbody><tr><td>ORM/迁移</td><td>Flask-SQLAlchemy / Flask-Migrate</td><td>Session、事务、迁移审查</td></tr><tr><td>Session 登录</td><td>Flask-Login</td><td>不自动提供权限与 CSRF</td></tr><tr><td>表单/CSRF</td><td>Flask-WTF</td><td>API JSON Token 策略</td></tr><tr><td>缓存</td><td>Flask-Caching</td><td>键、失效、隐私</td></tr><tr><td>限速</td><td>Flask-Limiter</td><td>真实 IP、共享存储</td></tr><tr><td>邮件</td><td>Flask-Mail / API 客户端</td><td>后台任务、重试、退信</td></tr></tbody></table>
        ${B("python", `# extensions.py：只创建，暂不绑定
cache = Cache()
limiter = Limiter(key_func=get_remote_address)

# create_app 中绑定
cache.init_app(app)
limiter.init_app(app)

# 扩展使用配置集中在 Config，不散落到路由
@bp.get("/public/stats")
@cache.cached(timeout=60, key_prefix="public-stats-v2")
def public_stats():
    return jsonify(data=service.stats())`)}
        <p>选择扩展前检查维护状态、Flask 版本兼容、安全记录和可替换性。薄封装第三方服务，避免业务层到处直接调用扩展对象。</p>`
      },
      {
        title: "机制 5：WSGI 中间件、反向代理与 ProxyFix",
        content: `<p>WSGI 中间件包裹应用，可在 Flask 之外修改 environ 或响应。反向代理终止 HTTPS 后，内部请求可能看起来是 HTTP；ProxyFix 根据 X-Forwarded-* 修正，但信任层数必须与真实代理拓扑一致，否则攻击者能伪造主机、协议和来源 IP。</p>
        ${B("python", `from werkzeug.middleware.proxy_fix import ProxyFix

# 仅在前面确实恰好有一层可信代理时使用
app.wsgi_app = ProxyFix(
    app.wsgi_app,
    x_for=1,
    x_proto=1,
    x_host=1,
    x_port=1,
)

# 限速/审计使用 request.remote_addr 前先确认代理配置`)}
        <p>应用不应盲目信任 Host 头；生产配置可信主机。URL 生成在代理下必须产生 https，否则登录回调与 Secure Cookie 可能异常。</p>`
      },
      {
        title: "机制 6：Signals、CLI、Shell Context 与自定义扩展",
        content: `<p>信号用于低耦合观察事件，例如模板渲染或请求结束，但业务关键流程不应只依赖“可能无人处理”的信号。领域事件应显式持久化或通过事务性 outbox 可靠发布。CLI 适合维护操作，shell context 提供交互式调试对象。</p>
        ${B("python", `def register_shell_context(app):
    @app.shell_context_processor
    def shell_context():
        return {"db": db, "User": User, "Task": Task}

def register_commands(app):
    @app.cli.command("verify-data")
    def verify_data():
        problems = integrity_service.find_problems()
        for problem in problems:
            click.echo(problem)
        if problems:
            raise click.ClickException(f"发现 {len(problems)} 个问题")`)}
        <p>自定义扩展通常保存配置键，在 init_app 中注册钩子，并把实例放入 <code>app.extensions</code>。避免在扩展实例保存请求级可变状态。</p>
        ${P("画出一次 POST /api/tasks 从 WSGI server 到 teardown 的完整时序；实现 request_id 钩子、API/HTML 分开的错误处理、CLI 数据检查，并为三者写测试。")}`
      }
    ],
    quiz: {question: "为什么 request 看似全局却能在多个请求间隔离？", options: ["每次导入都会复制模块", "它是依据当前上下文解析实际对象的 LocalProxy", "浏览器会创建 Python 进程", "因为 Cookie 自动加密"], answer: 1}
  };

  const javascriptFoundations = {
    title: "JavaScript 必备基础：为 jQuery 打地基",
    subtitle: "变量、类型、函数、对象、异步与浏览器存储",
    duration: "5 小时",
    keywords: "JavaScript let const scope closure this array object Promise async await DOM localStorage module JSON",
    intro: "jQuery 是 JavaScript 库，不理解 JavaScript 就只能复制片段。本章从语言类型、作用域、函数和对象讲到 Promise、事件循环、模块与浏览器存储，确保你能独立修改 jQuery 代码并判断错误属于语言还是库。",
    sections: [
      {
        title: "JS 1：let、const、作用域、类型与严格相等",
        content: `<p>优先使用 <code>const</code>，需要重新赋值时使用 <code>let</code>，避免 var 的函数作用域与提升混乱。const 保证绑定不重新指向，不代表对象不可变。原始类型包括 string、number、bigint、boolean、undefined、symbol、null；对象包括普通对象、数组、函数、日期等。</p>
        ${B("javascript", `"use strict";

const user = { id: 42, name: "Lin" };
user.name = "Ada";             // 可以修改对象内容
// user = {}                    // 不可重新绑定

let page = 1;
page += 1;

console.log(typeof null);       // "object"，历史遗留
console.log(Array.isArray([])); // true
console.log(0 === "0");        // false，优先严格相等
console.log(null == undefined); // true，宽松相等会转换类型`)}
        <p>HTTP 表单值通常是字符串，必须显式 <code>Number(value)</code> 并用 Number.isFinite 检查。空字符串、0、null、undefined、NaN、false 是 falsy，但它们业务语义不同，不能一律用 <code>value || default</code>。</p>`
      },
      {
        title: "JS 2：函数、闭包、this 与箭头函数",
        content: `<p>函数声明会提升；函数表达式是值。箭头函数捕获外层 this，普通 function 的 this 由调用方式决定。jQuery 的 each/event 传统回调常让 this 指向 DOM 元素，因此不能不加思考改成箭头函数。</p>
        ${B("javascript", `function createCounter(initial) {
  let value = initial;
  return {
    increment: function () { value += 1; return value; },
    current: function () { return value; }
  };
}

const counter = createCounter(0); // 闭包保存私有 value

$(".task").each(function () {
  $(this).addClass("ready");       // this 是当前 DOM 元素
});

const controller = {
  name: "tasks",
  init: function () {
    $("#reload").on("click", () => this.reload()); // 箭头保留 controller
  },
  reload: function () { console.log(this.name); }
};`)}
        <p>把函数作为回调传递可能丢失 this，可用箭头包装或 bind。事件回调若不需要 this，显式使用 event.currentTarget 通常更清晰。</p>`
      },
      {
        title: "JS 3：数组、对象、解构与不可变更新",
        content: `<p>map 转换、filter 筛选、find 找单个、some/ every 判断、reduce 聚合。forEach 只做副作用且不能提前 break。展开语法创建浅复制，嵌套对象仍共享引用。前端状态用不可变更新更容易对比和回滚。</p>
        ${B("javascript", `const tasks = [
  { id: 1, title: "Flask", completed: false },
  { id: 2, title: "jQuery", completed: true }
];

const openTitles = tasks
  .filter(task => !task.completed)
  .map(task => task.title);

const updated = tasks.map(task =>
  task.id === 1 ? { ...task, completed: true } : task
);

const byId = Object.fromEntries(tasks.map(task => [task.id, task]));
const { title, completed = false } = byId[1];`)}
        <p>对象键默认字符串或 Symbol；来自普通对象的服务器数据需防原型污染风险，尤其不要把不可信键随意 Object.assign 到配置对象。数组排序 sort 会原地修改，复制后再排。</p>`
      },
      {
        title: "JS 4：DOM、事件循环与渲染时机",
        content: `<p>JavaScript 主线程依次执行调用栈。Promise 回调进入微任务队列，setTimeout 进入任务队列；一次任务结束后先清空微任务，再让浏览器渲染。长循环会阻塞输入、动画和页面绘制。</p>
        ${B("javascript", `console.log("A");

setTimeout(function () { console.log("D - task"); }, 0);

Promise.resolve().then(function () {
  console.log("C - microtask");
});

console.log("B");
// 输出：A、B、C、D`)}
        <p>读取布局属性后反复写样式会触发布局抖动。把 DOM 查询缓存起来，批量修改 class，动画使用 requestAnimationFrame 或 CSS transition。大计算放 Worker 或后端任务。</p>`
      },
      {
        title: "JS 5：Promise、async/await 与错误传播",
        content: `<p>Promise 表示未来完成或失败的结果，有 pending、fulfilled、rejected 三态。then 返回新 Promise，因此可以链式转换；throw 会转成 rejected；catch 处理上游失败；finally 做无论成功失败的清理。</p>
        ${B("javascript", `async function loadTask(taskId) {
  const response = await fetch("/api/tasks/" + taskId, {
    headers: { "Accept": "application/json" }
  });

  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload.error?.message || "请求失败");
    error.status = response.status;
    throw error;
  }
  return payload.data;
}

try {
  const task = await loadTask(42);
  renderTask(task);
} catch (error) {
  showToast(error.message);
} finally {
  hideLoading();
}`)}
        <p>fetch 只有网络失败才 reject，HTTP 404/500 仍需检查 response.ok；jQuery $.ajax 对非 2xx 会进入 fail。不要忘记 await，否则 try/catch 可能捕获不到异步失败。</p>`
      },
      {
        title: "JS 6：localStorage、Cookie、URL 与安全边界",
        content: `<p>localStorage 按源持久保存字符串，适合主题、非敏感草稿和偏好；sessionStorage 生命周期限标签页；Cookie 可自动随请求发送。任何页面脚本都能读取 localStorage，因此 XSS 可窃取其中 Token。敏感认证更适合 HttpOnly Cookie + CSRF 防护。</p>
        ${B("javascript", `const preference = {
  theme: "warm",
  pageSize: 20
};
localStorage.setItem("preferences-v1", JSON.stringify(preference));

let restored = {};
try {
  restored = JSON.parse(localStorage.getItem("preferences-v1") || "{}");
} catch (error) {
  localStorage.removeItem("preferences-v1");
}

const url = new URL(location.href);
url.searchParams.set("page", "2");
history.replaceState(null, "", url);`)}
        <p>浏览器存储可能满、被禁用或数据损坏，读写要容错。不要存密码、会话 Cookie、身份证等敏感数据。URL 参数会进入历史、日志和 Referer，同样不放秘密。</p>`
      },
      {
        title: "JS 7：模块、调试、代码风格与渐进迁移",
        content: `<p>ES Module 使用 export/import 明确依赖并拥有模块作用域。传统 Flask 页面也可给 script 加 type=module。jQuery 项目可以逐步把纯函数、API Client 和组件拆成模块，而无需一次重写框架。</p>
        ${B("javascript · task-api.js", `export function createTask(data) {
  return $.ajax({
    url: "/api/tasks",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(data)
  });
}

export function normalizeTask(raw) {
  return {
    id: Number(raw.id),
    title: String(raw.title || ""),
    completed: Boolean(raw.completed)
  };
}`)}
        <p>调试时用断点观察 Scope、Call Stack、Network 和 DOM，而不是到处 console.log。启用 ESLint/Prettier 或一致团队规则。先用纯函数测试数据转换，再测试 DOM 和网络边界。</p>
        ${P("不用 jQuery 写一个纯 JavaScript 小模块：读取表单、构造 JSON、fetch 创建任务、捕获 422、更新 DOM；再对比 jQuery 版本的代码与错误语义。")}`
      }
    ],
    quiz: {question: "为什么 jQuery each 回调中的 function 不能总被箭头函数直接替换？", options: ["箭头函数不支持参数", "箭头函数不会创建自己的 this，可能失去当前 DOM 元素", "箭头函数不能调用 jQuery", "浏览器不认识箭头"], answer: 1}
  };

  const advancedSql = {
    title: "高级 SQL、索引、锁与复杂数据设计",
    subtitle: "写出可解释、可并发、可扩展的数据访问层",
    duration: "5 小时",
    keywords: "JOIN subquery CTE window function index EXPLAIN isolation lock deadlock optimistic soft delete JSON column audit backup",
    intro: "当 CRUD 足以工作但性能与一致性开始成为问题，就需要理解复杂 SQL、执行计划、事务隔离和并发控制。本章让你能解释一条查询为何慢、两次更新为何冲突，以及数据如何长期演进。",
    sections: [
      {
        title: "SQL 进阶 1：JOIN、子查询、CTE 与窗口函数",
        content: `<p>INNER JOIN 只保留匹配行，LEFT JOIN 保留左表全部行。WHERE 对连接后的行过滤，LEFT JOIN 右表条件若放 WHERE 可能意外退化成 INNER JOIN。CTE 给复杂查询命名；窗口函数在不折叠行的情况下计算排名、累计和与分组统计。</p>
        ${B("sql", `WITH task_stats AS (
  SELECT project_id,
         COUNT(*) AS total,
         SUM(CASE WHEN completed THEN 1 ELSE 0 END) AS completed
  FROM tasks
  GROUP BY project_id
)
SELECT p.id, p.name,
       COALESCE(s.total, 0) AS total,
       COALESCE(s.completed, 0) AS completed,
       RANK() OVER (ORDER BY COALESCE(s.completed, 0) DESC) AS rank
FROM projects AS p
LEFT JOIN task_stats AS s ON s.project_id = p.id
ORDER BY rank, p.id;`)}
        <p>相关子查询可能对每行重复执行，也可能被优化器改写。先写正确清晰的查询，再用 EXPLAIN 验证。窗口函数常比在 Python 中拉全量数据计算更高效。</p>`
      },
      {
        title: "SQL 进阶 2：索引结构、复合索引与执行计划",
        content: `<p>B-tree 索引适合等值、范围和排序。复合索引遵循最左前缀：<code>(project_id, status, created_at)</code> 可支持 project_id，或 project_id+status 查询，但通常不能只高效查 status。选择性低的布尔列单独索引价值有限。</p>
        ${B("sql", `CREATE INDEX ix_tasks_project_status_created
ON tasks (project_id, status, created_at DESC);

EXPLAIN ANALYZE
SELECT id, title, created_at
FROM tasks
WHERE project_id = 42
  AND status = 'todo'
ORDER BY created_at DESC
LIMIT 20;`)}
        <p>看执行计划关注全表扫描、估算与实际行数差异、排序、回表、循环次数。索引不是越多越好：每个索引增加写成本、磁盘和迁移时间。根据真实慢查询与访问模式设计。</p>`
      },
      {
        title: "SQL 进阶 3：隔离级别、锁、死锁与丢失更新",
        content: `<p>并发异常包括脏读、不可重复读、幻读和丢失更新。数据库隔离级别定义可见性，具体实现因数据库不同。行锁 <code>SELECT ... FOR UPDATE</code> 可串行化关键行，但事务长或锁顺序不一致会死锁。</p>
        ${B("python · 乐观更新", `statement = (
    update(Task)
    .where(Task.id == task_id, Task.version == expected_version)
    .values(
        title=new_title,
        version=Task.version + 1,
        updated_at=datetime.now(timezone.utc),
    )
)
result = db.session.execute(statement)
if result.rowcount != 1:
    db.session.rollback()
    raise ConcurrentUpdate("任务已被其他请求修改")
db.session.commit()`)}
        <p>死锁不是数据库坏了，而是并发锁依赖形成环。统一锁顺序、缩短事务并对死锁错误做有限重试。外部 HTTP 调用不要放在持锁事务内。</p>`
      },
      {
        title: "SQL 进阶 4：软删除、审计、JSON 列与模型取舍",
        content: `<p>软删除增加 deleted_at 并让默认查询排除，适合恢复/合规，但会污染所有查询、唯一约束和关联。审计日志应追加写，记录操作者、动作、资源、前后摘要和请求 ID。JSON 列适合稀疏元数据，不适合逃避关系建模。</p>
        <table class="data-table"><thead><tr><th>方案</th><th>适合</th><th>代价</th></tr></thead><tbody><tr><td>普通列</td><td>高频查询、强约束字段</td><td>Schema 迁移</td></tr><tr><td>关联表</td><td>多值、可引用实体</td><td>JOIN 增加</td></tr><tr><td>JSON 列</td><td>低频、结构多变元数据</td><td>约束与跨库查询复杂</td></tr><tr><td>事件/审计表</td><td>追踪变化、合规</td><td>存储与隐私治理</td></tr></tbody></table>
        <p>日志元数据中也可能包含个人信息，需要保留策略和访问权限。软删除数据是否仍参与唯一约束需在产品层明确。</p>`
      },
      {
        title: "SQL 进阶 5：SQLAlchemy 会话、批量操作与高级查询",
        content: `<p>Session 是工作单元与 identity map，不是数据库连接本身。查询出的持久对象被追踪，commit 时 flush 变更。expire 后访问属性可能重新查询。长生命周期 Session 会积累对象并产生陈旧数据，Web 中通常一请求一个 Session。</p>
        ${B("python", `from sqlalchemy import func, select

statement = (
    select(
        Project.id,
        Project.name,
        func.count(Task.id).label("task_count"),
    )
    .outerjoin(Task, Task.project_id == Project.id)
    .group_by(Project.id, Project.name)
    .having(func.count(Task.id) >= 5)
    .order_by(func.count(Task.id).desc())
)
rows = db.session.execute(statement).all()

# 大量简单插入可批量执行；需要 ORM 事件/关系时逐对象更安全
db.session.execute(insert(AuditLog), audit_rows)
db.session.commit()`)}
        <p>批量 UPDATE/DELETE 可能绕过对象方法、事件和内存状态同步。复杂查询可放 Repository/Query Service，并为 SQL 结果定义 DTO，而非硬塞回领域实体。</p>`
      },
      {
        title: "SQL 进阶 6：备份、恢复、归档与数据生命周期",
        content: `<p>备份只有经过恢复演练才可信。明确 RPO（最多能丢多少数据）和 RTO（多久恢复）。数据库备份、上传对象和加密密钥要配套；备份加密并限制访问。删除用户数据需考虑主库、缓存、搜索索引、对象存储、队列和备份保留政策。</p>
        <ul><li>Schema 迁移前做可恢复备份并记录版本。</li><li>定期自动恢复到隔离环境，执行完整性检查。</li><li>大表归档按时间/状态分批，避免长事务和锁表。</li><li>为个人数据建立字段目录、用途、保留期和删除流程。</li><li>生产修数必须脚本化、可审计、先 dry-run、可重入。</li></ul>
        ${P("为任务列表写复合索引并用 EXPLAIN 说明命中条件；实现 version 乐观锁；设计软删除后的 email 唯一策略；写一份数据库备份与恢复演练清单。")}`
      }
    ],
    quiz: {question: "复合索引 (project_id, status, created_at) 最自然支持哪类查询？", options: ["仅按 created_at 查询所有项目", "按 project_id、status 过滤并按 created_at 排序", "仅按 status 查询", "对 title 做任意包含搜索"], answer: 1}
  };

  const teamWorkflow = {
    title: "Git、团队协作与完整工程工作流",
    subtitle: "从需求拆解、版本控制、评审到持续交付",
    duration: "4 小时",
    keywords: "Git commit branch merge rebase pull request code review README environment CI CD requirements architecture teamwork",
    intro: "独立完成页面只是开发的一部分。真实项目还需要可追踪变更、可复现环境、清晰评审、自动检查和安全发布。本章给出从需求到上线的端到端工作流。",
    sections: [
      {
        title: "工程 1：Git 的提交、暂存区与分支心智模型",
        content: `<p>工作区是正在编辑的文件，暂存区选择下一次提交的快照，commit 是不可变历史节点，分支是指向某个提交的可移动名称。先用 status/diff 看清改动，再精确 add。一次提交表达一个完整意图，便于评审和回滚。</p>
        ${B("powershell", `git status
git diff
git add app/services/task_service.py tests/test_tasks.py
git diff --staged
git commit -m "feat: validate task status transitions"

git switch -c feature/task-filter
git log --oneline --decorate --graph -10`)}
        <p>不要提交 .env、虚拟环境、数据库文件、上传文件和 IDE 缓存。发现密钥进入历史后，仅删除文件不够，还需立即轮换密钥并按安全流程清理历史。</p>`
      },
      {
        title: "工程 2：分支、合并、rebase 与冲突处理",
        content: `<p>merge 保留分叉历史，rebase 把本地提交重放到新基线以获得线性历史。只 rebase 自己尚未共享的提交，避免改写他人正在使用的公共历史。冲突需要理解两侧意图，不能机械保留全部。</p>
        ${B("powershell", `git fetch origin
git rebase origin/main

# 解决冲突后逐个标记
git add app/blueprints/api.py
git rebase --continue

# 不确定时安全退出
git rebase --abort

# 合并后运行完整测试，而不是只确认冲突标记消失
python -m pytest`)}
        <p>数据库迁移冲突尤其需要重新生成/排序并在空库和已有数据升级路径测试。前端生成文件或锁文件冲突按包管理器规范处理。</p>`
      },
      {
        title: "工程 3：Pull Request、代码评审与完成定义",
        content: `<p>一个好 PR 小而完整：说明为什么改、主要设计、如何测试、数据库/配置影响、截图或 API 示例、风险和回滚。评审关注正确性、安全、数据一致性、可测试性和可读性，不纠结已由格式化工具解决的问题。</p>
        <table class="data-table"><thead><tr><th>评审层面</th><th>关键问题</th></tr></thead><tbody><tr><td>需求</td><td>是否覆盖成功、失败、权限和边界场景</td></tr><tr><td>接口</td><td>状态码、JSON 契约、兼容性是否一致</td></tr><tr><td>数据</td><td>约束、事务、迁移和并发是否安全</td></tr><tr><td>安全</td><td>认证授权、输入输出、秘密、日志</td></tr><tr><td>质量</td><td>测试能否捕捉回归，代码职责是否清楚</td></tr><tr><td>运维</td><td>监控、性能、发布与回滚是否可行</td></tr></tbody></table>
        <p>完成定义不是“代码写完”，而是测试通过、文档/迁移/配置更新、可观测、可部署、验收场景通过且无已知高风险。</p>`
      },
      {
        title: "工程 4：环境、依赖、配置与 README 可复现性",
        content: `<p>开发、测试、预发布和生产应使用同一代码制品，通过环境变量变化配置。README 至少包含系统要求、创建环境、安装依赖、配置、迁移、种子、运行、测试、常见错误和部署入口。另一个人能从新目录启动才叫可复现。</p>
        ${B("text · .env.example", `# 只放键名和安全示例，不放真实秘密
SECRET_KEY=replace-me
DATABASE_URL=sqlite:///taskflow.db
MAIL_ENABLED=false
REDIS_URL=redis://localhost:6379/0
LOG_LEVEL=INFO`)}
        <p>配置启动时验证并尽早失败。依赖升级用独立 PR，运行测试并检查安全通告。开发数据库种子数据不能含真实客户资料。</p>`
      },
      {
        title: "工程 5：CI/CD 流水线与安全发布",
        content: `<p>CI 对每次提交执行格式、lint、类型、单测、集成测试、依赖扫描和构建；CD 将通过验证的不可变制品部署。迁移与应用版本必须兼容。生产发布使用受保护环境、最小权限凭据和审批策略。</p>
        ${B("yaml · CI 思路", `steps:
  - checkout
  - setup-python: "3.12"
  - install: "pip install -r requirements.txt"
  - lint: "ruff check ."
  - type-check: "mypy app"
  - test: "pytest --cov=app --cov-report=term-missing"
  - security-scan: "scan dependencies and secrets"
  - build: "docker build --tag taskflow:$COMMIT_SHA ."
  - smoke-test: "run image and call /health/ready"`)}
        <p>不要让 CI 日志打印密钥。缓存依赖要以锁文件为键。发布失败时回滚应用不一定能回滚破坏性数据库迁移，所以迁移采用兼容分阶段策略。</p>`
      },
      {
        title: "工程 6：从需求到上线的一条纵向切片",
        content: `<p>以“用户给任务设置截止日期”为例：先写验收规则（格式、时区、过去日期、权限）；设计数据库 UTC 字段与迁移；定义 PATCH JSON 和 422 错误；Service 处理时区与规则；jQuery 表单展示本地时间；写单测/API 测试；加入日志和发布说明。</p>
        ${B("text · 纵向切片任务单", `需求：任务可设置截止时间

□ 领域：允许为空；保存 UTC；显示用户时区；完成任务仍保留
□ 数据：tasks.due_at 可空、索引、兼容迁移
□ API：ISO 8601；缺失=不改；null=清空；非法=422
□ 权限：项目成员可读；编辑者/负责人可改
□ 前端：datetime-local 转换；加载/成功/字段错误
□ 测试：夏令时、无时区、过去日期、并发版本、无权限
□ 运维：迁移审查、慢查询、错误指标、回滚路径`)}
        <p>纵向切片每次贯穿 UI、API、业务与数据，能尽早暴露契约问题。横向一次写完“所有模型”再写“所有页面”，反馈周期长且容易偏离需求。</p>
        ${P("选择 TaskFlow 一个功能，写完整任务单和 PR 描述；建立 feature 分支，提交 3 个意图清晰的 commit，设计 CI 检查，并让另一位开发者按 README 从零启动。")}`
      }
    ],
    quiz: {question: "一个功能真正达到完成定义，至少还应包含什么？", options: ["只要本机能运行", "测试、文档/迁移、可部署性与验收场景", "提交文件越多越好", "把所有变更压成一行代码"], answer: 1}
  };

  course.splice(4, 0, pythonAdvanced);
  course.splice(7, 0, apiDesign);
  course.splice(10, 0, flaskInternals);
  course.splice(12, 0, javascriptFoundations);
  course.splice(17, 0, advancedSql);
  course.splice(22, 0, teamWorkflow);

  window.COURSE = course.map(chapter => ({
    ...chapter,
    searchText: chapter.sections.map(section => `${section.title} ${section.content.replace(/<[^>]+>/g, " ")}`).join(" ")
  }));
})();
