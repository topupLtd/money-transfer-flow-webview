import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Landmark, Wallet, User, Phone, MapPin, Users, ChevronDown, Trash2, Save, Plus, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COUNTRY_PROVIDERS = {
  AO: { wallets: ["Unitel Money", "Afrimoney"], banks: ["BAI", "BFA", "Banco BIC"] },
  BD: { wallets: ["bKash", "Nagad"], banks: ["Dutch-Bangla Bank", "Sonali Bank"] },
  NG: { wallets: ["Opay", "PalmPay", "Paga"], banks: ["Zenith Bank", "Access Bank", "GTBank"] },
  // ... other countries mapped similarly
};

const RELATIONSHIPS = ["Family", "Friend", "Business", "Other"];

const COUNTRIES = [
  { code: "AO", name: "Angola", currency: "AOA", flag: "https://flagcdn.com/w40/ao.png", dialCode: "+244" },
  { code: "BD", name: "Bangladesh", currency: "BDT", flag: "https://flagcdn.com/w40/bd.png", dialCode: "+880" },
  { code: "NG", name: "Nigeria", currency: "NGN", flag: "https://flagcdn.com/w40/ng.png", dialCode: "+234" },
  { code: "GH", name: "Ghana", currency: "GHS", flag: "https://flagcdn.com/w40/gh.png", dialCode: "+233" },
  { code: "IN", name: "India", currency: "INR", flag: "https://flagcdn.com/w40/in.png", dialCode: "+91" },
];

export default function RecipientDetail() {
  const [location, setLocation] = useLocation();
  const params = useParams();
  const [selectedCountryCode, setSelectedCountryCode] = useState("NG");
  
  // State for multiple accounts
  const [accounts, setAccounts] = useState([
    { id: 1, type: "bank", provider: "Zenith Bank", identifier: "08012345678" },
    { id: 2, type: "wallet", provider: "Opay", identifier: "8012345678" }
  ]);

  const currentCountry = COUNTRIES.find(c => c.code === selectedCountryCode) || COUNTRIES[0];
  const providers = COUNTRY_PROVIDERS[selectedCountryCode as keyof typeof COUNTRY_PROVIDERS] || {
    wallets: ["Orange Money", "MTN MoMo"],
    banks: ["Standard Chartered", "United Bank for Africa"]
  };

  const removeAccount = (id: number) => {
    setAccounts(accounts.filter(a => a.id !== id));
  };

  return (
    <MobileLayout title="Edit Recipient">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="p-0 h-auto hover:bg-transparent -ml-1 text-gray-500" onClick={() => setLocation("/recipients")}>
            <ChevronLeft className="h-5 w-5 mr-1" /> Back
          </Button>
          
          <div className="flex items-center gap-1">
            <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
              <SelectTrigger className="h-10 px-3 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm w-auto gap-2 focus:ring-1 focus:ring-primary/20">
                <div className="flex items-center gap-2">
                  <img src={currentCountry.flag} className="w-4 h-4 rounded-full object-cover" alt={currentCountry.name} />
                  <span className="text-xs font-bold text-secondary uppercase">{currentCountry.code}</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl max-h-80">
                {COUNTRIES.map(c => (
                  <SelectItem key={c.code} value={c.code} className="rounded-xl">
                    <div className="flex items-center gap-2">
                      <img src={c.flag} className="w-4 h-4 rounded-full object-cover" alt="" />
                      <span className="text-xs font-bold">{c.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Personal Details Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <User className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Personal Details</h3>
          </div>
          <Card className="p-5 space-y-4 border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase">First Name</Label>
                <Input defaultValue="Maria" className="h-11 border-none bg-gray-50 rounded-xl font-semibold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase">Last Name</Label>
                <Input defaultValue="Garcia" className="h-11 border-none bg-gray-50 rounded-xl font-semibold" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase">Relationship</Label>
              <Select defaultValue="family">
                <SelectTrigger className="h-11 border-none bg-gray-50 rounded-xl font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {RELATIONSHIPS.map(rel => (
                    <SelectItem key={rel} value={rel.toLowerCase()}>{rel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </section>

        {/* Delivery Accounts Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Delivery Accounts</h3>
            </div>
            <Button variant="ghost" className="h-8 px-2 text-primary font-bold text-xs gap-1 hover:bg-primary/5">
              <Plus className="h-3 w-3" /> Add New
            </Button>
          </div>

          <div className="space-y-3">
            {accounts.map((account) => (
              <Card key={account.id} className="p-4 border-gray-100 flex items-center gap-4 hover:border-primary/20 transition-all">
                <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  {account.type === "bank" ? <Landmark className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900">{account.provider}</p>
                  <p className="text-[11px] text-gray-500 font-medium truncate">{account.identifier}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-300 hover:text-red-500"
                  onClick={() => removeAccount(account.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1 h-12 rounded-xl text-red-500 border-red-100 hover:bg-red-50 gap-2">
            <Trash2 className="h-4 w-4" /> Delete Contact
          </Button>
          <Button className="flex-[2] h-12 rounded-xl font-bold gap-2 shadow-md" onClick={() => setLocation("/recipients")}>
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
