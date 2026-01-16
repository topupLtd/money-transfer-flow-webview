import { useLocation } from "wouter";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function ProfileDetails() {
  const [, setLocation] = useLocation();

  return (
    <MobileLayout title="Personal Details">
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent -ml-1 text-gray-500" onClick={() => setLocation("/profile")}>
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>

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

        <Button 
          className="w-full h-12 rounded-xl font-bold shadow-md" 
          onClick={() => setLocation("/edit-profile")}
        >
          Edit Information
        </Button>
      </div>
    </MobileLayout>
  );
}
