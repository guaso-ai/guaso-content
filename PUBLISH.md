# Publishing `@guaso/content`

Source of truth: this repo (`guaso-ai/guaso-content`). Automated publish runs on `v*` tags via GitHub Actions (`.github/workflows/publish.yml`).

## Human gates (Emiliano)

These are **not** agent-autonomous:

1. **Claim / create npm org `guaso`** at https://www.npmjs.com/org/create (enable 2FA on the org).
2. Confirm package name is free: `npm view @guaso/content` should 404 before first publish.
3. Create a **granular npm access token** with publish permission for `@guaso/content` (or the `guaso` org).
4. Store the token in **1Password** (vault Guaso) — never commit it, never paste into issues.
5. Set the GitHub secret (preferred) **or** publish once manually:
   ```bash
   gh secret set NPM_TOKEN -R guaso-ai/guaso-content
   ```
6. Tag and push to trigger GHA:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
7. Verify:
   ```bash
   npm view @guaso/content version   # expect 0.1.0
   npm view @guaso/content license   # MIT
   ```

## Emergency manual publish (no GHA)

If the secret is not set yet or Actions is unavailable:

```bash
npm ci
npm test
npm run build
npm publish --access public
# uses your local npm login / NODE_AUTH_TOKEN env — do not echo the token
```

## Post-publish checklist

- [ ] `npm view @guaso/content` shows `0.1.0`, MIT, repository → this GitHub repo
- [ ] Fresh install in empty dir: `npm i @guaso/content`
- [ ] npm package page: https://www.npmjs.com/package/@guaso/content
- [ ] README disclaimers + MIT badge visible

## Who owns the token

Emiliano — 1Password vault Guaso. Rotate if leaked. Agents must never invent or commit `NPM_TOKEN`.
