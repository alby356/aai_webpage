export function selectTools(tools, subject, sort) {
  const selected = tools.filter(tool => subject === 'all' || tool.subject === subject);
  return sort === 'name'
    ? selected.sort((a, b) => a.name.localeCompare(b.name, 'en'))
    : selected;
}

// The transition page only accepts published tools; never an arbitrary redirect URL.
const destinations = {
  chemions: { name: 'Chem Ions', url: 'https://chemions.vercel.app/' },
  quotesearch: { name: 'QuoteSearch', url: 'https://quotesearch.vercel.app/' },
  chemshapes: { name: 'Chem Shapes', url: 'https://chemshapes.vercel.app/' },
  chembalancing: { name: 'Chem Balancing', url: 'https://chembalancing.vercel.app/' },
  chemsolu: { name: 'Chem Solubility', url: 'https://chemsolu.vercel.app/' },
  wocab: { name: 'Wocab', url: 'https://wocab.vercel.app/' },
};

export function getDestination(id) {
  return Object.hasOwn(destinations, id)
    ? destinations[id]
    : null;
}
