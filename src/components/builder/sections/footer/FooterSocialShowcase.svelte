<script lang="ts">
  import { Instagram, Facebook, Globe } from 'lucide-svelte';

  export let logoText: string = '';
  export let tagline: string = '';
  export let copyrightText: string = '';
</script>

<div class="w-full flex flex-col items-center gap-6 text-center">
  <span class="font-black text-xl text-[var(--theme-text-primary,#0f172a)]">{logoText}</span>
  <p class="text-xs text-[var(--theme-text-muted,#64748b)] max-w-md">{tagline}</p>
  <div class="flex items-center gap-3">
    <a href="#instagram" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-pink-600 flex items-center justify-center hover:scale-110 transition-transform">
      <Instagram size={18} />
    </a>
    <a href="#facebook" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-blue-600 flex items-center justify-center hover:scale-110 transition-transform">
      <Facebook size={18} />
    </a>
    <a href="#website" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-600 flex items-center justify-center hover:scale-110 transition-transform">
      <Globe size={18} />
    </a>
  </div>
  <p class="text-xs text-[var(--theme-text-muted,#64748b)] pt-4 border-t border-base-200 dark:border-slate-800 w-full">
    {copyrightText}
  </p>
</div>
