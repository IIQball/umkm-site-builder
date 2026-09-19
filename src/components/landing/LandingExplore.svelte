<script lang="ts">
  import { MapPin, Star, Eye, ChevronRight, ShoppingBag, Utensils, Coffee, Shirt, Package, Sparkles, X } from 'lucide-svelte';
  import { ALL_BANYUWANGI_DISTRICTS } from '@/components/directory/directoryDistricts';
  import { reveal } from './scrollReveal';

  let selectedDistrict = '';
  let activeCategory = 'Semua';

  type UmkmItem = {
    id: string;
    name: string;
    category: string;
    district: string;
    distance: string;
    rating: number;
    icon: typeof Utensils;
    desc: string;
    productsCount: number;
    whatsapp: string;
  };

  const CATEGORIES = ['Semua', 'Kuliner', 'Kopi & Minuman', 'Fashion', 'Oleh-Oleh', 'Makanan Ringan'];

  const MOCK_UMKM: UmkmItem[] = [
    {
      id: '1',
      name: 'Warung Osing Mbak Yuni',
      category: 'Kuliner',
      district: 'Glagah',
      distance: '1.2 km',
      rating: 4.9,
      icon: Utensils,
      desc: 'Nasi Tempong & Rujak Soto khas Banyuwangi dengan sambal pedas mantap.',
      productsCount: 14,
      whatsapp: '6281234567890',
    },
    {
      id: '2',
      name: 'Kopi Sewu Rasa',
      category: 'Kopi & Minuman',
      district: 'Songgon',
      distance: '3.5 km',
      rating: 4.9,
      icon: Coffee,
      desc: 'Kopi Robusta Songgon petik merah dengan aroma pinus yang khas.',
      productsCount: 8,
      whatsapp: '6281234567891',
    },
    {
      id: '3',
      name: 'Batik Gajah Oling Sanggar',
      category: 'Fashion',
      district: 'Rogojampi',
      distance: '5.1 km',
      rating: 4.8,
      icon: Shirt,
      desc: 'Batik tulis asli Banyuwangi bermotif Gajah Oling & Kangkung Setingkes.',
      productsCount: 22,
      whatsapp: '6281234567892',
    },
    {
      id: '4',
      name: 'Toko Oleh-Oleh Blambangan',
      category: 'Oleh-Oleh',
      district: 'Banyuwangi (Kota)',
      distance: '0.8 km',
      rating: 4.7,
      icon: Package,
      desc: 'Sentra pia, Bagiak, & souvenir khas Banyuwangi paling lengkap.',
      productsCount: 45,
      whatsapp: '6281234567893',
    },
    {
      id: '5',
      name: 'Keripik Tempe Bu Darmi',
      category: 'Makanan Ringan',
      district: 'Genteng',
      distance: '4.2 km',
      rating: 4.6,
      icon: ShoppingBag,
      desc: 'Keripik tempe renyah tanpa pengawet dengan varian rasa pedas manis.',
      productsCount: 6,
      whatsapp: '6281234567894',
    },
    {
      id: '6',
      name: 'Ijen Merapi Roast Coffee',
      category: 'Kopi & Minuman',
      district: 'Licin',
      distance: '12.4 km',
      rating: 5.0,
      icon: Coffee,
      desc: 'Kopi Lereng Ijen diproses secara alami dari perkebunan organik.',
      productsCount: 10,
      whatsapp: '6281234567895',
    },
  ];

  let activeModalItem: UmkmItem | null = null;

  $: displayedUmkm = MOCK_UMKM.filter((u) => {
    const matchDistrict = selectedDistrict ? u.district === selectedDistrict : true;
    const matchCategory = activeCategory === 'Semua' ? true : u.category === activeCategory;
    return matchDistrict && matchCategory;
  });
</script>

