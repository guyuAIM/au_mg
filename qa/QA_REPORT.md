# MG Australia GEO static acceptance report

> Superseded: the detailed [recheck report](recheck/REPORT.md) corrects the broad PASS and exact-layout claims below. The remainder is retained as historical initial-check evidence, not the current acceptance verdict.

Date: 17 September 2026

## Result

PASS. The independent Astro project builds 17 canonical static pages. The original React/Vite project was used read-only and remains the visual/content golden master. No deployment or remote environment change was performed.

## Content and source integrity

- 5 golden source/style files matched their fixed SHA-256 values.
- 25 copied images/fonts matched the original project; mismatches: 0.
- 14 guide slugs, 16 FAQ records, 25 source records and 25 legacy aliases passed the content contract.
- Every guide/FAQ paragraph, guide FAQ, table cell and referenced source URL was found in the generated HTML.
- Every generated local `href`/`src` resolved to a canonical route or an existing built asset.
- The generated pages contain no empty SPA `#root` shell.

## Browser parity

Chrome comparisons used the same browser instance and font environment for the original and new local sites.

| Viewport | Pages | Visible text | Title | Page dimensions | Key bounding boxes and computed styles |
| --- | ---: | --- | --- | --- | --- |
| 1280 x 900 | 17 | Exact | Exact | Exact | Exact |
| 390 x 844 | 17 | Exact | Exact | Exact | Exact |

Key comparisons included header, main, footer, `h1`, containers, hero, article body and FAQ page regions. Class-name whitespace was normalised for measurement because React emits a non-semantic trailing space on the header class; rendered class selectors and computed output are unchanged.

Interaction parity passed for:

- FAQ expand/collapse all (16 answers, exact expanded page height).
- FAQ search for `30k`.
- MGS6 EV plus Compare models filtering.
- Cold-start deep link `/about/faqs#F08`.
- Copy answer link target.
- Guide search for `battery`.
- EV basics category filtering (2 guides).
- Mobile menu and Explore submenu.

Browser console errors/warnings: 0 for both local implementations during acceptance.

## Static and GEO checks

- 17/17 canonical routes returned HTTP 200 from the local production preview.
- `/` and an unknown route returned HTTP 404; no SPA fallback is present.
- `robots.txt` and `sitemap.xml` returned HTTP 200.
- Sitemap URL count: 17.
- Every canonical page has exactly one `h1`, a unique canonical, page metadata and valid JSON-LD.
- FAQ, tables, sources and internal links are present in raw `dist` HTML before JavaScript executes.
- A `noscript` rule exposes FAQ answers when JavaScript is disabled.
- The Nginx integration file contains 25 exact-match permanent 301 rules. Live 301 behaviour requires MG's Nginx integration and was not remotely deployed or tested.

## Build and dependency checks

- `npm ci --ignore-scripts` succeeded in a clean temporary directory.
- Production build and post-build verification succeeded.
- `npm audit`: 0 vulnerabilities.
- Node's build-time WASI experimental warning is expected from the portable parser fallback and is not shipped to the browser.

## Evidence locations

- Original/prototype screenshots supplied with the golden project: `qa/baseline/`
- Machine-readable acceptance summary: `qa/reports/acceptance.json`
- Built static output: `dist/`
- Nginx integration and redirect rules: `deployment/`
- Delivery SHA-256 manifest: `FILE_MANIFEST_SHA256.txt`
