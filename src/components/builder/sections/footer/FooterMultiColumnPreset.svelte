<script lang="ts">
  import { MessageCircle, MapPin } from 'lucide-svelte';

  export let activePreset: string;
  export let logoText: string;
  export let tagline: string;
  export let address: string;
  export let whatsappNumber: string;
  export let copyrightText: string;
</script>

{#if activePreset === 'minimal_stacked'}
  <div class="flex flex-col items-center text-center gap-6 py-6 max-w-2xl mx-auto">
    <div>
      <h3 class="text-xl font-black tracking-wider text-base-content">{logoText}</h3>
      <p class="text-xs text-base-content/60 mt-1">{tagline}</p>
    </div>
    <nav class="flex flex-wrap items-center justify-center gap-6 text-xs text-base-content/70">
      <span class="hover:text-primary cursor-pointer transition-colors">Beranda</span>
      <span class="hover:text-primary cursor-pointer transition-colors">Katalog Produk</span>
      <span class="hover:text-primary cursor-pointer transition-colors">Tentang Toko</span>
      <span class="hover:text-primary cursor-pointer transition-colors">Bantuan</span>
    </nav>
    <div class="pt-4 border-t border-base-200 dark:border-slate-800 w-full text-center text-xs text-base-content/50">
      <p>{copyrightText}</p>
    </div>
  </div>

{:else if activePreset === 'two_column_clean'}
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 items-center">
    <div>
      <h3 class="text-lg font-black text-base-content">{logoText}</h3>
      <p class="text-xs text-base-content/60 mt-1">{tagline}</p>
    </div>
    <div class="flex flex-col md:items-end gap-2 text-xs text-base-content/70">
      <div class="flex items-center gap-2">
        <MessageCircle size={14} class="text-primary" />
        <span>WhatsApp: +{whatsappNumber}</span>
      </div>
      <p class="text-base-content/50 text-[11px] mt-1">{copyrightText}</p>
    </div>
  </div>

{:else if activePreset === 'centered_simple'}
  <div class="text-center py-6 space-y-4 max-w-lg mx-auto">
    <h3 class="text-xl font-black text-base-content">{logoText}</h3>
    <p class="text-xs text-base-content/60">{tagline}</p>
    <div class="pt-2 text-xs text-base-content/50 border-t border-base-200 dark:border-slate-800">
      <p>{copyrightText}</p>
    </div>
  </div>

{:else}
  <!-- multi_column & default -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-8 py-6">
    <div class="md:col-span-5 space-y-3">
      <h3 class="text-lg font-black text-base-content">{logoText}</h3>
      <p class="text-xs text-base-content/60 leading-relaxed max-w-sm">{tagline}</p>
      <div class="flex items-start gap-2 text-xs text-base-content/70 pt-2">
        <MapPin size={15} class="text-primary flex-shrink-0 mt-0.5" />
        <span>{address}</span>
      </div>
    </div>
    <div class="md:col-span-3 space-y-2 text-xs">
      <span class="font-bold text-base-content">Tautan Cepat</span>
      <ul class="space-y-1.5 text-base-content/70">
        <li><span class="hover:text-primary cursor-pointer transition-colors">Beranda</span></li>
        <li><span class="hover:text-primary cursor-pointer transition-colors">Katalog Produk</span></li>
        <li><span class="hover:text-primary cursor-pointer transition-colors">Tentang Kami</span></li>
      </ul>
    </div>
    <div class="md:col-span-4 space-y-3 text-xs">
      <span class="font-bold text-base-content">Kontak Toko</span>
      <a
        href="https://wa.me/{whatsappNumber}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer shadow-sm"
      >
        <MessageCircle size={14} />
        <span>Chat WhatsApp</span>
      </a>
      <p class="text-[11px] text-base-content/50 pt-2 border-t border-base-200 dark:border-slate-800">{copyrightText}</p>
    </div>
  </div>
{/if}
