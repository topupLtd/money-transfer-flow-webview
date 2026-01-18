import { useState } from "react";
import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Percent, Ticket, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PROMOS = [
  { id: "FIRSTFREE", label: "First Transfer Free", discount: "100% Fee Off", description: "Get your first transfer fee completely waived.", expiry: "Expires in 3 days" },
  { id: "WELCOME5", label: "Welcome Bonus", discount: "$5.00 Off", description: "Save $5.00 on your next transfer over $100.", expiry: "Expires in 7 days" },
  { id: "SAVE10", label: "Summer Special", discount: "10% Off Fee", description: "Enjoy discounted fees all summer long.", expiry: "Valid until Aug 31" },
];

export default function Promotions() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    toast({
      description: "Promo code copied to clipboard",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

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

        {/* Active Promotions List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
             <Ticket className="h-4 w-4 text-primary" />
             <h3 className="text-sm font-bold text-gray-900">Available Offers</h3>
          </div>

          <div className="space-y-3">
            {PROMOS.map((promo) => (
              <div 
                key={promo.id}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-3">
                   <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">
                     Active
                   </span>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-1">
                    <Percent className="h-6 w-6" />
                  </div>
                  
                  <div className="space-y-1 flex-1 pr-12">
                    <h4 className="font-bold text-gray-900 text-base">{promo.label}</h4>
                    <p className="text-secondary font-bold text-sm">{promo.discount}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{promo.description}</p>
                    <p className="text-gray-400 text-[10px] pt-1 font-medium">{promo.expiry}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                   <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                     <code className="text-xs font-bold text-gray-600 tracking-wider">{promo.id}</code>
                   </div>
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     className="h-8 gap-1.5 text-primary hover:text-primary hover:bg-primary/5 font-medium"
                     onClick={() => handleCopy(promo.id)}
                   >
                     {copiedId === promo.id ? (
                       <>
                         <Check className="h-3.5 w-3.5" /> Copied
                       </>
                     ) : (
                       <>
                         <Copy className="h-3.5 w-3.5" /> Copy Code
                       </>
                     )}
                   </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MobileLayout>
  );
}