<section id="jelajah" class="relative py-24 sm:py-32 px-4 overflow-hidden">
  <!-- Decorative Glow -->
  <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
    <div class="absolute top-1/2 left-0 w-[450px] h-[450px] rounded-full opacity-10 blur-[130px]" style="background: var(--lp-cyan);"></div>
  </div>

  <div class="max-w-6xl mx-auto">
    <!-- Section Header -->
    <div use:reveal class="text-center mb-14">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--lp-cyan)]/25 bg-[var(--lp-cyan)]/10 text-[var(--lp-cyan)] text-xs font-bold mb-3">
        <Sparkles size={13} />
        <span>Jelajah Sekitar</span>
      </div>
      <h2 class="text-heading-lg text-white">Ada Apa di Sekitarmu?</h2>
      <p class="text-body-base text-[var(--lp-text-secondary)] mt-3 max-w-xl mx-auto leading-relaxed">
        Eksplorasi UMKM unggulan di setiap kecamatan Kabupaten Banyuwangi. Dari kuliner khas hingga kerajinan seni.
      </p>
    </div>

    <!-- Category Tabs -->
    <div use:reveal={{ delay: 100 }} class="flex flex-wrap items-center justify-center gap-2 mb-6">
      {#each CATEGORIES as cat}
        <button
          type="button"
          on:click={() => (activeCategory = cat)}
          class="px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer {activeCategory === cat
            ? 'bg-gradient-to-r from-[var(--lp-cyan)] to-[var(--lp-purple)] text-white shadow-lg shadow-[var(--lp-cyan)]/20'
            : 'text-[var(--lp-text-muted)] bg-white/5 border border-[var(--lp-card-border)] hover:text-white hover:bg-white/10'}"
        >
          {cat}
        </button>
      {/each}
    </div>

    <!-- District Quick Filter Chips -->
    <div use:reveal={{ delay: 150 }} class="flex flex-wrap items-center justify-center gap-1.5 mb-10">
      <button
        type="button"
        on:click={() => (selectedDistrict = '')}
        class="px-3 py-1 rounded-xl text-3xs font-semibold transition-all cursor-pointer {selectedDistrict === ''
          ? 'bg-[var(--lp-cyan)]/20 text-[var(--lp-cyan)] border border-[var(--lp-cyan)]/30 font-bold'
          : 'text-[var(--lp-text-muted)] border border-transparent hover:text-white'}"
      >
        Semua Kecamatan
      </button>
      {#each ALL_BANYUWANGI_DISTRICTS.slice(0, 9) as district}
        <button
          type="button"
          on:click={() => (selectedDistrict = district.name)}
          class="px-3 py-1 rounded-xl text-3xs font-semibold transition-all cursor-pointer {selectedDistrict === district.name
            ? 'bg-[var(--lp-cyan)]/20 text-[var(--lp-cyan)] border border-[var(--lp-cyan)]/30 font-bold'
            : 'text-[var(--lp-text-muted)] border border-transparent hover:text-white'}"
        >
          {district.name}
        </button>
      {/each}
    </div>

    <!-- UMKM Grid Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {#each displayedUmkm as umkm, i}
        <div
          use:reveal={{ delay: 100 + i * 50 }}
          class="group relative rounded-3xl border border-[var(--lp-card-border)] bg-[var(--lp-card)] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--lp-cyan)]/30 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-[var(--lp-cyan)]/10 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--lp-cyan)]/20 to-[var(--lp-purple)]/20 text-[var(--lp-cyan)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <svelte:component this={umkm.icon} size={22} />
              </div>

              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-3xs font-bold text-[var(--lp-amber)]">
                <Star size={11} class="fill-[var(--lp-amber)]" />
                {umkm.rating}
              </span>
            </div>

            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-3xs font-bold uppercase tracking-wider text-[var(--lp-cyan)]">
                  {umkm.category}
                </span>
                <span class="text-3xs text-[var(--lp-text-muted)]">•</span>
                <span class="text-3xs text-[var(--lp-text-muted)] font-medium">
                  {umkm.productsCount} Produk
                </span>
              </div>

              <h3 class="text-base font-bold text-white group-hover:text-[var(--lp-cyan)] transition-colors leading-snug">
                {umkm.name}
              </h3>

              <p class="text-xs text-[var(--lp-text-secondary)] mt-2 leading-relaxed line-clamp-2">
                {umkm.desc}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 mt-6 border-t border-[var(--lp-card-border)] text-xs text-[var(--lp-text-muted)]">
            <div class="flex items-center gap-1.5">
              <MapPin size={13} class="text-[var(--lp-cyan)]" />
              <span class="font-medium text-white/80">{umkm.district}</span>
              <span class="text-3xs text-[var(--lp-text-muted)]">({umkm.distance})</span>
            </div>

            <button
              type="button"
              on:click={() => (activeModalItem = umkm)}
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[var(--lp-cyan)]/15 text-[var(--lp-cyan)] font-bold text-xs transition-colors cursor-pointer"
            >
              <Eye size={13} />
              <span>Detail</span>
            </button>
          </div>
        </div>
      {/each}
    </div>

    {#if displayedUmkm.length === 0}
      <div class="text-center py-16 rounded-3xl border border-[var(--lp-card-border)] bg-[var(--lp-card)]">
        <p class="text-sm font-semibold text-[var(--lp-text-muted)]">
          Belum ada UMKM terdaftar pada kategori atau kecamatan ini.
        </p>
        <button
          type="button"
          on:click={() => { selectedDistrict = ''; activeCategory = 'Semua'; }}
          class="mt-3 text-xs font-bold text-[var(--lp-cyan)] underline underline-offset-4 cursor-pointer"
        >
          Reset Filter
        </button>
      </div>
    {/if}

    <!-- CTA to Directory -->
    <div use:reveal={{ delay: 200 }} class="text-center mt-12">
      <a
        href="/umkm"
        class="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white border border-[var(--lp-cyan)]/30 bg-[var(--lp-cyan)]/10 hover:bg-[var(--lp-cyan)]/20 hover:scale-[1.02] transition-all cursor-pointer"
      >
        <span>Jelajahi Direktori Lengkap UMKM</span>
        <ChevronRight size={16} />
      </a>
    </div>
  </div>

  <!-- Quick View Modal -->
  {#if activeModalItem}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md lp-slide-up">
      <div class="relative w-full max-w-md rounded-3xl border border-[var(--lp-glass-border)] bg-[#0E131F] p-6 shadow-2xl space-y-4">
        <button
          type="button"
          on:click={() => (activeModalItem = null)}
          class="absolute top-4 right-4 p-2 rounded-xl bg-white/5 text-[var(--lp-text-muted)] hover:text-white transition-colors cursor-pointer"
          aria-label="Tutup modal"
        >
          <X size={18} />
        </button>

        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-[var(--lp-cyan)]/15 text-[var(--lp-cyan)] flex items-center justify-center shrink-0 font-bold">
            <svelte:component this={activeModalItem.icon} size={24} />
          </div>
          <div>
            <span class="text-3xs font-bold uppercase tracking-wider text-[var(--lp-cyan)]">{activeModalItem.category}</span>
            <h3 class="text-base font-bold text-white">{activeModalItem.name}</h3>
          </div>
        </div>

        <p class="text-xs text-[var(--lp-text-secondary)] leading-relaxed">{activeModalItem.desc}</p>

        <div class="p-3 rounded-2xl bg-white/5 space-y-1.5 text-xs text-[var(--lp-text-muted)]">
          <div class="flex justify-between">
            <span>Kecamatan:</span>
            <span class="font-bold text-white">{activeModalItem.district}</span>
          </div>
          <div class="flex justify-between">
            <span>Jarak dari lokasi:</span>
            <span class="font-bold text-white">{activeModalItem.distance}</span>
          </div>
          <div class="flex justify-between">
            <span>Rating Pelanggan:</span>
            <span class="font-bold text-[var(--lp-amber)]">★ {activeModalItem.rating} / 5.0</span>
          </div>
        </div>

        <div class="pt-2 flex gap-3">
          <a
            href="https://wa.me/{activeModalItem.whatsapp}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer"
          >
            <span>Hubungi via WhatsApp</span>
          </a>
          <button
            type="button"
            on:click={() => (activeModalItem = null)}
            class="px-4 py-3 rounded-2xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  {/if}
</section>
