import argon2 from "argon2";
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashSessionToken, sessionCookieName } from "@/lib/auth";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

type UserCredential = {
  id: number;
  username: string;
  password_hash: string;
};

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

  const username = body.username;
  const password = body.password;

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password ||
    password.length > 128 ||
    Buffer.byteLength(password, "utf8") > 1024
  ) {
    return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
  }

  const user = db
    .prepare("SELECT id, username, password_hash FROM users WHERE username = ?")
    .get(username.trim()) as UserCredential | undefined;

  if (!user || !(await argon2.verify(user.password_hash, password))) {
    return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
  }

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  db.prepare(`
    INSERT INTO sessions (user_id, token_hash, expires_at)
    VALUES (?, ?, ?)
  `).run(user.id, hashSessionToken(token), expiresAt.toISOString());

  const response = NextResponse.json({ message: "Berhasil masuk." });
  response.cookies.set(sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return response;
}