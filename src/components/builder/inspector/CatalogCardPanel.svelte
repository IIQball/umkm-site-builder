<script lang="ts">
  import { ShoppingBag, Tag, Check, MessageCircle } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas/template.schema';

  export let section: TemplateSection;
  export let onConfigChange: (key: string, value: unknown) => void;

  $: cardPreset = String(section?.props?.cardPreset ?? section?.styles?.cardPreset ?? 'elevated_shadow');
  $: cardRadiusVal = String(section?.props?.cardRadius ?? section?.styles?.cardRadius ?? 'smooth');
  $: imageAspect = String(section?.props?.imageAspectRatio ?? section?.styles?.imageAspectRatio ?? 'square');
  $: badgePos = String(section?.props?.badgePosition ?? section?.styles?.badgePosition ?? 'top_left');
  $: badgeColor = String(section?.props?.badgeColor ?? section?.styles?.badgeColor ?? 'rose');
  $: nameSize = String(section?.props?.productNameSize ?? section?.styles?.productNameSize ?? 'base');
  $: nameWeight = String(section?.props?.productNameWeight ?? section?.styles?.productNameWeight ?? 'bold');
  $: pricePlacement = String(section?.props?.pricePlacement ?? section?.styles?.pricePlacement ?? 'stacked');
  $: ctaWidth = String(section?.props?.ctaButtonWidth ?? section?.styles?.ctaButtonWidth ?? 'full');
  $: ctaColor = String(section?.props?.ctaButtonColor ?? section?.styles?.ctaButtonColor ?? '#059669');
  $: ctaRadius = String(section?.props?.ctaButtonRadius ?? section?.styles?.ctaButtonRadius ?? 'smooth');
  $: showWA = (section?.props?.showWhatsAppIcon ?? section?.styles?.showWhatsAppIcon) !== false;

  const cardPresets = [
    { key: 'minimal_bordered', title: 'Minimal Bordered', desc: 'Border tipis tanpa bayangan' },
    { key: 'elevated_shadow', title: 'Elevated Shadow', desc: 'Drop-shadow soft & modern' },
    { key: 'flat_filled', title: 'Flat / Filled', desc: 'Latar netral lembut' },
    { key: 'horizontal', title: 'Horizontal Split', desc: 'Foto di kiri, teks di kanan' },
  ];

  const badgeColors = [
    { key: 'rose', bg: 'bg-rose-500' },
    { key: 'emerald', bg: 'bg-emerald-500' },
    { key: 'amber', bg: 'bg-amber-500' },
    { key: 'blue', bg: 'bg-blue-600' },
    { key: 'violet', bg: 'bg-violet-600' },
    { key: 'slate', bg: 'bg-slate-900' },
  ];
</script>

