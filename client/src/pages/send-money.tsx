import { useState, useRef, useMemo, useCallback, useEffect } from "react";
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
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useTransactionQuote, useCreateTransaction } from "@/hooks/useTransactionQuote";
import { useToast } from "@/hooks/use-toast";
import { config } from "@/config";
import {
  MINIMUM_SENDING_AMOUNT,
  EXCHANGE_RATE_SENDER_ERROR_CODE,
  EXCHANGE_RATE_RECEIVER_ERROR_CODE,
} from "@/api/types/transaction";
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

  // ── Validation & error state (mirrors RateCheckScreen.js state) ──
  const [warning, setWarning] = useState(false);
  const [senderErrorMessage, setSenderErrorMessage] = useState("");
  const [receiverErrorMessage, setReceiverErrorMessage] = useState("");
  const [isProceeding, setIsProceeding] = useState(false);

  const { toast } = useToast();

  // Tracks which input the user is typing in (mirrors RateCheckScreen.js `typingType`).
  // "from" = user is typing send amount, "to" = user is typing receive amount.
  const [typingType, setTypingType] = useState<"from" | "to" | "">("from");

  // Debounced amounts for the exchange rate API call (avoids calling on every keystroke).
  // Mirrors RateCheckScreen.js `debounce_fun`.
  const [debouncedSendAmount, setDebouncedSendAmount] = useState("1000");
  const [debouncedReceiveAmount, setDebouncedReceiveAmount] = useState("");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // ── Exchange Rate API ──
  // Mirrors RateCheckScreen.js: setExchangeRate → onFetchExchangeRate
  // Called automatically when currency, delivery method, or debounced amounts change.
  const {
    data: exchangeRateResponse,
    isLoading: isLoadingRate,
    isError: isRateError,
    error: rateError,
    isFetching: isFetchingRate,
    dataUpdatedAt,
  } = useExchangeRate({
    userCurrencyCountryId: fromCountry?.currencyCountryId,
    recipientCurrencyCountryId: selectedCountry?.currencyCountryId,
    sendDeliveryMethod: 1, // default payment method ID (card), mirrors RateCheckScreen.js
    receiveDeliveryMethod: selectedDeliveryId,
    tranType: selectedTransferTimeId,
    amount: typingType === "to" ? 0 : debouncedSendAmount || "0",
    recipientAmount: typingType === "from" || typingType === "" ? 0 : debouncedReceiveAmount || "0",
  });

  // Extract the exchange rate value from the API response
  const exchangeRate = exchangeRateResponse?.data?.rate ?? null;
  const rateErrorMessage = exchangeRateResponse?.data?.errorMessage ?? null;

  // ── Transaction Mutations ──
  // Mirrors RateCheckScreen.js: fetchTransactionQuote + createTransaction (proceed)
  const transactionQuoteMutation = useTransactionQuote();
  const createTransactionMutation = useCreateTransaction();

  // When the exchange rate response comes back, update the calculated counterpart amount.
  // Mirrors RateCheckScreen.js: setReceiveAmount / setSendAmount after successful fetch.
  // We depend on `dataUpdatedAt` (not just `exchangeRate`) so the effect fires on every
  // new API response — even when the rate number hasn't changed (e.g. user changed only
  // the receive amount while the corridor rate stayed the same).
  useEffect(() => {
    if (exchangeRate == null || exchangeRate === 0) return;

    if (typingType === "from" || typingType === "") {
      // User typed a send amount → compute receive
      const send = parseFloat(sendAmount || "0");
      const receive = (send * exchangeRate).toFixed(2);
      setReceiveAmount(receive);
    } else if (typingType === "to") {
      // User typed a receive amount → compute send
      const recv = parseFloat(receiveAmount || "0");
      const send = (recv / exchangeRate).toFixed(2);
      setSendAmount(send);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeRate, dataUpdatedAt]);

  const displayReceiveAmount = receiveAmount || (exchangeRate ? (parseFloat(sendAmount || "0") * exchangeRate).toFixed(2) : "0.00");

  // Debounce helper: updates debounced amounts after 1 s delay (mirrors RateCheckScreen.js debounce_fun)
  const debounceSendAmount = useCallback((value: string) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSendAmount(value);
      setDebouncedReceiveAmount("");
    }, 1000);
  }, []);

  const debounceReceiveAmount = useCallback((value: string) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedReceiveAmount(value);
      setDebouncedSendAmount("");
    }, 1000);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const handleSendAmountChange = useCallback((value: string) => {
    setSendAmount(value);
    setReceiveAmount("");
    setTypingType("from");
    debounceSendAmount(value);
  }, [debounceSendAmount]);

  const handleReceiveAmountChange = useCallback((value: string) => {
    setReceiveAmount(value);
    setTypingType("to");
    debounceReceiveAmount(value);
  }, [debounceReceiveAmount]);

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

  /**
   * Clears sender / receiver inline error messages.
   * Mirrors RateCheckScreen.js `clearErrorMessage`.
   */
  const clearErrorMessages = useCallback(() => {
    setSenderErrorMessage("");
    setReceiverErrorMessage("");
  }, []);

  /**
   * Handles the "Continue" button press.
   *
   * Full port of RateCheckScreen.js `proceed()`:
   *  1. Validates that required fields are present.
   *  2. Validates send / receive amounts (min amount, NaN checks).
   *  3. Calls POST /v1/quote-user (fetchTransactionQuote).
   *  4. On quote success → calls POST /v1/transaction (createTransaction).
   *  5. On transaction success → navigates to select-recipient (or further).
   *  6. Handles all known error codes with toasts & inline messages.
   */
  const handleContinue = useCallback(async () => {
    // Reset previous errors
    clearErrorMessages();
    setWarning(false);

    // ── 1. Required-field guard (mirrors proceed's outer if-check) ──
    if (
      !fromCountry?.currencyCountryId ||
      !selectedCountry?.currencyCountryId ||
      !selectedTransferTimeItem?.id ||
      sendAmount === "" ||
      !selectedDeliveryId ||
      rateErrorMessage // block if there's a rate-level error (e.g. min/max violation)
    ) {
      setWarning(true);
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields before continuing.",
      });
      return;
    }

    // ── 2. Amount validation (mirrors proceed's amount checks) ──
    // Normalise comma-decimal locales to dot-decimal
    const youSend = sendAmount.replace(",", ".");
    const theyReceive = (receiveAmount || displayReceiveAmount).replace(",", ".");

    const youSendNum = parseFloat(youSend);
    const theyReceiveNum = parseFloat(theyReceive);

    if (
      youSendNum < MINIMUM_SENDING_AMOUNT ||
      isNaN(youSendNum) ||
      isNaN(theyReceiveNum) ||
      youSend === "" ||
      theyReceive === ""
    ) {
      setWarning(true);
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: `The sending amount must be at least ${MINIMUM_SENDING_AMOUNT} and both amounts must be valid numbers.`,
      });
      return;
    }

    // ── 3. Build quote body (mirrors proceed's `body` object) ──
    const quoteBody = {
      user_currency_countries_id: fromCountry.currencyCountryId,
      recipient_currency_countries_id: selectedCountry.currencyCountryId,
      user_amount: youSend,
      recipient_amount: theyReceive,
      pickup_method_id: selectedDeliveryItem?.id ?? selectedDeliveryId,
      payment_method_id: 1, // default card payment method, mirrors RateCheckScreen.js
      transfer_time_id: selectedTransferTimeItem.id,
      promo_code: promoCode || null,
    };

    setIsProceeding(true);

    try {
      // ── 4. Fetch transaction quote ──
      const quoteResult = await transactionQuoteMutation.mutateAsync(quoteBody);

      if (!quoteResult.success) {
        // Handle specific error codes (mirrors proceed's error handling)
        const errorCode = quoteResult.errorCode;

        if (errorCode === EXCHANGE_RATE_SENDER_ERROR_CODE) {
          setSenderErrorMessage(quoteResult.message ?? "Sender amount error");
          return;
        }

        if (errorCode === EXCHANGE_RATE_RECEIVER_ERROR_CODE) {
          setReceiverErrorMessage(quoteResult.message ?? "Receiver amount error");
          return;
        }

        // Transfer limit errors (80005 / 80006)
        if (errorCode === 80005 || errorCode === 80006) {
          toast({
            variant: "destructive",
            title: "Transfer limit exceeded",
            description:
              quoteResult.message ?? "You have exceeded your transfer limit. Please verify your account.",
          });
          setLocation("/transfer-limits");
          return;
        }

        // General support-redirect errors (80001–80004)
        if (
          errorCode === 80001 ||
          errorCode === 80002 ||
          errorCode === 80003 ||
          errorCode === 80004
        ) {
          toast({
            variant: "destructive",
            title: "Something went wrong",
            description: quoteResult.message ?? "Please contact support.",
          });
          return;
        }

        // Fallback for any other unsuccessful quote
        toast({
          variant: "destructive",
          title: "Quote failed",
          description: quoteResult.message ?? "Something went wrong. Please try again.",
        });
        return;
      }

      // ── 5. Quote succeeded → create transaction ──
      const transactionId = quoteResult.data?.transaction_id ?? "";

      const txResult = await createTransactionMutation.mutateAsync({
        transaction_id: transactionId,
      });

      // Error code 70002 → support redirect (mirrors makeTransaction)
      if (txResult.errorCode === 70002) {
        toast({
          variant: "destructive",
          title: "Transaction error",
          description: txResult.message ?? "Please contact support.",
        });
        return;
      }

      if (txResult.success) {
        const user = txResult.data?.user;

        if (user?.email_verified_at) {
          // ── 6. Verified user → navigate to select recipient ──
          setLocation(
            `/select-recipient?country=${selectedCountry.code}` +
            `&method=${deliveryMethod}` +
            `&amount=${youSend}` +
            `&receiveAmount=${theyReceive}` +
            `&deliveryId=${selectedDeliveryId ?? ""}` +
            `&transferTimeId=${selectedTransferTimeItem.id ?? ""}` +
            `&transactionId=${transactionId}`,
          );
        } else {
          // Profile incomplete (mirrors makeTransaction's else-branch)
          if (!user?.first_name) {
            toast({
              variant: "destructive",
              title: "Profile incomplete",
              description: "Please complete your profile to continue.",
            });
            setLocation("/profile-details");
            return;
          }

          toast({
            title: "Account verification",
            description: "Please verify your email to continue.",
          });
          setLocation("/profile");
        }
      } else if (txResult.code === 100) {
        // Pending transaction (mirrors makeTransaction's pending check)
        toast({
          variant: "destructive",
          title: "Pending transaction",
          description: "You have a pending transaction. Please wait for it to complete.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Transaction failed",
          description: txResult.message ?? "Something went wrong. Please try again.",
        });
      }
    } catch (err: unknown) {
      // Network / unexpected errors
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsProceeding(false);
    }
  }, [
    fromCountry,
    selectedCountry,
    selectedTransferTimeItem,
    selectedDeliveryItem,
    selectedDeliveryId,
    sendAmount,
    receiveAmount,
    displayReceiveAmount,
    deliveryMethod,
    promoCode,
    rateErrorMessage,
    transactionQuoteMutation,
    createTransactionMutation,
    setLocation,
    toast,
    clearErrorMessages,
  ]);

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
            {isFetchingRate ? (
              <div className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                <span className="text-gray-400 font-bold">Updating...</span>
              </div>
            ) : isRateError ? (
              <span className="font-bold text-red-500">Rate unavailable</span>
            ) : exchangeRate ? (
              <span className="font-bold text-secondary">1 {fromCountry?.currency ?? "EUR"} = {exchangeRate.toFixed(4)} {selectedCountry.currency}</span>
            ) : (
              <span className="font-bold text-secondary">1 {fromCountry?.currency ?? "EUR"} = -- {selectedCountry.currency}</span>
            )}
          </div>

          {/* Rate error message from API (e.g. min/max amount violations) */}
          {rateErrorMessage && (
            <div className="px-5 py-2 bg-red-50 border-t border-red-100">
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {rateErrorMessage}
              </p>
            </div>
          )}
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
          disabled={isProceeding || isFetchingRate}
        >
          {isProceeding ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : (
            "Continue"
          )}
        </Button>

        {/* Sender error message (mirrors RateCheckScreen.js senderErrorMessage) */}
        {senderErrorMessage && (
          <div className="px-4 py-2 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-xs text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {senderErrorMessage}
            </p>
          </div>
        )}

        {/* Receiver error message (mirrors RateCheckScreen.js receiverErrorMessage) */}
        {receiverErrorMessage && (
          <div className="px-4 py-2 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-xs text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {receiverErrorMessage}
            </p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
