# MG Australia EV Guides delivery

Open `dist/index.html` in Chrome to browse locally (JavaScript enabled), or serve `dist` through the supplied URL mappings. The root index is the complete guide hub, not a redirect or JS-loaded content shell. No backend, CMS or API is required. This package contains the EV guide list and 14 articles only; FAQ/model navigation goes to the existing MG website.

## Package mode

The default is `navigation`: official header/footer markup and theme presentation, isolated from guide content, with online synchronization and a packaged fallback. `content` omits the header/footer and all navigation synchronization. The mode is printed at the top of the ZIP README and in `dist/delivery-config.json`. See `deployment/NAVIGATION_MODES.md` for behavior, integration requirements and limitations. This is an extraction adapter, not a supported official component. The floating enquiry bar is excluded and menus are click-only. Form-related links continue on the MG homepage. Local-file mode uses the packaged snapshot without network synchronization.

For MG integration, place the contents of `dist` directly in a dedicated fixed directory. `index.html`, `sitemap_evguide.xml`, `assets/`, `scripts/` and the article folders are siblings. Configure the scoped rules in `deployment` once, changing only `$mg_evguide_dir` to that directory. Public /explore/ev-guides maps to its index.html; it does NOT map to the existing MG homepage. Do NOT replace the site's robots.txt or main sitemap. Merge the supplied sitemap reference only. See `deployment/FIXED_DIRECTORY.md` for the first integration and subsequent file-only updates.

Child sitemap URL: https://mgmotor.com.au/sitemap_evguide.xml

The sitemap includes 15 canonical content URLs (including the guide hub), not the preview URL / or redirect aliases. The XML file is at the same physical directory level as index.html, while its public URL remains the domain-root URL shown above. MG owns production deployment and site-verification accounts.

`SHA256SUMS.txt` covers the files inside this delivery. Source code, dependencies and internal QA artifacts are intentionally not included in this customer ZIP.

## Local-file acceptance checklist

The file-browsing implementation and static path checks are complete, but automated file:// browser verification was unavailable. Before signing off local-file delivery, extract the ZIP to a folder with Chinese characters and spaces, open dist/index.html in Chrome, and confirm:

1. The root index directly displays the guide list with MG fonts, icons and all images; it does not redirect.
2. Each of the 14 articles opens, related links work, and the breadcrumb returns to the list.
3. Search, all categories, empty results and clearing filters work; returning from a filtered article preserves the list selection.
4. Article questions expand; in navigation mode, mobile menu and Explore navigation work.
5. FAQ, MGS6 and other official links go to the existing MG site, not missing files.

The source project's `qa/FLAT_DELIVERY_REPORT.md` records the current root-entry layout checks. This checklist remains a manual local-file acceptance step, not a claim that it was already performed.
