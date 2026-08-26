<script lang="ts">
  import { editorStore } from '../../stores/editorStore';
  import { ShoppingBag } from 'lucide-svelte';

  export let sectionId: string;
  export let activePreset: string;
  export let tagName: string;
  export let title: string;
  export let subtitle: string;
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

{#if activePreset === 'full_banner_overlay'}
  <div class="relative z-10 w-full flex flex-col items-center text-center max-w-2xl mx-auto gap-4 py-8">
    {#if badgeText}
      <button
        type="button"
        on:click={(e) => selectNode(e, 'badge')}
        style={getNodeStyleStr('badge')}
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
        style:background-color="rgba(255, 255, 255, 0.2)"
        style:color="#ffffff"
        style:border="1px solid rgba(255, 255, 255, 0.3)"
      >
        <span>{badgeText}</span>
      </button>
    {/if}

    <button
      type="button"
      on:click={(e) => selectNode(e, 'title')}
      style={getNodeStyleStr('title')}
      class="text-center font-bold tracking-tight transition-all cursor-pointer text-white drop-shadow-md"
    >
      {#if tagName === 'h2'}
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-black">{title}</h2>
      {:else if tagName === 'h3'}
        <h3 class="text-2xl md:text-3xl font-bold">{title}</h3>
      {:else}
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-black">{title}</h1>
      {/if}
    </button>

    {#if subtitle}
      <button
        type="button"
        on:click={(e) => selectNode(e, 'subtitle')}
        style={getNodeStyleStr('subtitle')}
        class="text-center text-sm md:text-base leading-relaxed text-white/90 drop-shadow transition-all cursor-pointer max-w-lg"
      >
        <p>{subtitle}</p>
      </button>
    {/if}

    <div class="pt-2">
      <button
        type="button"
        on:click={(e) => selectNode(e, 'cta')}
        style={getNodeStyleStr('cta')}
        class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm shadow-xl transition-all cursor-pointer"
        style:background-color="var(--theme-primary)"
        style:color="#ffffff"
      >
        <ShoppingBag size={16} />
        <span>{ctaText}</span>
      </button>
    </div>
  </div>
{:else}
  <!-- hero_card_overlap -->
  <div class="relative z-10 w-full max-w-2xl mx-auto -mb-16 mt-8">
    <div
      class="p-6 md:p-8 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-4"
      style:background-color="var(--theme-surface)"
      style:border="1px solid var(--theme-border, rgba(0,0,0,0.08))"
    >
      {#if badgeText}
        <button
          type="button"
          on:click={(e) => selectNode(e, 'badge')}
          style={getNodeStyleStr('badge')}
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer"
          style:background-color="var(--theme-bg)"
          style:color="var(--theme-primary)"
        >
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
        <h2 class="text-2xl md:text-3xl font-extrabold">{title}</h2>
      </button>

      {#if subtitle}
        <button
          type="button"
          on:click={(e) => selectNode(e, 'subtitle')}
          style={getNodeStyleStr('subtitle')}
          class="text-center text-xs md:text-sm leading-relaxed transition-all cursor-pointer"
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
          class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
          style:background-color="var(--theme-primary)"
          style:color="#ffffff"
        >
          <ShoppingBag size={14} />
          <span>{ctaText}</span>
        </button>
      </div>
    </div>
  </div>
{/if}
