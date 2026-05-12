"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/src/lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2, Plus, Trash2, Wallet, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function KeuanganPage() {
  const [hutangPiutang, setHutangPiutang] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State untuk mode Edit
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    jenis: "Piutang",
    pihak: "",
    nominal: "",
    status: "Belum Lunas",
  });

  // Ambil Data Real-time
  useEffect(() => {
    const q = query(collection(db, "keuangan"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHutangPiutang(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Membuka modal untuk tambah data
  const openAddDialog = () => {
    setFormData({
      jenis: "Piutang",
      pihak: "",
      nominal: "",
      status: "Belum Lunas",
    });
    setIsEditMode(false);
    setEditId(null);
    setIsDialogOpen(true);
  };

  // Membuka modal untuk edit data (termasuk edit status)
  const openEditDialog = (item: any) => {
    setFormData({
      jenis: item.jenis,
      pihak: item.pihak,
      nominal: String(item.nominal),
      status: item.status,
    });
    setEditId(item.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // Fungsi Simpan (Tambah & Update)
  const handleSaveFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        jenis: formData.jenis,
        pihak: formData.pihak,
        status: formData.status,
        nominal: Number(formData.nominal),
      };

      if (isEditMode && editId) {
        // Update data di Firebase
        const docRef = doc(db, "keuangan", editId);
        await updateDoc(docRef, {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Tambah data baru ke Firebase
        await addDoc(collection(db, "keuangan"), {
          ...payload,
          tanggal: new Date().toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          createdAt: serverTimestamp(),
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus catatan keuangan ini?")) {
      try {
        await deleteDoc(doc(db, "keuangan", id));
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600" /> Laporan Keuangan
          </h2>
          <p className="text-sm text-muted-foreground">
            Pantau hutang dan piutang toko dari database
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button
            onClick={openAddDialog}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" /> Catat Hutang/Piutang
          </Button>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditMode
                  ? "Edit Catatan Keuangan"
                  : "Tambah Catatan Keuangan"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveFinancial} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Jenis Catatan</Label>
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
                    <SelectItem value="Piutang">Piutang</SelectItem>
                    <SelectItem value="Hutang">Hutang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pihak">Nama Pihak</Label>
                <Input
                  id="pihak"
                  value={formData.pihak}
                  onChange={(e) =>
                    setFormData({ ...formData, pihak: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nominal">Nominal (Rp)</Label>
                <Input
                  id="nominal"
                  type="number"
                  value={formData.nominal}
                  onChange={(e) =>
                    setFormData({ ...formData, nominal: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Belum Lunas">Belum Lunas</SelectItem>
                    <SelectItem value="Lunas">Lunas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-blue-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ) : (
                    "Simpan Perubahan"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between py-4 px-6">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Daftar Hutang & Piutang
          </CardTitle>
          <FileText className="w-5 h-5 text-slate-400" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="px-6 py-4">Tanggal</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Nama Pihak</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Nominal</TableHead>
                <TableHead className="text-center px-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto text-blue-600" />
                  </TableCell>
                </TableRow>
              ) : (
                hutangPiutang.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-6 text-sm">
                      {item.tanggal}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold text-xs px-2 py-1 rounded-full ${item.jenis === "Piutang" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}
                      >
                        {item.jenis.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-slate-800">
                      {item.pihak}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={
                          item.status === "Lunas"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      Rp {item.nominal?.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 hover:bg-blue-50"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
