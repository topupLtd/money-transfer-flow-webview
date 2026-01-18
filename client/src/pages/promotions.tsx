import { useState } from "react";
import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const PROMOS = [
  {
    id: "TESTJAN2026",
    title: "20 Free Test Transfer",
    minAmount: "Minimum Transaction Amount 1€",
    expiry: "31 January 2026 23:59",
    remaining: "20 Transfer",
    details: {
      discountRate: "100%",
      maxBonus: "50€",
      maxUse: "20 Transfer",
      deliveryMethods: ["Bank account", "Mobile Wallet"],
      countries: ["All Countries"]
    }
  },
  {
    id: "EXTRA5",
    title: "Enjoy Extra 5 Transfers Fee-free With Paycell!",
    minAmount: "Minimum Transaction Amount 1€",
    expiry: "30 June 2026 23:59",
    remaining: "5 Transfer",
    details: {
      discountRate: "100%",
      maxBonus: "999€",
      maxUse: "5 Transfer",
      deliveryMethods: ["Bank account", "Paycell - Digital Wallet", "Digital Wallet"],
      countries: ["India", "Morocco", "Nigeria"]
    }
  }
];

export default function Promotions() {
  const [, setLocation] = useLocation();

  return (
    <MobileLayout title="Promotions">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* Input Section */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm">Have a promo code?</h3>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter code" 
              className="bg-gray-50 border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button className="h-12 px-6 rounded-xl font-semibold shadow-sm">
              Apply
            </Button>
          </div>
        </div>

        {/* Promotions List */}
        <div className="space-y-4">
          {PROMOS.map((promo) => (
            <div 
              key={promo.id}
              className="bg-white p-5 rounded-3xl shadow-sm border border-gray-200 flex justify-between gap-4"
            >
              <div className="flex flex-col justify-between space-y-2 flex-1">
                <h3 className="font-bold text-gray-900 text-base leading-tight">
                  {promo.title}
                </h3>
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs font-medium">{promo.minAmount}</p>
                  <p className="text-gray-400 text-xs font-medium">Expires {promo.expiry}</p>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between shrink-0 text-right space-y-2">
                <span className="font-bold text-gray-900 text-base">{promo.id}</span>
                
                <div className="flex flex-col items-end">
                   <span className="text-gray-500 text-xs">Remaining Use</span>
                   <span className="text-gray-900 text-sm font-medium">{promo.remaining}</span>
                </div>

                <button 
                  onClick={() => setLocation(`/promotions/${promo.id}`)}
                  className="text-cyan-500 text-sm font-bold hover:underline"
                >
                  View detail
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </MobileLayout>
  );
}
