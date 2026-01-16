import { useLocation, useParams } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function RecipientDetail() {
  const [, setLocation] = useLocation();
  const params = useParams();

  // Mock data
  const recipient = {
    id: params.id,
    name: "Maria Garcia",
    initials: "MG",
    bank: "Chase Bank",
    account: "4582991022",
    routing: "021000021",
    currency: "EUR",
    color: "bg-blue-100 text-blue-700"
  };

  return (
    <MobileLayout title="Recipient Details">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent -ml-1 text-gray-500" onClick={() => setLocation("/recipients")}>
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>

        <div className="flex flex-col items-center py-4">
           <Avatar className="h-20 w-20 border-4 border-white shadow-md">
             <AvatarFallback className={`text-2xl font-bold ${recipient.color}`}>{recipient.initials}</AvatarFallback>
           </Avatar>
           <h2 className="text-xl font-bold text-gray-900 mt-3">{recipient.name}</h2>
           <p className="text-sm text-gray-500">Member since Dec 2025</p>
        </div>

        <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</Label>
            <Input defaultValue={recipient.name} className="h-12 border-none bg-gray-50 rounded-xl font-semibold" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bank Name</Label>
            <Input defaultValue={recipient.bank} className="h-12 border-none bg-gray-50 rounded-xl font-semibold" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Number</Label>
            <Input defaultValue={recipient.account} className="h-12 border-none bg-gray-50 rounded-xl font-semibold" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Routing Number / Swift</Label>
            <Input defaultValue={recipient.routing} className="h-12 border-none bg-gray-50 rounded-xl font-semibold" />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-12 rounded-xl text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 gap-2">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
          <Button className="flex-[2] h-12 rounded-xl gap-2" onClick={() => setLocation("/recipients")}>
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
