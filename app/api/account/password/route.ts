import argon2 from "argon2";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession, sessionCookieName } from "@/lib/auth";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

type PasswordRecord = { password_hash: string };

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
    return NextResponse.json({ error: "Data password tidak valid." }, { status: 400 });
  }

  const currentPassword = body.currentPassword;
  const newPassword = body.newPassword;
  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    return NextResponse.json({ error: "Isi password saat ini dan password baru." }, { status: 400 });
  }
  if (
    !currentPassword ||
    currentPassword.length > 128 ||
    Buffer.byteLength(currentPassword, "utf8") > 1024
  ) {
    return NextResponse.json({ error: "Password saat ini salah." }, { status: 401 });
  }
  if (
    newPassword.length < 8 ||
    newPassword.length > 128 ||
    Buffer.byteLength(newPassword, "utf8") > 1024
  ) {
    return NextResponse.json(
      { error: "Password baru harus 8–128 karakter." },
      { status: 400 },
    );
  }

  const user = db.prepare("SELECT password_hash FROM users WHERE id = ?")
    .get(session.userId) as PasswordRecord | undefined;
  if (!user || !(await argon2.verify(user.password_hash, currentPassword))) {
    return NextResponse.json({ error: "Password saat ini salah." }, { status: 401 });
  }

  const passwordHash = await argon2.hash(newPassword, { type: argon2.argon2id });
  const updatePassword = db.transaction(() => {
    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?")
      .run(passwordHash, session.userId);
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(session.userId);
  });
  updatePassword();

  const response = NextResponse.json({
    message: "Password diganti. Silakan masuk kembali.",
  });
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
