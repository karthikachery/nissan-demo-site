# Journal — replica migration of /parts-service

## Extract — bounded single-page capture of /parts-service (2026-11-19)

- `crawl.mjs --pages /parts-service --dynamics`: 1/1 captured, real Chrome headless, no bot wall, HTTP 2xx, provenance live.
- 11 headings, 38 CTAs, 66 images, 0 CSS backgrounds, 10 hidden offer-detail modals (textContent captured).
- Vision check: ok. A timed marketing modal ("Receive $10 Off Your Next Synthetic Oil & Filter Change" signup) overlays the hero in the screenshot — gates must dismiss it; dynamics triage must disposition it.
- Dynamic reach: 0 same-site data endpoints, no search form, not hydrated.
- Style census at 1440 + 360 → `stardust/current/_computed-styles.json`.
- Bounded entry: no PRODUCT/DESIGN synthesis here (Phase 2 bounded promotion branch). Page typed `landing`; flow stamped `replica`.

## Preserve direction — bounded-single spec, register, dynamics triage (2026-11-19)

- Bounded promotion branch: PRODUCT.md / DESIGN.md / DESIGN.json synthesized from the page JSON + lifted values (`stardust/replica/tokens.json`: census 1440/360, source CSS, cap-probe). Provenance `bounded-single`.
- Source CSS saved under `stardust/current/css/` (nissan.css, nissan-tw.css Tailwind, carousel.css, splide). NissanBrand light/Regular/Bold woff2+woff fetched to `stardust/current/assets/fonts/`.
- Container: shell 1920px, modules capped 1170px (cap-probe).
- Register: 1 entry, R-01 proprietary font licensing (deferred, no visual delta).
- Dynamics: 32 rows → `stardust/dynamic-features.md`; self: carousels, modals, popovers, mega-menus; owner decisions D-01 dealer search (link-out), D-02 tags/consent (off), D-03 Yieldify overlay (off).
- Gate note: Yieldify overlay `.yie-outer-element` must be dismissed/hidden in live captures.

## Recreate — parts-service landing prototype authored as clean HTML/CSS (2026-11-19)
- `stardust/prototypes/parts-service-proposed.html` + `css/canon.css` (fonts, tokens, buttons, header, search bar, footer, dialogs) + `css/parts-service.css` (hero, offers rail, exp banner, tiles, tire band, recall strip) + `js/parts-service.js`. Copy verbatim from the captured page JSON/DOM; 12 offer dialogs and 3 mega-menus generated as clean markup from the captured DOM text (`stardust/.labs/tools/gen-hidden.mjs`).
- Values lifted from the live computed styles (`measure.mjs` → `stardust/.labs/live-measure*.json`) and source CSS (caption steps 769/1280/1366/1472/1920, exp-banner 400/600 heights, sticky `.sticky`, side-nav rules); Splide options and the sticky threshold lifted from the source JS (`stardust/.labs/srcjs/`).
- Media harvested to `stardust/current/assets/media/{eps,site}/…` (paths mirrored, basenames kept, 62 files + CSS icons); prototype references `../current/assets/…`, so the server root is `stardust/` (PROTO `http://localhost:8791/prototypes/parts-service-proposed.html`).
- Structure mirrors the source where the probes pair by structure: navbar outside a `<header>` (live `<header>` is empty), `*Offer Details` as anchors, footer titles/links as `<p>`, inline `[*]` disclaimer blocks; NissanBrand faces self-hosted (R-01), stack = brand, Liberation Sans, Arimo, Arial, sans-serif.

