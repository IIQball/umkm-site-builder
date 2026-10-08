/* eslint-disable no-console */
import { db } from "@/lib/db/client";
import { templateCategories, businessCategories } from "@/db/schema";
import { eq } from "drizzle-orm";

export const SEED_CATEGORIES = [
  { id: 'cat-otomotif', name: 'Otomotif & Aksesoris Kendaraan', slug: 'otomotif-aksesoris', description: 'Template dealer, bengkel, dan suku cadang kendaraan', icon: 'car' },
  { id: 'cat-elektronik', name: 'Elektronik & Gadget Modern', slug: 'elektronik-gadget', description: 'Template toko gadget, komputer, dan aksesoris elektronik', icon: 'smartphone' },
  { id: 'cat-agribisnis', name: 'Agribisnis & Pertanian Organik', slug: 'agribisnis-pertanian', description: 'Template hasil tani, bibit unggul, dan produk hidroponik', icon: 'sprout' },
  { id: 'cat-kosmetik', name: 'Kosmetik & Perawatan Kulit', slug: 'kosmetik-perawatan-kulit', description: 'Template klinik kecantikan, skincare, dan makeup', icon: 'sparkles' },
  { id: 'cat-kerajinan', name: 'Kerajinan Tangan & Handycraft', slug: 'kerajinan-tangan-handycraft', description: 'Template seni ukir, anyaman, dan cinderamata lokal', icon: 'palette' },
  { id: 'cat-properti', name: 'Properti, Kost & Hunian', slug: 'properti-kost-hunian', description: 'Template agen properti, kos-kosan, dan sewa villa', icon: 'home' },
  { id: 'cat-fotografi', name: 'Fotografi & Studio Kreatif', slug: 'fotografi-studio-kreatif', description: 'Template studio foto wedding, portrait, dan videografi', icon: 'camera' },
  { id: 'cat-mainan', name: 'Mainan Anak & Hobi Kreatif', slug: 'mainan-anak-hobi', description: 'Template mainan edukatif, action figure, dan hobi unik', icon: 'gamepad' },
  { id: 'cat-kesehatan', name: 'Kesehatan, Apotek & Herbal', slug: 'kesehatan-apotek-herbal', description: 'Template apotek obat, suplemen, dan ramuan tradisional', icon: 'heart-pulse' },
  { id: 'cat-wisata', name: 'Wisata, Tour & Penginapan', slug: 'wisata-tour-penginapan', description: 'Template paket wisata, glamping, dan tiket atraksi', icon: 'compass' },
  { id: 'cat-percetakan', name: 'Percetakan & Digital Print', slug: 'percetakan-digital-print', description: 'Template percetakan banner, undangan, dan merchandise', icon: 'printer' },
  { id: 'cat-laundry', name: 'Laundry & Cuci Kiloan Higienis', slug: 'laundry-cuci-kiloan', description: 'Template laundry ekspres, sepatu, dan cuci karpet', icon: 'shirt' },
  { id: 'cat-petshop', name: 'Pet Shop & Perawatan Hewan', slug: 'pet-shop-hewan', description: 'Template pakan hewan, grooming, dan klinik dokter hewan', icon: 'dog' },
  { id: 'cat-atk', name: 'Toko Buku & Alat Tulis Kantor', slug: 'buku-alat-tulis-kantor', description: 'Template novel, stationary, dan perlengkapan sekolah', icon: 'book-open' },
  { id: 'cat-furniture', name: 'Furnitur & Dekorasi Rumah', slug: 'furnitur-dekorasi-rumah', description: 'Template mebel kayu jati, sofa minimalis, dan dekorasi interior', icon: 'armchair' },
  { id: 'cat-eo', name: 'Event Organizer & Dekorasi Pesta', slug: 'event-organizer-pesta', description: 'Template planner pernikahan, panggung acara, dan sound system', icon: 'calendar' },
  { id: 'cat-cucian-kendaraan', name: 'Car Wash & Salon Kendaraan', slug: 'car-wash-salon', description: 'Template steam motor, cuci mobil hidrolik, dan nano coating', icon: 'droplets' },
  { id: 'cat-kursus', name: 'Kursus, Les & Bimbingan Belajar', slug: 'kursus-bimbingan-belajar', description: 'Template les bahasa asing, bimbel SD/SMP/SMA, dan kursus musik', icon: 'graduation-cap' },
  { id: 'cat-florist', name: 'Bunga, Buket & Florist Segar', slug: 'bunga-buket-florist', description: 'Template karangan bunga papan, buket wisuda, dan tanaman hias', icon: 'flower' },
  { id: 'cat-bengkel', name: 'Bengkel Motor & Servis Mesin', slug: 'bengkel-motor-servis', description: 'Template tune up motor, ganti oli, dan servis kelistrikan', icon: 'wrench' },
];

export async function seedCategories() {
  const now = new Date();
  for (const cat of SEED_CATEGORIES) {
    const existing = await db.query.templateCategories.findFirst({
      where: eq(templateCategories.slug, cat.slug),
    });

    if (!existing) {
      await db.insert(templateCategories).values({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        createdAt: now,
        updatedAt: now,
      });
    }

    const existingBiz = await db.query.businessCategories.findFirst({
      where: eq(businessCategories.slug, cat.slug),
    });

    if (!existingBiz) {
      await db.insert(businessCategories).values({
        id: `biz-${cat.slug}`,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        createdAt: now,
        updatedAt: now,
      });
    }
  }
}
