// Placeholder for fuzzy matching
export const fuzzyMatch = (query: string, items: string[]) => {
  return items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
};
