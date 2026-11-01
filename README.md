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

### 使用者需要注意

配对正式 **Calcit / procs 0.32.1**、Caps 0.1.1、Node24 和 Yarn4.18.0，模块为正式 Respo0.17.1、UI0.9.0、Reel0.7.0、JS FFI0.2.9；UI 的 Router0.9.0-alpha.4 传递依赖保留，不引用 main/hash。升级后重新安装完整依赖图、生成JS、重启并刷新，不混用旧 runtime。

页面仍为原 TODO 占位内容，不实现上面的规划类型UI。原 Map Store、未知字段、混合key状态树、`workflow`存储键及每分钟保存周期保持。恢复前已显示的占位内容保留，解析/解码失败会阻止注册退出及定时保存，错误向外报告，不清空或默认覆盖旧存档。真实JS `hud!`提示保留，不以raise替代。

### 本次迁移与限制

官方formatter转换三处旧类型写法。原14个完整官方视图仅render-app!一个派发参数变化，全部既有schema/tests/meta不变；新增开放Enum的DispatchOp代表定义绑定原来缺失的入口类型槽，代表值不发送。render!使用已有Enum→Unit的dispatch!，DevTools继续用原Dynamic检查入口dispatch-wire!；业务updater仍检查Store、Enum和id/time，不以伪造Struct或强转掩盖开放状态。

runtime/deps/lock配对，npm包龄60分钟无例外。原工作流、类型门禁、测试文件和断言、权限、正式Action tags和前端路径保持，不增加checker/concurrently、预算或编译器fix/proof规则。开放Store/wire仍有真实Dynamic，不宣称债务清零。

```sh
caps --ci --strict
yarn install --immutable
caps verify --toolchain
calcit calcit.cirru --check-only --all-defs
calcit calcit.cirru fix --workflow strict --verify
yarn build
node --test tests/*.test.mjs
```

当前候选通过202个全定义、原五namespace的15个公开定义、完整strict diagnostics=[]、原6项JS回归及构建/canonical。没有附带native测试，不把空集合计为通过。实际新回环来源验证原TODO页启动和刷新，浏览器warn/error=[]；这不代表规划类型UI、DevTools交互、坏存档或HUD注错都已验收。本轮不读真实存档，不将历史结果计为本轮重验。

只维护calcit.cirru/deps.cirru，Snapshot使用官方CLI，不恢复compact.cirru/package.cirru，不提交js-out/dist。yarn dev先编译再启动Vite，实时编辑另开终端运行calcit calcit.cirru -w。

### 前端部署

VITE_BASE_URL本地默认相对路径，PR沿用独立编号/run/attempt前缀。COS仅dist/，正式cos-upload-action v1.2.0内置HTML引用和公开上传校验，不复制verify脚本。原服务器目录、字体/logo/analytics和main-only rsync条件保持，不迁移后端。不合并、不生产部署、不发布Git/npm。

模板：https://github.com/calcit-lang/respo-calcit-workflow 。

### License

MIT
