export type Kategori =
  | "Processor"
  | "Motherboard"
  | "GraphicsCard"
  | "Memory"
  | "Storage"
  | "PowerSupply"
  | "Case"
  | "Cooler";

export interface UlasanItem {
  id: number;
  nama: string;
  nilai: number;
  komentar: string;
  dibuatPada: Date | string;
}

export interface ItemKomponen {
  id: number;
  nama: string;
  kategori: Kategori;
  harga: number;
  deskripsi: string;
  tersedia: boolean;
  gambar: string | null;
  dibuatPada?: Date | string;
  ulasan?: UlasanItem[];
}
