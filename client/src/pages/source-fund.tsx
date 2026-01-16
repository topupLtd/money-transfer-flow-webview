import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { CreditCard, Wallet, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SourceFund() {
  const [, setLocation] = useLocation();

  const sources = [
    { id: 1, name: "MyPCS Wallet", balance: "$1,240.50", icon: Wallet, type: "Wallet", last4: null },
    { id: 2, name: "Visa Debit", balance: null, icon: CreditCard, type: "Card", last4: "4582" },
    { id: 3, name: "Mastercard", balance: null, icon: CreditCard, type: "Card", last4: "8832" },
  ];

  return (
    <MobileLayout title="Source of Funds">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center py-2">
           <p className="text-sm text-gray-500">How would you like to pay?</p>
           <h2 className="text-2xl font-bold text-gray-900">$1,000.00</h2>
        </div>

        <div className="space-y-3">
          {sources.map((source) => (
            <div 
              key={source.id}
              onClick={() => setLocation("/reason")}
              className="group flex items-center gap-4 p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-primary cursor-pointer transition-all"
            >
              <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:text-primary transition-colors">
                <source.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{source.name}</h4>
                {source.balance ? (
                  <p className="text-sm text-secondary font-medium">Balance: {source.balance}</p>
                ) : (
                  <p className="text-sm text-gray-500">**** **** **** {source.last4}</p>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary" />
            </div>
          ))}

          <button className="w-full flex items-center gap-4 p-5 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors">
            <div className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center">
              <Plus className="h-5 w-5" />
            </div>
            <span className="font-medium">Add New Payment Method</span>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
