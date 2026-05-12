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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FinancialActivity() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "keuangan"),
      orderBy("createdAt", "desc"),
      limit(3),
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setActivities(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <Card className="border-slate-200 shadow-sm flex flex-col">
      <CardHeader className="bg-slate-50/50 border-b pb-4 px-6">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Aktivitas Keuangan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex-1 space-y-6">
        {activities.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground">
            Tidak ada aktivitas.
          </p>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="flex items-start gap-4">
              <div
                className={`w-2 h-2 mt-2 rounded-full ${act.status === "Lunas" ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-slate-800">
                    {act.pihak}
                  </p>
                  <p
                    className={`text-xs font-bold ${act.jenis === "Piutang" ? "text-blue-600" : "text-orange-600"}`}
                  >
                    {act.jenis}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{act.status}</p>
                <p className="text-sm font-bold mt-1">
                  Rp {act.nominal?.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter className="bg-slate-50 border-t p-4">
        <Button
          asChild
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Link href="/keuangan">Lihat Laporan Detail</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
