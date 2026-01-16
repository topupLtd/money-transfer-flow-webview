import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Heart, Gift, Briefcase, Home, Plane, GraduationCap } from "lucide-react";

export default function TransferReason() {
  const [, setLocation] = useLocation();

  const reasons = [
    { id: 1, label: "Family Support", icon: Heart, color: "text-red-500 bg-red-50" },
    { id: 2, label: "Gift", icon: Gift, color: "text-pink-500 bg-pink-50" },
    { id: 3, label: "Business Services", icon: Briefcase, color: "text-blue-500 bg-blue-50" },
    { id: 4, label: "Property Purchase", icon: Home, color: "text-green-500 bg-green-50" },
    { id: 5, label: "Travel Expenses", icon: Plane, color: "text-orange-500 bg-orange-50" },
    { id: 6, label: "Education", icon: GraduationCap, color: "text-purple-500 bg-purple-50" },
  ];

  return (
    <MobileLayout title="Reason for Transfer">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <p className="text-sm text-gray-500 text-center">Please select a reason for this transaction</p>

        <div className="grid grid-cols-2 gap-4">
          {reasons.map((reason) => (
            <div 
              key={reason.id}
              onClick={() => setLocation("/preview")}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-primary hover:shadow-md cursor-pointer transition-all aspect-square"
            >
              <div className={`h-14 w-14 rounded-full flex items-center justify-center ${reason.color}`}>
                <reason.icon className="h-7 w-7" />
              </div>
              <span className="font-medium text-gray-900 text-center">{reason.label}</span>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