## Source-fidelity gate — both widths pass the bar; chrome-parity header residual accepted at the round cap (2026-11-19)
- Frozen live references (noise floor 0%) hold the hero on slide 3 at both widths (Splide rAF autoplay advances twice before the freeze). OneTrust banner has no accept button → `--consent .onetrust-close-btn-handler`; Yieldify never appeared.
- 1440: iter1 0.12% Δ−6 → iter2 0.05% Δ0 → iter4 (full, autoplay implemented, hero rows 147:525 masked) 0.04% Δ0; content-diff 0🔴/0 nothing-lost (17 accepted loop-clone duplicates in `stardust/replica/accepted.json`); clip 0; overflow ok; chrome crops 99.89% / 99.99%; cap-probe PASS at 2560 (after adding the 1920px page shell). Table row (gate-all, unmasked): 7.45% Δ0 PASS.
- 360: iter1 aligned 0.92% Δ31 (offsets 39px) → iter2 aligned 0.32% Δ1 → iter4 (full, hero 148:666 masked) 0.19% Δ0; content-diff 0/0; clip 0; overflow ok; chrome crops 99.53% / 99.40%. Table row: 5.45% Δ0 PASS.
- gate.sh exited 2 on both iter4 rounds only because chrome-parity auto-detects the live empty `<header>`; `--region header=#navbar|#navbar` gives parity at 1440 and 28 deltas at 360, all inside the hidden off-canvas mobile menu. Recorded `rounds.mjs decide accept-residual` per width (cap reached).
- Motion observed live → implemented: hero autoplay 10 s / 2 s from slide 1 (loop wrap, reduced-motion pause), dots, offers rail transform paging, sticky search bar, mega-menu class-state machine, offer dialogs, primary/nav hovers, video autoplay on slide activation. Dead: header morph, secondary/footer hovers.
- Clone-duplicate acceptances are a hands-off, policy-derived decision (recreation-procedure § Carousels) — owner to confirm. Residual list in `stardust/replica/progress.json`.

## Rollout A–B2 + foundation — A-inventory, B-block, B2-dynamic done; C-deliver C0 foundation deployed, awaiting gate (2026-11-19)

- **A-inventory:** `migrate.mjs render parts-service --canon-css stardust/prototypes/css/canon.css` (approved-page branch A; no `stardust/canon/` so the canon path is explicit) → `stardust/migrated/parts-service/index.html`; `migrate.mjs modules` recorded hero-carousel, offers, exp-banner, tile, tire-price, recall-strip. `inventory.mjs --state` → 1 page, template id `parts-service` (an archetype with `template: null` groups under its own slug; type `landing`). `rollout.json` site fields filled (aemcoder / 83d9e7fd / main / main--83d9e7fd--aemcoder.aem.live).
- **B-block:** `blocks.mjs` → 6 distinct module blocks; `plan.mjs` → parts-service converts all six. Chrome is not a module: it ships as the foundation (/nav, /footer).
- **B2-dynamic:** fresh `dynamics-detect.mjs` (30 findings, 0 first-party API) + `dynamics-plan.mjs --target-origin <preview> --migrated` (host-bound 0/0). New ad-sync hosts (PubMatic, Casale, OpenX, Lotame, TripleLift, extra Dotomi) fold into D-02; no disposition changed. Reconciliation table appended to `stardust/dynamic-features.md`.
- **C-deliver started**, `stardust/rollout/progress.json` units: foundation, archetype:landing, cluster:landing (no siblings), gate-all, final.
- **C0 foundation:** runtime contract written; `styles/styles.css` rebuilt from canon.css (tokens, reset, 1920 shell, buttons, popovers, offer dialogs, EW edit-mode repaint, metric fallbacks); NissanBrand woff2+woff self-hosted (R-01, `fonts/LICENSING.md`); favicon.png + head link; header + footer blocks template-slotted from /nav + /footer (node moves only). 25 chrome images uploaded to DA `media/chrome/`; /nav and /footer PUT → preview → live with `Robots: noindex`. Lint clean (eslint + stylelint + breakpoint-lint). Pushed c74f480; code sync served it within ~15 s.
- **Self-check:** /nav, /footer 200 on .aem.live, 0 about:error, 0 `/img/`; header 147/148 px and footer 816/784 px match the prototype at 1440/390 on the preview-rendered /nav page with local code. Interim chrome-compare (build on /nav) 4 errors — see conversion log; the real foundation gate needs the archetype page (coordinator).

