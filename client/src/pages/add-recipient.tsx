import { useState } from "react";
import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Landmark, Wallet, User, Phone, MapPin, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COUNTRY_PROVIDERS = {
  BD: {
    wallets: ["bKash", "Nagad", "Rocket", "Upay"],
    banks: ["Dutch-Bangla Bank", "Sonali Bank", "BRAC Bank", "City Bank", "Islami Bank"]
  },
  NG: {
    wallets: ["Opay", "PalmPay", "Paga"],
    banks: ["Access Bank", "Zenith Bank", "GTBank", "First Bank", "UBA"]
  },
  GH: {
    wallets: ["MTN MoMo", "Telecel Cash", "AirtelTigo Money"],
    banks: ["GCB Bank", "Ecobank Ghana", "Stanbic Bank", "Absa Bank"]
  },
  SN: {
    wallets: ["Wave", "Orange Money", "Free Money"],
    banks: ["CBAO", "SGBS", "Ecobank Senegal", "BIMA"]
  },
  PK: {
    wallets: ["JazzCash", "EasyPaisa", "SadaPay"],
    banks: ["Habib Bank", "National Bank of Pakistan", "United Bank", "MCB Bank"]
  }
};

const RELATIONSHIPS = ["Family", "Friend", "Business", "Other"];

export default function AddRecipient() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const selectedCountry = searchParams.get("country") || "BD";
  const providers = COUNTRY_PROVIDERS[selectedCountry as keyof typeof COUNTRY_PROVIDERS] || {
    wallets: ["Orange Money", "MTN MoMo", "Wave"],
    banks: ["Ecobank", "Standard Chartered", "United Bank for Africa", "Barclays", "Société Générale"]
  };

  return (
    <MobileLayout title="Add Recipient">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent -ml-1 text-gray-500" onClick={() => window.history.back()}>
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>

        <Tabs defaultValue="bank" className="w-full">
          <TabsList className="w-full grid grid-cols-2 p-1 bg-gray-100 rounded-xl h-12">
            <TabsTrigger value="bank" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
              <Landmark className="h-4 w-4" /> Bank
            </TabsTrigger>
            <TabsTrigger value="wallet" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
              <Wallet className="h-4 w-4" /> Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bank" className="mt-6 space-y-5">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</Label>
                  <Input placeholder="John" className="h-12 border-none bg-white rounded-xl font-semibold shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</Label>
                  <Input placeholder="Doe" className="h-12 border-none bg-white rounded-xl font-semibold shadow-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bank Name</Label>
                <Select>
                  <SelectTrigger className="h-12 border-none bg-white rounded-xl font-semibold shadow-sm focus:ring-0">
                    <SelectValue placeholder="Select Bank" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {providers.banks.map(bank => (
                      <SelectItem key={bank} value={bank.toLowerCase()}>{bank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Account Number / IBAN</Label>
                <Input placeholder="Enter account details" className="h-12 border-none bg-white rounded-xl font-semibold shadow-sm" />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Relationship</Label>
                <Select>
                  <SelectTrigger className="h-12 border-none bg-white rounded-xl font-semibold shadow-sm focus:ring-0">
                    <SelectValue placeholder="Select Relationship" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {RELATIONSHIPS.map(rel => (
                      <SelectItem key={rel} value={rel.toLowerCase()}>{rel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="+880 1XXX-XXXXXX" className="pl-11 h-12 border-none bg-white rounded-xl font-semibold shadow-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Enter address" className="pl-11 h-12 border-none bg-white rounded-xl font-semibold shadow-sm" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="mt-6 space-y-5">
             <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</Label>
                  <Input placeholder="John" className="h-12 border-none bg-white rounded-xl font-semibold shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</Label>
                  <Input placeholder="Doe" className="h-12 border-none bg-white rounded-xl font-semibold shadow-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Wallet Provider</Label>
                <Select>
                  <SelectTrigger className="h-12 border-none bg-white rounded-xl font-semibold shadow-sm focus:ring-0">
                    <SelectValue placeholder="Select Wallet" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {providers.wallets.map(wallet => (
                      <SelectItem key={wallet} value={wallet.toLowerCase()}>{wallet}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Wallet Number / ID</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="017XX-XXXXXX" className="pl-11 h-12 border-none bg-white rounded-xl font-semibold shadow-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Relationship</Label>
                <Select>
                  <SelectTrigger className="h-12 border-none bg-white rounded-xl font-semibold shadow-sm focus:ring-0">
                    <SelectValue placeholder="Select Relationship" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {RELATIONSHIPS.map(rel => (
                      <SelectItem key={rel} value={rel.toLowerCase()}>{rel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4">
          <Button 
            className="w-full h-12 rounded-xl font-bold shadow-md bg-primary hover:bg-primary/90" 
            onClick={() => setLocation("/select-recipient")}
          >
            Save Recipient
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
