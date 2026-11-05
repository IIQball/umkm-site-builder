<script lang="ts">
  import SearchableIconDropdown from '../../inspector/SearchableIconDropdown.svelte';
  import { HERO_BADGE_ICON_OPTIONS } from '../../sections/hero/heroIcons';

  export let floatingCards: Array<{ icon: string; title: string; desc: string }> = [];
  export let onPropChange: (key: string, value: unknown) => void;

  $: cards =
    Array.isArray(floatingCards) && floatingCards.length === 3
      ? floatingCards
      : [
          { icon: 'Sparkles', title: 'Produk Terkurasi', desc: 'Kualitas bahan terbaik standar nasional.' },
          { icon: 'Zap', title: 'Pesan Instan', desc: 'Klik tombol WA langsung terhubung ke admin.' },
          { icon: 'ShieldCheck', title: 'Garansi 100%', desc: 'Barang rusak langsung kami ganti baru.' },
        ];

  function updateCard(index: number, field: 'icon' | 'title' | 'desc', val: string) {
    const next = cards.map((c, i) => (i === index ? { ...c, [field]: val } : c));
    onPropChange('floatingCards', next);
  }
</script>

<div class="space-y-3 pt-3 border-t border-base-300">
  <span class="block font-semibold text-xs text-base-content/80">
    Kartu Keunggulan Melayang (3 Kartu)
  </span>

  <div class="space-y-3">
    {#each cards as card, i (i)}
      <div class="p-2.5 rounded-xl bg-base-200/50 border border-base-300 space-y-2">
        <span class="text-[11px] font-semibold text-base-content/60">Kartu #{i + 1}</span>

        <SearchableIconDropdown
          label="Ikon Kartu"
          selectedIcon={card.icon}
          options={HERO_BADGE_ICON_OPTIONS}
          onSelect={(val) => updateCard(i, 'icon', val)}
        />

        <div>
          <label for="floating-title-{i}" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
            Judul Keunggulan
          </label>
          <input
            id="floating-title-{i}"
            type="text"
            value={card.title}
            on:input={(e) => updateCard(i, 'title', e.currentTarget.value)}
            class="input input-bordered input-xs w-full"
            placeholder="Judul Keunggulan"
          />
        </div>

        <div>
          <label for="floating-desc-{i}" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
            Deskripsi Singkat
          </label>
          <input
            id="floating-desc-{i}"
            type="text"
            value={card.desc}
            on:input={(e) => updateCard(i, 'desc', e.currentTarget.value)}
            class="input input-bordered input-xs w-full"
            placeholder="Deskripsi Singkat"
          />
        </div>
      </div>
    {/each}
  </div>
</div>
