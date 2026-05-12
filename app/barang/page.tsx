/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/src/lib/firebase"; // Menggunakan path yang Anda minta
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
import { Plus, Edit, Trash2, Loader2, Search, X } from "lucide-react";
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

export default function DataBarangPage() {
  const [dataBarang, setDataBarang] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State untuk mode Edit
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // State untuk Pencarian
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");

  const [formData, setFormData] = useState({
    id_barang: "",
    nama: "",
    kategori: "",
    stok: "",
    jual: "",
  });

  const categoryMap: Record<string, string> = {
    ATK: "ATK",
    Konstruksi: "KNS",
    "Obat-obatan": "OBT",
    Furniture: "FRN",
    Lainnya: "BRG",
  };

  const listKategori = Object.keys(categoryMap);

  // 1. Ambil Data Real-time
  useEffect(() => {
    const q = query(collection(db, "barang"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id, // ID unik dari Firestore
        ...doc.data(),
      }));
      setDataBarang(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Logika Auto-Generate Kode
  const generateAutoCode = (category: string) => {
    const prefix = categoryMap[category] || "BRG";
    const sameCategoryItems = dataBarang.filter(
      (item) => item.id_barang && item.id_barang.startsWith(prefix),
    );
    let nextNumber = 1;
    if (sameCategoryItems.length > 0) {
      const numbers = sameCategoryItems.map((item) => {
        const numPart = item.id_barang.replace(prefix, "");
        return parseInt(numPart, 10) || 0;
      });
      nextNumber = Math.max(...numbers) + 1;
    }
    return `${prefix}${String(nextNumber).padStart(3, "0")}`;
  };

  const handleCategoryChange = (value: string) => {
    if (!isEditMode) {
      const autoCode = generateAutoCode(value);
      setFormData({ ...formData, kategori: value, id_barang: autoCode });
    } else {
      setFormData({ ...formData, kategori: value });
    }
  };

  // 3. Fungsi Membuka Modal (Tambah / Edit)
  const openAddDialog = () => {
    setFormData({ id_barang: "", nama: "", kategori: "", stok: "", jual: "" });
    setIsEditMode(false);
    setEditId(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: any) => {
    setFormData({
      id_barang: item.id_barang,
      nama: item.nama,
      kategori: item.kategori,
      stok: String(item.stok),
      jual: String(item.jual),
    });
    setEditId(item.id); // Simpan ID dokumen Firestore
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // 4. Fungsi Simpan (Tambah & Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        stok: Number(formData.stok),
        jual: Number(formData.jual),
      };

      if (isEditMode && editId) {
        // PROSES UPDATE
        const docRef = doc(db, "barang", editId);
        await updateDoc(docRef, {
          ...payload,
          updatedAt: serverTimestamp(),
        });
        console.log("Data berhasil diupdate!");
      } else {
        // PROSES TAMBAH BARU
        await addDoc(collection(db, "barang"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Terjadi kesalahan. Pastikan Firebase Rules Anda 'allow write'.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Fungsi Hapus
  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
      try {
        await deleteDoc(doc(db, "barang", id));
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  // 6. Filter Pencarian
  const filteredData = dataBarang.filter((item) => {
    const matchesSearch = item.nama
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "Semua" || item.kategori === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Data Barang</h2>
          <p className="text-sm text-muted-foreground">
            Kelola inventori secara real-time
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Barang
        </Button>
      </div>

      {/* Bar Pencarian */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama barang..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <X
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 h-4 w-4 text-slate-400 cursor-pointer"
            />
          )}
        </div>
        <div className="w-full md:w-64">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua Kategori</SelectItem>
              {listKategori.map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Data Barang" : "Tambah Barang Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select
                onValueChange={handleCategoryChange}
                value={formData.kategori}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {listKategori.map((kat) => (
                    <SelectItem key={kat} value={kat}>
                      {kat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kode Barang</Label>
              <Input
                value={formData.id_barang}
                readOnly
                className="bg-slate-50 font-mono font-bold text-blue-600"
              />
            </div>
            <div className="space-y-2">
              <Label>Nama Barang</Label>
              <Input
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stok</Label>
                <Input
                  type="number"
                  value={formData.stok}
                  onChange={(e) =>
                    setFormData({ ...formData, stok: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Harga Jual</Label>
                <Input
                  type="number"
                  value={formData.jual}
                  onChange={(e) =>
                    setFormData({ ...formData, jual: e.target.value })
                  }
                  required
                />
              </div>
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

      {/* Tabel Data */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="px-6 py-4">Kode</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Stok</TableHead>
                <TableHead className="text-right px-6">Harga</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto text-blue-600" />
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-slate-400"
                  >
                    Data tidak ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-6 font-mono font-bold text-blue-600">
                      {item.id_barang}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800">
                      {item.nama}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {item.kategori}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.stok}
                    </TableCell>
                    <TableCell className="text-right font-bold px-6 text-slate-900">
                      Rp {item.jual?.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-blue-600"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
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
