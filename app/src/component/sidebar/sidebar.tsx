"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, DollarSign, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Data Barang", path: "/barang", icon: Package },
    { name: "Transaksi", path: "/transaksi", icon: ShoppingCart },
    { name: "Keuangan", path: "/keuangan", icon: DollarSign },
  ];

  return (
    <aside className={`bg-blue-300 text-white flex flex-col hidden md:flex min-h-screen transition-all duration-500 ease-in-out relative ${isCollapsed ? "w-20" : "w-64"}`}>
      {/* Tombol Toggle Interaktif */}
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        variant="outline"
        size="icon"
        className="absolute -right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full border-slate-200 shadow-sm z-50 bg-white text-blue-600 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <ChevronLeft className={`h-4 w-4 transition-transform duration-500 ${isCollapsed ? "rotate-180" : "rotate-0"}`} />
      </Button>

      {/* Area Logo & Monogram */}
      <div className="pt-8 px-4 mb-8 flex justify-center items-center">
        <Link href="/" className="relative flex justify-center items-center w-full group">
          {/* Inisial KB: Muncul saat tertutup, desain seperti App Icon Premium */}
          <div className={`absolute transition-all duration-500 ease-in-out transform ${isCollapsed ? "scale-100 opacity-100" : "scale-50 opacity-0 pointer-events-none"}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center shadow-lg border border-blue-400/40 group-hover:shadow-blue-500/50 transition-shadow">
              <span className="text-white font-black text-xl tracking-tighter">KB</span>
            </div>
          </div>

          {/* Logo Full: Muncul saat terbuka */}
          <div className={`transition-all duration-500 ease-in-out transform ${!isCollapsed ? "scale-100 opacity-100" : "scale-75 opacity-0 pointer-events-none"}`}>
            <Image 
              src="/Images/LogoPerusahaanTrans.png" 
              alt="Logo" 
              width={160} 
              height={70} 
              className="object-contain" 
              priority 
            />
          </div>
        </Link>
      </div>

      {/* Navigasi Menu */}
      <nav className={`flex-1 px-3 space-y-2 transition-all duration-500 ${isCollapsed ? "mt-4" : "mt-0"}`}>
        {menuItems.map((item) => {
          const active = pathname === item.path;
          return (
            <Button
              key={item.path}
              asChild
              variant={active ? "secondary" : "ghost"}
              className={`w-full gap-3 transition-all duration-300 group relative ${isCollapsed ? "justify-center h-12 px-0" : "justify-start h-11 px-4"} ${active ? "bg-blue-800 text-white shadow-md" : "text-blue-100 hover:text-white hover:bg-blue-800/40"}`}
            >
              <Link href={item.path}>
                <item.icon className={`shrink-0 transition-all duration-500 group-hover:scale-110 ${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />
                {!isCollapsed && (
                  <span className="truncate font-semibold tracking-wide text-sm transition-opacity duration-500">
                    {item.name}
                  </span>
                )}
                
                {/* Indikator Aktif (Garis Samping) */}
                {active && !isCollapsed && (
                  <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                )}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Footer Sidebar (Opsional - Bisa untuk User Info Singkat) */}
      {!isCollapsed && (
        <div className="p-4 border-t border-blue-400/30 bg-blue-400/10">
          <p className="text-[10px] uppercase tracking-widest text-blue-100 opacity-60 font-bold">Karya Bangunan POS v1.0</p>
        </div>
      )}
    </aside>
  );
}