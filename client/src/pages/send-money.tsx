import { useState } from "react";
import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowRightLeft, ChevronDown, Wallet, Building2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SendMoney() {
  const [, setLocation] = useLocation();
  const [sendAmount, setSendAmount] = useState("1000");
  const [receiveAmount, setReceiveAmount] = useState("950");
  const [deliveryMethod, setDeliveryMethod] = useState("bank");
  const exchangeRate = 0.95;

  const handleSendChange = (val: string) => {
    setSendAmount(val);
    if (!isNaN(parseFloat(val))) {
      setReceiveAmount((parseFloat(val) * exchangeRate).toFixed(2));
    } else {
      setReceiveAmount("");
    }
  };

  return (
    <MobileLayout title="Send Money">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Exchange Card */}
        <Card className="p-0 overflow-hidden border-none shadow-lg bg-white">
          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-500 text-xs font-medium uppercase tracking-wider">You Send</Label>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">$</span>
                  <Input 
                    type="number" 
                    value={sendAmount}
                    onChange={(e) => handleSendChange(e.target.value)}
                    className="border-none shadow-none text-3xl font-bold p-0 pl-6 h-auto focus-visible:ring-0" 
                    placeholder="0.00"
                  />
                </div>
                <Button variant="outline" className="rounded-full px-3 gap-2 border-gray-200 bg-gray-50 hover:bg-gray-100">
                  <img src="https://flagcdn.com/w40/us.png" className="w-5 h-5 rounded-full object-cover" alt="USD" />
                  <span className="font-semibold">USD</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </div>
            </div>

            <div className="relative h-px bg-gray-100 my-4">
               <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full border border-gray-100 shadow-sm text-primary">
                 <ArrowRightLeft className="h-4 w-4" />
               </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-500 text-xs font-medium uppercase tracking-wider">They Receive</Label>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                   <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">€</span>
                  <Input 
                    type="number" 
                    value={receiveAmount}
                    readOnly
                    className="border-none shadow-none text-3xl font-bold p-0 pl-6 h-auto focus-visible:ring-0 text-primary" 
                    placeholder="0.00"
                  />
                </div>
                 <Button variant="outline" className="rounded-full px-3 gap-2 border-gray-200 bg-gray-50 hover:bg-gray-100">
                  <img src="https://flagcdn.com/w40/eu.png" className="w-5 h-5 rounded-full object-cover" alt="EUR" />
                  <span className="font-semibold">EUR</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3 text-xs text-gray-500 flex justify-between items-center">
            <span>Exchange Rate</span>
            <span className="font-medium text-gray-900">1 USD = {exchangeRate} EUR</span>
          </div>
        </Card>

        {/* Delivery Method */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-900">Delivery Method</Label>
          <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
            <SelectTrigger className="w-full h-14 bg-white rounded-xl border-gray-200 focus:ring-primary">
              <SelectValue placeholder="Select delivery method" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 shadow-xl">
              <SelectItem value="bank" className="py-3 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-sm">Bank Deposit</span>
                    <span className="text-[10px] text-gray-400">Arrives in 1-2 business days</span>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="wallet" className="py-3 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-sm">Mobile Wallet</span>
                    <span className="text-[10px] text-gray-400">Arrives instantly</span>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Promo Code */}
        <div className="space-y-3">
           <Label className="text-base font-semibold text-gray-900">Promo Code</Label>
           <div className="flex gap-2">
             <div className="relative flex-1">
               <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input placeholder="Enter code (optional)" className="pl-9 bg-white" />
             </div>
             <Button variant="outline" className="text-primary border-primary/20 hover:bg-primary/5">Apply</Button>
           </div>
        </div>

        <Button 
          className="w-full h-12 text-base font-semibold rounded-xl shadow-md mt-4" 
          size="lg"
          onClick={() => setLocation("/recipients")}
        >
          Continue
        </Button>
      </div>
    </MobileLayout>
  );
}
