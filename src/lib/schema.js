import { absoluteAsset, canonical, site } from './site.js';

const ids = Object.freeze({
  organization: `${site.origin}/#organization`,
  website: `${site.origin}/#website`
});

const baseGraph = ({ path, title, description, pageType = 'WebPage' }) => {
  const url = canonical(path);
  return [
    {
      '@type': 'Organization',
      '@id': ids.organization,
      name: site.brandName,
      legalName: site.legalName,
      url: `${site.origin}/`,
      logo: absoluteAsset(site.logoPath)
    },
    {
      '@type': 'WebSite',
      '@id': ids.website,
      url: `${site.origin}/`,
      name: site.brandName,
      publisher: { '@id': ids.organization },
      inLanguage: site.language
    },
    {
      '@type': pageType === 'WebPage' ? 'WebPage' : ['WebPage', pageType],
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      isPartOf: { '@id': ids.website },
      about: { '@id': ids.organization },
      inLanguage: site.language
    }
  ];
};

const faqNode = (path, faqs) => ({
  '@type': 'FAQPage',
  '@id': `${canonical(path)}#faq`,
  isPartOf: { '@id': `${canonical(path)}#webpage` },
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

export function faqPageSchema({ path, title, description, faqs, vehicle = false }) {
  const graph = baseGraph({ path, title, description, pageType: 'FAQPage' });
  graph[2].mainEntity = faqNode(path, faqs).mainEntity;
  if (vehicle) {
    graph.push({
      '@type': ['Product', 'Vehicle'],
      '@id': `${canonical(path)}#vehicle`,
      name: 'MGS6 EV',
      brand: { '@type': 'Brand', name: 'MG' },
      image: [absoluteAsset('/assets/mgs6-hero-desktop.jpg'), absoluteAsset('/assets/mgs6-hero-mobile.jpg')],
      url: canonical(path),
      mainEntityOfPage: { '@id': `${canonical(path)}#webpage` }
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function guideHubSchema({ guides, title, description }) {
  const path = '/explore/ev-guides';
  const graph = baseGraph({ path, title, description, pageType: 'CollectionPage' });
  graph.push({
    '@type': 'ItemList',
    '@id': `${canonical(path)}#guides`,
    numberOfItems: guides.length,
    itemListElement: guides.map((guide, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: guide.title,
      url: canonical(`/explore/ev-guides/${guide.slug}`)
    }))
  });
  graph[2].mainEntity = { '@id': `${canonical(path)}#guides` };
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function guideArticleSchema(guide, sourceUrls) {
  const path = `/explore/ev-guides/${guide.slug}`;
  const title = `${guide.title} | MG Australia`;
  const graph = baseGraph({ path, title, description: guide.summary, pageType: 'Article' });
  graph.push({
    '@type': 'Article',
    '@id': `${canonical(path)}#article`,
    headline: guide.title,
    description: guide.summary,
    datePublished: guide.publishedIso,
    dateModified: guide.modifiedIso,
    inLanguage: site.language,
    mainEntityOfPage: { '@id': `${canonical(path)}#webpage` },
    publisher: { '@id': ids.organization },
    image: absoluteAsset(guide.image.src),
    about: guide.targetModels,
    citation: sourceUrls
  });
  graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${canonical(path)}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'EV Guides & Advice', item: canonical('/explore/ev-guides') },
      { '@type': 'ListItem', position: 2, name: guide.title, item: canonical(path) }
    ]
  });
  graph.push(faqNode(path, guide.faq.map(([question, answer]) => ({ question, answer }))));
  return { '@context': 'https://schema.org', '@graph': graph };
}
