# 📊 Struktur Navigasi - Admin Dashboard POS

**Nama Aplikasi:** Karya Bangunan POS v1.0  
**Framework:** Next.js 16.2.1 dengan React 19 dan TypeScript  
**Database:** Firebase Firestore

---

## 🗺️ Arsitektur Aplikasi

```
my-app (Root)
│
├── 📁 app/ (Next.js App Router)
│   ├── layout.tsx (Root Layout - Sidebar + Header)
│   ├── page.tsx (Dashboard - Home)
│   ├── globals.css
│   │
│   ├── 📁 barang/ (Data Barang)
│   │   └── page.tsx
│   │
│   ├── 📁 keuangan/ (Keuangan)
│   │   └── page.tsx
│   │
│   ├── 📁 login/ (Login)
│   │   └── page.tsx
│   │
│   ├── 📁 transaksi/ (Transaksi)
│   │   └── page.tsx
│   │
│   └── 📁 src/ (Internal Resources)
│       ├── 📁 component/ (Komponen Custom)
│       │   ├── sidebar/
│       │   │   └── sidebar.tsx
│       │   ├── header/
│       │   │   └── Header.tsx
│       │   ├── statcards/
│       │   │   └── StatCards.tsx
│       │   ├── recentsales/
│       │   │   └── RecentSales.tsx
│       │   ├── financialactivity/
│       │   │   └── FinancialActivity.tsx
│       │   └── theme-provider/
│       │       └── theme-provider.tsx
│       │
│       └── 📁 lib/ (Utilities & Libraries)
│           └── firebase.ts
│
├── 📁 components/ (Shared UI Components - shadcn/ui)
│   └── 📁 ui/
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── table.tsx
│
├── 📁 lib/ (Global Utilities)
│   └── utils.ts
│
├── 📁 public/ (Static Assets)
│   └── 📁 Images/
│       └── LogoPerusahaanTrans.png
│
├── 📄 Configuration Files
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   ├── package.json
│   └── components.json
│
└── 📄 Documentation
    ├── README.md
    ├── AGENTS.md
    ├── CLAUDE.md
    └── NAVIGATION.md (File ini)
```

---

## 🧭 Routes & Navigation Map

### Sidebar Navigation Structure
Semua route diakses melalui **Sidebar** yang dapat dikecilkan:

| Route | Path | Icon | Deskripsi |
|-------|------|------|-----------|
| 🏠 Dashboard | `/` | LayoutDashboard | Halaman utama dengan StatCards, RecentSales, FinancialActivity |
| 📦 Data Barang | `/barang` | Package | Manajemen data produk/barang dengan CRUD |
| 💳 Transaksi | `/transaksi` | ShoppingCart | Halaman transaksi penjualan |
| 💰 Keuangan | `/keuangan` | DollarSign | Manajemen hutang, piutang & laporan keuangan |
| 🔐 Login | `/login` | - | Halaman otentikasi pengguna |

---

## 📄 Pages & Responsibilitas

### 1. **Home / Dashboard** (`/`)
**File:** [app/page.tsx](app/page.tsx)

**Komponen yang ditampilkan:**
- `StatCards` - Kartu statistik utama
- `RecentSales` - Tabel penjualan terbaru
- `FinancialActivity` - Grafik aktivitas keuangan

**Layout:** Grid responsif (1 kolom mobile, 3 kolom desktop)

---

### 2. **Data Barang** (`/barang`)
**File:** [app/barang/page.tsx](app/barang/page.tsx)

**Fitur:**
- 📊 Tabel data barang dari Firebase
- ➕ Dialog tambah barang baru
- ✏️ Edit data barang
- 🗑️ Hapus barang
- 🔍 Search/filter barang
- 📥 Status loading dengan spinner

**Integrasi Firebase:**
```
Collection: "barang"
Operasi: Read (snapshot), Create (addDoc), Update (updateDoc), Delete (deleteDoc)
Timestamp: serverTimestamp()
```

---

### 3. **Keuangan** (`/keuangan`)
**File:** [app/keuangan/page.tsx](app/keuangan/page.tsx)

**Fitur:**
- 💼 Manajemen hutang & piutang
- 📋 Tabel dengan badge status
- ➕ Dialog input transaksi keuangan
- ✏️ Edit entry keuangan
- 🗑️ Hapus entry
- 💱 Badge kategori (Hutang/Piutang/Penjualan)

**Integrasi Firebase:**
```
Collection: "hutangPiutang"
Fields: Tipe, Jumlah, Deskripsi, Status, Tanggal
```

---

### 4. **Transaksi** (`/transaksi`)
**File:** [app/transaksi/page.tsx](app/transaksi/page.tsx)

**Status:** ⏳ Sedang dikembangkan

---

### 5. **Login** (`/login`)
**File:** [app/login/page.tsx](app/login/page.tsx)

**Status:** ⏳ Sedang dikembangkan

