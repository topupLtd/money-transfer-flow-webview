import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ShieldCheck, Wallet } from "lucide-react";

const COUNTRIES = [
  { code: "AO", name: "Angola", currency: "AOA", flag: "https://flagcdn.com/w40/ao.png", rate: 900 },
  { code: "BD", name: "Bangladesh", currency: "BDT", flag: "https://flagcdn.com/w40/bd.png", rate: 118.2 },
  { code: "BJ", name: "Benin", currency: "XOF", flag: "https://flagcdn.com/w40/bj.png", rate: 655.95 },
  { code: "BR", name: "Brazil", currency: "BRL", flag: "https://flagcdn.com/w40/br.png", rate: 5.4 },
  { code: "BF", name: "Burkina Faso", currency: "XOF", flag: "https://flagcdn.com/w40/bf.png", rate: 655.95 },
  { code: "CM", name: "Cameroon", currency: "XAF", flag: "https://flagcdn.com/w40/cm.png", rate: 655.95 },
  { code: "TD", name: "Chad", currency: "XAF", flag: "https://flagcdn.com/w40/td.png", rate: 655.95 },
  { code: "CN", name: "China", currency: "CNY", flag: "https://flagcdn.com/w40/cn.png", rate: 7.8 },
  { code: "CO", name: "Colombia", currency: "COP", flag: "https://flagcdn.com/w40/co.png", rate: 4200 },
  { code: "CG", name: "Congo", currency: "XAF", flag: "https://flagcdn.com/w40/cg.png", rate: 655.95 },
  { code: "CD", name: "Congo (DRC)", currency: "CDF", flag: "https://flagcdn.com/w40/cd.png", rate: 2800 },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF", flag: "https://flagcdn.com/w40/ci.png", rate: 655.95 },
  { code: "DO", name: "Dominican Republic", currency: "DOP", flag: "https://flagcdn.com/w40/do.png", rate: 60.5 },
  { code: "EG", name: "Egypt", currency: "EGP", flag: "https://flagcdn.com/w40/eg.png", rate: 52.5 },
  { code: "GA", name: "Gabon", currency: "XAF", flag: "https://flagcdn.com/w40/ga.png", rate: 655.95 },
  { code: "GM", name: "Gambia", currency: "GMD", flag: "https://flagcdn.com/w40/gm.png", rate: 70.2 },
  { code: "GH", name: "Ghana", currency: "GHS", flag: "https://flagcdn.com/w40/gh.png", rate: 12.5 },
  { code: "GN", name: "Guinea", currency: "GNF", flag: "https://flagcdn.com/w40/gn.png", rate: 9200 },
  { code: "HT", name: "Haiti", currency: "HTG", flag: "https://flagcdn.com/w40/ht.png", rate: 142 },
  { code: "IN", name: "India", currency: "INR", flag: "https://flagcdn.com/w40/in.png", rate: 83.1 },
  { code: "MG", name: "Madagascar", currency: "MGA", flag: "https://flagcdn.com/w40/mg.png", rate: 4800 },
  { code: "ML", name: "Mali", currency: "XOF", flag: "https://flagcdn.com/w40/ml.png", rate: 655.95 },
  { code: "MR", name: "Mauritania", currency: "MRU", flag: "https://flagcdn.com/w40/mr.png", rate: 42.5 },
  { code: "MD", name: "Moldova", currency: "MDL", flag: "https://flagcdn.com/w40/md.png", rate: 19.2 },
  { code: "MA", name: "Morocco", currency: "MAD", flag: "https://flagcdn.com/w40/ma.png", rate: 10.8 },
  { code: "NE", name: "Niger", currency: "XOF", flag: "https://flagcdn.com/w40/ne.png", rate: 655.95 },
  { code: "NG", name: "Nigeria", currency: "NGN", flag: "https://flagcdn.com/w40/ng.png", rate: 1450 },
  { code: "PK", name: "Pakistan", currency: "PKR", flag: "https://flagcdn.com/w40/pk.png", rate: 300.5 },
  { code: "PH", name: "Philippines", currency: "PHP", flag: "https://flagcdn.com/w40/ph.png", rate: 56.2 },
  { code: "SN", name: "Senegal", currency: "XOF", flag: "https://flagcdn.com/w40/sn.png", rate: 655.95 },
  { code: "RS", name: "Serbia", currency: "RSD", flag: "https://flagcdn.com/w40/rs.png", rate: 117.2 },
  { code: "TG", name: "Togo", currency: "XOF", flag: "https://flagcdn.com/w40/tg.png", rate: 655.95 },
  { code: "TR", name: "Turkey", currency: "TRY", flag: "https://flagcdn.com/w40/tr.png", rate: 34.5 },
  { code: "UA", name: "Ukraine", currency: "UAH", flag: "https://flagcdn.com/w40/ua.png", rate: 44.2 },
];

export default function Preview() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const countryCode = searchParams.get("country") || "BD";
  const amount = parseFloat(searchParams.get("amount") || "1000");
  
  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[1];
  const rate = selectedCountry.rate;
  const receiveAmount = (amount * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fee = 5.00;
  const totalToPay = amount; // Assuming 100% fee discount for demo

  return (
    <MobileLayout title="Review Transfer">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* Main Amount Card */}
        <Card className="bg-primary text-primary-foreground p-6 rounded-2xl border-none shadow-lg">
          <div className="text-center space-y-1">
            <p className="text-primary-foreground/80 text-sm">Recipient Gets</p>
            <h2 className="text-3xl font-bold">{receiveAmount} {selectedCountry.currency}</h2>
          </div>
        </Card>

        {/* Recipient Details */}
        <Card className="p-5 space-y-4 border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900">Recipient Details</h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Recipient Name</p>
              <p className="font-bold text-lg text-gray-900">Mofizur Rahman</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bank Name</p>
                <p className="font-semibold text-gray-900">Dutch-Bangla Bank</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Delivery Method</p>
                <p className="font-semibold text-gray-900">Bank Deposit</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Account Number</p>
                <p className="font-semibold text-gray-900">1234567890123</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Country</p>
                <div className="flex items-center gap-2">
                  <img src={selectedCountry.flag} alt={selectedCountry.name} className="w-4 h-3 rounded-sm object-cover" />
                  <p className="font-semibold text-gray-900">{selectedCountry.name}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Details List */}
        <Card className="p-5 space-y-4 border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900">Transfer Details</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">You Send</span>
              <span className="font-medium">€ {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Exchange Rate</span>
              <span className="font-medium text-primary">1 EUR = {rate} {selectedCountry.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Transfer Fee</span>
              <span className="font-medium text-secondary">€ {fee.toFixed(2)}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-gray-500">Discount (100%)</span>
              <span className="font-medium text-secondary">-€ {fee.toFixed(2)}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center pt-1">
              <span className="font-semibold text-gray-900">Total to Pay</span>
              <span className="text-xl font-bold text-primary">€ {totalToPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="p-4 flex items-center justify-between border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
               <p className="font-bold text-gray-900 text-sm">MyPCS Wallet</p>
               <p className="text-[10px] text-gray-400 font-medium">Payment will be deducted from your app wallet</p>
            </div>
          </div>
        </Card>

        <div className="bg-blue-50 p-3 rounded-xl flex gap-3 items-start">
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
