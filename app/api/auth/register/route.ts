import argon2 from "argon2";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

  const username = body.username;
  const password = body.password;

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Username dan password wajib diisi." }, { status: 400 });
  }

  const cleanUsername = username.trim();
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(cleanUsername)) {
    return NextResponse.json(
      { error: "Username harus 3–24 karakter: huruf, angka, atau garis bawah." },
      { status: 400 },
    );
  }

  if (
    password.length < 8 ||
    password.length > 128 ||
    Buffer.byteLength(password, "utf8") > 1024
  ) {
    return NextResponse.json(
      { error: "Password harus 8–128 karakter dan maksimal 1024 byte UTF-8." },
      { status: 400 },
    );
  }

  const existingUser = db
    .prepare("SELECT id FROM users WHERE username = ?")
    .get(cleanUsername);

  if (existingUser) {
    return NextResponse.json({ error: "Username sudah digunakan." }, { status: 409 });
  }

  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

  try {
    db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)")
      .run(cleanUsername, passwordHash);
  } catch (error) {
    // Periksa lagi agar dua pendaftaran bersamaan tetap mendapat respons konflik.
    const createdByAnotherRequest = db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get(cleanUsername);

    if (createdByAnotherRequest) {
      return NextResponse.json({ error: "Username sudah digunakan." }, { status: 409 });
    }

    throw error;
  }

  return NextResponse.json({ message: "Akun berhasil dibuat." }, { status: 201 });
}