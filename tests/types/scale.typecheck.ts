// Chequeo de tipos (no es un test de runtime): lo corre `npm run typecheck` con tsc --noEmit.
// Falla si `display` deja de tipar en RichSection, o si se filtra a los otros bloques.
import type {
  CTAData,
  GalleryData,
  RichSectionData,
  TypoProps,
} from "../../src/schemas/blocks.js";

// RichSection admite display (hero #4282), solo o con emphasis.
const hero: RichSectionData = { scale: "display" };
const heroFuerte: RichSectionData = { scale: "display", emphasis: "fuerte" };

// Valores existentes siguen válidos en RichSection.
const richGrande: RichSectionData = { scale: "grande" };
const richMedio: RichSectionData = { scale: "medio" };

// Gallery, CTA y el TypoProps uniforme NO admiten display.
// @ts-expect-error display fuera de RichSection
const galleryDisplay: GalleryData = { scale: "display" };
// @ts-expect-error display fuera de RichSection
const ctaDisplay: CTAData = { scale: "display" };
// @ts-expect-error display fuera de RichSection
const typoDisplay: TypoProps = { scale: "display" };

// Valores fuera del set siguen rechazados en RichSection.
// @ts-expect-error valor inexistente
const richXl: RichSectionData = { scale: "xl" };

export { hero, heroFuerte, richGrande, richMedio, galleryDisplay, ctaDisplay, typoDisplay, richXl };
