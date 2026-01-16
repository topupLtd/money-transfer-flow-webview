import { Link, useLocation } from "wouter";
import { Send, Users, List, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Send, label: "Send" },
    { href: "/recipients", icon: Users, label: "Recipients" },
    { href: "/transactions", icon: List, label: "History" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl relative flex flex-col">
        {/* Header */}
        <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-sm">
          <h1 className="text-lg font-semibold text-center">{title || "MyPCS Remit"}</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-24 px-4 py-6">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-20 max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex flex-col items-center gap-1 cursor-pointer transition-colors",
                  isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
                )}>
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
