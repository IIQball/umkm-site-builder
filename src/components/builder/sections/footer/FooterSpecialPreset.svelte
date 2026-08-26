<script lang="ts">
  import { MessageCircle, Send } from 'lucide-svelte';

  export let activePreset: string;
  export let logoText: string;
  export let tagline: string;
  export let whatsappNumber: string;
  export let copyrightText: string;
</script>

{#if activePreset === 'newsletter_footer'}
  <div class="space-y-8 py-4">
    <div class="p-6 md:p-8 rounded-3xl bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
      <div class="max-w-md">
        <h3 class="text-lg md:text-xl font-black text-base-content">Dapatkan Promo & Diskon Spesial</h3>
        <p class="text-xs text-base-content/60 mt-1">Daftar untuk menerima info promo produk terbaru langsung di email.</p>
      </div>
      <div class="flex items-center gap-2 w-full md:w-auto">
        <input
          type="email"
          placeholder="Alamat email Anda..."
          class="px-4 py-2.5 rounded-xl bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 text-xs text-base-content focus:outline-none focus:border-primary shadow-sm"
        />
        <button
          type="button"
          class="px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-md"
          style:background-color="var(--theme-primary)"
        >
          <Send size={13} />
          <span>Kirim</span>
        </button>
      </div>
    </div>

    <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-base-content/60 pt-4 border-t border-base-200 dark:border-slate-800">
      <span class="font-bold text-base-content">{logoText}</span>
      <p>{copyrightText}</p>
    </div>
  </div>

{:else if activePreset === 'cta_focused'}
  <div class="p-8 rounded-3xl bg-primary/5 border border-primary/20 text-center space-y-4 max-w-2xl mx-auto my-4">
    <h3 class="text-xl font-extrabold text-base-content">{logoText}</h3>
    <p class="text-xs text-base-content/70">{tagline}</p>
    <a
      href="https://wa.me/{whatsappNumber}"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white shadow-lg cursor-pointer"
      style:background-color="var(--theme-primary)"
    >
      <MessageCircle size={15} />
      <span>Hubungi Kami via WhatsApp</span>
    </a>
    <p class="text-[11px] text-base-content/50 pt-2">{copyrightText}</p>
  </div>

{:else}
  <!-- floating_bottom_bar / app_store_style_footer -->
  <div class="space-y-6 py-4">
    <div class="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800">
      <div>
        <h4 class="font-bold text-xs text-base-content">{logoText}</h4>
        <p class="text-[11px] text-base-content/60">{tagline}</p>
      </div>
      <div class="flex items-center gap-2">
        <a
          href="https://wa.me/{whatsappNumber}"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 cursor-pointer"
        >
          <MessageCircle size={13} />
          <span>Chat Kami</span>
        </a>
      </div>
    </div>
    <p class="text-center text-xs text-base-content/50">{copyrightText}</p>
  </div>
{/if}
