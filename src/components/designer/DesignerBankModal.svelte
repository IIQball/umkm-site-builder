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
  title={bankAccount ? 'Ganti Rekening Bank' : 'Hubungkan Rekening Bank'}
  size="sm"
  on:close={onClose}
>
  <div class="space-y-4">
    <Select
      label="Nama Bank"
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
      className="font-mono"
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
      variant="primary"
      size="sm"
      disabled={isLoading}
      loading={isLoading}
      on:click={onSave}
    >
      Simpan Rekening
    </Button>
  </svelte:fragment>
</Modal>

