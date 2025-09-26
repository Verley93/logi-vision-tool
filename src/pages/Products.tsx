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
  Users,
  Tags,
  Shield,
  CheckCircle
} from 'lucide-react';

const shipClassConfig = {
  OP: { label: 'Over Packaging', color: 'bg-success-light text-success' },
  OW: { label: 'Over Weight', color: 'bg-warning-light text-warning' },
  SP: { label: 'Special Packaging', color: 'bg-info-light text-info' },
  SW: { label: 'Special Weight', color: 'bg-destructive-light text-destructive' },
  TH: { label: 'Threshold', color: 'bg-muted text-muted-foreground' }
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
            Manage {overview?.totalSKUs ? formatNumber(overview.totalSKUs) : '14M+'} SKUs across {overview?.totalStyles ? formatNumber(overview.totalStyles) : '2.8M+'} styles
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
                  <p className="text-sm text-muted-foreground">Total SKUs</p>
                  <p className="text-2xl font-bold">{formatNumber(overview.totalSKUs)}</p>
                  <p className="text-xs text-muted-foreground">Individual products</p>
                </div>
                <Box className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Styles</p>
                  <p className="text-2xl font-bold text-info">{formatNumber(overview.totalStyles)}</p>
                  <p className="text-xs text-muted-foreground">Style groups</p>
                </div>
                <Tags className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ECodes</p>
                  <p className="text-2xl font-bold text-success">{formatNumber(overview.totalECodes)}</p>
                  <p className="text-xs text-muted-foreground">Electronic codes</p>
                </div>
                <Package className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Vendors</p>
                  <p className="text-2xl font-bold text-warning">{overview.vendors.length}</p>
                  <p className="text-xs text-muted-foreground">Supplier partners</p>
                </div>
                <Users className="h-8 w-8 text-warning" />
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ship Classes Breakdown */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Ship Classes
            </CardTitle>
            <CardDescription>
              Distribution of products by shipping classification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))
            ) : overview ? (
              overview.shipClasses.map((shipClass) => (
                <div key={shipClass.class} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={shipClassConfig[shipClass.class].color}>
                        {shipClass.class}
                      </Badge>
                      <span className="font-medium">{shipClassConfig[shipClass.class].label}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {formatNumber(shipClass.count)} ({shipClass.percentage}%)
                    </span>
                  </div>
                  <Progress value={shipClass.percentage} className="h-2" />
                </div>
              ))
            ) : null}
          </CardContent>
        </Card>

        {/* Vendors */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Vendors
            </CardTitle>
            <CardDescription>
              Leading suppliers by SKU count
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2 pb-4 border-b last:border-0">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-3 w-20" />
                </div>
              ))
            ) : overview ? (
              overview.vendors.map((vendor) => (
                <div key={vendor.id} className="space-y-2 pb-4 border-b last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{vendor.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">ID: {vendor.id}</p>
                        {vendor.directVendor && (
                          <Badge variant="outline" className="text-xs">Direct</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatNumber(vendor.skuCount)}</p>
                      <p className="text-xs text-muted-foreground">SKUs</p>
                    </div>
                  </div>
                </div>
              ))
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Restrictions and Eligibility */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Restrictions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Shipping Restrictions
            </CardTitle>
            <CardDescription>
              Active restriction codes and affected styles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2 pb-4 border-b last:border-0">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                </div>
              ))
            ) : overview ? (
              overview.restrictions.map((restriction) => (
                <div key={restriction.code} className="space-y-2 pb-4 border-b last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{restriction.code}</Badge>
                        <span className="font-medium text-sm">{restriction.category}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {restriction.states.map((state) => (
                          <Badge key={state} variant="secondary" className="text-xs">
                            {state}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-sm font-medium">{formatNumber(restriction.affectedStyles)}</p>
                      <p className="text-xs text-muted-foreground">styles</p>
                    </div>
                  </div>
                </div>
              ))
            ) : null}
          </CardContent>
        </Card>

        {/* Eligibility Metrics */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Eligibility Metrics
            </CardTitle>
            <CardDescription>
              Product eligibility for various services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : overview ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm">GTGT Eligible</span>
                  <span className="font-medium">{formatNumber(overview.eligibilityMetrics.gtgt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Expedite</span>
                  <span className="font-medium">{formatNumber(overview.eligibilityMetrics.expedite)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">P.O. Box</span>
                  <span className="font-medium">{formatNumber(overview.eligibilityMetrics.po)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">APO/FPO</span>
                  <span className="font-medium">{formatNumber(overview.eligibilityMetrics.apoFpo)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Hazmat</span>
                  <span className="font-medium text-warning">{formatNumber(overview.eligibilityMetrics.hazmat)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Baggable</span>
                  <span className="font-medium">{formatNumber(overview.eligibilityMetrics.baggable)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">SFS Eligible</span>
                  <span className="font-medium">{formatNumber(overview.eligibilityMetrics.sfs)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">DoorDash</span>
                  <span className="font-medium">{formatNumber(overview.eligibilityMetrics.doordash)}</span>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Product Management Tools */}
      <Card className="shadow-card border-info-light bg-info-light/20">
        <CardContent className="p-6 text-center">
          <Box className="h-12 w-12 text-info mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Advanced Product Management</h3>
          <p className="text-muted-foreground mb-4">
            Manage product attributes, weight/dimensions, ship classes, restrictions, and vendor relationships.
            Override shipping eligibility and configure detailed product specifications.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline">SKU Management</Badge>
            <Badge variant="outline">Style Groups</Badge>
            <Badge variant="outline">Attribute Override</Badge>
            <Badge variant="outline">Weight & Dimensions</Badge>
            <Badge variant="outline">Ship Class Config</Badge>
            <Badge variant="outline">Restriction Codes</Badge>
            <Badge variant="outline">Vendor Relations</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}