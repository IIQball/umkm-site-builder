<script lang="ts">
  import { Star, Quote, HeartHandshake } from 'lucide-svelte';
  import { reveal } from './scrollReveal';

  const TESTIMONIALS = [
    {
      name: 'Bu Yuni',
      role: 'Pemilik Warung Osing, Glagah',
      text: 'Sekarang pelanggan bisa lihat menu dan pesan lewat website langsung masuk ke WhatsApp saya. Omzet bulanan naik 40%!',
      rating: 5,
      avatarBg: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'Pak Slamet',
      role: 'Petani & Kedai Kopi, Songgon',
      text: 'Dulu cuma jualan offline. Sekarang website saya sudah dibagikan di sosial media. Sangat membantu tanpa perlu bayar mahal.',
      rating: 5,
      avatarBg: 'from-amber-500 to-orange-600',
    },
    {
      name: 'Mbak Rina',
      role: 'Pengrajin Batik, Rogojampi',
      text: 'No-code builder-nya gampang sekali! Tinggal isi foto batik, atur warna tema, langsung terbit domain usaha saya.',
      rating: 5,
      avatarBg: 'from-purple-500 to-pink-600',
    },
    {
      name: 'Pak Hadi',
      role: 'Toko Oleh-Oleh, Kota Banyuwangi',
      text: 'Wisatawan luar daerah sering pesan paket oleh-oleh lewat website sebelum sampai Banyuwangi. Praktis sekali.',
      rating: 5,
      avatarBg: 'from-emerald-500 to-teal-600',
    },
    {
      name: 'Bu Darmi',
      role: 'Keripik Tempe, Genteng',
      text: 'Awalnya saya kira susah bikin website. Ternyata dalam 5 menit toko keripik tempe saya sudah punya link resmi.',
      rating: 5,
      avatarBg: 'from-rose-500 to-red-600',
    },
    {
      name: 'Mas Agung',
      role: 'Ijen Roastery, Licin',
      text: 'Tampilan websitenya sangat modern dan cepat dibuka di HP pembeli. Tombol pesanan WhatsApp-nya langsung terformat rapi.',
      rating: 5,
      avatarBg: 'from-cyan-500 to-blue-600',
    },
  ];

  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];
</script>

<section id="testimonials" class="relative py-24 sm:py-32 overflow-hidden">
  <!-- Header -->
  <div use:reveal class="max-w-6xl mx-auto px-4 text-center mb-16">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--lp-amber)]/30 bg-[var(--lp-amber)]/10 text-[var(--lp-amber)] text-xs font-bold mb-3">
      <HeartHandshake size={13} />
      <span>Kata Tetangga</span>
    </div>
    <h2 class="text-heading-lg text-white">Kisah Sukses UMKM Lokal</h2>
    <p class="text-body-base text-[var(--lp-text-secondary)] mt-3 max-w-xl mx-auto leading-relaxed">
      Cerita nyata dari pelaku usaha di Banyuwangi yang telah beralih ke ekosistem digital.
    </p>
  </div>

  <!-- Marquee Container -->
  <div use:reveal={{ delay: 150 }} class="relative w-full overflow-hidden" aria-label="Testimonial marquee">
    <div class="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0E131F] to-transparent z-10 pointer-events-none"></div>
    <div class="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0E131F] to-transparent z-10 pointer-events-none"></div>

    <div class="flex gap-5 lp-marquee w-max hover:[animation-play-state:paused] py-2">
      {#each doubled as t}
        <div class="w-[320px] sm:w-[380px] shrink-0 p-6 rounded-3xl border border-[var(--lp-card-border)] bg-[var(--lp-card)] backdrop-blur-xl hover:border-[var(--lp-amber)]/30 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-1 mb-4">
              {#each Array(t.rating) as _}
                <Star size={14} class="text-[var(--lp-amber)] fill-[var(--lp-amber)]" />
              {/each}
            </div>

            <div class="relative mb-6">
              <Quote size={20} class="text-[var(--lp-text-muted)] opacity-20 absolute -top-2 -left-2" />
              <p class="text-xs sm:text-sm text-[var(--lp-text-secondary)] leading-relaxed relative z-10 pl-2">
                "{t.text}"
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-4 border-t border-white/5">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr {t.avatarBg} text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
              {t.name.charAt(0)}
            </div>
            <div class="min-w-0">
              <span class="text-sm font-bold text-white block truncate">{t.name}</span>
              <span class="text-3xs text-[var(--lp-text-muted)] font-medium block truncate">{t.role}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
