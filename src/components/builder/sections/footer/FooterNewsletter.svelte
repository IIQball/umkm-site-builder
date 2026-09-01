<script lang="ts">
  import { Send } from 'lucide-svelte';

  export let logoText: string = '';
  export let tagline: string = '';
  export let copyrightText: string = '';
</script>

<div class="w-full flex flex-col gap-8 text-center sm:text-left">
  <div class="p-8 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
    <div class="flex flex-col gap-1 max-w-md">
      <h3 class="text-xl font-black text-white">Dapatkan Diskon & Info Promo Terbaru</h3>
      <p class="text-xs text-blue-200">Kirimkan no. WhatsApp Anda untuk menerima katalog mingguan.</p>
    </div>
    <div class="w-full sm:w-auto flex items-center gap-2">
      <input
        type="text"
        placeholder="Nomor WhatsApp..."
        class="px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder:text-blue-300 text-xs border border-white/20 focus:outline-none w-full sm:w-60"
      />
      <button
        type="button"
        class="px-4 py-2.5 rounded-xl bg-[var(--theme-primary,#2563eb)] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
      >
        <Send size={13} />
        <span>Langganan</span>
      </button>
    </div>
  </div>

  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--theme-text-muted,#64748b)]">
    <div>
      <span class="font-black text-sm text-[var(--theme-text-primary,#0f172a)] mr-2">{logoText}</span>
      <span>{tagline}</span>
    </div>
    <p>{copyrightText}</p>
  </div>
</div>
