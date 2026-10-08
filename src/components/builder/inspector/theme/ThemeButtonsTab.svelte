<script lang="ts">
  import type { TemplateTheme } from '@/schemas';
  import { Button } from '@/components/ui';
  import { RADIUS_PRESETS } from '@/components/tokens/radius';

  export let theme: TemplateTheme;
  export let onButtonVariantChange: (variantKey: string, key: string, value: string) => void = () => {};
  export let onButtonRadiusChange: (value: string) => void = () => {};

  $: buttons = theme.buttons || {};
  $: currentRadius = buttons.borderRadius || '8px';
  $: primaryColor = theme.colors?.primary || theme.primaryColor || '#36C6FD';

  $: primaryTextColor = buttons.primary?.textColor || '#ffffff';
  $: secondaryTextColor = buttons.secondary?.textColor || buttons.outline?.textColor || '#0f172a';
  $: tertiaryTextColor = buttons.tertiary?.textColor || '#334155';

  const getRadiusString = (val: number): string => `${val}px`;

  const buttonConfigs = [
    {
      key: 'primary',
      title: 'Tombol Utama (Primary)',
      badge: 'Warna Penuh',
      desc: 'Warna latar solid mengikuti warna primary brand, sudut melengkung.',
      type: 'primary'
    },
    {
      key: 'secondary',
      title: 'Tombol Kedua (Secondary)',
      badge: 'Outline',
      desc: 'Garis tepi solid, latar transparan, sudut melengkung.',
      type: 'secondary'
    },
    {
      key: 'tertiary',
      title: 'Tombol Ketiga (Tertiary)',
      badge: 'Teks & Garis Bawah',
      desc: 'Hanya teks dengan garis bawah aktif tanpa kotak latar.',
      type: 'tertiary'
    }
  ];
</script>

<div class="space-y-5 text-xs">
  <!-- 1. Global Border Radius -->
  <div>
    <div class="flex items-center justify-between mb-1.5">
      <span class="font-semibold text-base-content/80 text-[11px]">Global Border Radius</span>
      <span class="text-[10px] font-mono font-medium text-primary px-1.5 py-0.5 rounded bg-primary/10">
        {currentRadius}
      </span>
    </div>
    <div class="grid grid-cols-3 gap-1 bg-base-200/70 p-1 rounded-xl border border-base-300 text-[11px]">
      {#each RADIUS_PRESETS as rp}
        {@const valStr = getRadiusString(rp.value)}
        <Button
          type="button"
          size="xs"
          variant={currentRadius === valStr ? 'primary' : 'ghost'}
          on:click={() => onButtonRadiusChange(valStr)}
          class={`!py-1.5 !px-2 !h-auto !min-h-0 rounded-lg font-medium text-center ${
            currentRadius === valStr
              ? 'font-bold shadow-xs'
              : 'text-base-content/60 hover:text-base-content hover:bg-base-100/50'
          }`}
        >
          {rp.label}
        </Button>
      {/each}
    </div>
  </div>

  <!-- 2. Button Types & Previews (Following Button.ts) -->
  <div class="pt-3 border-t border-base-200 space-y-4">
    <div class="flex items-center justify-between">
      <span class="font-semibold text-base-content text-[11px] uppercase tracking-wider">
        Varian Tombol (Button.ts)
      </span>
      <span class="text-[10px] text-base-content/50">Warna latar & border tetap</span>
    </div>

    {#each buttonConfigs as cfg}
      {@const activeColor =
        cfg.key === 'primary'
          ? primaryTextColor
          : cfg.key === 'secondary'
            ? secondaryTextColor
            : tertiaryTextColor}

      <div class="p-3.5 bg-base-200/40 rounded-xl border border-base-300 space-y-3">
        <!-- Header & Badge -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="font-semibold text-base-content text-xs">{cfg.title}</span>
            <span class="badge badge-neutral badge-xs font-medium">
              {cfg.badge}
            </span>
          </div>
        </div>

        <p class="text-[10.5px] text-base-content/60 leading-relaxed">{cfg.desc}</p>

        <!-- Live Visual Preview -->
        <div class="p-3 rounded-lg bg-base-100/90 border border-base-200 flex items-center justify-center min-h-[56px]">
          {#if cfg.type === 'primary'}
            <button
              type="button"
              tabindex="-1"
              style="border-radius: {currentRadius}; background-color: {primaryColor}; color: {activeColor};"
              class="btn btn-sm btn-primary h-9 px-5 text-xs font-heading font-semibold shadow-xs inline-flex items-center justify-center gap-1.5 cursor-default select-none pointer-events-none transition-all"
            >
              <span>Tombol Utama</span>
            </button>
          {:else if cfg.type === 'secondary'}
            <button
              type="button"
              tabindex="-1"
              style="border-radius: {currentRadius}; background-color: transparent; border: 1px solid var(--color-border); color: {activeColor};"
              class="btn btn-sm btn-outline h-9 px-5 text-xs font-heading font-semibold inline-flex items-center justify-center gap-1.5 cursor-default select-none pointer-events-none transition-all"
            >
              <span>Tombol Kedua</span>
            </button>
          {:else}
            <button
              type="button"
              tabindex="-1"
              style="background-color: transparent; color: {activeColor}; border: none;"
              class="btn btn-link btn-sm h-auto p-0 text-xs font-heading font-medium underline underline-offset-4 inline-flex items-center justify-center gap-1 cursor-default select-none pointer-events-none transition-all"
            >
              <span>Tombol Teks Tautan</span>
            </button>
          {/if}
        </div>

        <!-- Single Color Picker: Text Color Only -->
        <div class="pt-1 flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-[11px] font-medium text-base-content/80">Warna Teks</span>
            <span class="text-[10px] text-base-content/50">Hanya warna teks yang dapat diubah</span>
          </div>
          <div class="flex items-center gap-2">
            <input
              type="color"
              value={activeColor}
              on:input={(e) => onButtonVariantChange(cfg.key, 'textColor', e.currentTarget.value)}
              class="w-7 h-7 rounded-lg border border-base-300 cursor-pointer p-0.5 bg-base-100"
              title="Pilih warna teks"
            />
            <span class="font-mono text-[11px] text-base-content/70">{activeColor}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
