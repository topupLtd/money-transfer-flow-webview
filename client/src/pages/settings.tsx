import MobileLayout from "@/components/layout/MobileLayout";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <MobileLayout title="Settings">
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 space-y-4">
        <SettingsIcon className="h-16 w-16 opacity-20" />
        <p>Settings coming soon</p>
      </div>
    </MobileLayout>
  );
}
