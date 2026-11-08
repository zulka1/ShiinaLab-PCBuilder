import argon2 from "argon2";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { buatSesi } from "@/lib/sesi";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Isi permintaan harus JSON yang valid." }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Data pendaftaran tidak valid." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : `${username}@shiinalab.io`;
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : username;
  const password = typeof body.password === "string" ? body.password : "";

  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
    return NextResponse.json(
      { error: "Username harus 3-24 karakter (huruf, angka, atau garis bawah)." },
      { status: 400 },
    );
  }

  if (password.length < 8 || password.length > 128) {
    return NextResponse.json(
      { error: "Kata sandi minimal 8 karakter." },
      { status: 400 },
    );
  }

  try {
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    const pengguna = await prisma.pengguna.create({
      data: {
        username,
        email,
        namaLengkap: fullName,
        passwordHash,
        peran: "user",
      },
    });

    await buatSesi(pengguna.id);

    return NextResponse.json(
      {
        message: "Akun berhasil dibuat.",
        user: {
          id: pengguna.id,
          username: pengguna.username,
          email: pengguna.email,
          fullName: pengguna.namaLengkap,
          role: pengguna.peran,
        },
      },
      { status: 201 },
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { error: "Username atau email sudah terdaftar." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Gagal membuat akun." },
      { status: 500 },
    );
  }
}
