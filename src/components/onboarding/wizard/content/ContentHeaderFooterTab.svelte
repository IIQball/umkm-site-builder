<script lang="ts">
  import type { StoreContentCustomization } from '../../onboarding.types';

  export let customization: StoreContentCustomization;
</script>

<div class="space-y-4">
  <!-- Announcement Text -->
  <div>
    <label for="announcement-text-input" class="block text-xs font-bold text-main font-heading mb-1.5">
      Teks Pengumuman Header (Top Banner)
    </label>
    <input
      id="announcement-text-input"
      type="text"
      bind:value={customization.header.announcementText}
      placeholder="Contoh: Promo Diskon 10% Khusus Pemesanan Hari Ini!"
      class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
    />
    <p class="text-3xs text-secondary mt-1 font-sans">
      Tampil di baris paling atas halaman toko Anda untuk menarik perhatian pengunjung.
    </p>
  </div>

  <!-- Logo Text / Brand Header -->
  <div>
    <label for="logo-text-input" class="block text-xs font-bold text-main font-heading mb-1.5">
      Nama Brand di Header
    </label>
    <input
      id="logo-text-input"
      type="text"
      bind:value={customization.header.logoText}
      placeholder="Nama toko Anda"
      class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
    />
  </div>

  <!-- Footer Tagline -->
  <div>
    <label for="footer-tagline-input" class="block text-xs font-bold text-main font-heading mb-1.5">
      Tagline / Slogan Footer
    </label>
    <textarea
      id="footer-tagline-input"
      bind:value={customization.footer.tagline}
      rows="2"
      placeholder="Slogan atau deskripsi singkat toko di footer..."
      class="w-full bg-card text-main border border-light rounded-xl p-3 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
    ></textarea>
  </div>

  <!-- Footer Address -->
  <div>
    <label for="footer-address-input" class="block text-xs font-bold text-main font-heading mb-1.5">
      Alamat Lengkap di Footer
    </label>
    <input
      id="footer-address-input"
      type="text"
      bind:value={customization.footer.address}
      placeholder="Jl. Merdeka No. 45, Banyuwangi"
      class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
    />
  </div>
</div>
