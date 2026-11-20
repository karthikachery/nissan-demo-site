---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-19T17:22:21Z
  againstInput: https://staging.niss-parts-service.epsilonrms.com/parts-service
  mode: bounded-single
  readArtifacts:
    - stardust/current/pages/parts-service.json
    - stardust/replica/tokens.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://staging.niss-parts-service.epsilonrms.com/parts-service (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/parts-service.json + Phase-3 CSS lift → PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-11-19T17:22:21Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md (1 entry — proprietary font licensing notice; no visual delta).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Out-of-scope link targets (decision, 2026-11-19, rollout E/E2)
Scope is fixed at one page (/parts-service). Every other internal target is a SCOPE EXTENSION and is repointed to the source site (absolute `https://staging.niss-parts-service.epsilonrms.com/…`), never left to 404: /parts-service/en/service-maintenance/{why-nissan, oil-change, maintenance-schedules, express-service, dashboard-warning-lights, tires, owners, multipoint-inspection, mobile-service, faqs, electric-vehicles, coupons-offers, brakes, batteries}, /parts-service/en/dealer/Search (D-01 link-out), and the uncaptured Spanish root /parts-service/sp. Applied in content/parts-service.html, content/nav.html, content/footer.html.
