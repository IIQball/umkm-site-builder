<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Card, Badge } from '@/components/ui';
  import {
    LOGO_LOCKUP_OPTIONS,
    LOGO_FONT_OPTIONS,
  } from './logo-wizard.constants';
  import type { LogoLockupType, LogoFontFamily } from '@/lib/validators/ai-logo';

  export let lockupType: LogoLockupType = 'icon_only';
  export let fontFamily: LogoFontFamily = 'Poppins';
  export let error: string | undefined = undefined;

  const dispatch = createEventDispatcher<{
    change: LogoLockupType;
  }>();

  function handleSelectLockup(type: LogoLockupType) {
    lockupType = type;
    dispatch('change', type);
  }

  function handleSelectFont(font: LogoFontFamily) {
    fontFamily = font;
  }
</script>

<svelte:head>
  <!-- Pemuatan font Google Fonts resmi agar pratinjau huruf persis seperti di Figma & MS Word -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;600;700&family=Outfit:wght@400;600;700&family=Playfair+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&family=Poppins:wght@400;600;700&family=Space+Grotesk:wght@400;600;700&display=swap"
  />
</svelte:head>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <span class="block text-label-caps text-muted">
      Susunan Tata Letak Logo (Lockup) <span class="text-error">*</span>
    </span>
    <span class="text-2xs text-secondary font-medium">Proporsi Rapi & Jarak Seimbang</span>
  </div>

  <!-- Pilihan Susunan Lockup -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    {#each LOGO_LOCKUP_OPTIONS as opt}
      {@const isSelected = lockupType === opt.id}
      <div
        role="button"
        tabindex="0"
        class="text-left cursor-pointer transition-all focus:outline-none flex flex-col group"
        on:click={() => handleSelectLockup(opt.id)}
        on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectLockup(opt.id)}
      >
        <Card
          variant={isSelected ? 'bordered' : 'nested'}
          padding="sm"
          radius="lg"
          class="h-full border-2 transition-all flex flex-col justify-between relative {isSelected
            ? 'border-primary ring-2 ring-primary/30 bg-primary/5 shadow-xs'
            : 'border-transparent hover:border-light'}"
        >
          <div>
            <!-- Visual Diagram Susunan -->
            <div class="h-14 rounded-lg bg-card/80 border border-light/60 flex items-center justify-center p-2 mb-2 relative">
              {#if isSelected}
                <div class="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              {/if}

              {#if opt.id === 'icon_only'}
                <div class="w-7 h-7 rounded-md bg-primary/80 border border-primary flex items-center justify-center">
                  <div class="w-2.5 h-2.5 rounded-full bg-white/90"></div>
                </div>
              {:else if opt.id === 'vertical'}
                <div class="flex flex-col items-center gap-1">
                  <div class="w-5 h-5 rounded-md bg-primary/80 border border-primary flex items-center justify-center">
                    <div class="w-2 h-2 rounded-full bg-white/90"></div>
                  </div>
                  <div class="w-12 h-1.5 rounded bg-main/60"></div>
                </div>
              {:else}
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-md bg-primary/80 border border-primary flex items-center justify-center">
                    <div class="w-2 h-2 rounded-full bg-white/90"></div>
                  </div>
                  <div class="w-10 h-1.5 rounded bg-main/60"></div>
                </div>
              {/if}
            </div>

            <div class="flex items-start justify-between gap-1 mb-1">
              <span class="font-heading font-semibold text-xs text-main">{opt.title}</span>
              <Badge variant={isSelected ? 'primary' : 'slate'} size="sm" dot={false}>
                {opt.badge}
              </Badge>
            </div>
            <p class="text-2xs text-secondary leading-snug mb-1.5">{opt.description}</p>
          </div>

          <div class="text-2xs text-muted pt-1.5 border-t border-light/60">
            {opt.specs}
          </div>
        </Card>
      </div>
    {/each}
  </div>

  {#if error}
    <p class="text-xs text-error mt-1">{error}</p>
  {/if}

  <!-- Pemilih Gaya Huruf Interaktif (Seperti di MS Word / Figma) -->
  {#if lockupType !== 'icon_only'}
    <div class="p-3.5 bg-nested/70 rounded-2xl border border-light space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <span class="block font-heading font-semibold text-xs text-main">
            Pilihan Bentuk Huruf Merek
          </span>
          <span class="text-2xs text-muted">
            Huruf tampil sesuai bentuk aslinya (seperti daftar font di Figma / Word).
          </span>
        </div>
        <Badge variant="primary" size="sm" dot={false}>
          Font Aktif: {fontFamily}
        </Badge>
      </div>

      <!-- Grid Pratinjau Font Nyata -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {#each LOGO_FONT_OPTIONS as font}
          {@const isFontActive = fontFamily === font.id}
          <div
            role="button"
            tabindex="0"
            class="p-2.5 rounded-xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between {isFontActive
              ? 'border-primary ring-2 ring-primary/30 bg-primary/10 shadow-xs'
              : 'border-light bg-card hover:border-primary/50'}"
            on:click={() => handleSelectFont(font.id)}
            on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectFont(font.id)}
          >
            <div>
              <div class="flex items-center justify-between gap-1.5 mb-1">
                <span class="text-xs font-semibold text-main truncate">
                  {font.name}
                </span>
                {#if isFontActive}
                  <span class="w-3.5 h-3.5 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xs font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                {/if}
              </div>

              <!-- Contoh Teks Huruf Nyata (Live Typeface Preview) -->
              <div
                class="py-1 text-sm font-semibold text-main truncate tracking-wide"
                style="font-family: '{font.name}', system-ui, sans-serif;"
              >
                {font.name} AaBb 123
              </div>
            </div>

            <div class="pt-1.5 mt-1 border-t border-light/60 flex items-center justify-between text-2xs text-muted">
              <span>{font.category}</span>
              <span class="text-primary font-medium">{isFontActive ? 'Terpilih' : 'Pilih'}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