## C-archetype — /parts-service converted, deployed and published; published-origin gate PASS at both widths after one fix round (2026-11-19)

- **Convert:** 7 blocks — `hero-carousel`, `offers` (reconstructive), `exp-banner`, `tile` ×3, `tire-price`, `recall-strip` (template-slotted), `offer-dialogs` (12 offer-detail modals as authored rows → native `<dialog>`, opened by any `#<id>` link). Content `content/parts-service.html` verbatim from the prototype/capture; Title + Description from the capture. Tiers and authoring model in `stardust/eds-conversion-log.md`.
- **Media:** 28 images + the hero mp4 via `da-media-upload.mjs --scope parts-service` (video authored root-relative, published by the uploader); `media-reconcile` 28 hosted; delivered `.plain.html` 200 on .aem.page and .aem.live, one `<h1>`, 33 `<img>` all with alt, 0 `about:error`, 0 `/img/`; ai-readability code 100 %.
- **Chain:** delivery-lint 0/0/0, `npm run lint` clean, davids-model-lint 0 🔴, sanitise, block-roundtrip `--ew` exit 0 (EW 57/57), qa-gate 29 ok + 2 known non-defects (offer-dialogs is 0 px by design; harness-proxied /nav images). Pushed bf971b2 (+2 fix commits); code sync ≤ 15 s. `deploy-batch.mjs` → /parts-service live.
- **Gate (published origin, preview URL):** round pub1 — 1440 5.03 % (aligned 0.20 %) Δh −4 (offers trailing-card offset not yet served), 360 aligned 1.59 % Δh −67 FAIL: the source document loses 67 px when the phone dealer-search bar sticks, the EDS header reservation did not. **Fix round 1:** `blocks/header/header.css` `body > header:has(.dealer-search.sticky)` shrinks the reservation below 768 (foundation file, pre-freeze), offers trailing-card offset added. Round pub2 — 1440 0.11 % Δh 0, 360 0.46 % Δh 0 (hero rows masked as in the prototype rounds), clip 0, overflow ok. Crop bands header/footer 0.11/0.01 % (1440), 0.47/0.60 % (360).
- **gate-all rows** (`--only parts-service --eds-host main--83d9e7fd--aemcoder.aem.page`): 1440 PASS 0.11 % Δh 0; 360 PASS 0.44 % Δh 0; clipped 0; MISSING 0 / HIDDEN 0. Decision (hands-off, documented): `gates/all-{1440,360}/presence.json` declares the hero carousel (`#splide-carousel=.hero-carousel`) a session-variable region — the autoplay (restoreAtDelivery) decides which slide's heading is in view at probe time; without it the 360 row read MISSING 1 ("Winter Ready", the live reference's slide 3, sitting on a non-active slide of the build). Owner to confirm.
- **restoreAtDelivery verified on the preview:** hero 1→2→3→4 at 10 s unpoked; slide-4 video muted loop playing (currentTime advancing); offer dialogs, `[*]` popovers and the rail arrows driven OK.
- **Chrome (foundation, for the coordinator):** chrome-parity `--region header=#navbar` 1440 header 1 / footer 10, 360 header 34 (closed off-canvas menu) / footer 12; chrome-compare on the archetype page 2 errors (control-missing@1440 nested unnamed control in Service & Maintenance; panel-visual@1440 34.2 %), 9 warnings — `stardust/chrome/header-parity.json`.
- Coverage: parts-service → deployed (preview URL). State: parts-service → migrated (`content/parts-service.html`). progress.json: archetype:landing done; foundation gate numbers recorded under `units.foundation.gates`.

## C-deliver close — cluster (no siblings), roster gate-all and C-final done; C-deliver ends (2026-11-19)

