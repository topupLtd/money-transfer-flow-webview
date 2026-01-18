import { useState } from "react";
import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";

const PROMOS = [
  { 
    id: "TESTJAN2026", 
    label: "20 Free Test Transfer", 
    minAmount: "Minimum Transaction Amount 1€", 
    remaining: "Remaining Use\n20 Transfer", 
    expiry: "Expires 31 January 2026 23:59" 
  },
  { 
    id: "EXTRA5", 
    label: "Enjoy Extra 5 Transfers Fee-free With Paycell!", 
    minAmount: "Minimum Transaction Amount 1€", 
    remaining: "Remaining Use\n5 Transfer", 
    expiry: "Expires 30 June 2026 23:59" 
  },
];

export default function Promotions() {
  const [, setLocation] = useLocation();

  return (
    <MobileLayout title="Promo Code">
      <div className="flex flex-col min-h-[calc(100vh-8rem)]">
        {/* Active Promotions List */}
        <div className="flex-1 space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 pt-2">
          {PROMOS.map((promo) => (
            <div 
              key={promo.id}
              className="bg-gray-50/50 p-5 rounded-3xl border border-gray-200 flex justify-between items-start gap-4"
            >
              {/* Left Side */}
              <div className="flex flex-col gap-1.5 max-w-[65%]">
                <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-0.5">
                  {promo.label}
                </h3>
                <p className="text-gray-400 text-[11px] font-medium tracking-wide">
                  {promo.minAmount}
                </p>
                <p className="text-gray-400 text-[11px] font-medium tracking-wide">
                  {promo.expiry}
                </p>
              </div>

              {/* Right Side */}
              <div className="flex flex-col items-end text-right gap-1 shrink-0">
                <p className="font-bold text-gray-900 text-sm tracking-tight">
                  {promo.id}
                </p>
                <p className="text-gray-500 text-[10px] font-medium whitespace-pre-line leading-tight text-right">
                  {promo.remaining}
                </p>
                <button className="text-[#00A3BF] text-[11px] font-bold mt-1.5 hover:text-[#008CA3] transition-colors">
                  View detail
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Button */}
        <div className="pt-4 mt-auto">
          <Button 
            className="w-full h-14 text-base font-bold rounded-full shadow-lg bg-[#2D8CBB] hover:bg-[#257AA3] text-white" 
            size="lg"
          >
            Add New Promo
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
