import argon2 from "argon2";
import { NextResponse } from "next/server";
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
    return NextResponse.json({ error: "Data login tidak valid." }, { status: 400 });
  }

  const identifier = typeof body.username === "string" ? body.username.trim() : typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!identifier || !password || password.length > 128) {
    return NextResponse.json({ error: "Email/username atau kata sandi salah." }, { status: 401 });
  }

  const pengguna = await prisma.pengguna.findFirst({
    where: {
      OR: [
        { username: { equals: identifier, mode: "insensitive" } },
        { email: { equals: identifier, mode: "insensitive" } },
      ],
    },
  });

  if (!pengguna || !(await argon2.verify(pengguna.passwordHash, password))) {
    return NextResponse.json({ error: "Email/username atau kata sandi salah." }, { status: 401 });
  }

  const sesi = await buatSesi(pengguna.id);

  return NextResponse.json({
    message: "Berhasil masuk.",
    user: {
      id: pengguna.id,
      username: pengguna.username,
      email: pengguna.email,
      fullName: pengguna.namaLengkap,
      role: sesi?.peran ?? pengguna.peran,
    },
  });
}
