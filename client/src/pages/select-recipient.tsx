import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Search, UserPlus2, ChevronRight, User2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function SelectRecipient() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const countryFilter = searchParams.get("country");
  const methodFilter = searchParams.get("method");

  const recipients = [
    { id: 1, name: "Maria Garcia", account: "08012345678", bank: "Opay", initials: "MG", color: "bg-blue-100 text-blue-700", country: "NG", method: "wallet", methodLabel: "Opay" },
    { id: 2, name: "Jean Pierre", account: "**** 5678", bank: "UBA Nigeria", initials: "JP", color: "bg-green-100 text-green-700", country: "NG", method: "bank", methodLabel: "Bank Deposit" },
    { id: 3, name: "Liam Wilson", account: "**** 9012", bank: "Ecobank Ghana", initials: "LW", color: "bg-purple-100 text-purple-700", country: "GH", method: "bank", methodLabel: "Bank Deposit" },
    { id: 4, name: "Sofia Rossi", account: "0912345678", bank: "MoMo Ghana", initials: "SR", color: "bg-orange-100 text-orange-700", country: "GH", method: "wallet", methodLabel: "MTN MoMo" },
    { id: 5, name: "Amadou Diallo", account: "077889900", bank: "Orange Money", initials: "AD", color: "bg-yellow-100 text-yellow-700", country: "SN", method: "wallet", methodLabel: "Orange Money" },
    { id: 6, name: "Fatima Zahra", account: "**** 2233", bank: "Attijariwafa Bank", initials: "FZ", color: "bg-red-100 text-red-700", country: "MA", method: "bank", methodLabel: "Bank Deposit" },
    { id: 7, name: "Kofi Mensah", account: "055443322", bank: "Wave", initials: "KM", color: "bg-blue-100 text-blue-700", country: "SN", method: "wallet", methodLabel: "Wave" },
    { id: 8, name: "Suresh Kumar", account: "**** 6677", bank: "State Bank of India", initials: "SK", color: "bg-indigo-100 text-indigo-700", country: "IN", method: "bank", methodLabel: "Bank Deposit" },
    { id: 9, name: "Binh Nguyen", account: "0988776655", bank: "Momo VN", initials: "BN", color: "bg-emerald-100 text-emerald-700", country: "VN", method: "wallet", methodLabel: "MoMo" },
    { id: 10, name: "Ricardo Silva", account: "**** 1122", bank: "Itaú Unibanco", initials: "RS", color: "bg-orange-100 text-orange-700", country: "BR", method: "bank", methodLabel: "Bank Deposit" },
    { id: 11, name: "Rahat Ahmed", account: "01712345678", bank: "bKash", initials: "RA", color: "bg-pink-100 text-pink-700", country: "BD", method: "wallet", methodLabel: "bKash" },
    { id: 12, name: "Nusrat Jahan", account: "01887654321", bank: "Nagad", initials: "NJ", color: "bg-orange-100 text-orange-700", country: "BD", method: "wallet", methodLabel: "Nagad" },
    { id: 13, name: "Mofizur Rahman", account: "**** 4455", bank: "Dutch-Bangla Bank", initials: "MR", color: "bg-blue-100 text-blue-700", country: "BD", method: "bank", methodLabel: "Bank Deposit" },
    { id: 14, name: "Alpha Diallo", account: "066123456", bank: "Orange Money", initials: "AD", color: "bg-orange-100 text-orange-700", country: "CI", method: "wallet", methodLabel: "Orange Money" },
    { id: 15, name: "Jean Kouassi", account: "**** 9900", bank: "Société Générale", initials: "JK", color: "bg-blue-100 text-blue-700", country: "CI", method: "bank", methodLabel: "Bank Deposit" },
    { id: 16, name: "Kamran Akmal", account: "03001234567", bank: "JazzCash", initials: "KA", color: "bg-yellow-100 text-yellow-700", country: "PK", method: "wallet", methodLabel: "JazzCash" },
    { id: 17, name: "Sajid Khan", account: "**** 7766", bank: "Habib Bank", initials: "SK", color: "bg-green-100 text-green-700", country: "PK", method: "bank", methodLabel: "Bank Deposit" },
    { id: 18, name: "M-Pesa User", account: "0712345678", bank: "Safaricom", initials: "MP", color: "bg-green-100 text-green-700", country: "KE", method: "wallet", methodLabel: "M-Pesa" },
  ];

  const filteredRecipients = recipients.filter(r => {
    if (countryFilter && r.country !== countryFilter) return false;
    if (methodFilter && r.method !== methodFilter) return false;
    return true;
  });

  // If we have filters but no matching recipients, we should prioritize the filtered view
  // If we have no filters at all (e.g. from general menu), we show all
  const isFiltered = !!(countryFilter && methodFilter);

  return (
    <MobileLayout title="Select Recipient">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search name, email, or account" className="pl-9 bg-white border-none shadow-sm h-12 rounded-xl" />
        </div>

        {/* New Recipient */}
        <button 
          onClick={() => setLocation(`/add-recipient?country=${countryFilter || ''}&method=${methodFilter || 'bank'}`)}
          className="w-full flex items-center gap-4 p-4 rounded-xl border border-dashed border-gray-300 hover:bg-gray-50 transition-colors text-left group"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <UserPlus2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Add New Recipient</h3>
            <p className="text-sm text-gray-500">Send to someone new</p>
          </div>
        </button>

        {/* Recipient List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {isFiltered ? (filteredRecipients.length > 0 ? "Available Recipients" : "No Recipients Found") : "Recent Recipients"}
            </h3>
            {isFiltered && (
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                {countryFilter} • {methodFilter === 'bank' ? 'Bank Deposit' : 'Mobile Wallet'}
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            {isFiltered ? (
              filteredRecipients.length > 0 ? (
                filteredRecipients.map((recipient) => (
                  <div 
                    key={recipient.id}
                    onClick={() => setLocation(`/source?country=${countryFilter || ''}&amount=${searchParams.get('amount') || ''}`)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-50 shadow-sm hover:border-primary/50 cursor-pointer transition-all active:scale-[0.98] group"
                  >
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarFallback className={recipient.color}>{recipient.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{recipient.name}</h4>
                      <p className="text-xs text-gray-500">{recipient.bank} • {recipient.methodLabel}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{recipient.account}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-3 bg-white rounded-2xl border border-dashed border-gray-200">
                  <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <User2 className="h-6 w-6 text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">No matching recipients</p>
                    <p className="text-xs text-gray-500 px-6 mt-1">
                      We couldn't find any recipients for {countryFilter} via {methodFilter === 'bank' ? 'Bank Deposit' : 'Mobile Wallet'}.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full text-xs font-bold border-gray-200"
                    onClick={() => setLocation(`/add-recipient?country=${countryFilter || ''}&method=${methodFilter || 'bank'}`)}
                  >
                    <UserPlus2 className="h-3 w-3 mr-1" /> Add New
                  </Button>
                </div>
              )
            ) : (
              recipients.map((recipient) => (
                <div 
                  key={recipient.id}
                  onClick={() => setLocation(`/source?country=${countryFilter || ''}&amount=${searchParams.get('amount') || ''}`)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-50 shadow-sm hover:border-primary/50 cursor-pointer transition-all active:scale-[0.98] group"
                >
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarFallback className={recipient.color}>{recipient.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{recipient.name}</h4>
                    <p className="text-xs text-gray-500">{recipient.bank} • {recipient.methodLabel}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{recipient.account}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </MobileLayout>
  );
}
