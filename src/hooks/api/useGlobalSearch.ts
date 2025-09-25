import { useQuery } from '@tanstack/react-query';

export interface SearchResult {
  id: string;
  type: 'store' | 'product' | 'package';
  title: string;
  subtitle: string;
  description?: string;
  url: string;
}

// Mock global search function
const globalSearch = async (query: string): Promise<SearchResult[]> => {
  if (!query || query.length < 2) return [];
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const results: SearchResult[] = [];
  
  // Mock store results
  if (query.toLowerCase().includes('store') || query.toLowerCase().includes('str')) {
    results.push({
      id: 'store-1',
      type: 'store',
      title: 'Store STR001 - Downtown',
      subtitle: 'Chicago, IL',
      description: '123 Michigan Ave, Active',
      url: '/stores'
    });
  }
  
  // Mock product results
  if (query.toLowerCase().includes('product') || query.toLowerCase().includes('prd')) {
    results.push({
      id: 'product-1',
      type: 'product',
      title: 'Product PRD12345',
      subtitle: 'Electronics Category',
      description: 'Weight: 2.5lbs, Ship Class: Standard',
      url: '/products'
    });
  }
  
  // Mock package results (if looks like tracking number)
  if (/^\w{10,}$/.test(query) || query.toLowerCase().includes('track')) {
    results.push({
      id: 'package-1',
      type: 'package',
      title: `Package ${query}`,
      subtitle: 'In Transit',
      description: 'FedEx Ground - Chicago, IL',
      url: '/tracking'
    });
  }
  
  // Add some generic results based on query
  const mockResults = [
    {
      id: 'result-1',
      type: 'store' as const,
      title: `${query} Store Results`,
      subtitle: 'Multiple stores found',
      description: 'Active stores matching your search',
      url: `/stores?search=${encodeURIComponent(query)}`
    },
    {
      id: 'result-2',
      type: 'product' as const,
      title: `${query} Product Results`,
      subtitle: 'Product catalog',
      description: 'Products matching your search',
      url: `/products?search=${encodeURIComponent(query)}`
    }
  ];
  
  results.push(...mockResults.slice(0, Math.max(0, 5 - results.length)));
  
  return results.slice(0, 8);
};

export const useGlobalSearch = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['global-search', query],
    queryFn: () => globalSearch(query),
    enabled: enabled && query.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });
};