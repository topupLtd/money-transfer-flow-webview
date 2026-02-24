import { useState, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Search, UserPlus2, ChevronRight, User2, Clock, AlertTriangle, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { useRecipients, useUpdateTransactionWithRecipient } from "@/hooks/useRecipients";
import type { Recipient as ApiRecipient } from "@/api/types/recipient";

/** UI-friendly shape derived from the API recipient */
interface RecipientDisplay {
  id: number;
  name: string;
  account: string;
  bank: string;
  initials: string;
  color: string;
  country: string;
  countryId: number;
  currencyId: number | undefined;
  pickupMethodId: number | null | undefined;
  method: string;
  methodLabel: string;
  hasPendingTransaction?: boolean;
  pendingAmount?: string;
  pendingCurrency?: string;
  pendingDate?: string;
}

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

/** Maps an API Recipient to the display shape */
function toRecipientDisplay(r: ApiRecipient): RecipientDisplay {
  const name = `${r.first_name} ${r.last_name}`.trim();
  const initials = `${(r.first_name?.[0] ?? "").toUpperCase()}${(r.last_name?.[0] ?? "").toUpperCase()}`;
  const color = AVATAR_COLORS[r.id % AVATAR_COLORS.length];

  // Determine method from pickup_method_id (1 = bank, 3/8 = wallet-like)
  const isWallet = r.pickup_method_id != null && r.pickup_method_id !== 1;
  const method = isWallet ? "wallet" : "bank";
  const methodLabel = r.institution_name
    ? r.institution_name
    : isWallet
      ? "Mobile Wallet"
      : "Bank Deposit";

  return {
    id: r.id,
    name,
    account: r.account_no ?? "",
    bank: r.institution_name ?? "",
    initials,
    color,
    country: r.address?.country?.code ?? "",
    countryId: r.address?.country?.id ?? 0,
    currencyId: r.currency_id,
    pickupMethodId: r.pickup_method_id,
    method,
    methodLabel,
  };
}

/** Loading skeleton for the recipient list */
function RecipientListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-50">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Error state component */
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="p-6 border-red-100 bg-red-50/50">
      <div className="flex flex-col items-center gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-sm text-red-600 font-medium">{message}</p>
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-3 w-3" />
          Try Again
        </Button>
      </div>
    </Card>
  );
}

