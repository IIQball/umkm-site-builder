<script lang="ts">
  import { CheckCircle, Loader2, XCircle, AlertCircle, ArrowRight, ExternalLink, Lock } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import { slide } from 'svelte/transition';

  import { onMount } from 'svelte';
  import { getMainDomain } from '@/lib/domain';

  type ValidationStatus = 'idle' | 'typing' | 'checking' | 'available' | 'taken' | 'invalid' | 'error';

  export let isEdit: boolean = false;
  export let subdomain: string = '';
  export let subdomainStatus: ValidationStatus = 'idle';
  export let subdomainMessage: string = '';
  export let isStep1Valid: boolean = false;
  export let onInput: (e: Event) => void;
  export let onNext: () => void;

  const MAX_LENGTH = 63;
  let mainDomain = 'localhost:4321';

  onMount(() => {
    mainDomain = getMainDomain();
  });

  $: storeUrl = `http://${subdomain}.${mainDomain}`;
</script>

<div class="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
  <div class="border-b border-light pb-6">
    <h2 class="text-heading-md text-main font-bold font-heading leading-tight">
      {isEdit ? 'Alamat Subdomain Toko' : 'Pilih Alamat Subdomain Toko'}
    </h2>
    <p class="text-body-sm text-secondary mt-0.5 font-sans">
      {isEdit
        ? 'Alamat URL resmi toko online Anda yang telah terdaftar dan aktif di internet.'
        : 'Tentukan subdomain unik untuk toko online Anda. Ini akan menjadi alamat URL resmi toko Anda di internet.'}
    </p>
  </div>

  <div class="space-y-3">
    <label for="subdomain-input" class="block text-label-caps text-muted">
      Subdomain Toko {isEdit ? '' : '<span class="text-error ml-0.5">*</span>'}
    </label>

    {#if isEdit}
      <div class="p-4 rounded-2xl bg-nested border border-light space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-card border border-light flex items-center justify-center text-muted shrink-0">
              <Lock size={16} />
            </div>
            <div>
              <p class="font-mono font-bold text-main text-base">
                {subdomain}<span class="text-muted font-normal">.{mainDomain}</span>
              </p>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span class="w-2 h-2 rounded-full bg-success"></span>
                <span class="text-2xs font-semibold text-success">
                  Subdomain Terdaftar & Aktif
                </span>
              </div>
            </div>
          </div>

          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card hover:bg-nested border border-light text-xs font-semibold text-main hover:text-primary transition-colors shadow-2xs w-fit"
          >
            <span>Lihat Toko Online</span>
            <ExternalLink size={13} />
          </a>
        </div>

        <p class="text-xs text-muted leading-relaxed border-t border-light pt-3">
          Subdomain tidak dapat diubah setelah toko dibuat untuk menjaga konsistensi perutean, domain, dan reputasi SEO toko Anda.
        </p>
      </div>
    {:else}
      <div
        class="flex items-center w-full rounded-xl overflow-hidden border bg-nested transition-all duration-150 {subdomainStatus === 'available'
          ? 'border-success ring-2 ring-success/20'
          : subdomainStatus === 'taken' || subdomainStatus === 'invalid' || subdomainStatus === 'error'
          ? 'border-error ring-2 ring-error/20'
          : 'border-light focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-card'}"
      >
        <input
          id="subdomain-input"
          type="text"
          class="w-full bg-transparent text-main px-4 py-2.5 text-sm font-sans placeholder:italic placeholder:text-muted placeholder:opacity-80 focus:outline-none"
          placeholder="nama-toko-anda"
          maxlength={MAX_LENGTH}
          autocomplete="off"
          spellcheck="false"
          bind:value={subdomain}
          on:input={onInput}
        />
        <span class="flex items-center bg-nested/90 px-4 py-2.5 text-sm font-mono font-semibold text-secondary border-l border-light select-none">
          .{mainDomain}
        </span>
      </div>

      <div class="min-h-[22px] px-1">
        {#if subdomainStatus === 'checking'}
          <span class="text-xs text-primary flex items-center gap-1.5 font-medium" transition:slide={{ axis: 'y', duration: 200 }}>
            <Loader2 size={13} class="animate-spin" />
            Memeriksa ketersediaan...
          </span>
        {:else if subdomainStatus === 'available'}
          <span class="text-xs text-success flex items-center gap-1.5 font-medium" transition:slide={{ axis: 'y', duration: 200 }}>
            <CheckCircle size={13} />
            {subdomainMessage}
          </span>
        {:else if subdomainStatus === 'taken'}
          <span class="text-xs text-error flex items-center gap-1.5 font-medium" transition:slide={{ axis: 'y', duration: 200 }}>
            <XCircle size={13} />
            {subdomainMessage}
          </span>
        {:else if subdomainStatus === 'invalid' || subdomainStatus === 'error'}
          <span class="text-xs text-error flex items-center gap-1.5 font-medium" transition:slide={{ axis: 'y', duration: 200 }}>
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
    {/if}
  </div>

  <div class="mt-4 flex justify-end gap-3 pt-6 border-t border-light">
    <Button
      variant="primary"
      size="md"
      class="font-bold font-sans"
      disabled={isEdit ? false : !isStep1Valid}
      on:click={onNext}
    >
      <span>{isEdit ? 'Lanjut ke Profil Toko' : 'Lanjutkan'}</span>
      <ArrowRight size={16} />
    </Button>
  </div>
</div>
