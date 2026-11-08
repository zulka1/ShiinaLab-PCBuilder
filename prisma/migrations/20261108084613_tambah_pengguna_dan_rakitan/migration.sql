-- AlterEnum
ALTER TYPE "Kategori" ADD VALUE 'Cooler';

-- CreateTable
CREATE TABLE "Pengguna" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "namaLengkap" TEXT,
    "passwordHash" TEXT NOT NULL,
    "peran" TEXT NOT NULL DEFAULT 'user',
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SesiPengguna" (
    "id" TEXT NOT NULL,
    "penggunaId" INTEGER NOT NULL,
    "kedaluwarsa" TIMESTAMP(3) NOT NULL,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SesiPengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RakitanTersimpan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "komponenJson" TEXT NOT NULL,
    "totalHarga" INTEGER NOT NULL,
    "estimasiWatt" INTEGER NOT NULL,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "penggunaId" INTEGER NOT NULL,

    CONSTRAINT "RakitanTersimpan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pengguna_username_key" ON "Pengguna"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Pengguna_email_key" ON "Pengguna"("email");

-- AddForeignKey
ALTER TABLE "SesiPengguna" ADD CONSTRAINT "SesiPengguna_penggunaId_fkey" FOREIGN KEY ("penggunaId") REFERENCES "Pengguna"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RakitanTersimpan" ADD CONSTRAINT "RakitanTersimpan_penggunaId_fkey" FOREIGN KEY ("penggunaId") REFERENCES "Pengguna"("id") ON DELETE CASCADE ON UPDATE CASCADE;
