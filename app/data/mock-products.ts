import type { MasukanKomponen } from "@/lib/skema";

export type ProductCategory =
  | "Processor"
  | "Motherboard"
  | "Graphics card"
  | "GraphicsCard"
  | "Memory"
  | "Storage"
  | "Power supply"
  | "PowerSupply"
  | "Case"
  | "Cooler";

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
  image?: string;
  brand?: string;
  rating?: number;
  reviewsCount?: number;
};

export const categoryLabels: Record<ProductCategory, string> = {
  Processor: "Processors",
  Motherboard: "Motherboards",
  "Graphics card": "Graphics Cards",
  GraphicsCard: "Graphics Cards",
  Memory: "Memory",
  Storage: "Storage",
  "Power supply": "Power Supply",
  PowerSupply: "Power Supply",
  Case: "Cases",
  Cooler: "Liquid Cooling",
};

export const imagePresets = [
  { label: "ASUS ROG Strix RTX 4080 White", url: "/images/rtx-4080-white.jpg" },
  { label: "Intel Core i9-14900K Box", url: "/images/intel-i9-14900k.jpg" },
  { label: "AMD Ryzen 7000 Box", url: "/images/ryzen-box.jpg" },
  { label: "Corsair Dominator Titanium White DDR5", url: "/images/corsair-dominator-ram.jpg" },
  { label: "Kingston FURY Beast Black DDR5", url: "/images/kingston-fury-ram.jpg" },
  { label: "ASUS ROG Strix Z790-A White Motherboard", url: "/images/asus-z790-mobo.jpg" },
  { label: "MSI PRO B650M-A WiFi Motherboard", url: "/images/msi-b650m-mobo.jpg" },
  { label: "Gigabyte RTX 4070 Ti Aero White", url: "/images/rtx-4070ti-aero.jpg" },
  { label: "MSI GeForce RTX 4060 Ventus 2X", url: "/images/msi-rtx-4060.jpg" },
  { label: "Lian Li O11 Dynamic EVO White Case", url: "/images/lianli-o11-case.jpg" },
  { label: "NZXT Kraken Elite 360 RGB White AIO", url: "/images/nzxt-kraken-cooler.jpg" },
  { label: "WD_BLACK SN850X NVMe SSD", url: "/images/wd-sn850x-ssd.jpg" },
  { label: "Corsair RM Series Modular PSU", url: "/images/corsair-rm-psu.jpg" },
] as const;

