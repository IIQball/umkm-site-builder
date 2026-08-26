<script lang="ts">
  import { CheckCircle, XCircle, Loader2 } from 'lucide-svelte';
  import type { ValidationStatus } from '@/types/common';

  export let subdomain: string;
  export let subdomainStatus: ValidationStatus;
  export let subdomainMessage: string;
  export let onInputSubdomain: (val: string) => void;
</script>

<div class="space-y-4">
  <div class="space-y-1">
    <h3 class="font-bold text-base text-base-content">Tentukan Alamat Subdomain Toko Anda</h3>
    <p class="text-xs text-base-content/60">
      Subdomain ini akan menjadi alamat tautan publik website toko online Anda.
    </p>
  </div>

  <div class="space-y-2">
    <label for="onboarding-subdomain-input" class="block font-semibold text-xs text-base-content/80">Nama Subdomain</label>
    <div class="relative flex items-center">
      <input
        id="onboarding-subdomain-input"
        type="text"
        value={subdomain}
        on:input={(e) => onInputSubdomain(e.currentTarget.value)}
        placeholder="nama-toko-anda"
        class="w-full px-4 py-3 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-2xl text-xs font-mono text-base-content pr-36 focus:outline-none focus:border-primary"
      />
      <div class="absolute right-4 flex items-center gap-2 pointer-events-none text-xs text-base-content/50 font-mono">
        {#if subdomainStatus === 'checking'}
          <Loader2 size={14} class="animate-spin text-primary" />
        {:else if subdomainStatus === 'available'}
          <CheckCircle size={14} class="text-emerald-500" />
        {:else if subdomainStatus === 'taken' || subdomainStatus === 'invalid' || subdomainStatus === 'error'}
          <XCircle size={14} class="text-rose-500" />
        {/if}
        <span>.umkm.site</span>
      </div>
    </div>

    {#if subdomainMessage}
      <p class="text-xs {subdomainStatus === 'available' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}">
        {subdomainMessage}
      </p>
    {/if}
  </div>
</div>
