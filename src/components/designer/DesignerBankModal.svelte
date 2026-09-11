<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { BankAccount } from '@/types';
  import { Modal, Input, Select, Button } from '@/components/ui';
  import { BANK_OPTIONS, resolveBankKey } from './bankBranding.helpers';

  export let showModal = false;
  export let bankAccount: BankAccount | null = null;
  export let inputBankName = 'BCA';
  export let inputAccountNumber = '';
  export let inputHolderName = '';
  export let isLoading = false;
  export let apiError = '';
  export let onSave: () => void = () => {};
  export let onClose: () => void = () => {};

  let isValidating = false, isVerified = false, validationError = '';
  let nameMismatch = false, nameMismatchWarning = '';
  let failedAttempts = 0, isRateLimited = false;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let activeAbortController: AbortController | null = null, lastValidatedKey = '';

  // Initialize verification state when modal opens or bank account changes
  $: if (showModal) {
    const cleanNum = inputAccountNumber.replace(/\D/g, '');
    const currentKey = `${inputBankName}:${cleanNum}`;
    if (bankAccount && cleanNum === bankAccount.accountNumber.replace(/\D/g, '') && inputHolderName) {
      isVerified = true;
      lastValidatedKey = currentKey;
      validationError = '';
      nameMismatch = false;
    }
  }

  const validateAccount = async () => {
    const cleanNum = inputAccountNumber.replace(/\D/g, '');
    const bankKey = resolveBankKey(inputBankName) || inputBankName.trim().toUpperCase();

    if (activeAbortController) { activeAbortController.abort(); activeAbortController = null; }

    if (cleanNum.length < 8) {
      isValidating = false; isVerified = false; inputHolderName = ''; nameMismatch = false;
      validationError = cleanNum.length > 0 ? 'Nomor rekening minimal 8-10 digit angka' : '';
      return;
    }

    isValidating = true; validationError = ''; isVerified = false; inputHolderName = '';
    nameMismatch = false; nameMismatchWarning = '';

    const controller = new AbortController();
    activeAbortController = controller;

    try {
      const res = await fetch('/api/designer/bank/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankCode: bankKey, accountNumber: cleanNum }),
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;
      const data = await res.json().catch(() => ({}));
      if (controller.signal.aborted) return;

      if (res.ok && data.success && data.isValid) {
        isVerified = true;
        validationError = '';
        inputHolderName = String(data.accountHolderName || '').toUpperCase();
        nameMismatch = Boolean(data.nameMismatch);
        nameMismatchWarning = data.warning || '';
        lastValidatedKey = `${inputBankName}:${cleanNum}`;
        failedAttempts = 0;
        isRateLimited = false;
      } else {
        isVerified = false; inputHolderName = ''; nameMismatch = false; nameMismatchWarning = '';
        failedAttempts += 1;
        if (res.status === 429) isRateLimited = true;
        validationError = data.message || 'Nomor rekening tidak terdaftar pada bank yang dipilih';
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      isVerified = false; inputHolderName = ''; nameMismatch = false; nameMismatchWarning = '';
      failedAttempts += 1;
      validationError = 'Koneksi ke server validasi terputus. Silakan coba lagi.';
    } finally {
      if (activeAbortController === controller) { activeAbortController = null; isValidating = false; }
    }
  };

  const handleAccountInput = () => {
    const cleanNum = inputAccountNumber.replace(/\D/g, '');
    const currentKey = `${inputBankName}:${cleanNum}`;
    if (currentKey === lastValidatedKey && isVerified) return;

    if (debounceTimer) { clearTimeout(debounceTimer); debounceTimer = null; }
    if (activeAbortController) { activeAbortController.abort(); activeAbortController = null; }

    isVerified = false; validationError = ''; inputHolderName = '';
    nameMismatch = false; nameMismatchWarning = '';

    if (cleanNum.length >= 10) {
      isValidating = true;
      debounceTimer = setTimeout(() => validateAccount(), 800);
    } else {
      isValidating = false;
    }
  };

  const handleBankChange = () => {
    lastValidatedKey = '';
    handleAccountInput();
  };

  const handleBlur = () => {
    const cleanNum = inputAccountNumber.replace(/\D/g, '');
    if (cleanNum.length >= 8 && !isVerified && !isValidating) {
      if (debounceTimer) { clearTimeout(debounceTimer); debounceTimer = null; }
      validateAccount();
    }
  };

  onDestroy(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (activeAbortController) activeAbortController.abort();
  });
</script>

<Modal
  bind:open={showModal}
  size="sm"
  on:close={onClose}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-slate-900 text-white dark:bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">account_balance</span>
      </div>
      <div>
        <h3 class="text-base font-extrabold text-main font-heading leading-tight">
          {bankAccount ? 'Ganti Rekening Bank' : 'Hubungkan Rekening Bank'}
        </h3>
        <p class="text-2xs text-muted mt-0.5">
          Pilih bank dan masukkan nomor rekening untuk verifikasi otomatis
        </p>
      </div>
    </div>
  </svelte:fragment>

  <div class="space-y-4">
    <!-- Form Fields -->
    <div class="space-y-3 pt-1">
      <Select
        label="Nama Bank Resmi (9 Bank Didukung)"
        options={BANK_OPTIONS}
        bind:value={inputBankName}
        disabled={isLoading || isValidating}
        on:change={handleBankChange}
        size="sm"
      />

      <div>
        <Input
          label="Nomor Rekening"
          placeholder="Contoh: 7128391829"
          bind:value={inputAccountNumber}
          disabled={isLoading}
          on:input={handleAccountInput}
          on:blur={handleBlur}
          size="sm"
          className="font-mono font-bold"
        />

        <!-- Validation Status Indicator & Badges -->
        <div class="mt-1.5 min-h-[22px] flex items-center">
          {#if isValidating}
            <div class="flex items-center gap-1.5 text-2xs text-orange font-semibold animate-pulse">
              <span class="w-3 h-3 border-2 border-orange border-t-transparent rounded-full animate-spin"></span>
              <span>Memverifikasi rekening ke sistem bank...</span>
            </div>
          {:else if isVerified}
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-full text-2xs font-bold font-sans tracking-wide">
              <span class="material-symbols-outlined text-xs">verified</span>
              <span>Rekening Terverifikasi Resmi</span>
            </div>
          {:else if validationError}
            <div class="flex items-center gap-1 text-2xs text-red-500 font-medium">
              <span class="material-symbols-outlined text-xs">error</span>
              <span>{validationError}</span>
            </div>
          {:else}
            <span class="text-3xs text-muted">
              Minimal 10 digit. Nama pemilik akan terisi otomatis setelah rekening terverifikasi.
            </span>
          {/if}
        </div>
      </div>

      <!-- Field Nama Pemilik Rekening: DISABLED/READ-ONLY with auto-fill -->
      <div>
        <Input
          label="Nama Pemilik Rekening (Terisi Otomatis)"
          placeholder={isValidating ? 'Memverifikasi nama...' : 'Menunggu verifikasi nomor rekening...'}
          value={inputHolderName}
          disabled={true}
          readonly={true}
          size="sm"
          className="font-mono font-bold uppercase cursor-not-allowed bg-nested/70"
          error={apiError}
        />
      </div>

      <!-- Name Mismatch Warning Banner (Yellow) -->
      {#if isVerified && nameMismatch}
        <div class="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-2 text-amber-600 dark:text-amber-400">
          <span class="material-symbols-outlined text-sm flex-shrink-0 mt-0.5">warning</span>
          <span class="text-3xs font-medium leading-relaxed">
            {nameMismatchWarning || 'Nama pemilik rekening berbeda dengan nama profil Anda. Pastikan Anda menggunakan rekening pribadi untuk pencairan komisi.'}
          </span>
        </div>
      {/if}

      <!-- Fallback Manual Verification: 2 failures or rate limit -->
      {#if failedAttempts >= 2 || isRateLimited}
        <div class="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between gap-2 text-blue-600 dark:text-blue-400">
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="material-symbols-outlined text-sm flex-shrink-0">support_agent</span>
            <span class="text-3xs font-medium leading-tight">
              Rekening Anda belum terdeteksi? Hubungi Admin untuk verifikasi rekening manual.
            </span>
          </div>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%2C%20saya%20butuh%20bantuan%20verifikasi%20rekening%20bank%20manual"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-3xs font-bold transition-colors shadow-2xs flex-shrink-0"
          >
            <span>Hubungi Admin</span>
            <span class="material-symbols-outlined text-2xs">open_in_new</span>
          </a>
        </div>
      {/if}
    </div>

    <!-- Security Trust Note -->
    <div class="p-3 bg-nested/80 border border-light rounded-2xl flex items-center gap-2.5">
      <span class="material-symbols-outlined text-xs text-muted flex-shrink-0">lock</span>
      <span class="text-3xs text-secondary font-medium leading-relaxed">
        Data rekening terenkripsi secara aman dan hanya digunakan untuk penyaluran komisi penjualan template.
      </span>
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button
      variant="secondary"
      size="sm"
      disabled={isLoading || isValidating}
      on:click={onClose}
    >
      Batal
    </Button>
    <Button
      variant="orange"
      size="sm"
      disabled={isLoading || isValidating || !isVerified || !inputHolderName}
      loading={isLoading}
      on:click={onSave}
    >
      <span class="material-symbols-outlined text-sm">check</span>
      <span>Simpan Rekening</span>
    </Button>
  </svelte:fragment>
</Modal>
