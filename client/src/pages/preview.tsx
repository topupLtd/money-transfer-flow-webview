import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function Preview() {
  const [, setLocation] = useLocation();

  return (
    <MobileLayout title="Review Transfer">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* Main Amount Card */}
        <Card className="bg-primary text-primary-foreground p-6 rounded-2xl border-none shadow-lg">
          <div className="text-center space-y-1">
            <p className="text-primary-foreground/80 text-sm">Recipient Gets</p>
            <h2 className="text-3xl font-bold">€ 950.00</h2>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm bg-black/10 py-1 px-3 rounded-full w-fit mx-auto">
              <span>Maria Garcia</span>
              <ArrowRight className="h-3 w-3" />
              <span>Chase Bank</span>
            </div>
          </div>
        </Card>

        {/* Details List */}
        <Card className="p-5 space-y-4 border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900">Transaction Details</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">You Send</span>
              <span className="font-medium">$ 1,000.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Exchange Rate</span>
              <span className="font-medium">1 USD = 0.95 EUR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Transfer Fee</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
             <div className="flex justify-between">
              <span className="text-gray-500">Discount</span>
              <span className="font-medium text-green-600">-$ 5.00</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center pt-1">
              <span className="font-semibold text-gray-900">Total to Pay</span>
              <span className="text-xl font-bold text-primary">$ 995.00</span>
            </div>
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="p-4 flex items-center justify-between border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-gray-600">V</span>
            </div>
            <div>
               <p className="font-medium text-gray-900">Visa Debit</p>
               <p className="text-xs text-gray-500">**** 4582</p>
            </div>
          </div>
          <Button variant="ghost" className="text-primary text-sm h-auto p-0 hover:bg-transparent">Change</Button>
        </Card>

        <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start">
           <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
           <p className="text-xs text-blue-700 leading-tight">
             Your transfer is encrypted and secure. By tapping "Send Now", you agree to our Terms of Service.
           </p>
        </div>

        <Button 
          className="w-full h-12 text-base font-semibold rounded-xl shadow-md bg-primary hover:bg-primary/90" 
          size="lg"
          onClick={() => setLocation("/success")}
        >
          Send Now
        </Button>
      </div>
    </MobileLayout>
  );
}
