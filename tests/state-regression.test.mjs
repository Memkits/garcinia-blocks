import assert from "node:assert/strict";
import { test } from "node:test";
import * as c from "../js-out/calcit.core.mjs";
import { Op, store, decode_store, encode_store } from "../js-out/app.schema.mjs";
import { updater } from "../js-out/app.updater.mjs";
import { comp_container } from "../js-out/app.comp.container.mjs";
import { make_string } from "../js-out/respo.render.html.mjs";
import { new_reel, record_op } from "../js-out/reel.typed.mjs";
const t = c.init_tags(["states", "editor", "data", "draft", "cursor", "store", "base", "states", "hydrate-storage", "untouched"]);
const map = c._$n__$M_;
const get = (v, key) => c.option_$o_unwrap(c.get(v, key));
const op = (tag, ...args) => c._PCT__$o__$o_(Op, tag, ...args);
const onControl = () => {};
test("existing placeholder renders with initial and restored states", () => {
  assert.match(make_string(comp_container(new_reel(store), onControl)), /TODO/);
  const restored = c.assoc(store, t.states, map(t.cursor, c._$L_(), t.editor, map(t.data, "restored")));
  assert.match(make_string(comp_container(new_reel(restored), onControl)), /TODO/);
});
test("nested state operation preserves the full store and cursor", () => {
  const original = decode_store(c.assoc(encode_store(store), t.untouched, "keep this field"));
  const next = updater(original, op(t.states, c._$L_(t.editor), "draft text"), "fixture", 0);
  assert.equal(get(encode_store(next), t.untouched), "keep this field");
  assert.equal(get(get(get(next, t.states), t.editor), t.data), "draft text");
  assert.ok(c._$e_(get(get(next, t.states), t.cursor), c._$L_()));
});
test("legacy storage maps round-trip and hydrate without losing states", () => {
  const original = map(t.states, map(t.cursor, c._$L_(), t.editor, map(t.data, "saved")), t.untouched, "retained");
  const parsed = c.parse_cirru_edn(c.format_cirru_edn(original));
  const next = updater(store, op(t["hydrate-storage"], decode_store(parsed)), "fixture", 0);
  assert.ok(c._$e_(encode_store(next), original));
  assert.match(make_string(comp_container(new_reel(next), onControl)), /TODO/);
});
test("typed Reel records a named state update", () => {
  const initial = new_reel(store);
  const next = record_op(updater, initial, op(t.states, c._$L_(t.editor), "through reel"), "fixture", 0);
  assert.equal(get(get(get(get(next, t.store), t.states), t.editor), t.data), "through reel");
  assert.match(make_string(comp_container(next, onControl)), /TODO/);
});
