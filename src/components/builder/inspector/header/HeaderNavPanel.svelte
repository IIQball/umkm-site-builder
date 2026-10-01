<script lang="ts">
  import { Menu } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { TemplateSection } from '@/schemas';
  import {
    NAV_TYPOGRAPHY_TOKENS,
    NAV_TRANSFORM_OPTIONS,
    NAV_COLOR_TOKENS,
    NAV_HOVER_COLOR_TOKENS,
    resolveColorTokenMatch,
    resolveNavFontSize,
  } from '../../sections/header/headerNav.helpers';

  export let section: TemplateSection;
  export let onConfigChange: (key: string, value: unknown) => void;

  $: navGap = section.props?.navGap || '16px';
  $: navTypographyToken = (section.props?.navTypographyToken as string) || 'body';
  $: navTextTransform = section.props?.navTextTransform || 'none';
  $: navColor = (section.props?.navColor as string) || NAV_COLOR_TOKENS[0].value;
  $: navHoverColor = (section.props?.navHoverColor as string) || NAV_HOVER_COLOR_TOKENS[0].value;

  $: matchedNavColor = resolveColorTokenMatch(navColor, NAV_COLOR_TOKENS, NAV_COLOR_TOKENS[0].value);
  $: matchedNavHoverColor = resolveColorTokenMatch(navHoverColor, NAV_HOVER_COLOR_TOKENS, NAV_HOVER_COLOR_TOKENS[0].value);
  $: activeFontSize = resolveNavFontSize(navTypographyToken);

  const gapPresets = [
    { label: '8px (Ketat)', value: '8px' },
    { label: '16px (Normal)', value: '16px' },
    { label: '24px (Renggang)', value: '24px' },
    { label: '32px (Lebar)', value: '32px' },
  ];
</script>

<div class="space-y-3.5 p-3 bg-base-200/40 rounded-xl border border-base-200 text-left">
  <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
    <Menu size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
    <span>Gaya & Tipografi Menu Navigasi</span>
  </div>

  <!-- Gap Spacing (8pt scale) -->
  <div>
    <span class="block font-medium text-[11px] text-base-content/70 mb-1">Jarak Antar Menu (8pt Grid)</span>
    <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 text-[10px]">
      {#each gapPresets as preset}
        <Button
          type="button"
          size="xs"
          variant={navGap === preset.value ? 'primary' : 'ghost'}
          on:click={() => onConfigChange('navGap', preset.value)}
          class={`!py-1 !h-auto !min-h-0 rounded font-medium text-center ${
            navGap === preset.value ? '!bg-primary !text-primary-content font-bold shadow-xs' : 'text-base-content/70 hover:bg-base-300/50'
          }`}
        >
          {preset.value}
        </Button>
      {/each}
    </div>
  </div>

  <!-- Typography Token Scale -->
  <div>
    <label for="nav-typo-token" class="block font-medium text-[11px] text-base-content/70 mb-1">Skala Tipografi Menu</label>
    <select
      id="nav-typo-token"
      value={navTypographyToken}
      on:change={(e) => onConfigChange('navTypographyToken', e.currentTarget.value)}
      class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded-lg text-xs text-base-content focus:outline-none focus:border-primary cursor-pointer"
    >
      {#each NAV_TYPOGRAPHY_TOKENS as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
  </div>

  <!-- Text Transform -->
  <div>
    <span class="block font-medium text-[11px] text-base-content/70 mb-1">Kapitalisasi Teks</span>
    <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 text-[10px]">
      {#each NAV_TRANSFORM_OPTIONS as preset}
        <Button
          type="button"
          size="xs"
          variant={navTextTransform === preset.value ? 'primary' : 'ghost'}
          on:click={() => onConfigChange('navTextTransform', preset.value)}
          class={`!py-1 !h-auto !min-h-0 rounded font-medium text-center ${
            navTextTransform === preset.value ? '!bg-primary !text-primary-content font-bold shadow-xs' : 'text-base-content/70 hover:bg-base-300/50'
          }`}
        >
          {preset.label}
        </Button>
      {/each}
    </div>
  </div>

  <!-- Colors: Default & Hover (Token Dropdowns with Color Dots) -->
  <div class="space-y-2.5 pt-1 border-t border-base-200">
    <div>
      <label for="nav-default-color-token" class="block font-medium text-[11px] text-base-content/70 mb-1">Warna Default (Token)</label>
      <div class="flex items-center gap-2">
        <div
          class="w-5 h-5 rounded-full border border-base-300 shrink-0 shadow-xs"
          style="background: {matchedNavColor};"
          title="Preview warna default"
        ></div>
        <select
          id="nav-default-color-token"
          value={matchedNavColor}
          on:change={(e) => onConfigChange('navColor', e.currentTarget.value)}
          class="flex-1 px-2.5 py-1.5 bg-base-100 border border-base-300 rounded-lg text-xs text-base-content focus:outline-none focus:border-primary cursor-pointer"
        >
          {#each NAV_COLOR_TOKENS as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>
    </div>

    <div>
      <label for="nav-hover-color-token" class="block font-medium text-[11px] text-base-content/70 mb-1">Warna Hover (Token)</label>
      <div class="flex items-center gap-2">
        <div
          class="w-5 h-5 rounded-full border border-base-300 shrink-0 shadow-xs"
          style="background: {matchedNavHoverColor};"
          title="Preview warna hover"
        ></div>
        <select
          id="nav-hover-color-token"
          value={matchedNavHoverColor}
          on:change={(e) => onConfigChange('navHoverColor', e.currentTarget.value)}
          class="flex-1 px-2.5 py-1.5 bg-base-100 border border-base-300 rounded-lg text-xs text-base-content focus:outline-none focus:border-primary cursor-pointer"
        >
          {#each NAV_HOVER_COLOR_TOKENS as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <!-- Interactive Live Hover Preview Box -->
  <div class="pt-2 border-t border-base-200 space-y-1">
    <span class="block text-2xs font-semibold text-base-content/60">
      Uji Interaksi Hover (Arahkan Kursor):
    </span>
    <div class="p-2.5 bg-base-100 rounded-lg border border-base-300 text-center flex items-center justify-center gap-3 select-none">
      <span
        class="nav-test-link cursor-pointer px-2 py-1 rounded transition-colors"
        style="--p-color: {matchedNavColor}; --p-hover: {matchedNavHoverColor}; --p-size: {activeFontSize}; --p-transform: {navTextTransform};"
      >
        Beranda
      </span>
      <span class="text-base-content/20">•</span>
      <span
        class="nav-test-link cursor-pointer px-2 py-1 rounded transition-colors"
        style="--p-color: {matchedNavColor}; --p-hover: {matchedNavHoverColor}; --p-size: {activeFontSize}; --p-transform: {navTextTransform};"
      >
        Produk
      </span>
      <span class="text-base-content/20">•</span>
      <span
        class="nav-test-link cursor-pointer px-2 py-1 rounded transition-colors"
        style="--p-color: {matchedNavColor}; --p-hover: {matchedNavHoverColor}; --p-size: {activeFontSize}; --p-transform: {navTextTransform};"
      >
        Kontak
      </span>
    </div>
  </div>
</div>

<style>
  .nav-test-link {
    color: var(--p-color);
    font-size: var(--p-size);
    text-transform: var(--p-transform);
    font-weight: 500;
  }
  .nav-test-link:hover {
    color: var(--p-hover) !important;
  }
</style>
