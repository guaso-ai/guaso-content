// Chequeo de tipos (no es un test de runtime): lo corre `npm run typecheck` con tsc --noEmit.
// Falla si `source` deja de aceptar "" | "products" en RichSection, o si `ref` deja de ser string.
import type { RichSectionData } from "../../src/schemas/blocks.js";

// Closed-set de source (#4598): "" (sin fuente) y "products".
const sinFuente: RichSectionData = { source: "" };
const products: RichSectionData = { source: "products", ref: "remera-negra-m" };

// Valores fuera del closed-set quedan rechazados en RichSection.
// @ts-expect-error source "projects" no entra a RichSection (solo Gallery)
const projects: RichSectionData = { source: "projects" };

// ref es texto libre (slug): un número no tipa.
// @ts-expect-error ref debe ser string
const refNumerico: RichSectionData = { ref: 42 };

export { sinFuente, products, projects, refNumerico };
