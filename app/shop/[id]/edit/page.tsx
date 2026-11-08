import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SiteHeader, SiteFooter } from "@/app/components/SiteNavigation";
import { FormEditKomponen } from "./FormEditKomponen";

export const instant = false;

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditKomponenPage({ params }: EditPageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (isNaN(id)) notFound();

  const item = await prisma.komponen.findUnique({
    where: { id },
  });

  if (!item) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <SiteHeader activePage="shop" />
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block">
              Modul 7 — Form Ubah Komponen
            </span>
            <h1 className="text-2xl font-extrabold text-slate-950 mt-1">
              Edit Komponen #{item.id}
            </h1>
            <p className="text-xs text-slate-500">
              Uji coba bug validasi AI: ubah ketersediaan menjadi &quot;Tidak tersedia&quot; lalu simpan.
            </p>
          </div>

          <FormEditKomponen item={item} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
