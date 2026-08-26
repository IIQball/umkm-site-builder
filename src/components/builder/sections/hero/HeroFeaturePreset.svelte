<script lang="ts">
  import { editorStore } from '../../stores/editorStore';
  import { ShoppingBag, Search, ShieldCheck, Truck, Clock } from 'lucide-svelte';

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

  void tagName;
  void resolvedCtaLink;

  function selectNode(e: MouseEvent, name: string) {
    e.stopPropagation();
    editorStore.selectNode(sectionId, name);
  }
</script>

{#if activePreset === 'hero_triple_highlights'}
  <div class="w-full flex flex-col gap-8">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      <div class="md:col-span-6 flex flex-col gap-4 text-left">
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
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">{title}</h1>
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

        <div class="pt-2">
          <button
            type="button"
            on:click={(e) => selectNode(e, 'cta')}
            style={getNodeStyleStr('cta')}
            class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
            style:background-color="var(--theme-primary)"
            style:color="#ffffff"
          >
            <ShoppingBag size={16} />
            <span>{ctaText}</span>
          </button>
        </div>
      </div>

      <div class="md:col-span-6">
        <button
          type="button"
          on:click={(e) => selectNode(e, 'image')}
          style={getNodeStyleStr('image')}
          class="w-full relative rounded-2xl overflow-hidden shadow-xl aspect-4/3 transition-all cursor-pointer"
          style:background-color="var(--theme-surface)"
        >
          <img src={imageUrl} alt="Banner Hero" class="w-full h-full object-cover" />
        </button>
      </div>
    </div>

    <!-- Triple Highlights Bar -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-base-200 dark:border-slate-800">
      <div class="flex items-center gap-3 p-3 rounded-xl bg-base-200/40 dark:bg-slate-900/40">
        <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <Truck size={20} />
        </div>
        <div>
          <h4 class="font-bold text-xs text-base-content">Pengiriman Cepat</h4>
          <p class="text-[11px] text-base-content/60">Siap kirim ke seluruh kota</p>
        </div>
      </div>
      <div class="flex items-center gap-3 p-3 rounded-xl bg-base-200/40 dark:bg-slate-900/40">
        <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 class="font-bold text-xs text-base-content">Kualitas Terjamin</h4>
          <p class="text-[11px] text-base-content/60">Bahan premium pilihan</p>
        </div>
      </div>
      <div class="flex items-center gap-3 p-3 rounded-xl bg-base-200/40 dark:bg-slate-900/40">
        <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <Clock size={20} />
        </div>
        <div>
          <h4 class="font-bold text-xs text-base-content">Layanan Ramah</h4>
          <p class="text-[11px] text-base-content/60">Respon cepat via WhatsApp</p>
        </div>
      </div>
    </div>
  </div>
{:else}
  <!-- hero_search_focused -->
  <div class="w-full flex flex-col items-center text-center max-w-2xl mx-auto gap-4 py-4">
    {#if badgeText}
      <button
        type="button"
        on:click={(e) => selectNode(e, 'badge')}
        style={getNodeStyleStr('badge')}
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer"
        style:background-color="var(--theme-surface)"
        style:color="var(--theme-primary)"
        style:border="1px solid var(--theme-primary)"
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
      <h1 class="text-3xl md:text-5xl font-black leading-tight">{title}</h1>
    </button>

    {#if subtitle}
      <button
        type="button"
        on:click={(e) => selectNode(e, 'subtitle')}
        style={getNodeStyleStr('subtitle')}
        class="text-center text-sm leading-relaxed transition-all cursor-pointer"
        style:color="var(--theme-text-muted)"
      >
        <p>{subtitle}</p>
      </button>
    {/if}

    <!-- Search Focused Bar -->
    <div class="w-full mt-2 relative max-w-md">
      <div class="flex items-center gap-2 p-2 bg-base-100 dark:bg-slate-900 rounded-2xl shadow-lg border border-base-300 dark:border-slate-800">
        <Search size={18} class="text-base-content/40 ml-2" />
        <input
          type="text"
          placeholder="Cari produk favorit Anda..."
          class="flex-1 bg-transparent text-xs text-base-content placeholder-base-content/40 focus:outline-none"
          disabled
        />
        <button
          type="button"
          on:click={(e) => selectNode(e, 'cta')}
          style={getNodeStyleStr('cta')}
          class="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer"
          style:background-color="var(--theme-primary)"
        >
          {ctaText}
        </button>
      </div>
    </div>
  </div>
{/if}
