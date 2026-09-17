# EV Guide-only delivery acceptance — 2026-09-17

## Result and boundaries

Implementation completed locally: 15 canonical EV guide pages, root preview launcher, namespaced portable resources, child sitemap, scoped Nginx integration and checksum-verified delivery ZIP. No Git commit/push or remote deployment was performed. The original project and desktop static copy were not modified.

**Local-file browser acceptance remains pending.** Browser automation rejected file:// navigation under its URL policy. No alternate browser surface, raw browser command or other workaround was attempted. Static path resolution, URL arithmetic (including spaces/Chinese characters), embedded font bytes, ZIP extraction and per-file SHA-256 all passed, but these do not replace an actual double-click interaction/visual test. Follow DELIVERY.md's manual checklist.

## HTTP content and visual parity

- Original: localhost:4173. New scoped Nginx preview: 127.0.0.1:4331.
- All 15 pages at 1280x900 and 390x844: 30 viewport screenshot pairs byte-identical.
- All compared visible body text, table cells, ordered main-content external sources, loaded image names/alt text and page dimensions match.
- Every measured rendered header/main/footer element has the same box and compared computed styles; maximum coordinate delta: 0px.
- All 14 article main textContent values match, including collapsed native FAQ answers.
- The guide hub has one expected hidden-DOM difference: the static empty-result message is already present under a hidden container, whereas React creates it conditionally. Normal visible text and empty-result visible text both match. This is not a visible content change.
- Captures are viewport screenshots, not full-page pixel diffs. DOM measurements include rendered content below the fold.
- Detailed evidence: delivery/visual.json and delivery/screenshots/.

## Interaction and script-free checks

- Desktop: all eight guide categories, battery search, empty-result search; main text and page height match the original.
- HTTP breadcrumb restores EV basics with two guides. Mobile menu and Explore submenu text and bounding boxes match.
- Real Chrome loaded all 15 pages with an Nginx Content-Security-Policy of script-src 'none': body/main text, tables, images and page height match script-enabled pages. A native article details element opened without page scripts.
- This is real-browser script execution blocking, not changing the global JavaScript browser preference. CSP rejection messages are expected on that dedicated test origin.
- Normal HTTP browser error/warning capture before the CSP tests was empty.
- Evidence: delivery/interactions.json and delivery/no-script.json.

## Build, content and routing checks

- npm test: four unit tests and production build verification passed.
- Original comparison: five frozen source/style files and 25 images/fonts, zero mismatches.
- The generated stylesheet restores exactly to the original stylesheet when font data URLs are replaced with the original URLs. All five embedded font binaries match the original bytes.
- Raw HTML contains guide copy, summaries, FAQs, notes, bullets, tables, sources and real canonical internal links. Each content page has one h1 and canonical, parseable JSON-LD. No SPA root or fallback is generated.
- Sitemap XML parsed successfully: 15 unique absolute canonical URLs; article dates from content; hub date from latest guide date. No generic sitemap.xml or root robots.txt is output.
- Docker Nginx stable-alpine configuration passed nginx -t. 113 checks passed: canonical routes, 25 legacy 301s, 30 slash/index.html 301s, 404s, assets/scripts, child sitemap, preservation of simulated MG root/robots/main-sitemap/FAQ/model routes and script-blocking header.
- Nginx image digest used: sha256:73c75df4075c918f91017fdda46ad81e55e5af77ba3a64ca3d5014bd9244fe7f.
- npm dependency audit during fflate installation: zero vulnerabilities.
- Evidence: delivery/technical.json. Rerun npm run verify:delivery with qa/nginx-local.conf mounted in the isolated localhost-only container on ports 4331/4332/4333.

## Packaging and remaining acceptance

npm run package creates a timestamped release ZIP, then extracts it under release/验收 空格 ... and verifies each member's SHA-256. release/latest.json records its exact path, archive digest and extracted index entry. The package has dist/, deployment/, README.md and SHA256SUMS.txt, with no source dependencies or internal QA artifacts. FILE_MANIFEST_SHA256.txt inventories the engineering deliverable separately.

The only unperformed local acceptance branch is actual file:// browser rendering/interactions (including the requested file-mode visual comparison). Production MG deployment and Google/Bing submission are also not performed and remain MG's responsibility. Do not label the whole cross-mode acceptance suite as fully passed until the manual file-mode checklist is completed.
