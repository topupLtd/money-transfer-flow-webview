import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditProfile() {
  const [, setLocation] = useLocation();

  return (
    <MobileLayout title="Edit Information" onBack={() => setLocation("/profile")}>
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10 px-1">
        
        <div className="space-y-6 px-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">First Name</Label>
              <Input defaultValue="John" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Name</Label>
              <Input defaultValue="Doe" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth</Label>
            <Input type="date" defaultValue="1990-01-01" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gender</Label>
            <Select defaultValue="male">
              <SelectTrigger className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nationality</Label>
            <Input defaultValue="French" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</Label>
            <Input type="email" defaultValue="john.doe@example.com" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile Number</Label>
            <Input defaultValue="+33 6 12 34 56 78" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Occupation</Label>
            <Input defaultValue="Software Engineer" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expected Transfer Amount Monthly</Label>
            <Input defaultValue="€ 2,000" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transfer Frequency (Times per month)</Label>
            <Input defaultValue="4" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address</Label>
            <Input defaultValue="123 Rue de la Paix" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</Label>
              <Input defaultValue="Paris" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Country</Label>
              <Input defaultValue="France" className="h-12 border-none bg-gray-100 rounded-xl font-semibold focus-visible:ring-1 focus-visible:ring-primary/20" />
            </div>
          </div>
        </div>

        <Button className="w-full h-12 rounded-xl gap-2 font-bold shadow-md" onClick={() => setLocation("/profile")}>
          <Save className="h-4 w-4" /> Save Information
        </Button>
      </div>
    </MobileLayout>
  );
}
