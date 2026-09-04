<script lang="ts">
  import { Send } from 'lucide-svelte';

  export let logoText: string = '';
  export let tagline: string = '';
  export let copyrightText: string = '';
</script>

<div class="w-full flex flex-col gap-8 text-center sm:text-left">
  <div class="p-8 rounded-3xl bg-[var(--color-card-base,var(--theme-surface,#ffffff))] text-[var(--color-text-main,var(--theme-text-primary,#0f172a))] border border-[var(--color-border,rgba(15,23,42,0.08))] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
    <div class="flex flex-col gap-1 max-w-md">
      <h3
        class="font-[var(--theme-font-heading,var(--font-heading,inherit))] text-[var(--color-text-main,var(--theme-text-primary,#0f172a))]"
        style="font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700));"
      >
        Dapatkan Diskon & Info Promo Terbaru
      </h3>
      <p
        class="text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] font-[var(--theme-font-body,var(--font-family,inherit))]"
        style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
      >
        Kirimkan no. WhatsApp Anda untuk menerima katalog mingguan.
      </p>
    </div>
    <div class="w-full sm:w-auto flex items-center gap-2">
      <input
        type="text"
        placeholder="Nomor WhatsApp..."
        class="px-4 py-2.5 rounded-[var(--btn-radius,var(--theme-btn-radius,12px))] bg-[var(--color-nested-base,#f8fafc)] text-[var(--color-text-main,var(--theme-text-primary,#0f172a))] placeholder:text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] border border-[var(--color-border,rgba(15,23,42,0.08))] focus:outline-none focus:border-[var(--theme-primary,#2563eb)] w-full sm:w-60 font-[var(--theme-font-body,var(--font-family,inherit))]"
        style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
      />
      <button
        type="button"
        class="px-4 py-2.5 rounded-[var(--btn-radius,var(--theme-btn-radius,12px))] bg-[var(--btn-primary-bg,var(--theme-btn-primary-bg,var(--theme-primary,#2563eb)))] text-[var(--btn-primary-text,var(--theme-btn-primary-text,#ffffff))] font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold shadow-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
      >
        <Send size={14} />
        <span>Langganan</span>
      </button>
    </div>
  </div>

  <div
    class="flex flex-col sm:flex-row items-center justify-between gap-4 text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] font-[var(--theme-font-body,var(--font-family,inherit))]"
    style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85);"
  >
    <div>
      <span
        class="font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold text-[var(--color-text-main,var(--theme-text-primary,#0f172a))] mr-2"
        style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
      >
        {logoText}
      </span>
      <span>{tagline}</span>
    </div>
    <p>{copyrightText}</p>
  </div>
</div>
