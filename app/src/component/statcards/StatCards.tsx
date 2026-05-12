"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/src/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Package,
  ShoppingCart,
  CreditCard,
  Loader2,
} from "lucide-react";

export default function StatCards() {
  const [statsData, setStatsData] = useState({
    pendapatan: 0,
    pengeluaran: 0,
    totalBarang: 0,
    piutang: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Hitung Total Barang
    const unsubBarang = onSnapshot(collection(db, "barang"), (snap) => {
      setStatsData((prev) => ({ ...prev, totalBarang: snap.size }));
    });

    // 2. Hitung Pendapatan & Pengeluaran dari Koleksi Transaksi
    const unsubTrx = onSnapshot(collection(db, "transaksi"), (snap) => {
      let totalMasuk = 0;
      let totalKeluar = 0;
      snap.forEach((doc) => {
        const data = doc.data();
        if (data.jenis === "Penjualan") totalMasuk += data.total || 0;
        if (data.jenis === "Pembelian") totalKeluar += data.total || 0;
      });
      setStatsData((prev) => ({
        ...prev,
        pendapatan: totalMasuk,
        pengeluaran: totalKeluar,
      }));
    });

    // 3. Hitung Piutang dari Koleksi Keuangan
    const unsubKeuangan = onSnapshot(collection(db, "keuangan"), (snap) => {
      let totalPiutang = 0;
      snap.forEach((doc) => {
        const data = doc.data();
        if (data.jenis === "Piutang" && data.status === "Belum Lunas") {
          totalPiutang += data.nominal || 0;
        }
      });
      setStatsData((prev) => ({ ...prev, piutang: totalPiutang }));
      setLoading(false);
    });

    return () => {
      unsubBarang();
      unsubTrx();
      unsubKeuangan();
    };
  }, []);

  const displayStats = [
    {
      title: "Total Pendapatan",
      value: `Rp ${statsData.pendapatan.toLocaleString("id-ID")}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Total Pengeluaran",
      value: `Rp ${statsData.pengeluaran.toLocaleString("id-ID")}`,
      icon: ShoppingCart,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Total Barang Aktif",
      value: `${statsData.totalBarang} Item`,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Piutang Belum Lunas",
      value: `Rp ${statsData.piutang.toLocaleString("id-ID")}`,
      icon: CreditCard,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {displayStats.map((stat, i) => (
        <Card key={i} className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div
              className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center ${stat.color}`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <div className="text-2xl font-bold text-slate-800">
                {stat.value}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
