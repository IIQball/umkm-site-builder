<script lang="ts">
  import { MessageCircle } from 'lucide-svelte';

  export let statusBadgeText: string = 'TOKO BUKA';
  export let statusBadgeSubtext: string = 'Siap Menerima Pesanan WhatsApp';
  export let statusChatButtonText: string = 'Chat Sekarang';
  export let whatsappLink: string;
  export let copyrightText: string;
  export let storeHours: string = '09.00 - 21.00 WIB';
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent | KeyboardEvent, key: string) => void = () => {};
</script>

<div class="cq-footer-row-compact py-2">
  <!-- Status Indicator Node -->
  <div
    class="flex items-center gap-2 p-2 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_status_badge' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    on:click={(e) => selectNode(e, 'footer_status_badge')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_status_badge')}
    role="button"
    tabindex="0"
  >
    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
    <span
      style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 12px)); font-weight: 700; color: var(--theme-text-primary, var(--color-text-main, #0f172a)); text-transform: uppercase;"
    >
      {statusBadgeText}
    </span>
    <span
      style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 13px)); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
    >
      • {statusBadgeSubtext}
    </span>
  </div>

  <!-- Info & Copyright Node -->
  <div
    class="p-2 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    on:click={(e) => selectNode(e, 'footer_copyright')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_copyright')}
    role="button"
    tabindex="0"
  >
    <p
      style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
    >
      {copyrightText} Jam: {storeHours}
    </p>
  </div>

  <!-- Chat Button Node -->
  <div
    class="p-1 rounded-xl transition-all cursor-pointer shrink-0 {activeNodeId === 'footer_contact' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    on:click={(e) => selectNode(e, 'footer_contact')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_contact')}
    role="button"
    tabindex="0"
  >
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      style="border-radius: var(--theme-btn-radius, var(--btn-radius, 16px)); background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, #2563eb))); color: var(--theme-btn-primary-text, var(--btn-primary-text, #ffffff)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 12px));"
      class="h-8 px-4 hover:opacity-90 font-semibold inline-flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all"
      on:click|stopPropagation
    >
      <MessageCircle size={13} />
      <span>{statusChatButtonText}</span>
    </a>
  </div>
</div>
