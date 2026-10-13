import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  const user = db.prepare(`
    SELECT username, full_name AS fullName, email
    FROM users
    WHERE id = ?
  `).get(session.userId);

  if (!user) {
    return NextResponse.json({ error: "Akun tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
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
      { error: "Username harus 3–24 karakter: huruf, angka, atau garis bawah." },
      { status: 400 },
    );
  }
  if (fullName.length > 80) {
    return NextResponse.json({ error: "Nama maksimal 80 karakter." }, { status: 400 });
  }
  if (email.length > 254 || (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
  }

  const conflictingUser = db.prepare(`
    SELECT id FROM users
    WHERE id != ? AND (
      username = ? OR (? != '' AND email = ? COLLATE NOCASE)
    )
  `).get(session.userId, username, email, email);

  if (conflictingUser) {
    return NextResponse.json(
      { error: "Username atau email sudah digunakan akun lain." },
      { status: 409 },
    );
  }

  try {
    db.prepare(`
      UPDATE users
      SET username = ?, full_name = ?, email = ?
      WHERE id = ?
    `).run(username, fullName || null, email || null, session.userId);
  } catch (error) {
    const conflictAfterCheck = db.prepare(`
      SELECT id FROM users
      WHERE id != ? AND (
        username = ? OR (? != '' AND email = ? COLLATE NOCASE)
      )
    `).get(session.userId, username, email, email);

    if (conflictAfterCheck) {
      return NextResponse.json(
        { error: "Username atau email sudah digunakan akun lain." },
        { status: 409 },
      );
    }

    throw error;
  }

  return NextResponse.json({ message: "Profil berhasil diperbarui." });
}
