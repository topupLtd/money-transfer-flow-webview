import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save } from "lucide-react";

export default function EditProfile() {
  const [, setLocation] = useLocation();

  return (
    <MobileLayout title="Edit Information">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent -ml-1 text-gray-500" onClick={() => setLocation("/profile")}>
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>

        <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</Label>
            <Input defaultValue="John Doe" className="h-12 border-none bg-gray-50 rounded-xl font-semibold" />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile Number</Label>
            <Input defaultValue="+33 6 12 34 56 78" className="h-12 border-none bg-gray-50 rounded-xl font-semibold" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address</Label>
            <Input defaultValue="123 Rue de la Paix, Paris, France" className="h-12 border-none bg-gray-50 rounded-xl font-semibold" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth</Label>
            <Input type="date" defaultValue="1990-01-01" className="h-12 border-none bg-gray-50 rounded-xl font-semibold" />
          </div>
        </div>

        <Button className="w-full h-12 rounded-xl gap-2 font-bold shadow-md" onClick={() => setLocation("/profile")}>
          <Save className="h-4 w-4" /> Save Information
        </Button>
      </div>
    </MobileLayout>
  );
}
