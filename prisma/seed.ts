import "dotenv/config";
import argon2 from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { dataAwalKomponen } from "./data-awal";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL belum diatur di berkas .env");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  for (const item of dataAwalKomponen) {
    const { ulasanAwal, ...dataKomponen } = item;

    // Idempotent upsert komponen berdasarkan kolom nama unik
    const komponen = await prisma.komponen.upsert({
      where: { nama: dataKomponen.nama },
      update: {
        kategori: dataKomponen.kategori,
        harga: dataKomponen.harga,
        deskripsi: dataKomponen.deskripsi,
        tersedia: dataKomponen.tersedia,
        gambar: dataKomponen.gambar ?? null,
      },
      create: dataKomponen,
    });

    // Idempotent upsert ulasan berdasarkan kunci unik gabungan [komponenId, nama]
    for (const ulasan of ulasanAwal) {
      await prisma.ulasan.upsert({
        where: {
          komponenId_nama: {
            komponenId: komponen.id,
            nama: ulasan.nama,
          },
        },
        update: {
          nilai: ulasan.nilai,
          komentar: ulasan.komentar,
        },
        create: {
          komponenId: komponen.id,
          nama: ulasan.nama,
          nilai: ulasan.nilai,
          komentar: ulasan.komentar,
        },
      },
      );
    }
  }

  // Idempotent upsert akun Admin & Pengelola (Modul 5 & Admin Console)
  const adminPasswordHash = await argon2.hash("admin123", { type: argon2.argon2id });
  await prisma.pengguna.upsert({
    where: { username: "admin" },
    update: {
      peran: "admin",
      namaLengkap: "ShiinaLab Super Admin",
    },
    create: {
      username: "admin",
      email: "admin@shiinalab.io",
      namaLengkap: "ShiinaLab Super Admin",
      passwordHash: adminPasswordHash,
      peran: "admin",
    },
  });

  const demoEmail = process.env.DEMO_EMAIL || "pengelola@contoh.ac.id";
  const demoPassword = process.env.DEMO_KATA_SANDI || "shiinalab123";
  const demoPasswordHash = await argon2.hash(demoPassword, { type: argon2.argon2id });
  await prisma.pengguna.upsert({
    where: { email: demoEmail },
    update: {
      peran: "admin",
      passwordHash: demoPasswordHash,
    },
    create: {
      username: "pengelola",
      email: demoEmail,
      namaLengkap: "Pengelola Katalog ShiinaLab",
      passwordHash: demoPasswordHash,
      peran: "admin",
    },
  });

  // Idempotent upsert akun pengguna standar (Alex Rivera)
  const alexPasswordHash = await argon2.hash("alex12345", { type: argon2.argon2id });
  const alex = await prisma.pengguna.upsert({
    where: { username: "alex" },
    update: {
      namaLengkap: "Alex Rivera",
    },
    create: {
      username: "alex",
      email: "alex@shiinalab.io",
      namaLengkap: "Alex Rivera",
      passwordHash: alexPasswordHash,
      peran: "user",
    },
  });

  // Seed rakitan contoh untuk Alex jika belum ada
  const existingBuilds = await prisma.rakitanTersimpan.count({
    where: { penggunaId: alex.id },
  });

  if (existingBuilds === 0) {
    await prisma.rakitanTersimpan.createMany({
      data: [
        {
          penggunaId: alex.id,
          nama: "White Snow Beast 4K",
          komponenJson: JSON.stringify({
            Processor: "Intel Core i9-14900K Processor (Box)",
            Motherboard: "ASUS ROG Strix Z790-A Gaming WIFI II Motherboard",
            GraphicsCard: "ASUS ROG Strix GeForce RTX 4080 (White)",
            Memory: "Corsair Dominator Titanium RGB 32GB (2x16GB)",
            Storage: "Western Digital SN850X 2TB NVMe SSD",
            PowerSupply: "Corsair RM750e 750W 80+ Gold Fully Modular",
            Case: "Lian Li O11 Dynamic EVO Mid-Tower Case",
          }),
          totalHarga: 47000000,
          estimasiWatt: 680,
        },
        {
          penggunaId: alex.id,
          nama: "Compact ITX Workstation",
          komponenJson: JSON.stringify({
            Processor: "AMD Ryzen 9 7950X3D",
            Motherboard: "MSI PRO B650M-A WiFi",
            GraphicsCard: "Gigabyte GeForce RTX 4070 Ti Aero OC",
            Memory: "Kingston FURY Beast DDR5 32GB (2x16GB) 6000MHz",
            Storage: "Samsung 980 PRO 1TB PCIe 4.0 NVMe SSD",
            PowerSupply: "Corsair RM750e 750W 80+ Gold Fully Modular",
            Case: "NZXT H5 Flow Compact ATX Mid-Tower",
          }),
          totalHarga: 33350000,
          estimasiWatt: 580,
        },
      ],
    });
  }

  const jKomponen = await prisma.komponen.count();
  const jUlasan = await prisma.ulasan.count();
  const jPengguna = await prisma.pengguna.count();
  console.log(`Seed selesai: ${jKomponen} komponen, ${jUlasan} ulasan, ${jPengguna} pengguna`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
