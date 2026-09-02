<script lang="ts">
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let badgeText: string = 'Coffee Roastery & Academy';
  export let tagName: string = 'h1';
  export let title: string = 'Belajar Meracik Kopi Bersama Barista Juara';
  export let subtitle: string = 'Program pelatihan kilat barista pemula hingga siap membuka kedai kopi sendiri dalam 3 hari.';
  export let ctaText: string = 'Daftar Kelas Batch Ini';
  export let ctaLink: string = '#';
  export let waNumber: string = '';
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya ingin mendaftar program: ${title}`);
  $: effectiveCtaLink = waNumber ? waUrl : ctaLink;
</script>

<div class="rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden my-4">
  <div class="cq-grid-dual-contrast">
    <!-- Light Side -->
    <div class="bg-[var(--theme-surface,#ffffff)] p-6 sm:p-10 flex flex-col justify-center text-left">
      {#if badgeText}
        <span
          data-node="badge"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'badge')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'badge')}
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[var(--theme-text-primary,#0f172a)] text-xs font-semibold mb-6 self-start cursor-pointer"
        >
          {badgeText}
        </span>
      {/if}

      <svelte:element
        this={tagName || 'h1'}
        data-node="title"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'title')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'title')}
        class="cq-title-lg font-extrabold text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-4 cursor-pointer"
      >
        {title}
      </svelte:element>

      <div
        data-node="subtitle"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'subtitle')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'subtitle')}
        class="cursor-pointer mb-4"
      >
        <p class="text-base text-[var(--theme-text-muted,#64748b)] leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div data-node="cta" class="cq-btn-group pt-4">
        <a
          href={effectiveCtaLink}
          target={waNumber ? '_blank' : '_self'}
          rel={waNumber ? 'noreferrer' : ''}
          style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 16px); background-color: var(--theme-primary, #0f172a); color: var(--theme-btn-primary-text, #ffffff);"
          class="inline-flex items-center justify-center px-6 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          {ctaText || 'Daftar Kelas Batch Ini'}
        </a>
      </div>
    </div>

    <!-- Dark Side -->
    <div class="bg-slate-950 p-6 sm:p-10 flex flex-col justify-center text-white text-left relative overflow-hidden">
      <div class="relative z-10 space-y-3">
        <span class="text-xs text-amber-400 font-mono uppercase tracking-wider">Pendaftaran Terbatas</span>
        <h3 class="text-2xl font-bold">Kuota Tersisa 4 Peserta</h3>
        <p class="text-xs text-slate-400 leading-relaxed">
          Mendapatkan modul lengkap, sertifikat kelulusan, dan sesi praktik langsung bersama mentor berpengalaman.
        </p>
      </div>
      <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  </div>
</div>