---

## 🧩 Komponen Utama

### Layout Structure

#### **Root Layout** [app/layout.tsx](app/layout.tsx)
```
<html> (Fonts: Inter, Plus Jakarta Sans)
  <body> (ThemeProvider + Dark Mode Support)
    <div class="flex h-screen">
      <Sidebar /> ← Navigasi utama
      <div class="flex-1 flex flex-col">
        <Header /> ← Header tetap di atas
        <main> ← Konten halaman dinamis
```

---

### Navigation Components

#### **Sidebar** [app/src/component/sidebar/sidebar.tsx](app/src/component/sidebar/sidebar.tsx)
- ✨ Collapsible dengan animasi smooth
- 📍 Active state indicator
- 🎨 Logo dinamis (Icon saat kecil, Full logo saat besar)
- 🔗 Link ke semua halaman utama
- 🎯 usePathname() untuk highlight aktif

#### **Header** [app/src/component/header/Header.tsx](app/src/component/header/Header.tsx)
- 🔍 Search bar
- 👤 User profile
- ⚙️ Settings
- 🔔 Notifications

---

### Dashboard Components

#### **StatCards** [app/src/component/statcards/StatCards.tsx](app/src/component/statcards/StatCards.tsx)
Menampilkan KPI utama:
- Total Penjualan
- Total Pembelian
- Inventory Status
- Profit/Loss

#### **RecentSales** [app/src/component/recentsales/RecentSales.tsx](app/src/component/recentsales/RecentSales.tsx)
- Tabel penjualan terbaru
- Integrasi data dari Firebase
- Sorting & filtering

#### **FinancialActivity** [app/src/component/financialactivity/FinancialActivity.tsx](app/src/component/financialactivity/FinancialActivity.tsx)
- Grafik aktivitas keuangan
- Visualisasi trend
- Chart library (Recharts / Chart.js)

---

### Theme & Provider

#### **ThemeProvider** [app/src/component/theme-provider/theme-provider.tsx](app/src/component/theme-provider/theme-provider.tsx)
- Dark/Light mode toggle
- Menggunakan `next-themes`
- Persistent theme preference

---

## 🎨 UI Components (shadcn/ui)

Semua komponen UI tersimpan di [components/ui/](components/ui/):

| Komponen | File | Fungsi |
|----------|------|--------|
| Avatar | avatar.tsx | Profile picture |
| Badge | badge.tsx | Label/tag status |
| Button | button.tsx | Tombol dengan variant |
| Card | card.tsx | Container/card layout |
| Dialog | dialog.tsx | Modal dialog |
| Dropdown Menu | dropdown-menu.tsx | Menu dropdown |
| Input | input.tsx | Text input field |
| Label | label.tsx | Form label |
| Select | select.tsx | Select dropdown |
| Table | table.tsx | Data table |

**Semua komponen** menggunakan:
- 🎨 **Tailwind CSS** untuk styling
- ⚙️ **Radix UI** untuk accessibility
- 🎭 **Class Variance Authority** untuk variant

---

## 🔧 Libraries & Dependencies

### Core
- **Next.js 16.2.1** - React framework
- **React 19.2.4** - UI library
- **TypeScript 5** - Type safety

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Component library
- **Radix UI 1.4.3** - Headless components
- **Lucide React 1.14.0** - Icon library
- **next-themes 0.4.6** - Dark mode management

### Data & State
- **Firebase 12.13.0** - Backend & Database
  - Firestore untuk data realtime
  - Authentication
  - Cloud Storage

### Utilities
- **clsx 2.1.1** - Conditional classnames
- **tailwind-merge 3.5.0** - Merge Tailwind classes
- **class-variance-authority 0.7.1** - Component variants

---

## 🔌 Firebase Integration

### Konfigurasi
**File:** [app/src/lib/firebase.ts](app/src/lib/firebase.ts)

```typescript
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// Konfigurasi Firebase credentials
export const db = getFirestore(app)
```

### Collections yang Digunakan

#### 1. **barang** Collection
Menyimpan data produk/barang

```
Field: namaBarang, harga, stok, kategori, deskripsi, createdAt
Operations: CRUD penuh
```

#### 2. **hutangPiutang** Collection
Menyimpan transaksi hutang/piutang

```
Field: tipe, jumlah, deskripsi, status, createdAt, updateAt
Operations: CRUD penuh
```

#### 3. Potential Collections (untuk dikembangkan)
- **transaksi** - Penjualan & pembelian
- **users** - Data pengguna & authentication
- **inventory** - History stok barang

---

