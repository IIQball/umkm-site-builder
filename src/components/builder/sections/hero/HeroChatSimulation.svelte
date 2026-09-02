<script lang="ts">
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let badgeText: string = 'Pemesanan Langsung Tanpa Antri';
  export let tagName: string = 'h1';
  export let title: string = 'Pesan Menu Langsung Melalui WhatsApp';
  export let subtitle: string = 'Cukup klik tombol di bawah, admin kami akan langsung mengonfirmasi rincian pesanan Anda.';
  export let ctaText: string = 'Mulai Chat WhatsApp Sekarang';
  export let ctaLink: string = '#';
  export let waNumber: string = '';
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya ingin memesan menu langsung: ${title}`);
  $: effectiveCtaLink = waNumber ? waUrl : ctaLink;
</script>

<div class="py-12 text-center max-w-2xl mx-auto">
  {#if badgeText}
    <span
      data-node="badge"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'badge')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'badge')}
      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold mb-6 cursor-pointer"
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

  <!-- WhatsApp Chat Bubble Simulation -->
  <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl max-w-md mx-auto my-6 text-left space-y-3 shadow-sm">
    <div class="bg-white dark:bg-slate-800 p-3 rounded-xl rounded-tl-xs shadow-xs border border-slate-200 dark:border-slate-700 text-xs text-[var(--theme-text-primary,#0f172a)] max-w-[85%]">
      Halo Kak! Mau pesan Paket Favorit untuk makan siang ya?
      <span class="block text-[9px] text-slate-400 text-right mt-1">11.15</span>
    </div>
    <div class="bg-emerald-600 text-white p-3 rounded-xl rounded-tr-xs shadow-xs text-xs ml-auto max-w-[85%]">
      Siap Kak! Pesanan sudah kami jadwalkan, kurir langsung meluncur jam 11.45 ya ✨
      <span class="block text-[9px] text-emerald-200 text-right mt-1">11.16</span>
    </div>
  </div>

  <div data-node="cta" class="cq-btn-group justify-center">
    <a
      href={effectiveCtaLink}
      target={waNumber ? '_blank' : '_self'}
      rel={waNumber ? 'noreferrer' : ''}
      style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 16px); background-color: var(--theme-primary, #059669); color: var(--theme-btn-primary-text, #ffffff);"
      class="inline-flex items-center justify-center px-7 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
    >
      {ctaText || 'Mulai Chat WhatsApp Sekarang'}
    </a>
  </div>
</div>
