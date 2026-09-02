<script lang="ts">
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let badgeText: string = 'Catering Harian & Prasmanan';
  export let tagName: string = 'h1';
  export let title: string = 'Pilihan Utama Jamuan Kantor & Syukuran';
  export let subtitle: string = 'Menyajikan menu prasmanan higienis, lezat, dan tepat waktu untuk berbagai skala acara.';
  export let ctaText: string = 'Pesan Paket Catering';
  export let ctaLink: string = '#';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80';
  export let waNumber: string = '';
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya ingin menanyakan paket catering: ${title}`);
  $: effectiveCtaLink = waNumber ? waUrl : ctaLink;
</script>

<div class="py-10">
  <div class="cq-grid-split">
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

      <div data-node="cta" class="cq-btn-group pt-4 mb-8">
        <a
          href={effectiveCtaLink}
          target={waNumber ? '_blank' : '_self'}
          rel={waNumber ? 'noreferrer' : ''}
          style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 16px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
          class="inline-flex items-center justify-center px-6 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          {ctaText || 'Pesan Paket Catering'}
        </a>
      </div>

      <!-- Stat Metrics Counter Row -->
      <div class="cq-stat-container pt-6 border-t border-slate-100 dark:border-slate-800">
        <div>
          <p class="text-2xl font-black text-[var(--theme-text-primary,#0f172a)]">25.000+</p>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] font-medium">Porsi Terkirim</p>
        </div>
        <div>
          <p class="text-2xl font-black text-[var(--theme-text-primary,#0f172a)]">4.9 / 5.0</p>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] font-medium">Kepuasan Konsumen</p>
        </div>
        <div>
          <p class="text-2xl font-black text-[var(--theme-text-primary,#0f172a)]">100%</p>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] font-medium">Higienis & Halal</p>
        </div>
      </div>
    </div>

    <div data-node="image" class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800">
      <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
    </div>
  </div>
</div>
