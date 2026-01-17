import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Landmark, Wallet, User, Hash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddRecipient() {
  const [, setLocation] = useLocation();

  return (
    <MobileLayout title="Add Recipient">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent -ml-1 text-gray-500" onClick={() => setLocation("/select-recipient")}>
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
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Recipient Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Enter full name" className="pl-11 h-12 border-none bg-white rounded-xl font-semibold shadow-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bank Name</Label>
                <Select>
                  <SelectTrigger className="h-12 border-none bg-white rounded-xl font-semibold shadow-sm focus:ring-0">
                    <SelectValue placeholder="Select Bank" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="chase">Chase Bank</SelectItem>
                    <SelectItem value="bofa">Bank of America</SelectItem>
                    <SelectItem value="hsbc">HSBC</SelectItem>
                    <SelectItem value="revolut">Revolut</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Account Number / IBAN</Label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Enter account details" className="pl-11 h-12 border-none bg-white rounded-xl font-semibold shadow-sm" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="mt-6 space-y-5">
             <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Recipient Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Enter full name" className="pl-11 h-12 border-none bg-white rounded-xl font-semibold shadow-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Wallet Provider</Label>
                <Select>
                  <SelectTrigger className="h-12 border-none bg-white rounded-xl font-semibold shadow-sm focus:ring-0">
                    <SelectValue placeholder="Select Wallet" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="mypcs">MyPCS Wallet</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="skrill">Skrill</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Wallet ID / Phone Number</Label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Enter wallet ID" className="pl-11 h-12 border-none bg-white rounded-xl font-semibold shadow-sm" />
                </div>
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
