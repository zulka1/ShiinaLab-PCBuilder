"use client";

import Link from "next/link";

export default function GalatUji({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page-container py-16 text-center">
      <div
        role="alert"
        className="max-w-md mx-auto p-6 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-200 space-y-4"
      >
        <div className="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center mx-auto text-xl">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-white">Data uji gagal dimuat.</h2>
        <div className="bg-black/40 rounded-lg p-3 text-left font-mono text-xs text-red-300 space-y-1">
          <p><strong>Pesan:</strong> {error.message || "An unexpected error occurred."}</p>
          {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="button button-primary text-xs"
          >
            Coba lagi
          </button>
          <Link href="/" className="button button-quiet text-xs">
            Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
