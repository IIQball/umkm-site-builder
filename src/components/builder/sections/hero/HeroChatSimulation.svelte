<script lang="ts">
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = 'Pemesanan Langsung Tanpa Antri';
  export let badgeIcon: string = '';
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
  export let chatMessages: Array<{ sender: 'in' | 'out'; text: string; time?: string }> = [];

  $: hasChat = elementOrder.includes('chat_simulation');
  $: isChatActive = activeNodeId === 'hero_chat_simulation' || activeNodeId === 'chat_simulation';

  $: messages = Array.isArray(chatMessages) && chatMessages.length > 0
    ? chatMessages
    : [
        { sender: 'in' as const, text: 'Halo Kak! Mau pesan Paket Favorit untuk makan siang ya?', time: '11.15' },
        { sender: 'out' as const, text: 'Siap Kak! Pesanan sudah kami jadwalkan, kurir langsung meluncur jam 11.45 ya', time: '11.16' },
      ];
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
      class={`card bg-[var(--color-card-base)] border border-[var(--color-border)] p-4 rounded-2xl max-w-md mx-auto my-4 text-left space-y-2 shadow-sm transition-all cursor-pointer ${
        isChatActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      {#each messages as msg, i (i)}
        <div class={`chat ${msg.sender === 'in' ? 'chat-start' : 'chat-end'}`}>
          <div
            style={msg.sender === 'in'
              ? 'background-color: var(--color-nested-base); border: 1px solid var(--color-border); color: var(--color-text-main);'
              : 'background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, currentColor);'}
            class="chat-bubble shadow-xs text-xs font-sans max-w-[85%]"
          >
            {msg.text}
            {#if msg.time}
              <span class={`block text-[9px] mt-1 text-right ${msg.sender === 'in' ? 'text-[var(--color-text-muted)]' : 'opacity-80'}`}>
                {msg.time}
              </span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
{/snippet}

<div class="py-12 text-center max-w-2xl mx-auto w-full">
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
    customBlocks={{ chat_simulation: chatBlock }}
  />
</div>
