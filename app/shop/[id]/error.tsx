"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundaryKomponen({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Catat galat ke konsol atau sistem pemantau sesuai instruksi Modul 7
    console.error("Terjadi galat tak terduga pada halaman komponen:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl font-black">
          !
        </div>
        <h2 className="text-lg font-extrabold text-slate-900">
          Komponen Tidak Dapat Ditampilkan
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Terjadi kendala saat memuat atau memproses data komponen ini. Data mungkin telah dihapus atau basis data sedang sibuk.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
          >
            Coba Lagi
          </button>
          <Link
            href="/shop"
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    </div>
  );
}
