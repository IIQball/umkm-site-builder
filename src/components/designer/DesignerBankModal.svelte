<script lang="ts">
  import type { BankAccount } from '@/types';
  import { Modal, Input, Select, Button } from '@/components/ui';

  export let showModal = false;
  export let bankAccount: BankAccount | null = null;
  export let inputBankName = 'BCA';
  export let inputAccountNumber = '';
  export let inputHolderName = '';
  export let isLoading = false;
  export let apiError = '';
  export let onSave: () => void = () => {};
  export let onClose: () => void = () => {};

  const popularBanks = [
    { value: 'BCA', label: 'BCA' },
    { value: 'Mandiri', label: 'Mandiri' },
    { value: 'BNI', label: 'BNI' },
    { value: 'BRI', label: 'BRI' },
    { value: 'CIMB Niaga', label: 'CIMB Niaga' },
    { value: 'Permata', label: 'Permata' },
  ];
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
          Pastikan nama pemilik sesuai dengan buku rekening Anda
        </p>
      </div>
    </div>
  </svelte:fragment>

  <div class="space-y-4">
    <!-- Form Fields -->
    <div class="space-y-3.5 pt-1">
      <Select
        label="Nama Bank Tujuan"
        options={popularBanks}
        bind:value={inputBankName}
        disabled={isLoading}
        size="sm"
      />

      <Input
        label="Nomor Rekening"
        placeholder="Contoh: 7128391829"
        bind:value={inputAccountNumber}
        disabled={isLoading}
        size="sm"
        className="font-mono font-bold"
      />

      <Input
        label="Nama Pemilik Rekening"
        placeholder="Nama lengkap sesuai tabungan"
        bind:value={inputHolderName}
        disabled={isLoading}
        size="sm"
        error={apiError}
      />
    </div>

    <!-- Security Trust Note -->
    <div class="p-3 bg-nested/80 border border-light rounded-2xl flex items-center gap-2.5">
      <span class="material-symbols-outlined text-xs text-muted flex-shrink-0">lock</span>
      <span class="text-3xs text-secondary font-medium leading-relaxed">
        Data rekening terenkripsi secara aman dan hanya digunakan untuk penyaluran komisi template.
      </span>
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button
      variant="secondary"
      size="sm"
      disabled={isLoading}
      on:click={onClose}
    >
      Batal
    </Button>
    <Button
      variant="orange"
      size="sm"
      disabled={isLoading}
      loading={isLoading}
      on:click={onSave}
    >
      <span class="material-symbols-outlined text-sm">check</span>
      <span>Simpan Rekening</span>
    </Button>
  </svelte:fragment>
</Modal>

