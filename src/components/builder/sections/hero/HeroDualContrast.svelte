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
</script>

<div class="rounded-3xl shadow-sm border border-[var(--color-border,rgba(15,23,42,0.08))] overflow-hidden my-4">
  <div class="cq-grid-dual-contrast">
    <!-- Light Side -->
    <div class="bg-[var(--color-card-base,#ffffff)] p-6 sm:p-10 flex flex-col justify-center text-left">
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
        align="left"
      />
    </div>

    <!-- Dark Side -->
    <div class="bg-slate-950 p-6 sm:p-10 flex flex-col justify-center text-white text-left relative overflow-hidden">
      <div class="relative z-10 space-y-3">
        <span class="text-xs text-amber-400 font-mono uppercase tracking-wider">Pendaftaran Terbatas</span>
        <h3 class="text-2xl font-heading font-bold text-white">Kuota Tersisa 4 Peserta</h3>
        <p class="text-xs text-slate-400 leading-relaxed font-sans">
          Mendapatkan modul lengkap, sertifikat kelulusan, dan sesi praktik langsung bersama mentor berpengalaman.
        </p>
      </div>
      <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  </div>
</div>
