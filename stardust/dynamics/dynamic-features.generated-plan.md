<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-19T18:20:56.788Z · input stardust/.work/dynamics/b2/_dynamics.json (1 pages, 30 findings) · target probe https://main--83d9e7fd--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-js-web-2-tel-com | A | unknown third-party host js.web-2-tel.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-td-yieldify-com | A | unknown third-party host td.yieldify.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-unknown-third-party-host-v2-dc-yieldify-com | A | unknown third-party host v2.dc.yieldify.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 1/1 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 6 | l-listing-candidate-splide-list-8-cards | L | listing candidate splide__list (8 cards) | 1/1 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 7 | m-modal-trigger-aria-haspopup-chrome-only-div-form-button-co | M | modal trigger aria-haspopup (chrome only) → div:form/button:content | 1/1 (reach 1/1) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 8 | m-modal-trigger-popup-link-a-content | M | modal trigger popup-link → a:content | 1/1 (reach 9/1) | rebuild-native | runtime | self | delivered-by-capture | modal-loader | none | output already carries "*Offer Details" |
| 9 | m-modal-trigger-modal-button-a-content | M | modal trigger modal-button → a:content | 1/1 (reach 1/1) | rebuild-native | runtime | self | delivered-by-capture | modal-loader | none | output already carries "*Offer Details" |
| 10 | s-site-search-form-parts-service-en-dealer-search | S | site search form → /parts-service/en/dealer/Search | 1/1 (reach 0/1) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 11 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 12 | t-consent-onetrust | T | consent: OneTrust | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 13 | t-unknown-third-party-host-staging-epsilondigitalone-com | T | unknown third-party host staging.epsilondigitalone.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 14 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 15 | t-unknown-third-party-host-www-nissanusa-com | T | unknown third-party host www.nissanusa.com | 1/1 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "www.nissanusa.com" |
| 16 | t-unknown-third-party-host-login-ds-dotomi-com | T | unknown third-party host login-ds.dotomi.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 17 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 18 | t-unknown-third-party-host-custom-yieldify-com | T | unknown third-party host custom.yieldify.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 19 | t-unknown-third-party-host-simage2-pubmatic-com | T | unknown third-party host simage2.pubmatic.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 20 | t-unknown-third-party-host-login-dotomi-com | T | unknown third-party host login.dotomi.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 21 | t-unknown-third-party-host-dsum-sec-casalemedia-com | T | unknown third-party host dsum-sec.casalemedia.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 22 | t-unknown-third-party-host-us-u-openx-net | T | unknown third-party host us-u.openx.net | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 23 | t-unknown-third-party-host-sync-crwdcntrl-net | T | unknown third-party host sync.crwdcntrl.net | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 24 | t-unknown-third-party-host-dclk-match-dotomi-com | T | unknown third-party host dclk-match.dotomi.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 25 | t-unknown-third-party-host-lotame-match-dotomi-com | T | unknown third-party host lotame-match.dotomi.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 26 | t-unknown-third-party-host-eb2-3lift-com | T | unknown third-party host eb2.3lift.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 27 | t-unknown-third-party-host-www-facebook-com | T | unknown third-party host www.facebook.com | 1/1 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "www.facebook.com" |
| 28 | t-unknown-third-party-host-fonts-yieldify-production-com | T | unknown third-party host fonts.yieldify-production.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 29 | t-unknown-third-party-host-assets-v2-yieldify-com | T | unknown third-party host assets-v2.yieldify.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 30 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 1/1 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 3 row(s) — read-settings, chrome-interaction, search-index-backed.
- **One owner decision batch:** 23 row(s) — inspect the XHR, add a vendor row · index-driven or editorially curated? · which tags run on the new host; property ids · CMP domain script reuse on the new host · resolve the runtime src from a rendered capture.
- **Already delivered by the capture pipeline:** 4 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.

## Phases

- **tags** — 19
- **detect** — 5
- **interactive** — 3
- **listings** — 1
- **search** — 1
- **embeds** — 1
