import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { ChevronRight, AlertCircle, RefreshCw, Pencil, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useTransferReasons, useUpdateReasonSource } from "@/hooks/useReasonSource";
import { OTHER_REASON_ID, OTHER_SOURCE_ID } from "@/api/types/reason-source";

export default function TransferReason() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const { toast } = useToast();

  const [customReason, setCustomReason] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // URL params carried from source-fund page
  const sourceId = searchParams.get("sourceId");
  const sourceName = searchParams.get("sourceName");
  const customSource = searchParams.get("customSource");
  const transactionId = searchParams.get("transactionId");

  // ── Fetch transfer reasons from GET /v1/transfer-reasons ──
  const {
    data: reasons,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransferReasons();

  // ── PATCH /v1/transaction/reason-source mutation ──
  const updateReasonSourceMutation = useUpdateReasonSource();

  const handleBack = useCallback(() => {
    setLocation(`/source${searchParams.toString() ? "?" + searchParams.toString() : ""}`);
  }, [setLocation, searchParams]);

  /**
   * Select a reason and submit:
   * 1. If "Other" (id === 11) → show custom input
   * 2. Otherwise → call PATCH /v1/transaction/reason-source with reason + source
   * 3. On success → navigate to /preview
   *
   * Mirrors ReasonOfTransfer.js onPress handler.
   */
  const handleSelect = useCallback(
    async (reasonId: number, reasonName: string, customReasonText?: string) => {
      // If "Other" reason, show custom input first
      if (reasonId === OTHER_REASON_ID && !customReasonText) {
        setSelectedId(reasonId);
        return;
      }

      if (!transactionId || !sourceId) {
        toast({
          variant: "destructive",
          title: "Missing data",
          description: "Transaction or source information is missing. Please go back and try again.",
        });
        return;
      }

      setIsSubmitting(true);

      try {
        // Build the PATCH body (mirrors ReasonOfTransfer.js onPress)
        const body: Record<string, string | number> = {
          reason_id: reasonId,
          origin_of_fund_id: Number(sourceId),
          transaction_id: transactionId,
        };

        // Custom reason text (when reason_id === 11)
        if (reasonId === OTHER_REASON_ID && customReasonText) {
          body.other_transfer_reason = customReasonText;
        }

        // Custom source text (when origin_of_fund_id === 8)
        if (Number(sourceId) === OTHER_SOURCE_ID && customSource) {
          body.other_origin_of_fund = customSource;
        }

        const response = await updateReasonSourceMutation.mutateAsync(body as any);

        if (response.success) {
          // Carry forward all params + add reason info for preview
          const params = new URLSearchParams(searchParams);
          params.set("reasonId", String(reasonId));
          params.set("reasonName", customReasonText || reasonName);
          setLocation(`/preview?${params.toString()}`);
        } else {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: response.message ?? "Could not save transfer details. Please try again.",
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
        setIsSubmitting(false);
      }
    },
    [transactionId, sourceId, customSource, searchParams, setLocation, toast, updateReasonSourceMutation],
  );

  /** Submit custom "Other" reason */
  const handleSubmitCustomReason = useCallback(() => {
    if (!customReason.trim()) return;
    handleSelect(OTHER_REASON_ID, customReason.trim(), customReason.trim());
  }, [customReason, handleSelect]);

  return (
    <MobileLayout title="Reason for Transfer" onBack={handleBack}>
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <p className="text-sm text-gray-500 text-center">What is the purpose of this transfer?</p>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <Card className="p-6 border-red-100 bg-red-50/50">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <p className="text-sm text-red-600 font-medium">
                {error?.message ?? "Failed to load transfer reasons."}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
                <RefreshCw className="h-3 w-3" />
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* Submitting overlay */}
        {isSubmitting && (
          <div className="flex items-center justify-center gap-2 py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-gray-500 font-medium">Saving details...</span>
          </div>
        )}

        {/* List */}
        {!isLoading && !isError && reasons && (
          <div className="space-y-3">
            {reasons.map((reason) => (
              <div key={reason.id}>
                <div
                  onClick={() => !isSubmitting && handleSelect(reason.id, reason.name)}
                  className={`flex items-center justify-between p-5 rounded-xl bg-white border shadow-sm cursor-pointer transition-all active:scale-[0.98] ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  } ${
                    selectedId === reason.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-100 hover:border-primary"
                  }`}
                >
                  <span className="font-semibold text-gray-900">{reason.name}</span>
                  {reason.id === OTHER_REASON_ID && selectedId === OTHER_REASON_ID ? (
                    <Pencil className="h-4 w-4 text-primary" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-300" />
                  )}
                </div>

                {/* Custom input for "Other" reason (id === 11) */}
                {reason.id === OTHER_REASON_ID && selectedId === OTHER_REASON_ID && (
                  <div className="mt-2 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Input
                      placeholder="Please specify reason"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="h-12 rounded-xl"
                      autoFocus
                    />
                    <Button
                      onClick={handleSubmitCustomReason}
                      disabled={!customReason.trim() || isSubmitting}
                      className="h-12 rounded-xl px-6 font-bold"
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && reasons && reasons.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            No transfer reason options available.
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
