<script lang="ts">
  import { Send, Sparkles } from 'lucide-svelte';

  export let newsletterBadge: string = 'Voucher Diskon 15%';
  export let newsletterTitle: string = 'Dapatkan Info Promo Langsung di HP';
  export let newsletterSubtitle: string = 'Ketik nomor WhatsApp Anda untuk menerima pemberitahuan diskon dan peluncuran produk baru.';
  export let newsletterButtonText: string = 'Daftar Promo';
  export let newsletterPlaceholder: string = 'Masukkan nomor WhatsApp...';
  export let copyrightText: string;
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent | KeyboardEvent, key: string) => void = () => {};

  let inputNumber = '';
  let submitted = false;

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (!inputNumber) return;
    submitted = true;
    setTimeout(() => {
      submitted = false;
      inputNumber = '';
    }, 3000);
  }
</script>

<div class="max-w-xl mx-auto space-y-5 text-center py-4">
  <!-- Newsletter & Promo Capture Node -->
  <div
    class="space-y-3.5 p-3 rounded-2xl transition-all cursor-pointer {activeNodeId === 'footer_newsletter' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    on:click={(e) => selectNode(e, 'footer_newsletter')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_newsletter')}
    role="button"
    tabindex="0"
  >
    {#if newsletterBadge}
      <span
        style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 11px)); font-weight: 700;"
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--theme-primary,#2563eb)]/10 text-[var(--theme-primary,#2563eb)]"
      >
        <Sparkles size={12} />
        <span>{newsletterBadge}</span>
      </span>
    {/if}

    <h3
      style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700)); color: var(--theme-text-primary, var(--color-text-main, #0f172a));"
    >
      {newsletterTitle}
    </h3>

    <p
      style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
      class="max-w-md mx-auto"
    >
      {newsletterSubtitle}
    </p>

    <form on:submit|preventDefault={handleSubmit} class="flex flex-col sm:flex-row gap-2 pt-2 max-w-md mx-auto">
      <input
        type="text"
        bind:value={inputNumber}
        placeholder={newsletterPlaceholder}
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 16px)); background-color: var(--theme-surface, var(--color-card-base, #ffffff)); color: var(--theme-text-primary, var(--color-text-main, #0f172a)); font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px));"
        class="flex-1 h-10 px-4 border border-[var(--color-border,rgba(15,23,42,0.08))] outline-none focus:border-[var(--theme-primary,#2563eb)] focus:ring-1 focus:ring-[var(--theme-primary,#2563eb)] transition-all"
        required
      />
      <button
        type="submit"
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 16px)); background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, #2563eb))); color: var(--theme-btn-primary-text, var(--btn-primary-text, #ffffff)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 12px));"
        class="h-10 px-6 hover:opacity-90 font-bold shrink-0 inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-xs"
      >
        <Send size={13} />
        <span>{submitted ? 'Tersimpan!' : newsletterButtonText}</span>
      </button>
    </form>
  </div>

  <!-- Copyright Row -->
  <div
    class="pt-6 border-t border-[var(--color-border,rgba(15,23,42,0.08))] p-2 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
    on:click={(e) => selectNode(e, 'footer_copyright')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_copyright')}
    role="button"
    tabindex="0"
  >
    {copyrightText}
  </div>
</div>
