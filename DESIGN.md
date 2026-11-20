---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-19T17:22:21Z
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/parts-service.json
    - stardust/replica/tokens.json
---

# Design — Nissan Parts & Service (current state, bounded-single)

Every value below is lifted from the captured page (computed-style census at 1440/360 and the site's own stylesheets); see stardust/replica/tokens.json and DESIGN.json.

## Colors
- Text #000000 · body copy #343434 · background #ffffff · surface #efefef (bands) · rule #d2d2d2
- Primary (Nissan red) #c3002f — primary buttons
- Footer #1e1e1e · muted #999999 / #5c5c5c

## Typography
NissanBrand family, self-hosted faces: light (headings, body), Regular (offer headings), Bold (emphasis).
- Hero title 56px light (32px at 360) · section H2 40/48 light (32/40 at 360) · offers heading 32/40 · card H3 20/32 · body 16/24 light (tile body 14/24) · validity 12/24 · eyebrow 13px, 2.6px tracking, uppercase.

## Components
- Pill buttons, radius 40px: primary red (padding 8px 50px 8px 20px, arrow icon), secondary outline black, secondary outline white (hero), footer pill (4px 10px).
- Sections: hero carousel (4 slides incl. video), Current Offers card carousel, experience banner, three two-column image/text tiles, tire price-match band on #efefef, recall strip, dark footer.

## Layout
Shell max-width 1920px; content modules capped at 1170px (cap-probe). Source breakpoints kept.
