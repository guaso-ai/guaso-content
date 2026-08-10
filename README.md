# @guaso-ai/content

Server-only SDK for Guaso Content (headless). Reads content via Guaso's HTTP API — never Neon `DATABASE_URL`.

[![npm version](https://img.shields.io/npm/v/@guaso-ai/content.svg)](https://www.npmjs.com/package/@guaso-ai/content)
[![license](https://img.shields.io/npm/l/@guaso-ai/content.svg)](./LICENSE)

## Install

```bash
npm i @guaso-ai/content
```

## Usage (RSC / route handlers / server)

```ts
import { createClient } from "@guaso-ai/content";

const client = createClient({
  siteId: process.env.GUASO_SITE_ID!,
  token: process.env.GUASO_CONTENT_TOKEN!,
});

const home = await client.getEntry("pages/home");
if (home.empty) {
  // show empty state
}
```

⛔ Do not use the token in the browser.

## Server-only

This package depends on [`server-only`](https://www.npmjs.com/package/server-only). Importing it from a Next.js Client Component (`"use client"`) **fails the build** (poison). Runtime `assertServerOnly` also throws if `window` is present (Node/Vite/tests without the `react-server` condition).

⛔ Never put `GUASO_CONTENT_TOKEN` in `NEXT_PUBLIC_*` or any client bundle.

Optional ESLint guard (copy-paste — **`npm i` does not configure ESLint**):

```js
// eslint.config.mjs
{
  files: ["**/components/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "@guaso-ai/content",
            message:
              "Server-only: importá desde RSC / route handlers, nunca desde Client Components. Token ⛔ NEXT_PUBLIC_*.",
          },
        ],
      },
    ],
  },
}
```

## Disclaimers

- **Server-only.** Never put the content token in the browser or a client bundle.
- This SDK does **not** grant Neon access or HTTP write APIs.
- You need a Guaso headless site + content token issued by Guaso (capability + chat).
- Software is provided **AS IS**, without warranty or SLA for the SDK itself.
- “Guaso” is a trademark; nominative use is OK and does not imply endorsement.
- The MIT license of this package is **not** Guaso’s Terms of Service or the Guaso Content capability contract. See https://guaso.link/legal.

## License

MIT — see `LICENSE` and `NOTICE`.

See `llms.txt` / `llms-full.txt` for AI-assisted integration.
