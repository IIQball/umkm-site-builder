<script lang="ts">
  import { MapPin, Phone } from 'lucide-svelte';

  export let brandName: string;
  export let tagline: string;
  export let address: string;
  export let whatsappNumber: string;
  export let whatsappLink: string;
  export let mapEmbedUrl: string;
  export let copyrightText: string;
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent | KeyboardEvent, key: string) => void = () => {};
</script>

<div class="space-y-6 text-left">
  <div class="cq-split-map">
    <!-- Kolom Kiri: Informasi Kontak Toko -->
    <div
      class="space-y-3 p-3 rounded-2xl transition-all cursor-pointer {activeNodeId === 'footer_contact' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
      on:click={(e) => selectNode(e, 'footer_contact')}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_contact')}
      role="button"
      tabindex="0"
    >
      <h3
        style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700)); color: var(--theme-text-primary, var(--color-text-main, #0f172a));"
      >
        {brandName}
      </h3>
      <p
        style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: var(--theme-text-muted, var(--color-text-secondary, #334155));"
        class="leading-relaxed max-w-sm"
      >
        {tagline}
      </p>
      <div
        style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
        class="space-y-1.5 pt-1"
      >
        <p class="flex items-center gap-1.5">
          <MapPin size={13} class="text-[var(--theme-primary,#2563eb)] shrink-0" />
          <span>{address}</span>
        </p>
        <p class="flex items-center gap-1.5">
          <Phone size={13} class="text-emerald-500 shrink-0" />
          <span>WhatsApp: </span>
          <a href={whatsappLink} target="_blank" rel="noreferrer" class="font-semibold text-[var(--theme-primary,#2563eb)] hover:underline" on:click|stopPropagation>
            {whatsappNumber}
          </a>
        </p>
      </div>
    </div>

    <!-- Kolom Kanan: Peta Mini -->
    <div
      class="p-2 rounded-2xl transition-all cursor-pointer {activeNodeId === 'footer_mini_map' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
      on:click={(e) => selectNode(e, 'footer_mini_map')}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_mini_map')}
      role="button"
      tabindex="0"
    >
      <div class="w-full h-36 rounded-2xl overflow-hidden border border-[var(--color-border,rgba(15,23,42,0.08))] shadow-xs bg-[var(--theme-surface,var(--color-card-base,#ffffff))]">
        <iframe
          title="Peta Mini Footer"
          src={mapEmbedUrl}
          class="w-full h-full border-0 pointer-events-none"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  </div>

  <!-- Bottom Copyright -->
  <div
    class="border-t border-[var(--color-border,rgba(15,23,42,0.08))] pt-4 p-2 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
    on:click={(e) => selectNode(e, 'footer_copyright')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_copyright')}
    role="button"
    tabindex="0"
  >
    {copyrightText}
  </div>
</div>
