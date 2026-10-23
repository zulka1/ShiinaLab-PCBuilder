// app/uji/loading.tsx
export default function MemuatUji() {
  return (
    <div className="page-container py-16 text-center">
      <div className="inline-block p-6 rounded-xl bg-neutral-900/80 border border-neutral-800">
        <p role="status" className="text-amber-300 font-medium text-lg animate-pulse">
          ⏳ Memuat data uji…
        </p>
        <p className="text-xs text-neutral-500 mt-2">
          Komponen loading.tsx sedang aktif menangani streaming segmen /uji
        </p>
      </div>
    </div>
  );
}
