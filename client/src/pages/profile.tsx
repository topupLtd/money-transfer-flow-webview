import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Tag, ChevronRight, LogOut, Camera, ShieldCheck, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Profile() {
  const [, setLocation] = useLocation();

  const menuItems = [
    { label: "Active Promotions", icon: Tag, value: "3 active", color: "text-primary bg-primary/10" },
    { label: "Account Security", icon: ShieldCheck, value: "Safe", color: "text-secondary bg-secondary/10" },
    { label: "Help & Support", icon: HelpCircle, value: null, color: "text-blue-500 bg-blue-50" },
  ];

  return (
    <MobileLayout title="Profile">
      <div className="space-y-8 animate-in fade-in duration-500 pb-10">
        
        {/* Header/Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
              <AvatarFallback className="bg-primary text-white text-3xl font-bold">JD</AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 h-8 w-8 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-md text-gray-500 hover:text-primary transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-4">John Doe</h2>
          <p className="text-sm text-gray-400">john.doe@example.com</p>
        </div>

        {/* Info Section */}
        <div className="space-y-3">
          <button 
            onClick={() => setLocation("/profile-details")}
            className="w-full flex items-center justify-between p-4 bg-white border border-gray-50 rounded-xl shadow-sm hover:border-primary/20 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-primary bg-primary/10">
                <User className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="font-bold text-gray-900 text-sm block">Personal Information</span>
                <span className="text-[10px] text-gray-400 font-medium">View and manage your details</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary" />
          </button>

          {menuItems.map((item, idx) => (
            <button 
              key={idx}
              className="w-full flex items-center justify-between p-4 bg-white border border-gray-50 rounded-xl shadow-sm hover:border-primary/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="font-bold text-gray-900 text-sm">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/5 rounded-md">{item.value}</span>}
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary" />
              </div>
            </button>
          ))}
        </div>

        <Button variant="ghost" className="w-full text-gray-400 font-bold hover:text-red-500 hover:bg-red-50 h-12 rounded-xl transition-all gap-2">
          <LogOut className="h-4 w-4" /> Log Out
        </Button>

      </div>
    </MobileLayout>
  );
}
