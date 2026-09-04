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
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya mau beli: ${title}`);
  $: effectiveCtaLink = waNumber ? waUrl : ctaLink;

  $: isBadgeActive = activeNodeId === 'hero_badge' || activeNodeId === 'badge';
  $: isTitleActive = activeNodeId === 'hero_title' || activeNodeId === 'title';
  $: isSubtitleActive = activeNodeId === 'hero_subtitle' || activeNodeId === 'subtitle';
  $: isCtaActive = activeNodeId === 'hero_cta' || activeNodeId === 'cta';
  $: isImageActive = activeNodeId === 'hero_image' || activeNodeId === 'image';
</script>

<div class="bg-amber-100/80 dark:bg-amber-950/40 rounded-3xl p-6 sm:p-10 border border-amber-300 dark:border-amber-800 my-4">
  <div class="cq-grid-split items-center gap-8">
    <div class="text-left space-y-4">
      {#if badgeText}
        <div
          data-node="badge"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'hero_badge')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_badge')}
          class={`inline-block bg-rose-500 text-white font-black text-xs px-3 py-1 rounded-md -rotate-3 mb-4 shadow-xs transition-all cursor-pointer ${
            isBadgeActive ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
          }`}
        >
          {badgeText}
        </div>
      {/if}

      <svelte:element
        this={tagName || 'h1'}
        data-node="title"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'hero_title')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_title')}
        class={`text-heading-xl font-heading font-black text-slate-950 dark:text-amber-100 uppercase tracking-tight mb-4 transition-all cursor-pointer rounded-xl p-1.5 -ml-1.5 ${
          isTitleActive ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/20' : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
        }`}
      >
        {title}
      </svelte:element>

      {#if subtitle}
        <div
          data-node="subtitle"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'hero_subtitle')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_subtitle')}
          class={`cursor-pointer mb-4 rounded-xl p-1.5 -ml-1.5 transition-all ${
            isSubtitleActive ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/20' : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
          }`}
        >
          <p class="text-body-base text-slate-700 dark:text-amber-200/80 leading-relaxed font-sans">
            {subtitle}
          </p>
        </div>
      {/if}

      <div
        data-node="cta"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'hero_cta')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_cta')}
        class={`cq-btn-group pt-4 rounded-xl p-1.5 -ml-1.5 transition-all cursor-pointer ${
          isCtaActive ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/20' : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
        }`}
      >
        <a
          href={effectiveCtaLink}
          target={waNumber ? '_blank' : '_self'}
          rel={waNumber ? 'noreferrer' : ''}
          class="inline-flex items-center justify-center h-10 min-h-[40px] px-6 rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-sm font-heading font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-xs"
        >
          {ctaText || 'Borong Sekarang'}
        </a>
      </div>
    </div>

    <div
      data-node="image"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_image')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_image')}
      class={`relative w-full aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-2 bg-white dark:border-slate-800 transition-all cursor-pointer ${
        isImageActive ? 'ring-4 ring-blue-500' : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
      <span class="absolute bottom-4 left-4 bg-yellow-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg shadow-md -rotate-6 font-heading">
        PROMO TERBATAS!
      </span>
    </div>
  </div>
</div>
