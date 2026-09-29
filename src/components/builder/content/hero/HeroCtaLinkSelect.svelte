<script lang="ts">
  import { Link } from 'lucide-svelte';

  export let value: string = '#produk';
  export let onChange: (value: string) => void;
  export let label: string = 'Tujuan Tautan Tombol (Link)';
  export let id: string = 'hero-cta-link-select';

  interface LinkOption {
    value: string;
    label: string;
    aliases: string[];
    hint: string;
  }

  const SECTION_LINK_OPTIONS: LinkOption[] = [
    {
      value: '#produk',
      label: 'Katalog Produk (#produk)',
      aliases: ['#products', '#catalog', '#product_catalog'],
      hint: 'Bergulir langsung ke daftar produk / katalog toko.',
    },
    {
      value: '#tentang',
      label: 'Keunggulan Fitur (#tentang)',
      aliases: ['#features', '#about'],
      hint: 'Bergulir ke bagian keunggulan / fitur toko.',
    },
    {
      value: '#faq',
      label: 'Tanya Jawab FAQ (#faq)',
      aliases: ['#faq', '#pertanyaan'],
      hint: 'Bergulir ke bagian pertanyaan umum / FAQ.',
    },
    {
      value: '#ulasan',
      label: 'Ulasan Pelanggan (#ulasan)',
      aliases: ['#testimonials', '#testimoni', '#reviews'],
      hint: 'Bergulir ke bagian review / ulasan pembeli.',
    },
    {
      value: '#lokasi',
      label: 'Lokasi Gerai / Maps (#lokasi)',
      aliases: ['#maps', '#lokasi_gerai', '#location'],
      hint: 'Bergulir ke peta alamat / lokasi gerai.',
    },
    {
      value: '#kontak',
      label: 'Kontak & Footer (#kontak)',
      aliases: ['#footer', '#contact'],
      hint: 'Bergulir ke informasi kontak di bagian footer.',
    },
    {
      value: '#beranda',
      label: 'Bagian Atas / Beranda (#beranda)',
      aliases: ['#hero', '#home', '#top', '#'],
      hint: 'Bergulir kembali ke puncak halaman hero.',
    },
    {
      value: 'custom',
      label: 'Tautan URL Kustom / Eksternal...',
      aliases: [],
      hint: 'Masukkan alamat web lain atau tautan WhatsApp.',
    },
  ];

  function resolveSelectedValue(val: string): string {
    if (!val || val === '#') return '#beranda';
    const clean = val.trim().toLowerCase();
    for (const opt of SECTION_LINK_OPTIONS) {
      if (opt.value === clean || opt.aliases.some((a) => a.toLowerCase() === clean)) {
        return opt.value;
      }
    }
    return 'custom';
  }

  $: selectedPreset = resolveSelectedValue(value);
  $: isCustom = selectedPreset === 'custom';
  $: activeHint = SECTION_LINK_OPTIONS.find((o) => o.value === selectedPreset)?.hint || '';

  function handleSelectChange(e: Event) {
    const target = e.currentTarget as HTMLSelectElement;
    const nextVal = target.value;
    if (nextVal === 'custom') {
      if (!value || value.startsWith('#')) {
        onChange('https://');
      }
    } else {
      onChange(nextVal);
    }
  }

  function handleCustomInput(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    onChange(target.value);
  }
</script>

<div class="space-y-1">
  <label for={id} class="flex items-center gap-1.5 font-semibold text-xs text-base-content/80">
    <Link size={13} class="text-primary" />
    <span>{label}</span>
  </label>
  <select
    {id}
    value={selectedPreset}
    on:change={handleSelectChange}
    class="select select-bordered select-xs w-full"
  >
    {#each SECTION_LINK_OPTIONS as opt}
      <option value={opt.value}>{opt.label}</option>
    {/each}
  </select>

  {#if isCustom}
    <div class="pt-1">
      <input
        type="text"
        value={value}
        on:input={handleCustomInput}
        placeholder="https://wa.me/... atau https://..."
        class="input input-bordered input-xs w-full font-mono"
      />
      <span class="block text-[10px] text-base-content/50 mt-0.5">
        Ketik tautan eksternal lengkap (misal: https://...)
      </span>
    </div>
  {:else if activeHint}
    <span class="block text-[10.5px] text-base-content/50 leading-tight">
      {activeHint}
    </span>
  {/if}
</div>
