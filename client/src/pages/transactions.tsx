import MobileLayout from "@/components/layout/MobileLayout";
import { CheckCircle2, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Transactions() {
  const transactions = [
    { id: 1, recipient: "Maria Garcia", amount: "€ 950.00", date: "Jan 16, 2026", status: "Completed", type: "Bank Deposit" },
    { id: 2, recipient: "Jean Pierre", amount: "€ 1,200.00", date: "Jan 12, 2026", status: "Processing", type: "Wallet" },
    { id: 3, recipient: "Liam Wilson", amount: "€ 450.00", date: "Dec 28, 2025", status: "Completed", type: "Bank Deposit" },
    { id: 4, recipient: "Sofia Rossi", amount: "€ 2,100.00", date: "Dec 15, 2025", status: "Completed", type: "Wallet" },
  ];

  return (
    <MobileLayout title="Activity">
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search transfers" className="pl-9 bg-white border-none shadow-sm h-12 rounded-xl" />
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Recent Transfers</h3>
          
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div 
                key={tx.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-50 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
                  tx.status === 'Processing' ? 'bg-orange-50 text-orange-500' : 'bg-secondary/10 text-secondary'
                }`}>
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="font-bold text-gray-900 truncate">{tx.recipient}</h4>
                    <span className="font-bold text-gray-900">{tx.amount}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400">{tx.date} • {tx.type}</span>
                    <span className={`px-2 py-0.5 rounded-full font-medium ${
                      tx.status === 'Processing' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
