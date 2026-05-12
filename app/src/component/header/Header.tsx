"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { auth } from "@/app/src/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { LogOut, Settings, Moon, Sun, Laptop } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Header() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const router = useRouter();

  // Listener untuk memantau status login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        router.push("/login"); // Tendang ke login jika tidak ada user
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Fungsi untuk mengambil inisial nama (Contoh: Adjie Surya -> AS)
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-background border-b border-border px-8 py-5 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">
          Dashboard
        </h1>
        {/* Nama Login Dinamis */}
        <p className="text-sm text-muted-foreground">
          Selamat datang,{" "}
          <span className="font-semibold text-primary">
            {currentUser?.displayName || "User"}
          </span>
        </p>
      </div>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity outline-none">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground leading-none">
                  {currentUser?.displayName || "User"}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                  Administrator
                </p>
              </div>
              <Avatar className="border-2 border-primary/20">
                <AvatarFallback className="bg-blue-600 text-white font-bold">
                  {getInitials(currentUser?.displayName)}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>Akun Saya</span>
                <span className="text-[10px] font-normal text-muted-foreground">
                  {currentUser?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setIsSettingsOpen(true)}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" /> Pengaturan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" /> Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tampilan Sistem</DialogTitle>
            <DialogDescription>
              Ganti tema aplikasi agar sesuai dengan kenyamanan Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 py-4">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="icon"
              onClick={() => setTheme("light")}
            >
              <Sun className="h-4 w-4" />
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="icon"
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-4 w-4" />
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="icon"
              onClick={() => setTheme("system")}
            >
              <Laptop className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
