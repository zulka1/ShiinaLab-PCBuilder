import argon2 from "argon2";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bacaSesi } from "@/lib/sesi";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function PATCH(request: Request) {
  const sesi = await bacaSesi();
  if (!sesi) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Isi permintaan harus JSON yang valid." }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Data perubahan password tidak valid." }, { status: 400 });
  }

  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Password saat ini dan password baru wajib diisi." }, { status: 400 });
  }
  if (newPassword.length < 8 || newPassword.length > 128) {
    return NextResponse.json({ error: "Password baru minimal 8 karakter." }, { status: 400 });
  }
  if (currentPassword === newPassword) {
    return NextResponse.json({ error: "Password baru harus berbeda dari password saat ini." }, { status: 400 });
  }

  const pengguna = await prisma.pengguna.findUnique({
    where: { id: sesi.penggunaId },
  });

  if (!pengguna || !(await argon2.verify(pengguna.passwordHash, currentPassword))) {
    return NextResponse.json({ error: "Password saat ini tidak sesuai." }, { status: 401 });
  }

  const newPasswordHash = await argon2.hash(newPassword, { type: argon2.argon2id });

  await prisma.$transaction([
    prisma.pengguna.update({
      where: { id: sesi.penggunaId },
      data: { passwordHash: newPasswordHash },
    }),
    prisma.sesiPengguna.deleteMany({
      where: { penggunaId: sesi.penggunaId, id: { not: sesi.id } },
    }),
  ]);

  return NextResponse.json({ message: "Password berhasil diperbarui." });
}
