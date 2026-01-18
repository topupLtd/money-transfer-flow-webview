import { useLocation, useRoute } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { PROMOS } from "./promotions";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    <MobileLayout title="Promo Details">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* Header Section */}
        <Card className="p-5 border-none shadow-sm bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-900">Promo Code</h2>
            <span className="text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">{promo.id}</span>
          </div>
        </Card>

        {/* Details List */}
        <Card className="p-5 space-y-5 border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 pb-2">Promotion Details</h3>
            
            {/* Discount Rate */}
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Discount Rate</span>
                <span className="font-bold text-gray-900">{promo.details.discountRate}</span>
            </div>

            <Separator className="bg-gray-50" />

            {/* Max Bonus */}
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Max Bonus</span>
                <span className="font-bold text-gray-900">{promo.details.maxBonus}</span>
            </div>

            <Separator className="bg-gray-50" />

            {/* Expires */}
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Expires</span>
                <span className="font-bold text-gray-900">{promo.expiry}</span>
            </div>

            <Separator className="bg-gray-50" />

             {/* Max use */}
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Max Usage</span>
                <span className="font-bold text-gray-900">{promo.details.maxUse}</span>
            </div>

            <Separator className="bg-gray-50" />

             {/* Remaining Use */}
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Remaining</span>
                <span className="font-bold text-gray-900">{promo.remaining}</span>
            </div>
        </Card>

        {/* Requirements Card */}
        <Card className="p-5 space-y-5 border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 pb-2">Requirements</h3>

             {/* Eligible delivery method */}
             <div className="space-y-3">
                <p className="text-gray-500 font-medium text-sm">Eligible Delivery Methods</p>
                <div className="flex flex-wrap gap-2">
                    {promo.details.deliveryMethods.map((method, idx) => (
                        <span key={idx} className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-100">
                            {method}
                        </span>
                    ))}
                </div>
            </div>

            <Separator className="bg-gray-50" />

             {/* Eligible recipient countries */}
             <div className="space-y-3">
                <p className="text-gray-500 font-medium text-sm">Eligible Countries</p>
                 <div className="flex flex-wrap gap-2">
                    {promo.details.countries.map((country, idx) => (
                        <span key={idx} className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-100">
                            {country}
                        </span>
                    ))}
                </div>
            </div>
        </Card>

      </div>
    </MobileLayout>
  );
}
