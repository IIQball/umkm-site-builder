<script lang="ts">
  import { editorStore } from '../../stores/editorStore';
  import { ShoppingBag } from 'lucide-svelte';

  export let sectionId: string;
  export let tagName: string;
  export let title: string;
  export let subtitle: string;
  export let imageUrl: string;
  export let ctaText: string;
  export let resolvedCtaLink: string;
  export let badgeText: string;
  export let getNodeStyleStr: (name: string) => string;

  void resolvedCtaLink;

  function selectNode(e: MouseEvent, name: string) {
    e.stopPropagation();
    editorStore.selectNode(sectionId, name);
  }
</script>

<div class="w-full flex flex-col items-center text-center max-w-3xl mx-auto gap-5">
  {#if badgeText}
    <button
      type="button"
      on:click={(e) => selectNode(e, 'badge')}
      style={getNodeStyleStr('badge')}
      class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer"
      style:background-color="var(--theme-surface)"
      style:color="var(--theme-primary)"
      style:border="1px solid var(--theme-primary)"
    >
      <span class="w-2 h-2 rounded-full animate-pulse" style:background-color="var(--theme-primary)"></span>
      <span>{badgeText}</span>
    </button>
  {/if}

  <button
    type="button"
    on:click={(e) => selectNode(e, 'title')}
    style={getNodeStyleStr('title')}
    class="text-center font-bold tracking-tight transition-all cursor-pointer"
    style:color="var(--theme-text-primary)"
  >
    {#if tagName === 'h2'}
      <h2 class="text-3xl md:text-4xl font-extrabold leading-tight">{title}</h2>
    {:else if tagName === 'h3'}
      <h3 class="text-2xl md:text-3xl font-bold leading-snug">{title}</h3>
    {:else}
      <h1 class="text-4xl md:text-5xl font-black leading-tight">{title}</h1>
    {/if}
  </button>

  {#if subtitle}
    <button
      type="button"
      on:click={(e) => selectNode(e, 'subtitle')}
      style={getNodeStyleStr('subtitle')}
      class="text-center text-sm md:text-base leading-relaxed max-w-xl transition-all cursor-pointer"
      style:color="var(--theme-text-muted)"
    >
      <p>{subtitle}</p>
    </button>
  {/if}

  <div class="pt-1">
    <button
      type="button"
      on:click={(e) => selectNode(e, 'cta')}
      style={getNodeStyleStr('cta')}
      class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
      style:background-color="var(--theme-primary)"
      style:color="#ffffff"
    >
      <ShoppingBag size={16} />
      <span>{ctaText}</span>
    </button>
  </div>

  {#if imageUrl}
    <button
      type="button"
      on:click={(e) => selectNode(e, 'image')}
      style={getNodeStyleStr('image')}
      class="w-full mt-4 rounded-2xl overflow-hidden shadow-2xl aspect-16/9 transition-all cursor-pointer"
      style:border="1px solid var(--theme-border, rgba(0,0,0,0.08))"
    >
      <img src={imageUrl} alt="Banner Hero" class="w-full h-full object-cover" />
    </button>
  {/if}
</div>
