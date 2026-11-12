## Garlic Blocks

> some naive UI for types.

Demo https://r.tiye.me/Memkits/garcinia-blocks/ .

本地开发使用正式 Calcit CLI 和 `@calcit/procs` 0.42.1。升级后请重新安装依赖并构建。Reel 状态、旧存档和预览流程沿用现有用法。

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

### 使用者需要注意

本地使用正式 Calcit / procs **0.38.0**、Caps 0.1.1、Node 24 和 Yarn 4.18.0。升级后重新安装依赖和构建。已发布模块为 Respo 0.19.5、UI 0.15.2、Reel 0.11.0 和 JS FFI 0.2.13，传递依赖 Router 为 0.12.2。

页面仍显示原 TODO 占位。存储继续使用 `workflow`、原 EDN Map 和每分钟保存周期，旧存档中的状态树与额外字段可继续读写。恢复失败时退出保存和定时保存尚未注册。热更新仍使用浏览器里的 `hud!`。

### 类型边界

Respo 分发具名 `Op`，Reel 面板和键盘传递具名 `Control`。两条入口在 `Op | reel.typed/Control` 上汇合，旧匿名控制事件随 Reel 0.11.0 退役。开放存档字段和 Respo 状态数据仍允许原异构值。

```sh
caps --ci --strict
yarn install --immutable
caps verify --toolchain
calcit calcit.cirru --check-only --all-defs
calcit calcit.cirru fix --workflow strict --verify
yarn build
node --test tests/*.test.mjs
```

只维护calcit.cirru/deps.cirru，Snapshot使用官方CLI，不恢复compact.cirru/package.cirru，不提交js-out/dist。yarn dev先编译再启动Vite，实时编辑另开终端运行calcit calcit.cirru -w。

### 前端部署

VITE_BASE_URL本地默认相对路径，PR沿用独立编号/run/attempt前缀。COS仅dist/，正式cos-upload-action v1.3.0内置HTML引用和公开上传校验，不复制verify脚本。原服务器目录、字体/logo/analytics和main-only rsync条件保持，不迁移后端。不合并、不生产部署、不发布Git/npm。

模板：https://github.com/calcit-lang/respo-calcit-workflow 。

### License

MIT
