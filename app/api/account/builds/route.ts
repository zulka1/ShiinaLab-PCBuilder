import { NextResponse } from "next/server";
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

  const rows = await prisma.rakitanTersimpan.findMany({
    where: { penggunaId: sesi.penggunaId },
    orderBy: { dibuatPada: "desc" },
  });

  const builds = rows.map((r) => {
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(r.komponenJson || "[]");
    } catch {
      parsed = [];
    }

    let komponenList: string[] = [];
    let componentsMap: Record<string, string> = {};

    if (Array.isArray(parsed)) {
      komponenList = parsed.map(String);
      parsed.forEach((item, idx) => {
        componentsMap[`Part ${idx + 1}`] = String(item);
      });
    } else if (parsed && typeof parsed === "object") {
      componentsMap = parsed as Record<string, string>;
      komponenList = Object.entries(componentsMap).map(([k, v]) => `${k}: ${v}`);
    }

    return {
      id: r.id,
      nama: r.nama,
      name: r.nama,
      komponen: komponenList,
      components: componentsMap,
      total: r.totalHarga,
      totalPrice: r.totalHarga,
      watt: r.estimasiWatt,
      estimatedWattage: r.estimasiWatt,
      dibuatPada: r.dibuatPada.toISOString(),
      createdAt: r.dibuatPada.toISOString(),
    };
  });

  return NextResponse.json({ builds });
}

export async function POST(request: Request) {
  const sesi = await bacaSesi();
  if (!sesi) {
    return NextResponse.json(
      { error: "Please sign in first to save your PC build to your account." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Invalid build payload." }, { status: 400 });
  }

  const rawName = body.nama ?? body.name;
  const name = typeof rawName === "string" && rawName.trim() ? rawName.trim().slice(0, 80) : "Custom Rig Blueprint";

  const rawComponents = body.komponen ?? body.components;
  let componentsToStore: unknown = [];
  if (Array.isArray(rawComponents) || isRecord(rawComponents)) {
    componentsToStore = rawComponents;
  }

  const rawTotal = body.total ?? body.totalPrice;
  const totalPrice = typeof rawTotal === "number" ? Math.round(rawTotal) : 0;

  const rawWatt = body.watt ?? body.estimatedWattage;
  const estimatedWattage = typeof rawWatt === "number" ? Math.round(rawWatt) : 650;

  const created = await prisma.rakitanTersimpan.create({
    data: {
      penggunaId: sesi.penggunaId,
      nama: name,
      komponenJson: JSON.stringify(componentsToStore),
      totalHarga: totalPrice,
      estimasiWatt: estimatedWattage,
    },
  });

  return NextResponse.json(
    {
      message: "Build saved to your account.",
      build: {
        id: created.id,
        nama: created.nama,
        name: created.nama,
        komponen: Array.isArray(componentsToStore) ? componentsToStore : Object.entries(componentsToStore as Record<string, string>).map(([k, v]) => `${k}: ${v}`),
        total: created.totalHarga,
        totalPrice: created.totalHarga,
        watt: created.estimasiWatt,
        estimatedWattage: created.estimasiWatt,
        dibuatPada: created.dibuatPada.toISOString(),
        createdAt: created.dibuatPada.toISOString(),
      },
    },
    { status: 201 },
  );
}

export async function DELETE(request: Request) {
  const sesi = await bacaSesi();
  if (!sesi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid build ID." }, { status: 400 });
  }

  await prisma.rakitanTersimpan.deleteMany({
    where: { id, penggunaId: sesi.penggunaId },
  });

  return NextResponse.json({ message: "Build deleted." });
}