<div class="space-y-4">
  <!-- Card Presets -->
  <div class="space-y-3 p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 rounded-xl">
    <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 border-b border-emerald-200/60 dark:border-emerald-900/40 pb-1.5">
      <ShoppingBag size={14} class="text-emerald-600 dark:text-emerald-400" />
      <span>Bentuk & Varian Kartu</span>
    </div>

    <div class="grid grid-cols-2 gap-1.5">
      {#each cardPresets as preset}
        <button type="button" on:click={() => onConfigChange('cardPreset', preset.key)}
          class={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
            cardPreset === preset.key || (preset.key === 'elevated_shadow' && !cardPreset)
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500'
              : 'border-base-300 dark:border-slate-800 bg-base-100 text-base-content/80 hover:border-emerald-400'
          }`}>
          <p class="text-xs font-bold">{preset.title}</p>
          <p class="text-[10px] opacity-70 mt-0.5">{preset.desc}</p>
        </button>
      {/each}
    </div>

    <!-- Corner Radius -->
    <div>
      <span class="block font-semibold mb-1 text-base-content/90">Corner Radius</span>
      <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
        {#each [
          { key: 'sharp', label: 'Sharp' },
          { key: 'rounded', label: '8px' },
          { key: 'smooth', label: '16px' },
          { key: 'extra_rounded', label: '24px' },
        ] as r}
          <button type="button" on:click={() => onConfigChange('cardRadius', r.key)}
            class={`py-1.5 text-[10px] font-semibold rounded transition-all cursor-pointer ${
              cardRadiusVal === r.key || (r.key === 'smooth' && !cardRadiusVal)
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-base-content/70 hover:text-base-content hover:bg-base-100/60'
            }`}>
            {r.label}
          </button>
        {/each}
      </div>
    </div>

    <!-- Image Aspect -->
    <div>
      <span class="block font-semibold mb-1 text-base-content/90">Rasio Foto Produk</span>
      <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
        {#each [
          { key: 'square', label: '1:1' },
          { key: 'portrait', label: '3:4' },
          { key: 'widescreen', label: '16:9' },
          { key: 'auto', label: 'Auto' },
        ] as a}
          <button type="button" on:click={() => onConfigChange('imageAspectRatio', a.key)}
            class={`py-1.5 text-[10px] font-semibold rounded transition-all cursor-pointer ${
              imageAspect === a.key || (a.key === 'square' && !imageAspect)
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-base-content/70 hover:text-base-content hover:bg-base-100/60'
            }`}>
            {a.label}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Badge & Typography -->
  <div class="space-y-3 p-3 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 rounded-xl">
    <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 border-b border-amber-200/60 dark:border-amber-900/40 pb-1.5">
      <Tag size={14} class="text-amber-600 dark:text-amber-400" />
      <span>Detail Elemen & Typography</span>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <span class="block font-semibold mb-1 text-base-content/90">Posisi Badge</span>
        <div class="grid grid-cols-2 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
          {#each [{ key: 'top_left', label: 'Top-Left' }, { key: 'top_right', label: 'Top-Right' }] as pos}
            <button type="button" on:click={() => onConfigChange('badgePosition', pos.key)}
              class={`py-1 text-[10px] font-semibold rounded transition-all cursor-pointer ${
                badgePos === pos.key || (pos.key === 'top_left' && !badgePos)
                  ? 'bg-base-100 text-amber-700 dark:text-amber-400 shadow-sm'
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

    <div class="grid grid-cols-2 gap-2">
      <div>
        <span class="block font-semibold mb-1 text-base-content/90">Ukuran Judul</span>
        <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
          {#each [{ key: 'sm', label: 'SM' }, { key: 'base', label: 'Base' }, { key: 'lg', label: 'LG' }] as size}
            <button type="button" on:click={() => onConfigChange('productNameSize', size.key)}
              class={`py-1 text-[11px] font-semibold rounded transition-all cursor-pointer ${
                nameSize === size.key || (size.key === 'base' && !nameSize)
                  ? 'bg-base-100 text-amber-700 dark:text-amber-400 shadow-sm'
                  : 'text-base-content/60'
              }`}>
              {size.label}
            </button>
          {/each}
        </div>
      </div>

      <div>
        <label for="catalog-title-weight" class="block font-semibold mb-1 text-base-content/90">Ketebalan</label>
        <select id="catalog-title-weight" value={nameWeight}
          on:change={(e) => onConfigChange('productNameWeight', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs focus:outline-none focus:border-amber-500">
          <option value="normal">Normal</option>
          <option value="medium">Medium</option>
          <option value="semibold">Semibold</option>
          <option value="bold">Bold</option>
          <option value="extrabold">Extrabold</option>
        </select>
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
          Stacked
        </button>
        <button type="button" on:click={() => { onConfigChange('pricePlacement', 'inline'); onConfigChange('ctaButtonWidth', 'compact'); }}
          class={`py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
            pricePlacement === 'inline'
              ? 'bg-base-100 text-amber-700 dark:text-amber-400 font-bold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}>
          Inline
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
                  ? 'bg-base-100 text-violet-700 dark:text-violet-400 shadow-sm'
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
            class={`py-1 text-[10px] font-semibold rounded transition-all cursor-pointer ${showWA ? 'bg-base-100 text-violet-700 dark:text-violet-400 shadow-sm' : 'text-base-content/60 hover:text-base-content'}`}>
            Tampil
          </button>
          <button type="button" on:click={() => onConfigChange('showWhatsAppIcon', false)}
            class={`py-1 text-[10px] font-semibold rounded transition-all cursor-pointer ${!showWA ? 'bg-base-100 text-violet-700 dark:text-violet-400 shadow-sm' : 'text-base-content/60 hover:text-base-content'}`}>
            Sembunyi
          </button>
        </div>
      </div>
    </div>

    <div>
      <span class="block font-semibold mb-1 text-base-content/90">Kelengkungan Tombol</span>
      <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
        {#each [
          { key: 'sharp', label: 'Sharp' },
          { key: 'rounded', label: '8px' },
          { key: 'smooth', label: '12px' },
          { key: 'pill', label: 'Pill' },
        ] as r}
          <button type="button" on:click={() => onConfigChange('ctaButtonRadius', r.key)}
            class={`py-1 text-[10px] font-semibold rounded transition-all cursor-pointer ${
              ctaRadius === r.key || (r.key === 'smooth' && !ctaRadius)
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-base-content/70 hover:text-base-content hover:bg-base-100/60'
            }`}>
            {r.label}
          </button>
        {/each}
      </div>
    </div>

    <div>
      <label for="catalog-cta-color" class="block font-semibold mb-1 text-base-content/90">Warna Tombol CTA</label>
      <div class="flex items-center gap-2">
        <input id="catalog-cta-color" type="color" value={ctaColor}
          on:input={(e) => onConfigChange('ctaButtonColor', e.currentTarget.value)}
          class="w-8 h-8 rounded-lg border border-base-300 dark:border-slate-700 bg-base-100 cursor-pointer p-0.5" />
        <input type="text" value={ctaColor}
          on:input={(e) => onConfigChange('ctaButtonColor', e.currentTarget.value)}
          class="flex-1 px-2.5 py-1.5 bg-base-100 border border-base-300 dark:border-slate-800 rounded-lg text-base-content font-mono focus:outline-none focus:border-violet-500"
          placeholder="#059669" />
      </div>
    </div>
  </div>
</div>
