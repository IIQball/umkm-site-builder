<script lang="ts">
  import type { BankAccount } from '@/types';
  import { Modal, Button } from '@/components/ui';

  export let open: boolean = false;
  export let type: 'set-primary' | 'delete' = 'set-primary';
  export let account: BankAccount | null = null;
  export let isLoading: boolean = false;
  export let onConfirm: () => void = () => {};
  export let onClose: () => void = () => {};

  $: isPrimaryAction = type === 'set-primary';
  $: lastFour =
    account?.accountNumber && account.accountNumber.length > 4
      ? account.accountNumber.slice(-4)
      : account?.accountNumber || '••••';
  $: holderName = account?.accountHolder || account?.holderName || 'Pemilik Rekening';
</script>

<Modal bind:open size="sm" on:close={onClose}>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      {#if isPrimaryAction}
        <div class="w-10 h-10 rounded-2xl bg-warning/10 border border-warning/20 text-warning flex items-center justify-center flex-shrink-0 shadow-2xs">
          <span class="material-symbols-outlined text-xl">star</span>
        </div>
        <div>
          <h3 class="text-base font-extrabold text-main font-heading leading-tight">
            Jadikan Rekening Utama?
          </h3>
          <p class="text-2xs text-muted mt-0.5">
            Setel sebagai rekening prioritas penarikan dana
          </p>
        </div>
      {:else}
        <div class="w-10 h-10 rounded-2xl bg-error/10 border border-error/20 text-error flex items-center justify-center flex-shrink-0 shadow-2xs">
          <span class="material-symbols-outlined text-xl">delete</span>
        </div>
        <div>
          <h3 class="text-base font-extrabold text-main font-heading leading-tight">
            Hapus Rekening Bank?
          </h3>
          <p class="text-2xs text-muted mt-0.5">
            Tindakan ini akan mencopot nomor rekening terdaftar
          </p>
        </div>
      {/if}
    </div>
  </svelte:fragment>

  <div class="space-y-4 pt-1">
    <!-- Account Highlight Card -->
    {#if account}
      <div class="p-3.5 rounded-2xl bg-nested/70 border border-light space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-main font-mono">{account.bankName}</span>
          <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-card border border-light text-secondary">
            •••• {lastFour}
          </span>
        </div>
        <p class="text-xs font-semibold text-main uppercase font-mono tracking-wide">
          {holderName}
        </p>
        <p class="text-xs font-mono text-muted">
          Nomor: {account.accountNumber}
        </p>
      </div>
    {/if}

    <!-- Explanatory note -->
    <p class="text-xs text-secondary leading-relaxed font-sans">
      {#if isPrimaryAction}
        Rekening ini akan diprioritaskan saat Anda melakukan pencairan dana komisi. Rekening utama sebelumnya akan diubah menjadi rekening sekunder.
      {:else}
        Apakah Anda yakin ingin menghapus rekening ini? Rekening yang telah dihapus tidak akan dapat dipilih sebagai tujuan pencairan dana sampai didaftarkan kembali.
      {/if}
    </p>
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

    {#if isPrimaryAction}
      <Button
        variant="orange"
        size="sm"
        loading={isLoading}
        disabled={isLoading}
        on:click={onConfirm}
      >
        <span class="material-symbols-outlined text-sm">check</span>
        <span>Ya, Jadikan Utama</span>
      </Button>
    {:else}
      <Button
        variant="destructive"
        size="sm"
        loading={isLoading}
        disabled={isLoading}
        on:click={onConfirm}
      >
        <span class="material-symbols-outlined text-sm">delete</span>
        <span>Ya, Hapus Rekening</span>
      </Button>
    {/if}
  </svelte:fragment>
</Modal>
