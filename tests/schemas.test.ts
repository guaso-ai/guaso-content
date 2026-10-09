import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  CANONICAL_BLOCK_PARITY,
  GRILLA_PARITY,
  GRILLA_PRESET_IDS,
  TEMPLATE_IDS,
} from "../src/schemas/index.ts";
import { STORE_PARITY } from "../src/schemas/templates/store.ts";
import { ARTIST_PARITY } from "../src/schemas/templates/artist.ts";
import { BIO_PARITY } from "../src/schemas/templates/bio.ts";
import { RESTAURANT_PARITY } from "../src/schemas/templates/restaurant.ts";
import { PROFESSIONAL_PARITY } from "../src/schemas/templates/professional.ts";
import { BEAUTY_PARITY } from "../src/schemas/templates/beauty.ts";
import { REAL_ESTATE_PARITY } from "../src/schemas/templates/real-estate.ts";

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

test("CANONICAL_BLOCK_PARITY has 8 block types", () => {
  const keys = Object.keys(CANONICAL_BLOCK_PARITY).sort();
  assert.deepEqual(keys, [
    "CTA",
    "Cards",
    "FAQ",
    "Gallery",
    "RichSection",
    "Stats",
    "Steps",
    "Testimonials",
  ]);
  assert.ok(!CANONICAL_BLOCK_PARITY.Gallery.repeatable?.images.includes("url"));
  assert.deepEqual(CANONICAL_BLOCK_PARITY.Gallery.fields, [
    "title",
    "columns",
    "style",
  ]);
  assert.ok(CANONICAL_BLOCK_PARITY.RichSection.fields.includes("image_side"));
  assert.ok(CANONICAL_BLOCK_PARITY.RichSection.fields.includes("mode"));
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
  assert.ok(STORE_PARITY.collections.products.item_fields.includes("price"));
  assert.ok(STORE_PARITY.collections.products.item_fields.includes("quantity"));
});

test("#3670 featured en products y properties", () => {
  assert.ok(STORE_PARITY.collections.products.item_fields.includes("featured"));
  assert.ok(
    REAL_ESTATE_PARITY.collections.properties.item_fields.includes("featured"),
  );
});

test("seed keys residuales #3642 en PARITY", () => {
  const about = RESTAURANT_PARITY.pages.about as readonly string[];
  assert.ok(about.includes("story_2"));
  assert.ok(about.includes("values"));
  assert.ok(
    (PROFESSIONAL_PARITY.pages.about as readonly string[]).includes("values"),
  );
});

test("#3987 professional about y contact declaran section_headings", () => {
  const about = PROFESSIONAL_PARITY.pages.about as readonly string[];
  const contact = PROFESSIONAL_PARITY.pages.contact as readonly string[];
  const home = PROFESSIONAL_PARITY.pages.home as readonly string[];
  assert.ok(about.includes("section_headings"));
  assert.ok(contact.includes("section_headings"));
  assert.ok(!home.includes("section_headings"));
});

test("#3811 pages.home sunset: fields migrados no están en PARITY", () => {
  const beautyHome = BEAUTY_PARITY.pages.home as readonly string[];
  assert.ok(!beautyHome.includes("testimonials"));
  assert.ok(!beautyHome.includes("welcome_text"));
  assert.ok(!beautyHome.includes("cta_title"));
  const reHome = REAL_ESTATE_PARITY.pages.home as readonly string[];
  assert.ok(!reHome.includes("services"));
  assert.ok(!reHome.includes("stats"));
  assert.ok(!reHome.includes("features"));
});

test("#3812 ARTIST_PARITY products + nav.store; BIO blog date", () => {
  assert.equal(ARTIST_PARITY.collections.products.content_key, "products/products");
  assert.ok(ARTIST_PARITY.collections.products.item_fields.includes("featured"));
  assert.ok(ARTIST_PARITY.collections.products.item_fields.includes("availability"));
  assert.ok(ARTIST_PARITY.collections.products.item_fields.includes("price"));
  assert.ok(ARTIST_PARITY.collections.products.item_fields.includes("quantity"));
  assert.ok(ARTIST_PARITY.config_fields.includes("nav.store"));
  assert.ok(ARTIST_PARITY.collections.blog.item_fields.includes("date"));
  assert.ok(ARTIST_PARITY.collections.projects.item_fields.includes("year"));
  assert.ok(ARTIST_PARITY.collections.projects.item_fields.includes("tags"));
  assert.ok(BIO_PARITY.collections.blog.item_fields.includes("date"));
});

