<script lang="ts">
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = 'Pemesanan Langsung Tanpa Antri';
  export let tagName: string = 'h1';
  export let title: string = 'Pesan Menu Langsung Melalui WhatsApp';
  export let subtitle: string = 'Cukup klik tombol di bawah, admin kami akan langsung mengonfirmasi rincian pesanan Anda.';
  export let ctaText: string = 'Mulai Chat WhatsApp Sekarang';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: isChatActive = activeNodeId === 'hero_chat_simulation' || activeNodeId === 'chat_simulation';
</script>

<div class="py-12 text-center max-w-2xl mx-auto space-y-6">
  <HeroHeaderContent
    {badgeText}
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
    align="center"
  />

  <!-- WhatsApp Chat Bubble Simulation (Sub-node hero_chat_simulation) -->
  <div
    data-node="hero_chat_simulation"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode && selectNode(e, 'hero_chat_simulation')}
    on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_chat_simulation')}
    class={`bg-[var(--color-card-base,#ffffff)] border border-[var(--color-border,rgba(15,23,42,0.08))] p-4 rounded-2xl max-w-md mx-auto my-6 text-left space-y-3 shadow-sm transition-all cursor-pointer ${
      isChatActive
        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
        : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
    }`}
  >
    <div class="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl rounded-tl-xs shadow-xs border border-slate-200 dark:border-slate-700 text-xs text-[var(--color-text-main,#0f172a)] max-w-[85%] font-sans">
      Halo Kak! Mau pesan Paket Favorit untuk makan siang ya?
      <span class="block text-[9px] text-slate-400 text-right mt-1">11.15</span>
    </div>
    <div class="bg-emerald-600 text-white p-3 rounded-xl rounded-tr-xs shadow-xs text-xs ml-auto max-w-[85%] font-sans">
      Siap Kak! Pesanan sudah kami jadwalkan, kurir langsung meluncur jam 11.45 ya ✨
      <span class="block text-[9px] text-emerald-200 text-right mt-1">11.16</span>
    </div>
  </div>
</div>
