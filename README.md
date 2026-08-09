# @guaso/content

Server-only SDK for Guaso Content (headless). Reads content via Guaso's HTTP API — never Neon `DATABASE_URL`.

[![npm version](https://img.shields.io/npm/v/@guaso/content.svg)](https://www.npmjs.com/package/@guaso/content)
[![license](https://img.shields.io/npm/l/@guaso/content.svg)](./LICENSE)

## Install

```bash
npm i @guaso/content
```

## Usage (RSC / route handlers / server)

```ts
import { createClient } from "@guaso/content";

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
