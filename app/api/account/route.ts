import argon2 from "argon2";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession, sessionCookieName } from "@/lib/auth";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

type PasswordRecord = { password_hash: string };

export async function DELETE(request: Request) {
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
  if (!isRecord(body) || body.confirm !== "HAPUS AKUN" || typeof body.password !== "string") {
    return NextResponse.json(
      { error: "Ketik HAPUS AKUN dan masukkan password saat ini." },
      { status: 400 },
    );
  }
  if (!body.password || body.password.length > 128 || Buffer.byteLength(body.password, "utf8") > 1024) {
    return NextResponse.json({ error: "Password saat ini salah." }, { status: 401 });
  }

  const user = db.prepare("SELECT password_hash FROM users WHERE id = ?")
    .get(session.userId) as PasswordRecord | undefined;
  if (!user || !(await argon2.verify(user.password_hash, body.password))) {
    return NextResponse.json({ error: "Password saat ini salah." }, { status: 401 });
  }

  const deleteAccount = db.transaction(() => {
    db.prepare("DELETE FROM users WHERE id = ?").run(session.userId);
  });
  deleteAccount();

  const response = NextResponse.json({ message: "Akun berhasil dihapus." });
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
