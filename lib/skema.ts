import { z } from "zod";

export const kategoriKomponen = [
  "Processor",
  "Motherboard",
  "GraphicsCard",
  "Memory",
  "Storage",
  "PowerSupply",
  "Case",
  "Cooler",
] as const;

export type KategoriKomponen = (typeof kategoriKomponen)[number];

export const labelKategori: Record<KategoriKomponen, string> = {
  Processor: "Processors",
  Motherboard: "Motherboards",
  GraphicsCard: "Graphics Cards",
  Memory: "Memory (RAM)",
  Storage: "Storage (SSD)",
  PowerSupply: "Power Supply (PSU)",
  Case: "Cases",
  Cooler: "Liquid Cooling",
};

export const skemaKomponen = z.object({
  nama: z
    .string()
    .trim()
    .min(3, "Nama komponen minimal 3 karakter")
    .max(100, "Nama komponen maksimal 100 karakter"),
  kategori: z
    .string()
    .transform((val) => {
      if (val === "Graphics card") return "GraphicsCard";
      if (val === "Power supply") return "PowerSupply";
      return val;
    })
    .pipe(
      z.enum(kategoriKomponen, {
        error: "Pilih salah satu kategori komponen",
      }),
    ),
  harga: z.coerce
    .number({ error: "Harga wajib berupa angka" })
    .int("Harga harus berupa bilangan bulat")
    .min(10000, "Harga minimal Rp10.000")
    .max(100000000, "Harga maksimal Rp100.000.000"),
  deskripsi: z
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(300, "Deskripsi maksimal 300 karakter"),
  // MODUL 7 PERBAIKAN: z.stringbool() memetakan "true" -> true, "false" -> false
  tersedia: z.union([z.boolean(), z.stringbool()]).default(true),
  gambar: z.string().optional().nullable(),
});

export type MasukanKomponen = z.infer<typeof skemaKomponen>;

export const skemaUlasan = z.object({
  nama: z
    .string()
    .trim()
    .min(2, "Nama pengulas minimal 2 karakter")
    .max(60, "Nama pengulas maksimal 60 karakter"),
  nilai: z.coerce
    .number({ error: "Nilai harus berupa angka" })
    .int("Nilai harus bilangan bulat")
    .min(1, "Nilai minimal 1")
    .max(5, "Nilai maksimal 5"),
  komentar: z
    .string()
    .trim()
    .min(5, "Komentar minimal 5 karakter")
    .max(500, "Komentar maksimal 500 karakter"),
});

export type MasukanUlasan = z.infer<typeof skemaUlasan>;

export const skemaMasuk = z.object({
  email: z
    .string()
    .trim()
    .min(3, "Masukkan email atau username (minimal 3 karakter)"),
  kataSandi: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

export const skemaDaftar = z.object({
  username: z
    .string()
    .trim()
    .regex(
      /^[a-zA-Z0-9_]{3,24}$/,
      "Username harus 3-24 karakter (huruf, angka, atau garis bawah)",
    ),
  email: z.email("Format email tidak valid"),
  namaLengkap: z
    .string()
    .trim()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(80, "Nama lengkap maksimal 80 karakter"),
  kataSandi: z.string().min(8, "Kata sandi minimal 8 karakter"),
});
