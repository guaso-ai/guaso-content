import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  CANONICAL_BLOCK_PARITY,
  GRILLA_PARITY,
  GRILLA_PRESET_IDS,
  RICH_SECTION_FONDO_VALUES,
  RICH_SECTION_MOVIMIENTO_VALUES,
  RICH_SECTION_SCALE_VALUES,
  TYPO_SCALE_VALUES,
  TEMPLATE_IDS,
  isValidVideoUrl,
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
    "kicker",
    "link_label",
    "columns",
    "style",
    "source",
    "scale",
    "emphasis",
    "aspect",
    "frame",
    "fit",
    "focal",
    "surface",
    "width",
    "spacing",
    "visibility",
    "anchor",
  ]);
  assert.ok(CANONICAL_BLOCK_PARITY.RichSection.fields.includes("image_side"));
  assert.ok(CANONICAL_BLOCK_PARITY.RichSection.fields.includes("mode"));
});

test("presentation props (#4266): tipografía en los 8 canónicos, imagen en RichSection/CTA/Gallery", () => {
  for (const [name, block] of Object.entries(CANONICAL_BLOCK_PARITY)) {
    assert.ok(block.fields.includes("scale"), `${name} sin scale`);
    assert.ok(block.fields.includes("emphasis"), `${name} sin emphasis`);
  }
  const imageBlocks = ["RichSection", "Gallery", "CTA"] as const;
  for (const name of imageBlocks) {
    for (const key of ["aspect", "frame", "fit", "focal"]) {
      assert.ok(
        CANONICAL_BLOCK_PARITY[name].fields.includes(key),
        `${name} sin ${key}`,
      );
    }
  }
  for (const name of ["Cards", "Testimonials", "FAQ", "Stats", "Steps"] as const) {
    assert.ok(!CANONICAL_BLOCK_PARITY[name].fields.includes("aspect"), `${name} con aspect`);
  }
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

test("#4251 ARTIST_PARITY home incluye cta_primary_url", () => {
  assert.ok(ARTIST_PARITY.pages.home.includes("cta_primary_url"));
});

test("#4249 ARTIST_PARITY home incluye hero_portrait", () => {
  assert.ok(ARTIST_PARITY.pages.home.includes("hero_portrait"));
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
    "anchor",
    "columns",
    "emphasis",
    "scale",
    "spacing",
    "style",
    "subtitle",
    "surface",
    "title",
    "visibility",
    "width",
  ]);
  assert.deepEqual([...CANONICAL_BLOCK_PARITY.Testimonials.fields].sort(), [
    "anchor",
    "emphasis",
    "layout",
    "scale",
    "spacing",
    "surface",
    "title",
    "visibility",
    "width",
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
    "anchor",
    "aspect",
    "columns",
    "emphasis",
    "fit",
    "focal",
    "frame",
    "kicker",
    "link_label",
    "scale",
    "source",
    "spacing",
    "style",
    "surface",
    "title",
    "visibility",
    "width",
  ]);
  assert.ok(CANONICAL_BLOCK_PARITY.RichSection.fields.includes("image_side"));
  assert.ok(CANONICAL_BLOCK_PARITY.RichSection.fields.includes("mode"));
  assert.ok(!CANONICAL_BLOCK_PARITY.Gallery.repeatable?.images.includes("url"));
});

test("#4265 Gallery: source en fields y ref en items (sin url en PY)", () => {
  assert.ok(CANONICAL_BLOCK_PARITY.Gallery.fields.includes("source"));
  assert.deepEqual(CANONICAL_BLOCK_PARITY.Gallery.repeatable?.images, ["alt", "caption", "ref"]);
});

test("#4267 links tipados: hojas *_destino en PARITY, legacy *_url conviven", () => {
  assert.ok(CANONICAL_BLOCK_PARITY.RichSection.fields.includes("cta_destino"));
  assert.ok(CANONICAL_BLOCK_PARITY.RichSection.fields.includes("cta_url"));
  assert.ok(CANONICAL_BLOCK_PARITY.CTA.fields.includes("button_destino"));
  assert.ok(CANONICAL_BLOCK_PARITY.CTA.fields.includes("button_url"));
  assert.ok(CANONICAL_BLOCK_PARITY.Cards.repeatable?.cards.includes("link_destino"));
  assert.ok(CANONICAL_BLOCK_PARITY.Cards.repeatable?.cards.includes("link_url"));
});

