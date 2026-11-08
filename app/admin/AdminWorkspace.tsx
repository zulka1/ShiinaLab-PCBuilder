"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { formatRupiah, imagePresets, type ProductCategory } from "../data/mock-products";
import { editKomponenAdmin, hapusKomponenAdmin, tambahKomponenAdmin, toggleStokKomponen } from "./actions";

type ComponentItem = {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  deskripsi: string;
  tersedia: boolean;
  gambar: string | null;
  dibuatPada: Date | string;
};

export function AdminWorkspace({
  initialComponents,
  totalBuildsCount = 4,
}: {
  initialComponents: ComponentItem[];
  totalBuildsCount?: number;
}) {
  const [components, setComponents] = useState<ComponentItem[]>(initialComponents);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<ComponentItem | null>(null);
  const [selectedPresetImage, setSelectedPresetImage] = useState<string>(imagePresets[0].url);
  const [editImage, setEditImage] = useState<string>("");
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Telemetry Metrics
  const totalComponents = components.length;
  const outOfStockCount = components.filter((c) => !c.tersedia).length;
  const totalValue = components.reduce((acc, c) => acc + c.harga, 0);

  // Filtered List
  const filtered = components.filter((c) => {
    const matchesSearch = c.nama.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "all" || c.kategori === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleToggleStock = (id: number, current: boolean) => {
    startTransition(async () => {
      const next = !current;
      setComponents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, tersedia: next } : c)),
      );
      const res = await toggleStokKomponen(id, next);
      if (res.error) {
        setErrorNotice(res.error);
        // revert
        setComponents((prev) =>
          prev.map((c) => (c.id === id ? { ...c, tersedia: current } : c)),
        );
      }
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" from PostgreSQL?`)) return;

    startTransition(async () => {
      setComponents((prev) => prev.filter((c) => c.id !== id));
      const res = await hapusKomponenAdmin(id);
      if (res.error) {
        setErrorNotice(res.error);
      } else {
        setSuccessNotice(`Component "${name}" removed from database.`);
        setTimeout(() => setSuccessNotice(null), 3000);
      }
    });
  };

  const handleStartEdit = (item: ComponentItem) => {
    setEditingComponent(item);
    setEditImage(item.gambar || imagePresets[0].url);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorNotice(null);
    const formData = new FormData(e.currentTarget);
    formData.set("gambar", selectedPresetImage);

    startTransition(async () => {
      const res = await tambahKomponenAdmin(formData);
      if (res.error) {
        setErrorNotice(res.error);
      } else if (res.item) {
        setComponents((prev) => [res.item as ComponentItem, ...prev]);
        setIsAddModalOpen(false);
        setSuccessNotice("New hardware component published successfully!");
        setTimeout(() => setSuccessNotice(null), 3000);
      }
    });
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingComponent) return;
    setErrorNotice(null);
    const formData = new FormData(e.currentTarget);
    formData.set("id", String(editingComponent.id));
    formData.set("gambar", editImage);

    startTransition(async () => {
      const res = await editKomponenAdmin(formData);
      if (res.error) {
        setErrorNotice(res.error);
      } else if (res.item) {
        const updated = res.item as ComponentItem;
        setComponents((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c)),
        );
        setEditingComponent(null);
        setSuccessNotice(`Component "${updated.nama}" updated successfully!`);
        setTimeout(() => setSuccessNotice(null), 3000);
      }
    });
  };

  return (
    <div className="w-full space-y-8">
      {/* NOTIFICATIONS */}
      {errorNotice && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-between">
          <span>{errorNotice}</span>
          <button type="button" onClick={() => setErrorNotice(null)}>✕</button>
        </div>
      )}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <span>{successNotice}</span>
          <button type="button" onClick={() => setSuccessNotice(null)}>✕</button>
        </div>
      )}

      {/* TOP HEADER: TITLE & ADD BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry, hardware catalog inventory, and PostgreSQL persistence.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <span>+ Add New Component</span>
        </button>
      </div>

      {/* 4 TELEMETRY METRIC CARDS - EXACT MATCH TO MOCKUP 6 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CARD 1: TOTAL COMPONENTS */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Components
            </span>
            <strong className="text-3xl font-extrabold text-slate-950 block mt-1">
              {totalComponents}
            </strong>
          </div>
          <svg className="w-full h-8 text-blue-500/40" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path
              d="M0 20 Q 25 5, 50 15 T 100 10 L 100 25 L 0 25 Z"
              fill="currentColor"
              opacity="0.2"
            />
            <path
              d="M0 20 Q 25 5, 50 15 T 100 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* CARD 2: ACTIVE BUILDS */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Active Builds
              </span>
              <strong className="text-3xl font-extrabold text-slate-950 block mt-1">
                {totalBuildsCount}
              </strong>
            </div>
            <span className="text-emerald-500 text-lg">⚡</span>
          </div>
          <svg className="w-full h-8 text-emerald-500/40" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path
              d="M0 22 Q 30 8, 60 16 T 100 6 L 100 25 L 0 25 Z"
              fill="currentColor"
              opacity="0.2"
            />
            <path
              d="M0 22 Q 30 8, 60 16 T 100 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* CARD 3: OUT OF STOCK ALERTS */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Out of Stock Alerts
              </span>
              <strong className="text-3xl font-extrabold text-slate-950 block mt-1">
                {outOfStockCount}
              </strong>
            </div>
            <span className="text-amber-500 text-lg">⚠️</span>
          </div>
          <svg className="w-full h-8 text-amber-500/40" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path
              d="M0 15 Q 20 22, 50 10 T 100 18 L 100 25 L 0 25 Z"
              fill="currentColor"
              opacity="0.2"
            />
            <path
              d="M0 15 Q 20 22, 50 10 T 100 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* CARD 4: TOTAL VALUE */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Inventory Value
            </span>
            <strong className="text-2xl font-extrabold text-slate-950 block mt-1 truncate">
              {formatRupiah(totalValue)}
            </strong>
          </div>
          <svg className="w-full h-8 text-cyan-500/40" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path
              d="M0 18 Q 35 2, 70 14 T 100 5 L 100 25 L 0 25 Z"
              fill="currentColor"
              opacity="0.2"
            />
            <path
              d="M0 18 Q 35 2, 70 14 T 100 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      </section>

      {/* INVENTORY TABLE PANEL - EXACT MATCH TO MOCKUP 6 */}
      <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        {/* SEARCH & FILTER BAR */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Hardware Catalog ({filtered.length})
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product..."
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-64"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Processor">Processors</option>
              <option value="GraphicsCard">Graphics Cards</option>
              <option value="Motherboard">Motherboards</option>
              <option value="Memory">Memory</option>
              <option value="Storage">Storage</option>
              <option value="Case">Cases</option>
              <option value="Cooler">Liquid Cooling</option>
              <option value="PowerSupply">Power Supply</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-5 w-10">
                  <input type="checkbox" className="rounded border-slate-300 w-3.5 h-3.5" />
                </th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-5">
                    <input type="checkbox" className="rounded border-slate-300 w-3.5 h-3.5" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                        <Image
                          src={item.gambar || "/images/rtx-4080-white.jpg"}
                          alt={item.nama}
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/shop/${item.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 truncate block max-w-xs sm:max-w-md"
                        >
                          {item.nama}
                        </Link>
                        <span className="text-[10px] text-slate-400">ID: #{item.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {item.kategori}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleStock(item.id, item.tersedia)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                        item.tersedia ? "bg-emerald-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out mt-0.5 ${
                          item.tersedia ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {formatRupiah(item.harga)}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold transition text-xs flex items-center gap-1"
                        title="Edit Component"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                      <Link
                        href={`/shop/${item.id}`}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition"
                        title="View Details"
                      >
                        ↗
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.nama)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                        title="Delete from PostgreSQL"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* EDIT COMPONENT MODAL */}
      {editingComponent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-950">
                  Edit Component SKU #{editingComponent.id}
                </h3>
                <p className="text-xs text-slate-500">
                  Update hardware specifications, price, or image asset in PostgreSQL.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingComponent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Name
                </label>
                <input
                  name="nama"
                  type="text"
                  required
                  defaultValue={editingComponent.nama}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    name="kategori"
                    required
                    defaultValue={editingComponent.kategori}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Processor">Processor</option>
                    <option value="GraphicsCard">Graphics Card</option>
                    <option value="Motherboard">Motherboard</option>
                    <option value="Memory">Memory</option>
                    <option value="Storage">Storage</option>
                    <option value="Case">Case</option>
                    <option value="Cooler">Liquid Cooling</option>
                    <option value="PowerSupply">Power Supply</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price (Rupiah)
                  </label>
                  <input
                    name="harga"
                    type="number"
                    required
                    min={10000}
                    defaultValue={editingComponent.harga}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  name="deskripsi"
                  rows={3}
                  required
                  defaultValue={editingComponent.deskripsi}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* IMAGE SELECTION OR CUSTOM PATH */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="/images/... or https://..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <span className="block text-[11px] font-bold text-slate-500 mb-1.5">
                  Or select preset image:
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-32 overflow-y-auto p-1.5 border border-slate-200 rounded-xl">
                  {imagePresets.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setEditImage(preset.url)}
                      className={`relative w-full aspect-square rounded-lg border p-1 overflow-hidden transition ${
                        editImage === preset.url
                          ? "border-blue-600 ring-2 ring-blue-100 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      title={preset.label}
                    >
                      <Image
                        src={preset.url}
                        alt={preset.label}
                        fill
                        sizes="60px"
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  name="tersedia"
                  type="checkbox"
                  id="modal-edit-tersedia"
                  defaultChecked={editingComponent.tersedia}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="modal-edit-tersedia" className="text-xs font-bold text-slate-700">
                  Ready in Inventory (In Stock)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingComponent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {isPending ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD COMPONENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-950">
                  Add New Component
                </h3>
                <p className="text-xs text-slate-500">
                  Publish a new hardware SKU directly into PostgreSQL.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Name
                </label>
                <input
                  name="nama"
                  type="text"
                  required
                  placeholder="e.g. Gigabyte GeForce RTX 4070 Ti Aero OC"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    name="kategori"
                    required
                    defaultValue="GraphicsCard"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Processor">Processor</option>
                    <option value="GraphicsCard">Graphics Card</option>
                    <option value="Motherboard">Motherboard</option>
                    <option value="Memory">Memory</option>
                    <option value="Storage">Storage</option>
                    <option value="Case">Case</option>
                    <option value="Cooler">Liquid Cooling</option>
                    <option value="PowerSupply">Power Supply</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price (Rupiah)
                  </label>
                  <input
                    name="harga"
                    type="number"
                    required
                    min={10000}
                    defaultValue={15000000}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  name="deskripsi"
                  rows={2}
                  required
                  placeholder="Technical specifications, clock speeds, and warranty terms..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* IMAGE PRESET SELECTOR */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Visual Image Preset (HD Studio Photos)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-200 rounded-xl">
                  {imagePresets.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setSelectedPresetImage(preset.url)}
                      className={`relative w-full aspect-square rounded-lg border p-1 overflow-hidden transition ${
                        selectedPresetImage === preset.url
                          ? "border-blue-600 ring-2 ring-blue-100 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      title={preset.label}
                    >
                      <Image
                        src={preset.url}
                        alt={preset.label}
                        fill
                        sizes="60px"
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  name="tersedia"
                  type="checkbox"
                  id="modal-tersedia"
                  defaultChecked
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="modal-tersedia" className="text-xs font-bold text-slate-700">
                  Ready in Inventory (Available for immediate build)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {isPending ? "Publishing SKU..." : "Save to PostgreSQL"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