export default function SelectRecipient() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const [pendingWarningOpen, setPendingWarningOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientDisplay | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { toast } = useToast();

  // ── URL query params (passed from send-money.tsx handleContinue) ──
  const countryFilter = searchParams.get("country");
  const methodFilter = searchParams.get("method");
  const deliveryIdParam = searchParams.get("deliveryId");
  const transferTimeIdParam = searchParams.get("transferTimeId");
  const transactionIdParam = searchParams.get("transactionId");
  const amountParam = searchParams.get("amount");
  const receiveAmountParam = searchParams.get("receiveAmount");

  // ── Fetch recipients from GET /v1/recipients ──
  // Mirrors SelectRecipient.js: componentDidMount → onFetchRecipients
  const {
    data: apiRecipients,
    isLoading,
    isError,
    error,
    refetch,
  } = useRecipients();

  // ── PATCH /v1/transaction mutation ──
  // Mirrors SelectRecipient.js: updateTransactionWithRecipient
  const updateTransactionMutation = useUpdateTransactionWithRecipient();

  // ── Map API recipients to display objects ──
  const recipients: RecipientDisplay[] = useMemo(() => {
    if (!apiRecipients || apiRecipients.length === 0) return [];
    return apiRecipients.map(toRecipientDisplay);
  }, [apiRecipients]);

  // ── Filter recipients by country, delivery method, and search query ──
  // Mirrors SelectRecipient.js: recipientList filter by pickup_method_id, currency_id, country
  const filteredRecipients = useMemo(() => {
    let list = recipients;

    // Filter by delivery method ID (pickup_method_id) if present
    if (deliveryIdParam) {
      const deliveryId = Number(deliveryIdParam);
      list = list.filter((r) => r.pickupMethodId === deliveryId);
    }

    // Filter by country code
    if (countryFilter) {
      list = list.filter((r) => r.country === countryFilter);
    }

    // Filter by method type (bank/wallet) if no deliveryId
    if (methodFilter && !deliveryIdParam) {
      list = list.filter((r) => r.method === methodFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.account.toLowerCase().includes(q) ||
          r.bank.toLowerCase().includes(q),
      );
    }

    return list;
  }, [recipients, countryFilter, methodFilter, deliveryIdParam, searchQuery]);

  const isFiltered = !!(countryFilter && (methodFilter || deliveryIdParam));

  /**
   * Handles recipient selection:
   * 1. Calls PATCH /v1/transaction with { transaction_id, recipient_id }
   * 2. On success → navigates to the reason/source page
   *
   * Mirrors SelectRecipient.js → handleUpdateTransaction
   */
  const handleSelectRecipient = useCallback(
    async (recipient: RecipientDisplay) => {
      if (!transactionIdParam) {
        // No transaction in progress — navigate without patching
        navigateToNext(recipient);
        return;
      }

      setIsUpdating(true);
      try {
        const result = await updateTransactionMutation.mutateAsync({
          transaction_id: transactionIdParam,
          recipient_id: recipient.id,
        });

        if (result.success) {
          navigateToNext(recipient);
        } else {
          toast({
            variant: "destructive",
            title: "Failed to select recipient",
            description: result.message ?? "Something went wrong. Please try again.",
          });
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred";
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });
      } finally {
        setIsUpdating(false);
      }
    },
    [transactionIdParam, updateTransactionMutation, toast],
  );

  /** Navigate to the next page after recipient selection */
  const navigateToNext = useCallback(
    (recipient: RecipientDisplay) => {
      const country = countryFilter || recipient.country;
      const params = new URLSearchParams({
        country,
        amount: amountParam ?? "",
        receiveAmount: receiveAmountParam ?? "",
        method: recipient.method,
        recipientId: String(recipient.id),
        recipientName: recipient.name,
        recipientBank: recipient.bank,
        recipientAccount: recipient.account,
        deliveryMethod: recipient.method,
        ...(deliveryIdParam ? { deliveryId: deliveryIdParam } : {}),
        ...(transferTimeIdParam ? { transferTimeId: transferTimeIdParam } : {}),
        ...(transactionIdParam ? { transactionId: transactionIdParam } : {}),
      });
      setLocation(`/source?${params.toString()}`);
    },
    [countryFilter, amountParam, receiveAmountParam, deliveryIdParam, transferTimeIdParam, transactionIdParam, setLocation],
  );

  const handleRecipientClick = useCallback(
    (recipient: RecipientDisplay) => {
      if (recipient.hasPendingTransaction) {
        setSelectedRecipient(recipient);
        setPendingWarningOpen(true);
      } else {
        handleSelectRecipient(recipient);
      }
    },
    [handleSelectRecipient],
  );

  const navigateToSource = useCallback(
    (recipient: RecipientDisplay) => {
      handleSelectRecipient(recipient);
    },
    [handleSelectRecipient],
  );

  return (
    <MobileLayout title="Select Recipient" onBack={() => setLocation("/")}>
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search name, email, or account"
            className="pl-9 bg-white border-none shadow-sm h-12 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* New Recipient */}
        <button 
          onClick={() => setLocation(`/add-recipient?country=${countryFilter || ''}&method=${methodFilter || 'bank'}`)}
          className="w-full flex items-center gap-4 p-4 rounded-xl border border-dashed border-gray-300 hover:bg-gray-50 transition-colors text-left group"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <UserPlus2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Add New Recipient</h3>
            <p className="text-sm text-gray-500">Send to someone new</p>
          </div>
        </button>

        {/* Loading State */}
        {isLoading && <RecipientListSkeleton />}

        {/* Error State */}
        {isError && !isLoading && (
          <ErrorState
            message={error?.message ?? "Failed to load recipients. Please try again."}
            onRetry={() => refetch()}
          />
        )}

        {/* Updating overlay */}
        {isUpdating && (
          <div className="flex items-center justify-center gap-2 py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-gray-500 font-medium">Selecting recipient...</span>
          </div>
        )}

        {/* Recipient List */}
        {!isLoading && !isError && (
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {isFiltered ? (filteredRecipients.length > 0 ? "Available Recipients" : "No Recipients Found") : "Recent Recipients"}
            </h3>
            {isFiltered && (
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                {countryFilter} {methodFilter ? `• ${methodFilter === 'bank' ? 'Bank Deposit' : 'Mobile Wallet'}` : ""}
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            {filteredRecipients.length > 0 ? (
              filteredRecipients.map((recipient) => (
                <div 
                  key={recipient.id}
                  onClick={() => !isUpdating && handleRecipientClick(recipient)}
                  className={`flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-50 shadow-sm hover:border-primary/50 cursor-pointer transition-all active:scale-[0.98] group ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarFallback className={recipient.color}>{recipient.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{recipient.name}</h4>
                    <p className="text-xs text-gray-500">{recipient.bank} • {recipient.methodLabel}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{recipient.account}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
                </div>
              ))
            ) : (
              <div className="py-12 text-center space-y-3 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <User2 className="h-6 w-6 text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {searchQuery ? "No search results" : "No matching recipients"}
                  </p>
                  <p className="text-xs text-gray-500 px-6 mt-1">
                    {searchQuery
                      ? `No recipients match "${searchQuery}".`
                      : isFiltered
                        ? `No recipients found for ${countryFilter}${methodFilter ? ` via ${methodFilter === 'bank' ? 'Bank Deposit' : 'Mobile Wallet'}` : ""}.`
                        : "You haven't added any recipients yet."}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full text-xs font-bold border-gray-200"
                  onClick={() => setLocation(`/add-recipient?country=${countryFilter || ''}&method=${methodFilter || 'bank'}`)}
                >
                  <UserPlus2 className="h-3 w-3 mr-1" /> Add New
                </Button>
              </div>
            )}
          </div>
        </div>
        )}

      </div>

      {/* Pending Transaction Warning Drawer */}
      <Drawer open={pendingWarningOpen} onOpenChange={setPendingWarningOpen}>
        <DrawerContent className="max-w-md mx-auto">
          <DrawerHeader className="text-center pt-6 pb-2">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            <DrawerTitle className="text-xl font-bold text-gray-900">Pending Transaction</DrawerTitle>
            <DrawerDescription className="text-sm text-gray-500 mt-2">
              You have a transfer that is still being processed
            </DrawerDescription>
          </DrawerHeader>

          {selectedRecipient && (
            <div className="px-6 pb-6 space-y-5">
              {/* Pending Transaction Details */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarFallback className={selectedRecipient.color}>{selectedRecipient.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{selectedRecipient.name}</p>
                    <p className="text-xs text-gray-500">{selectedRecipient.bank} • {selectedRecipient.account}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-amber-200/50">
                  <div>
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pending Amount</p>
                    <p className="text-lg font-bold text-gray-900">{selectedRecipient.pendingCurrency} {selectedRecipient.pendingAmount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Initiated</p>
                    <p className="text-sm font-semibold text-gray-700">{selectedRecipient.pendingDate}</p>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  Sending another transfer now may result in a duplicate payment. We recommend waiting until the pending transaction is completed.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button 
                  variant="outline"
                  className="w-full h-12 rounded-xl font-bold border-gray-200 text-gray-700"
                  onClick={() => setPendingWarningOpen(false)}
                  data-testid="button-cancel-pending"
                >
                  Cancel
                </Button>
                <Button 
                  className="w-full h-12 rounded-xl font-bold shadow-md"
                  onClick={() => {
                    setPendingWarningOpen(false);
                    if (selectedRecipient) {
                      navigateToSource(selectedRecipient);
                    }
                  }}
                  data-testid="button-proceed-anyway"
                >
                  Proceed Anyway
                </Button>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </MobileLayout>
  );
}
