# Font licensing — ACTION REQUIRED BEFORE GOING LIVE

The site self-hosts the source site's own brand faces so the migrated pages keep the
current design (stardust replica, inconsistency register R-01; deploy § 4 principle 2).
These faces are **proprietary**. Do not treat the published `aem.live` site as launched
until the webfont / web-embedding licence for this domain is confirmed by Nissan North America
(brand owner) or the foundry it licenses NissanBrand from.

| File | Family (CSS) | Weight | Foundry / owner | Licence status |
|---|---|---|---|---|
| `NissanBrand-light.woff2`, `NissanBrand-light.woff` | `NissanBrand-light` | 400 (light cut) | Nissan Motor Co. corporate typeface (foundry not stated in the files) | **unconfirmed** |
| `NissanBrand-Regular.woff2`, `NissanBrand-Regular.woff` | `NissanBrand-Regular` | 400 | same | **unconfirmed** |
| `NissanBrand-Bold.woff2`, `NissanBrand-Bold.woff` | `NissanBrand-Bold` | 700 | same | **unconfirmed** |

Source: the files the source site serves from its own `@font-face` rules
(`stardust/current/css/nissan.css`), saved unchanged (`stardust/current/assets/fonts/`).

## Remove path (if the licence cannot be confirmed)

1. Delete the six files above from `fonts/`.
2. Delete the three `@font-face` rules in `styles/fonts.css`.
3. Nothing else: every stack in `styles/styles.css` names a metric-matched
   `nissanbrand-*-fallback` face second and `"Liberation Sans", Arimo, Arial, sans-serif`
   after it, so the site falls back without layout shift (the type will no longer be the
   brand face — a visible, owner-approved change).
