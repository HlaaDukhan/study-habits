"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CheckSquare,
  GitBranch,
  MessageSquare,
  CalendarDays,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/check-in", label: "Check In", icon: CheckSquare },
  { href: "/skills", label: "Skills", icon: GitBranch },
  { href: "/chat", label: "AI Coach", icon: MessageSquare },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navContent = (
    <>
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                isActive
                  ? "bg-[#38bdf8]/10 text-[#38bdf8]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#2a2a3a]"
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#2a2a3a]">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-[#2a2a3a] w-full transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#1a1a26] border-b border-[#2a2a3a] flex items-center justify-between px-4 z-50">
        <Link href="/dashboard" className="text-lg font-bold text-white">
          Study <span className="text-[#38bdf8]">Habits</span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-400 hover:text-white p-1"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile slide-over */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`md:hidden fixed top-14 left-0 bottom-0 w-64 bg-[#1a1a26] border-r border-[#2a2a3a] flex flex-col z-50 transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-[#1a1a26] border-r border-[#2a2a3a] flex-col z-50">
        <div className="p-6">
          <Link href="/dashboard" className="text-xl font-bold text-white">
            Study <span className="text-[#38bdf8]">Habits</span>
          </Link>
        </div>
        {navContent}
      </aside>
    </>
  );
}
