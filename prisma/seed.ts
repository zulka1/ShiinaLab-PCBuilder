import "dotenv/config";
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
      update: {},
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
        update: {},
        create: {
          komponenId: komponen.id,
          nama: ulasan.nama,
          nilai: ulasan.nilai,
          komentar: ulasan.komentar,
        },
      });
    }
  }

  const jKomponen = await prisma.komponen.count();
  const jUlasan = await prisma.ulasan.count();
  console.log(`Seed selesai: ${jKomponen} komponen, ${jUlasan} ulasan`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
