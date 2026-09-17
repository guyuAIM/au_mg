# MG Australia static GEO detailed recheck

Date: 17 September 2026. This supersedes the earlier broad PASS statement.

## Outcome

Local content, measured layout and exercised interactions match after the corrections below. This is **not** a claim that every pixel or every deployment requirement has passed. The original remained read-only; no remote deployment was performed.

## Corrections

- Restored original MGS6 navigation padding (approximately 12px horizontal offset before correction).
- Restored mobile related-question font size/padding (approximately 55px cumulative expanded FAQ height difference before correction).
- Fixed copy-link success feedback after asynchronous clipboard access, including resetting the previous indicator.
- Matched filter-reset, related-question deep-link and hidden-item expand/collapse behavior.
- Preserved guide category/search state when returning through article breadcrumbs.
- Matched Explore submenu closing when toggling the mobile menu.
- Preserved React text-node segmentation in article dates/source numbers to eliminate rounding differences without changing visible text.
- Scoped Nginx integration to canonical routes and individual assets; removed rules that would take over the existing MG root route.
- Strengthened built-HTML checks for array-form table cells, bullets, notes and link fragments.

## Content and layout evidence

Same Chrome session and font environment; original localhost:4173, static production preview localhost:4321.

| Check | Result |
| --- | --- |
| 17 routes x desktop 1280x900 and mobile 390x844 | 34 comparisons |
| Visible text, table cells, external link order/targets, image sources and alt text | Exact in 34/34 |
| Page dimensions and visible element counts | Exact in 34/34 |
| Compared computed font/color/spacing/radius/image-fit properties | No differences |
| Maximum measured element-coordinate difference | 0.0078125px; below 1px limit |
| Fourteen guide articles at both widths | Measured element boxes exact |
| Mobile FAQ all 16 answers expanded | Text/tables exact; 780 elements exact; height 23681px in both |
| FAQ model/topic matrix | All 36 combinations exact for text, height and question order |
| Saved viewport screenshot pairs | 33/34 byte-identical |

Remaining screenshot difference: desktop FAQ native select text (`All models`), 1064 differing pixels within x960..1039/y792..807. Both pages have identical select text, position, size and computed font, with fonts loaded. The cause was not conclusively established; this pair is not labelled pixel-identical. Three image-region differences disappeared on settled recapture without code changes.

Screenshots are viewport captures, not full-page pixel comparisons. DOM measurements include rendered elements below the fold. Hidden controls/options and script/style elements are excluded from layout measurements. The static-only count wrapper is excluded to align equivalent elements.

## Interactions

Verified search and empty results, 36 model/topic combinations, expand/collapse with active filters, related FAQ navigation with filter reset, cold-start deep link, clipboard URL and success/reset labels, guide search/category selection and breadcrumb return, and mobile menu/Explore behavior. Final captured warning/error log was empty.

## Static, build and integration

- Five golden data/style files and 25 image/font assets are compared with the original by `npm run verify:original`.
- Fixed hashes and content contracts cover 14 guides, 16 FAQs, 25 sources and 25 legacy aliases.
- Raw built HTML contains article/FAQ text, table cells, sources and internal links. One h1, canonical metadata and parseable JSON-LD per canonical page are verified.
- Build checks validate local assets, routes and fragments, 17 sitemap URLs, no root HTML and no SPA shell.
- Nginx configuration is statically checked for 25 legacy 301 rules and scoped locations. Actual Nginx responses require integration; no Nginx runtime or remote 301 test was performed.
- FAQ answers have a noscript display rule. Actual browser execution with JavaScript disabled was not performed; raw-HTML verification is not presented as that test.
- Earlier clean-install and audit results are historical evidence in the initial report. WASI build warnings come from the portable parser fallback, not browser code.

## Evidence files

- `pages.json`: 34 comparison records; matching `desktop-{route-slug}-original.jpg`/`static.jpg` and `mobile-*` screenshot pairs.
- `expanded-mobile.json`, `mobile-faq-expanded-*.jpg`: current expanded FAQ checks.
- `filters-*.json`: six model groups, six topics each.
- `initial-findings/`: earlier diagnostic captures, not acceptance evidence.
- `http.json`: local production route smoke tests.
- `../reports/acceptance.json`: summary and limitations.
- `../../FILE_MANIFEST_SHA256.txt`: file manifest.

Both preview services remain available for manual comparison. Refresh the static preview after this recheck. Use HTTP rather than file://: root-relative CSS, fonts and images require a web server.
