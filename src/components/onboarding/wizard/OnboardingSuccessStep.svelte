<script lang="ts">
  import { CheckCircle, ArrowRight } from 'lucide-svelte';
  import { Button } from '@/components/ui';

  export let subdomain: string = '';
  export let storeName: string = '';
  export let address: string = '';
</script>

<div class="flex flex-col items-center text-center gap-5 py-8 animate-fade-in">
  <div class="w-16 h-16 rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)] flex items-center justify-center mb-1">
    <CheckCircle size={36} />
  </div>

  <div>
    <h2 class="text-heading-md font-bold font-heading text-main leading-tight">
      Toko Anda Berhasil Dibuat!
    </h2>
    <p class="text-body-sm text-secondary mt-1 max-w-md mx-auto font-sans">
      Profil dan konfigurasi awal toko Anda telah siap. Anda dapat menambahkan produk dan mengedit tampilan visual toko kapan saja.
    </p>
  </div>

  <div class="bg-nested p-5 rounded-2xl w-full text-left border border-light space-y-3.5 my-2">
    <div>
      <span class="block text-label-caps text-muted mb-0.5">Alamat Subdomain Toko:</span>
      <p class="font-mono font-bold text-main text-sm">{subdomain}.umkm.site</p>
    </div>
    <div class="border-t border-light pt-3">
      <span class="block text-label-caps text-muted mb-0.5">Nama Toko:</span>
      <p class="font-medium text-main text-sm font-sans">{storeName}</p>
    </div>
    <div class="border-t border-light pt-3">
      <span class="block text-label-caps text-muted mb-0.5">Alamat Fisik:</span>
      <p class="text-xs text-secondary leading-relaxed font-sans">{address}</p>
    </div>
  </div>

  <div class="w-full pt-2">
    <Button
      variant="primary"
      size="lg"
      fullWidth
      class="font-bold font-sans flex items-center justify-center gap-2"
      on:click={() => { window.location.href = '/dashboard/store-settings'; }}
    >
      <span>Ke Pengaturan Toko Sekarang</span>
      <ArrowRight size={18} />
    </Button>
  </div>
</div>
