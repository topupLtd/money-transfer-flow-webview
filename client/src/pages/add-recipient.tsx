import { useState } from "react";
import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Landmark, Wallet, User, Phone, MapPin, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BottomSheetSelect } from "@/components/ui/bottom-sheet-select";

const COUNTRY_PROVIDERS = {
  AO: {
    wallets: ["Unitel Money", "Afrimoney"],
    banks: ["BAI", "BFA", "Banco BIC", "Standard Bank Angola"]
  },
  BD: {
    wallets: ["bKash", "Nagad", "Rocket", "Upay"],
    banks: ["Dutch-Bangla Bank", "Sonali Bank", "BRAC Bank", "City Bank", "Islami Bank"]
  },
  BJ: {
    wallets: ["MTN Money", "Moov Money"],
    banks: ["Ecobank Benin", "BOA Benin", "NSIA Banque"]
  },
  BR: {
    wallets: ["Pix", "PicPay", "Mercado Pago"],
    banks: ["Itaú Unibanco", "Banco do Brasil", "Bradesco", "Santander Brasil"]
  },
  BF: {
    wallets: ["Orange Money", "Moov Money"],
    banks: ["Ecobank Burkina", "BOA Burkina", "Coris Bank"]
  },
  CM: {
    wallets: ["MTN Mobile Money", "Orange Money"],
    banks: ["Afriland First Bank", "Société Générale Cameroun", "Ecobank Cameroon"]
  },
  TD: {
    wallets: ["Moov Money", "Airtel Money"],
    banks: ["Ecobank Chad", "BCC", "CBT"]
  },
  CN: {
    wallets: ["Alipay", "WeChat Pay"],
    banks: ["ICBC", "China Construction Bank", "Bank of China", "Agricultural Bank of China"]
  },
  CO: {
    wallets: ["Nequi", "DaviPlata"],
    banks: ["Bancolombia", "Banco de Bogotá", "Davivienda"]
  },
  CG: {
    wallets: ["MTN Mobile Money", "Airtel Money"],
    banks: ["Ecobank Congo", "BGFI Bank", "BSCA Bank"]
  },
  CD: {
    wallets: ["M-Pesa", "Airtel Money", "Orange Money"],
    banks: ["Rawbank", "Equity BCDC", "TMB"]
  },
  CI: {
    wallets: ["Orange Money", "MTN Money", "Moov Money", "Wave"],
    banks: ["SGCI", "Ecobank Côte d'Ivoire", "NSIA Banque", "BACCI"]
  },
  DO: {
    wallets: ["m-peso"],
    banks: ["Banco Popular", "Banreservas", "Banco BHD León"]
  },
  EG: {
    wallets: ["Vodafone Cash", "Etisalat Cash", "Fawry"],
    banks: ["National Bank of Egypt", "Banque Misr", "CIB", "QNB Alahli"]
  },
  GA: {
    wallets: ["Airtel Money", "Moov Money"],
    banks: ["BGFIBank", "Ecobank Gabon", "UGB"]
  },
  GM: {
    wallets: ["QMoney", "AfriMoney"],
    banks: ["Ecobank Gambia", "Standard Chartered Gambia", "GTBank Gambia"]
  },
  GH: {
    wallets: ["MTN MoMo", "Telecel Cash", "AirtelTigo Money"],
    banks: ["GCB Bank", "Ecobank Ghana", "Stanbic Bank", "Absa Bank", "Zenith Bank Ghana"]
  },
  GN: {
    wallets: ["Orange Money", "MTN Mobile Money"],
    banks: ["Ecobank Guinea", "Société Générale Guinée", "Bicigui"]
  },
  HT: {
    wallets: ["MonCash", "Natcash"],
    banks: ["Sogebank", "Unibank", "BNC"]
  },
  IN: {
    wallets: ["Paytm", "PhonePe", "Google Pay (UPI)"],
    banks: ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank"]
  },
  MG: {
    wallets: ["Mvola", "Orange Money", "Airtel Money"],
    banks: ["BMOI", "BNI Madagascar", "Bank of Africa Madagascar"]
  },
  ML: {
    wallets: ["Orange Money", "Moov Money"],
    banks: ["BDM-SA", "BMS-SA", "Ecobank Mali"]
  },
  MR: {
    wallets: ["Bankily", "Masrivi"],
    banks: ["BMCI", "BNM", "Société Générale Mauritanie"]
  },
  MD: {
    wallets: ["Bpay", "RunPay"],
    banks: ["maib", "Moldindconbank", "Victoriabank"]
  },
  MA: {
    wallets: ["Wafacash", "Maroc Telecom Cash"],
    banks: ["Attijariwafa Bank", "Banque Populaire", "BMCE Bank"]
  },
  NE: {
    wallets: ["Airtel Money", "Moov Money"],
    banks: ["SONIBANK", "Ecobank Niger", "BIA Niger"]
  },
  NG: {
    wallets: ["Opay", "PalmPay", "Paga", "Moniepoint"],
    banks: ["Access Bank", "Zenith Bank", "GTBank", "First Bank", "UBA", "Stanbic IBTC"]
  },
  PK: {
    wallets: ["JazzCash", "EasyPaisa", "SadaPay", "NayaPay"],
    banks: ["Habib Bank", "National Bank of Pakistan", "United Bank", "MCB Bank", "Meezan Bank"]
  },
  PH: {
    wallets: ["GCash", "Maya"],
    banks: ["BDO Unibank", "BPI", "Metrobank", "Land Bank"]
  },
  SN: {
    wallets: ["Wave", "Orange Money", "Free Money", "E-Money"],
    banks: ["CBAO", "SGBS", "Ecobank Senegal", "BIMA", "Banque de l'Habitat"]
  },
  RS: {
    wallets: ["iPay", "m-plati"],
    banks: ["Banca Intesa", "OTP Banka", "NLB Komercijalna Banka"]
  },
  TG: {
    wallets: ["T-Money", "Flooz"],
    banks: ["Ecobank Togo", "Orabank Togo", "UTB"]
  },
  TR: {
    wallets: ["Papara", "Param"],
    banks: ["Ziraat Bankası", "İş Bankası", "Garanti BBVA", "Akbank"]
  },
  UA: {
    wallets: ["Privat24", "Monobank"],
    banks: ["PrivatBank", "Oschadbank", "Raiffeisen Bank"]
  }
};

