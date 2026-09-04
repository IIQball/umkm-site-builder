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

  $: isFormActive = activeNodeId === 'hero_email_capture' || activeNodeId === 'email_capture';
</script>

<div class="max-w-3xl mx-auto py-12 flex flex-col items-center text-center gap-6">
  <HeroHeaderContent
    {badgeText}
    {tagName}
    {title}
    {subtitle}
    {activeNodeId}
    {selectNode}
    {selectNodeKey}
    align="center"
  />

  <!-- Inline Subscribe Form (Sub-node hero_email_capture) -->
  <div
    data-node="hero_email_capture"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode && selectNode(e, 'hero_email_capture')}
    on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_email_capture')}
    class={`w-full max-w-md flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-[var(--color-card-base,#ffffff)] border border-[var(--color-border,rgba(15,23,42,0.08))] shadow-md transition-all cursor-pointer ${
      isFormActive
        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
        : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
    }`}
  >
    <div class="flex items-center gap-2 px-3 flex-1 w-full text-slate-400">
      <Mail size={16} />
      <input
        type="text"
        placeholder="No. WhatsApp / Email Anda"
        class="w-full bg-transparent text-xs text-[var(--color-text-main,#0f172a)] focus:outline-none placeholder:text-slate-400"
      />
    </div>
    <a
      href={ctaLink || '#'}
      class="w-full sm:w-auto h-10 min-h-[40px] px-6 rounded-2xl bg-[var(--color-primary,#2563eb)] text-white font-heading font-semibold text-xs inline-flex items-center justify-center hover:bg-primary-dark active:scale-[0.98] transition-all shrink-0 shadow-xs"
    >
      <span>{ctaText || 'Daftar Promo'}</span>
    </a>
  </div>
</div>
