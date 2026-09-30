import assert from "node:assert/strict";
import { test } from "node:test";
import { checkCdnPath } from "./check-cdn-path.mjs";
const base = "https://cos-sh.tiye.me/Memkits/garcinia-blocks/pr/";
const entry = `<script type="module" src="${base}assets/main.js"></script>`;
test("accepts generated JS/CSS and unchanged fonts and analytics", () => {
  checkCdnPath(`${entry}<link href="${base}assets/main.css"><link href="https://cdn.tiye.me/favored-fonts/main-fonts.css"><script src="https://www.googletagmanager.com/gtag/js?id=G-CM7L8G9LCK"></script>`, base);
});
test("rejects relative, production and unrelated script paths", () => {
  for (const url of ["./assets/main.js", "https://cos-sh.tiye.me/Memkits/garcinia-blocks/assets/main.js", "https://example.com/js", "https://www.googletagmanager.com/gtag/js?id=other"]) assert.throws(() => checkCdnPath(`${entry}<script src="${url}"></script>`, base));
});
test("requires generated entry and HTTPS base, ignoring comments", () => {
  assert.throws(() => checkCdnPath("", base));
  assert.throws(() => checkCdnPath(entry, "./"));
  checkCdnPath(`${entry}<!-- <link href="http://localhost/main.css"> -->`, base);
});
