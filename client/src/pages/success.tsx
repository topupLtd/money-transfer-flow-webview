import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Share2, Home, Clock, CheckCircle2, Wallet, Send, Check } from "lucide-react";

export default function Success() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const amount = parseFloat(searchParams.get("amount") || "0");

  const steps = [
    { title: "Transfer Initiated", status: "completed", icon: CheckCircle2, time: "Just now" },
    { title: "Deduct from Wallet", status: "processing", icon: Wallet, time: "Processing" },
    { title: "Transfer Submitted", status: "pending", icon: Send, time: "Pending" },
    { title: "Transfer Success", status: "pending", icon: Check, time: "Est. 2 mins" },
  ];

  return (
    <MobileLayout title="Processing">
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 animate-in zoom-in-95 duration-500 py-8">
        
        <div className="relative">
          <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 animate-pulse" />
          <Clock className="h-20 w-20 text-primary relative z-10 bg-white rounded-full p-4 shadow-sm" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Transfer Initiated</h2>
          <p className="text-gray-500 max-w-[280px]">Your transfer of <span className="font-bold text-gray-900">€ {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> has been initiated.</p>
        </div>

        <div className="w-full max-w-xs">
          <div className="pb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-center">Transfer Timeline</span>
          </div>
          <div className="px-5">
            <div className="space-y-6 relative">
              {/* Vertical Line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100 -z-10" />
              
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = step.status === "completed";
                const isProcessing = step.status === "processing";
                
                return (
                  <div key={index} className="flex gap-4 relative">
                    <div className={`
                      h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2 z-10 bg-white
                      ${isCompleted ? "border-primary text-primary" : 
                        isProcessing ? "border-primary text-primary animate-pulse shadow-[0_0_0_4px_rgba(37,99,235,0.1)]" : 
                        "border-gray-200 text-gray-300"}
                    `}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className={`text-sm font-bold ${isCompleted || isProcessing ? "text-gray-900" : "text-gray-400"}`}>
                        {step.title}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {step.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full space-y-3 pt-4">
           <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200 gap-2 hover:bg-gray-50">
             <Share2 className="h-4 w-4" /> Share Receipt
           </Button>
           <Button 
             className="w-full h-12 rounded-xl shadow-md font-bold"
             onClick={() => setLocation("/")}
           >
             <Home className="h-4 w-4 mr-2" /> Back to Home
           </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
