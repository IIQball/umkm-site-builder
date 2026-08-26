<script lang="ts">
  import { Landmark, Plus, X, Loader2, Edit3, ShieldCheck } from 'lucide-svelte';
  import type { BankAccount } from '@/types/finance';
  import { POPULAR_BANKS } from './bank.helpers';

  export let bankAccount: BankAccount | null;
  export let onSaveAccount: (data: { bankName: string; accountNumber: string; holderName: string }) => Promise<void>;

  let showModal = false;
  let inputBankName = 'BCA';
  let inputAccountNumber = '';
  let inputHolderName = '';
  let isSaving = false;
  let formError = '';

  function openModal(e?: MouseEvent) {
    if (e) e.preventDefault();
    if (bankAccount) {
      inputBankName = bankAccount.bankName || 'BCA';
      inputAccountNumber = bankAccount.accountNumber || '';
      inputHolderName = (bankAccount as any).holderName || (bankAccount as any).accountHolder || '';
    } else {
      inputBankName = 'BCA';
      inputAccountNumber = '';
      inputHolderName = '';
    }
    formError = '';
    showModal = true;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && showModal) {
      showModal = false;
    }
  }

  async function handleSave() {
    if (!inputAccountNumber.trim() || !inputHolderName.trim()) {
      formError = 'Semua field wajib diisi';
      return;
    }
    isSaving = true;
    formError = '';
    try {
      await onSaveAccount({
        bankName: inputBankName,
        accountNumber: inputAccountNumber.trim(),
        holderName: inputHolderName.trim(),
      });
      showModal = false;
    } catch (e: any) {
      formError = e.message || 'Gagal menyimpan rekening';
    } finally {
      isSaving = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="bg-card border border-light rounded-2xl p-6 shadow-sm space-y-4">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <div class="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
        <Landmark size={18} />
      </div>
      <div>
        <h3 class="text-sm font-bold text-main">Rekening Bank Penarikan</h3>
        <p class="text-xs text-muted">Rekening tujuan untuk penarikan saldo dan komisi</p>
      </div>
    </div>
    <button
      type="button"
      on:click={openModal}
      class="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
    >
      {#if bankAccount}
        <Edit3 size={13} />
        <span>Ubah Rekening</span>
      {:else}
        <Plus size={14} />
        <span>Tambah Rekening</span>
      {/if}
    </button>
  </div>

  {#if bankAccount}
    <div class="p-4 rounded-xl bg-nested border border-light flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="font-black text-sm text-main">{bankAccount.bankName}</span>
          <span class="badge-custom badge-custom-emerald text-[10px]">
            <ShieldCheck size={11} />
            Aktif & Terverifikasi
          </span>
        </div>
        <p class="font-mono text-sm font-bold text-main tracking-wide">{bankAccount.accountNumber}</p>
        <p class="text-xs text-secondary font-medium uppercase">{bankAccount.holderName || bankAccount.accountHolder || '-'}</p>
      </div>
    </div>
  {:else}
    <div class="py-6 text-center bg-nested/50 border border-dashed border-light rounded-xl space-y-3">
      <p class="text-xs text-muted">Belum ada rekening bank yang didaftarkan untuk mencairkan saldo.</p>
      <button
        type="button"
        on:click={openModal}
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover transition-colors shadow-sm cursor-pointer"
      >
        <Plus size={14} />
        <span>Tambah Rekening Bank</span>
      </button>
    </div>
  {/if}
</div>

{#if showModal}
  <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div
      class="bg-card border border-light w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 animate-scale-in"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-center justify-between border-b border-light pb-3">
        <div class="flex items-center gap-2">
          <Landmark size={18} class="text-primary" />
          <h3 class="font-bold text-sm text-main">{bankAccount ? 'Ubah Rekening Bank' : 'Tambah Rekening Bank'}</h3>
        </div>
        <button
          type="button"
          on:click={() => (showModal = false)}
          class="p-1 rounded-lg text-muted hover:text-main hover:bg-nested transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {#if formError}
        <div class="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-medium">
          {formError}
        </div>
      {/if}

      <div class="space-y-4 text-xs">
        <div>
          <label for="modal-bank-name" class="block font-semibold text-main mb-1.5">Nama Bank</label>
          <select
            id="modal-bank-name"
            bind:value={inputBankName}
            class="w-full px-3.5 py-2.5 bg-nested border border-light rounded-xl text-xs font-medium text-main focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {#each POPULAR_BANKS as bank}
              <option value={bank}>{bank}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="modal-account-num" class="block font-semibold text-main mb-1.5">Nomor Rekening</label>
          <input
            id="modal-account-num"
            type="text"
            bind:value={inputAccountNumber}
            placeholder="Contoh: 1234567890"
            class="w-full px-3.5 py-2.5 bg-nested border border-light rounded-xl text-xs font-mono text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label for="modal-holder-name" class="block font-semibold text-main mb-1.5">Nama Pemilik Rekening</label>
          <input
            id="modal-holder-name"
            type="text"
            bind:value={inputHolderName}
            placeholder="Nama sesuai buku tabungan"
            class="w-full px-3.5 py-2.5 bg-nested border border-light rounded-xl text-xs font-medium text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase"
          />
        </div>
      </div>

      <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-light">
        <button
          type="button"
          on:click={() => (showModal = false)}
          class="px-4 py-2 rounded-xl text-xs font-semibold bg-nested text-secondary hover:text-main hover:bg-nested/80 transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          on:click={handleSave}
          disabled={isSaving}
          class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover disabled:opacity-50 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          {#if isSaving}
            <Loader2 size={14} class="animate-spin" />
          {/if}
          <span>Simpan Rekening</span>
        </button>
      </div>
    </div>
  </div>
{/if}