export function inferProductAttributes(name: string, category: string, existingImage?: string | null) {
  const lower = name.toLowerCase();
  let brand = "ShiinaLab";
  if (lower.includes("asus") || lower.includes("rog")) brand = "ASUS";
  else if (lower.includes("intel") || lower.includes("core")) brand = "Intel";
  else if (lower.includes("amd") || lower.includes("ryzen") || lower.includes("radeon")) brand = "AMD";
  else if (lower.includes("corsair")) brand = "Corsair";
  else if (lower.includes("lian li") || lower.includes("o11")) brand = "Lian Li";
  else if (lower.includes("nzxt") || lower.includes("kraken")) brand = "NZXT";
  else if (lower.includes("msi")) brand = "MSI";
  else if (lower.includes("gigabyte") || lower.includes("aero")) brand = "Gigabyte";
  else if (lower.includes("kingston") || lower.includes("fury")) brand = "Kingston";
  else if (lower.includes("western digital") || lower.includes("wd") || lower.includes("sn850") || lower.includes("sn770")) brand = "WD";
  else if (lower.includes("samsung")) brand = "Samsung";
  else if (lower.includes("cooler master")) brand = "Cooler Master";
  else if (lower.includes("deepcool")) brand = "DeepCool";
  else if (lower.includes("sapphire")) brand = "Sapphire";
  else if (lower.includes("fsp")) brand = "FSP";

  let image = existingImage || "/images/rtx-4080-white.jpg";
  if (!existingImage) {
    if (lower.includes("4080")) image = "/images/rtx-4080-white.jpg";
    else if (lower.includes("4070")) image = "/images/rtx-4070ti-aero.jpg";
    else if (lower.includes("4060") || lower.includes("7600")) image = category === "Processor" ? "/images/ryzen-box.jpg" : "/images/msi-rtx-4060.jpg";
    else if (lower.includes("intel") || lower.includes("i9") || lower.includes("i5")) image = "/images/intel-i9-14900k.jpg";
    else if (lower.includes("ryzen") || lower.includes("amd")) image = "/images/ryzen-box.jpg";
    else if (lower.includes("z790") || lower.includes("b760")) image = "/images/asus-z790-mobo.jpg";
    else if (lower.includes("b650")) image = "/images/msi-b650m-mobo.jpg";
    else if (lower.includes("dominator")) image = "/images/corsair-dominator-ram.jpg";
    else if (lower.includes("fury") || lower.includes("vengeance") || category === "Memory") image = "/images/kingston-fury-ram.jpg";
    else if (lower.includes("kraken") || category === "Cooler") image = "/images/nzxt-kraken-cooler.jpg";
    else if (lower.includes("o11") || lower.includes("h5") || category === "Case") image = "/images/lianli-o11-case.jpg";
    else if (category === "Storage" || lower.includes("ssd") || lower.includes("nvme")) image = "/images/wd-sn850x-ssd.jpg";
    else if (category === "PowerSupply" || category === "Power supply" || lower.includes("psu") || lower.includes("rm750")) image = "/images/corsair-rm-psu.jpg";
  }

  let socket: string | undefined;
  if (lower.includes("am5") || lower.includes("7600") || lower.includes("7950") || lower.includes("b650")) {
    socket = "AM5";
  } else if (lower.includes("lga1700") || lower.includes("14900") || lower.includes("12400") || lower.includes("z790") || lower.includes("b760")) {
    socket = "LGA1700";
  }

  let memoryType: "DDR4" | "DDR5" | undefined;
  if (lower.includes("ddr4") || lower.includes("d4")) memoryType = "DDR4";
  else if (lower.includes("ddr5") || lower.includes("z790") || lower.includes("b650") || lower.includes("dominator")) memoryType = "DDR5";

  let formFactor: "ATX" | "Micro-ATX" | "Mini-ITX" | undefined;
  if (lower.includes("micro-atx") || lower.includes("b650m") || lower.includes("b760m") || lower.includes("matrexx")) {
    formFactor = "Micro-ATX";
  } else if (category === "Motherboard" || category === "Case") {
    formFactor = "ATX";
  }

  let supportedMotherboardSizes: Array<"ATX" | "Micro-ATX" | "Mini-ITX"> | undefined;
  if (category === "Case") {
    supportedMotherboardSizes = formFactor === "Micro-ATX" ? ["Micro-ATX", "Mini-ITX"] : ["ATX", "Micro-ATX", "Mini-ITX"];
  }

  let wattage: number | undefined;
  let powerDraw: number | undefined;
  if (category === "PowerSupply" || category === "Power supply") {
    if (lower.includes("850")) wattage = 850;
    else if (lower.includes("750")) wattage = 750;
    else if (lower.includes("650")) wattage = 650;
    else if (lower.includes("550")) wattage = 550;
    else wattage = 750;
  } else if (category === "Processor") {
    powerDraw = lower.includes("14900") || lower.includes("7950") ? 125 : 65;
  } else if (category === "GraphicsCard" || category === "Graphics card") {
    powerDraw = lower.includes("4080") ? 320 : lower.includes("4070") ? 285 : 115;
  } else if (category === "Motherboard") {
    powerDraw = 50;
  } else if (category === "Memory" || category === "Storage") {
    powerDraw = 15;
  } else if (category === "Cooler") {
    powerDraw = 25;
  }

  const specifications: string[] = [];
  if (socket) specifications.push(`Socket ${socket}`);
  if (memoryType) specifications.push(memoryType);
  if (formFactor && category === "Motherboard") specifications.push(formFactor);
  if (wattage) specifications.push(`${wattage}W 80+ Gold`);
  if (powerDraw && (category === "GraphicsCard" || category === "Graphics card")) {
    specifications.push(lower.includes("4080") || lower.includes("4070") ? "16GB GDDR6X" : "8GB GDDR6");
    specifications.push(`${powerDraw}W TDP`);
  }
  if (specifications.length === 0) {
    specifications.push(categoryLabels[category as ProductCategory] || category, "Official Warranty");
  }

  return {
    brand,
    image,
    socket,
    memoryType,
    formFactor,
    supportedMotherboardSizes,
    wattage,
    powerDraw,
    specifications,
  };
}

