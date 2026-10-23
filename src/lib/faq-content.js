// Ordered blocks preserve the document's paragraphs, tables and qualifications.
// The original FAQ source continues to use paragraphs/table/note unchanged.
export function faqBlocks(faq) {
  if (faq.blocks) return faq.blocks;
  return [
    ...faq.paragraphs.map((text) => ({ type: 'paragraph', text })),
    ...(faq.table ? [{ type: 'table', ...faq.table }] : []),
    ...(faq.note ? [{ type: 'paragraph', text: faq.note }] : [])
  ];
}

export function faqTextSegments(text, faq, faqs) {
  if (!faq.referencePrefix) return [{ text }];
  return text.split(/(\bFAQ \d+\b)/g).filter(Boolean).map((part) => {
    const match = /^FAQ (\d+)$/.exec(part);
    const target = match && faqs.find((candidate) => candidate.id === `${faq.referencePrefix}${match[1].padStart(2, '0')}`);
    return target ? { text: target.question, href: `${faq.owner}#${target.id}` } : { text: part };
  });
}

export function faqAnswerText(faq, faqs) {
  return faqBlocks(faq).map((block) => block.type === 'table'
    ? block.rows.map((row) => row.map((cell, index) => `${block.headers[index]}: ${cell}`).join('; ')).join('. ')
    : faqTextSegments(block.text, faq, faqs).map((segment) => segment.text).join('')
  ).join(' ');
}
