<script lang="ts">
  import { CheckCircle2 } from 'lucide-svelte';
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
</script>

<div class="py-12 flex flex-col items-center text-center gap-6">
  <HeroHeaderContent
    {badgeText}
    {tagName}
    {title}
    {subtitle}
    {ctaText}
    {ctaLink}
    {activeNodeId}
    {selectNode}
    {selectNodeKey}
    align="center"
  />

  <div class="w-full max-w-md p-6 rounded-2xl bg-[var(--color-card-base,#ffffff)]/80 backdrop-blur-md border border-[var(--color-border,rgba(15,23,42,0.08))] shadow-xl flex flex-col items-center gap-4">
    <div class="flex items-center gap-4 text-xs font-medium text-[var(--color-text-secondary,#334155)]">
      <span class="flex items-center gap-1"><CheckCircle2 size={14} class="text-emerald-500" /> Kualitas Asli</span>
      <span class="flex items-center gap-1"><CheckCircle2 size={14} class="text-emerald-500" /> Siap Kirim</span>
      <span class="flex items-center gap-1"><CheckCircle2 size={14} class="text-emerald-500" /> Garansi Aman</span>
    </div>
  </div>
</div>
