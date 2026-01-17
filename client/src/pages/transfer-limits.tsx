import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Info, Landmark, Smartphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TransferLimits() {
  const [, setLocation] = useLocation();

  const usageStats = [
    {
      label: "Daily Limit",
      amount: { sent: 1200, pending: 300, total: 10000 },
      count: { sent: 2, pending: 1, total: 10 },
    },
    {
      label: "Monthly Limit",
      amount: { sent: 4500, pending: 500, total: 50000 },
      count: { sent: 8, pending: 2, total: 50 },
    },
    {
      label: "Yearly Limit",
      amount: { sent: 12500, pending: 500, total: 100000 },
      count: { sent: 24, pending: 2, total: 200 },
    },
  ];

  return (
    <MobileLayout title="Transfer Limits">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent -ml-1 text-gray-500" onClick={() => setLocation("/profile")}>
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>

        <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start border border-blue-100">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-normal">
            Your transfer limits are determined by your account level and verification status. 
            Limits apply to both bank transfers and wallet transactions.
          </p>
        </div>

        <Tabs defaultValue="usage" className="w-full">
          <TabsList className="w-full grid grid-cols-2 p-1 bg-gray-100 rounded-xl h-12">
            <TabsTrigger value="usage" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Current Usage</TabsTrigger>
            <TabsTrigger value="limits" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Allowances</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="mt-6 space-y-6">
            {usageStats.map((stat, idx) => (
              <Card key={idx} className="p-5 border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">{stat.label}</h3>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">Level 1</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Amount Used</span>
                    <span className="font-bold text-gray-900">€ {stat.amount.sent + stat.amount.pending} / € {stat.amount.total}</span>
                  </div>
                  <Progress value={((stat.amount.sent + stat.amount.pending) / stat.amount.total) * 100} className="h-2" />
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="text-center">
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Sent</p>
                      <p className="text-xs font-semibold">€ {stat.amount.sent}</p>
                    </div>
                    <div className="text-center border-x border-gray-100">
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Pending</p>
                      <p className="text-xs font-semibold text-amber-600">€ {stat.amount.pending}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Remaining</p>
                      <p className="text-xs font-semibold text-primary">€ {stat.amount.total - (stat.amount.sent + stat.amount.pending)}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                   <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Transfer Count</span>
                    <span className="font-bold text-gray-900">{stat.count.sent + stat.count.pending} / {stat.count.total}</span>
                  </div>
                  <Progress value={((stat.count.sent + stat.count.pending) / stat.count.total) * 100} className="h-1.5" />
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="limits" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-1">Sender Limits</h3>
              <Card className="p-5 border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                    <Info className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-gray-900">Your Account Limits</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Single Transfer", value: "10,000 EUR" },
                    { label: "Daily Limit", value: "10,000 EUR" },
                    { label: "Monthly Limit", value: "50,000 EUR" },
                    { label: "Yearly Limit", value: "100,000 EUR" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500">{item.label}</span>
                      <span className="text-sm font-bold text-secondary">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-1">Recipient Limits</h3>
              <div className="grid gap-4">
                {[
                  { country: "Bangladesh", code: "BD", methods: ["Bank Deposit", "Mobile Wallet"], bankLimit: "250,000 BDT", walletLimit: "100,000 BDT" },
                  { country: "Nigeria", code: "NG", methods: ["Bank Deposit"], bankLimit: "1,000,000 NGN" },
                  { country: "Senegal", code: "SN", methods: ["Bank Deposit", "Mobile Wallet"], bankLimit: "1,000,000 XOF", walletLimit: "500,000 XOF" },
                  { country: "Morocco", code: "MA", methods: ["Bank Deposit"], bankLimit: "50,000 MAD" },
                ].map((item, idx) => (
                  <Card key={idx} className="p-5 border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={`https://flagcdn.com/w40/${item.code.toLowerCase()}.png`} className="w-6 h-6 rounded-full object-cover" alt={item.country} />
                        <h3 className="font-bold text-gray-900">{item.country}</h3>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{item.code}</span>
                    </div>
                    
                    <div className="space-y-3">
                      {item.methods.map((method, mIdx) => (
                        <div key={mIdx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                          <div className="flex items-center gap-2">
                            {method.includes("Bank") ? <Landmark className="h-3 w-3 text-primary" /> : <Smartphone className="h-3 w-3 text-secondary" />}
                            <span className="text-xs text-gray-500">{method}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            {method.includes("Bank") ? item.bankLimit : item.walletLimit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}
