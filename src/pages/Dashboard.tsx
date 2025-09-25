import { useState } from 'react';
import { useMetrics } from '@/hooks/api/useMetrics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Truck, 
  Clock, 
  MapPin,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const timeframeOptions = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
];

interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  icon: React.ElementType;
  description: string;
  variant?: 'default' | 'warning' | 'success' | 'destructive';
}

function MetricCard({ title, value, change, icon: Icon, description, variant = 'default' }: MetricCardProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return 'border-warning-light bg-warning-light/20';
      case 'success':
        return 'border-success-light bg-success-light/20';
      case 'destructive':
        return 'border-destructive-light bg-destructive-light/20';
      default:
        return 'border-border bg-card';
    }
  };

  return (
    <Card className={`shadow-card transition-all hover:shadow-md ${getVariantStyles()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {formatNumber(value)}
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
          {change !== undefined && (
            <div className={`flex items-center text-xs ${
              change >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {change >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('7d');
  const { data: metrics, isLoading, error } = useMetrics(timeframe);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">Failed to load metrics</h3>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor key performance metrics across your eCommerce operations
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            Export Data
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : metrics ? (
        <>
          {/* Shipping Labels Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Shipping Labels Generated</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Labels"
                value={metrics.shippingLabels.total}
                change={12.5}
                icon={Package}
                description="All carriers combined"
                variant="success"
              />
              <MetricCard
                title="FedEx Labels"
                value={metrics.shippingLabels.fedex}
                change={8.2}
                icon={Truck}
                description="FedEx shipments"
              />
              <MetricCard
                title="Select Express"
                value={metrics.shippingLabels.selectExpress}
                change={-3.1}
                icon={Truck}
                description="Select Express shipments"
              />
              <MetricCard
                title="DoorDash"
                value={metrics.shippingLabels.doordash}
                change={22.4}
                icon={Truck}
                description="DoorDash deliveries"
              />
            </div>
          </div>

          {/* Service Levels Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Service Level Changes</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <MetricCard
                title="Upgrades"
                value={metrics.serviceUpgrades.upgraded}
                change={15.3}
                icon={TrendingUp}
                description="Service level upgrades"
                variant="success"
              />
              <MetricCard
                title="Downgrades"
                value={metrics.serviceUpgrades.downgraded}
                change={-8.7}
                icon={TrendingDown}
                description="Service level downgrades"
                variant="warning"
              />
            </div>
          </div>

          {/* FedEx Specific Metrics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">FedEx Performance</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <MetricCard
                title="Zone One Packages"
                value={metrics.fedexMetrics.zoneOnePackages}
                change={5.8}
                icon={MapPin}
                description="FedEx Zone 1 shipments"
              />
              <MetricCard
                title="GTGT Packages"
                value={metrics.fedexMetrics.gtgtPackages}
                change={18.2}
                icon={Clock}
                description="Guaranteed to Get There"
                variant="success"
              />
            </div>
          </div>

          {/* Store Package Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Store Package Status</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <MetricCard
                title="Packages at Stores"
                value={metrics.storePackages.sitting}
                change={-2.1}
                icon={Package}
                description="Currently at store locations"
                variant="warning"
              />
              <MetricCard
                title="Missed Pickups"
                value={metrics.storePackages.shouldHaveBeenPickedUp}
                change={12.3}
                icon={AlertTriangle}
                description="Should have been picked up"
                variant="destructive"
              />
            </div>
          </div>
        </>
      ) : null}

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks and shortcuts for efficient operations management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start">
              <Package className="h-4 w-4 mr-2" />
              Track Package
            </Button>
            <Button variant="outline" className="justify-start">
              <MapPin className="h-4 w-4 mr-2" />
              View Stores
            </Button>
            <Button variant="outline" className="justify-start">
              <Truck className="h-4 w-4 mr-2" />
              Schedule Pickup
            </Button>
            <Button variant="outline" className="justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              View Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}