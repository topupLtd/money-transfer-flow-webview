import { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowRightLeft, ChevronDown, Landmark, Smartphone, Ticket, Percent, AlertCircle, RefreshCw, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { BottomSheetSelect } from "@/components/ui/bottom-sheet-select";
import { useCurrencyCountries } from "@/hooks/useCurrencyCountries";
import { useAvailableDeliveries } from "@/hooks/useAvailableDeliveries";
import { config } from "@/config";
import type { CurrencyCountry } from "@/api/types/currency";
import type { DeliveryMethod } from "@/api/types/delivery";

/** Shape used internally by the Send Money UI */
interface CountryOption {
  /** The currency-country pair ID from the API (used for delivery method lookups) */
  currencyCountryId: number;
  code: string;
  name: string;
  currency: string;
  symbol: string;
  flag: string;
  rate: number;
  deliveryMethods: string[];
}

/** Maps an API CurrencyCountry to the internal CountryOption shape */
function toCountryOption(c: CurrencyCountry): CountryOption {
  // Map pickup_methods ref_ids to delivery method keys
  const deliveryMethods: string[] = [];
  for (const pm of c.pickup_methods) {
    if (pm.ref_id === "ACCOUNT" && !deliveryMethods.includes("bank")) {
      deliveryMethods.push("bank");
    } else if (pm.ref_id === "WALLET" && !deliveryMethods.includes("wallet")) {
      deliveryMethods.push("wallet");
    }
  }

  return {
    currencyCountryId: c.id,
    code: c.country.code,
    name: c.country.name,
    currency: c.currency.code,
    symbol: c.currency.icon ?? c.currency.code,
    flag: c.flag
      ? `${config.storageBaseUrl}/${c.flag}`
      : `https://flagcdn.com/w40/${c.country.code.toLowerCase()}.png`,
    rate: 1, // Exchange rate comes from a separate API call
    deliveryMethods: deliveryMethods.length > 0 ? deliveryMethods : ["bank"],
  };
}

/** Fallback countries used when the API is unavailable */
const FALLBACK_COUNTRIES: CountryOption[] = [
  { currencyCountryId: 0, code: "AO", name: "Angola", currency: "AOA", symbol: "Kz", flag: "https://flagcdn.com/w40/ao.png", rate: 900, deliveryMethods: ["bank", "wallet"] },
  { currencyCountryId: 0, code: "NG", name: "Nigeria", currency: "NGN", symbol: "\u20a6", flag: "https://flagcdn.com/w40/ng.png", rate: 1450, deliveryMethods: ["bank", "wallet"] },
  { currencyCountryId: 0, code: "GH", name: "Ghana", currency: "GHS", symbol: "\u20b5", flag: "https://flagcdn.com/w40/gh.png", rate: 12.5, deliveryMethods: ["bank", "wallet"] },
  { currencyCountryId: 0, code: "SN", name: "Senegal", currency: "XOF", symbol: "CFA", flag: "https://flagcdn.com/w40/sn.png", rate: 655.95, deliveryMethods: ["bank", "wallet"] },
  { currencyCountryId: 0, code: "MA", name: "Morocco", currency: "MAD", symbol: "DH", flag: "https://flagcdn.com/w40/ma.png", rate: 10.8, deliveryMethods: ["bank"] },
];

const PROMOS = [
  { id: "FIRSTFREE", label: "First Transfer Free", discount: "100% Fee Off" },
  { id: "WELCOME5", label: "Welcome Bonus", discount: "$5.00 Off" },
  { id: "SAVE10", label: "Summer Special", discount: "10% Off Fee" },
];

/** Loading skeleton for the exchange card */
function ExchangeCardSkeleton() {
  return (
    <Card className="p-0 overflow-hidden border-none shadow-lg bg-white">
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
        <div className="relative h-px bg-gray-100 my-4" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
        <Skeleton className="h-3 w-40 mx-auto" />
      </div>
    </Card>
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

export default function SendMoney() {
  const [, setLocation] = useLocation();
  const [sendAmount, setSendAmount] = useState("1000");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(config.SELECTED_TO_COUNTRY_CODE);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<number | null>(null);
  const [selectedTransferTimeId, setSelectedTransferTimeId] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState("");

  // Fetch currency-country data from API
  const { data: apiCountries, isLoading, isError, error, refetch } = useCurrencyCountries();

  // Memoize the mapped country options — only "to" and "both" types (destination countries)
  const countries: CountryOption[] = useMemo(() => {
    if (!apiCountries || apiCountries.length === 0) return FALLBACK_COUNTRIES;
    return apiCountries
      .filter((c) => c.type === "to" || c.type === "both")
      .map(toCountryOption);
  }, [apiCountries]);

  // Derive the sender (from) country from the list — matched by config.FROM_COUNTRY_CODE
  const fromCountry: CountryOption | undefined = useMemo(() => {
    if (!apiCountries || apiCountries.length === 0) return undefined;
    const fromCurrencies = apiCountries
      .filter((c) => c.type === "from" || c.type === "both")
      .map(toCountryOption);
    return (
      fromCurrencies.find((c) => c.code === config.FROM_COUNTRY_CODE) ?? fromCurrencies[0]
    );
  }, [apiCountries]);

  // Derive the selected country from the list
  const selectedCountry = useMemo(() => {
    if (selectedCountryCode) {
      return countries.find((c) => c.code === selectedCountryCode) ?? countries[0];
    }
    return countries[0];
  }, [selectedCountryCode, countries]);

  // ── Available delivery methods (pickup methods + transfer times) from API ──
  // Mirrors RateCheckScreen.js: fetchDeliveriesAndSetDefault
  const {
    data: deliveryMethods,
    isLoading: isLoadingDeliveries,
    isError: isDeliveryError,
    error: deliveryError,
    refetch: refetchDeliveries,
  } = useAvailableDeliveries(selectedCountry?.currencyCountryId);

  // Order deliveries by priority (asc) just like RateCheckScreen.js
  const sortedDeliveries: DeliveryMethod[] = useMemo(() => {
    if (!deliveryMethods || deliveryMethods.length === 0) return [];
    return [...deliveryMethods].sort((a, b) => a.priority - b.priority);
  }, [deliveryMethods]);

  // Selected delivery objects derived from IDs
  const selectedDeliveryItem = useMemo(
    () => sortedDeliveries.find((d) => d.id === selectedDeliveryId) ?? sortedDeliveries[0] ?? null,
    [sortedDeliveries, selectedDeliveryId],
  );

  const selectedTransferTimeItem = useMemo(() => {
    if (!selectedDeliveryItem) return null;
    return (
      selectedDeliveryItem.transfer_time.find((t) => t.id === selectedTransferTimeId) ??
      selectedDeliveryItem.transfer_time[0] ??
      null
    );
  }, [selectedDeliveryItem, selectedTransferTimeId]);

  // Auto-select first delivery method when deliveries load or change
  // Mirrors RateCheckScreen.js: setState after fetchDeliveries
  useEffect(() => {
    if (sortedDeliveries.length > 0) {
      const first = sortedDeliveries[0];
      setSelectedDeliveryId(first.id);
      setSelectedTransferTimeId(first.transfer_time[0]?.id ?? null);
      setDeliveryMethod(String(first.id));
    } else {
      setSelectedDeliveryId(null);
      setSelectedTransferTimeId(null);
      setDeliveryMethod("");
    }
  }, [sortedDeliveries]);

  const calculatedReceiveAmount = (parseFloat(sendAmount || "0") * selectedCountry.rate).toFixed(2);
  const displayReceiveAmount = receiveAmount || calculatedReceiveAmount;

  const handleSendAmountChange = useCallback((value: string) => {
    setSendAmount(value);
    setReceiveAmount("");
  }, []);

  const handleReceiveAmountChange = useCallback((value: string) => {
    setReceiveAmount(value);
    const numValue = parseFloat(value || "0");
    const calculatedSend = (numValue / selectedCountry.rate).toFixed(2);
    setSendAmount(calculatedSend);
  }, [selectedCountry.rate]);

  // Mirrors RateCheckScreen.js: setDeliveryMethod
  const handleDeliveryMethodChange = useCallback(
    (value: string) => {
      const id = Number(value);
      const item = sortedDeliveries.find((d) => d.id === id);
      if (item) {
        setSelectedDeliveryId(item.id);
        setSelectedTransferTimeId(item.transfer_time[0]?.id ?? null);
        setDeliveryMethod(value);
      }
    },
    [sortedDeliveries],
  );

  const handleContinue = useCallback(() => {
    setLocation(
      `/select-recipient?country=${selectedCountry.code}&method=${deliveryMethod}&amount=${sendAmount}&deliveryId=${selectedDeliveryId ?? ""}&transferTimeId=${selectedTransferTimeId ?? ""}`,
    );
  }, [setLocation, selectedCountry.code, deliveryMethod, sendAmount, selectedDeliveryId, selectedTransferTimeId]);

  // Memoize country options for the BottomSheetSelect
  const countrySelectOptions = useMemo(
    () =>
      countries.map((c) => ({
        value: c.code,
        label: c.name,
        sublabel: `(${c.currency})`,
        icon: <img src={c.flag} className="w-5 h-5 rounded-full object-cover" alt={c.name} />,
      })),
    [countries],
  );

  return (
    <MobileLayout title="Send Money">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Loading State */}
        {isLoading && <ExchangeCardSkeleton />}

        {/* Error State */}
        {isError && !isLoading && (
          <ErrorState
            message={error?.message ?? "Failed to load countries. Please try again."}
            onRetry={() => refetch()}
          />
        )}

        {/* Exchange Card */}
        {!isLoading && (
        <Card className="p-0 overflow-hidden border-none shadow-lg bg-white">
          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">You Send</Label>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">{fromCountry?.symbol ?? "€"}</span>
                  <Input 
                    type="number" 
                    value={sendAmount}
                    onChange={(e) => handleSendAmountChange(e.target.value)}
                    className="border-none shadow-none text-3xl font-bold p-0 pl-6 h-auto focus-visible:ring-0 text-secondary" 
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                  <img src={fromCountry?.flag ?? "https://flagcdn.com/w40/eu.png"} className="w-5 h-5 rounded-full object-cover" alt={fromCountry?.currency ?? "EUR"} />
                  <span className="font-bold text-sm text-secondary">{fromCountry?.currency ?? "EUR"}</span>
                </div>
              </div>
            </div>

            <div className="relative h-px bg-gray-100 my-4">
               <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full border border-gray-100 shadow-sm text-primary">
                 <ArrowRightLeft className="h-4 w-4" />
               </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">They Receive</Label>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative overflow-hidden flex items-center">
                  <span className="text-lg font-bold text-gray-400 mr-2 flex-shrink-0">{selectedCountry.symbol}</span>
                  <Input 
                    type="number"
                    value={displayReceiveAmount}
                    onChange={(e) => handleReceiveAmountChange(e.target.value)}
                    className="border-none shadow-none text-2xl font-bold p-0 h-auto focus-visible:ring-0 text-secondary truncate bg-transparent flex-1" 
                    placeholder="0.00"
                  />
                </div>
                <BottomSheetSelect
                  value={selectedCountry.code}
                  onValueChange={(code) => {
                    setSelectedCountryCode(code);
                    // Reset delivery selections — the useEffect on sortedDeliveries
                    // will auto-select the first method once new data loads
                    setSelectedDeliveryId(null);
                    setSelectedTransferTimeId(null);
                    setDeliveryMethod("");
                  }}
                  title="Select Country"
                  showSearch
                  searchPlaceholder="Search countries..."
                  options={countrySelectOptions}
                  triggerClassName="w-auto h-auto rounded-full px-3 py-2 bg-gray-50 border border-gray-100"
                  renderTriggerContent={() => (
                    <div className="flex items-center gap-2">
                      <img src={selectedCountry.flag} className="w-5 h-5 rounded-full object-cover" alt={selectedCountry.name} />
                      <span className="font-bold text-sm text-secondary">{selectedCountry.currency}</span>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3 text-[10px] text-gray-400 flex justify-between items-center border-t border-gray-100">
            <span className="font-bold uppercase tracking-wider">Exchange Rate</span>
            <span className="font-bold text-secondary">1 {fromCountry?.currency ?? "EUR"} = {selectedCountry.rate} {selectedCountry.currency}</span>
          </div>
        </Card>
        )}

        {/* Delivery Method — driven by /available-pickup-method-transfer-time API */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-900">Delivery Method</Label>

          {/* Loading state */}
          {isLoadingDeliveries && (
            <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-gray-400">Loading delivery methods...</span>
            </div>
          )}

          {/* Error state */}
          {isDeliveryError && !isLoadingDeliveries && (
            <ErrorState
              message={deliveryError?.message ?? "Failed to load delivery methods."}
              onRetry={() => refetchDeliveries()}
            />
          )}

          {/* Delivery method select */}
          {!isLoadingDeliveries && !isDeliveryError && sortedDeliveries.length > 0 && (
            <Select value={deliveryMethod} onValueChange={handleDeliveryMethodChange}>
              <SelectTrigger className="w-full h-auto min-h-[4rem] bg-white rounded-xl border-gray-200 focus:ring-1 focus:ring-primary shadow-sm py-3 px-3">
                <SelectValue placeholder="Select delivery method" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-2xl p-1">
                {sortedDeliveries.map((method) => (
                  <SelectItem
                    key={method.id}
                    value={String(method.id)}
                    className="py-3 px-3 cursor-pointer rounded-lg hover:bg-gray-50 focus:bg-gray-50 my-1"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                        {method.name.toLowerCase().includes("wallet") ? (
                          <Smartphone className="h-4 w-4" />
                        ) : (
                          <Landmark className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-sm text-gray-900">{method.name}</span>
                        <span className="text-[10px] text-gray-400">
                          {method.transfer_time[0]?.name ?? method.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

        </div>

        {/* Promo Code Drawer */}
        <div className="space-y-3">
           <Label className="text-base font-semibold text-gray-900">Promo Code</Label>
           <Drawer>
             <DrawerTrigger asChild>
               <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                 <div className="flex items-center gap-3">
                   <Ticket className="h-5 w-5 text-primary" />
                   <span className={promoCode ? "font-semibold text-primary" : "text-gray-400"}>
                     {promoCode ? `Applied: ${promoCode}` : "Apply Promo Code"}
                   </span>
                 </div>
                 <ChevronDown className="h-4 w-4 text-gray-400" />
               </button>
             </DrawerTrigger>
             <DrawerContent className="max-w-md mx-auto">
               <DrawerHeader>
                 <DrawerTitle>Promotions</DrawerTitle>
                 <DrawerDescription>Enter a code or select from the list below</DrawerDescription>
               </DrawerHeader>
               <div className="px-4 py-4 space-y-6">
                 <div className="flex gap-2">
                   <Input 
                     placeholder="Enter code" 
                     className="bg-gray-50 border-none h-12 rounded-xl"
                     value={promoCode}
                     onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                   />
                   <DrawerClose asChild>
                     <Button className="h-12 px-6 rounded-xl">Apply</Button>
                   </DrawerClose>
                 </div>
                 
                 <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Available Offers</p>
                    {PROMOS.map((promo) => (
                      <button 
                        key={promo.id}
                        onClick={() => setPromoCode(promo.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                          promoCode === promo.id ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
                        }`}
                      >
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          promoCode === promo.id ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                        }`}>
                          <Percent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{promo.label}</p>
                          <p className="text-xs text-gray-500">{promo.discount}</p>
                        </div>
                        {promoCode === promo.id && (
                          <div className="h-5 w-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-bold">\u2713</div>
                        )}
                      </button>
                    ))}
                 </div>
               </div>
               <DrawerFooter>
                 <DrawerClose asChild>
                   <Button variant="ghost">Close</Button>
                 </DrawerClose>
               </DrawerFooter>
             </DrawerContent>
           </Drawer>
        </div>

        <Button 
          className="w-full h-12 text-base font-semibold rounded-xl shadow-md mt-4 bg-primary hover:bg-primary/90" 
          size="lg"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </MobileLayout>
  );
}
