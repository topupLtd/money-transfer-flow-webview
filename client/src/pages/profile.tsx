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
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Information</h3>
            <button 
              onClick={() => setLocation("/edit-profile")}
              className="text-xs font-bold text-primary hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-300 uppercase">First Name</p>
                <p className="font-semibold text-gray-900">John</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-300 uppercase">Last Name</p>
                <p className="font-semibold text-gray-900">Doe</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-300 uppercase">Date of Birth</p>
                <p className="font-semibold text-gray-900">Jan 1, 1990</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-300 uppercase">Gender</p>
                <p className="font-semibold text-gray-900">Male</p>
              </div>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-gray-300 uppercase">Nationality</p>
               <p className="font-semibold text-gray-900">French</p>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-gray-300 uppercase">Email Address</p>
               <p className="font-semibold text-gray-900">john.doe@example.com</p>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-gray-300 uppercase">Mobile Number</p>
               <p className="font-semibold text-gray-900">+33 6 12 34 56 78</p>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-gray-300 uppercase">Occupation</p>
               <p className="font-semibold text-gray-900">Software Engineer</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-300 uppercase">Expected Monthly</p>
                <p className="font-semibold text-gray-900">€ 2,000</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-300 uppercase">Times / Month</p>
                <p className="font-semibold text-gray-900">4</p>
              </div>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-gray-300 uppercase">Address</p>
               <p className="font-semibold text-gray-900">123 Rue de la Paix, Paris, France</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
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
