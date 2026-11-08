import { NextResponse } from "next/server";
import { hapusSesi } from "@/lib/sesi";

export async function POST() {
  await hapusSesi();
  return NextResponse.json({ message: "Berhasil keluar." });
}

export async function GET(request: Request) {
  await hapusSesi();
  return NextResponse.redirect(new URL("/", request.url));
}
