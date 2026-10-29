import type { MasukanKomponen } from "@/lib/skema";

export type ProductCategory =
  | "Processor"
  | "Motherboard"
  | "Graphics card"
  | "Memory"
  | "Storage"
  | "Power supply"
  | "Case";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  specifications: string[];
  available?: boolean;
  socket?: string;
  memoryType?: "DDR4" | "DDR5";
  formFactor?: "ATX" | "Micro-ATX" | "Mini-ITX";
  supportedMotherboardSizes?: Array<"ATX" | "Micro-ATX" | "Mini-ITX">;
  wattage?: number;
  powerDraw?: number;
};

export const categoryLabels: Record<ProductCategory, string> = {
  Processor: "Prosesor",
  Motherboard: "Motherboard",
  "Graphics card": "Kartu grafis",
  Memory: "Memori",
  Storage: "Penyimpanan",
  "Power supply": "Power supply",
  Case: "Casing",
};

const initialMockProducts: Product[] = [
  {
    id: "cpu-ryzen-7600",
    name: "AMD Ryzen 5 7600",
    category: "Processor",
    price: 3_150_000,
    description: "Prosesor desktop 6-core untuk rancangan serbaguna.",
    specifications: ["Socket AM5", "65 W"],
    socket: "AM5",
    powerDraw: 65,
  },
  {
    id: "cpu-core-12400f",
    name: "Intel Core i5-12400F",
    category: "Processor",
    price: 2_050_000,
    description: "Prosesor desktop 6-core untuk rancangan gaming.",
    specifications: ["Socket LGA1700", "65 W"],
    socket: "LGA1700",
    powerDraw: 65,
  },
  {
    id: "board-b650m",
    name: "MSI PRO B650M-A WiFi",
    category: "Motherboard",
    price: 2_650_000,
    description: "Motherboard Micro-ATX dengan Wi-Fi untuk prosesor AM5.",
    specifications: ["Socket AM5", "DDR5", "Micro-ATX"],
    socket: "AM5",
    memoryType: "DDR5",
    formFactor: "Micro-ATX",
  },
  {
    id: "board-b760m",
    name: "ASUS PRIME B760M-K D4",
    category: "Motherboard",
    price: 1_750_000,
    description: "Motherboard Micro-ATX untuk prosesor Intel yang kompatibel.",
    specifications: ["Socket LGA1700", "DDR4", "Micro-ATX"],
    socket: "LGA1700",
    memoryType: "DDR4",
    formFactor: "Micro-ATX",
  },
  {
    id: "gpu-rtx-4060",
    name: "MSI GeForce RTX 4060 8G",
    category: "Graphics card",
    price: 5_050_000,
    description: "Kartu grafis ringkas untuk rancangan desktop kelas menengah.",
    specifications: ["8 GB GDDR6", "115 W"],
    powerDraw: 115,
  },
  {
    id: "gpu-rx-7600",
    name: "Sapphire PULSE Radeon RX 7600",
    category: "Graphics card",
    price: 4_650_000,
    description: "Kartu grafis desktop dengan memori khusus 8 GB.",
    specifications: ["8 GB GDDR6", "165 W"],
    powerDraw: 165,
  },
  {
    id: "ram-ddr5-32",
    name: "Corsair Vengeance 32 GB DDR5",
    category: "Memory",
    price: 1_350_000,
    description: "Kit memori dual-channel untuk motherboard DDR5.",
    specifications: ["32 GB (2 × 16 GB)", "DDR5-5600"],
    memoryType: "DDR5",
  },
  {
    id: "ram-ddr4-32",
    name: "Kingston Fury Beast 32 GB DDR4",
    category: "Memory",
    price: 950_000,
    description: "Kit memori dual-channel untuk motherboard DDR4.",
    specifications: ["32 GB (2 × 16 GB)", "DDR4-3200"],
    memoryType: "DDR4",
  },
  {
    id: "ssd-nvme-1tb",
    name: "WD Black SN770 1 TB",
    category: "Storage",
    price: 1_250_000,
    description: "Penyimpanan solid-state NVMe untuk aplikasi, gim, dan berkas.",
    specifications: ["1 TB", "M.2 NVMe"],
  },
  {
    id: "psu-650",
    name: "Cooler Master MWE 650 Bronze V2",
    category: "Power supply",
    price: 1_050_000,
    description: "Power supply 650 W untuk beragam rancangan kelas menengah.",
    specifications: ["650 W", "80 PLUS Bronze"],
    wattage: 650,
  },
  {
    id: "psu-550",
    name: "FSP HV Pro 550",
    category: "Power supply",
    price: 720_000,
    description: "Power supply 550 W untuk konfigurasi desktop sederhana.",
    specifications: ["550 W", "80 PLUS Bronze"],
    wattage: 550,
  },
  {
    id: "case-matx",
    name: "DeepCool MATREXX 40 3FS",
    category: "Case",
    price: 780_000,
    description: "Casing ringkas untuk ukuran motherboard yang lebih kecil.",
    specifications: ["Micro-ATX", "3 included fans"],
    supportedMotherboardSizes: ["Micro-ATX", "Mini-ITX"],
  },
];

const globalStore = globalThis as unknown as {
  shiinaMockProducts?: Product[];
};

export const mockProducts: Product[] =
  (globalStore.shiinaMockProducts ??= [...initialMockProducts]);

export const builderCategories: ProductCategory[] = [
  "Processor",
  "Motherboard",
  "Graphics card",
  "Memory",
  "Storage",
  "Power supply",
  "Case",
];

export const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((product) => product.id === id);
}

export function namaSudahAda(nama: string): boolean {
  const dicari = nama.trim().toLowerCase();
  return mockProducts.some((product) => product.name.toLowerCase() === dicari);
}

export function tambahKomponen(masukan: MasukanKomponen): Product {
  const slugBase = masukan.nama
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const id = slugBase || `komponen-${mockProducts.length + 1}`;
  const item: Product = {
    id,
    name: masukan.nama,
    category: masukan.kategori,
    price: masukan.harga,
    description: masukan.deskripsi,
    available: masukan.tersedia,
    specifications: [
      categoryLabels[masukan.kategori],
      masukan.tersedia ? "Tersedia" : "Stok Kosong",
    ],
  };
  mockProducts.push(item);
  return item;
}
