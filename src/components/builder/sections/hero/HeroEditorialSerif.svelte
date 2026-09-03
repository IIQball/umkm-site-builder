<script lang="ts">
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let badgeText: string = 'Handcrafted Jewelry & Leather';
  export let tagName: string = 'h1';
  export let title: string = 'Karya Seni Buatan Tangan Berjiwa Abadi';
  export let subtitle: string = 'Dikerjakan secara teliti oleh artisan lokal untuk menghasilkan detail presisi yang personal.';
  export let ctaText: string = 'Eksplorasi Katalog';
  export let ctaLink: string = '#';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&auto=format&fit=crop&q=80';
  export let waNumber: string = '';
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya tertarik dengan karya artisan: ${title}`);
  $: effectiveCtaLink = waNumber ? waUrl : ctaLink;
</script>

<div class="bg-[var(--color-nested-base,#f1f5f9)] rounded-3xl p-6 sm:p-12 border border-[var(--color-border,rgba(15,23,42,0.08))] text-center my-4">
  <div class="max-w-3xl mx-auto">
    {#if badgeText}
      <span
        data-node="badge"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'badge')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'badge')}
        class="inline-flex items-center rounded-full border px-2.5 py-1 text-2xs gap-1.5 font-heading font-medium bg-blue-50/90 dark:bg-blue-950/70 border-blue-200/90 dark:border-blue-800/80 text-[var(--color-primary,#2563eb)] mb-6 cursor-pointer shadow-2xs"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-primary,#2563eb)]"></span>
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
      class="text-heading-xl font-heading font-extrabold text-[var(--color-text-main,#0f172a)] tracking-tight mb-4 cursor-pointer"
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
      <p class="text-body-base text-[var(--color-text-secondary,#334155)] leading-relaxed max-w-xl mx-auto font-sans">
        {subtitle}
      </p>
    </div>

    <div data-node="cta" class="cq-btn-group justify-center pt-4 mb-8">
      <a
        href={effectiveCtaLink}
        target={waNumber ? '_blank' : '_self'}
        rel={waNumber ? 'noreferrer' : ''}
        style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 16px); background-color: var(--color-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
        class="inline-flex items-center justify-center px-7 text-sm font-heading font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-xs"
      >
        {ctaText || 'Eksplorasi Katalog'}
      </a>
    </div>

    <div data-node="image" class="w-full aspect-[16/8] rounded-2xl overflow-hidden shadow-xl border border-[var(--color-border,rgba(15,23,42,0.08))]">
      <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
    </div>
  </div>
</div>
