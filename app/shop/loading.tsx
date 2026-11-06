export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-neutral-300 font-medium text-lg">Memuat katalog komponen...</p>
      <p className="text-sm text-neutral-500 mt-1">Mengambil data terbaru dari PostgreSQL</p>
    </div>
  );
}
