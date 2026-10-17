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

使用已发布配对 Calcit/procs **0.30.1-alpha.4**（预发布）、Caps 0.1.1、
Node.js 24、Yarn 4.18.0；模块使用正式 Respo 0.16.122、UI 0.7.41、
Reel 0.6.39 和 js-ffi 0.2.3。

```sh
caps --ci --strict
yarn install --immutable
caps verify --toolchain
calcit calcit.cirru --check-only --all-defs
calcit calcit.cirru fix --workflow strict --verify
yarn build
node --test tests/*.test.mjs
```

只维护 `calcit.cirru` / `deps.cirru`。Store 仍为原 Map 格式，保留未知字段、
`workflow` 存储键、启动恢复、关闭页面及每分钟持久化行为；状态树兼容混合 key。
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

0.30.1-alpha.4 不是正式 0.30.1，开放 Store/状态值仍有显式 Dynamic 边界。

### License

MIT
