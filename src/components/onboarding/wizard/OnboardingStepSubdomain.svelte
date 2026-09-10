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

<div class="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
  <div class="border-b border-light pb-6">
    <h2 class="text-heading-md text-main font-bold font-heading leading-tight">
      Pilih Alamat Subdomain Toko
    </h2>
    <p class="text-body-sm text-secondary mt-0.5 font-sans">
      Tentukan subdomain unik untuk toko online Anda. Ini akan menjadi alamat URL resmi toko Anda di internet.
    </p>
  </div>

  <div class="space-y-2">
    <label for="subdomain-input" class="block text-label-caps text-muted">
      Subdomain Toko <span class="text-error ml-0.5">*</span>
    </label>

    <div
      class="flex items-center w-full rounded-xl overflow-hidden border bg-nested transition-all duration-150 {subdomainStatus === 'available'
        ? 'border-[var(--color-success)] ring-2 ring-[var(--color-success)]/20'
        : subdomainStatus === 'taken' || subdomainStatus === 'invalid' || subdomainStatus === 'error'
        ? 'border-[var(--color-error)] ring-2 ring-[var(--color-error)]/20'
        : 'border-light focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 focus-within:bg-card'}"
    >
      <input
        id="subdomain-input"
        type="text"
        class="w-full bg-transparent text-main px-4 py-2.5 text-sm font-sans placeholder:italic placeholder:text-[var(--color-text-light)] placeholder:opacity-80 focus:outline-none"
        placeholder="nama-toko-anda"
        maxlength={MAX_LENGTH}
        autocomplete="off"
        spellcheck="false"
        bind:value={subdomain}
        on:input={onInput}
      />
      <span class="flex items-center bg-nested/90 px-4 py-2.5 text-sm font-mono font-semibold text-secondary border-l border-light select-none">
        .umkm.site
      </span>
    </div>

    <div class="min-h-[22px] px-1">
      {#if subdomainStatus === 'checking'}
        <span class="text-xs text-[var(--color-primary)] flex items-center gap-1.5 font-medium" transition:slide={{ axis: 'y', duration: 200 }}>
          <Loader2 size={13} class="animate-spin" />
          Memeriksa ketersediaan...
        </span>
      {:else if subdomainStatus === 'available'}
        <span class="text-xs text-[var(--color-success)] flex items-center gap-1.5 font-medium" transition:slide={{ axis: 'y', duration: 200 }}>
          <CheckCircle size={13} />
          {subdomainMessage}
        </span>
      {:else if subdomainStatus === 'taken'}
        <span class="text-xs text-[var(--color-error)] flex items-center gap-1.5 font-medium" transition:slide={{ axis: 'y', duration: 200 }}>
          <XCircle size={13} />
          {subdomainMessage}
        </span>
      {:else if subdomainStatus === 'invalid' || subdomainStatus === 'error'}
        <span class="text-xs text-[var(--color-error)] flex items-center gap-1.5 font-medium" transition:slide={{ axis: 'y', duration: 200 }}>
          <AlertCircle size={13} />
          {subdomainMessage}
        </span>
      {:else if subdomainStatus === 'typing'}
        <span class="text-xs text-muted" transition:slide={{ axis: 'y', duration: 200 }}>
          Mengetik...
        </span>
      {:else}
        <span class="text-xs text-muted">
          Gunakan huruf kecil, angka, atau tanda hubung (contoh: kopi-budi, toko-sari)
        </span>
      {/if}
    </div>
  </div>

  <div class="mt-4 flex justify-end gap-3 pt-6 border-t border-light">
    <Button
      variant="primary"
      size="md"
      class="font-bold font-sans"
      disabled={!isStep1Valid}
      on:click={onNext}
    >
      Lanjutkan
      <ArrowRight size={16} />
    </Button>
  </div>
</div>
