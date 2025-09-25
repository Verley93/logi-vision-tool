import { useState } from 'react';
import { usePackageTracking } from '@/hooks/api/usePackageTracking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Store
} from 'lucide-react';

const searchTypes = [
  { value: 'tracking', label: 'Tracking Number', placeholder: 'Enter tracking number...' },
  { value: 'customer_order', label: 'Customer Order', placeholder: 'Enter customer order number...' },
  { value: 'fulfillment_order', label: 'Fulfillment Order', placeholder: 'Enter fulfillment order number...' },
];

const statusConfig = {
  in_transit: {
    label: 'In Transit',
    variant: 'secondary' as const,
    icon: Truck,
    color: 'text-blue-600'
  },
  delivered: {
    label: 'Delivered',
    variant: 'secondary' as const,
    icon: CheckCircle,
    color: 'text-success'
  },
  pending: {
    label: 'Pending',
    variant: 'secondary' as const,
    icon: Clock,
    color: 'text-warning'
  },
  exception: {
    label: 'Exception',
    variant: 'destructive' as const,
    icon: AlertCircle,
    color: 'text-destructive'
  },
  at_store: {
    label: 'At Store',
    variant: 'secondary' as const,
    icon: Store,
    color: 'text-info'
  }
};

const carrierConfig = {
  fedex: { label: 'FedEx', color: 'bg-purple-100 text-purple-800' },
  select_express: { label: 'Select Express', color: 'bg-blue-100 text-blue-800' },
  doordash: { label: 'DoorDash', color: 'bg-red-100 text-red-800' }
};

export default function PackageTracking() {
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState<'tracking' | 'customer_order' | 'fulfillment_order'>('tracking');
  const [hasSearched, setHasSearched] = useState(false);

  const { data: packageDetails, isLoading, error } = usePackageTracking(
    searchValue,
    searchType,
    hasSearched && searchValue.length > 0
  );

  const handleSearch = () => {
    if (searchValue.trim()) {
      setHasSearched(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const currentSearchType = searchTypes.find(type => type.value === searchType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Package Tracking</h1>
        <p className="text-muted-foreground">
          Track packages using tracking numbers, customer orders, or fulfillment orders
        </p>
      </div>

      {/* Search Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Package
          </CardTitle>
          <CardDescription>
            Enter package information to track its current status and location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {searchTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="sm:col-span-2">
              <div className="flex gap-2">
                <Input
                  placeholder={currentSearchType?.placeholder}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={!searchValue.trim() || isLoading}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {isLoading && (
        <Card className="shadow-card">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Searching for package...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="shadow-card border-destructive-light bg-destructive-light/20">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Package Not Found</h3>
              <p className="text-muted-foreground">
                No package found with the provided information. Please check your input and try again.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {packageDetails && !isLoading && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Package Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Package Details
                    </CardTitle>
                    <CardDescription>
                      Tracking Number: {packageDetails.trackingNumber}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={statusConfig[packageDetails.status].variant}
                      className="mb-2"
                    >
                      {statusConfig[packageDetails.status].label}
                    </Badge>
                    <div className={`text-xs px-2 py-1 rounded-full ${carrierConfig[packageDetails.carrier].color}`}>
                      {carrierConfig[packageDetails.carrier].label}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Current Location</p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {packageDetails.currentLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Estimated Delivery</p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatDateTime(packageDetails.estimatedDelivery)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Service Level</p>
                    <p>{packageDetails.serviceLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Customer Order</p>
                    <p className="font-mono text-sm">{packageDetails.customerOrderNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Events */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Tracking History</CardTitle>
                <CardDescription>
                  Complete tracking timeline for this package
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packageDetails.events.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-primary' : 'bg-muted'
                        }`} />
                        {index !== packageDetails.events.length - 1 && (
                          <div className="w-px h-12 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{event.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(event.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Store Information */}
          <div className="space-y-6">
            {packageDetails.storeInfo && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Store Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Store Name</p>
                    <p>{packageDetails.storeInfo.storeName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Store ID</p>
                    <p className="font-mono text-sm">{packageDetails.storeInfo.storeId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Address</p>
                    <p className="text-sm">{packageDetails.storeInfo.address}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  View Related Orders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  View Store Details
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {!hasSearched && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Use the search form above to track packages. You can search by:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {searchTypes.map((type) => (
                <div key={type.value} className="p-4 border rounded-lg bg-surface-hover/50">
                  <h4 className="font-medium mb-2">{type.label}</h4>
                  <p className="text-sm text-muted-foreground">{type.placeholder}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}