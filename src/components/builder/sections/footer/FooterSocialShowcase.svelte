<script lang="ts">
  import { Instagram, Facebook, Globe } from 'lucide-svelte';

  export let logoText: string = '';
  export let tagline: string = '';
  export let copyrightText: string = '';
</script>

<div class="w-full flex flex-col items-center gap-6 text-center">
  <span
    class="font-[var(--theme-font-heading,var(--font-heading,inherit))] text-[var(--color-text-main,var(--theme-text-primary,#0f172a))]"
    style="font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700));"
  >
    {logoText}
  </span>
  <p
    class="text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] max-w-md font-[var(--theme-font-body,var(--font-family,inherit))] leading-relaxed"
    style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
  >
    {tagline}
  </p>
  <div class="flex items-center gap-3">
    <a href="#instagram" class="w-10 h-10 rounded-full bg-[var(--color-nested-base,#f1f5f9)] text-pink-600 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
      <Instagram size={18} />
    </a>
    <a href="#facebook" class="w-10 h-10 rounded-full bg-[var(--color-nested-base,#f1f5f9)] text-blue-600 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
      <Facebook size={18} />
    </a>
    <a href="#website" class="w-10 h-10 rounded-full bg-[var(--color-nested-base,#f1f5f9)] text-emerald-600 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
      <Globe size={18} />
    </a>
  </div>
  <p
    class="text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] pt-4 border-t border-[var(--color-border,rgba(15,23,42,0.08))] w-full font-[var(--theme-font-body,var(--font-family,inherit))]"
    style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85);"
  >
    {copyrightText}
  </p>
</div>
