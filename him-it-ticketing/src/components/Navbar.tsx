"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Ticket, LayoutDashboard, LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav className="sticky top-0 z-50 border-b border-blue-900/20 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 shadow-lg shadow-blue-950/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/submit" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 group-hover:bg-white/20 transition-all">
              <Ticket className="h-5 w-5 text-blue-200" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">
                HIM IT Support
              </p>
              <p className="text-xs text-blue-300 leading-none mt-0.5">
                Ticketing System
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-2">
            <Link
              href="/submit"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                pathname === "/submit"
                  ? "bg-white/20 text-white"
                  : "text-blue-200 hover:bg-white/10 hover:text-white"
              )}
            >
              <Ticket className="h-4 w-4" />
              <span className="hidden sm:inline">Submit Ticket</span>
            </Link>

            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isAdmin
                  ? "bg-white/20 text-white"
                  : "text-blue-200 hover:bg-white/10 hover:text-white"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>

            {session && (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/20">
                <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-lg bg-white/10">
                  <Shield className="h-3.5 w-3.5 text-blue-300" />
                  <span className="text-xs text-blue-200 font-medium">
                    {session.user?.name ?? "Admin"}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
