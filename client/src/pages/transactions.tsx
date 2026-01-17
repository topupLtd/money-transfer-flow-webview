import MobileLayout from "@/components/layout/MobileLayout";
import { CheckCircle2, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

export const MOCK_TRANSACTIONS = [
  { 
    id: 1, 
    recipient: "Maria Garcia", 
    amount: "€ 1,000.00", 
    recipientGets: "450,000 NGN",
    date: "Jan 16, 2026", 
    status: "Completed", 
    type: "Bank Deposit",
    country: "Nigeria",
    currency: "NGN",
    fee: "Free",
    discount: "-€ 5.00",
    total: "€ 995.00",
    rate: "1 EUR = 450 NGN",
    bank: "Zenith Bank",
    account: "**** 1234",
    source: "MyPCS Wallet",
    fundSource: "Savings",
    reason: "Family Support"
  },
  { 
    id: 2, 
    recipient: "Jean Pierre", 
    amount: "€ 1,200.00", 
    recipientGets: "780,000 XAF",
    date: "Jan 12, 2026", 
    status: "Processing", 
    type: "Mobile Wallet",
    country: "Cameroon",
    currency: "XAF",
    fee: "€ 2.50",
    discount: "€ 0.00",
    total: "€ 1,202.50",
    rate: "1 EUR = 650 XAF",
    bank: "Orange Money",
    account: "+237 678901234",
    source: "MyPCS Wallet",
    fundSource: "Salary",
    reason: "Education"
  },
  { 
    id: 3, 
    recipient: "Liam Wilson", 
    amount: "€ 450.00", 
    recipientGets: "5,400 GHS",
    date: "Dec 28, 2025", 
    status: "Completed", 
    type: "Bank Deposit",
    country: "Ghana",
    currency: "GHS",
    fee: "Free",
    discount: "€ 0.00",
    total: "€ 450.00",
    rate: "1 EUR = 12 GHS",
    bank: "Ecobank Ghana",
    account: "**** 9012",
    source: "MyPCS Wallet",
    fundSource: "Gift",
    reason: "Medical Expenses"
  },
  { 
    id: 4, 
    recipient: "Sofia Rossi", 
    amount: "€ 2,100.00", 
    recipientGets: "11,500 BRL",
    date: "Dec 15, 2025", 
    status: "Completed", 
    type: "Mobile Wallet",
    country: "Brazil",
    currency: "BRL",
    fee: "€ 5.00",
    discount: "-€ 10.00",
    total: "€ 2,095.00",
    rate: "1 EUR = 5.47 BRL",
    bank: "PicPay",
    account: "sofia.rossi@pix.br",
    source: "MyPCS Wallet",
    fundSource: "Savings",
    reason: "Investment"
  },
];

export default function Transactions() {
  const [, setLocation] = useLocation();

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
            {MOCK_TRANSACTIONS.map((tx) => (
              <div 
                key={tx.id}
                onClick={() => setLocation(`/transactions/${tx.id}`)}
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
                    <span className="text-gray-400">{tx.date} • {tx.type} ({tx.country})</span>
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
