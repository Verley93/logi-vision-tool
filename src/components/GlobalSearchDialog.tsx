import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package, Store, ShoppingCart, FileText } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useGlobalSearch, SearchResult } from "@/hooks/api/useGlobalSearch";

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getTypeIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'store':
      return Store;
    case 'product':
      return ShoppingCart;
    case 'package':
      return Package;
    default:
      return FileText;
  }
};

const getTypeLabel = (type: SearchResult['type']) => {
  switch (type) {
    case 'store':
      return 'Stores';
    case 'product':
      return 'Products';
    case 'package':
      return 'Packages';
    default:
      return 'Other';
  }
};

export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { data: results = [], isLoading } = useGlobalSearch(query, open);

  const handleSelect = (result: SearchResult) => {
    onOpenChange(false);
    navigate(result.url);
    setQuery('');
  };

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    const type = result.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search stores, products, packages..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {query.length < 2 
            ? "Type at least 2 characters to search..."
            : "No results found."
          }
        </CommandEmpty>
        
        {Object.entries(groupedResults).map(([type, typeResults]) => {
          const Icon = getTypeIcon(type as SearchResult['type']);
          const label = getTypeLabel(type as SearchResult['type']);
          
          return (
            <CommandGroup key={type} heading={label}>
              {typeResults.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result)}
                  className="flex items-center gap-3 p-3"
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">
                      {result.title}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {result.subtitle}
                    </div>
                    {result.description && (
                      <div className="text-xs text-muted-foreground/70 truncate">
                        {result.description}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}