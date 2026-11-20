# Dynamics parity check — https://main--83d9e7fd--aemcoder.aem.live — 2026-11-19T19:39:38.863Z

Replayed 10 checks over 9 features · pass 10 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| hero carousel, 4 slides incl. autoplay muted loop mp4 | M/V | done | dom-count | PASS | 4 × .hero-carousel .hero-carousel-dot (min 4) |  |
| hero carousel, 4 slides incl. autoplay muted loop mp4 | M/V | done | video-plays | PASS | iframe/video: false · video playing (Δt 0.80s) |  |
| Current Offers card rail | L | done | dom-count | PASS | 5 × .offers .offer-card (min 5) |  |
| Current Offers card rail | L | done | dom-count | PASS | 2 × .offers .offers-btn (min 2) |  |
| *Offer Details / disclaimer modals (12 dialogs) | M | done | dom-count | PASS | 12 × dialog.offer-dialog (min 12) |  |
| *Offer Details / disclaimer modals (12 dialogs) | M | done | click-dialog | PASS | dialog 600px · heading "Buy 4, Get 1 FREE Oil & Filter Changes*" · 0 fields · Escape closes: true |  |
| inline [*] disclaimer popovers in the hero | M | done | dom-count | PASS | 3 × .hero-carousel .disclaimer-invoker (min 1) |  |
| header mega-menus (Service / Owners / Shop) | M | done | dom-count | PASS | 5 × header [aria-expanded] (min 3) |  |
| header dealer search | S | interim | dom-count | PASS | 6 × header [action*='dealer/Search'], header a[href*='dealer/Search'] (min 1) |  |
| no uncaught exceptions | - | done | no-page-errors | PASS | none on 2 page(s) |  |

## Features without checks

- tags, consent, analytics, ad pixels, dataLayer (T/A) — scaffolded-awaiting-owner · owner: D-02: which tag manager / consent / analytics containers to carry, with production IDs
- Yieldify timed marketing overlay (email signup) (T/F) — scaffolded-awaiting-owner · owner: D-03: re-enable the Yieldify overlay (collects personal data) or drop it
