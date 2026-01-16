import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Search, Plus, User, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Recipients() {
  const [, setLocation] = useLocation();

  const recipients = [
    { id: 1, name: "Maria Garcia", account: "**** 1234", bank: "Chase Bank", initials: "MG", color: "bg-blue-100 text-blue-700" },
    { id: 2, name: "Jean Pierre", account: "**** 5678", bank: "BNP Paribas", initials: "JP", color: "bg-green-100 text-green-700" },
    { id: 3, name: "Liam Wilson", account: "**** 9012", bank: "Barclays", initials: "LW", color: "bg-purple-100 text-purple-700" },
    { id: 4, name: "Sofia Rossi", account: "**** 3456", bank: "Intesa Sanpaolo", initials: "SR", color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <MobileLayout title="Select Recipient">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search name, email, or account" className="pl-9 bg-white border-none shadow-sm h-12 rounded-xl" />
        </div>

        {/* New Recipient */}
        <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-dashed border-gray-300 hover:bg-gray-50 transition-colors text-left group">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Add New Recipient</h3>
            <p className="text-sm text-gray-500">Send to someone new</p>
          </div>
        </button>

        {/* Recipient List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Recent Recipients</h3>
          
          <div className="space-y-2">
            {recipients.map((recipient) => (
              <div 
                key={recipient.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-50 shadow-sm hover:border-primary/50 cursor-pointer transition-all active:scale-[0.98] group"
              >
                <div onClick={() => setLocation("/source")} className="flex flex-1 items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarFallback className={recipient.color}>{recipient.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{recipient.name}</h4>
                    <p className="text-xs text-gray-500">{recipient.bank} • {recipient.account}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation(`/transactions`);
                  }}
                  className="h-10 w-10 rounded-full flex items-center justify-center text-gray-300 hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MobileLayout>
  );
}
