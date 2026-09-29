<script lang="ts">
  import { Mail } from 'lucide-svelte';
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'email_capture'];

  $: hasEmailCapture = elementOrder.includes('email_capture');
  $: isFormActive = activeNodeId === 'hero_email_capture' || activeNodeId === 'email_capture';
  $: hasCta = elementOrder.includes('cta');
</script>

{#snippet formBlock()}
  <!-- Inline Subscribe Form (Sub-node hero_email_capture) -->
  {#if hasEmailCapture}
    <div
      data-node="hero_email_capture"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_email_capture')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_email_capture')}
      class={`w-full max-w-md mx-auto flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-[var(--color-card-base)] border border-[var(--color-border)] shadow-md transition-all cursor-pointer ${
        isFormActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <div class="flex items-center gap-2 px-3 flex-1 w-full text-[var(--color-text-muted)]">
        <Mail size={16} />
        <input
          type="text"
          placeholder="No. WhatsApp / Email Anda"
          class="w-full bg-transparent text-xs text-[var(--color-text-main)] focus:outline-none placeholder:text-[var(--color-text-muted)]"
        />
      </div>
      {#if hasCta}
        <a
          href={ctaLink || '#'}
          style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, currentColor);"
          class="btn btn-primary btn-sm w-full sm:w-auto h-10 min-h-[40px] px-6 font-heading font-semibold text-xs shrink-0 shadow-xs"
        >
          <span>{ctaText || 'Daftar Promo'}</span>
        </a>
      {/if}
    </div>
  {/if}
{/snippet}

<div class="max-w-3xl mx-auto py-12 text-center w-full">
  <HeroHeaderContent
    {badgeText}
    {tagName}
    {title}
    {subtitle}
    {activeNodeId}
    {selectNode}
    {selectNodeKey}
    {elementOrder}
    align="center"
    customBlocks={{ email_capture: formBlock }}
  />
</div>
