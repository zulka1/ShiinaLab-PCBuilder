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
    nama: "AMD Ryzen 5 7600",
    kategori: "Processor",
    harga: 3150000,
    deskripsi: "Prosesor desktop 6-core 12-thread socket AM5 dengan TDP 65W efisien untuk gaming 1080p.",
    tersedia: true,
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
    ulasanAwal: [
      {
        nama: "Bayu Aji",
        nilai: 5,
        komentar: "Airflow sangat bagus berkat lubang mesh depan dan kipas dedicated untuk GPU di bagian bawah cover PSU.",
      },
    ],
  },
];
