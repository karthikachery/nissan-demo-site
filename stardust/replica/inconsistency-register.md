# Inconsistency register — staging.niss-parts-service.epsilonrms.com/parts-service replica

Everything not listed here is frozen; any design delta found by the gate is a defect, not an improvement.

## R-01 — Proprietary NissanBrand faces self-hosted (licensing notice)

- **Evidence:** the source's own `@font-face` rules (stardust/current/css/nissan.css) load NissanBrand-light / -Regular / -Bold woff2+woff from the source host; files saved under stardust/current/assets/fonts/ (all HTTP 200).
- **Finding:** the faces are a proprietary brand family; re-hosting them on the delivery origin needs the owner's licence confirmation (fonts policy, deploy § 4 principle 2).
- **Minimal change:** none visual — the same files ship as-is under `fonts/`, brand family first in every stack, Liberation Sans / Arimo as the metric fallback; `fonts/LICENSING.md` records the hand-off.
- **Status:** deferred
- **Where:** all sections (site-wide type)
