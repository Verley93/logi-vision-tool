import { useQuery } from '@tanstack/react-query';

export interface MetricsData {
  timeframe: string;
  shippingLabels: {
    fedex: number;
    selectExpress: number;
    doordash: number;
    total: number;
  };
  serviceUpgrades: {
    upgraded: number;
    downgraded: number;
  };
  fedexMetrics: {
    zoneOnePackages: number;
    gtgtPackages: number;
  };
  storePackages: {
    sitting: number;
    shouldHaveBeenPickedUp: number;
  };
}

// Mock API function - in real app this would be an actual API call
const fetchMetrics = async (timeframe: string): Promise<MetricsData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    timeframe,
    shippingLabels: {
      fedex: 45670,
      selectExpress: 23450,
      doordash: 12890,
      total: 82010,
    },
    serviceUpgrades: {
      upgraded: 3450,
      downgraded: 1230,
    },
    fedexMetrics: {
      zoneOnePackages: 28340,
      gtgtPackages: 15670,
    },
    storePackages: {
      sitting: 2450,
      shouldHaveBeenPickedUp: 450,
    },
  };
};

export const useMetrics = (timeframe: string = '7d') => {
  return useQuery({
    queryKey: ['metrics', timeframe],
    queryFn: () => fetchMetrics(timeframe),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};