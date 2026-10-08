<script lang="ts">
  import { MessageCircle, Instagram, Facebook, Share2, ShoppingBag, Youtube, Globe } from 'lucide-svelte';
  import type { FooterSocialLink } from '@/types';
  import { resolveFooterNodeStyle } from './footerStyles.helpers';
  import { DEFAULT_SOCIAL_LINKS } from './footer.helpers';

  export let communityTitle: string = 'Terhubung dengan Kami di Sosial Media';
  export let communitySubtitle: string = 'Ikuti info pembaruan menu harian, voucer promo, dan giveaway menarik.';
  export let socialLinks: FooterSocialLink[] = [];
  export let whatsappLink: string = '';
  export let copyrightText: string = '';
  export let attributionText: string = 'Powered by Pinoka';
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent | KeyboardEvent, key: string) => void = () => {};
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let elementOrder: string[] = ['footer_socials', 'footer_copyright'];

  $: styleSocials = resolveFooterNodeStyle('footer_socials', nodeStyles);
  $: styleCopyright = resolveFooterNodeStyle('footer_copyright', nodeStyles);

  $: hasSocials = !elementOrder.length || elementOrder.includes('footer_socials');
  $: hasCopyright = !elementOrder.length || elementOrder.includes('footer_copyright') || elementOrder.includes('copyright');

  $: effectiveSocialLinks = Array.isArray(socialLinks) && socialLinks.length > 0
    ? socialLinks
    : DEFAULT_SOCIAL_LINKS;

  function getPlatformInfo(platform: string) {
    switch ((platform || '').toLowerCase()) {
      case 'whatsapp':
        return { icon: MessageCircle, bg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400', defaultLabel: 'WhatsApp' };
      case 'instagram':
        return { icon: Instagram, bg: 'bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400', defaultLabel: 'Instagram' };
      case 'facebook':
        return { icon: Facebook, bg: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400', defaultLabel: 'Facebook' };
      case 'shopee':
        return { icon: ShoppingBag, bg: 'bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400', defaultLabel: 'Shopee Official' };
      case 'tokopedia':
        return { icon: ShoppingBag, bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', defaultLabel: 'Tokopedia' };
      case 'youtube':
        return { icon: Youtube, bg: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400', defaultLabel: 'YouTube' };
      case 'tiktok':
        return { icon: Share2, bg: 'bg-base-200 text-base-content', defaultLabel: 'TikTok' };
      default:
        return { icon: Globe, bg: 'bg-primary/10 text-primary', defaultLabel: 'Media Sosial' };
    }
  }
</script>

<div class="max-w-2xl mx-auto space-y-6 text-center py-2">
  {#if hasSocials}
    <!-- Social Media Nodes Showcase -->
    <div
      class="space-y-6 p-3 rounded-2xl transition-all cursor-pointer {activeNodeId === 'footer_socials' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
      style="margin-top: {styleSocials.marginTop}; margin-bottom: {styleSocials.marginBottom};"
      on:click={(e) => selectNode(e, 'footer_socials')}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_socials')}
      role="button"
      tabindex="0"
    >
      <div>
        <h3
          style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700)); color: {styleSocials.color || 'var(--theme-text-primary, var(--color-text-main))'};"
          class="mb-1"
        >
          {communityTitle}
        </h3>
        <p
          style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: var(--theme-text-muted, var(--color-text-muted));"
        >
          {communitySubtitle}
        </p>
      </div>

      <div class="cq-social-grid text-left">
        {#each effectiveSocialLinks as item}
          {@const info = getPlatformInfo(item.platform)}
          <a
            href={item.platform === 'whatsapp' ? (item.url || whatsappLink) : item.url}
            target="_blank"
            rel="noreferrer"
            style="background-color: var(--theme-surface, var(--color-card-base)); border-color: var(--color-border);"
            class="p-3.5 rounded-2xl border hover:border-[var(--theme-primary, var(--color-primary))]/40 flex items-center gap-3 transition-colors group shadow-xs"
            on:click|stopPropagation
          >
            <div class="w-9 h-9 rounded-xl {info.bg} flex items-center justify-center shrink-0">
              <svelte:component this={info.icon} size={18} />
            </div>
            <div class="min-w-0">
              <h5
                style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px)); font-weight: 700; color: var(--theme-text-primary, var(--color-text-main));"
                class="truncate"
              >
                {item.label || info.defaultLabel}
              </h5>
              <span
                style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.8); color: var(--theme-text-muted, var(--color-text-muted));"
                class="truncate block"
              >
                {item.subtext || item.handle || '@toko.official'}
              </span>
            </div>
          </a>
        {/each}
      </div>
    </div>
  {/if}

  {#if hasCopyright}
    <!-- Copyright & Attribution -->
    <div
      class="pt-6 border-t border-[var(--color-border)] p-2 rounded-xl transition-all cursor-pointer space-y-1 {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
      style="margin-top: {styleCopyright.marginTop}; margin-bottom: {styleCopyright.marginBottom}; font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85); color: {styleCopyright.color || 'var(--theme-text-muted, var(--color-text-muted))'};"
      on:click={(e) => selectNode(e, 'footer_copyright')}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_copyright')}
      role="button"
      tabindex="0"
    >
      <p>{copyrightText}</p>
      <p style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.75);">{attributionText}</p>
    </div>
  {/if}
</div>
