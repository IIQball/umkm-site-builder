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

<div class="bg-[#faf8f5] dark:bg-stone-950/80 rounded-3xl p-6 sm:p-12 border border-stone-200 dark:border-stone-800 text-center font-serif my-4">
  <div class="max-w-3xl mx-auto">
    {#if badgeText}
      <span
        data-node="badge"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'badge')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'badge')}
        class="font-sans text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold mb-6 block cursor-pointer"
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
      class="cq-title-lg font-normal text-stone-900 dark:text-stone-100 tracking-tight italic mb-4 cursor-pointer"
    >
      {title}
    </svelte:element>

    <div
      data-node="subtitle"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'subtitle')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'subtitle')}
      class="font-sans cursor-pointer mb-4"
    >
      <p class="text-base text-stone-600 dark:text-stone-400 leading-relaxed max-w-xl mx-auto">
        {subtitle}
      </p>
    </div>

    <div data-node="cta" class="font-sans cq-btn-group justify-center pt-4 mb-8">
      <a
        href={effectiveCtaLink}
        target={waNumber ? '_blank' : '_self'}
        rel={waNumber ? 'noreferrer' : ''}
        style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 16px); background-color: var(--theme-primary, #1c1917); color: var(--theme-btn-primary-text, #ffffff);"
        class="inline-flex items-center justify-center px-7 text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all"
      >
        {ctaText || 'Eksplorasi Katalog'}
      </a>
    </div>

    <div data-node="image" class="w-full aspect-[16/8] rounded-2xl overflow-hidden shadow-xl border border-stone-200 dark:border-stone-800">
      <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
    </div>
  </div>
</div>
