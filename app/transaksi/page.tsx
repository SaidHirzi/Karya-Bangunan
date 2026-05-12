"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/src/lib/firebase"; //
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Plus,
  ShoppingCart,
  History,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TransaksiPage() {
  const [transaksi, setTransaksi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State untuk form transaksi
  const [formData, setFormData] = useState({
    jenis: "Penjualan",
    total: "",
    user: "Admin Utama", // Default user
    status: "Selesai",
  });

  // 1. Ambil Data Real-time dari Firestore
  useEffect(() => {
    const q = query(collection(db, "transaksi"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransaksi(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fungsi Auto-Generate ID Transaksi
  const generateTrxId = (jenis: string) => {
    const prefix = jenis === "Penjualan" ? "TRX" : "PEM";
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(Math.random() * 100);
    return `${prefix}-${timestamp}${random}`;
  };

  // 3. Fungsi Simpan Transaksi ke Database
  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const trxId = generateTrxId(formData.jenis);
      await addDoc(collection(db, "transaksi"), {
        id_ref: trxId,
        tanggal: new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        jenis: formData.jenis,
        user: formData.user,
        status: formData.status,
        total: Number(formData.total),
        createdAt: serverTimestamp(),
      });

      // Reset form dan tutup modal
      setFormData({ ...formData, total: "" });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Gagal mencatat transaksi:", error);
      alert("Terjadi kesalahan saat menyimpan transaksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600" /> Riwayat Transaksi
          </h2>
          <p className="text-sm text-muted-foreground">
            Catatan otomatis dari database Firebase
          </p>
        </div>
        <div className="flex gap-3">
          {/* Tombol untuk membuka formulir transaksi */}
          <Button
            onClick={() => {
              setFormData({ ...formData, jenis: "Pembelian" });
              setIsDialogOpen(true);
            }}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 gap-2"
          >
            <ArrowDownRight className="w-4 h-4" /> Catat Pembelian
          </Button>
          <Button
            onClick={() => {
              setFormData({ ...formData, jenis: "Penjualan" });
              setIsDialogOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <ShoppingCart className="w-4 h-4" /> Kasir Penjualan
          </Button>
        </div>
      </div>

      {/* Modal Dialog Form Transaksi */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Catat {formData.jenis} Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveTransaction} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Jenis Transaksi</Label>
              <Select
                value={formData.jenis}
                onValueChange={(val) =>
                  setFormData({ ...formData, jenis: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Penjualan">
                    Penjualan (Uang Masuk)
                  </SelectItem>
                  <SelectItem value="Pembelian">
                    Pembelian (Uang Keluar)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="total">Total Nominal (Rp)</Label>
              <Input
                id="total"
                type="number"
                placeholder="Contoh: 50000"
                value={formData.total}
                onChange={(e) =>
                  setFormData({ ...formData, total: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Kasir / Admin</Label>
              <Input
                value={formData.user}
                readOnly
                className="bg-slate-50 text-muted-foreground"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="submit"
                className="w-full bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  "Simpan Transaksi"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tabel Data Riwayat */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="px-6 py-4">ID Ref</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right px-6">Total Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto text-blue-600" />
                  </TableCell>
                </TableRow>
              ) : transaksi.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-slate-400"
                  >
                    Belum ada data transaksi.
                  </TableCell>
                </TableRow>
              ) : (
                transaksi.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell className="px-6 font-medium text-slate-800">
                      {trx.id_ref}
                    </TableCell>
                    <TableCell className="text-sm">{trx.tanggal}</TableCell>
                    <TableCell>
                      {trx.jenis === "Penjualan" ? (
                        <span className="flex items-center gap-1 text-green-600 font-semibold text-xs">
                          <ArrowUpRight className="w-4 h-4" /> PENJUALAN
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 font-semibold text-xs">
                          <ArrowDownRight className="w-4 h-4" /> PEMBELIAN
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{trx.user}</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-100 text-green-700 border-none text-[10px]">
                        {trx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6 font-bold text-slate-900">
                      Rp {trx.total?.toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
