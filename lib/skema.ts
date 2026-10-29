import { z } from "zod";

export const kategoriKomponen = [
  "Processor",
  "Motherboard",
  "Graphics card",
  "Memory",
  "Storage",
  "Power supply",
  "Case",
] as const;

export const skemaKomponen = z.object({
  nama: z
    .string()
    .trim()
    .min(3, "Nama komponen minimal 3 karakter")
    .max(100, "Nama komponen maksimal 100 karakter"),
  kategori: z.enum(kategoriKomponen, {
    error: "Pilih salah satu kategori komponen",
  }),
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
  tersedia: z.stringbool().default(false),
});

export type MasukanKomponen = z.infer<typeof skemaKomponen>;

export const skemaMasuk = z.object({
  email: z.email("Format email tidak valid"),
  kataSandi: z.string().min(8, "Kata sandi minimal 8 karakter"),
});

