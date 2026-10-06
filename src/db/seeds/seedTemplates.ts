/* eslint-disable no-console */
import { db } from "@/lib/db/client";
import { templates } from "@/db/schema";
import { eq } from "drizzle-orm";

const DESIGNER_ID = "LvTEyKxIZkAs1qxl2lGVYE2ODzb0ZDHV";

interface SeedTemplateItem {
  id: string;
  name: string;
  slug: string;
  cat: string;
  price: number;
  status: "draft" | "pending" | "approved" | "rejected";
  desc: string;
  rejectionReason?: string;
}

export const SEED_TEMPLATES_DATA: SeedTemplateItem[] = [
  { id: "seed-tpl-01", name: "OtoSpeed Bengkel Pro", slug: "otospeed-bengkel-pro", cat: "cat-bengkel", price: 150000, status: "approved" as const, desc: "Template profil bengkel otomotif dengan fitur booking servis online" },
  { id: "seed-tpl-02", name: "GadgetHub Modern Store", slug: "gadgethub-modern-store", cat: "cat-elektronik", price: 200000, status: "approved" as const, desc: "Katalog display produk smartphone, laptop, dan garansi resmi" },
  { id: "seed-tpl-03", name: "TaniMakmur Hidroponik", slug: "tanimakmur-hidroponik", cat: "cat-agribisnis", price: 125000, status: "approved" as const, desc: "Showcase sayur organik dan bibit tanaman segar langsung dari kebun" },
  { id: "seed-tpl-04", name: "GlowAura Skincare & Spa", slug: "glowaura-skincare-spa", cat: "cat-kosmetik", price: 180000, status: "approved" as const, desc: "Katalog produk kecantikan wanita, review testimoni, dan konsultasi" },
  { id: "seed-tpl-05", name: "Nusantara Handycraft", slug: "nusantara-handycraft", cat: "cat-kerajinan", price: 95000, status: "approved" as const, desc: "Etalase kerajinan bambu, batik canting, dan anyaman tradisional" },
  { id: "seed-tpl-06", name: "KostPedia Griya Asri", slug: "kostpedia-griya-asri", cat: "cat-properti", price: 250000, status: "approved" as const, desc: "Website sewa kos-kosan eksekutif dan kontrakan keluarga bulanan" },
  { id: "seed-tpl-07", name: "LensCraft Studio Foto", slug: "lenscraft-studio-foto", cat: "cat-fotografi", price: 175000, status: "approved" as const, desc: "Portofolio fotografer wedding, prewedding, wisuda dan cetak foto" },
  { id: "seed-tpl-08", name: "PlayZone Mainan Edukasi", slug: "playzone-mainan-edukasi", cat: "cat-mainan", price: 110000, status: "approved" as const, desc: "Katalog mainan montesori kayu dan action figure hobi anak" },
  { id: "seed-tpl-09", name: "HerbalSehat Apotek", slug: "herbalsehat-apotek", cat: "cat-kesehatan", price: 140000, status: "approved" as const, desc: "Website apotek herbal, madu murni, dan obat resep terpercaya" },
  { id: "seed-tpl-10", name: "JelajahTour & Travel", slug: "jelajahtour-travel", cat: "cat-wisata", price: 220000, status: "approved" as const, desc: "Pemesanan paket tur wisata kawah bromo, ijen, dan sewa elf" },
  { id: "seed-tpl-11", name: "PrintCepat Digital Offset", slug: "printcepat-digital-offset", cat: "cat-percetakan", price: 130000, status: "approved" as const, desc: "Layanan cetak stiker label kemasan, banner, dan flyer promosi" },
  { id: "seed-tpl-12", name: "ResikLaundry Kiloan", slug: "resiklaundry-kiloan", cat: "cat-laundry", price: 90000, status: "approved" as const, desc: "Daftar harga cuci komplit, dry clean jas, dan setrika uap express" },
  { id: "seed-tpl-13", name: "MeongGuk Pet Care", slug: "meongguk-pet-care", cat: "cat-petshop", price: 160000, status: "approved" as const, desc: "Layanan salon grooming anjing kucing dan penitipan hewan liburan" },
  { id: "seed-tpl-14", name: "PenaPintar Toko Buku", slug: "penapintar-toko-buku", cat: "cat-atk", price: 85000, status: "approved" as const, desc: "Toko buku sekolah, novel best seller, dan perlengkapan kantor" },
  { id: "seed-tpl-15", name: "JatiMewah Mebel Jepara", slug: "jatimewah-mebel-jepara", cat: "cat-furniture", price: 240000, status: "approved" as const, desc: "Galeri perabot kayu jati solid, meja makan, dan sofa minimalis" },
  { id: "seed-tpl-16", name: "KilauSteam Car Wash", slug: "kilausteam-car-wash", cat: "cat-cucian-kendaraan", price: 115000, status: "approved" as const, desc: "Paket cuci salju, detailing interior, dan poles bodi kendaraan" },
  { id: "seed-tpl-17", name: "PestaRia Event Organizer", slug: "pestaria-event-organizer", cat: "cat-eo", price: 195000, status: "pending" as const, desc: "Konsep pernikahan outdoor, tenda dekorasi, dan sound system" },
  { id: "seed-tpl-18", name: "SmartGen Bimbingan Belajar", slug: "smartgen-bimbingan-belajar", cat: "cat-kursus", price: 155000, status: "pending" as const, desc: "Program bimbingan masuk perguruan tinggi dan les privat matematika" },
  { id: "seed-tpl-19", name: "BloomBlossom Toko Bunga", slug: "bloomblossom-toko-bunga", cat: "cat-florist", price: 135000, status: "rejected" as const, desc: "Buket bunga meja dan standing flower peresmian toko", rejectionReason: "Resolusi thumbnail kurang tajam dan deskripsi belum lengkap." },
  { id: "seed-tpl-20", name: "AutoSpare Part Racing", slug: "autospare-part-racing", cat: "cat-otomotif", price: 210000, status: "rejected" as const, desc: "Suku cadang motor balap dan velg racing aftermarket", rejectionReason: "Konten demo produk belum mencantumkan disclaimer garansi." },
];

export async function seedTemplates() {
  const baseDate = new Date("2026-09-20T08:00:00Z");

  for (let i = 0; i < SEED_TEMPLATES_DATA.length; i++) {
    const item = SEED_TEMPLATES_DATA[i];
    const existing = await db.query.templates.findFirst({
      where: eq(templates.id, item.id),
    });

    const createdAt = new Date(baseDate.getTime() + i * 3600000 * 24);

    const config = {
      theme: {
        colors: {
          primary: "#0284c7",
          secondary: "#0ea5e9",
          background: "#ffffff",
          textPrimary: "#0f172a",
        },
      },
      sections: [],
      schemaVersion: "1.0.0",
    };

    if (!existing) {
      await db.insert(templates).values({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.desc,
        thumbnailUrl: `https://images.unsplash.com/photo-${1550000000000 + i * 1000}?auto=format&fit=crop&w=800&q=80`,
        price: item.price,
        config,
        status: item.status,
        rejectionReason: item.rejectionReason || null,
        categoryId: item.cat,
        designerId: DESIGNER_ID,
        createdAt,
        updatedAt: createdAt,
      });
    }
  }
}
