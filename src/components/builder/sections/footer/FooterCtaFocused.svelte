<script lang="ts">
  import { ArrowRight, MapPin } from 'lucide-svelte';

  export let brandName: string;
  export let address: string;
  export let floatingCtaTitle: string = 'Ingin Pesan Menu Katering Hari Ini?';
  export let floatingCtaSubtitle: string = 'Dapatkan diskon ongkir untuk pemesanan minimal 10 porsi.';
  export let floatingCtaButtonText: string = 'Chat Sekarang';
  export let whatsappLink: string;
  export let copyrightText: string;
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent | KeyboardEvent, key: string) => void = () => {};
</script>

<div class="relative pt-6">
  <!-- Floating Banner di Atas Kontainer Footer -->
  <div class="relative z-10 -mb-8">
    <div
      class="p-6 rounded-2xl shadow-xl cq-footer-cta-banner cursor-pointer transition-all {activeNodeId === 'footer_floating_cta' ? 'ring-2 ring-[var(--theme-btn-primary-text,#ffffff)] ring-offset-2 ring-offset-[var(--theme-primary,#2563eb)]' : ''}"
      style="background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, #2563eb))); color: var(--theme-btn-primary-text, var(--btn-primary-text, #ffffff));"
      on:click={(e) => selectNode(e, 'footer_floating_cta')}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_floating_cta')}
      role="button"
      tabindex="0"
    >
      <div class="text-left space-y-1">
        <h3
          style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700)); color: var(--theme-btn-primary-text, var(--btn-primary-text, #ffffff));"
        >
          {floatingCtaTitle}
        </h3>
        <p
          style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px));"
          class="opacity-90"
        >
          {floatingCtaSubtitle}
        </p>
      </div>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 16px)); background-color: var(--theme-surface, var(--color-card-base, #ffffff)); color: var(--theme-primary, #2563eb); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 12px));"
        class="h-10 px-6 font-bold hover:opacity-90 shrink-0 inline-flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
        on:click|stopPropagation
      >
        <span>{floatingCtaButtonText}</span>
        <ArrowRight size={14} />
      </a>
    </div>
  </div>

  <!-- Body Footer Latar Surface -->
  <div
    class="border border-[var(--color-border,rgba(15,23,42,0.08))] rounded-3xl shadow-sm pt-14 pb-6 px-6 sm:px-8"
    style="background-color: var(--theme-surface, var(--color-card-base, #ffffff)); color: var(--theme-text-primary, var(--color-text-main, #0f172a));"
  >
    <div class="cq-footer-bottom-bar">
      <div
        class="space-y-1 p-2 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_contact' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
        on:click={(e) => selectNode(e, 'footer_contact')}
        on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_contact')}
        role="button"
        tabindex="0"
      >
        <span
          style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 14px)); font-weight: 700; color: var(--theme-text-primary, var(--color-text-main, #0f172a));"
          class="block"
        >
          {brandName}
        </span>
        <p
          style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
          class="flex items-center gap-1"
        >
          <MapPin size={12} class="text-[var(--theme-primary,#2563eb)] shrink-0" />
          <span>{address}</span>
        </p>
      </div>

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
          {copyrightText}
        </p>
      </div>
    </div>
  </div>
</div>
