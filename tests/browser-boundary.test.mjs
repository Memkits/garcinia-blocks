import assert from "node:assert/strict";
import { test } from "node:test";
import { registerHooks } from "node:module";
import * as c from "../js-out/calcit.core.mjs";
// bottom-tip still uses an extensionless dependency import. Resolve its actual
// installed file for Node, without replacing or mocking application modules.
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    return nextResolve(specifier === "virtual-dom/create-element" ? "virtual-dom/create-element.js" : specifier, context);
  },
});
const main = await import("../js-out/app.main.mjs");
hooks.deregister();
test("mount selector returns the actual host element and rejects a missing mount", () => {
  const original = globalThis.document;
  const element = { fixture: "app element" };
  try {
    globalThis.document = { querySelector(selector) { assert.equal(selector, ".app"); return element; } };
    assert.equal(main.mount_target(), element);
    globalThis.document = { querySelector() { return null; } };
    assert.throws(() => main.mount_target(), /none/);
  } finally { globalThis.document = original; }
});
test("persistence uses the existing storage key without accessing user browser data", () => {
  const original = globalThis.window;
  const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const writes = [];
  try {
    const storage = { setItem(key, value) { writes.push([key, value]); } };
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
    globalThis.window = { localStorage: storage };
    main.persist_storage_$x_();
    assert.equal(writes.length, 1);
    assert.equal(writes[0][0], "workflow");
    const tags = c.init_tags(["states", "cursor"]);
    const saved = c.parse_cirru_edn(writes[0][1]);
    assert.ok(c._$e_(c.option_$o_unwrap(c.get(c.option_$o_unwrap(c.get(saved, tags.states)), tags.cursor)), c._$L_()));
  } finally {
    globalThis.window = original;
    if (storageDescriptor) Object.defineProperty(globalThis, "localStorage", storageDescriptor);
    else delete globalThis.localStorage;
  }
});
