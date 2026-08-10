/**
 * @guaso-ai/content — server-only Guaso Content client.
 * ⛔ Do not import this package in browser / client bundles.
 * Poison: `import "server-only"` fails Next client bundles; runtime assert covers other runtimes.
 *
 * Typed schema catalog (client-safe): import from `@guaso-ai/content/schemas`
 * — never from this entry in Client Components.
 */
import "server-only";

export type ContentEntry<T = unknown> = {
  siteId: string;
  guasoVersion: string;
  key: string;
  contentType: string | null;
  data: T | null;
  empty: boolean;
};

export type GuasoContentClient = {
  getEntry: <T = unknown>(key: string) => Promise<ContentEntry<T>>;
  getEntries: <T = unknown>(keys: string[]) => Promise<ContentEntry<T>[]>;
};

export type CreateClientOptions = {
  siteId: string;
  token: string;
  /** Default https://api.guaso.link */
  baseUrl?: string;
  fetch?: typeof fetch;
};

const DEFAULT_BASE = "https://api.guaso.link";

function assertServerOnly(): void {
  if (
    typeof globalThis !== "undefined" &&
    "window" in globalThis &&
    (globalThis as { window?: unknown }).window
  ) {
    throw new Error(
      "@guaso-ai/content is server-only. Do not put GUASO_CONTENT_TOKEN in the browser or NEXT_PUBLIC_*. See https://guaso.link/docs/content",
    );
  }
}

export function createClient(opts: CreateClientOptions): GuasoContentClient {
  assertServerOnly();
  const baseUrl = (opts.baseUrl || DEFAULT_BASE).replace(/\/$/, "");
  const fetchFn = opts.fetch ?? fetch;
  const authHeaders = {
    Authorization: `Bearer ${opts.token}`,
    Accept: "application/json",
  };

  async function getEntry<T = unknown>(key: string): Promise<ContentEntry<T>> {
    const url = `${baseUrl}/api/v1/content/entries/${encodeURIComponent(key).replace(/%2F/g, "/")}`;
    const res = await fetchFn(url, { headers: authHeaders });
    if (res.status === 401 || res.status === 403) {
      throw new Error("Guaso Content: unauthorized (check token)");
    }
    if (!res.ok) {
      throw new Error(`Guaso Content: HTTP ${res.status}`);
    }
    return (await res.json()) as ContentEntry<T>;
  }

  async function getEntries<T = unknown>(
    keys: string[],
  ): Promise<ContentEntry<T>[]> {
    const url = `${baseUrl}/api/v1/content/entries/batch`;
    const res = await fetchFn(url, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ keys }),
    });
    if (res.status === 401 || res.status === 403) {
      throw new Error("Guaso Content: unauthorized (check token)");
    }
    if (!res.ok) {
      throw new Error(`Guaso Content: HTTP ${res.status}`);
    }
    const body = (await res.json()) as { entries?: ContentEntry<T>[] };
    return body.entries ?? [];
  }

  return { getEntry, getEntries };
}
