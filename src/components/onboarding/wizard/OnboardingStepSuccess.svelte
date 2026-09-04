<script lang="ts">
  import { CheckCircle } from 'lucide-svelte';
  import { Button } from '@/components/ui';

  export let subdomain: string = '';
  export let storeName: string = '';
</script>

<div class="flex flex-col items-center text-center gap-4 py-8 animate-in zoom-in-95 duration-500">
  <div class="w-16 h-16 rounded-full bg-success/20 text-success flex items-center justify-center mb-2">
    <CheckCircle size={32} />
  </div>
  
  <h2 class="text-2xl font-bold">Profil Toko Berhasil Dibuat!</h2>
  
  <div class="bg-nested p-4 rounded-xl w-full text-left mb-4 border border-border-light">
    <p class="text-sm text-muted mb-1">Subdomain:</p>
    <p class="font-mono font-medium mb-3 text-main">{subdomain}.umkm.site</p>
    
    <p class="text-sm text-muted mb-1">Nama Toko:</p>
    <p class="font-medium text-main">{storeName}</p>
  </div>
  
  <p class="text-base-content/70 mb-4">
    Anda akan diarahkan ke Dashboard dalam beberapa detik...
  </p>

  <Button variant="primary" fullWidth href="/dashboard">
    Ke Dashboard Sekarang
  </Button>
</div>
