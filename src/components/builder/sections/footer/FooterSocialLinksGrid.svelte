<script lang="ts">
  import { MessageCircle, Instagram, Facebook, Share2 } from 'lucide-svelte';
  import type { FooterSocialLink } from '@/types';

  export let communityTitle: string = 'Terhubung dengan Kami di Sosial Media';
  export let communitySubtitle: string = 'Ikuti info pembaruan menu harian, voucer promo, dan giveaway menarik.';
  export let socialLinks: FooterSocialLink[] = [];
  export let whatsappLink: string;
  export let copyrightText: string;
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent | KeyboardEvent, key: string) => void = () => {};

  $: waItem = socialLinks.find((s) => s.platform === 'whatsapp') || {
    platform: 'whatsapp',
    url: whatsappLink,
    label: 'WhatsApp',
    subtext: 'Fast Response',
  };

  $: igItem = socialLinks.find((s) => s.platform === 'instagram') || {
    platform: 'instagram',
    url: 'https://instagram.com',
    label: 'Instagram',
    subtext: '@toko.official',
  };

  $: ttItem = socialLinks.find((s) => s.platform === 'tiktok') || {
    platform: 'tiktok',
    url: 'https://tiktok.com',
    label: 'TikTok',
    subtext: 'Video Menu',
  };

  $: fbItem = socialLinks.find((s) => s.platform === 'facebook') || {
    platform: 'facebook',
    url: 'https://facebook.com',
    label: 'Facebook',
    subtext: 'Halaman Toko',
  };
</script>

<div class="max-w-2xl mx-auto space-y-6 text-center py-2">
  <!-- Social Media Nodes Showcase -->
  <div
    class="space-y-6 p-3 rounded-2xl transition-all cursor-pointer {activeNodeId === 'footer_socials' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    on:click={(e) => selectNode(e, 'footer_socials')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_socials')}
    role="button"
    tabindex="0"
  >
    <div>
      <h3
        style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700)); color: var(--theme-text-primary, var(--color-text-main, #0f172a));"
        class="mb-1"
      >
        {communityTitle}
      </h3>
      <p
        style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
      >
        {communitySubtitle}
      </p>
    </div>

    <div class="cq-social-grid text-left">
      <!-- WhatsApp Tile -->
      <a
        href={waItem.url || whatsappLink}
        target="_blank"
        rel="noreferrer"
        style="background-color: var(--theme-surface, var(--color-card-base, #ffffff)); border-color: var(--color-border, rgba(15,23,42,0.08));"
        class="p-3.5 rounded-2xl border hover:border-[var(--theme-primary,#2563eb)]/40 flex items-center gap-3 transition-colors group shadow-xs"
        on:click|stopPropagation
      >
        <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <MessageCircle size={18} />
        </div>
        <div class="min-w-0">
          <h5
            style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px)); font-weight: 700; color: var(--theme-text-primary, var(--color-text-main, #0f172a));"
            class="truncate"
          >
            WhatsApp
          </h5>
          <span
            style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.8); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
            class="truncate block"
          >
            {waItem.subtext || 'Fast Response'}
          </span>
        </div>
      </a>

      <!-- Instagram Tile -->
      <a
        href={igItem.url}
        target="_blank"
        rel="noreferrer"
        style="background-color: var(--theme-surface, var(--color-card-base, #ffffff)); border-color: var(--color-border, rgba(15,23,42,0.08));"
        class="p-3.5 rounded-2xl border hover:border-[var(--theme-primary,#2563eb)]/40 flex items-center gap-3 transition-colors group shadow-xs"
        on:click|stopPropagation
      >
        <div class="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400 flex items-center justify-center shrink-0">
          <Instagram size={18} />
        </div>
        <div class="min-w-0">
          <h5
            style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px)); font-weight: 700; color: var(--theme-text-primary, var(--color-text-main, #0f172a));"
            class="truncate"
          >
            Instagram
          </h5>
          <span
            style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.8); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
            class="truncate block"
          >
            {igItem.subtext || '@toko.official'}
          </span>
        </div>
      </a>

      <!-- TikTok Tile -->
      <a
        href={ttItem.url}
        target="_blank"
        rel="noreferrer"
        style="background-color: var(--theme-surface, var(--color-card-base, #ffffff)); border-color: var(--color-border, rgba(15,23,42,0.08));"
        class="p-3.5 rounded-2xl border hover:border-[var(--theme-primary,#2563eb)]/40 flex items-center gap-3 transition-colors group shadow-xs"
        on:click|stopPropagation
      >
        <div class="w-9 h-9 rounded-xl bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0">
          <Share2 size={18} />
        </div>
        <div class="min-w-0">
          <h5
            style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px)); font-weight: 700; color: var(--theme-text-primary, var(--color-text-main, #0f172a));"
            class="truncate"
          >
            TikTok
          </h5>
          <span
            style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.8); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
            class="truncate block"
          >
            {ttItem.subtext || 'Video Menu'}
          </span>
        </div>
      </a>

      <!-- Facebook Tile -->
      <a
        href={fbItem.url}
        target="_blank"
        rel="noreferrer"
        style="background-color: var(--theme-surface, var(--color-card-base, #ffffff)); border-color: var(--color-border, rgba(15,23,42,0.08));"
        class="p-3.5 rounded-2xl border hover:border-[var(--theme-primary,#2563eb)]/40 flex items-center gap-3 transition-colors group shadow-xs"
        on:click|stopPropagation
      >
        <div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Facebook size={18} />
        </div>
        <div class="min-w-0">
          <h5
            style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px)); font-weight: 700; color: var(--theme-text-primary, var(--color-text-main, #0f172a));"
            class="truncate"
          >
            Facebook
          </h5>
          <span
            style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.8); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
            class="truncate block"
          >
            {fbItem.subtext || 'Halaman Toko'}
          </span>
        </div>
      </a>
    </div>
  </div>

  <!-- Copyright -->
  <div
    class="pt-6 border-t border-[var(--color-border,rgba(15,23,42,0.08))] p-2 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
    on:click={(e) => selectNode(e, 'footer_copyright')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_copyright')}
    role="button"
    tabindex="0"
  >
    {copyrightText}
  </div>
</div>