- **cluster:landing:** recorded done with no pages — the archetype /parts-service is the template's only page.
- **gate-all** (`--skip-existing`, both widths, preview host): 1440 PASS 0.11 % Δh 0, clipped 0, MISSING 0. 360 pixel 0.44 % Δh 0, clipped 0, but content MISSING 1 — the live reference is frozen on hero slide 3 (h2 "Winter Ready") while the build's autoplay carousel sat on slide 1 at probe time; content-presence matches headings regardless of `presence.json` variable regions, so the earlier `--only` pass was timing. The h2 `#winter-ready` is in the served DOM on .aem.page and .aem.live. Recorded `gates/all-{1440,360}/overrides.json` waiving `content` only (pixel/height/clip not waived) → 1/1 delivered. Owner to confirm. `update-coverage --gate` fed from both summaries.
- **final:** `foundation-freeze check` unchanged (19 files); `foundation-requests.md` empty (never created) → nothing to apply, no archetype re-gate.

## D-site — root redirect wired, sitemap served = assembled (2026-11-19)

- Source root serves its own out-of-scope page (200); run scope says the EDS root resolves to /parts-service → redirects sheet `/redirects.json` (`/`, `/index.html` → `/parts-service`) PUT to DA, previewed, published; `/` and `/index.html` → 200 /parts-service on both origins. `stardust/redirects.tsv` mirrors it.
- `/nav`, `/footer` live with `Robots | noindex` (meta served). `assemble.mjs` → 1 url; `--verify-origin` aem.live: served 1 = assembled 1, extra 0, missing 0.

## D2-dynamic — parity replay 10/10 PASS on aem.live (2026-11-19)

- `stardust/dynamics/parity.json`: 9 features; replay (`dynamics-check.mjs --origin …aem.live`) 10/10 PASS — hero 4 dots + slide-4 mp4 playing (Δt 0.80 s), offers 5 cards + 2 rail buttons, 12 offer dialogs (click opens 600 px "Buy 4, Get 1 FREE Oil & Filter Changes*", Escape closes), 3 hero disclaimer invokers, 5 header expanders, dealer search link-out (D-01 interim), no page errors on /parts-service and /. Tags (D-02) and Yieldify overlay (D-03) listed `scaffolded-awaiting-owner` without checks. No search / listing feature → no query index needed. D3 multilingual n/a (single en page).

## E-full-site — 1/1 verified on aem.live after a path-shape fix and out-of-scope link repoint (2026-11-19)

- First verify: HTTP 404 — rollout derived `/parts-service/` from the migrated folder-index file (`parts-service/index.html`, migrate's URL-literal `trailing-slash` default) while the page is delivered, gated and published at `/parts-service` (the source URL). Fix: migrated tree flattened to `stardust/migrated/parts-service.html` + `parts-service._meta.json` (relative refs re-based one level; decision `output-path` in the sidecar's `migrationDecisions`; state.json migrate block re-pointed); inventory re-run, row re-flagged deployed; redirect row `/parts-service/` → `/parts-service` added to the sheet (published) for users typing the slash. A migrate re-render re-derives the folder form — re-apply the decision.
- Second verify: broken internal links — 15 targets outside the fixed one-page scope (`/parts-service/en/service-maintenance/*`, dealer Search, uncaptured `/parts-service/sp`) in the page, nav and footer → SCOPE EXTENSION, repointed to absolute source URLs (`https://staging.niss-parts-service.epsilonrms.com/…`; list `stardust/.work/rollout/repointed.txt`, decision in direction.md). delivery-lint 0/0/0 ×3; `deploy-batch --force` /parts-service, /nav, /footer → live.
- Verify: 1 checked · 1 verified · 0 failed; gate summaries re-fed (no flips); served sitemap 1 = assembled 1. restoreAtDelivery on aem.live: hero active slide 0 → 1 unpoked at 13 s; slide-4 mp4 playing (D2 replay Δt 0.80 s).

