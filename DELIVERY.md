# MG Australia EV Guides delivery

Open `dist/index.html` in Chrome to browse locally (JavaScript enabled), or serve `dist` with HTTP. No backend, CMS or API is required. This package contains the EV guide list and 14 articles only; FAQ/model navigation goes to the existing MG website.

## Package mode

The default is `navigation`: packaged header/footer plus data-only online synchronization from the official MG page, with a static fallback. `content` omits the header/footer and all navigation synchronization. The mode is printed at the top of the ZIP README and in `dist/delivery-config.json`. See `deployment/NAVIGATION_MODES.md` for behavior, integration requirements and limitations. Navigation presentation is locally maintained; this is not an exact visual copy or a supported official component. Form-related navigation currently continues on the MG homepage. Local-file mode uses the packaged snapshot without network synchronization.

For MG integration, deploy `dist` to a dedicated release directory and use the scoped rules in `deployment`. Do NOT replace the existing MG homepage with this package's preview launcher. Do NOT replace the site's robots.txt or main sitemap. Merge the supplied sitemap reference only.

Child sitemap URL: https://mgmotor.com.au/sitemap_evguide.xml

The sitemap includes 15 canonical content URLs, not the preview launcher or redirect aliases. See deployment/README.md for server configuration, robots/index integration, Google/Bing submission and verification. MG owns production deployment and site-verification accounts.

`SHA256SUMS.txt` covers the files inside this delivery. Source code, dependencies and internal QA artifacts are intentionally not included in this customer ZIP.

## Local-file acceptance checklist

The file-browsing implementation and static path checks are complete, but automated file:// browser verification was unavailable. Before signing off local-file delivery, extract the ZIP to a folder with Chinese characters and spaces, open dist/index.html in Chrome, and confirm:

1. The guide list opens automatically with MG fonts, icons and all images displayed.
2. Each of the 14 articles opens, related links work, and the breadcrumb returns to the list.
3. Search, all categories, empty results and clearing filters work; returning from a filtered article preserves the list selection.
4. Article questions expand; in navigation mode, mobile menu and Explore navigation work.
5. FAQ, MGS6 and other official links go to the existing MG site, not missing files.

Earlier HTTP visual/content checks and local Nginx routing checks covered the previous shell. The source project's `qa/NAVIGATION_MODES_REPORT.md` records the current dual-mode checks separately. This checklist remains a manual local-file acceptance step, not a claim that it was already performed.
