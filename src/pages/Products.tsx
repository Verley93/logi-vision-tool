import { useProductsOverview } from '@/hooks/api/useProductsOverview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Box, 
  Filter, 
  Download, 
  Plus,
  Package,
  Truck,
  AlertTriangle,
  Clock,
  TrendingUp
} from 'lucide-react';

const statusConfig = {
  active: { label: 'Active', color: 'bg-success-light text-success' },
  inactive: { label: 'Inactive', color: 'bg-muted text-muted-foreground' },
  pending: { label: 'Pending', color: 'bg-warning-light text-warning' }
};

export default function Products() {
  const { data: overview, isLoading, error } = useProductsOverview();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">Failed to load products data</h3>
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
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">
            Manage {overview?.totalProducts ? formatNumber(overview.totalProducts) : '14M+'} products across your catalog
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-card">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : overview ? (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{formatNumber(overview.totalProducts)}</p>
                  <p className="text-xs text-muted-foreground">Across all categories</p>
                </div>
                <Box className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">PO Eligible</p>
                  <p className="text-2xl font-bold text-success">{formatNumber(overview.shippingMetrics.eligibleForPO)}</p>
                  <p className="text-xs text-muted-foreground">P.O. Box shipping</p>
                </div>
                <Package className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">APO/FPO Eligible</p>
                  <p className="text-2xl font-bold text-info">{formatNumber(overview.shippingMetrics.eligibleForAPO)}</p>
                  <p className="text-xs text-muted-foreground">Military addresses</p>
                </div>
                <Truck className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Restricted Items</p>
                  <p className="text-2xl font-bold text-warning">{formatNumber(overview.shippingMetrics.restrictedItems)}</p>
                  <p className="text-xs text-muted-foreground">Shipping restrictions</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name, SKU, or description..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Categories Breakdown */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Product Categories
              </CardTitle>
              <CardDescription>
                Distribution of products across different categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))
              ) : overview ? (
                overview.categories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-muted-foreground">
                        {formatNumber(category.count)} ({category.percentage}%)
                      </span>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Recently Updated Products */}
        <div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Updates
              </CardTitle>
              <CardDescription>
                Products modified in the last week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2 pb-4 border-b last:border-0">
                    <Skeleton className="h-4 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))
              ) : overview ? (
                overview.recentlyUpdated.slice(0, 5).map((product) => (
                  <div key={product.id} className="space-y-2 pb-4 border-b last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${statusConfig[product.status].color}`}>
                        {statusConfig[product.status].label}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Updated {formatDateTime(product.lastUpdated)}
                    </p>
                  </div>
                ))
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <Card className="shadow-card border-info-light bg-info-light/20">
        <CardContent className="p-6 text-center">
          <Box className="h-12 w-12 text-info mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Product Management Tools</h3>
          <p className="text-muted-foreground mb-4">
            Advanced product management features including bulk editing, attribute overrides, 
            and detailed shipping configuration are currently in development.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline">Bulk Edit</Badge>
            <Badge variant="outline">Attribute Override</Badge>
            <Badge variant="outline">Shipping Config</Badge>
            <Badge variant="outline">Weight & Dimensions</Badge>
            <Badge variant="outline">Ship Classes</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}