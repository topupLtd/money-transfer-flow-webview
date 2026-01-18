import { useLocation, useRoute } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { PROMOS } from "./promotions";
import { ChevronLeft } from "lucide-react";

export default function PromoDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/promotions/:id");
  const promoId = params?.id;
  
  const promo = PROMOS.find(p => p.id === promoId);

  if (!promo) {
    return (
        <MobileLayout title="Promo Details">
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
                Promo not found
            </div>
        </MobileLayout>
    );
  }

  return (
    <MobileLayout 
      title="Promo Details" 
    >
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 bg-white min-h-[85vh] -mx-5 px-5 py-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-cyan-500">Promo code</h2>
            <span className="text-lg font-bold text-cyan-500">{promo.id}</span>
        </div>

        {/* Details List */}
        <div className="space-y-6">
            
            {/* Discount Rate */}
            <div className="space-y-1 border-b border-gray-100 pb-4">
                <p className="text-gray-400 text-sm">Transfer fee discount rate</p>
                <p className="text-xl font-medium text-gray-900">{promo.details.discountRate}</p>
            </div>

            {/* Max Bonus */}
            <div className="space-y-1 border-b border-gray-100 pb-4">
                <p className="text-gray-400 text-sm">Max bonus</p>
                <p className="text-xl font-medium text-gray-900">{promo.details.maxBonus}</p>
            </div>

            {/* Expires */}
            <div className="space-y-1 border-b border-gray-100 pb-4">
                <p className="text-gray-400 text-sm">Expires</p>
                <p className="text-lg font-medium text-gray-900">{promo.expiry}</p>
            </div>

             {/* Max use */}
             <div className="space-y-1 border-b border-gray-100 pb-4">
                <p className="text-gray-400 text-sm">Max use</p>
                <p className="text-lg font-medium text-gray-900">{promo.details.maxUse}</p>
            </div>

             {/* Remaining Use */}
             <div className="space-y-1 border-b border-gray-100 pb-4">
                <p className="text-gray-400 text-sm">Remaining Use</p>
                <p className="text-lg font-medium text-gray-900">{promo.remaining}</p>
            </div>

             {/* Eligible delivery method */}
             <div className="space-y-2 border-b border-gray-100 pb-4">
                <p className="text-gray-400 text-sm">Eligible delivery method</p>
                <div className="space-y-1">
                    {promo.details.deliveryMethods.map((method, idx) => (
                        <p key={idx} className="text-lg font-medium text-gray-900">{method}</p>
                    ))}
                </div>
            </div>

             {/* Eligible recipient countries */}
             <div className="space-y-2 pb-4">
                <p className="text-gray-400 text-sm">Eligible recipient countries</p>
                 <div className="space-y-1">
                    {promo.details.countries.map((country, idx) => (
                        <p key={idx} className="text-lg font-medium text-gray-900">- {country}</p>
                    ))}
                </div>
            </div>

        </div>

      </div>
    </MobileLayout>
  );
}
