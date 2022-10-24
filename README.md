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

### License

MIT
