import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Wallet, ChevronRight, Briefcase, Stethoscope, Landmark, ShoppingBag, PiggyBank } from "lucide-react";

export default function SourceFund() {
  const [, setLocation] = useLocation();

  const sources = [
    { id: 1, name: "Salary / Employment", icon: Briefcase, color: "text-blue-500 bg-blue-50" },
    { id: 2, name: "Business Profits", icon: Landmark, color: "text-emerald-500 bg-emerald-50" },
    { id: 3, name: "Insurance Payout", icon: Stethoscope, color: "text-red-500 bg-red-50" },
    { id: 4, name: "Personal Savings", icon: PiggyBank, color: "text-orange-500 bg-orange-50" },
    { id: 5, name: "Property / Asset Sale", icon: ShoppingBag, color: "text-purple-500 bg-purple-50" },
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
              onClick={() => setLocation("/reason")}
              className="group flex items-center gap-4 p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-primary cursor-pointer transition-all active:scale-[0.98]"
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${source.color}`}>
                <source.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{source.name}</h4>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
