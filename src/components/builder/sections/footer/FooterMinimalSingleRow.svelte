<script lang="ts">
  import type { FooterSocialLink } from '@/types';

  export let brandName: string;
  export let logoImageUrl: string = '';
  export let copyrightText: string;
  export let socialLinks: FooterSocialLink[] = [];
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent | KeyboardEvent, key: string) => void = () => {};
</script>

<div
  class="cq-footer-row-compact py-3"
  style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
>
  <!-- Brand Kiri -->
  <div
    class="flex items-center gap-2 p-1.5 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_brand' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    on:click={(e) => selectNode(e, 'footer_brand')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_brand')}
    role="button"
    tabindex="0"
  >
    {#if logoImageUrl}
      <img src={logoImageUrl} alt={brandName} class="w-6 h-6 rounded-[var(--theme-btn-radius,var(--btn-radius,8px))] object-contain bg-[var(--theme-surface,var(--color-card-base,#ffffff))] border border-[var(--color-border,rgba(15,23,42,0.08))]" />
    {:else}
      <div class="w-6 h-6 rounded-[var(--theme-btn-radius,var(--btn-radius,8px))] bg-[var(--theme-primary,#2563eb)] text-[var(--theme-btn-primary-text,#ffffff)] flex items-center justify-center font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold text-[10px] shadow-xs">
        {brandName.charAt(0) || 'H'}
      </div>
    {/if}
    <span
      style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px)); font-weight: 700; color: var(--theme-text-primary, var(--color-text-main, #0f172a));"
    >
      {brandName}
    </span>
  </div>

  <!-- Copyright Tengah -->
  <div
    class="p-1.5 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    on:click={(e) => selectNode(e, 'footer_copyright')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_copyright')}
    role="button"
    tabindex="0"
  >
    <p>
      {copyrightText}
    </p>
  </div>

  <!-- Sosmed Kanan -->
  <div
    class="flex items-center gap-3 font-semibold p-1.5 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_contact' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    style="color: var(--theme-text-primary, var(--color-text-main, #0f172a));"
    on:click={(e) => selectNode(e, 'footer_contact')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_contact')}
    role="button"
    tabindex="0"
  >
    {#if socialLinks && socialLinks.length > 0}
      {#each socialLinks.slice(0, 3) as s, idx}
        {#if idx > 0}
          <span class="text-[var(--color-border,rgba(15,23,42,0.2))]">•</span>
        {/if}
        <a href={s.url} target="_blank" rel="noreferrer" class="hover:text-[var(--theme-primary,#2563eb)] transition-colors" on:click|stopPropagation>
          {s.label || s.platform}
        </a>
      {/each}
    {:else}
      <a href="#instagram" class="hover:text-[var(--theme-primary,#2563eb)] transition-colors" on:click|stopPropagation>Instagram</a>
      <span class="text-[var(--color-border,rgba(15,23,42,0.2))]">•</span>
      <a href="#whatsapp" class="hover:text-[var(--theme-primary,#2563eb)] transition-colors" on:click|stopPropagation>WhatsApp</a>
    {/if}
  </div>
</div>
