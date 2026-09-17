# MG Australia header/footer public-resource audit

Checked: 2026-09-17. Scope: read-only HTTP requests to the public MG homepage,
Experience Hub and FAQ page, plus inspection of this project's layout. This is
an integration assessment, not a completed browser compatibility or visual test.
No production changes, commits or pushes were made. Existing header/footer,
guide content, CSS baselines and delivery ZIP are unchanged by this assessment.

## Confirmed public resources

| Resource | Observed URL | Role / limitation |
| --- | --- | --- |
| Navigation JS | https://mgmotor.com.au/theme3/assets/js/nav.js | jQuery mobile side-menu adapter. Copies `.navbar-collapse` content into `#side-menu`; listens for Bootstrap collapse events. Does not supply navigation HTML or the complete vehicle mega-menu behavior. |
| Navigation CSS | https://mgmotor.com.au/theme3/assets/css/nav.css | Side-menu positioning and overlay, not the complete desktop header styling. |
| Footer CSS | https://mgmotor.com.au/theme3/assets/css/Footer-Basic.css?v=5 | Footer styles with dependencies on Bootstrap utilities and other page rules. |
| General CSS | https://mgmotor.com.au/theme3/assets/css/styles.css?v=91 | Shared whole-site styles, not safe to assume isolated from guide styles. |
| Theme CSS | https://mgmotor.com.au/theme3/assets/css/white.css?v=6 | Additional shared theme styles. |
| Bootstrap CSS | https://mgmotor.com.au/theme3/assets/bootstrap/css/bootstrap.min.css | Observed version 4.5.2; introduces document-wide element and utility rules. |
| jQuery | https://mgmotor.com.au/theme3/assets/js/jquery.min.js | Observed version 3.5.1, required by `nav.js`. |
| Bootstrap JS | https://mgmotor.com.au/theme3/assets/bootstrap/js/bootstrap.min.js | Observed version 4.5.2; navigation uses collapse events. |
| Icon font CSS | https://mgmotor.com.au/theme3/assets/fonts/ionicons.min.css | Referenced by the official page; font delivery needs separate validation. |

The first eight resources returned HTTP 200 during inspection. These URLs are
observed implementation details, not a documented component API or an assurance
that their content will remain unchanged. Query-string versions are not an
immutability guarantee.

## HTML and additional dependencies

- The homepage includes `<nav class="navbar navbar-dark navbar-expand-lg">`,
  vehicle cards, other mega menus, `<footer class="footer">` and
  `<footer class="footer-basic">` in its initial HTML.
- No independent header/footer HTML endpoint was identified in the inspected
  source. This does not establish that no such endpoint exists anywhere.
- Vehicle filtering and `toggleMegaMenu` are inline page JavaScript, outside
  `nav.js`. Significant menu CSS is also inline.
- Navigation/footer actions include calls to `testDriveBooking()` and
  `updatesNow()`. Copying the markup without their dependencies leaves broken
  controls. Importing the complete site scripts also brings unrelated forms,
  analytics, dealer/map integrations and chat; these must not be imported merely
  to obtain a menu.
- The FAQ response currently includes `Access-Control-Allow-Origin: *`.
  Therefore cross-origin HTML fetching is not categorically impossible. However,
  no browser integration was tested, and this response is not a stable fragment
  service contract. Injecting HTML does not by itself reproduce the required
  script initialization or resolve style conflicts.
- Local guide CSS includes global selectors and shared class names; a whole-site
  stylesheet could change already accepted typography, dimensions and spacing.
- Some official stylesheets contain an explicit reuse/copyright notice. Public
  availability should not be treated as a reusable component license; resource
  reuse should be covered by the client's authorization.

## Recommended integration boundary (not implemented)

1. Maintain a self-contained header/footer in this project, based on an approved
   official reference, with styles isolated from the guide body. Do not load the
   complete remote site script set into guide pages.
2. Render navigation HTML at build time so the initial HTML contains real links.
   Keep guide content, metadata and the 15-URL sitemap unchanged.
3. Implement only local menu expansion/filter behavior. Ordinary navigation links
   should resolve to official absolute URLs; EV guide links remain in this package.
4. Decide explicitly whether form-like actions may navigate to an official page
   instead of opening the official in-page dialog. Verify actual destination URLs
   before implementation; do not invent them or silently change the user result.
5. Treat this as a locally maintained version, not automatic synchronization with
   future official navigation changes. Review updates before rebuilding/releasing.
6. Validate desktop/mobile menus and guide-body layout against the existing
   baselines. Recheck no-JS content and local-path handling. A new header may change
   the body's absolute vertical position, so distinguish that intended change
   from changes to the internal guide layout.

An alternative that fetches the whole official page on every visitor request and
extracts its navigation is technically possible under suitable origin/CORS
conditions, but introduces runtime network dependency, layout shifts, markup
coupling and offline failure. It does not match the current self-contained static
delivery goals as well as a reviewed build-time version.

## Decision needed before replacement

Accept a locally maintained official-style header/footer and official-page
navigation for form actions, or require the exact official popup behavior and
automatic synchronization? The latter has not been demonstrated with a supported
public component endpoint and needs separate feasibility validation.
