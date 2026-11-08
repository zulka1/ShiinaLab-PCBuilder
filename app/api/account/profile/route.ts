import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { bacaSesi } from "@/lib/sesi";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET() {
  const sesi = await bacaSesi();
  if (!sesi) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: sesi.penggunaId,
      username: sesi.username,
      fullName: sesi.namaLengkap,
      email: sesi.email,
      role: sesi.peran,
    },
  });
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
    return NextResponse.json({ error: "Data profil tidak valid." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
    return NextResponse.json(
      { error: "Username harus 3-24 karakter: huruf, angka, atau garis bawah." },
      { status: 400 },
    );
  }
  if (fullName.length > 80) {
    return NextResponse.json({ error: "Nama maksimal 80 karakter." }, { status: 400 });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
  }

  try {
    await prisma.pengguna.update({
      where: { id: sesi.penggunaId },
      data: {
        username,
        namaLengkap: fullName || null,
        email,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { error: "Username atau email sudah digunakan akun lain." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Gagal memperbarui profil." }, { status: 500 });
  }

  return NextResponse.json({ message: "Profil berhasil diperbarui." });
}