test("STORE_PARITY store home hero slots and products.category (#3075)", () => {
  for (const key of ["heroEyebrow", "heroTitle", "heroSubtitle"] as const) {
    assert.ok(
      (STORE_PARITY.pages.home as readonly string[]).includes(key),
      `pages.home missing ${key}`,
    );
  }
  assert.ok(STORE_PARITY.collections.products.item_fields.includes("category"));
});

test("#3882 WS1 Cards/Testimonials variants en PARITY", () => {
  assert.deepEqual([...CANONICAL_BLOCK_PARITY.Cards.fields].sort(), [
    "columns",
    "style",
    "subtitle",
    "title",
  ]);
  assert.deepEqual([...CANONICAL_BLOCK_PARITY.Testimonials.fields].sort(), [
    "layout",
    "title",
  ]);
  assert.ok(
    CANONICAL_BLOCK_PARITY.Testimonials.repeatable?.items.includes("rating"),
  );
  assert.ok(
    CANONICAL_BLOCK_PARITY.Testimonials.repeatable?.items.includes("avatar"),
  );
});

test("#3883 WS2 Gallery/RichSection variants en PARITY", () => {
  assert.deepEqual([...CANONICAL_BLOCK_PARITY.Gallery.fields].sort(), [
    "columns",
    "style",
    "title",
  ]);
  assert.ok(CANONICAL_BLOCK_PARITY.RichSection.fields.includes("image_side"));
  assert.ok(CANONICAL_BLOCK_PARITY.RichSection.fields.includes("mode"));
  assert.ok(!CANONICAL_BLOCK_PARITY.Gallery.repeatable?.images.includes("url"));
});

test("#3884 WS3 CTA variants en PARITY", () => {
  assert.deepEqual([...CANONICAL_BLOCK_PARITY.CTA.fields].sort(), [
    "align",
    "button_label",
    "button_url",
    "headline",
    "image_url",
    "style",
    "subtext",
  ]);
});

test("#4306 Grilla en GRILLA_PARITY: closed-sets y defaults alineados al backend", () => {
  assert.deepEqual(GRILLA_PARITY.closedSets, {
    columnas: ["1", "2", "3", "4"],
    espacio: ["chico", "medio", "grande"],
    envolver: ["si", "no"],
    alineacion_horizontal: ["inicio", "centro", "fin"],
    alineacion_vertical: ["arriba", "centrado", "abajo"],
    altura_igual: ["si", "no"],
    orden_mobile: ["normal", "invertido"],
  });
  assert.deepEqual(GRILLA_PARITY.defaults, {
    columnas: "2",
    espacio: "medio",
    envolver: "no",
    alineacion_horizontal: "inicio",
    alineacion_vertical: "arriba",
    altura_igual: "no",
    orden_mobile: "normal",
  });
  for (const [field, value] of Object.entries(GRILLA_PARITY.defaults)) {
    assert.ok(
      (GRILLA_PARITY.closedSets as Record<string, readonly string[]>)[field]!.includes(value),
      `default ${field}=${value} fuera de closed-set`,
    );
  }
});

test("#4306 Grilla presets por id y proporción por hijo (sin duplicar anchos)", () => {
  assert.deepEqual([...GRILLA_PRESET_IDS], [
    "mitad_y_mitad",
    "hero_2_3_1_3",
    "3_tarjetas",
    "banda_de_4",
  ]);
  assert.deepEqual([...GRILLA_PARITY.presets], [...GRILLA_PRESET_IDS]);
  assert.deepEqual([...GRILLA_PARITY.child.closedSets.proporcion], [
    "1/4",
    "1/3",
    "1/2",
    "2/3",
    "3/4",
    "igual",
  ]);
  assert.equal(GRILLA_PARITY.child.defaults.proporcion, "igual");
});

test("#4306 Grilla fuera de CANONICAL_BLOCK_PARITY (paridad guard = _CANONICAL_BLOCKS)", () => {
  assert.equal("Grilla" in CANONICAL_BLOCK_PARITY, false);
  assert.equal(Object.keys(CANONICAL_BLOCK_PARITY).length, 8);
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
