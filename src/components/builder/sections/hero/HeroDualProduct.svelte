<script lang="ts">
  import { generateWhatsAppLink } from '@/lib/whatsapp';
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = 'Paket Bundling Spesial';
  export let tagName: string = 'h1';
  export let title: string = 'Dua Varian Paling Dicari Pekan Ini';
  export let subtitle: string = 'Pilih paket bundling favorit untuk mendapatkan gratis ongkir dan bonus merchandise menarik.';
  export let ctaText: string = 'Pesan Varian';
  export let ctaLink: string = '#products';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya ingin membeli ${title}`);
  $: effectiveCtaLink = waNumber ? waUrl : ctaLink;
</script>

<div class="py-12 md:py-16 text-center">
  <div class="max-w-xl mx-auto mb-8">
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
      align="center"
    />
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
    <div class="bg-[var(--color-card-base,#ffffff)] p-5 rounded-2xl shadow-md border border-[var(--color-border,rgba(15,23,42,0.08))]">
      <div class="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3">
        <img src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80" alt="Varian Paket 1" class="w-full h-full object-cover" />
      </div>
      <h3 class="font-heading font-bold text-sm text-[var(--color-text-main,#0f172a)] mb-1">Paket Varian A - Best Seller</h3>
      <p class="text-xs text-[var(--color-text-secondary,#334155)] mb-4 font-sans">Cita rasa unik dengan kemasan ramah lingkungan</p>
      <div class="flex items-center justify-between pt-3 border-t border-[var(--color-border,rgba(15,23,42,0.08))]">
        <span class="font-heading font-bold text-sm text-emerald-600 dark:text-emerald-400">Rp 45.000</span>
        <a
          href={effectiveCtaLink}
          target={waNumber ? '_blank' : '_self'}
          class="h-8 px-4 rounded-xl bg-[var(--color-primary,#2563eb)] text-white text-xs font-heading font-semibold hover:bg-primary-dark active:scale-[0.98] transition-all inline-flex items-center justify-center shadow-xs"
        >
          {ctaText || 'Pesan'}
        </a>
      </div>
    </div>

    <div class="bg-[var(--color-card-base,#ffffff)] p-5 rounded-2xl shadow-md border border-[var(--color-border,rgba(15,23,42,0.08))]">
      <div class="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3">
        <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80" alt="Varian Paket 2" class="w-full h-full object-cover" />
      </div>
      <h3 class="font-heading font-bold text-sm text-[var(--color-text-main,#0f172a)] mb-1">Paket Varian B - Premium</h3>
      <p class="text-xs text-[var(--color-text-secondary,#334155)] mb-4 font-sans">Kualitas unggulan dengan aroma khas istimewa</p>
      <div class="flex items-center justify-between pt-3 border-t border-[var(--color-border,rgba(15,23,42,0.08))]">
        <span class="font-heading font-bold text-sm text-emerald-600 dark:text-emerald-400">Rp 65.000</span>
        <a
          href={effectiveCtaLink}
          target={waNumber ? '_blank' : '_self'}
          class="h-8 px-4 rounded-xl bg-[var(--color-primary,#2563eb)] text-white text-xs font-heading font-semibold hover:bg-primary-dark active:scale-[0.98] transition-all inline-flex items-center justify-center shadow-xs"
        >
          {ctaText || 'Pesan'}
        </a>
      </div>
    </div>
  </div>
</div>
