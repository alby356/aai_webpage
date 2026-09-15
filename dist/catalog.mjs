export function selectTools(tools, subject, sort) {
  const selected = tools.filter(tool => subject === 'all' || tool.subject === subject);
  return sort === 'name'
    ? selected.sort((a, b) => a.name.localeCompare(b.name, 'en'))
    : selected;
}

// The transition page only accepts published tools; never an arbitrary redirect URL.
const destinations = {
  chemions: { name: 'Ion Nomenclature Practice', url: 'https://chemions.vercel.app/' },
  quotesearch: { name: 'Quote Page Finder', url: 'https://quotesearch.vercel.app/' },
  chemshapes: { name: 'Molecular Geometry Quiz', url: 'https://chemshapes.vercel.app/' },
  chembalancing: { name: 'Equation & Redox Practice', url: 'https://chembalancing.vercel.app/' },
  chemsolu: { name: 'Solubility Rules Quiz', url: 'https://chemsolu.vercel.app/' },
  wocab: { name: 'Vocabulary Builder', url: 'https://wocab.vercel.app/' },
};

export function getDestination(id) {
  return Object.hasOwn(destinations, id)
    ? destinations[id]
    : null;
}
