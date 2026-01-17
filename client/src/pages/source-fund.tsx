import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Wallet, ChevronRight, Briefcase, Stethoscope, Landmark, ShoppingBag, PiggyBank } from "lucide-react";

export default function SourceFund() {
  const [, setLocation] = useLocation();

  const sources = [
    { id: 1, name: "Salary / Employment" },
    { id: 2, name: "Business Profits" },
    { id: 3, name: "Insurance Payout" },
    { id: 4, name: "Personal Savings" },
    { id: 5, name: "Property / Asset Sale" },
  ];

  return (
    <MobileLayout title="Source of Funds">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center py-2">
           <p className="text-sm text-gray-500">Please declare the source of these funds</p>
        </div>

        <div className="space-y-3">
          {sources.map((source) => (
            <div 
              key={source.id}
              onClick={() => setLocation(`/reason${window.location.search}`)}
              className="group flex items-center justify-between p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-primary cursor-pointer transition-all active:scale-[0.98]"
            >
              <h4 className="font-semibold text-gray-900">{source.name}</h4>
              <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
