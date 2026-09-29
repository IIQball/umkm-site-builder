<script lang="ts">
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let badgeText: string = 'Handcrafted Jewelry & Leather';
  export let tagName: string = 'h1';
  export let title: string = 'Karya Seni Buatan Tangan Berjiwa Abadi';
  export let subtitle: string = 'Dikerjakan secara teliti oleh artisan lokal untuk menghasilkan detail presisi yang personal.';
  export let ctaText: string = 'Eksplorasi Katalog';
  export let ctaLink: string = '#';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&auto=format&fit=crop&q=80'
  export let waNumber: string = '';
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta', 'image'];

  $: effectiveOrder = elementOrder && elementOrder.length > 0 ? elementOrder : ['badge', 'title', 'subtitle', 'cta', 'image'];
  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya tertarik dengan karya artisan: ${title}`);
  $: effectiveCtaLink = waNumber ? waUrl : ctaLink;
</script>

<div class="bg-[var(--color-nested-base)] rounded-3xl p-6 sm:p-12 border border-[var(--color-border)] text-center my-4">
  <div class="max-w-3xl mx-auto flex flex-col items-center">
    {#each effectiveOrder as slot (slot)}
      {#if slot === 'badge' && badgeText}
        <span
          data-node="badge"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'badge')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'badge')}
          style="border-radius: var(--theme-btn-radius, var(--btn-radius, 9999px));"
          class="badge badge-outline gap-1.5 px-2.5 py-1 text-2xs font-heading font-medium bg-[var(--color-card-base)] border-[var(--color-border)] text-[var(--color-primary)] mb-6 cursor-pointer shadow-2xs"
        >
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: var(--color-primary);"></span>
          {badgeText}
        </span>
      {:else if slot === 'title'}
        <svelte:element
          this={tagName || 'h1'}
          data-node="title"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'title')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'title')}
          style="font-size: var(--text-h1-size, inherit); font-weight: var(--text-h1-weight, inherit); color: var(--color-text-main);"
          class="text-heading-xl font-heading font-extrabold tracking-tight mb-4 cursor-pointer"
        >
          {title}
        </svelte:element>
      {:else if slot === 'subtitle' && subtitle}
        <div
          data-node="subtitle"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'subtitle')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'subtitle')}
          class="cursor-pointer mb-4 w-full"
        >
          <p
            style="font-size: var(--text-body-size, inherit); font-weight: var(--text-body-weight, inherit); color: var(--color-text-secondary);"
            class="text-body-base leading-relaxed max-w-xl mx-auto font-sans"
          >
            {subtitle}
          </p>
        </div>
      {:else if slot === 'cta' && ctaText}
        <div data-node="cta" class="cq-btn-group justify-center pt-4 mb-8">
          <a
            href={effectiveCtaLink}
            target={waNumber ? '_blank' : '_self'}
            rel={waNumber ? 'noreferrer' : ''}
            style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, currentColor);"
            class="btn btn-primary font-heading font-semibold shadow-xs px-7 text-sm"
          >
            {ctaText || 'Eksplorasi Katalog'}
          </a>
        </div>
      {:else if slot === 'image' && imageUrl}
        <div data-node="image" class="w-full aspect-[16/8] rounded-2xl overflow-hidden shadow-xl border border-[var(--color-border)] my-2">
          <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
        </div>
      {/if}
    {/each}
  </div>
</div>
