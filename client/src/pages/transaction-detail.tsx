import { useLocation, useParams } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Share2, CheckCircle2 } from "lucide-react";

export default function TransactionDetail() {
  const [, setLocation] = useLocation();
  const params = useParams();

  // Mock data based on ID
  const tx = {
    id: params.id,
    recipient: "Maria Garcia",
    amount: "€ 950.00",
    fee: "Free",
    total: "€ 995.00",
    rate: "1 EUR = 0.95 EUR",
    date: "Jan 16, 2026 14:30",
    status: "Completed",
    method: "Bank Deposit",
    reference: "TRX-883920",
    bank: "Chase Bank",
    account: "**** 1234"
  };

  return (
    <MobileLayout title="Transaction Detail">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent -ml-1 text-gray-500" onClick={() => setLocation("/transactions")}>
          <ChevronLeft className="h-5 w-5 mr-1" /> Back to History
        </Button>

        <div className="flex flex-col items-center justify-center py-6 space-y-3">
          <div className="h-16 w-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{tx.amount}</h2>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">{tx.status}</span>
        </div>

        <Card className="p-5 space-y-4 border-gray-100 shadow-sm">
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-start">
               <span className="text-gray-400 font-medium">Recipient</span>
               <div className="text-right">
                 <p className="font-bold text-gray-900">{tx.recipient}</p>
                 <p className="text-xs text-gray-400">{tx.bank} • {tx.account}</p>
               </div>
            </div>
            <Separator className="bg-gray-50" />
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Delivery Method</span>
              <span className="font-bold text-gray-900">{tx.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Exchange Rate</span>
              <span className="font-bold text-gray-900">{tx.rate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Transfer Fee</span>
              <span className="font-bold text-green-600">{tx.fee}</span>
            </div>
            <Separator className="bg-gray-50" />
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Date & Time</span>
              <span className="font-bold text-gray-900">{tx.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Reference Number</span>
              <span className="font-bold text-gray-900">{tx.reference}</span>
            </div>
            <Separator className="bg-gray-50" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">Total Charged</span>
              <span className="text-lg font-bold text-primary">{tx.total}</span>
            </div>
          </div>
        </Card>

        <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200 gap-2">
           <Share2 className="h-4 w-4" /> Share Receipt
        </Button>
      </div>
    </MobileLayout>
  );
}
