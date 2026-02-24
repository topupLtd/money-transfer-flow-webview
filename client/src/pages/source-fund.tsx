import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { ChevronRight, AlertCircle, RefreshCw, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSourceOfFunds } from "@/hooks/useReasonSource";
import { OTHER_SOURCE_ID } from "@/api/types/reason-source";

export default function SourceFund() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);

  const [customSource, setCustomSource] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // ── Fetch source of funds from GET /v1/origin-of-funds ──
  const {
    data: sources,
    isLoading,
    isError,
    error,
    refetch,
  } = useSourceOfFunds();

  const handleBack = useCallback(() => {
    setLocation(`/select-recipient${searchParams.toString() ? "?" + searchParams.toString() : ""}`);
  }, [setLocation, searchParams]);

  /** Select a source and navigate to /reason */
  const handleSelect = useCallback(
    (id: number, name: string) => {
      // If "Other" (id === 8), show input first
      if (id === OTHER_SOURCE_ID) {
        setSelectedId(id);
        return;
      }

      const params = new URLSearchParams(searchParams);
      params.set("sourceId", String(id));
      params.set("sourceName", name);
      setLocation(`/reason?${params.toString()}`);
    },
    [searchParams, setLocation],
  );

  /** Submit custom "Other" source */
  const handleSubmitCustomSource = useCallback(() => {
    if (!customSource.trim()) return;
    const params = new URLSearchParams(searchParams);
    params.set("sourceId", String(OTHER_SOURCE_ID));
    params.set("sourceName", customSource.trim());
    params.set("customSource", customSource.trim());
    setLocation(`/reason?${params.toString()}`);
  }, [customSource, searchParams, setLocation]);

  return (
    <MobileLayout title="Source of Funds" onBack={handleBack}>
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center py-2">
          <p className="text-sm text-gray-500">Please declare the source of these funds</p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
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
                {error?.message ?? "Failed to load source of funds."}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
                <RefreshCw className="h-3 w-3" />
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* List */}
        {!isLoading && !isError && sources && (
          <div className="space-y-3">
            {sources.map((source) => (
              <div key={source.id}>
                <div
                  onClick={() => handleSelect(source.id, source.name)}
                  className={`group flex items-center justify-between p-5 rounded-xl bg-white border shadow-sm cursor-pointer transition-all active:scale-[0.98] ${
                    selectedId === source.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-100 hover:border-primary"
                  }`}
                >
                  <h4 className="font-semibold text-gray-900">{source.name}</h4>
                  {source.id === OTHER_SOURCE_ID && selectedId === OTHER_SOURCE_ID ? (
                    <Pencil className="h-4 w-4 text-primary" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
                  )}
                </div>

                {/* Custom input for "Other" source (id === 8) */}
                {source.id === OTHER_SOURCE_ID && selectedId === OTHER_SOURCE_ID && (
                  <div className="mt-2 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Input
                      placeholder="Please specify source of funds"
                      value={customSource}
                      onChange={(e) => setCustomSource(e.target.value)}
                      className="h-12 rounded-xl"
                      autoFocus
                    />
                    <Button
                      onClick={handleSubmitCustomSource}
                      disabled={!customSource.trim()}
                      className="h-12 rounded-xl px-6 font-bold"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && sources && sources.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            No source of funds options available.
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