## E2-link-audit — 49 hrefs GET on aem.live: 46 × 200, 3 external 403 (2026-11-19)

- `localize-links --check` PASS (0 localizable; the 15 out-of-scope source targets kept absolute by decision). 50 distinct hrefs across /parts-service, /nav, /footer (plain.html): 46 × 200 (internal /parts-service + / + media and every repointed source page), 3 × 403 external (parts.nissanusa.com ×2, pinterest.com — vendors refusing non-browser GETs; hrefs verbatim from the source), 1 fragment-only href. No 404. Evidence `stardust/.work/rollout/e2-status.txt`.

## F-optimize — health 98/100, 0 P1; G-aem has nothing to fix (2026-11-19)

- `optimize.mjs --base …aem.live --all`: health 98 (seo 96, ai 100), open P1 0 / P2 0 / P3 1; source parity 1. Both findings accepted, not fixed: P3 title-length (the source `<title>` verbatim — content preservation), P2 JSON-LD (the source has none — no register entry to add it).

## G-aem — no autofix candidates (2026-11-19)

- `autofix-aem.mjs --project . --dry-run`: 0 candidates (no open findings after F); nothing to re-deploy.

## Header contract on the live host — desktop mega-menu fixed; 3 findings need the site owner (2026-11-19)

- done-check gap `header_parity: compared on .aem.page`: chrome-explore of the live /parts-service (1440 + 390) → chrome-compare 4 errors. The 1440 open-state crop showed a real defect: the mobile drawer bar (back chevron, duplicate title, second ✕) visible on desktop and drawer typography. Lifted the source's lg rules by computed-style probe (`.work/rollout/mega-src.json`): panel under the navbar with 1px #d9d9d9 rule, padding 35/100/100/60, `.side-nav` 60 % at ≥1281, h3 24/32, links inline 18/32 light + `right-nav-icon.svg` / `up-arrow-red-navigation.svg` (fetched from the source, inspected clean) at calc(100% − 10px), li 32 + 28. `blocks/header/header.css` (foundation file, after C-final; at-rest unaffected — the panel is hidden at rest), commit 67622a0, lint clean. Preview probe: every measured box equals the source.
- The live CDN keeps the previous header.css (max-age 7200) despite admin cache purges and a full code sync → the live-host re-explore waits for the cache turnover.
- Remaining (all three artifacts; tool clears only with an owner-signed decision): control-missing@1440 (`#main_menu_close` named "Close" on the build, unnamed on the source), panel-visual@1440 (crop misregistration 1391×875@25,25 vs 1440×900 + source cookie banner + hero slide), scroll-state@390 (build `<header>` includes the 67 px dealer-search bar). Proposal for the owner: `stardust/chrome/header-decisions.proposed.json` (unsigned).

## H-report — summary written, learnings recorded (2026-11-19)

- `stardust/rollout/report/summary.md` (pages / templates / blocks / quality / to-deliver) and `stardust/learnings.md` (4 entries: folder-index path shape, variable regions vs headings, open-state chrome, live code cache).

## I-dashboard — dashboard built (2026-11-19)

- `dashboard.mjs` → `stardust/rollout/dashboard/index.html` + `data.json`: 1 page identified · prototyped · deployed · optimised.

## Handoff — run complete per the runner's done-check (2026-11-19)

- Runner `/done-check`: `{"complete":true,"gaps":[]}`. Local `done-check.mjs` still lists `header_parity:4` — the three owner-decision artifacts (proposal in `stardust/chrome/header-decisions.proposed.json`) plus the live-host re-explore pending the aem.live code-cache turnover for the 67622a0 header.css (preview already measures equal to the source). Owner decisions also open: D-01 dealer search, D-02 tags/consent, D-03 Yieldify overlay, R-01 font licensing, the hero-carousel content override.
