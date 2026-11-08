import type { Kategori } from "../generated/prisma/client";

export type DataAwalKomponen = {
  nama: string;
  kategori: Kategori;
  harga: number;
  deskripsi: string;
  tersedia: boolean;
  gambar?: string;
  ulasanAwal: Array<{
    nama: string;
    nilai: number;
    komentar: string;
  }>;
};

export const dataAwalKomponen: DataAwalKomponen[] = [
  {
    nama: "ASUS ROG Strix GeForce RTX 4080 (White)",
    kategori: "GraphicsCard",
    harga: 21500000,
    deskripsi: "Flagship white edition graphics card with axial-tech fans, 16GB GDDR6X, 3.2GHz boost clock, and vapor chamber cooling.",
    tersedia: true,
    gambar: "/images/rtx-4080-white.jpg",
    ulasanAwal: [
      {
        nama: "Seapher R.",
        nilai: 5,
        komentar: "Sensational cooling performance and the all-white aesthetic looks marvelous in the Lian Li O11 chassis.",
      },
      {
        nama: "Mather J.",
        nilai: 5,
        komentar: "Boost clocks stay rock solid at 2850MHz without any thermal throttling. Worth every Rupiah.",
      },
      {
        nama: "Shriila S.",
        nilai: 5,
        komentar: "Whisper quiet even under heavy 4K ray-tracing workloads and Blender rendering sessions.",
      },
    ],
  },
  {
    nama: "Intel Core i9-14900K Processor (Box)",
    kategori: "Processor",
    harga: 9450000,
    deskripsi: "24 cores (8 P-cores + 16 E-cores) up to 6.0 GHz thermal velocity boost for uncompromising 4K gaming and 3D workstations.",
    tersedia: true,
    gambar: "/images/intel-i9-14900k.jpg",
    ulasanAwal: [
      {
        nama: "Alex Rivera",
        nilai: 5,
        komentar: "Paired with a 360mm AIO liquid cooler, multi-core compile times and gaming frame pacing are unbeatable.",
      },
    ],
  },
  {
    nama: "Corsair Dominator Titanium RGB 32GB (2x16GB)",
    kategori: "Memory",
    harga: 3450000,
    deskripsi: "Premium forged white aluminum DDR5-6000MHz CL30 memory kit with vibrant diffused RGB top bar and DHX cooling.",
    tersedia: true,
    gambar: "/images/corsair-dominator-ram.jpg",
    ulasanAwal: [
      {
        nama: "Elena Rostova",
        nilai: 5,
        komentar: "XMP 3.0 profile booted first try at 6000MT/s CL30. The white finish and diffused LED bar look clean.",
      },
    ],
  },
  {
    nama: "ASUS ROG Strix Z790-A Gaming WIFI II Motherboard",
    kategori: "Motherboard",
    harga: 5650000,
    deskripsi: "ATX LGA1700 motherboard with silver-white VRM heatsinks, 16+1 power stages, PCIe 5.0, DDR5, and Wi-Fi 7.",
    tersedia: true,
    gambar: "/images/asus-z790-mobo.jpg",
    ulasanAwal: [
      {
        nama: "Marcus Vance",
        nilai: 5,
        komentar: "Best white-themed Z790 board on the market. Q-Release for the GPU slot is super convenient.",
      },
    ],
  },
  {
    nama: "Lian Li O11 Dynamic EVO Mid-Tower Case",
    kategori: "Case",
    harga: 2750000,
    deskripsi: "Dual-chamber panoramic tempered glass mid-tower case in pure ceramic white for showcase custom builds.",
    tersedia: true,
    gambar: "/images/lianli-o11-case.jpg",
    ulasanAwal: [
      {
        nama: "Daniel Kurniawan",
        nilai: 5,
        komentar: "Cable management in the rear dual chamber is effortless and the pillarless glass view is stunning.",
      },
    ],
  },
  {
    nama: "NZXT Kraken Elite 360 RGB AIO Liquid Cooler",
    kategori: "Cooler",
    harga: 4450000,
    deskripsi: "White 360mm AIO liquid cooler featuring a wide-angle 2.36-inch LCD pump display and three F120 RGB Core fans.",
    tersedia: true,
    gambar: "/images/nzxt-kraken-cooler.jpg",
    ulasanAwal: [
      {
        nama: "Reza Mahendra",
        nilai: 5,
        komentar: "Keeps my Core i9 under 72C during gaming while displaying real-time CPU/GPU telemetry on the LCD.",
      },
    ],
  },
  {
    nama: "AMD Ryzen 9 7950X3D",
    kategori: "Processor",
    harga: 9850000,
    deskripsi: "Flagship 16-core 32-thread AM5 desktop processor with 144MB 3D V-Cache technology and ultra-efficient 120W TDP.",
    tersedia: true,
    gambar: "/images/ryzen-box.jpg",
    ulasanAwal: [
      {
        nama: "Hendra Wijaya",
        nilai: 5,
        komentar: "Incredible 1% low framerates in simulation and competitive titles while drawing remarkably low power.",
      },
    ],
  },
  {
    nama: "Gigabyte GeForce RTX 4070 Ti Aero OC",
    kategori: "GraphicsCard",
    harga: 14250000,
    deskripsi: "Sleek white and silver triple-fan Windforce cooling graphics card with 16GB GDDR6X and dual BIOS.",
    tersedia: true,
    gambar: "/images/rtx-4070ti-aero.jpg",
    ulasanAwal: [
      {
        nama: "Nadia Putri",
        nilai: 5,
        komentar: "Clean silver-white industrial design, zero coil whine, and crushes 1440p ultra settings.",
      },
    ],
  },
  {
    nama: "Western Digital SN850X 2TB NVMe SSD",
    kategori: "Storage",
    harga: 2450000,
    deskripsi: "High-speed PCIe Gen4 x4 M.2 2280 NVMe SSD delivering up to 7,300 MB/s read speeds with Game Mode 2.0.",
    tersedia: true,
    gambar: "/images/wd-sn850x-ssd.jpg",
    ulasanAwal: [
      {
        nama: "Taufik Hidayat",
        nilai: 5,
        komentar: "DirectStorage games load almost instantaneously. Rock solid sustained write speeds.",
      },
    ],
  },
  {
    nama: "AMD Ryzen 5 7600",
    kategori: "Processor",
    harga: 3150000,
    deskripsi: "Prosesor desktop 6-core 12-thread socket AM5 dengan TDP 65W efisien untuk gaming 1080p dan 1440p.",
    tersedia: true,
    gambar: "/images/ryzen-box.jpg",
    ulasanAwal: [
      {
        nama: "Rian Pratama",
        nilai: 5,
        komentar: "Suhu sangat adem bahkan dengan cooler bawaan Wraith Stealth. Sangat kencang untuk gaming dan kerja ringan.",
      },
      {
        nama: "Dimas PC Build",
        nilai: 4,
        komentar: "Performa single-core mantap di socket AM5. Pastikan update BIOS motherboard terlebih dahulu agar profil RAM stabil.",
      },
    ],
  },
  {
    nama: "Intel Core i5-12400F",
    kategori: "Processor",
    harga: 2050000,
    deskripsi: "Prosesor desktop 6-core 12-thread socket LGA1700 pilihan budget terbaik tanpa iGPU terintegrasi.",
    tersedia: true,
    gambar: "/images/intel-i9-14900k.jpg",
    ulasanAwal: [
      {
        nama: "Fajar Nugraha",
        nilai: 5,
        komentar: "Harga terjangkau tapi performanya luar biasa stabil untuk game esports kompetitif dan editing video dasar.",
      },
    ],
  },
  {
    nama: "MSI PRO B650M-A WiFi",
    kategori: "Motherboard",
    harga: 2650000,
    deskripsi: "Motherboard Micro-ATX soket AM5 dengan dukungan DDR5, heatsink VRM tebal, dan koneksi Wi-Fi 6E.",
    tersedia: true,
    gambar: "/images/msi-b650m-mobo.jpg",
    ulasanAwal: [
      {
        nama: "Budi Santoso",
        nilai: 5,
        komentar: "VRM cukup dingin untuk Ryzen 5 dan 7. Wi-Fi bawaan stabil dan slot M.2 sudah dilengkapi heatsink.",
      },
    ],
  },
  {
    nama: "MSI GeForce RTX 4060 8G Ventus 2X",
    kategori: "GraphicsCard",
    harga: 5050000,
    deskripsi: "Kartu grafis arsitektur Ada Lovelace dengan dukungan DLSS 3 Frame Generation dan konsumsi daya 115W.",
    tersedia: true,
    gambar: "/images/msi-rtx-4060.jpg",
    ulasanAwal: [
      {
        nama: "Kevin Hendra",
        nilai: 4,
        komentar: "Fitur DLSS 3 Frame Generation sangat membantu di Cyberpunk 2077. Konsumsi daya irit cuma sekitar 115 Watt.",
      },
    ],
  },
  {
    nama: "Kingston FURY Beast DDR5 32GB (2x16GB) 6000MHz",
    kategori: "Memory",
    harga: 1850000,
    deskripsi: "Kit memori DDR5 performa tinggi dengan profil AMD EXPO dan Intel XMP 3.0 untuk gaming responsif.",
    tersedia: true,
    gambar: "/images/kingston-fury-ram.jpg",
    ulasanAwal: [
      {
        nama: "Eko Prasetyo",
        nilai: 5,
        komentar: "Profil AMD EXPO langsung berjalan mulus di 6000MHz CL30 tanpa perlu utak-atik timing manual.",
      },
    ],
  },
  {
    nama: "Samsung 980 PRO 1TB PCIe 4.0 NVMe SSD",
    kategori: "Storage",
    harga: 1650000,
    deskripsi: "Solid state drive M.2 NVMe berkecepatan baca hingga 7.000 MB/s untuk loading game instan dan transfer file cepat.",
    tersedia: true,
    gambar: "/images/wd-sn850x-ssd.jpg",
    ulasanAwal: [
      {
        nama: "Ari Wibowo",
        nilai: 5,
        komentar: "Kecepatan transfer data sangat kencang, booting Windows 11 hitungan detik dan game load super cepat.",
      },
    ],
  },
  {
    nama: "Corsair RM750e 750W 80+ Gold Fully Modular",
    kategori: "PowerSupply",
    harga: 1750000,
    deskripsi: "Catu daya efisiensi tinggi 80 Plus Gold bersertifikasi Cybenetics dengan kabel modular pipih dan kipas hening.",
    tersedia: true,
    gambar: "/images/corsair-rm-psu.jpg",
    ulasanAwal: [
      {
        nama: "Doni Setiawan",
        nilai: 5,
        komentar: "Kabel full modular sangat memudahkan manajemen kabel di casing kecil, kipasnya hening saat beban rendah.",
      },
    ],
  },
  {
    nama: "NZXT H5 Flow Compact ATX Mid-Tower",
    kategori: "Case",
    harga: 1350000,
    deskripsi: "Casing komputer airflow optimal dengan panel mesh berlubang dan kipas khusus pengarah udara ke GPU.",
    tersedia: true,
    gambar: "/images/lianli-o11-case.jpg",
    ulasanAwal: [
      {
        nama: "Bayu Aji",
        nilai: 5,
        komentar: "Airflow sangat bagus berkat lubang mesh depan dan kipas dedicated untuk GPU di bagian bawah cover PSU.",
      },
    ],
  },
];
