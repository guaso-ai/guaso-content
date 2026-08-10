/**
 * Minimal harness: resolve `server-only` → empty module so Node tests can import the SDK.
 * Next.js client bundles still fail on the real `server-only` package (poison).
 */
import { register } from "node:module";

const hookSource = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return {
      shortCircuit: true,
      url: "data:text/javascript,",
      format: "module",
    };
  }
  return nextResolve(specifier, context);
}
`;

register(
  `data:text/javascript,${encodeURIComponent(hookSource)}`,
  import.meta.url,
);
