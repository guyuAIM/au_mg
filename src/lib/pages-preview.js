const encodeAttribute = value => String(value).replace(/[&"<>]/g, char => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' })[char]);

export function normalizePagesBase(value) {
  const base = String(value || '').trim().replace(/\/$/, '');
  if (!/^\/[A-Za-z0-9._-]+$/.test(base)) throw new Error(`Invalid GitHub Pages base: ${value}`);
  return base;
}

export function pagesRouteForFile(relativeFile, base) {
  const normalized = normalizePagesBase(base);
  const file = relativeFile.replaceAll('\\', '/');
  if (file === 'index.html' || file === '404.html') return `${normalized}/`;
  const match = file.match(/^([a-z0-9]+(?:-[a-z0-9]+)*)\/index\.html$/);
  if (!match) throw new Error(`Unexpected Pages HTML path: ${relativeFile}`);
  return `${normalized}/${match[1]}/`;
}

export function transformPagesHtml(html, relativeFile, base) {
  const normalized = normalizePagesBase(base);
  const pageBase = pagesRouteForFile(relativeFile, normalized);
  let output = String(html)
    .replace(/<base\s+href="[^"]*"\s*\/?\s*>/i, `<base href="${encodeAttribute(pageBase)}">`)
    .replace(/href="\/explore\/ev-guides([^\"]*)"/g, (all, tail) => {
      const boundary = tail.search(/[?#]/);
      const pathname = boundary < 0 ? tail : tail.slice(0, boundary);
      const suffix = boundary < 0 ? '' : tail.slice(boundary);
      const target = normalized + pathname + (pathname && !pathname.endsWith('/') ? '/' : '');
      return `href="${encodeAttribute(target + (pathname ? '' : '/') + suffix)}"`;
    });
  output = output.replace(/<html\b([^>]*)>/i, (all, attrs) => {
    const clean = attrs.replace(/\sdata-pages-base="[^"]*"/i, '');
    return `<html${clean} data-pages-base="${encodeAttribute(normalized)}">`;
  });
  if (!/<meta\s+name="robots"/i.test(output)) {
    output = output.replace(/<head>/i, '<head><meta name="robots" content="noindex, follow">');
  }
  return output;
}
