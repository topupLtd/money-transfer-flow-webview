import MobileLayout from "@/components/layout/MobileLayout";
import { Clock } from "lucide-react";

export default function Transactions() {
  return (
    <MobileLayout title="History">
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 space-y-4">
        <Clock className="h-16 w-16 opacity-20" />
        <p>No transactions yet</p>
      </div>
    </MobileLayout>
  );
}
