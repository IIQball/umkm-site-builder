<script lang="ts">
  import { AlertCircle, Store, MapPin, Phone, ArrowLeft, CheckCircle, Loader2 } from 'lucide-svelte';
  import { Button, Input } from '@/components/ui';

  type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

  export let storeName: string = '';
  export let waNumber: string = '';
  export let googleMapsUrl: string = '';
  export let formErrors: Record<string, string> = {};
  export let submitStatus: SubmitStatus = 'idle';
  export let submitError: string = '';
  export let onPrev: () => void;
  export let onNext: () => void;
</script>

<div class="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
  <div class="text-center mb-4">
    <h2 class="text-2xl font-bold mb-2">Profil Toko</h2>
    <p class="text-base-content/70 text-sm">
      Lengkapi informasi toko Anda untuk memudahkan pelanggan berbelanja.
    </p>
  </div>

  <div class="space-y-4">
    <Input
      id="store-name"
      label="Nama Toko"
      required
      bind:value={storeName}
      placeholder="Contoh: Kopi Budi Nusantara"
      error={formErrors.storeName ?? ''}
      fullWidth
    >
      <Store slot="prefix" size={18} class="text-base-content/40" />
    </Input>

    <Input
      id="wa-number"
      type="tel"
      label="Nomor WhatsApp"
      required
      bind:value={waNumber}
      placeholder="Contoh: 6281234567890"
      helper="Gunakan format 628... (tanpa + atau 0 di depan)"
      error={formErrors.waNumber ?? ''}
      fullWidth
    >
      <Phone slot="prefix" size={18} class="text-base-content/40" />
    </Input>

    <Input
      id="maps-url"
      type="url"
      label="Google Maps URL (Opsional)"
      bind:value={googleMapsUrl}
      placeholder="https://maps.google.com/..."
      error={formErrors.googleMapsUrl ?? ''}
      fullWidth
    >
      <MapPin slot="prefix" size={18} class="text-base-content/40" />
    </Input>
  </div>

  {#if submitError}
    <div class="alert alert-error text-sm mt-2">
      <AlertCircle size={16} />
      <span>{submitError}</span>
    </div>
  {/if}

  <div class="mt-4 flex justify-between gap-3">
    <Button
      variant="ghost"
      disabled={submitStatus === 'submitting'}
      on:click={onPrev}
    >
      <ArrowLeft size={18} />
      Kembali
    </Button>
    
    <Button
      variant="primary"
      disabled={submitStatus === 'submitting' || !storeName || !waNumber}
      on:click={onNext}
    >
      {#if submitStatus === 'submitting'}
        <Loader2 size={18} class="animate-spin" />
        Menyimpan...
      {:else}
        Selesai
        <CheckCircle size={18} />
      {/if}
    </Button>
  </div>
</div>
