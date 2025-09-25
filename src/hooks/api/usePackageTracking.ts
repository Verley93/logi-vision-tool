import { useQuery } from '@tanstack/react-query';

export interface PackageDetails {
  id: string;
  trackingNumber: string;
  customerOrderNumber?: string;
  fulfillmentOrderNumber?: string;
  status: 'in_transit' | 'delivered' | 'pending' | 'exception' | 'at_store';
  carrier: 'fedex' | 'select_express' | 'doordash';
  serviceLevel: string;
  currentLocation: string;
  estimatedDelivery: string;
  events: PackageEvent[];
  storeInfo?: {
    storeId: string;
    storeName: string;
    address: string;
  };
}

export interface PackageEvent {
  timestamp: string;
  location: string;
  description: string;
  status: string;
}

// Mock API function
const fetchPackageDetails = async (
  searchValue: string, 
  searchType: 'tracking' | 'customer_order' | 'fulfillment_order'
): Promise<PackageDetails> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id: 'pkg_' + searchValue,
    trackingNumber: searchType === 'tracking' ? searchValue : '1Z999AA1234567890',
    customerOrderNumber: searchType === 'customer_order' ? searchValue : 'ORD-' + Math.random().toString(36).substr(2, 9),
    fulfillmentOrderNumber: searchType === 'fulfillment_order' ? searchValue : 'FUL-' + Math.random().toString(36).substr(2, 9),
    status: ['in_transit', 'delivered', 'pending', 'at_store'][Math.floor(Math.random() * 4)] as any,
    carrier: ['fedex', 'select_express', 'doordash'][Math.floor(Math.random() * 3)] as any,
    serviceLevel: 'Ground',
    currentLocation: 'Chicago, IL',
    estimatedDelivery: '2024-01-15',
    events: [
      {
        timestamp: '2024-01-14T10:30:00Z',
        location: 'Chicago, IL',
        description: 'Package arrived at sort facility',
        status: 'In Transit'
      },
      {
        timestamp: '2024-01-13T15:45:00Z',
        location: 'Milwaukee, WI',
        description: 'Package departed facility',
        status: 'In Transit'
      },
      {
        timestamp: '2024-01-13T09:20:00Z',
        location: 'Milwaukee, WI',
        description: 'Package received at facility',
        status: 'In Transit'
      }
    ],
    storeInfo: {
      storeId: 'STR001',
      storeName: 'Downtown Chicago Store',
      address: '123 Michigan Ave, Chicago, IL 60601'
    }
  };
};

export const usePackageTracking = (
  searchValue: string,
  searchType: 'tracking' | 'customer_order' | 'fulfillment_order',
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['package-tracking', searchValue, searchType],
    queryFn: () => fetchPackageDetails(searchValue, searchType),
    enabled: enabled && !!searchValue,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};