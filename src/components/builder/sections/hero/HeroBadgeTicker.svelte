<script lang="ts">
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let badgeText: string = '🌿 Organik & Higienis';
  export let tagName: string = 'h1';
  export let title: string = 'Kemasan Aman, Nutrisi Alami Terjaga Utuh';
  export let subtitle: string = 'Diproduksi dengan standar keamanan pangan tertinggi. Cocok untuk konsumsi harian keluarga dan oleh-oleh premium.';
  export let ctaText: string = 'Pesan Sekarang';
  export let ctaLink: string = '#';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80';
  export let waNumber: string = '';
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya ingin memesan produk: ${title}`);
  $: effectiveCtaLink = waNumber ? waUrl : ctaLink;
</script>

<div class="py-10">
  <div class="cq-grid-split">
    <div class="text-left">
      {#if badgeText}
        <span
          data-node="badge"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'badge')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'badge')}
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/80 mb-6 cursor-pointer"
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
        <p class="text-base text-[var(--theme-text-muted,#64748b)] leading-relaxed max-w-lg">
          {subtitle}
        </p>
      </div>

      <div data-node="cta" class="cq-btn-group pt-4 mb-8">
        <a
          href={effectiveCtaLink}
          target={waNumber ? '_blank' : '_self'}
          rel={waNumber ? 'noreferrer' : ''}
          style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 16px); background-color: var(--theme-primary, #0f172a); color: var(--theme-btn-primary-text, #ffffff);"
          class="inline-flex items-center justify-center px-6 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          {ctaText || 'Pesan Sekarang'}
        </a>
        <a
          href="#certification"
          style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 16px);"
          class="inline-flex items-center justify-center px-5 border border-slate-300 dark:border-slate-700 text-[var(--theme-text-primary,#0f172a)] text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all"
        >
          Sertifikasi Kami
        </a>
      </div>

      <div class="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-[var(--theme-text-muted,#64748b)] font-medium">
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Halal MUI</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Izin BPOM RI</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> P-IRT Terdaftar</span>
      </div>
    </div>

    <div data-node="image" class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800">
      <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
      <div class="absolute top-4 right-4 w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold text-center leading-tight shadow-lg rotate-12">
        100%<br />ASLI
      </div>
    </div>
  </div>
</div>
