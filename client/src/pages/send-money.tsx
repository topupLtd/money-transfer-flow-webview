import { useState } from "react";
import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowRightLeft, ChevronDown, Wallet, Building2, Tag, Percent } from "lucide-react";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const COUNTRIES = [
  { 
    code: "NG", 
    name: "Nigeria", 
    currency: "NGN", 
    flag: "https://flagcdn.com/w40/ng.png", 
    rate: 1450,
    deliveryMethods: ["bank", "wallet"]
  },
  { 
    code: "KE", 
    name: "Kenya", 
    currency: "KES", 
    flag: "https://flagcdn.com/w40/ke.png", 
    rate: 130,
    deliveryMethods: ["wallet"]
  },
  { 
    code: "GH", 
    name: "Ghana", 
    currency: "GHS", 
    flag: "https://flagcdn.com/w40/gh.png", 
    rate: 12.5,
    deliveryMethods: ["bank", "wallet"]
  },
  { 
    code: "PH", 
    name: "Philippines", 
    currency: "PHP", 
    flag: "https://flagcdn.com/w40/ph.png", 
    rate: 56.2,
    deliveryMethods: ["bank"]
  },
  { 
    code: "IN", 
    name: "India", 
    currency: "INR", 
    flag: "https://flagcdn.com/w40/in.png", 
    rate: 83.1,
    deliveryMethods: ["bank"]
  },
  { 
    code: "VN", 
    name: "Vietnam", 
    currency: "VND", 
    flag: "https://flagcdn.com/w40/vn.png", 
    rate: 24500,
    deliveryMethods: ["bank", "wallet"]
  },
];

const PROMOS = [
  { id: "FIRSTFREE", label: "First Transfer Free", discount: "100% Fee Off" },
  { id: "WELCOME5", label: "Welcome Bonus", discount: "$5.00 Off" },
  { id: "SAVE10", label: "Summer Special", discount: "10% Off Fee" },
];

