import { ReactNode, useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GlobalSearchDialog } from "@/components/GlobalSearchDialog";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Global keyboard shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-surface">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="p-2 hover:bg-surface-hover rounded-lg transition-colors" />
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-foreground">
                  Dashboard Overview
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitor your eCommerce operations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchOpen(true)}
                className="sm:hidden"
              >
                <Search className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
              
              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium">Admin User</div>
                  <div className="text-xs text-muted-foreground">admin@company.com</div>
                </div>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    AU
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      
      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </SidebarProvider>
  );
}