/* eslint-disable no-console */
import { db } from "@/lib/db/client";
import { users, stores } from "@/db/schema";
import { eq } from "drizzle-orm";

const ADMIN_ID = "JqtM1b62JYl46KUKNPp3eB5P635224Gm";

export const SEED_MERCHANTS_DATA = [
  { id: "usr-merch-01", name: "Budi Santoso", email: "merch01@binaan.id", storeName: "Bengkel Budi Motor", sub: "bengkel-budi-motor", tpl: "seed-tpl-01", biz: "biz-bengkel-motor-servis" },
  { id: "usr-merch-02", name: "Siti Aminah", email: "merch02@binaan.id", storeName: "Siti Gadget Store", sub: "siti-gadget-store", tpl: "seed-tpl-02", biz: "biz-elektronik-gadget" },
  { id: "usr-merch-03", name: "Ahmad Fauzi", email: "merch03@binaan.id", storeName: "Fauzi Kebun Hidroponik", sub: "fauzi-kebun-hidroponik", tpl: "seed-tpl-03", biz: "biz-agribisnis-pertanian" },
  { id: "usr-merch-04", name: "Dewi Lestari", email: "merch04@binaan.id", storeName: "Dewi Glow Skincare", sub: "dewi-glow-skincare", tpl: "seed-tpl-04", biz: "biz-kosmetik-perawatan-kulit" },
  { id: "usr-merch-05", name: "Rian Hidayat", email: "merch05@binaan.id", storeName: "Rian Bamboo Craft", sub: "rian-bamboo-craft", tpl: "seed-tpl-05", biz: "biz-kerajinan-tangan-handycraft" },
  { id: "usr-merch-06", name: "Eka Putri", email: "merch06@binaan.id", storeName: "Kost Putri Melati Asri", sub: "kost-putri-melati", tpl: "seed-tpl-06", biz: "biz-properti-kost-hunian" },
  { id: "usr-merch-07", name: "Bambang Pamungkas", email: "merch07@binaan.id", storeName: "Bambang Wedding Lens", sub: "bambang-wedding-lens", tpl: "seed-tpl-07", biz: "biz-fotografi-studio-kreatif" },
  { id: "usr-merch-08", name: "Fitri Handayani", email: "merch08@binaan.id", storeName: "Toko Mainan Ceria", sub: "toko-mainan-ceria", tpl: "seed-tpl-08", biz: "biz-mainan-anak-hobi" },
  { id: "usr-merch-09", name: "Hendra Gunawan", email: "merch09@binaan.id", storeName: "Apotek Sehat Barokah", sub: "apotek-sehat-barokah", tpl: "seed-tpl-09", biz: "biz-kesehatan-apotek-herbal" },
  { id: "usr-merch-10", name: "Maya Anggraini", email: "merch10@binaan.id", storeName: "Ijen Sunrise Tour", sub: "ijen-sunrise-tour", tpl: "seed-tpl-10", biz: "biz-wisata-tour-penginapan" },
  { id: "usr-merch-11", name: "Doni Prasetyo", email: "merch11@binaan.id", storeName: "Doni Digital Printing", sub: "doni-digital-printing", tpl: "seed-tpl-11", biz: "biz-percetakan-digital-print" },
  { id: "usr-merch-12", name: "Nita Septiani", email: "merch12@binaan.id", storeName: "Nita Express Laundry", sub: "nita-express-laundry", tpl: "seed-tpl-12", biz: "biz-laundry-cuci-kiloan" },
  { id: "usr-merch-13", name: "Rizky Ramadhan", email: "merch13@binaan.id", storeName: "Sahabat Satwa Petshop", sub: "sahabat-satwa-petshop", tpl: "seed-tpl-13", biz: "biz-pet-shop-hewan" },
  { id: "usr-merch-14", name: "Mega Utami", email: "merch14@binaan.id", storeName: "Toko Buku Pintar", sub: "toko-buku-pintar", tpl: "seed-tpl-14", biz: "biz-buku-alat-tulis-kantor" },
  { id: "usr-merch-15", name: "Adi Nugroho", email: "merch15@binaan.id", storeName: "Nugroho Jati Furniture", sub: "nugroho-jati-furniture", tpl: "seed-tpl-15", biz: "biz-furnitur-dekorasi-rumah" },
  { id: "usr-merch-16", name: "Indah Permata", email: "merch16@binaan.id", storeName: "Kilau Steam Motor & Mobil", sub: "kilau-steam-banyuwangi", tpl: "seed-tpl-16", biz: "biz-car-wash-salon" },
  { id: "usr-merch-17", name: "Surya Wijaya", email: "merch17@binaan.id", storeName: "Surya Party Organizer", sub: "surya-party-organizer", tpl: "seed-tpl-17", biz: "biz-event-organizer-pesta" },
  { id: "usr-merch-18", name: "Yulia Rahmawati", email: "merch18@binaan.id", storeName: "Bimbel Prestasi Juara", sub: "bimbel-prestasi-juara", tpl: "seed-tpl-18", biz: "biz-kursus-bimbingan-belajar" },
  { id: "usr-merch-19", name: "Bayu Pratama", email: "merch19@binaan.id", storeName: "Bunga Segar Florist", sub: "bunga-segar-florist", tpl: "seed-tpl-19", biz: "biz-bunga-buket-florist" },
  { id: "usr-merch-20", name: "Dian Sastrowardoyo", email: "merch20@binaan.id", storeName: "Dian Motor Sport", sub: "dian-motor-sport", tpl: "seed-tpl-20", biz: "biz-bengkel-motor-servis" },
];

export async function seedMerchants() {
  const baseDate = new Date("2026-09-22T09:00:00Z");

  for (let i = 0; i < SEED_MERCHANTS_DATA.length; i++) {
    const item = SEED_MERCHANTS_DATA[i];
    const createdAt = new Date(baseDate.getTime() + i * 3600000 * 18);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, item.id),
    });

    if (!existingUser) {
      await db.insert(users).values({
        id: item.id,
        name: item.name,
        email: item.email,
        emailVerified: true,
        role: "tenant",
        status: "active",
        registeredBy: ADMIN_ID,
        createdAt,
        updatedAt: createdAt,
      });
    }

    const storeId = `str-merch-${String(i + 1).padStart(2, "0")}`;
    const existingStore = await db.query.stores.findFirst({
      where: eq(stores.id, storeId),
    });

    if (!existingStore) {
      await db.insert(stores).values({
        id: storeId,
        name: item.storeName,
        subdomain: item.sub,
        userId: item.id,
        templateId: item.tpl,
        categoryId: item.biz,
        waNumber: `628123456${String(i + 10).padStart(4, "0")}`,
        address: `Jl. Raya Merdeka No. ${i + 10}, Banyuwangi`,
        googleMapsUrl: "https://maps.google.com/?q=-8.2192,114.3692",
        registeredBy: ADMIN_ID,
        lastEditedBy: ADMIN_ID,
        status: "active",
        customization: {},
        totalWaClicks: (i + 1) * 12,
        totalViews: (i + 1) * 85,
        createdAt,
        updatedAt: createdAt,
      });
    }
  }
}
