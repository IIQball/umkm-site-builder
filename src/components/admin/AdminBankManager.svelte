<script lang="ts">
  import { onMount } from 'svelte';
  import type { BankAccount } from '@/types';
  import DesignerBankCard from '@/components/designer/DesignerBankCard.svelte';
  import DesignerBankModal from '@/components/designer/DesignerBankModal.svelte';

  let bankAccounts: BankAccount[] = [];
  let selectedAccountId = '';
  let isLoading = false;
  let showBankModal = false;
  let apiError = '';
  let inputBankName = 'BCA';
  let inputAccountNumber = '';
  let inputHolderName = '';

  const fetchBankAccounts = async () => {
    isLoading = true;
    apiError = '';
    try {
      const res = await fetch('/api/admin/bank-account');
      const result = await res.json();
      if (res.ok && result.ok && result.data) {
        const rawAccounts: BankAccount[] = result.data.accounts || [result.data];
        bankAccounts = rawAccounts.map((a) => {
          const resolvedName = a.accountHolder || a.holderName || (a as any).accountHolderName || '';
          return { ...a, holderName: resolvedName, accountHolder: resolvedName };
        });
        const primary = bankAccounts.find((a) => a.isPrimary) || bankAccounts[0];
        if (!selectedAccountId || !bankAccounts.some((a) => a.id === selectedAccountId)) {
          selectedAccountId = primary?.id || '';
        }
      } else {
        bankAccounts = [];
        selectedAccountId = '';
      }
    } catch (err) {
      console.error('Failed to fetch admin bank accounts:', err);
    } finally {
      isLoading = false;
    }
  };

  onMount(() => {
    fetchBankAccounts();
  });

  const openBankModal = () => {
    inputBankName = 'BCA';
    inputAccountNumber = '';
    inputHolderName = '';
    apiError = '';
    showBankModal = true;
  };

  const saveBankAccount = async () => {
    if (!inputAccountNumber || !inputHolderName) {
      apiError = 'Semua field wajib diisi';
      return;
    }

    isLoading = true;
    apiError = '';
    try {
      const res = await fetch('/api/admin/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankCode: inputBankName,
          bankName: inputBankName,
          accountNumber: inputAccountNumber,
          accountHolder: inputHolderName,
          holderName: inputHolderName,
        }),
      });

      const result = await res.json();
      if (res.ok && result.ok) {
        showBankModal = false;
        await fetchBankAccounts();
        if (result.data?.id) selectedAccountId = result.data.id;
      } else {
        apiError = result.error?.message || 'Gagal mendaftarkan rekening bank.';
      }
    } catch {
      apiError = 'Terjadi kesalahan jaringan saat menyimpan rekening.';
    } finally {
      isLoading = false;
    }
  };

  const handleSetPrimary = async (accountId: string) => {
    try {
      const res = await fetch('/api/admin/bank-account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: accountId }),
      });
      if (res.ok) await fetchBankAccounts();
    } catch (err) {
      console.error('Failed to set primary bank account:', err);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      const res = await fetch(`/api/admin/bank-account?id=${accountId}`, {
        method: 'DELETE',
      });
      if (res.ok) await fetchBankAccounts();
    } catch (err) {
      console.error('Failed to delete bank account:', err);
    }
  };
</script>

<div class="space-y-4">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-bold text-main font-heading">Rekening Bank Pencairan Admin</h2>
        <span class="text-3xs font-mono font-bold px-2 py-0.5 rounded-full bg-orange/10 text-orange border border-orange/20">
          Maks. 3 Rekening
        </span>
      </div>
      <p class="text-xs text-secondary font-sans leading-relaxed">
        Daftarkan nomor rekening bank Anda untuk menerima komisi pendampingan UMKM. Anda dapat mendaftarkan hingga 3 rekening berbeda.
      </p>
    </div>
  </div>

  <div class="w-full">
    <DesignerBankCard
      bankAccount={bankAccounts.find((a) => a.id === selectedAccountId) || bankAccounts[0] || null}
      {bankAccounts}
      {selectedAccountId}
      {isLoading}
      showWithdrawSection={false}
      onOpenBankModal={openBankModal}
      onSetPrimary={handleSetPrimary}
      onDeleteAccount={handleDeleteAccount}
      onSelectAccount={(id) => (selectedAccountId = id)}
    />
  </div>

  <!-- Modal Tambah Rekening -->
  <DesignerBankModal
    showModal={showBankModal}
    bankAccount={null}
    bind:inputBankName
    bind:inputAccountNumber
    bind:inputHolderName
    {isLoading}
    {apiError}
    onSave={saveBankAccount}
    onClose={() => (showBankModal = false)}
  />
</div>
