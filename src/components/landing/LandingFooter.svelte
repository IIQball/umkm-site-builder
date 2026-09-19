<script lang="ts">
  import { Rocket, MapPin, Book, Mail, Phone, ExternalLink, ArrowRight, ShieldCheck, Heart } from 'lucide-svelte';
  import { ALL_BANYUWANGI_DISTRICTS } from '@/components/directory/directoryDistricts';
  import { reveal } from './scrollReveal';

  const FOOTER_DISTRICTS = ALL_BANYUWANGI_DISTRICTS.slice(0, 12);
  const FOOTER_DOCS = [
    { label: 'Panduan Memulai Toko', href: '#' },
    { label: 'Cara Hubungkan WhatsApp', href: '#' },
    { label: 'FAQ Digitalisasi UMKM', href: '#' },
    { label: 'Syarat & Ketentuan', href: '#' },
    { label: 'Kebijakan Privasi', href: '#' },
  ];
</script>

<!-- Final Hero CTA Section -->
<section class="relative py-24 sm:py-32 px-4 overflow-hidden">
  <div class="max-w-5xl mx-auto">
    <div
      use:reveal={{ scale: true }}
      class="relative p-8 sm:p-14 rounded-3xl border border-[var(--lp-glass-border)] overflow-hidden shadow-2xl text-center"
      style="background: linear-gradient(135deg, rgba(0,180,216,0.12), rgba(123,44,191,0.12), rgba(230,0,126,0.08));"
    >
      <!-- Background Wireframe Landscape Texture Asset -->
      <div class="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay" aria-hidden="true">
        <img src="/landing/wireframe-landscape.jpg" alt="" class="w-full h-full object-cover" />
      </div>

      <!-- Glowing Orbs -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] rounded-full opacity-25 blur-[90px]" style="background: var(--lp-cyan);"></div>
      </div>

      <div class="relative z-10 space-y-6">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white text-xs font-bold shadow-md">
          <ShieldCheck size={14} class="text-[var(--lp-cyan)]" />
          <span>100% Gratis Selamanya untuk Warga Banyuwangi</span>
        </div>

        <h2 class="text-heading-lg text-white max-w-2xl mx-auto tracking-tight">
          Daftarkan Usahamu Sekarang. <br />
          Tampil Digital Dalam Hitungan Menit.
        </h2>

        <p class="text-body-base text-[var(--lp-text-secondary)] max-w-xl mx-auto leading-relaxed">
          Buat katalog produk WhatsApp, terbitkan domain resmi kecamatan, dan jangkau lebih banyak pelanggan di Banyuwangi.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="/auth/login?mode=register"
            class="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold text-white shadow-xl shadow-[var(--lp-cyan)]/30 hover:shadow-[var(--lp-cyan)]/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            style="background: linear-gradient(135deg, var(--lp-cyan), var(--lp-purple));"
          >
            <Rocket size={18} />
            <span>Daftarkan Usaha Sekarang — 100% Gratis</span>
            <ArrowRight size={16} />
          </a>
        </div>

        <div class="flex items-center justify-center gap-6 pt-2 text-xs text-[var(--lp-text-muted)] font-medium">
          <span>✓ Tanpa Koding</span>
          <span>•</span>
          <span>✓ Tanpa Kartu Kredit</span>
          <span>•</span>
          <span>✓ Langsung Aktif</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Footer Main -->
<footer class="border-t border-[var(--lp-card-border)] bg-[var(--lp-bg-deep)] py-16 px-4">
  <div class="max-w-6xl mx-auto">
    <div use:reveal class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
      <!-- Col 1: Brand Info -->
      <div class="lg:col-span-4 space-y-4">
        <a href="/" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[var(--lp-cyan)] to-[var(--lp-purple)] flex items-center justify-center shadow-md">
            <Rocket size={18} class="text-white stroke-[2.5]" />
          </div>
          <span class="font-bold text-base text-white group-hover:text-[var(--lp-cyan)] transition-colors">
            UMKM Builder Banyuwangi
          </span>
        </a>

        <p class="text-xs text-[var(--lp-text-muted)] leading-relaxed">
          Kawasan Digital Warga — Inisiatif platform digitalisasi UMKM Kabupaten Banyuwangi untuk kemandirian ekonomi daerah dan percepatan ekosistem digital warga.
        </p>

        <div class="flex items-center gap-2 text-xs text-[var(--lp-text-muted)] pt-2">
          <MapPin size={14} class="text-[var(--lp-cyan)]" />
          <span>Kabupaten Banyuwangi, Jawa Timur, Indonesia</span>
        </div>
      </div>

      <!-- Col 2: Directory Links -->
      <div class="lg:col-span-3 space-y-3">
        <h4 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <MapPin size={14} class="text-[var(--lp-cyan)]" />
          <span>Direktori Kecamatan</span>
        </h4>
        <div class="grid grid-cols-2 gap-x-2 gap-y-1.5">
          {#each FOOTER_DISTRICTS as d}
            <a
              href="/umkm?district={encodeURIComponent(d.name)}"
              class="text-xs text-[var(--lp-text-muted)] hover:text-[var(--lp-cyan)] transition-colors truncate"
            >
              {d.name}
            </a>
          {/each}
        </div>
      </div>

      <!-- Col 3: Documentation Links -->
      <div class="lg:col-span-3 space-y-3">
        <h4 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Book size={14} class="text-[var(--lp-purple)]" />
          <span>Dokumentasi</span>
        </h4>
        <div class="space-y-2">
          {#each FOOTER_DOCS as doc}
            <a
              href={doc.href}
              class="text-xs text-[var(--lp-text-muted)] hover:text-[var(--lp-purple)] transition-colors flex items-center gap-1.5"
            >
              <span>{doc.label}</span>
              <ExternalLink size={10} class="opacity-60" />
            </a>
          {/each}
        </div>
      </div>

      <!-- Col 4: Contact -->
      <div class="lg:col-span-2 space-y-3">
        <h4 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Mail size={14} class="text-[var(--lp-amber)]" />
          <span>Kontak Resmi</span>
        </h4>
        <div class="space-y-2.5">
          <a
            href="mailto:umkm@banyuwangikab.go.id"
            class="text-xs text-[var(--lp-text-muted)] hover:text-[var(--lp-amber)] transition-colors flex items-center gap-2 truncate"
          >
            <Mail size={13} class="shrink-0" />
            <span class="truncate">umkm@banyuwangikab.go.id</span>
          </a>
          <a
            href="tel:+623331234567"
            class="text-xs text-[var(--lp-text-muted)] hover:text-[var(--lp-amber)] transition-colors flex items-center gap-2"
          >
            <Phone size={13} class="shrink-0" />
            <span>(0333) 123-4567</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom Copyright -->
    <div class="border-t border-[var(--lp-card-border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--lp-text-muted)]">
      <p class="flex items-center gap-1">
        &copy; {new Date().getFullYear()} UMKM Site Builder Banyuwangi. Hak Cipta Dilindungi.
      </p>
      <p class="flex items-center gap-1">
        Dibuat dengan <Heart size={12} class="text-[var(--lp-magenta)] fill-[var(--lp-magenta)]" /> untuk UMKM Banyuwangi
      </p>
    </div>
  </div>
</footer>
