<script lang="ts">
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let badgeText: string = 'Paket Bundling Spesial';
  export let tagName: string = 'h1';
  export let title: string = 'Dua Varian Paling Dicari Pekan Ini';
  export let subtitle: string = 'Pilih paket bundling favorit untuk mendapatkan gratis ongkir dan bonus merchandise menarik.';
  export let ctaText: string = 'Pesan Varian';
  export let ctaLink: string = '#products';
  export let waNumber: string = '';
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya ingin membeli ${title}`);
  $: effectiveCtaLink = waNumber ? waUrl : ctaLink;
</script>

<div class="py-12 md:py-16 text-center">
  <div class="max-w-xl mx-auto mb-8">
    {#if badgeText}
      <span
        data-node="badge"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'badge')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'badge')}
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800/80 mb-4 cursor-pointer"
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
      class="font-black tracking-tight text-3xl sm:text-4xl text-[var(--theme-text-primary,#0f172a)] cursor-pointer leading-tight mb-3"
    >
      {title}
    </svelte:element>

    <div
      data-node="subtitle"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'subtitle')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'subtitle')}
      class="cursor-pointer"
    >
      <p class="text-sm sm:text-base text-[var(--theme-text-muted,#64748b)] leading-relaxed">
        {subtitle}
      </p>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
    <div class="bg-[var(--theme-surface,white)] p-5 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
      <div class="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3">
        <img src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80" alt="Varian Paket 1" class="w-full h-full object-cover" />
      </div>
      <h3 class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)] mb-1">Paket Varian A - Best Seller</h3>
      <p class="text-xs text-[var(--theme-text-muted,#64748b)] mb-4">Cita rasa unik dengan kemasan ramah lingkungan</p>
      <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <span class="font-bold text-sm text-emerald-600 dark:text-emerald-400">Rp 45.000</span>
        <a
          href={effectiveCtaLink}
          target={waNumber ? '_blank' : '_self'}
          class="h-8 px-4 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all inline-flex items-center justify-center"
        >
          {ctaText || 'Pesan'}
        </a>
      </div>
    </div>

    <div class="bg-[var(--theme-surface,white)] p-5 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
      <div class="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3">
        <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80" alt="Varian Paket 2" class="w-full h-full object-cover" />
      </div>
      <h3 class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)] mb-1">Paket Varian B - Premium</h3>
      <p class="text-xs text-[var(--theme-text-muted,#64748b)] mb-4">Kualitas unggulan dengan aroma khas istimewa</p>
      <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <span class="font-bold text-sm text-emerald-600 dark:text-emerald-400">Rp 65.000</span>
        <a
          href={effectiveCtaLink}
          target={waNumber ? '_blank' : '_self'}
          class="h-8 px-4 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all inline-flex items-center justify-center"
        >
          {ctaText || 'Pesan'}
        </a>
      </div>
    </div>
  </div>
</div>
