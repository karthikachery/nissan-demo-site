---
_provenance:
  writtenBy: stardust:dynamics (via stardust:replica Phase 2)
  writtenAt: 2026-11-19T17:23:16Z
  readArtifacts: [stardust/current/_dynamics.json, stardust/dynamics/dynamic-features.generated-plan.json]
---

# Dynamic features — /parts-service

Source: 1 page, 32 detector rows (stardust/dynamics/dynamic-features.generated-plan.md). Every row has a disposition below; the static recreation continues regardless.

## Listings contract

No index-backed listing on this page. The "Current Offers" Splide list (8 cards, row l-listing-candidate-splide-list-8-cards) is an editorial carousel of 5 offer cards (+ Splide clones): **document-first, authored rows** in a carousel block; no query index. Disposition corrected from `index-backed` → `static (authored)`, reproducibility `self`.

## Features

| id | class | feature | disposition | reproducibility | target | status |
|---|---|---|---|---|---|---|
| hero-carousel | M/V | Hero Splide carousel, 4 slides (one autoplay mp4 video), arrows/pagination | rebuild-native (block JS, observed motion only) | self | block | planned (Phase 3 interaction parity) |
| l-listing-candidate-splide-list-8-cards | L | Current Offers card carousel (5 cards) | static authored rows + carousel JS | self | block | planned |
| m-modal-trigger-popup-link-a-content | M | "*Offer Details" modals (12 `.modal` dialogs, content captured via textContent) | rebuild-native (dialog from authored fragment/rows) | self | runtime | planned |
| m-modal-trigger-modal-button-a-content | M | disclaimer modals (Learn more / details) | rebuild-native | self | runtime | planned |
| m-modal-trigger-aria-haspopup-chrome-only | M | header mega-menus (Service / Owners / Shop) | rebuild-native (header block) | self | runtime | planned |
| disclaimer-popper | M | inline "[*]" disclaimer popovers in hero | rebuild-native | self | runtime | planned |
| s-site-search-form (dealer search) | S | header "Enter Your Location" dealer search → /parts-service/en/dealer/Search | link-out to the source dealer locator (interim) | needs-business-decision | widget | interim; decision D-01 |
| a-cms-app-settings-object-datalayer | A | page dataLayer settings object | static-snapshot (not needed for render) | self | content | decided: not carried (analytics-only) — interim, D-02 |
| t-* (20 rows: GTM, GA, OneTrust, Facebook, Dotomi/Conversant, Yahoo, Seedtag, Smaato, LoopMe, ContextWeb, StreamTheWorld, nissanusa.com, staging.epsilondigitalone.com) | T | tags, consent, pixels | embed-passthrough, scaffolded **off** (martech only on owner request) | needs-business-decision | embed | interim off; decision D-02 |
| a/t yieldify (5 rows) | T/F | Yieldify timed marketing overlay ("Receive $10 Off…" email signup) | not rebuilt; collects personal data → owner decision | needs-business-decision | embed | interim off; decision D-03 |
| a-unknown www.google.com, js-web-2-tel.com | A | third-party beacons | classified T "inspect" — analytics beacons, off | needs-business-decision | embed | interim off; D-02 |
| v-iframe-without-src | V | runtime-injected empty iframe (tag container) | T inspect — tag sandbox, not content | needs-business-decision | embed | interim off; D-02 |

Media: staging.epsilondigitalone.com serves the page imagery and hero video; assets are rehosted on the delivery origin (media harvest), never hot-linked.

## Decision batch

- **D-01 — dealer search backend.** The dealer locator lives on the source application. Interim: the header form and "Find a Dealer" links point to the source dealer search URL. Owner to decide whether the locator moves.
- **D-02 — tags & consent on the new host** (GTM, GA, OneTrust, pixels). Interim: none loaded. Owner to supply the tag/consent contract.
- **D-03 — Yieldify marketing overlay** (email capture). Interim: not shown. Owner to decide whether it is re-installed via their tag manager.

## Register

No design delta: dynamic dispositions do not add register entries.

## B2 re-verification — rollout pre-import gate (2026-11-19)

Fresh evidence: `dynamics-detect.mjs --urls …/parts-service --reach stardust/current` → `stardust/.work/dynamics/b2/_dynamics.json` (30 findings: 30 third-party hosts, 0 first-party API, 2 forms, 12 triggers, 1 media, 0 client-rendered); `dynamics-plan.mjs --target-origin https://main--83d9e7fd--aemcoder.aem.page --migrated stardust/migrated` → `stardust/dynamics/dynamic-features.generated-plan.md` (self 3 · owner batch 23 · delivered-by-capture 4 · host-bound 0/0 — no first-party API path to probe).

Reconciliation (every fresh row maps to a curated disposition above; no disposition changed):

| fresh row(s) | curated disposition |
|---|---|
| m-modal-trigger-aria-haspopup-chrome-only | header mega-menus — rebuild-native in the header block (foundation C0) |
| m-modal-trigger-popup-link / modal-button (delivered-by-capture) | Offer Details / disclaimer modals — rebuild-native (archetype unit) |
| l-listing-candidate-splide-list-8-cards (draft `index-backed`) | stays **static authored rows + carousel JS** (curated correction holds) |
| s-site-search-form → /parts-service/en/dealer/Search | link-out to the source dealer locator, **D-01** |
| a-cms-app-settings-object-datalayer | not carried, **D-02** |
| t-tag-manager GTM, t-analytics GA/Ads, t-consent OneTrust, t-marketing pixel, www.facebook.com, www.nissanusa.com, staging.epsilondigitalone.com | embed-passthrough scaffolded off, **D-02** (epsilondigitalone media rehosted, never hot-linked) |
| NEW hosts this run: login-ds / login / dclk-match / lotame-match .dotomi.com, simage2.pubmatic.com, dsum-sec.casalemedia.com, us-u.openx.net, sync.crwdcntrl.net (Lotame), eb2.3lift.com | ad-exchange cookie-sync pixels — same class as the t-* row: off, **D-02** |
| td / v2.dc / custom / assets-v2 .yieldify.com, fonts.yieldify-production.com | Yieldify overlay — off, **D-03** |
| a-unknown www.google.com, js.web-2-tel.com; v-iframe-without-src | analytics beacons / tag sandbox — off, **D-02** |

Host-bound on target: 0. New owner decisions: none (new hosts fold into D-02). Gate: every row carries a disposition — Phase C may proceed.
