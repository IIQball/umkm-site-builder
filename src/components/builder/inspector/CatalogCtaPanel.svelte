<script lang="ts">
  import { Tag, Check, MessageCircle } from 'lucide-svelte';

  export let badgePos: string;
  export let badgeColor: string;
  export let pricePlacement: string;
  export let ctaWidth: string;
  export let ctaColor: string;
  export let ctaRadius: string;
  export let showWA: boolean;
  export let onConfigChange: (key: string, value: unknown) => void;

  const badgeColors = [
    { key: 'rose', bg: 'bg-rose-500' },
    { key: 'emerald', bg: 'bg-emerald-500' },
    { key: 'amber', bg: 'bg-amber-500' },
    { key: 'blue', bg: 'bg-blue-600' },
    { key: 'violet', bg: 'bg-violet-600' },
    { key: 'slate', bg: 'bg-slate-900' },
  ];

  const ctaColorTokenOptions = [
    { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand (Tema)' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
    { value: '#059669', label: 'Emerald / WhatsApp Hijau' },
    { value: 'var(--theme-text-primary, #0f172a)', label: 'Gelap Kontras (Dark)' },
  ];
</script>

<!-- Badge & Tata Letak -->
<div class="space-y-3 p-3 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 rounded-xl">
  <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 border-b border-amber-200/60 dark:border-amber-900/40 pb-1.5">
    <Tag size={14} class="text-amber-600 dark:text-amber-400" />
    <span>Detail Elemen & Badge</span>
  </div>

  <div class="grid grid-cols-2 gap-2">
    <div>
      <span class="block font-semibold mb-1 text-base-content/90">Posisi Badge (Pill)</span>
      <div class="grid grid-cols-2 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
        {#each [{ key: 'top_left', label: 'Kiri' }, { key: 'top_right', label: 'Kanan' }] as pos}
          <button type="button" on:click={() => onConfigChange('badgePosition', pos.key)}
            class={`py-1 text-[10px] font-semibold rounded transition-all cursor-pointer ${
              badgePos === pos.key || (pos.key === 'top_left' && !badgePos)
                ? 'bg-base-100 text-amber-700 dark:text-amber-400 shadow-sm font-bold'
                : 'text-base-content/60 hover:text-base-content'
            }`}>
            {pos.label}
          </button>
        {/each}
      </div>
    </div>

    <div>
      <span class="block font-semibold mb-1 text-base-content/90">Warna Badge</span>
      <div class="flex items-center gap-1.5 bg-base-200/80 p-1.5 rounded-lg border border-base-300 dark:border-slate-800">
        {#each badgeColors as b}
          <button type="button" on:click={() => onConfigChange('badgeColor', b.key)}
            class={`w-5 h-5 rounded-full ${b.bg} flex items-center justify-center transition-transform cursor-pointer ${
              badgeColor === b.key || (b.key === 'rose' && !badgeColor)
                ? 'ring-2 ring-blue-500 scale-110' : 'opacity-70 hover:opacity-100'
            }`} title={b.key}>
            {#if badgeColor === b.key || (b.key === 'rose' && !badgeColor)}
              <Check size={10} class="text-white" />
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Price Placement -->
  <div>
    <span class="block font-semibold mb-1 text-base-content/90">Tata Letak Harga & Tombol</span>
    <div class="grid grid-cols-2 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
      <button type="button" on:click={() => onConfigChange('pricePlacement', 'stacked')}
        class={`py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
          pricePlacement === 'stacked' || !pricePlacement
            ? 'bg-base-100 text-amber-700 dark:text-amber-400 font-bold shadow-sm'
            : 'text-base-content/60 hover:text-base-content'
        }`}>
        Stacked (Vertikal)
      </button>
      <button type="button" on:click={() => { onConfigChange('pricePlacement', 'inline'); onConfigChange('ctaButtonWidth', 'compact'); }}
        class={`py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
          pricePlacement === 'inline'
            ? 'bg-base-100 text-amber-700 dark:text-amber-400 font-bold shadow-sm'
            : 'text-base-content/60 hover:text-base-content'
        }`}>
        Inline (Sejajar)
      </button>
    </div>
  </div>
</div>

<!-- CTA Button -->
<div class="space-y-3 p-3 bg-violet-50/40 dark:bg-violet-950/20 border border-violet-200/80 dark:border-violet-900/50 rounded-xl">
  <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-800 dark:text-violet-300 border-b border-violet-200/60 dark:border-violet-900/40 pb-1.5">
    <MessageCircle size={14} class="text-violet-600 dark:text-violet-400" />
    <span>Tombol WhatsApp (CTA)</span>
  </div>

  <div class="grid grid-cols-2 gap-2">
    <div>
      <span class="block font-semibold mb-1 text-base-content/90">Lebar Tombol</span>
      <div class="grid grid-cols-2 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
        {#each [{ key: 'full', label: 'Full' }, { key: 'compact', label: 'Compact' }] as w}
          <button type="button" on:click={() => onConfigChange('ctaButtonWidth', w.key)}
            class={`py-1 text-[10px] font-semibold rounded transition-all cursor-pointer ${
              ctaWidth === w.key || (w.key === 'full' && !ctaWidth)
                ? 'bg-base-100 text-violet-700 dark:text-violet-400 shadow-sm font-bold'
                : 'text-base-content/60 hover:text-base-content'
            }`}>
            {w.label}
          </button>
        {/each}
      </div>
    </div>
    <div>
      <span class="block font-semibold mb-1 text-base-content/90">Icon WA</span>
      <div class="grid grid-cols-2 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
        <button type="button" on:click={() => onConfigChange('showWhatsAppIcon', true)}
          class={`py-1 text-[10px] font-semibold rounded transition-all cursor-pointer ${showWA ? 'bg-base-100 text-violet-700 dark:text-violet-400 shadow-sm font-bold' : 'text-base-content/60 hover:text-base-content'}`}>
          Tampil
        </button>
        <button type="button" on:click={() => onConfigChange('showWhatsAppIcon', false)}
          class={`py-1 text-[10px] font-semibold rounded transition-all cursor-pointer ${!showWA ? 'bg-base-100 text-violet-700 dark:text-violet-400 shadow-sm font-bold' : 'text-base-content/60 hover:text-base-content'}`}>
          Sembunyi
        </button>
      </div>
    </div>
  </div>

  <div>
    <span class="block font-semibold mb-1 text-base-content/90">Kelengkungan Tombol (Radius)</span>
    <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
      {#each [
        { key: 'sharp', label: '0px' },
        { key: 'rounded', label: '8px' },
        { key: 'smooth', label: '16px' },
        { key: 'pill', label: 'Pill' },
      ] as r}
        <button type="button" on:click={() => onConfigChange('ctaButtonRadius', r.key)}
          class={`py-1 text-[10px] font-semibold rounded transition-all cursor-pointer ${
            ctaRadius === r.key || (r.key === 'smooth' && !ctaRadius)
              ? 'bg-violet-600 text-white shadow-sm font-bold'
              : 'text-base-content/70 hover:text-base-content hover:bg-base-100/60'
          }`}>
          {r.label}
        </button>
      {/each}
    </div>
  </div>

  <div>
    <label for="catalog-cta-color-select" class="block font-semibold mb-1 text-base-content/90">Warna Tombol CTA (Token)</label>
    <select
      id="catalog-cta-color-select"
      value={ctaColor}
      on:change={(e) => onConfigChange('ctaButtonColor', e.currentTarget.value)}
      class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs focus:outline-none focus:border-violet-500"
    >
      {#each ctaColorTokenOptions as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
  </div>
</div>