test("#3884 WS3 CTA variants en PARITY", () => {
  assert.deepEqual([...CANONICAL_BLOCK_PARITY.CTA.fields].sort(), [
    "align",
    "anchor",
    "aspect",
    "button_destino",
    "button_label",
    "button_url",
    "emphasis",
    "fit",
    "focal",
    "frame",
    "headline",
    "image_url",
    "scale",
    "spacing",
    "style",
    "subtext",
    "surface",
    "visibility",
    "width",
  ]);
});

test("#4345 props comunes de layout en los 8 bloques canónicos (paridad con PY)", () => {
  const LAYOUT_PROPS = ["surface", "width", "spacing", "visibility", "anchor"];
  assert.equal(Object.keys(CANONICAL_BLOCK_PARITY).length, 8);
  for (const [blockType, meta] of Object.entries(CANONICAL_BLOCK_PARITY)) {
    for (const prop of LAYOUT_PROPS) {
      assert.ok(meta.fields.includes(prop), `${blockType} sin prop de layout ${prop}`);
    }
    // Sin duplicados: el guard PY↔SDK compara conjuntos, pero un duplicado es ruido de paridad.
    assert.equal(new Set(meta.fields).size, meta.fields.length, `${blockType} fields duplicados`);
  }
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

test("#4566 RichSection fondo + video_url en CANONICAL_BLOCK_PARITY (camino feliz)", () => {
  assert.ok(CANONICAL_BLOCK_PARITY.RichSection.fields.includes("fondo"));
  assert.ok(CANONICAL_BLOCK_PARITY.RichSection.fields.includes("video_url"));
  assert.deepEqual([...RICH_SECTION_FONDO_VALUES], ["normal", "completo"]);
  assert.equal(
    new Set(CANONICAL_BLOCK_PARITY.RichSection.fields).size,
    CANONICAL_BLOCK_PARITY.RichSection.fields.length,
    "RichSection fields duplicados",
  );
  for (const url of [
    "https://cdn.example.com/hero.mp4",
    "https://cdn.example.com/hero.webm",
    "https://cdn.example.com/media/hero.webm?v=2",
    "https://cdn.example.com/HERO.MP4",
  ]) {
    assert.equal(isValidVideoUrl(url), true, `debería aceptar ${url}`);
  }
});

test("#4284 RichSection movimiento en CANONICAL_BLOCK_PARITY (closed-set estatico|marquee, solo RichSection)", () => {
  assert.ok(CANONICAL_BLOCK_PARITY.RichSection.fields.includes("movimiento"));
  assert.deepEqual([...RICH_SECTION_MOVIMIENTO_VALUES], ["estatico", "marquee"]);
  assert.equal(
    new Set(CANONICAL_BLOCK_PARITY.RichSection.fields).size,
    CANONICAL_BLOCK_PARITY.RichSection.fields.length,
    "RichSection fields duplicados",
  );
  for (const [blockType, meta] of Object.entries(CANONICAL_BLOCK_PARITY)) {
    if (blockType === "RichSection") continue;
    assert.ok(!meta.fields.includes("movimiento"), `${blockType} no debería tener movimiento`);
  }
});

test("#4566 video_url inválida: no https, extensión no permitida, forma rota", () => {
  for (const url of [
    "http://cdn.example.com/hero.mp4",
    "ftp://cdn.example.com/hero.mp4",
    "javascript:alert(1)//hero.mp4",
    "https://cdn.example.com/hero.mov",
    "https://cdn.example.com/hero.mp4.exe",
    "https://cdn.example.com/hero",
    "https://cdn.example.com/page?file=hero.mp4",
    "https:///hero.mp4",
    "hero.mp4",
    "",
  ]) {
    assert.equal(isValidVideoUrl(url), false, `debería rechazar ${url}`);
  }
});

test("#4566 video_url rechaza userinfo (user:pass@host)", () => {
  assert.equal(
    isValidVideoUrl("https://user:pass@cdn.example.com/hero.mp4"),
    false,
    "debería rechazar userinfo en video_url",
  );
  assert.equal(
    isValidVideoUrl("https://user@cdn.example.com/hero.webm"),
    false,
    "debería rechazar username sin password",
  );
});

test("#4566 video_url rechaza comillas en el valor crudo (breakout de atributo)", () => {
  assert.equal(
    isValidVideoUrl('https://cdn.example.com/"onerror=alert(1).mp4'),
    false,
    "debería rechazar comilla doble",
  );
  assert.equal(
    isValidVideoUrl("https://cdn.example.com/'onerror=alert(1).webm"),
    false,
    "debería rechazar comilla simple",
  );
});

test("#4566 video_url rechaza espacios y caracteres de control en el valor crudo", () => {
  for (const url of [
    " https://cdn.example.com/hero.mp4 ",
    "https://cdn.example.com/hero.mp4\n",
    "https://cdn.example.com/hero\t.mp4",
    "https://cdn.example.com/my hero.mp4",
  ]) {
    assert.equal(isValidVideoUrl(url), false, `debería rechazar ${JSON.stringify(url)}`);
  }
});

test("#4566 video_url rechaza controles C0 (\\x00-\\x1f) y DEL (\\x7f) en el valor crudo", () => {
  assert.equal(
    isValidVideoUrl("https://x.com/a\u0001.mp4"),
    false,
    "debería rechazar \\u0001 (control C0 no cubierto por \\s)",
  );
  assert.equal(
    isValidVideoUrl("https://x.com/a\u007f.mp4"),
    false,
    "debería rechazar \\u007f (DEL)",
  );
  for (let code = 0x00; code <= 0x1f; code++) {
    const url = `https://x.com/a${String.fromCharCode(code)}.mp4`;
    assert.equal(isValidVideoUrl(url), false, `debería rechazar C0 ${code.toString(16)}`);
  }
});

test("#4566 video_url rechaza scheme sin // (https:host/path)", () => {
  assert.equal(
    isValidVideoUrl("https:cdn.example.com/hero.mp4"),
    false,
    "debería rechazar https: sin //",
  );
  assert.equal(
    isValidVideoUrl("https:/cdn.example.com/hero.webm"),
    false,
    "debería rechazar https: con una sola /",
  );
});

test("#4282 escala: 8 canónicos con 3 valores; display solo en RichSection (closed-set SDK, sin paridad PY verificada)", () => {
  // Solo compara arrays del SDK. ⚠️ pendiente de verificar contra PY: el espejo del closed-set de hero aún no existe en guaso-app origin/main (lo introduce #4282).
  assert.deepEqual([...TYPO_SCALE_VALUES], ["chico", "medio", "grande"]);
  assert.deepEqual([...RICH_SECTION_SCALE_VALUES], ["chico", "medio", "grande", "display"]);
  assert.ok(CANONICAL_BLOCK_PARITY.RichSection.fields.includes("scale"));
  // display no entra al closed-set uniforme de los otros 7 bloques (solo RichSection lo admite).
  assert.ok(!(TYPO_SCALE_VALUES as readonly string[]).includes("display"));
});

test("#4598 RichSection source/ref en CANONICAL_BLOCK_PARITY (paridad PY _CANONICAL_BLOCKS)", () => {
  const fields = CANONICAL_BLOCK_PARITY.RichSection.fields;
  assert.ok(fields.includes("source"), "falta source en RichSection");
  assert.ok(fields.includes("ref"), "falta ref en RichSection");
  assert.equal(
    new Set(fields).size,
    fields.length,
    "RichSection fields duplicados",
  );
  // Gallery mantiene su propio source (no se contamina con ref de RichSection).
  assert.ok(CANONICAL_BLOCK_PARITY.Gallery.fields.includes("source"));
  assert.ok(!CANONICAL_BLOCK_PARITY.Gallery.fields.includes("ref"));
});
