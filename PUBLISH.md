# Publishing `@guaso-ai/content`

Source of truth: this repo (`guaso-ai/guaso-content`). CI publish on `v*` tags uses **npm Trusted Publishing (OIDC)** — no long-lived `NPM_TOKEN`.

> npm está restringiendo tokens que bypassean 2FA (Aug 2026 / Jan 2027). No uses Automation tokens para publish en CI.

## First publish (humano, una sola vez)

El package tiene que existir en npm antes de poder configurar Trusted Publisher.

```bash
cd /path/to/guaso-content   # main al día
npm login                   # @diazemiliano + 2FA
npm ci && npm test && npm run build
npm publish --access public # te pide OTP del authenticator — OK
npm view @guaso-ai/content version   # expect 0.1.0
```

## Trusted Publisher (después del first publish)

1. Abrí https://www.npmjs.com/package/@guaso-ai/content → **Settings** → **Trusted Publisher**
2. GitHub Actions:
   - Organization or user: `guaso-ai`
   - Repository: `guaso-content`
   - Workflow filename: `publish.yml` (solo el nombre, con `.yml`)
   - Allowed actions: **npm publish**
3. Guardá (2FA interactiva).
4. Opcional: Publishing access → “Require two-factor authentication and disallow tokens” (recién cuando OIDC ya publicó OK una vez).
5. Borrá el secret viejo si existe: `gh secret delete NPM_TOKEN -R guaso-ai/guaso-content`

## Semver notes

- **0.3.0** (minor): new client-safe `./schemas` (+ `/schemas/blocks`, `/schemas/templates/*`) exports; `ContentEntry<T>` / `getEntry`·`getEntries` generics (default `unknown`). No breaking HTTP/runtime change.
- Prefer `python scripts/release.py` after merge — ⛔ `npm publish` on the feature branch.

## Releases siguientes (CI)

Happy path (clon local al día, en `main`):

```bash
python scripts/release.py                 # dry-run: bump propuesto
python scripts/release.py --apply --push  # commit chore(release) + tag vX.Y.Z + push
# GHA Publish npm → OIDC → npm publish
```

⛔ `npm publish` local en happy path. ⛔ Automation / long-lived `NPM_TOKEN`.
Passkey/OTP solo first-publish o recover de acceso humano.

El workflow guarda `tag vX.Y.Z` ↔ `package.json#version` antes de publicar.

Agent flow (monorepo): `agents/flows/sdk-work.md` — features vía `template_flow.py`; release = este script.

Requisitos del workflow: `permissions.id-token: write`, npm CLI ≥ 11.5.1, Node ≥ 22.14, runner GitHub-hosted.

## Verify

```bash
npm view @guaso-ai/content version
npm view @guaso-ai/content license   # MIT
mkdir -p /tmp/guaso-content-smoke && cd /tmp/guaso-content-smoke
npm init -y && npm i @guaso-ai/content
```

## Who owns what

- Cuenta npm / org `guaso-ai` / 2FA: Emiliano
- Trusted Publisher config: Emiliano (interactivo)
- Agents: ⛔ no inventan ni commitean tokens
