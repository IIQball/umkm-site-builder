<script lang="ts">
  import { CheckCircle, Loader2, XCircle, AlertCircle, ArrowRight } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import { slide } from 'svelte/transition';

  type ValidationStatus = 'idle' | 'typing' | 'checking' | 'available' | 'taken' | 'invalid' | 'error';

  export let subdomain: string = '';
  export let subdomainStatus: ValidationStatus = 'idle';
  export let subdomainMessage: string = '';
  export let isStep1Valid: boolean = false;
  export let onInput: (e: Event) => void;
  export let onNext: () => void;

  const MAX_LENGTH = 63;
</script>

<div class="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
  <div class="text-center mb-4">
    <h2 class="text-2xl font-bold mb-2">Pilih Alamat Toko</h2>
    <p class="text-base-content/70 text-sm">
      Tentukan subdomain unik untuk toko online Anda. Ini akan menjadi URL toko Anda.
    </p>
  </div>

  <div class="w-full relative">
    <div class="form-control w-full">
      <label class="label" for="subdomain-input">
        <span class="label-text font-medium">Subdomain Toko</span>
      </label>

      <div class="join w-full">
        <input
          id="subdomain-input"
          type="text"
          class="input input-bordered join-item w-full"
          class:input-success={subdomainStatus === 'available'}
          class:input-error={subdomainStatus === 'taken' || subdomainStatus === 'invalid' || subdomainStatus === 'error'}
          placeholder="nama-toko"
          maxlength={MAX_LENGTH}
          autocomplete="off"
          spellcheck="false"
          bind:value={subdomain}
          on:input={onInput}
        />
        <span class="join-item flex items-center bg-base-200 px-3 text-sm text-base-content/60">
          .umkm.site
        </span>
      </div>

      <label class="label" for="subdomain-input">
        {#if subdomainStatus === 'checking'}
          <span class="label-text-alt flex items-center gap-1 text-info" transition:slide={{ axis: 'y', duration: 300 }}>
            <Loader2 size={14} class="animate-spin" />
            Memeriksa ketersediaan...
          </span>
        {:else if subdomainStatus === 'available'}
          <span class="label-text-alt flex items-center gap-1 text-success" transition:slide={{ axis: 'y', duration: 300 }}>
            <CheckCircle size={14} />
            {subdomainMessage}
          </span>
        {:else if subdomainStatus === 'taken'}
          <span class="label-text-alt flex items-center gap-1 text-error" transition:slide={{ axis: 'y', duration: 300 }}>
            <XCircle size={14} />
            {subdomainMessage}
          </span>
        {:else if subdomainStatus === 'invalid'}
          <span class="label-text-alt flex items-center gap-1 text-warning" transition:slide={{ axis: 'y', duration: 300 }}>
            <AlertCircle size={14} />
            {subdomainMessage}
          </span>
        {:else if subdomainStatus === 'error'}
          <span class="label-text-alt flex items-center gap-1 text-error" transition:slide={{ axis: 'y', duration: 300 }}>
            <AlertCircle size={14} />
            {subdomainMessage}
          </span>
        {:else if subdomainStatus === 'typing'}
          <span class="label-text-alt text-base-content/40" transition:slide={{ axis: 'y', duration: 300 }}>
            Mengetik...
          </span>
        {:else}
          <span class="label-text-alt text-base-content/40" transition:slide={{ axis: 'y', duration: 300 }}>
            Contoh: kopi-budi, toko-sari
          </span>
        {/if}
      </label>
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
