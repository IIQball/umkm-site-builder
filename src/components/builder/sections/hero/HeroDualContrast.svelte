<script lang="ts">
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = 'Coffee Roastery & Academy';
  export let tagName: string = 'h1';
  export let title: string = 'Belajar Meracik Kopi Bersama Barista Juara';
  export let subtitle: string = 'Program pelatihan kilat barista pemula hingga siap membuka kedai kopi sendiri dalam 3 hari.';
  export let ctaText: string = 'Daftar Kelas Batch Ini';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta', 'contrast_card'];

  $: hasContrastCard = elementOrder.includes('contrast_card');
  $: contrastIdx = elementOrder.indexOf('contrast_card');
  $: titleIdx = elementOrder.indexOf('title') !== -1 ? elementOrder.indexOf('title') : 1;
  $: isCardLeft = contrastIdx !== -1 ? contrastIdx < titleIdx : false;
  $: isCardActive = activeNodeId === 'hero_contrast_card' || activeNodeId === 'contrast_card';
</script>

<div class="rounded-3xl shadow-sm border border-[var(--color-border)] overflow-hidden my-4">
  {#if !hasContrastCard}
    <!-- Full-width Light Side -->
    <div class="bg-[var(--color-card-base)] p-6 sm:p-10 flex flex-col justify-center text-center max-w-3xl mx-auto">
      <HeroHeaderContent
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {waNumber}
        {activeNodeId}
        {selectNode}
        {selectNodeKey}
        {elementOrder}
        align="center"
      />
    </div>
  {:else}
    <div class="cq-grid-dual-contrast">
      {#if isCardLeft}
        <!-- Dark Side (Kiri) -->
        <div
          data-node="hero_contrast_card"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'hero_contrast_card')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_contrast_card')}
          class={`bg-slate-950 p-6 sm:p-10 flex flex-col justify-center text-white text-left relative overflow-hidden transition-all cursor-pointer ${
            isCardActive
              ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
              : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
          }`}
        >
          <div class="relative z-10 space-y-3">
            <span class="badge badge-warning badge-outline text-xs font-mono uppercase tracking-wider">Pendaftaran Terbatas</span>
            <h3 class="text-2xl font-heading font-bold text-white">Kuota Tersisa 4 Peserta</h3>
            <p class="text-xs text-slate-400 leading-relaxed font-sans">
              Mendapatkan modul lengkap, sertifikat kelulusan, dan sesi praktik langsung bersama mentor berpengalaman.
            </p>
          </div>
          <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        <!-- Light Side (Kanan) -->
        <div class="bg-[var(--color-card-base)] p-6 sm:p-10 flex flex-col justify-center text-left">
          <HeroHeaderContent
            {badgeText}
            {tagName}
            {title}
            {subtitle}
            {ctaText}
            {ctaLink}
            {secondaryCtaText}
            {secondaryCtaLink}
            {waNumber}
            {activeNodeId}
            {selectNode}
            {selectNodeKey}
            {elementOrder}
            align="left"
          />
        </div>
      {:else}
        <!-- Light Side (Kiri) -->
        <div class="bg-[var(--color-card-base)] p-6 sm:p-10 flex flex-col justify-center text-left">
          <HeroHeaderContent
            {badgeText}
            {tagName}
            {title}
            {subtitle}
            {ctaText}
            {ctaLink}
            {secondaryCtaText}
            {secondaryCtaLink}
            {waNumber}
            {activeNodeId}
            {selectNode}
            {selectNodeKey}
            {elementOrder}
            align="left"
          />
        </div>

        <!-- Dark Side (Kanan) -->
        <div
          data-node="hero_contrast_card"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'hero_contrast_card')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_contrast_card')}
          class={`bg-slate-950 p-6 sm:p-10 flex flex-col justify-center text-white text-left relative overflow-hidden transition-all cursor-pointer ${
            isCardActive
              ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
              : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
          }`}
        >
          <div class="relative z-10 space-y-3">
            <span class="badge badge-warning badge-outline text-xs font-mono uppercase tracking-wider">Pendaftaran Terbatas</span>
            <h3 class="text-2xl font-heading font-bold text-white">Kuota Tersisa 4 Peserta</h3>
            <p class="text-xs text-slate-400 leading-relaxed font-sans">
              Mendapatkan modul lengkap, sertifikat kelulusan, dan sesi praktik langsung bersama mentor berpengalaman.
            </p>
          </div>
          <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>
        </div>
      {/if}
    </div>
  {/if}
</div>
