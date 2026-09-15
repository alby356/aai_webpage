# Cleanup passes

## Pass 1 — audit and dead code
Inspected every tracked source, configuration, documentation, and asset file. The original prototype had no JavaScript, imports, unreachable blocks, helper functions, unused components, or unused CSS variables. No dependencies or unused asset files were present. Nothing was deleted under a false dead-code classification.

Check: six unique external links and all referenced assets exist.

## Pass 2 — simplify presentation
Removed the requested hero, slogans, and homepage club section together with their CSS. Formatted the stylesheet for maintenance. Added a separate club page. Shared subject icons replace inconsistent illustrations. Subject filters and sorting read the existing HTML cards; there is no second generated catalog or client fetch dependency. Math and APUSH are explicitly planned, with empty states.

Check: `node check.mjs` verifies filtering, empty subjects, sort order, and unchanged original order. Both content pages retain direct navigation links without JavaScript.

## Pass 3 — navigation guardrails
Published destination configuration permits only known tool IDs; arbitrary URLs and inherited object keys cannot become redirects. Real HTML links remain the no-JavaScript fallback, and checks keep them aligned with the transition configuration. New-tab anchors preserve native modifier-click behavior. Reduced motion bypasses the handoff animation. Invalid links have recovery navigation; animation cancellation continues navigation; the immediate link remains available. The tiny skeleton is shown only during module initialization, without an artificial data-loading delay.

Check: `node check.mjs` and `node --check dist/app.js`. Verify local content routes and referenced assets return HTTP 200. No backend, persistence, user forms, mock overrides, secrets, or error boundaries existed to replace.

## Adding a tool
Add an HTML project with its subject, name, and `data-tool` ID; register its full destination URL in `dist/catalog.mjs`. Reuse a subject icon. Update the expected catalog counts in `check.mjs` and run it. The explicit HTML fallback and destination allowlist are intentionally checked against each other.
