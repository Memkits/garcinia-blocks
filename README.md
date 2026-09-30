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

The project uses Calcit 0.27.0. Run `caps --ci --strict`,
`yarn install --immutable`, `yarn build`, and `node --test tests/*.test.mjs`.
Only `calcit.cirru` and `deps.cirru` are canonical; CI rejects retired
`compact.cirru` / `package.cirru` snapshots. Generated frontend HTML is checked
against the selected CDN prefix, while public upload verification remains
inside cos-upload-action. Original server deployment paths and shared external
fonts, logo and analytics remain unchanged. The application still renders its
existing TODO placeholder; this migration does not implement the planned type UI.

### License

MIT
