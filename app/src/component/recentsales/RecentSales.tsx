"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/src/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RecentSales() {
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "transaksi"),
      orderBy("createdAt", "desc"),
      limit(5),
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setSales(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <Card className="lg:col-span-2 border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b pb-4 px-6">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Penjualan Terakhir
        </CardTitle>
        <Button variant="link" asChild className="text-blue-600 p-0 h-auto">
          <Link href="/transaksi">Lihat Semua</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">ID Ref</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead className="text-right px-6">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-10 text-muted-foreground"
                >
                  Belum ada transaksi.
                </TableCell>
              </TableRow>
            ) : (
              sales.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-6 font-medium text-blue-600">
                    {item.id_ref}
                  </TableCell>
                  <TableCell
                    className={
                      item.jenis === "Penjualan"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {item.jenis}
                  </TableCell>
                  <TableCell className="text-right px-6 font-bold">
                    Rp {item.total?.toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
