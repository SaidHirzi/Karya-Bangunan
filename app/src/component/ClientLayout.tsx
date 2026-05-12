"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/app/src/component/sidebar/sidebar";
import Header from "@/app/src/component/header/Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Cek apakah saat ini sedang di halaman login
  const isLoginPage = pathname === "/login";

  // Jika di halaman login, hanya tampilkan konten halamannya saja (tanpa Header/Sidebar)
  if (isLoginPage) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {children}
      </main>
    );
  }

  // Jika di halaman lain (Dashboard, dll), tampilkan layout lengkap
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}