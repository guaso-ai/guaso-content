/** Canonical block catalog shapes — mirror of `_CANONICAL_BLOCKS` (Python SoT).
 * Client-safe subpath — no poison import (safe for UI / RSC, e.g. guaso-blocks).
 */

export type CanonicalBlockType =
  | "RichSection"
  | "Gallery"
  | "Cards"
  | "Testimonials"
  | "CTA"
  | "FAQ"
  | "Stats"
  | "Steps";

/**
 * Props comunes de layout (#4345 · SoT PY: `LAYOUT_PROP_CLOSESETS` / `LAYOUT_PROP_DEFAULTS`
 * en `content_editor_service.py`). Fuera de closed-set → default (kit) sin error de render.
 * Defaults neutros = render actual: surface=neutro, width=normal, spacing=medio, visibility=todos.
 */
export type LayoutSurface = "neutro" | "suave" | "oscuro" | "acento";
export type LayoutWidth = "angosto" | "normal" | "completo";
export type LayoutSpacing = "chico" | "medio" | "grande";
export type LayoutVisibility = "todos" | "solo_desktop" | "solo_mobile";

export type LayoutProps = {
  surface?: LayoutSurface;
  width?: LayoutWidth;
  spacing?: LayoutSpacing;
  visibility?: LayoutVisibility;
  /** Slug `^[a-z][a-z0-9-]{0,39}$` → `id` del DOM; inválido → sin ancla. */
  anchor?: string;
};

/**
 * Props de presentación (#4266 · SoT PY: `PRESENTATION_TYPO_CLOSESETS` / `PRESENTATION_IMAGE_CLOSESETS`
 * en `content_editor_service.py`). Tipografía: los 8 bloques canónicos. Imagen: RichSection, CTA y Gallery.
 * Fuera de closed-set → default del bloque (kit) sin error de render.
 * Defaults = render actual: scale=medio, emphasis=normal; aspect RichSection 4:5 · CTA 4:3 · Gallery 4:3; frame=borde, fit=cover, focal=centro.
 */
export type TypoScale = "chico" | "medio" | "grande";
export type TypoEmphasis = "normal" | "fuerte";
export type ImageAspect = "4:5" | "4:3" | "1:1" | "16:9";
export type ImageFrame = "borde" | "sin_borde" | "sombra";
export type ImageFit = "cover" | "contain";
export type ImageFocal = "centro" | "arriba" | "abajo" | "izquierda" | "derecha";

export type TypoProps = {
  scale?: TypoScale;
  emphasis?: TypoEmphasis;
};

export type ImageProps = {
  aspect?: ImageAspect;
  frame?: ImageFrame;
  fit?: ImageFit;
  focal?: ImageFocal;
};

export type RichSectionData = LayoutProps & TypoProps & ImageProps & {
  title?: string;
  body?: string;
  cta_label?: string;
  cta_url?: string;
  align?: "left" | "center";
  image_url?: string;
  /** WS2 (#3883): closed-set — fuera de rango → default del backend + warning. */
  image_side?: "left" | "right";
  mode?: "split" | "centrado" | "checklist";
};

export type GalleryImage = {
  /** Runtime/upload; not in PY repeatable schema (alt/caption/ref only). */
  url: string;
  alt?: string;
  caption?: string;
  /** Slug de un ítem vivo de la colección `source` (#4265). Lo resuelve el template al render. */
  ref?: string;
};

export type GalleryData = LayoutProps & TypoProps & ImageProps & {
  title?: string;
  images?: GalleryImage[];
  /** Colección viva: "" = solo ítems propios; "projects"/"products" = resuelve `ref` y el modo automático (#4265). */
  source?: "" | "projects" | "products";
  /** WS2 (#3883): closed-set — fuera de rango → default del backend + warning. */
  columns?: "2" | "3" | "4";
  style?: "grilla" | "masonry" | "carrusel";
};

export type CardItem = {
  heading?: string;
  text?: string;
  link_label?: string;
  link_url?: string;
};

export type CardsData = LayoutProps & TypoProps & {
  title?: string;
  subtitle?: string;
  /** WS1 (#3882): closed-set — fuera de rango → default del backend + warning. */
  columns?: "2" | "3" | "4";
  style?: "grid" | "feature" | "minimal";
  cards?: CardItem[];
};

export type TestimonialItem = {
  author?: string;
  role?: string;
  quote?: string;
  /** WS1 (#3882): dígito 1–5 como string; "" = sin puntaje (opcional). */
  rating?: string;
  /** Runtime/upload; PY `array_image_fields` items→avatar (máx 500). */
  avatar?: string;
};

export type TestimonialsData = LayoutProps & TypoProps & {
  title?: string;
  /** WS1 (#3882): closed-set — fuera de rango → default del backend + warning. */
  layout?: "grilla" | "destacado" | "carrusel" | "minimal";
  items?: TestimonialItem[];
};

export type CTAData = LayoutProps & TypoProps & ImageProps & {
  headline?: string;
  subtext?: string;
  button_label?: string;
  button_url?: string;
  /** WS3 (#3884): closed-set — fuera de rango → default del backend + warning. */
  style?: "banda" | "foto" | "split";
  align?: "left" | "center" | "right";
  /** Runtime/upload; PY `image_fields` imagen→image_url (no va en `fields`). */
  image_url?: string;
};

export type FaqItem = {
  question?: string;
  answer?: string;
};

export type FAQData = LayoutProps & TypoProps & {
  title?: string;
  questions?: FaqItem[];
};

export type StatMetric = {
  value?: string;
  label?: string;
};

export type StatsData = LayoutProps & TypoProps & {
  title?: string;
  intro?: string;
  metrics?: StatMetric[];
};

export type StepItem = {
  heading?: string;
  text?: string;
};

