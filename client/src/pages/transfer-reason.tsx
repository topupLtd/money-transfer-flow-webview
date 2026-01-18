import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { ChevronRight } from "lucide-react";

export default function TransferReason() {
  const [, setLocation] = useLocation();

  const reasons = [
    { id: 1, label: "Family Support" },
    { id: 2, label: "Gift / Donation" },
    { id: 3, label: "Business Services" },
    { id: 4, label: "Property / Rent" },
    { id: 5, label: "Travel Expenses" },
    { id: 6, label: "Education / Fees" },
  ];

  const handleBack = () => {
    const searchParams = new URLSearchParams(window.location.search);
    setLocation(`/source${searchParams.toString() ? '?' + searchParams.toString() : ''}`);
  };

  return (
    <MobileLayout title="Reason for Transfer" onBack={handleBack}>
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <p className="text-sm text-gray-500 text-center">What is the purpose of this transfer?</p>

        <div className="space-y-3">
          {reasons.map((reason) => (
            <div 
              key={reason.id}
              onClick={() => setLocation(`/preview${window.location.search}`)}
              className="flex items-center justify-between p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-primary cursor-pointer transition-all active:scale-[0.98]"
            >
              <span className="font-semibold text-gray-900">{reason.label}</span>
              <ChevronRight className="h-5 w-5 text-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
