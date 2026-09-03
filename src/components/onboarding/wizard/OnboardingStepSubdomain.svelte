<script lang="ts">
  import { CheckCircle, Loader2, ArrowRight } from 'lucide-svelte';
  import { Button, Input } from '@/components/ui';
  import { slide } from 'svelte/transition';

  type ValidationStatus = 'idle' | 'typing' | 'checking' | 'available' | 'taken' | 'invalid' | 'error';

  export let subdomain: string = '';
  export let subdomainStatus: ValidationStatus = 'idle';
  export let subdomainMessage: string = '';
  export let isStep1Valid: boolean = false;
  export let onInput: (e: Event) => void;
  export let onNext: () => void;

  const MAX_LENGTH = 63;

  function handleInput(e: Event) {
    onInput(e);
  }
</script>

<div class="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
  <div class="text-center mb-4">
    <h2 class="text-2xl font-bold mb-2">Pilih Alamat Toko</h2>
    <p class="text-base-content/70 text-sm">
      Tentukan subdomain unik untuk toko online Anda. Ini akan menjadi URL toko Anda.
    </p>
  </div>

  <div class="w-full relative">
    <Input
      id="subdomain-input"
      label="Subdomain Toko"
      bind:value={subdomain}
      on:input={handleInput}
      placeholder="nama-toko"
      error={(subdomainStatus === 'taken' || subdomainStatus === 'invalid' || subdomainStatus === 'error') ? subdomainMessage : ''}
      maxlength={MAX_LENGTH}
      autocomplete="off"
      spellcheck="false"
      fullWidth
    >
      <span slot="suffix" class="font-medium text-base-content/50 pr-2">.umkm.site</span>
    </Input>

    <div class="h-6 mt-1 flex items-center overflow-hidden ml-1">
      {#if subdomainStatus === 'checking'}
        <span class="text-xs flex items-center gap-1 text-info" transition:slide={{ axis: 'y', duration: 300 }}>
          <Loader2 size={14} class="animate-spin" />
          Memeriksa ketersediaan...
        </span>
      {:else if subdomainStatus === 'available'}
        <span class="text-xs flex items-center gap-1 text-success" transition:slide={{ axis: 'y', duration: 300 }}>
          <CheckCircle size={14} />
          {subdomainMessage}
        </span>
      {:else if subdomainStatus === 'typing'}
        <span class="text-xs text-base-content/40" transition:slide={{ axis: 'y', duration: 300 }}>
          Mengetik...
        </span>
      {:else if subdomainStatus === 'idle'}
        <span class="text-xs text-muted" transition:slide={{ axis: 'y', duration: 300 }}>
          Contoh: kopi-budi, toko-sari
        </span>
      {/if}
    </div>
  </div>

  <div class="mt-4 flex justify-end gap-3">
    <Button
      variant="primary"
      disabled={!isStep1Valid}
      on:click={onNext}
    >
      Lanjutkan
      <ArrowRight size={18} />
    </Button>
  </div>
</div>
