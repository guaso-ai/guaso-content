import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createClient } from "../src/index.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("llms.txt and llms-full.txt exist", () => {
  assert.equal(existsSync(join(root, "llms.txt")), true);
  assert.equal(existsSync(join(root, "llms-full.txt")), true);
  const short = readFileSync(join(root, "llms.txt"), "utf8");
  assert.match(short, /server-only/i);
  assert.match(short, /empty/i);
});

test("poison: entry imports server-only and package depends on it", () => {
  const index = readFileSync(join(root, "src/index.ts"), "utf8");
  assert.match(index, /import\s+["']server-only["']/);
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
    dependencies?: Record<string, string>;
  };
  assert.equal(pkg.dependencies?.["server-only"], "0.0.1");
});

test("assertServerOnly throws when window is present", () => {
  const g = globalThis as { window?: unknown };
  const prev = g.window;
  g.window = {};
  try {
    assert.throws(
      () =>
        createClient({
          siteId: "s1",
          token: "gct_test",
        }),
      (err: unknown) => {
        assert.ok(err instanceof Error);
        assert.match(err.message, /server-only/i);
        assert.match(err.message, /guaso\.link\/docs\/content/);
        return true;
      },
    );
  } finally {
    if (prev === undefined) {
      delete g.window;
    } else {
      g.window = prev;
    }
  }
});

test("getEntry empty-clear", async () => {
  const fetchMock: typeof fetch = async () =>
    new Response(
      JSON.stringify({
        siteId: "s1",
        guasoVersion: "1",
        key: "pages/home",
        contentType: null,
        data: null,
        empty: true,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );

  const client = createClient({
    siteId: "s1",
    token: "gct_testtoken",
    baseUrl: "https://api.example.test",
    fetch: fetchMock,
  });
  const entry = await client.getEntry("pages/home");
  assert.equal(entry.empty, true);
  assert.equal(entry.data, null);
});

test("getEntries batch", async () => {
  const fetchMock: typeof fetch = async (_url, init) => {
    assert.equal(init?.method, "POST");
    return new Response(
      JSON.stringify({
        siteId: "s1",
        guasoVersion: "1",
        entries: [
          {
            siteId: "s1",
            guasoVersion: "1",
            key: "a",
            contentType: null,
            data: null,
            empty: true,
          },
        ],
      }),
      { status: 200 },
    );
  };
  const client = createClient({
    siteId: "s1",
    token: "gct_x",
    fetch: fetchMock,
  });
  const entries = await client.getEntries(["a"]);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].empty, true);
});
