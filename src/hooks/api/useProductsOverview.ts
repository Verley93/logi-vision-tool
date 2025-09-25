import { useQuery } from '@tanstack/react-query';

export interface ProductsOverview {
  totalProducts: number;
  categories: {
    name: string;
    count: number;
    percentage: number;
  }[];
  recentlyUpdated: {
    id: string;
    name: string;
    sku: string;
    lastUpdated: string;
    status: 'active' | 'inactive' | 'pending';
  }[];
  shippingMetrics: {
    eligibleForPO: number;
    eligibleForAPO: number;
    restrictedItems: number;
    overSizeItems: number;
  };
}

// Mock API function for products overview
const fetchProductsOverview = async (): Promise<ProductsOverview> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    totalProducts: 14256783,
    categories: [
      { name: 'Electronics', count: 3456789, percentage: 24.2 },
      { name: 'Clothing & Apparel', count: 2890456, percentage: 20.3 },
      { name: 'Home & Garden', count: 2134567, percentage: 15.0 },
      { name: 'Sports & Outdoors', count: 1789234, percentage: 12.5 },
      { name: 'Health & Beauty', count: 1567890, percentage: 11.0 },
      { name: 'Books & Media', count: 1234567, percentage: 8.7 },
      { name: 'Automotive', count: 987654, percentage: 6.9 },
      { name: 'Other', count: 195626, percentage: 1.4 },
    ],
    recentlyUpdated: Array.from({ length: 10 }, (_, i) => ({
      id: `PROD-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      name: [
        'Wireless Bluetooth Earbuds Pro',
        'Premium Cotton T-Shirt',
        'Smart Home Security Camera',
        'Fitness Tracker Watch',
        'Kitchen Stand Mixer',
        'Gaming Mechanical Keyboard',
        'Outdoor Hiking Backpack',
        'LED Desk Lamp with USB',
        'Protein Powder Vanilla',
        'Car Phone Mount Holder'
      ][i],
      sku: `SKU-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
      lastUpdated: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as any,
    })),
    shippingMetrics: {
      eligibleForPO: 12890456,
      eligibleForAPO: 8456789,
      restrictedItems: 234567,
      overSizeItems: 456123,
    },
  };
};

export const useProductsOverview = () => {
  return useQuery({
    queryKey: ['products-overview'],
    queryFn: fetchProductsOverview,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};