export default function SendMoney() {
  const [, setLocation] = useLocation();
  const [sendAmount, setSendAmount] = useState("1000");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [deliveryMethod, setDeliveryMethod] = useState("bank");
  const [promoCode, setPromoCode] = useState("");

    const receiveAmount = (parseFloat(sendAmount || "0") * selectedCountry.rate).toLocaleString();

  const handleContinue = () => {
    setLocation(`/select-recipient?country=${selectedCountry.code}&method=${deliveryMethod}`);
  };

  const availableMethods = selectedCountry.deliveryMethods || ["bank", "wallet"];

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
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">€</span>
                  <Input 
                    type="number" 
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="border-none shadow-none text-3xl font-bold p-0 pl-6 h-auto focus-visible:ring-0" 
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                  <img src="https://flagcdn.com/w40/eu.png" className="w-5 h-5 rounded-full object-cover" alt="EUR" />
                  <span className="font-semibold text-sm">EUR</span>
                </div>
              </div>
            </div>

            <div className="relative h-px bg-gray-100 my-4">
               <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full border border-gray-100 shadow-sm text-primary">
                 <ArrowRightLeft className="h-4 w-4" />
               </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-500 text-xs font-medium uppercase tracking-wider">Recipient Country</Label>
              <Select 
                value={selectedCountry.code} 
                onValueChange={(code) => {
                  const country = COUNTRIES.find(c => c.code === code) || COUNTRIES[0];
                  setSelectedCountry(country);
                  // Reset delivery method if not available in new country
                  if (!country.deliveryMethods.includes(deliveryMethod)) {
                    setDeliveryMethod(country.deliveryMethods[0]);
                  }
                }}
              >
                <SelectTrigger className="w-full h-12 rounded-xl px-4 gap-2 border-gray-200 bg-gray-50 hover:bg-gray-100 border focus:ring-0">
                  <SelectValue>
                    <div className="flex items-center gap-3">
                      <img src={selectedCountry.flag} className="w-6 h-6 rounded-full object-cover shadow-sm" alt={selectedCountry.name} />
                      <span className="font-bold text-gray-900">{selectedCountry.name}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 shadow-2xl">
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code} className="py-3">
                      <div className="flex items-center gap-3">
                        <img src={c.flag} className="w-6 h-6 rounded-full object-cover shadow-sm" alt={c.name} />
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{c.name}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{c.currency}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 pt-2">
              <Label className="text-gray-500 text-xs font-medium uppercase tracking-wider">They Receive</Label>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative overflow-hidden">
                  <Input 
                    value={receiveAmount}
                    readOnly
                    className="border-none shadow-none text-2xl font-bold p-0 h-auto focus-visible:ring-0 text-primary truncate bg-transparent" 
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                  <span className="font-bold text-sm text-primary">{selectedCountry.currency}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3 text-[10px] text-gray-400 flex justify-between items-center border-t border-gray-100">
            <span className="font-medium">Exchange Rate</span>
            <span className="font-bold text-gray-900">1 EUR = {selectedCountry.rate} {selectedCountry.currency}</span>
          </div>
        </Card>

        {/* Delivery Method */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-900">Delivery Method</Label>
          <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
            <SelectTrigger className="w-full h-14 bg-white rounded-xl border-gray-200 focus:ring-primary shadow-sm">
              <SelectValue placeholder="Select delivery method" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 shadow-2xl">
              {availableMethods.includes("bank") && (
                <SelectItem value="bank" className="py-3 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-sm">Bank Deposit</span>
                      <span className="text-[10px] text-gray-400">Arrives in 1-2 business days</span>
                    </div>
                  </div>
                </SelectItem>
              )}
              {availableMethods.includes("wallet") && (
                <SelectItem value="wallet" className="py-3 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                      <Wallet className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-sm">Mobile Wallet</span>
                      <span className="text-[10px] text-gray-400">Arrives instantly</span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Promo Code Drawer */}
        <div className="space-y-3">
           <Label className="text-base font-semibold text-gray-900">Promo Code</Label>
           <Drawer>
             <DrawerTrigger asChild>
               <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                 <div className="flex items-center gap-3">
                   <Tag className="h-5 w-5 text-primary" />
                   <span className={promoCode ? "font-semibold text-primary" : "text-gray-400"}>
                     {promoCode ? `Applied: ${promoCode}` : "Apply Promo Code"}
                   </span>
                 </div>
                 <ChevronDown className="h-4 w-4 text-gray-400" />
               </button>
             </DrawerTrigger>
             <DrawerContent className="max-w-md mx-auto">
               <DrawerHeader>
                 <DrawerTitle>Promotions</DrawerTitle>
                 <DrawerDescription>Enter a code or select from the list below</DrawerDescription>
               </DrawerHeader>
               <div className="px-4 py-4 space-y-6">
                 <div className="flex gap-2">
                   <Input 
                     placeholder="Enter code" 
                     className="bg-gray-50 border-none h-12 rounded-xl"
                     value={promoCode}
                     onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                   />
                   <DrawerClose asChild>
                     <Button className="h-12 px-6 rounded-xl">Apply</Button>
                   </DrawerClose>
                 </div>
                 
                 <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Available Offers</p>
                    {PROMOS.map((promo) => (
                      <button 
                        key={promo.id}
                        onClick={() => setPromoCode(promo.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                          promoCode === promo.id ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
                        }`}
                      >
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          promoCode === promo.id ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                        }`}>
                          <Percent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{promo.label}</p>
                          <p className="text-xs text-gray-500">{promo.discount}</p>
                        </div>
                        {promoCode === promo.id && (
                          <div className="h-5 w-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-bold">✓</div>
                        )}
                      </button>
                    ))}
                 </div>
               </div>
               <DrawerFooter>
                 <DrawerClose asChild>
                   <Button variant="ghost">Close</Button>
                 </DrawerClose>
               </DrawerFooter>
             </DrawerContent>
           </Drawer>
        </div>

        <Button 
          className="w-full h-12 text-base font-semibold rounded-xl shadow-md mt-4 bg-primary hover:bg-primary/90" 
          size="lg"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </MobileLayout>
  );
}
