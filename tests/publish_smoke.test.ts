import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("package.json publish metadata", () => {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
    name: string;
    license: string;
    repository?: { url?: string };
    publishConfig?: { access?: string; registry?: string };
    files?: string[];
  };
  assert.equal(pkg.name, "@guaso/content");
  assert.equal(pkg.license, "MIT");
  assert.equal(pkg.repository?.url, "git+https://github.com/guaso-ai/guaso-content.git");
  assert.equal(pkg.publishConfig?.access, "public");
  assert.equal(pkg.publishConfig?.registry, "https://registry.npmjs.org/");
  for (const f of ["dist", "LICENSE", "NOTICE", "README.md", "llms.txt", "llms-full.txt"]) {
    assert.ok(pkg.files?.includes(f), `files missing ${f}`);
  }
});

test("LICENSE is MIT without proprietary reservation", () => {
  const license = readFileSync(join(root, "LICENSE"), "utf8");
  assert.match(license, /MIT License/);
  assert.match(license, /Copyright \(c\) 2026 Guaso \/ guaso-ai/);
  assert.equal(/All rights reserved/i.test(license), false);
});

test("NOTICE covers server-only and AS IS", () => {
  const notice = readFileSync(join(root, "NOTICE"), "utf8");
  assert.match(notice, /Server-only/i);
  assert.match(notice, /AS IS/);
  assert.match(notice, /guaso\.link\/legal/);
});

test("npm pack includes dist LICENSE NOTICE README llms", () => {
  execFileSync("npm", ["run", "build"], { cwd: root, stdio: "pipe" });
  const out = execFileSync("npm", ["pack", "--dry-run", "--json"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const parsed = JSON.parse(out) as Array<{ files?: Array<{ path: string }> }>;
  const paths = new Set((parsed[0]?.files ?? []).map((f) => f.path));
  for (const required of [
    "package.json",
    "LICENSE",
    "NOTICE",
    "README.md",
    "llms.txt",
    "llms-full.txt",
    "dist/index.js",
    "dist/index.d.ts",
  ]) {
    assert.ok(paths.has(required), `pack missing ${required}`);
  }
});
