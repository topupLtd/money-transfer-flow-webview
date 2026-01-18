import { useState, useMemo } from "react";
import { X, Search, ChevronDown, Check } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BottomSheetSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  sublabel?: string;
}

interface BottomSheetSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  options: BottomSheetSelectOption[];
  placeholder?: string;
  title: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  className?: string;
  triggerClassName?: string;
  renderTriggerContent?: (selectedOption: BottomSheetSelectOption | undefined) => React.ReactNode;
}

export function BottomSheetSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  title,
  showSearch = false,
  searchPlaceholder = "Search...",
  className,
  triggerClassName,
  renderTriggerContent,
}: BottomSheetSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const lowerSearch = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowerSearch) ||
        opt.sublabel?.toLowerCase().includes(lowerSearch)
    );
  }, [options, search]);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setOpen(false);
    setSearch("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "w-full h-12 bg-gray-100 rounded-xl px-4 flex items-center justify-between gap-3 text-left",
          triggerClassName
        )}
        data-testid="button-bottom-sheet-trigger"
      >
        <div className="flex-1">
          {renderTriggerContent ? (
            renderTriggerContent(selectedOption)
          ) : (
            <span className={cn("text-sm font-semibold", !selectedOption && "text-gray-400")}>
              {selectedOption?.label || placeholder}
            </span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className={cn("max-h-[85vh]", className)}>
          <DrawerHeader className="flex flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
            <DrawerTitle className="text-lg font-bold">{title}</DrawerTitle>
            <DrawerClose asChild>
              <button
                className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
                data-testid="button-bottom-sheet-close"
              >
                <X className="h-4 w-4" />
              </button>
            </DrawerClose>
          </DrawerHeader>

          {showSearch && (
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="pl-10 h-11 bg-gray-100 border-none rounded-xl font-medium focus-visible:ring-1 focus-visible:ring-primary/20"
                  data-testid="input-bottom-sheet-search"
                />
              </div>
            </div>
          )}

          <div className="overflow-y-auto flex-1 pb-8">
            {filteredOptions.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors",
                    value === option.value && "bg-primary/5"
                  )}
                  data-testid={`option-${option.value}`}
                >
                  {option.icon && (
                    <div className="flex-shrink-0">{option.icon}</div>
                  )}
                  <div className="flex-1 text-left">
                    <span className="text-sm font-semibold text-gray-900">
                      {option.label}
                    </span>
                    {option.sublabel && (
                      <span className="text-xs text-gray-500 ml-1">
                        {option.sublabel}
                      </span>
                    )}
                  </div>
                  {value === option.value && (
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
