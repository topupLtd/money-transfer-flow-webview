import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Share2, Home } from "lucide-react";

export default function Success() {
  const [, setLocation] = useLocation();

  return (
    <MobileLayout title="Success">
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-8 animate-in zoom-in-95 duration-500">
        
        <div className="relative">
          <div className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-pulse" />
          <CheckCircle2 className="h-24 w-24 text-secondary relative z-10 bg-white rounded-full" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Transfer Successful!</h2>
          <p className="text-gray-500 max-w-[250px]">Your money is on its way to Maria Garcia.</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl w-full max-w-xs space-y-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Amount Sent</span>
            <span className="font-bold text-gray-900">$ 995.00</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-gray-500 text-sm">Transaction ID</span>
             <span className="font-medium text-gray-900 text-sm">#TRX-883920</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-gray-500 text-sm">Date</span>
             <span className="font-medium text-gray-900 text-sm">Jan 16, 2026</span>
          </div>
        </div>

        <div className="w-full space-y-3 pt-8">
           <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200 gap-2">
             <Share2 className="h-4 w-4" /> Share Receipt
           </Button>
           <Button 
             className="w-full h-12 rounded-xl"
             onClick={() => setLocation("/")}
           >
             <Home className="h-4 w-4 mr-2" /> Back to Home
           </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
