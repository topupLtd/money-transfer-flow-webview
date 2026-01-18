import { useState } from "react";
import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowRightLeft, ChevronDown, Landmark, Smartphone, Ticket, Percent } from "lucide-react";
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
import { BottomSheetSelect } from "@/components/ui/bottom-sheet-select";

const COUNTRIES = [
  { code: "AO", name: "Angola", currency: "AOA", symbol: "Kz", flag: "https://flagcdn.com/w40/ao.png", rate: 900, deliveryMethods: ["bank", "wallet"] },
  { code: "BD", name: "Bangladesh", currency: "BDT", symbol: "৳", flag: "https://flagcdn.com/w40/bd.png", rate: 118.2, deliveryMethods: ["bank", "wallet"] },
  { code: "BJ", name: "Benin", currency: "XOF", symbol: "CFA", flag: "https://flagcdn.com/w40/bj.png", rate: 655.95, deliveryMethods: ["bank", "wallet"] },
  { code: "BR", name: "Brazil", currency: "BRL", symbol: "R$", flag: "https://flagcdn.com/w40/br.png", rate: 5.4, deliveryMethods: ["bank"] },
  { code: "BF", name: "Burkina Faso", currency: "XOF", symbol: "CFA", flag: "https://flagcdn.com/w40/bf.png", rate: 655.95, deliveryMethods: ["bank", "wallet"] },
  { code: "CM", name: "Cameroon", currency: "XAF", symbol: "FCFA", flag: "https://flagcdn.com/w40/cm.png", rate: 655.95, deliveryMethods: ["bank", "wallet"] },
  { code: "TD", name: "Chad", currency: "XAF", symbol: "FCFA", flag: "https://flagcdn.com/w40/td.png", rate: 655.95, deliveryMethods: ["bank", "wallet"] },
  { code: "CN", name: "China", currency: "CNY", symbol: "¥", flag: "https://flagcdn.com/w40/cn.png", rate: 7.8, deliveryMethods: ["bank", "wallet"] },
  { code: "CO", name: "Colombia", currency: "COP", symbol: "$", flag: "https://flagcdn.com/w40/co.png", rate: 4200, deliveryMethods: ["bank", "wallet"] },
  { code: "CG", name: "Congo", currency: "XAF", symbol: "FCFA", flag: "https://flagcdn.com/w40/cg.png", rate: 655.95, deliveryMethods: ["wallet"] },
  { code: "CD", name: "Congo (DRC)", currency: "CDF", symbol: "FC", flag: "https://flagcdn.com/w40/cd.png", rate: 2800, deliveryMethods: ["wallet"] },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF", symbol: "CFA", flag: "https://flagcdn.com/w40/ci.png", rate: 655.95, deliveryMethods: ["bank", "wallet"] },
  { code: "DO", name: "Dominican Republic", currency: "DOP", symbol: "RD$", flag: "https://flagcdn.com/w40/do.png", rate: 60.5, deliveryMethods: ["bank"] },
  { code: "EG", name: "Egypt", currency: "EGP", symbol: "£", flag: "https://flagcdn.com/w40/eg.png", rate: 52.5, deliveryMethods: ["bank"] },
  { code: "GA", name: "Gabon", currency: "XAF", symbol: "FCFA", flag: "https://flagcdn.com/w40/ga.png", rate: 655.95, deliveryMethods: ["wallet"] },
  { code: "GM", name: "Gambia", currency: "GMD", symbol: "D", flag: "https://flagcdn.com/w40/gm.png", rate: 70.2, deliveryMethods: ["bank", "wallet"] },
  { code: "GH", name: "Ghana", currency: "GHS", symbol: "₵", flag: "https://flagcdn.com/w40/gh.png", rate: 12.5, deliveryMethods: ["bank", "wallet"] },
  { code: "GN", name: "Guinea", currency: "GNF", symbol: "FG", flag: "https://flagcdn.com/w40/gn.png", rate: 9200, deliveryMethods: ["wallet"] },
  { code: "HT", name: "Haiti", currency: "HTG", symbol: "G", flag: "https://flagcdn.com/w40/ht.png", rate: 142, deliveryMethods: ["bank"] },
  { code: "IN", name: "India", currency: "INR", symbol: "₹", flag: "https://flagcdn.com/w40/in.png", rate: 83.1, deliveryMethods: ["bank"] },
  { code: "MG", name: "Madagascar", currency: "MGA", symbol: "Ar", flag: "https://flagcdn.com/w40/mg.png", rate: 4800, deliveryMethods: ["wallet"] },
  { code: "ML", name: "Mali", currency: "XOF", symbol: "CFA", flag: "https://flagcdn.com/w40/ml.png", rate: 655.95, deliveryMethods: ["bank", "wallet"] },
  { code: "MR", name: "Mauritania", currency: "MRU", symbol: "UM", flag: "https://flagcdn.com/w40/mr.png", rate: 42.5, deliveryMethods: ["bank", "wallet"] },
  { code: "MD", name: "Moldova", currency: "MDL", symbol: "L", flag: "https://flagcdn.com/w40/md.png", rate: 19.2, deliveryMethods: ["bank"] },
  { code: "MA", name: "Morocco", currency: "MAD", symbol: "DH", flag: "https://flagcdn.com/w40/ma.png", rate: 10.8, deliveryMethods: ["bank"] },
  { code: "NE", name: "Niger", currency: "XOF", symbol: "CFA", flag: "https://flagcdn.com/w40/ne.png", rate: 655.95, deliveryMethods: ["bank", "wallet"] },
  { code: "NG", name: "Nigeria", currency: "NGN", symbol: "₦", flag: "https://flagcdn.com/w40/ng.png", rate: 1450, deliveryMethods: ["bank", "wallet"] },
  { code: "PK", name: "Pakistan", currency: "PKR", symbol: "₨", flag: "https://flagcdn.com/w40/pk.png", rate: 300.5, deliveryMethods: ["bank", "wallet"] },
  { code: "PH", name: "Philippines", currency: "PHP", symbol: "₱", flag: "https://flagcdn.com/w40/ph.png", rate: 56.2, deliveryMethods: ["bank"] },
  { code: "SN", name: "Senegal", currency: "XOF", symbol: "CFA", flag: "https://flagcdn.com/w40/sn.png", rate: 655.95, deliveryMethods: ["bank", "wallet"] },
  { code: "RS", name: "Serbia", currency: "RSD", symbol: "дин", flag: "https://flagcdn.com/w40/rs.png", rate: 117.2, deliveryMethods: ["bank"] },
  { code: "TG", name: "Togo", currency: "XOF", symbol: "CFA", flag: "https://flagcdn.com/w40/tg.png", rate: 655.95, deliveryMethods: ["bank", "wallet"] },
  { code: "TR", name: "Turkey", currency: "TRY", symbol: "₺", flag: "https://flagcdn.com/w40/tr.png", rate: 34.5, deliveryMethods: ["bank"] },
  { code: "UA", name: "Ukraine", currency: "UAH", symbol: "₴", flag: "https://flagcdn.com/w40/ua.png", rate: 44.2, deliveryMethods: ["bank"] },
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
    setLocation(`/select-recipient?country=${selectedCountry.code}&method=${deliveryMethod}&amount=${sendAmount}`);
  };

  const availableMethods = selectedCountry.deliveryMethods || ["bank", "wallet"];

  return (
    <MobileLayout title="Send Money">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Exchange Card */}
        <Card className="p-0 overflow-hidden border-none shadow-lg bg-white">
          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">You Send</Label>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">€</span>
                  <Input 
                    type="number" 
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="border-none shadow-none text-3xl font-bold p-0 pl-6 h-auto focus-visible:ring-0 text-secondary" 
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                  <img src="https://flagcdn.com/w40/eu.png" className="w-5 h-5 rounded-full object-cover" alt="EUR" />
                  <span className="font-bold text-sm text-secondary">EUR</span>
                </div>
              </div>
            </div>

            <div className="relative h-px bg-gray-100 my-4">
               <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full border border-gray-100 shadow-sm text-primary">
                 <ArrowRightLeft className="h-4 w-4" />
               </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">They Receive</Label>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative overflow-hidden flex items-center">
                  <span className="text-lg font-bold text-gray-400 mr-2 flex-shrink-0">{selectedCountry.symbol}</span>
                  <Input 
                    value={receiveAmount}
                    readOnly
                    className="border-none shadow-none text-2xl font-bold p-0 h-auto focus-visible:ring-0 text-primary truncate bg-transparent flex-1" 
                  />
                </div>
                <BottomSheetSelect
                  value={selectedCountry.code}
                  onValueChange={(code) => {
                    const country = COUNTRIES.find(c => c.code === code) || COUNTRIES[0];
                    setSelectedCountry(country);
                    if (!country.deliveryMethods.includes(deliveryMethod)) {
                      setDeliveryMethod(country.deliveryMethods[0]);
                    }
                  }}
                  title="Select Country"
                  showSearch
                  searchPlaceholder="Search countries..."
                  options={COUNTRIES.map(c => ({
                    value: c.code,
                    label: c.name,
                    sublabel: `(${c.currency})`,
                    icon: <img src={c.flag} className="w-5 h-5 rounded-full object-cover" alt={c.name} />
                  }))}
                  triggerClassName="w-auto h-auto rounded-full px-3 py-2 bg-gray-50 border border-gray-100"
                  renderTriggerContent={() => (
                    <div className="flex items-center gap-2">
                      <img src={selectedCountry.flag} className="w-5 h-5 rounded-full object-cover" alt={selectedCountry.name} />
                      <span className="font-bold text-sm text-secondary">{selectedCountry.currency}</span>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3 text-[10px] text-gray-400 flex justify-between items-center border-t border-gray-100">
            <span className="font-bold uppercase tracking-wider">Exchange Rate</span>
            <span className="font-bold text-secondary">1 EUR = {selectedCountry.rate} {selectedCountry.currency}</span>
          </div>
        </Card>

        {/* Delivery Method */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-900">Delivery Method</Label>
          <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
            <SelectTrigger className="w-full h-auto min-h-[4rem] bg-white rounded-xl border-gray-200 focus:ring-1 focus:ring-primary shadow-sm py-3 px-3">
              <SelectValue placeholder="Select delivery method" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 shadow-2xl p-1">
              {availableMethods.includes("bank") && (
                <SelectItem value="bank" className="py-3 px-3 cursor-pointer rounded-lg hover:bg-gray-50 focus:bg-gray-50 my-1">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Landmark className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-sm text-gray-900">Bank Deposit</span>
                      <span className="text-[10px] text-gray-400">Arrives in 1-2 business days</span>
                    </div>
                  </div>
                </SelectItem>
              )}
              {availableMethods.includes("wallet") && (
                <SelectItem value="wallet" className="py-3 px-3 cursor-pointer rounded-lg hover:bg-gray-50 focus:bg-gray-50 my-1">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-sm text-gray-900">Mobile Wallet</span>
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
                   <Ticket className="h-5 w-5 text-primary" />
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