export type StepsData = LayoutProps & TypoProps & {
  title?: string;
  intro?: string;
  steps?: StepItem[];
};

/**
 * Fingerprint for drift guard — field keys (+ image_fields values + repeatable
 * inner keys). Gallery `url` is runtime-only and must NOT appear here.
 */
export const CANONICAL_BLOCK_PARITY: Record<
  CanonicalBlockType,
  { fields: readonly string[]; repeatable?: Record<string, readonly string[]> }
> = {
  RichSection: {
    fields: [
      "title",
      "body",
      "cta_label",
      "cta_url",
      "align",
      "image_url",
      "image_side",
      "mode",
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
    ],
  },
  Gallery: {
    fields: [
      "title",
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
    ],
    repeatable: { images: ["alt", "caption", "ref"] },
  },
  Cards: {
    fields: [
      "title",
      "subtitle",
      "columns",
      "style",
      "scale",
      "emphasis",
      "surface",
      "width",
      "spacing",
      "visibility",
      "anchor",
    ],
    repeatable: { cards: ["heading", "text", "link_label", "link_url"] },
  },
  Testimonials: {
    fields: [
      "title",
      "layout",
      "scale",
      "emphasis",
      "surface",
      "width",
      "spacing",
      "visibility",
      "anchor",
    ],
    repeatable: { items: ["author", "role", "quote", "rating", "avatar"] },
  },
  CTA: {
    fields: [
      "headline",
      "subtext",
      "button_label",
      "button_url",
      "style",
      "align",
      "image_url",
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
    ],
  },
  FAQ: {
    fields: [
      "title",
      "scale",
      "emphasis",
      "surface",
      "width",
      "spacing",
      "visibility",
      "anchor",
    ],
    repeatable: { questions: ["question", "answer"] },
  },
  Stats: {
    fields: [
      "title",
      "intro",
      "scale",
      "emphasis",
      "surface",
      "width",
      "spacing",
      "visibility",
      "anchor",
    ],
    repeatable: { metrics: ["value", "label"] },
  },
  Steps: {
    fields: [
      "title",
      "intro",
      "scale",
      "emphasis",
      "surface",
      "width",
      "spacing",
      "visibility",
      "anchor",
    ],
    repeatable: { steps: ["heading", "text"] },
  },
};

/**
 * Grilla de un nivel (#4303 contrato · #4309 SoT en guaso-app
 * `content_editor_service.py`: `_BLOCK_VARIANT_CLOSESETS["Grilla"]` / `_BLOCK_VARIANT_DEFAULTS["Grilla"]`).
 *
 * Contenedor del catálogo con hijos de un nivel. NO es familia de `_CANONICAL_BLOCKS`
 * (opt-in por template vía `container_blocks`), así que vive aparte de
 * `CANONICAL_BLOCK_PARITY`: el guard PY↔SDK compara ese set contra `_CANONICAL_BLOCKS`.
 *
 * Presets: solo ids. Las proporciones por preset son SoT del backend (`GRILLA_PRESETS`);
 * el SDK no las duplica.
 */
export const GRILLA_PRESET_IDS = [
  "mitad_y_mitad",
  "hero_2_3_1_3",
  "3_tarjetas",
  "banda_de_4",
] as const;

export const GRILLA_PARITY = {
  /** Props del contenedor (sin `preset`, que es id aparte). */
  closedSets: {
    columnas: ["1", "2", "3", "4"],
    espacio: ["chico", "medio", "grande"],
    envolver: ["si", "no"],
    alineacion_horizontal: ["inicio", "centro", "fin"],
    alineacion_vertical: ["arriba", "centrado", "abajo"],
    altura_igual: ["si", "no"],
    orden_mobile: ["normal", "invertido"],
  },
  defaults: {
    columnas: "2",
    espacio: "medio",
    envolver: "no",
    alineacion_horizontal: "inicio",
    alineacion_vertical: "arriba",
    altura_igual: "no",
    orden_mobile: "normal",
  },
  presets: GRILLA_PRESET_IDS,
  /** Prop por hijo (no del contenedor). */
  child: {
    closedSets: {
      proporcion: ["1/4", "1/3", "1/2", "2/3", "3/4", "igual"],
    },
    defaults: { proporcion: "igual" },
  },
} as const;

export type GrillaPresetId = (typeof GRILLA_PRESET_IDS)[number];
export type GrillaColumnas = (typeof GRILLA_PARITY.closedSets.columnas)[number];
export type GrillaEspacio = (typeof GRILLA_PARITY.closedSets.espacio)[number];
export type GrillaEnvolver = (typeof GRILLA_PARITY.closedSets.envolver)[number];
export type GrillaAlineacionHorizontal =
  (typeof GRILLA_PARITY.closedSets.alineacion_horizontal)[number];
export type GrillaAlineacionVertical =
  (typeof GRILLA_PARITY.closedSets.alineacion_vertical)[number];
export type GrillaAlturaIgual = (typeof GRILLA_PARITY.closedSets.altura_igual)[number];
export type GrillaOrdenMobile = (typeof GRILLA_PARITY.closedSets.orden_mobile)[number];
export type GrillaProporcion = (typeof GRILLA_PARITY.child.closedSets.proporcion)[number];

/** Props del contenedor Grilla. Fuera de closed-set → default del backend + warning. */
export type GrillaData = {
  preset?: GrillaPresetId;
  columnas?: GrillaColumnas;
  espacio?: GrillaEspacio;
  envolver?: GrillaEnvolver;
  alineacion_horizontal?: GrillaAlineacionHorizontal;
  alineacion_vertical?: GrillaAlineacionVertical;
  altura_igual?: GrillaAlturaIgual;
  orden_mobile?: GrillaOrdenMobile;
};
