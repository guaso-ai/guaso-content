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
