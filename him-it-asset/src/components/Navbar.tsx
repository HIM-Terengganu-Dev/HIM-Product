import Link from "next/link";
import { MonitorSmartphone, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="no-print sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 transition-transform group-hover:scale-105">
            <MonitorSmartphone className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">
            HIM <span className="text-blue-600">Assets</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
