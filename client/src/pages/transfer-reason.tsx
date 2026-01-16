import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Heart, Gift, Briefcase, Home, Plane, GraduationCap, ChevronRight } from "lucide-react";

export default function TransferReason() {
  const [, setLocation] = useLocation();

  const reasons = [
    { id: 1, label: "Family Support", icon: Heart, color: "text-red-500 bg-red-50" },
    { id: 2, label: "Gift / Donation", icon: Gift, color: "text-pink-500 bg-pink-50" },
    { id: 3, label: "Business Services", icon: Briefcase, color: "text-blue-500 bg-blue-50" },
    { id: 4, label: "Property / Rent", icon: Home, color: "text-emerald-500 bg-emerald-50" },
    { id: 5, label: "Travel Expenses", icon: Plane, color: "text-orange-500 bg-orange-50" },
    { id: 6, label: "Education / Fees", icon: GraduationCap, color: "text-purple-500 bg-purple-50" },
  ];

  return (
    <MobileLayout title="Reason for Transfer">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <p className="text-sm text-gray-500 text-center">What is the purpose of this transfer?</p>

        <div className="space-y-3">
          {reasons.map((reason) => (
            <div 
              key={reason.id}
              onClick={() => setLocation("/preview")}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-primary cursor-pointer transition-all active:scale-[0.98]"
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${reason.color}`}>
                <reason.icon className="h-6 w-6" />
              </div>
              <span className="font-semibold text-gray-900 flex-1">{reason.label}</span>
              <ChevronRight className="h-5 w-5 text-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
