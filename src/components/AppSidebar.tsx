import { 
  BarChart3, 
  Package, 
  Store, 
  Box, 
  MapPin, 
  FileText,
  Search,
  Settings
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: BarChart3,
    description: "Key performance metrics"
  },
  { 
    title: "Package Tracking", 
    url: "/tracking", 
    icon: Search,
    description: "Track packages by number or order"
  },
  { 
    title: "Stores", 
    url: "/stores", 
    icon: Store,
    description: "Manage 800+ store locations"
  },
  { 
    title: "Products", 
    url: "/products", 
    icon: Box,
    description: "14M+ product catalog"
  },
  { 
    title: "Addresses", 
    url: "/addresses", 
    icon: MapPin,
    description: "Address validation & overrides"
  },
  { 
    title: "Audit Logs", 
    url: "/audit", 
    icon: FileText,
    description: "System change history"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavClasses = (path: string) => {
    const active = isActive(path);
    return active 
      ? "bg-primary-light text-primary border-r-2 border-primary font-medium" 
      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors";
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r bg-gradient-surface transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="p-0">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  eCommerce Hub
                </h2>
                <p className="text-xs text-muted-foreground">
                  Admin Dashboard
                </p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className={`px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider ${collapsed ? 'hidden' : ''}`}>
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="w-full justify-start h-11 px-3 rounded-lg"
                  >
                    <NavLink 
                      to={item.url} 
                      className={getNavClasses(item.url)}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className={`${collapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'} shrink-0`} />
                      {!collapsed && (
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-3 border-t">
          <SidebarMenuButton asChild className="w-full justify-start h-11 px-3 rounded-lg">
            <button className="text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors">
              <Settings className={`${collapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'} shrink-0`} />
              {!collapsed && <span className="font-medium text-sm">Settings</span>}
            </button>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}