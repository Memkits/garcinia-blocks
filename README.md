## Garlic Blocks

> some naive UI for types.

Demo https://r.tiye.me/Memkits/garcinia-blocks/ .

_TODO_

### Schema

Const:

```cirru
{}
  :tag :const
  :def &PI
```

sum:

```cirru
{}
  :tag :sum
  :def $ {}
    :tag :bool
    :values $ [] true false
```

set:

```cirru
{}
  :tag :set
  :def $ {}
    :tag :number
    :values ?number
```

product:

```cirru
{}
  :tag :product
  :def $ {}
    :tag :a-and-b
    :union $ {}
      :a ?value
      :b ?value
```

### Workflow

https://github.com/calcit-lang/respo-calcit-workflow

使用者影响：继续配对正式 Calcit/procs **0.30.1**、Caps 0.1.1、
Node.js 24、Yarn 4.18.0；模块使用精确正式 Respo 0.16.126、UI 0.8.1、
Reel 0.6.42 和 js-ffi 0.2.6，传递 Router 0.8.38、Vite 固定 8.3.3。重新安装完整依赖图、生成 JS 并刷新，不混装旧 alpha 缓存。

8 处旧 Map/Option 调用改为方法，保留原默认值与求值顺序。两个 watcher 的新/旧值按真实 Ref<Map<Tag,Dynamic>> 合同标注，离页事件按真实 EventHost 标注；不把开放 Store/混合 key 伪装成封闭 Struct。
真实 `hud!` 及成功/错误提示保留，不用 raise 替换。删除正式 procs 的 npm 预批准例外，按普通安装策略验证。
本次仍不实现 TODO 类型 UI，不新增函数、强转、预算、测试框架或永久验证脚本；不授权合并或生产部署。

```sh
caps --ci --strict
yarn install --immutable
caps verify --toolchain
calcit calcit.cirru --check-only --all-defs
calcit calcit.cirru fix --workflow strict --verify --format json | jq -e '.data.workflow.status == "passed" and .diagnostics == []'
yarn build
node --test tests/*.test.mjs
```

只维护 `calcit.cirru` / `deps.cirru`。Store 仍为原 Map 格式，保留未知字段、
`workflow` 存储键与每分钟持久化周期；状态树兼容混合 key。
启动时先恢复存档，再安装卸载保存与定时保存。恢复错误仍向外报告，页面保留原占位内容，
但不会注册可能覆盖原文的这两项自动保存；不清空旧存档或以默认数据吞掉错误。
从 Reel 的动态边界实际检查 Store、Enum 操作及 id/time，再调用业务 updater；
不用假的名义类型或 Fn 强转。挂载元素使用 Respo 的 typed DOM selector。

`yarn dev` 先编译一次再启动 Vite；实时编辑时另开终端运行
`calcit calcit.cirru -w`。不增加进程管理器或独立校验脚本。

部署只针对前端资源。`VITE_BASE_URL` 本地默认相对路径，PR 使用独立的
`pr/<number>/<run-id>/<attempt>/` 前缀；生产 COS 前缀、原服务器目录及外部
字体、logo、analytics 保持不变。精确正式 tag 的 COS action v1.2.0 自身验证
HTML 引用和公开上传内容；PR 不执行生产 rsync。

### 限制

页面仍为原有 TODO 占位内容，本次迁移不实现规划中的类型 UI。

开放 Store/状态值仍有显式 Dynamic 边界，不宣称类型债务清零。

### License

MIT
