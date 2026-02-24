import { useState, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Search, Plus, ChevronRight, AlertCircle, RefreshCw, User2, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useParentRecipients } from "@/hooks/useRecipients";
import type { Recipient } from "@/api/types/recipient";

// Colour palette for avatar fallbacks (deterministic by id)
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-yellow-100 text-yellow-700",
  "bg-red-100 text-red-700",
  "bg-indigo-100 text-indigo-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
];

function getInitials(r: Recipient): string {
  return `${(r.first_name?.[0] ?? "").toUpperCase()}${(r.last_name?.[0] ?? "").toUpperCase()}`;
}

function getColor(id: number): string {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function getSubtitle(r: Recipient): string {
  const country = r.address?.country?.name;
  const currency = (r as any)?.currency?.code;
  if (country && currency) return `${country} (${currency})`;
  if (country) return country;
  return "";
}

export default function Recipients() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<number>(0);

  // ── Fetch parent recipients from GET /v1/recipient/parents ──
  // Mirrors RecipientsHomeScreen.js: componentDidMount → fetchParentRecipients
  const {
    data: parentData,
    isLoading,
    isError,
    error,
    refetch,
  } = useParentRecipients();

  const recipients = parentData?.recipients ?? [];
  const deliveryMethods = parentData?.pickup_methods ?? [];

  // ── Filter recipients by delivery method + search query ──
  // Mirrors RecipientsHomeScreen.js: deliveryId filter + FlatList data
  const filteredRecipients = useMemo(() => {
    let list = recipients;

    if (selectedDeliveryId !== 0) {
      list = list.filter((r) => r.pickup_method_id === selectedDeliveryId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) ||
          (r.email ?? "").toLowerCase().includes(q) ||
          (r.account_no ?? "").toLowerCase().includes(q),
      );
    }

    return list;
  }, [recipients, selectedDeliveryId, searchQuery]);

  const selectedDeliveryName = useMemo(() => {
    if (selectedDeliveryId === 0) return "";
    const found = deliveryMethods.find((d) => d.id === selectedDeliveryId);
    return found?.option ?? found?.name ?? "";
  }, [selectedDeliveryId, deliveryMethods]);

  const handleFilter = useCallback(
    (id: number) => {
      setSelectedDeliveryId(id);
      setFilterDrawerOpen(false);
    },
    [],
  );

  return (
    <MobileLayout title="Recipients">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">

        {/* Search + Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search name, email, or account"
              className="pl-9 bg-white border-none shadow-sm h-12 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {deliveryMethods.length > 0 && (
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl border-gray-200 shadow-sm"
              onClick={() => setFilterDrawerOpen(true)}
            >
              <Filter className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>

        {/* Active filter badge */}
        {selectedDeliveryId !== 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
              {selectedDeliveryName}
              <button onClick={() => setSelectedDeliveryId(0)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          </div>
        )}

        {/* New Recipient */}
        <button
          onClick={() => setLocation("/new-recipient")}
          className="w-full flex items-center gap-4 p-4 rounded-xl border border-dashed border-gray-300 hover:bg-gray-50 transition-colors text-left group"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Add New Recipient</h3>
            <p className="text-sm text-gray-500">Send to someone new</p>
          </div>
        </button>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-50">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <Card className="p-6 border-red-100 bg-red-50/50">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <p className="text-sm text-red-600 font-medium">
                {error?.message ?? "Failed to load recipients."}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
                <RefreshCw className="h-3 w-3" />
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* Recipient List */}
        {!isLoading && !isError && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              My Recipients
            </h3>

            <div className="space-y-2">
              {filteredRecipients.length > 0 ? (
                filteredRecipients.map((recipient) => {
                  const name = `${recipient.first_name} ${recipient.last_name}`.trim();
                  const initials = getInitials(recipient);
                  const color = getColor(recipient.id);
                  const subtitle = getSubtitle(recipient);

                  return (
                    <div
                      key={recipient.id}
                      onClick={() => setLocation(`/recipients/${recipient.id}`)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-50 shadow-sm hover:border-primary/50 cursor-pointer transition-all active:scale-[0.98] group"
                    >
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarFallback className={color}>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{name}</h4>
                        {subtitle && (
                          <p className="text-xs text-gray-500">{subtitle}</p>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center space-y-3 bg-white rounded-2xl border border-dashed border-gray-200">
                  <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <User2 className="h-6 w-6 text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {searchQuery ? "No search results" : selectedDeliveryId !== 0 ? "No recipients found" : "No recipients yet"}
                    </p>
                    <p className="text-xs text-gray-500 px-6 mt-1">
                      {searchQuery
                        ? `No recipients match "${searchQuery}".`
                        : selectedDeliveryId !== 0
                          ? `No recipients for the selected delivery method.`
                          : "Add a recipient to get started."}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs font-bold border-gray-200"
                    onClick={() => setLocation("/new-recipient")}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add New
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delivery Method Filter Drawer */}
      <Drawer open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
        <DrawerContent className="max-w-md mx-auto">
          <DrawerHeader className="text-center pt-6 pb-2">
            <DrawerTitle className="text-lg font-bold text-gray-900">Filter by Delivery Method</DrawerTitle>
          </DrawerHeader>
          <div className="px-6 pb-6 space-y-2">
            {deliveryMethods.map((dm) => {
              const label = dm.option ?? dm.name ?? `Method ${dm.id}`;
              const isSelected = selectedDeliveryId === dm.id;
              return (
                <div
                  key={dm.id}
                  onClick={() => handleFilter(dm.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all active:scale-[0.98] ${
                    isSelected
                      ? "border-primary bg-primary/5 font-bold"
                      : "border-gray-100 bg-white hover:border-primary"
                  }`}
                >
                  <span className="font-semibold text-gray-900">{label}</span>
                </div>
              );
            })}
            {selectedDeliveryId !== 0 && (
              <Button
                variant="outline"
                className="w-full mt-2 rounded-xl"
                onClick={() => handleFilter(0)}
              >
                Clear Filter
              </Button>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </MobileLayout>
  );
}
