
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

// Predictive suggestions based on common place types
export const getPredictiveSuggestions = (query: string): string[] => {
  const suggestions = [
    'Restaurante',
    'Parque',
    'Hospital',
    'Escuela',
    'Biblioteca',
    'Centro comercial',
    'Museo',
    'Cafetería',
    'Hotel',
    'Gimnasio'
  ];

  if (!query) return [];

  const normalizedQuery = normalizeText(query);
  return suggestions.filter(suggestion => 
    normalizeText(suggestion).includes(normalizedQuery)
  );
};

// Popular locations matching the search query
export const getMatchingPopularLocations = (query: string): string[] => {
  const popularLocations = [
    'Plaza Mayor',
    'Parque Central',
    'Centro Histórico',
    'Terminal de Transporte',
    'Estadio Municipal',
    'Mercado Central',
    'Universidad Nacional',
    'Hospital General',
    'Biblioteca Pública',
    'Teatro Municipal'
  ];

  if (!query) return [];

  const normalizedQuery = normalizeText(query);
  return popularLocations.filter(location => 
    normalizeText(location).includes(normalizedQuery)
  );
};
