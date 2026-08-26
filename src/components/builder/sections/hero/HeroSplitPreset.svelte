<script lang="ts">
  import { editorStore } from '../../stores/editorStore';
  import { ShoppingBag, CheckCircle2 } from 'lucide-svelte';

  export let sectionId: string;
  export let activePreset: string;
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

<div class="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center {activePreset === 'split_right_text' ? 'md:grid-flow-dense' : ''}">
  <!-- Text Column -->
  <div class="md:col-span-6 flex flex-col justify-center gap-4 text-left {activePreset === 'split_right_text' ? 'md:col-start-7' : ''}">
    {#if badgeText}
      <button
        type="button"
        on:click={(e) => selectNode(e, 'badge')}
        style={getNodeStyleStr('badge')}
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold w-fit transition-all cursor-pointer"
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
      class="text-left font-bold tracking-tight transition-all cursor-pointer"
      style:color="var(--theme-text-primary)"
    >
      {#if tagName === 'h2'}
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight">{title}</h2>
      {:else if tagName === 'h3'}
        <h3 class="text-xl md:text-2xl font-bold leading-snug">{title}</h3>
      {:else}
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">{title}</h1>
      {/if}
    </button>

    {#if subtitle}
      <button
        type="button"
        on:click={(e) => selectNode(e, 'subtitle')}
        style={getNodeStyleStr('subtitle')}
        class="text-left text-sm md:text-base leading-relaxed transition-all cursor-pointer"
        style:color="var(--theme-text-muted)"
      >
        <p>{subtitle}</p>
      </button>
    {/if}

    {#if activePreset === 'split_multi_badges'}
      <div class="flex flex-wrap items-center gap-2 pt-1">
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 size={12} /> Terpercaya
        </span>
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <CheckCircle2 size={12} /> Cepat & Aman
        </span>
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <CheckCircle2 size={12} /> 100% Asli
        </span>
      </div>
    {/if}

    <div class="pt-2">
      <button
        type="button"
        on:click={(e) => selectNode(e, 'cta')}
        style={getNodeStyleStr('cta')}
        class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
        style:background-color="var(--theme-primary)"
        style:color="#ffffff"
      >
        <ShoppingBag size={16} />
        <span>{ctaText}</span>
      </button>
    </div>
  </div>

  <!-- Image Column -->
  <div class="md:col-span-6 flex items-center justify-center {activePreset === 'split_right_text' ? 'md:col-start-1' : ''}">
    <button
      type="button"
      on:click={(e) => selectNode(e, 'image')}
      style={getNodeStyleStr('image')}
      class="w-full relative group rounded-2xl overflow-hidden shadow-xl aspect-4/3 transition-all cursor-pointer"
      style:background-color="var(--theme-surface)"
      style:border="1px solid var(--theme-border, rgba(0,0,0,0.08))"
    >
      <img src={imageUrl} alt="Banner Hero" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </button>
  </div>
</div>
