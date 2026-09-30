<script lang="ts">
  import { CheckCircle2 } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = '';
  export let badgeIcon: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let waNumber: string = '';
  export let terminalFile: string = 'store-system.sh';
  export let terminalCmd1: string = '$ check --stock ready';
  export let terminalRes1: string = 'Seluruh produk terverifikasi & siap kirim';
  export let terminalCmd2: string = '$ order --instant-whatsapp';
  export let terminalRes2: string = 'Integrasi otomatis pesan WA tanpa ribet';
  export let terminalStatus: string = '_ Siap melayani pelanggan...';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['title', 'subtitle', 'cta', 'terminal'];

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isTablet = viewMode === 'tablet';
  $: isSmallScreen = isMobile || isTablet;

  $: hasTerminal = elementOrder.includes('terminal');
  $: terminalIdx = elementOrder.indexOf('terminal');
  $: titleIdx = elementOrder.indexOf('title') !== -1 ? elementOrder.indexOf('title') : 1;
  $: isTerminalLeft = terminalIdx !== -1 ? terminalIdx < titleIdx : false;
  $: isTerminalActive = activeNodeId === 'hero_terminal' || activeNodeId === 'terminal';
</script>

{#if !hasTerminal}
  <div class="max-w-3xl mx-auto py-6">
    <HeroHeaderContent
      {badgeText}
      {badgeIcon}
      {tagName}
      {title}
      {subtitle}
      {ctaText}
      {ctaLink}
      {secondaryCtaText}
      {secondaryCtaLink}
      {waNumber}
      {activeNodeId}
      {selectNode}
      {selectNodeKey}
      {elementOrder}
      align="center"
    />
  </div>
{:else}
  <div class={`grid gap-6 sm:gap-8 items-center py-6 ${isSmallScreen ? 'grid-cols-1' : 'grid-cols-12'} text-left`}>
    <div class={`w-full ${isSmallScreen ? 'col-span-1' : 'col-span-6'} ${!isSmallScreen && isTerminalLeft ? 'order-2' : 'order-1'}`}>
      <HeroHeaderContent
        {badgeText}
        {badgeIcon}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {waNumber}
        {activeNodeId}
        {selectNode}
        {selectNodeKey}
        {elementOrder}
        align={isMobile ? 'center' : 'left'}
      />
    </div>

    <div
      data-node="hero_terminal"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_terminal')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_terminal')}
      class={`w-full ${isSmallScreen ? 'col-span-1 max-w-md mx-auto' : 'col-span-6'} rounded-2xl p-1 transition-all cursor-pointer ${
        !isSmallScreen && isTerminalLeft ? 'order-1' : 'order-2'
      } ${
        isTerminalActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <div class="rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 shadow-2xl p-4 sm:p-5 font-mono text-xs overflow-hidden">
        <div class="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <div class="w-3 h-3 rounded-full bg-amber-500"></div>
          <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span class="text-[10px] text-slate-500 ml-2">{terminalFile}</span>
        </div>
        <p class="text-slate-400">{terminalCmd1}</p>
        <p class="text-emerald-400 flex items-center gap-1.5"><CheckCircle2 size={13} class="shrink-0" /> {terminalRes1}</p>
        <p class="text-slate-400 mt-2">{terminalCmd2}</p>
        <p class="text-blue-400 flex items-center gap-1.5"><CheckCircle2 size={13} class="shrink-0" /> {terminalRes2}</p>
        <p class="text-slate-500 mt-3 animate-pulse">{terminalStatus}</p>
      </div>
    </div>
  </div>
{/if}
