-- CreateEnum
CREATE TYPE "Kategori" AS ENUM ('Processor', 'Motherboard', 'GraphicsCard', 'Memory', 'Storage', 'PowerSupply', 'Case');

-- CreateTable
CREATE TABLE "Komponen" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" "Kategori" NOT NULL,
    "harga" INTEGER NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "tersedia" BOOLEAN NOT NULL DEFAULT true,
    "gambar" TEXT,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Komponen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ulasan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL,
    "komentar" TEXT NOT NULL,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "komponenId" INTEGER NOT NULL,

    CONSTRAINT "Ulasan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Komponen_nama_key" ON "Komponen"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Ulasan_komponenId_nama_key" ON "Ulasan"("komponenId", "nama");

-- AddForeignKey
ALTER TABLE "Ulasan" ADD CONSTRAINT "Ulasan_komponenId_fkey" FOREIGN KEY ("komponenId") REFERENCES "Komponen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
