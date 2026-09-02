<script lang="ts">
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let badgeText: string = 'Kisah di Balik Dapur Kami';
  export let tagName: string = 'h1';
  export let title: string = '"Kami Memasak Seperti Menyajikan Makanan untuk Ibu Sendiri"';
  export let subtitle: string = 'Bermula dari warung kecil tahun 2012, kami mempertahankan racikan bumbu ulek tradisional tanpa MSG berlebih demi menjaga kemurnian rasa.';
  export let ctaText: string = 'Coba Menu Kami';
  export let ctaLink: string = '#';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&auto=format&fit=crop&q=80';
  export let waNumber: string = '';
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya membaca kisah usaha Anda dan ingin mencoba: ${title}`);
  $: effectiveCtaLink = waNumber ? waUrl : ctaLink;
</script>

<div class="py-10">
  <div class="cq-grid-split items-center">
    <!-- Founder Portrait Card -->
    <div data-node="image" class="relative w-full aspect-[4/5] max-w-sm mx-auto rounded-2xl overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800">
      <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
      <div class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-left">
        <p class="font-bold text-sm">Pendiri & Artisan</p>
        <p class="text-[11px] text-slate-300">Pengrajin Resep Asli</p>
      </div>
    </div>

    <!-- Story Narrative Text -->
    <div class="text-left">
      {#if badgeText}
        <span
          data-node="badge"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'badge')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'badge')}
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[var(--theme-text-primary,#0f172a)] text-xs font-semibold mb-6 cursor-pointer"
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

      <div data-node="cta" class="cq-btn-group pt-4">
        <a
          href={effectiveCtaLink}
          target={waNumber ? '_blank' : '_self'}
          rel={waNumber ? 'noreferrer' : ''}
          style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 16px); background-color: var(--theme-primary, #0f172a); color: var(--theme-btn-primary-text, #ffffff);"
          class="inline-flex items-center justify-center px-6 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          {ctaText || 'Coba Menu Kami'}
        </a>
      </div>
    </div>
  </div>
</div>
