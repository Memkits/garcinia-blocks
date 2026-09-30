import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
export function checkCdnPath(html, base) {
  assert.ok(base?.startsWith("https://") && base.endsWith("/"));
  const active = html.replace(/<!--[\s\S]*?-->/g, "");
  const scripts = [...active.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map((match) => match[1]);
  const styles = [...active.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["']/gi)].map((match) => match[1]).filter((url) => /\.css(?:[?#]|$)/.test(url));
  const external = new Set([
    "https://cdn.tiye.me/favored-fonts/main-fonts.css",
    "https://www.googletagmanager.com/gtag/js?id=G-CM7L8G9LCK",
  ]);
  assert.ok(scripts.some((url) => url.startsWith(`${base}assets/`) && /\.js(?:[?#]|$)/.test(url)), "Missing generated JavaScript entry");
  for (const asset of [...scripts, ...styles]) {
    if (external.has(asset)) continue;
    assert.ok(asset.startsWith(`${base}assets/`), `Wrong generated asset prefix: ${asset}`);
    assert.equal(new URL(asset).pathname, new URL(asset).pathname.replace(/\/\//g, "/"));
  }
}
// Only local generated HTML is checked; remote verification stays in the COS action.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  checkCdnPath(readFileSync("dist/index.html", "utf8"), process.env.VITE_BASE_URL);
  console.log("Generated HTML uses the selected CDN prefix");
}