const RELATIONSHIPS = ["Family", "Friend", "Business", "Other"];

export default function AddRecipient() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const countries = [
    { code: "AO", name: "Angola", currency: "AOA", flag: "https://flagcdn.com/w40/ao.png", dialCode: "+244" },
    { code: "BD", name: "Bangladesh", currency: "BDT", flag: "https://flagcdn.com/w40/bd.png", dialCode: "+880" },
    { code: "BJ", name: "Benin", currency: "XOF", flag: "https://flagcdn.com/w40/bj.png", dialCode: "+229" },
    { code: "BR", name: "Brazil", currency: "BRL", flag: "https://flagcdn.com/w40/br.png", dialCode: "+55" },
    { code: "BF", name: "Burkina Faso", currency: "XOF", flag: "https://flagcdn.com/w40/bf.png", dialCode: "+226" },
    { code: "CM", name: "Cameroon", currency: "XAF", flag: "https://flagcdn.com/w40/cm.png", dialCode: "+237" },
    { code: "TD", name: "Chad", currency: "XAF", flag: "https://flagcdn.com/w40/td.png", dialCode: "+235" },
    { code: "CN", name: "China", currency: "CNY", flag: "https://flagcdn.com/w40/cn.png", dialCode: "+86" },
    { code: "CO", name: "Colombia", currency: "COP", flag: "https://flagcdn.com/w40/co.png", dialCode: "+57" },
    { code: "CG", name: "Congo", currency: "XAF", flag: "https://flagcdn.com/w40/cg.png", dialCode: "+242" },
    { code: "CD", name: "Congo (DRC)", currency: "CDF", flag: "https://flagcdn.com/w40/cd.png", dialCode: "+243" },
    { code: "CI", name: "Côte d'Ivoire", currency: "XOF", flag: "https://flagcdn.com/w40/ci.png", dialCode: "+225" },
    { code: "DO", name: "Dominican Republic", currency: "DOP", flag: "https://flagcdn.com/w40/do.png", dialCode: "+1" },
    { code: "EG", name: "Egypt", currency: "EGP", flag: "https://flagcdn.com/w40/eg.png", dialCode: "+20" },
    { code: "GA", name: "Gabon", currency: "XAF", flag: "https://flagcdn.com/w40/ga.png", dialCode: "+241" },
    { code: "GM", name: "Gambia", currency: "GMD", flag: "https://flagcdn.com/w40/gm.png", dialCode: "+220" },
    { code: "GH", name: "Ghana", currency: "GHS", flag: "https://flagcdn.com/w40/gh.png", dialCode: "+233" },
    { code: "GN", name: "Guinea", currency: "GNF", flag: "https://flagcdn.com/w40/gn.png", dialCode: "+224" },
    { code: "HT", name: "Haiti", currency: "HTG", flag: "https://flagcdn.com/w40/ht.png", dialCode: "+509" },
    { code: "IN", name: "India", currency: "INR", flag: "https://flagcdn.com/w40/in.png", dialCode: "+91" },
    { code: "MG", name: "Madagascar", currency: "MGA", flag: "https://flagcdn.com/w40/mg.png", dialCode: "+261" },
    { code: "ML", name: "Mali", currency: "XOF", flag: "https://flagcdn.com/w40/ml.png", dialCode: "+223" },
    { code: "MR", name: "Mauritania", currency: "MRU", flag: "https://flagcdn.com/w40/mr.png", dialCode: "+222" },
    { code: "MD", name: "Moldova", currency: "MDL", flag: "https://flagcdn.com/w40/md.png", dialCode: "+373" },
    { code: "MA", name: "Morocco", currency: "MAD", flag: "https://flagcdn.com/w40/ma.png", dialCode: "+212" },
    { code: "NE", name: "Niger", currency: "XOF", flag: "https://flagcdn.com/w40/ne.png", dialCode: "+227" },
    { code: "NG", name: "Nigeria", currency: "NGN", flag: "https://flagcdn.com/w40/ng.png", dialCode: "+234" },
    { code: "PK", name: "Pakistan", currency: "PKR", flag: "https://flagcdn.com/w40/pk.png", dialCode: "+92" },
    { code: "PH", name: "Philippines", currency: "PHP", flag: "https://flagcdn.com/w40/ph.png", dialCode: "+63" },
    { code: "SN", name: "Senegal", currency: "XOF", flag: "https://flagcdn.com/w40/sn.png", dialCode: "+221" },
    { code: "RS", name: "Serbia", currency: "RSD", flag: "https://flagcdn.com/w40/rs.png", dialCode: "+381" },
    { code: "TG", name: "Togo", currency: "XOF", flag: "https://flagcdn.com/w40/tg.png", dialCode: "+228" },
    { code: "TR", name: "Turkey", currency: "TRY", flag: "https://flagcdn.com/w40/tr.png", dialCode: "+90" },
    { code: "UA", name: "Ukraine", currency: "UAH", flag: "https://flagcdn.com/w40/ua.png", dialCode: "+380" },
  ];

  const selectedCountry = searchParams.get("country") || "NG";
  const selectedMethod = searchParams.get("method") || "bank";
  const providers = COUNTRY_PROVIDERS[selectedCountry as keyof typeof COUNTRY_PROVIDERS] || {
    wallets: ["Orange Money", "MTN MoMo", "Wave"],
    banks: ["Ecobank", "Standard Chartered", "United Bank for Africa", "Barclays", "Société Générale", "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank"]
  };

  const currentCountry = countries.find(c => c.code === selectedCountry) || countries[0];
  const isIndia = selectedCountry === "IN";

  return (
    <MobileLayout title="Add Recipient" onBack={() => window.history.back()}>
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
        <div className="w-full h-12 bg-gray-100 rounded-xl px-4 flex items-center gap-3">
          <img src={currentCountry.flag} className="w-5 h-5 rounded-full object-cover" alt={currentCountry.name} />
          <span className="text-sm font-bold text-secondary">{currentCountry.name} ({currentCountry.currency})</span>
        </div>

        <Tabs defaultValue={selectedMethod} className="w-full">
          <TabsList className="w-full grid grid-cols-2 p-1 bg-gray-100 rounded-xl h-12">
            <TabsTrigger 
              value="bank" 
              disabled={selectedMethod === "wallet"}
              className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Landmark className="h-4 w-4" /> Bank
            </TabsTrigger>
            <TabsTrigger 
              value="wallet" 
              disabled={selectedMethod === "bank"}
              className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wallet className="h-4 w-4" /> Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bank" className="mt-6 space-y-8">
            {/* Personal Details Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Personal Details</h3>
              </div>
              
              <div className="space-y-4 px-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</Label>
                    <Input placeholder="John" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</Label>
                    <Input placeholder="Doe" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
                  </div>
                </div>

                {isIndia && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date of Birth</Label>
                    <Input type="date" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Relationship</Label>
                  <Select>
                    <SelectTrigger className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus:ring-1 focus:ring-primary/20">
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
                  <div className="flex gap-2">
                    <Select defaultValue={currentCountry.dialCode} disabled>
                      <SelectTrigger className="w-24 h-12 border-none bg-gray-100 rounded-xl font-semibold focus:ring-1 focus:ring-primary/20 opacity-70 cursor-not-allowed">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {countries.map(c => (
                          <SelectItem key={c.code} value={c.dialCode}>
                            <div className="flex items-center gap-2">
                              <img src={c.flag} className="w-4 h-3 object-cover rounded-sm" alt="" />
                              <span>{c.dialCode}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input placeholder="123456789" className="flex-1 h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Address Details</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input placeholder="State" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="City" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Input placeholder="Zip Code" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Full Address" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Landmark className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Bank Details</h3>
              </div>
              
              <div className="space-y-4 px-1">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bank Name</Label>
                  <Select>
                    <SelectTrigger className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus:ring-1 focus:ring-primary/20">
                      <SelectValue placeholder="Select Bank" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {providers.banks.map(bank => (
                        <SelectItem key={bank} value={bank.toLowerCase()}>{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isIndia && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">IFSC Code</Label>
                    <Input placeholder="SBIN0001234" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    {isIndia ? "Account Number" : "Account Number / IBAN"}
                  </Label>
                  <Input placeholder="Enter account details" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="mt-6 space-y-8">
             <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <User className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Personal Details</h3>
                </div>
                
                <div className="space-y-4 px-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</Label>
                      <Input placeholder="John" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</Label>
                      <Input placeholder="Doe" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Relationship</Label>
                    <Select>
                      <SelectTrigger className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus:ring-1 focus:ring-primary/20">
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
             </div>

             <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <Wallet className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Wallet Details</h3>
                </div>

                <div className="space-y-4 px-1">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Wallet Provider</Label>
                    <Select>
                      <SelectTrigger className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus:ring-1 focus:ring-primary/20">
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
                    <div className="flex gap-2">
                      <Select defaultValue={currentCountry.dialCode} disabled>
                        <SelectTrigger className="w-24 h-12 border-none bg-gray-100 rounded-xl font-semibold focus:ring-1 focus:ring-primary/20 opacity-70 cursor-not-allowed">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {countries.map(c => (
                            <SelectItem key={c.code} value={c.dialCode}>
                              <div className="flex items-center gap-2">
                                <img src={c.flag} className="w-4 h-3 object-cover rounded-sm" alt="" />
                                <span>{c.dialCode}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input placeholder="123456789" className="flex-1 h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
                    </div>
                  </div>
                </div>
             </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4">
          <Button 
            className="w-full h-12 rounded-xl font-bold shadow-md bg-primary hover:bg-primary/90" 
            onClick={() => setLocation(`/select-recipient?country=${selectedCountry}&method=${selectedMethod}`)}
          >
            Save Recipient
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
