import { useQuery } from '@tanstack/react-query';

export interface ProductsOverview {
  totalSKUs: number;
  totalStyles: number;
  totalECodes: number;
  vendors: {
    id: number;
    name: string;
    skuCount: number;
    directVendor: boolean;
  }[];
  shipClasses: {
    class: string;
    count: number;
    percentage: number;
  }[];
  restrictions: {
    code: string;
    category: string;
    affectedStyles: number;
    states: string[];
  }[];
  eligibilityMetrics: {
    gtgt: number;
    expedite: number;
    po: number;
    apoFpo: number;
    hazmat: number;
    baggable: number;
    sfs: number;
    doordash: number;
  };
}

// Mock API function for products overview
const fetchProductsOverview = async (): Promise<ProductsOverview> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    totalSKUs: 14256783,
    totalStyles: 2847293,
    totalECodes: 1523847,
    vendors: [
      { id: 2279, name: 'SPORT HELMETS, INC.', skuCount: 1834567, directVendor: false },
      { id: 1045, name: 'NIKE, INC.', skuCount: 2567890, directVendor: true },
      { id: 3421, name: 'ADIDAS AG', skuCount: 1923456, directVendor: true },
      { id: 5678, name: 'UNDER ARMOUR, INC.', skuCount: 1456789, directVendor: false },
      { id: 7890, name: 'PUMA SE', skuCount: 987654, directVendor: true },
    ],
    shipClasses: [
      { class: 'OP', count: 8456789, percentage: 59.3 },
      { class: 'OW', count: 2890456, percentage: 20.3 },
      { class: 'SP', count: 1789234, percentage: 12.5 },
      { class: 'SW', count: 856789, percentage: 6.0 },
      { class: 'TH', count: 263515, percentage: 1.9 },
    ],
    restrictions: [
      { code: 'R00001', category: 'Alcohol', affectedStyles: 23456, states: ['AL', 'AK', 'UT'] },
      { code: 'R00005', category: 'CBD', affectedStyles: 15678, states: ['HI', 'IA', 'LA', 'MS', 'NY', 'SD'] },
      { code: 'R00103', category: 'Hazmat', affectedStyles: 8934, states: ['CA', 'NY', 'FL'] },
      { code: 'R00201', category: 'Weapons', affectedStyles: 5647, states: ['CA', 'CT', 'MA', 'NJ', 'NY'] },
    ],
    eligibilityMetrics: {
      gtgt: 12890456,
      expedite: 13456789,
      po: 8456789,
      apoFpo: 7234567,
      hazmat: 234567,
      baggable: 11456789,
      sfs: 13890456,
      doordash: 2456789,
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