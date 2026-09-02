<script lang="ts">
  import { Star } from 'lucide-svelte';
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let badgeText: string = 'Koleksi Spesial UMKM';
  export let tagName: string = 'h1';
  export let title: string = 'Solusi Kualitas Terbaik untuk Kebutuhan Anda';
  export let subtitle: string = 'Dibuat dengan bahan organik pilihan dan formulasi teruji untuk kenyamanan Anda sehari-hari.';
  export let ctaText: string = 'Konsultasi Sekarang';
  export let ctaLink: string = '#';
  export let waNumber: string = '';
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya tertarik dengan ${title}`);
  $: effectiveCtaLink = waNumber ? waUrl : ctaLink;
</script>

<div class="py-12 md:py-16 text-center max-w-2xl mx-auto flex flex-col items-center">
  <!-- Avatar Wall & Social Proof Rating -->
  <div class="flex items-center justify-center gap-3 mb-6">
    <div class="flex -space-x-2 overflow-hidden">
      <img class="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
      <img class="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
      <img class="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
      <img class="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
    </div>
    <div class="text-left text-xs">
      <div class="flex text-amber-400 gap-0.5">
        {#each Array(5) as _}
          <Star size={12} class="fill-current text-amber-400" />
        {/each}
      </div>
      <span class="text-slate-600 dark:text-slate-300 font-medium font-mono text-[11px]">Dipercaya oleh <strong>2.500+</strong> Pembeli</span>
    </div>
  </div>

  {#if badgeText}
    <span
      data-node="badge"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'badge')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'badge')}
      class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/80 mb-6 cursor-pointer"
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
    class="font-black tracking-tight text-3xl sm:text-5xl text-[var(--theme-text-primary,#0f172a)] cursor-pointer leading-tight mb-4"
  >
    {title}
  </svelte:element>

  <div
    data-node="subtitle"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode && selectNode(e, 'subtitle')}
    on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'subtitle')}
    class="mb-6 cursor-pointer"
  >
    <p class="text-base text-[var(--theme-text-muted,#64748b)] leading-relaxed max-w-xl">
      {subtitle}
    </p>
  </div>

  {#if ctaText}
    <div data-node="cta" class="flex items-center justify-center gap-3">
      <a
        href={effectiveCtaLink}
        target={waNumber ? '_blank' : '_self'}
        rel={waNumber ? 'noreferrer' : ''}
        style="height: var(--theme-btn-height, 44px); border-radius: var(--theme-btn-radius, 12px); background-color: var(--theme-primary, #0d9488); color: var(--theme-btn-primary-text, #ffffff);"
        class="inline-flex items-center justify-center px-7 font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all"
      >
        <span>{ctaText}</span>
      </a>
    </div>
  {/if}
</div>
