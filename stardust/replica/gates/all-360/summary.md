# Published-origin gate — all deployed pages, 360px

2026-11-19T19:34:38.802Z · **0 PASS / 1 FAIL / 0 error of 1** (+1 documented override → 1 delivered)

Verdict: pixel criterion (aligned % ≤ 10 AND total offset ≤ the bound; alignment not used: unaligned % ≤ 10) AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance) AND content MISSING + HIDDEN links/headings = 0

Calibration — pixel-only verdict (criteria 1+2): **1 PASS**; full verdict (1–4): **0 PASS**. Failing by criterion: pixel 0, height 0, clip 0, content 1; content n/a (origin not probed) 0; pixel criterion met only thanks to alignment (unaligned % over the threshold): 0.
| page | template | tier | origin | browser | pixel % aligned (unaligned) [text] | offsets | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/parts-service` | parts-service | - | stitch-live | chrome | 0.44 [0.5] | - | 0 | 0 | MISSING 1 / HIDDEN 0 | - | FAIL (elements) → PASS: hero autoplay carousel (restoreAtDelivery, 10 s loop from slide 1): the frozen live reference sits on slide 3, so its h2 'Winter Ready' is probed visible on the source while the build's carousel shows whichever slide is active at probe time. The h2 #winter-ready is in the served DOM on .aem.page and .aem.live (plain.html), every slide heading/link present; pixel/height/clip criteria not waived. Decision: hands-off, owner to confirm. | content MISSING 1 / HIDDEN 0 |
