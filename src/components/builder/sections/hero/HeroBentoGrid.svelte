<script lang="ts">
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let badgeText: string = 'Pusat Batik Khas Tradisional';
  export let tagName: string = 'h1';
  export let title: string = 'Kain Batik Tulis Motif Asli Warisan Budaya';
  export let subtitle: string = 'Ditenun dari benang sutra halus dengan pewarna alami ramah lingkungan oleh para pengrajin lokal.';
  export let ctaText: string = 'Lihat Motif Baru';
  export let ctaLink: string = '#';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=80';
  export let waNumber: string = '';
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya tertarik dengan koleksi ${title}`);
  $: effectiveCtaLink = waNumber ? waUrl : ctaLink;
</script>

<div class="py-10">
  <div class="cq-bento-grid">
    <!-- Tile 1: Main text -->
    <div class="bg-[var(--theme-surface,#ffffff)] p-6 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 cq-bento-span-7 flex flex-col justify-between text-left">
      <div>
        {#if badgeText}
          <span
            data-node="badge"
            role="button"
            tabindex="0"
            on:click={(e) => selectNode && selectNode(e, 'badge')}
            on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'badge')}
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold mb-6 cursor-pointer"
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
          class="cq-title-lg font-extrabold text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-4 cursor-pointer"
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
          <p class="text-base text-[var(--theme-text-muted,#64748b)] leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      <div data-node="cta" class="cq-btn-group pt-4">
        <a
          href={effectiveCtaLink}
          target={waNumber ? '_blank' : '_self'}
          rel={waNumber ? 'noreferrer' : ''}
          style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 16px); background-color: var(--theme-primary, #0f172a); color: var(--theme-btn-primary-text, #ffffff);"
          class="inline-flex items-center justify-center px-6 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          {ctaText || 'Lihat Motif Baru'}
        </a>
      </div>
    </div>

    <!-- Tile 2: Main Image -->
    <div data-node="image" class="rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-800 cq-bento-span-5 h-60">
      <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
    </div>

    <!-- Tile 3: Promo Discount -->
    <div class="bg-amber-600 text-white p-5 rounded-2xl shadow-xs cq-bento-span-4 text-left flex flex-col justify-between">
      <span class="text-xs font-bold uppercase tracking-wider text-amber-200">Diskon Pembeli Pertama</span>
      <p class="text-2xl font-extrabold my-2">Potongan 25%</p>
      <span class="text-xs text-amber-100">Klaim voucher di WhatsApp sekarang</span>
    </div>

    <!-- Tile 4: Review Quote -->
    <div class="bg-[var(--theme-surface,#ffffff)] p-5 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 cq-bento-span-4 text-left">
      <div class="text-amber-400 text-xs mb-1">★★★★★</div>
      <p class="text-xs text-slate-700 dark:text-slate-300 italic">"Bahan sangat halus dan adem, motifnya khas dan tidak pasaran."</p>
      <p class="text-[11px] font-bold text-[var(--theme-text-primary,#0f172a)] mt-2">— Pelanggan Terverifikasi</p>
    </div>

    <!-- Tile 5: Fast Delivery -->
    <div class="bg-[var(--theme-surface,#ffffff)] p-5 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 cq-bento-span-4 text-left flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center text-lg shrink-0">🚚</div>
      <div>
        <p class="font-bold text-xs text-[var(--theme-text-primary,#0f172a)]">Kirim Seluruh Indonesia</p>
        <p class="text-[11px] text-[var(--theme-text-muted,#64748b)]">Garansi retur barang aman</p>
      </div>
    </div>
  </div>
</div>
