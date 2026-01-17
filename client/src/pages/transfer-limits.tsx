import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Info, Landmark, Wallet } from "lucide-react";
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
            {[
              { title: "General Limits", icon: Info },
              { title: "Bank Transfer Limits", icon: Landmark },
              { title: "Wallet Transfer Limits", icon: Wallet }
            ].map((section, idx) => (
              <Card key={idx} className="p-5 border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                    <section.icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-gray-900">{section.title}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-1 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Single Transfer</span>
                    <span className="text-sm font-bold">10,000 EUR</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Daily Limit</span>
                    <span className="text-sm font-bold">10,000 EUR</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Monthly Limit</span>
                    <span className="text-sm font-bold">50,000 EUR</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-500">Yearly Limit</span>
                    <span className="text-sm font-bold">100,000 EUR</span>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}
