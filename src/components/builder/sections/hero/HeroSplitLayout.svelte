<script lang="ts">
  import { ShoppingBag } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let isImageLeft: boolean = false;
  export let badgeText: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#products';
  export let imageUrl: string = '';
  export let selectNode: (e: MouseEvent, key: string) => void = () => {};
  export let selectNodeKey: (e: KeyboardEvent, key: string) => void = () => {};

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';
</script>

<div class={`w-full grid gap-8 items-center ${isSmallScreen ? 'grid-cols-1' : 'grid-cols-12'}`}>
  {#if isImageLeft}
    <!-- Left: Image -->
    <div data-node="image" class={`w-full ${isSmallScreen ? 'order-2' : 'col-span-6 order-1'}`}>
      {#if imageUrl}
        <div class="p-2 rounded-2xl bg-base-200/60 dark:bg-slate-800/60 border border-base-300 dark:border-slate-800 shadow-md">
          <img
            src={imageUrl}
            alt="Hero Preview"
            class="w-full aspect-[4/3] object-cover rounded-lg"
          />
        </div>
      {/if}
    </div>

    <!-- Right: Text -->
    <div class={`flex flex-col items-start text-left gap-4 ${isSmallScreen ? 'order-1' : 'col-span-6 order-2'}`}>
      {#if badgeText}
        <div
          data-node="badge"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode(e, 'badge')}
          on:keydown={(e) => selectNodeKey(e, 'badge')}
          class="inline-flex items-center gap-1.5 px-4 h-8 rounded-full bg-blue-50 text-[var(--theme-primary,#2563eb)] text-xs font-bold border border-blue-200 cursor-pointer shadow-sm"
        >
          <span>{badgeText}</span>
        </div>
      {/if}

      <svelte:element
        this={tagName || 'h1'}
        data-node="title"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode(e, 'title')}
        on:keydown={(e) => selectNodeKey(e, 'title')}
        class="font-black tracking-tight leading-tight text-3xl sm:text-4xl lg:text-5xl text-[var(--theme-text-primary,#0f172a)] cursor-pointer"
      >
        {title}
      </svelte:element>

      <div
        data-node="subtitle"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode(e, 'subtitle')}
        on:keydown={(e) => selectNodeKey(e, 'subtitle')}
        class="cursor-pointer"
      >
        <p class="text-sm sm:text-base text-[var(--theme-text-muted,#64748b)] leading-relaxed">
          {subtitle}
        </p>
      </div>

      {#if ctaText}
        <div data-node="cta" class="pt-2">
          <a
            href={ctaLink}
            style="height: var(--theme-btn-height, 48px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
            class="inline-flex items-center justify-center px-6 font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            <ShoppingBag size={18} class="mr-2" />
            <span>{ctaText}</span>
          </a>
        </div>
      {/if}
    </div>
  {:else}
    <!-- Left: Text -->
    <div class={`flex flex-col items-start text-left gap-4 ${isSmallScreen ? 'col-span-1' : 'col-span-6'}`}>
      {#if badgeText}
        <div
          data-node="badge"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode(e, 'badge')}
          on:keydown={(e) => selectNodeKey(e, 'badge')}
          class="inline-flex items-center gap-1.5 px-4 h-8 rounded-full bg-blue-50 text-[var(--theme-primary,#2563eb)] text-xs font-bold border border-blue-200 cursor-pointer shadow-sm"
        >
          <span>{badgeText}</span>
        </div>
      {/if}

      <svelte:element
        this={tagName || 'h1'}
        data-node="title"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode(e, 'title')}
        on:keydown={(e) => selectNodeKey(e, 'title')}
        class="font-black tracking-tight leading-tight text-3xl sm:text-4xl lg:text-5xl text-[var(--theme-text-primary,#0f172a)] cursor-pointer"
      >
        {title}
      </svelte:element>

      <div
        data-node="subtitle"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode(e, 'subtitle')}
        on:keydown={(e) => selectNodeKey(e, 'subtitle')}
        class="cursor-pointer"
      >
        <p class="text-sm sm:text-base text-[var(--theme-text-muted,#64748b)] leading-relaxed">
          {subtitle}
        </p>
      </div>

      {#if ctaText}
        <div data-node="cta" class="pt-2">
          <a
            href={ctaLink}
            style="height: var(--theme-btn-height, 48px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
            class="inline-flex items-center justify-center px-6 font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            <ShoppingBag size={18} class="mr-2" />
            <span>{ctaText}</span>
          </a>
        </div>
      {/if}
    </div>

    <!-- Right: Image -->
    <div data-node="image" class={`w-full ${isSmallScreen ? 'col-span-1' : 'col-span-6'}`}>
      {#if imageUrl}
        <div class="p-2 rounded-2xl bg-base-200/60 dark:bg-slate-800/60 border border-base-300 dark:border-slate-800 shadow-md">
          <img
            src={imageUrl}
            alt="Hero Preview"
            class="w-full aspect-[4/3] object-cover rounded-lg"
          />
        </div>
      {/if}
    </div>
  {/if}
</div>
