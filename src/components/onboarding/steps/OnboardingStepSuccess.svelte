<script lang="ts">
  import { CheckCircle2, ArrowRight } from 'lucide-svelte';

  export let storeName: string;
  export let subdomain: string;
</script>

<div class="text-center py-6 space-y-4">
  <div class="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
    <CheckCircle2 size={36} />
  </div>
  <div class="space-y-1">
    <h3 class="font-extrabold text-lg text-base-content">Toko Online Anda Siap Dikelola!</h3>
    <p class="text-xs text-base-content/60">
      Subdomain <strong>{subdomain}.umkm.site</strong> berhasil didaftarkan untuk <strong>{storeName}</strong>.
    </p>
  </div>

  <div class="pt-4">
    <a
      href="/dashboard"
      class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-primary shadow-lg cursor-pointer hover:opacity-90"
    >
      <span>Buka Dashboard Toko</span>
      <ArrowRight size={14} />
    </a>
  </div>
</div>