## 🛣️ Navigation Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│         Root Layout (Sidebar + Header)              │
└────────────┬──────────────────────────────────────┬─┘
             │                                      │
      ┌──────▼──────┐                      ┌────────▼────────┐
      │  SIDEBAR     │                      │  MAIN CONTENT   │
      │  (Navigasi)  │                      │  (Dynamic Page) │
      └──────┬───────┘                      └─────────────────┘
             │
             ├─→ Dashboard (/)
             │   ├─ StatCards
             │   ├─ RecentSales
             │   └─ FinancialActivity
             │
             ├─→ Data Barang (/barang)
             │   ├─ Table Data
             │   ├─ Dialog Add/Edit
             │   ├─ Delete Function
             │   └─ Search Filter
             │
             ├─→ Keuangan (/keuangan)
             │   ├─ Table Hutang/Piutang
             │   ├─ Dialog Add/Edit
             │   ├─ Status Badge
             │   └─ Delete Function
             │
             ├─→ Transaksi (/transaksi)
             │   └─ [WIP]
             │
             └─→ Login (/login)
                 └─ [WIP]
```

---

## 📁 File Organization Best Practices

### Current Structure
```
✅ app/
   └── src/component/  (Komponen halaman tertentu)
   └── src/lib/        (Utilities halaman tertentu)

✅ components/ui/      (Reusable UI Components)
✅ lib/                (Global Utilities)
```

### Rekomendasi Improvement
```
app/
├── barang/
│   ├── page.tsx
│   ├── components/    ← NEW: Komponen khusus barang
│   └── hooks/         ← NEW: Custom hooks
├── keuangan/
│   ├── page.tsx
│   ├── components/    ← NEW
│   └── hooks/         ← NEW
└── src/
    ├── components/    ← Shared components antar pages
    ├── hooks/         ← Global custom hooks
    ├── types/         ← TypeScript interfaces
    ├── utils/         ← Utility functions
    └── lib/           ← Firebase & external libs
```

---

## 🚀 Quick Start Navigation

### Untuk Menambah Halaman Baru
1. Buat folder baru di `app/`
2. Buat `page.tsx` di folder tersebut
3. Tambah menu item di [app/src/component/sidebar/sidebar.tsx](app/src/component/sidebar/sidebar.tsx)
4. Sidebar otomatis navigasi ke route baru

### Untuk Menambah Komponen UI
1. Buat komponen di `components/ui/`
2. Export dari file yang sesuai
3. Import di page/komponen yang membutuhkan

### Untuk Menambah Firebase Collection
1. Update [app/src/lib/firebase.ts](app/src/lib/firebase.ts)
2. Gunakan `collection(db, 'namaCollection')` di page
3. Implementasikan CRUD operations

---

## 📊 Dependency Graph

```
app/layout.tsx (Root)
├── Sidebar → sidebar.tsx
├── Header → Header.tsx
└── Page Children
    ├── page.tsx (Dashboard)
    │   ├── StatCards
    │   ├── RecentSales
    │   └── FinancialActivity
    ├── barang/page.tsx
    │   └── Firebase (barang collection)
    ├── keuangan/page.tsx
    │   └── Firebase (hutangPiutang collection)
    ├── transaksi/page.tsx
    └── login/page.tsx

UI Components (Shared)
├── Button, Input, Label
├── Card, Dialog
├── Table, Badge
├── Select, Dropdown
└── Avatar

Utilities
├── firebase.ts
├── utils.ts (tailwind merge, clsx)
└── theme-provider.tsx
```

---

## 🔐 Authentication & Security

### Current Status
- ⏳ Login page ada tapi belum terintegrasi
- 🚫 Belum ada route protection
- 🚫 Belum ada session management

### Rekomendasi
Implementasikan:
1. Firebase Authentication
2. NextAuth.js atau custom middleware
3. Protected routes di Next.js
4. Session state management

---

## 📱 Responsive Design

### Breakpoints (Tailwind)
- `mobile` - Default (< 768px)
- `md` - Tablet (≥ 768px) - Sidebar muncul
- `lg` - Desktop (≥ 1024px) - Full layout
- `xl` - Large (≥ 1280px)

### Specific Responsive Elements
- **Sidebar**: Hidden mobile, visible md+
- **Dashboard Grid**: 1 col mobile, 3 cols lg+
- **Tables**: Scrollable horizontal mobile

---

## 🎯 Summary Navigation Points

| Elemen | Lokasi | Purpose |
|--------|--------|---------|
| Sidebar Navigation | [sidebar.tsx](app/src/component/sidebar/sidebar.tsx) | Main routing |
| Routes Definition | [app/](app/) struktur folder | Next.js file-based routing |
| UI Components | [components/ui/](components/ui/) | Reusable elements |
| Custom Components | [app/src/component/](app/src/component/) | Page-specific components |
| Firebase Setup | [firebase.ts](app/src/lib/firebase.ts) | Database connection |
| Global Styles | [globals.css](app/globals.css) | Tailwind & global CSS |
| Config | [next.config.ts](next.config.ts) | Next.js configuration |

---

**Last Updated:** May 12, 2026  
**Version:** 1.0  
**Status:** Admin Dashboard POS - In Development ✏️
