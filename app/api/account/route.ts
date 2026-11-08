import argon2 from "argon2";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bacaSesi, hapusSesi } from "@/lib/sesi";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function DELETE(request: Request) {
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
    return NextResponse.json({ error: "Data penghapusan akun tidak valid." }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  const confirmation = typeof body.confirmation === "string" ? body.confirmation.trim() : "";

  if (confirmation !== "HAPUS AKUN") {
    return NextResponse.json({ error: 'Ketik "HAPUS AKUN" untuk mengonfirmasi.' }, { status: 400 });
  }

  const pengguna = await prisma.pengguna.findUnique({
    where: { id: sesi.penggunaId },
  });

  if (!pengguna || !(await argon2.verify(pengguna.passwordHash, password))) {
    return NextResponse.json({ error: "Password konfirmasi tidak sesuai." }, { status: 401 });
  }

  await prisma.pengguna.delete({
    where: { id: sesi.penggunaId },
  });

  await hapusSesi();

  return NextResponse.json({ message: "Akun berhasil dihapus." });
}
