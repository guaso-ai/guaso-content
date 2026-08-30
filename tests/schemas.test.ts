import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  CANONICAL_BLOCK_PARITY,
  TEMPLATE_IDS,
} from "../src/schemas/index.ts";
import { STORE_PARITY } from "../src/schemas/templates/store.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("TEMPLATE_IDS has 9 canonical templates", () => {
  assert.equal(TEMPLATE_IDS.length, 9);
  assert.deepEqual([...TEMPLATE_IDS], [
    "artist",
    "store",
    "restaurant",
    "real-estate",
    "gym",
    "clinic",
    "professional",
    "beauty",
    "bio",
  ]);
});

test("CANONICAL_BLOCK_PARITY has 5 block types", () => {
  const keys = Object.keys(CANONICAL_BLOCK_PARITY).sort();
  assert.deepEqual(keys, [
    "CTA",
    "Cards",
    "Gallery",
    "RichSection",
    "Testimonials",
  ]);
  assert.ok(!CANONICAL_BLOCK_PARITY.Gallery.repeatable?.images.includes("url"));
});

test("each template exports a *_PARITY const", () => {
  const templatesDir = join(root, "src/schemas/templates");
  const files = readdirSync(templatesDir).filter(
    (f) => f.endsWith(".ts") && !f.startsWith("_"),
  );
  assert.equal(files.length, 9);
  for (const f of files) {
    const src = readFileSync(join(templatesDir, f), "utf8");
    assert.match(src, /export const \w+_PARITY\s*=/);
    assert.doesNotMatch(src, /blocks\?:\s*unknown/);
  }
});

test("src/schemas has no server-only import", () => {
  const schemasDir = join(root, "src/schemas");
  function walk(dir: string): string[] {
    const out: string[] = [];
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, name.name);
      if (name.isDirectory()) out.push(...walk(p));
      else if (name.name.endsWith(".ts")) out.push(p);
    }
    return out;
  }
  for (const file of walk(schemasDir)) {
    const text = readFileSync(file, "utf8");
    assert.doesNotMatch(
      text,
      /import\s+["']server-only["']/,
      `${file} must not import server-only`,
    );
  }
});

test("package exports ./schemas*", () => {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
    version: string;
    exports: Record<string, unknown>;
  };
  assert.match(pkg.version, /^\d+\.\d+\.\d+$/);
  assert.ok(pkg.exports["./schemas"]);
  assert.ok(pkg.exports["./schemas/blocks"]);
  assert.ok(pkg.exports["./schemas/templates/*"]);
});

test("STORE_PARITY products item_fields includes availability", () => {
  assert.ok(STORE_PARITY.collections.products.item_fields.includes("availability"));
});

test("dist schemas present after build (optional)", () => {
  // Build is a separate step; skip if dist missing (fresh clone pre-build).
  if (!existsSync(join(root, "dist/schemas/blocks.d.ts"))) {
    return;
  }
  assert.equal(existsSync(join(root, "dist/schemas/index.d.ts")), true);
  assert.equal(
    existsSync(join(root, "dist/schemas/templates/store.d.ts")),
    true,
  );
});
