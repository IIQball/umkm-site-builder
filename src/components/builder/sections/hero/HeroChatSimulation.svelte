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
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta', 'chat_simulation'];

  $: hasChat = elementOrder.includes('chat_simulation');
  $: isChatActive = activeNodeId === 'hero_chat_simulation' || activeNodeId === 'chat_simulation';
</script>

{#snippet chatBlock()}
  <!-- WhatsApp Chat Bubble Simulation (Sub-node hero_chat_simulation) -->
  {#if hasChat}
    <div
      data-node="hero_chat_simulation"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_chat_simulation')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_chat_simulation')}
      class={`card bg-[var(--color-card-base)] border border-[var(--color-border)] p-4 rounded-2xl max-w-md mx-auto my-4 text-left space-y-1 shadow-sm transition-all cursor-pointer ${
        isChatActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <div class="chat chat-start">
        <div
          style="background-color: var(--color-nested-base); border: 1px solid var(--color-border); color: var(--color-text-main);"
          class="chat-bubble shadow-xs text-xs font-sans max-w-[85%]"
        >
          Halo Kak! Mau pesan Paket Favorit untuk makan siang ya?
          <span class="block text-[9px] text-[var(--color-text-muted)] text-right mt-1">11.15</span>
        </div>
      </div>
      <div class="chat chat-end">
        <div
          style="background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, currentColor);"
          class="chat-bubble shadow-xs text-xs font-sans max-w-[85%]"
        >
          Siap Kak! Pesanan sudah kami jadwalkan, kurir langsung meluncur jam 11.45 ya
          <span class="block text-[9px] opacity-80 text-right mt-1">11.16</span>
        </div>
      </div>
    </div>
  {/if}
{/snippet}

<div class="py-12 text-center max-w-2xl mx-auto w-full">
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
    {elementOrder}
    align="center"
    customBlocks={{ chat_simulation: chatBlock }}
  />
</div>
