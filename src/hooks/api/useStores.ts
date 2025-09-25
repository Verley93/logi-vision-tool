import { useQuery } from '@tanstack/react-query';

export interface Store {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: 'active' | 'inactive' | 'maintenance';
  shipperAccount: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  autoPickupScheduling: boolean;
  shippableZipCodes: string[];
  pendingPickups: number;
  missedPickups: number;
  lastUpdated: string;
}

// Mock API function
const fetchStores = async (page: number = 1, search?: string): Promise<{ stores: Store[], totalCount: number }> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Generate mock stores
  const stores: Store[] = Array.from({ length: 20 }, (_, i) => {
    const storeId = `STR${String(page * 20 + i).padStart(3, '0')}`;
    return {
      id: storeId,
      name: `Store ${storeId} - ${['Downtown', 'Mall', 'Outlet', 'Express'][i % 4]}`,
      address: {
        street: `${100 + i} Main St`,
        city: ['Chicago', 'New York', 'Los Angeles', 'Dallas', 'Miami'][i % 5],
        state: ['IL', 'NY', 'CA', 'TX', 'FL'][i % 5],
        zipCode: `${60601 + i}`,
      },
      status: ['active', 'inactive', 'maintenance'][i % 3] as any,
      shipperAccount: `SHIP-${storeId}`,
      hours: {
        monday: '9:00 AM - 9:00 PM',
        tuesday: '9:00 AM - 9:00 PM',
        wednesday: '9:00 AM - 9:00 PM',
        thursday: '9:00 AM - 9:00 PM',
        friday: '9:00 AM - 10:00 PM',
        saturday: '9:00 AM - 10:00 PM',
        sunday: '10:00 AM - 8:00 PM',
      },
      autoPickupScheduling: i % 3 === 0,
      shippableZipCodes: [`${60601 + i}`, `${60602 + i}`, `${60603 + i}`],
      pendingPickups: Math.floor(Math.random() * 10),
      missedPickups: Math.floor(Math.random() * 3),
      lastUpdated: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    };
  });

  return {
    stores: search 
      ? stores.filter(store => 
          store.name.toLowerCase().includes(search.toLowerCase()) ||
          store.id.toLowerCase().includes(search.toLowerCase())
        )
      : stores,
    totalCount: 800, // Total stores in system
  };
};

export const useStores = (page: number = 1, search?: string) => {
  return useQuery({
    queryKey: ['stores', page, search],
    queryFn: () => fetchStores(page, search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStore = (storeId: string) => {
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      const { stores } = await fetchStores(1);
      return stores.find(store => store.id === storeId);
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
  });
};