export const initialMockProducts: Product[] = [
  {
    id: "1",
    name: "ASUS ROG Strix GeForce RTX 4080 (White)",
    category: "GraphicsCard",
    price: 21_500_000,
    description: "Flagship white edition graphics card with axial-tech fans, 16GB GDDR6X, 3.2GHz boost clock, and vapor chamber cooling.",
    specifications: ["16GB GDDR6X", "3.2GHz Max Boost", "320W TDP"],
    available: true,
    powerDraw: 320,
    image: "/images/rtx-4080-white.jpg",
    brand: "ASUS",
    rating: 4.9,
    reviewsCount: 48,
  },
  {
    id: "2",
    name: "Intel Core i9-14900K Processor (Box)",
    category: "Processor",
    price: 9_450_000,
    description: "24 cores (8 P-cores + 16 E-cores) up to 6.0 GHz thermal velocity boost for uncompromising 4K gaming and 3D workstations.",
    specifications: ["Socket LGA1700", "24 Cores", "125W TDP"],
    available: true,
    socket: "LGA1700",
    powerDraw: 125,
    image: "/images/intel-i9-14900k.jpg",
    brand: "Intel",
    rating: 4.8,
    reviewsCount: 112,
  },
  {
    id: "3",
    name: "Corsair Dominator Titanium RGB 32GB (2x16GB)",
    category: "Memory",
    price: 3_450_000,
    description: "Premium forged white aluminum DDR5-6000MHz CL30 memory kit with vibrant diffused RGB top bar and DHX cooling.",
    specifications: ["DDR5-6000MHz CL30", "White", "32GB (2x16GB)"],
    available: true,
    memoryType: "DDR5",
    powerDraw: 15,
    image: "/images/corsair-dominator-ram.jpg",
    brand: "Corsair",
    rating: 4.9,
    reviewsCount: 86,
  },
  {
    id: "4",
    name: "ASUS ROG Strix Z790-A Gaming WIFI II Motherboard",
    category: "Motherboard",
    price: 5_650_000,
    description: "ATX LGA1700 motherboard with silver-white VRM heatsinks, 16+1 power stages, PCIe 5.0, DDR5, and Wi-Fi 7.",
    specifications: ["Socket LGA1700", "DDR5", "ATX White"],
    available: true,
    socket: "LGA1700",
    memoryType: "DDR5",
    formFactor: "ATX",
    powerDraw: 50,
    image: "/images/asus-z790-mobo.jpg",
    brand: "ASUS",
    rating: 4.8,
    reviewsCount: 64,
  },
  {
    id: "5",
    name: "Lian Li O11 Dynamic EVO Mid-Tower Case",
    category: "Case",
    price: 2_750_000,
    description: "Dual-chamber panoramic tempered glass mid-tower case in pure ceramic white for showcase custom builds.",
    specifications: ["Dual Chamber", "Tempered Glass", "White ATX"],
    available: true,
    formFactor: "ATX",
    supportedMotherboardSizes: ["ATX", "Micro-ATX", "Mini-ITX"],
    image: "/images/lianli-o11-case.jpg",
    brand: "Lian Li",
    rating: 4.9,
    reviewsCount: 142,
  },
  {
    id: "6",
    name: "NZXT Kraken Elite 360 RGB AIO Liquid Cooler",
    category: "Cooler",
    price: 4_450_000,
    description: "White 360mm AIO liquid cooler featuring a wide-angle 2.36-inch LCD pump display and three F120 RGB Core fans.",
    specifications: ["360mm Liquid Cooler", "LCD Display", "White"],
    available: true,
    powerDraw: 25,
    image: "/images/nzxt-kraken-cooler.jpg",
    brand: "NZXT",
    rating: 4.8,
    reviewsCount: 95,
  },
  {
    id: "7",
    name: "AMD Ryzen 9 7950X3D",
    category: "Processor",
    price: 9_850_000,
    description: "Flagship 16-core 32-thread AM5 desktop processor with 144MB 3D V-Cache technology and ultra-efficient 120W TDP.",
    specifications: ["Socket AM5", "16 Cores", "3D V-Cache"],
    available: true,
    socket: "AM5",
    powerDraw: 120,
    image: "/images/ryzen-box.jpg",
    brand: "AMD",
    rating: 4.9,
    reviewsCount: 118,
  },
  {
    id: "8",
    name: "Gigabyte GeForce RTX 4070 Ti Aero OC",
    category: "GraphicsCard",
    price: 14_250_000,
    description: "Sleek white and silver triple-fan Windforce cooling graphics card with 16GB GDDR6X and dual BIOS.",
    specifications: ["16GB GDDR6X", "White Aero", "285W TDP"],
    available: true,
    powerDraw: 285,
    image: "/images/rtx-4070ti-aero.jpg",
    brand: "Gigabyte",
    rating: 4.8,
    reviewsCount: 73,
  },
  {
    id: "9",
    name: "Western Digital SN850X 2TB NVMe SSD",
    category: "Storage",
    price: 2_450_000,
    description: "High-speed PCIe Gen4 x4 M.2 2280 NVMe SSD delivering up to 7,300 MB/s read speeds with Game Mode 2.0.",
    specifications: ["2TB M.2 NVMe", "7,300 MB/s", "PCIe 4.0"],
    available: true,
    powerDraw: 10,
    image: "/images/wd-sn850x-ssd.jpg",
    brand: "WD",
    rating: 4.9,
    reviewsCount: 130,
  },
  {
    id: "10",
    name: "AMD Ryzen 5 7600",
    category: "Processor",
    price: 3_150_000,
    description: "Prosesor desktop 6-core 12-thread socket AM5 dengan TDP 65W efisien untuk gaming 1080p dan 1440p.",
    specifications: ["Socket AM5", "65W TDP"],
    available: true,
    socket: "AM5",
    powerDraw: 65,
    image: "/images/ryzen-box.jpg",
    brand: "AMD",
    rating: 4.8,
    reviewsCount: 62,
  },
  {
    id: "11",
    name: "MSI PRO B650M-A WiFi",
    category: "Motherboard",
    price: 2_650_000,
    description: "Motherboard Micro-ATX soket AM5 dengan dukungan DDR5, heatsink VRM tebal, dan koneksi Wi-Fi 6E.",
    specifications: ["Socket AM5", "DDR5", "Micro-ATX"],
    available: true,
    socket: "AM5",
    memoryType: "DDR5",
    formFactor: "Micro-ATX",
    powerDraw: 45,
    image: "/images/msi-b650m-mobo.jpg",
    brand: "MSI",
    rating: 4.7,
    reviewsCount: 54,
  },
  {
    id: "12",
    name: "Corsair RM750e 750W 80+ Gold Fully Modular",
    category: "PowerSupply",
    price: 1_750_000,
    description: "Catu daya efisiensi tinggi 80 Plus Gold bersertifikasi Cybenetics dengan kabel modular pipih dan kipas hening.",
    specifications: ["750W", "80+ Gold", "ATX 3.0 Modular"],
    available: true,
    wattage: 750,
    image: "/images/corsair-rm-psu.jpg",
    brand: "Corsair",
    rating: 4.8,
    reviewsCount: 89,
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
  "GraphicsCard",
  "Memory",
  "Storage",
  "PowerSupply",
  "Case",
];

export const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatPrice = formatRupiah;

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
  const attrs = inferProductAttributes(masukan.nama, masukan.kategori, masukan.gambar);
  const item: Product = {
    id,
    name: masukan.nama,
    category: masukan.kategori,
    price: masukan.harga,
    description: masukan.deskripsi,
    available: masukan.tersedia,
    image: attrs.image,
    brand: attrs.brand,
    specifications: attrs.specifications,
  };
  mockProducts.push(item);
  return item;
}
