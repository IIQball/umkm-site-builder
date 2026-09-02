<script lang="ts">
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let badgeText: string = 'HOT NEW MENU 2026 🔥';
  export let tagName: string = 'h1';
  export let title: string = 'Sensasi Pedas Manis Bikin Nagih Terus!';
  export let subtitle: string = 'Camilan kriuk dengan bumbu tabur melimpah. Cocok untuk teman nonton dan nongkrong asyik.';
  export let ctaText: string = 'Borong Sekarang';
  export let ctaLink: string = '#';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80';
  export let waNumber: string = '';
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya mau beli: ${title}`);
  $: effectiveCtaLink = waNumber ? waUrl : ctaLink;
</script>

<div class="bg-amber-100/80 dark:bg-amber-950/40 rounded-3xl p-6 sm:p-10 border border-amber-300 dark:border-amber-800 my-4">
  <div class="cq-grid-split items-center">
    <div class="text-left">
      {#if badgeText}
        <div
          data-node="badge"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'badge')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'badge')}
          class="inline-block bg-rose-500 text-white font-black text-xs px-3 py-1 rounded-md -rotate-3 mb-6 shadow-xs cursor-pointer"
        >
          {badgeText}
        </div>
      {/if}

      <svelte:element
        this={tagName || 'h1'}
        data-node="title"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'title')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'title')}
        class="cq-title-lg font-black text-slate-950 dark:text-amber-100 uppercase tracking-tight mb-4 cursor-pointer"
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
        <p class="text-base text-slate-700 dark:text-amber-200/80 leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div data-node="cta" class="cq-btn-group pt-4">
        <a
          href={effectiveCtaLink}
          target={waNumber ? '_blank' : '_self'}
          rel={waNumber ? 'noreferrer' : ''}
          style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 16px); background-color: var(--theme-primary, #0f172a); color: var(--theme-btn-primary-text, #ffffff);"
          class="inline-flex items-center justify-center px-6 text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
        >
          {ctaText || 'Borong Sekarang'}
        </a>
      </div>
    </div>

    <div data-node="image" class="relative w-full aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-2 bg-white dark:border-slate-800">
      <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
      <span class="absolute bottom-4 left-4 bg-yellow-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg shadow-md -rotate-6">
        PROMO TERBATAS!
      </span>
    </div>
  </div>
</div>
