import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/app/src/component/sidebar/sidebar";
import Header from "@/app/src/component/header/Header";
import { ThemeProvider } from "./src/component/theme-provider/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin Dashboard POS",
  description: "Sistem Manajemen Penjualan dan Pembelian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar Terintegrasi */}
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header Tetap di Atas */}
              <Header />
              {/* Konten Dinamis Halaman */}
              <main className="flex-1 overflow-y-auto bg-slate-50/50">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
