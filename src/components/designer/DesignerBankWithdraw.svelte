<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { formatIDR } from '@/lib/utils/format';

  export let balance: number;
  export let availableBalance: number;
  export let settlementDelayDays = 7;

  interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    holderName: string;
  }

  let bankAccount: BankAccount | null = null;
  let showBankModal = false;
  let showWithdrawModal = false;

  // Form fields for Bank Account
  let inputBankName = 'BCA';
  let inputAccountNumber = '';
  let inputHolderName = '';

  // Form fields for Withdrawal
  let withdrawAmount = '';
  let withdrawError = '';
  let isWithdrawing = false;
  let withdrawSuccess = false;

  // Global loading/error state
  let isLoading = false;
  let apiError = '';

  const popularBanks = ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB Niaga', 'Permata'];

  // Payout request history
  let payoutHistory: Array<{
    id: string;
    amount: number;
    status: string;
    gatewayMessage: string | null;
    xenditPayoutId?: string | null;
    gatewayReference?: string | null;
    createdAt: string;
    bankAccount?: {
      bankName: string;
      accountNumber: string;
      accountHolder: string;
    };
  }> = [];
  let isLoadingPayouts = false;
  let minPayoutLimit = 50000;

  async function fetchPayoutHistory() {
    isLoadingPayouts = true;
    try {
      const res = await fetch('/api/designer/payout');
      const result = await res.json();
      if (result.success && result.data) {
        payoutHistory = result.data.payouts || [];
        minPayoutLimit = result.data.minPayoutLimit || 50000;
      }
    } catch (err) {
      console.error('Failed to fetch payout history:', err);
    } finally {
      isLoadingPayouts = false;
    }
  }

  let pollingInterval: any = null;

  async function pollStatus() {
    try {
      const res = await fetch('/api/designer/payout/status');
      const result = await res.json();
      if (res.ok && result.success && result.data) {
        payoutHistory = result.data.payouts || [];
        if (result.data.wallet) {
          balance = Number(result.data.wallet.balance);
          availableBalance = Number(result.data.wallet.availableBalance);
        }

        const stillProcessing = payoutHistory.some(p => p.status.toLowerCase() === 'processing');
        if (!stillProcessing) {
          stopPolling();
        }
      }
    } catch (err) {
      console.error('Error during status polling:', err);
    }
  }

  function checkAndStartPolling() {
    if (typeof window === 'undefined') return;
    const hasProcessing = payoutHistory.some(p => p.status.toLowerCase() === 'processing');
    if (hasProcessing) {
      if (!pollingInterval) {
        pollingInterval = setInterval(pollStatus, 4000);
      }
    } else {
      stopPolling();
    }
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  $: {
    if (payoutHistory) {
      checkAndStartPolling();
    }
  }

  onDestroy(() => {
    stopPolling();
  });

  onMount(async () => {
    isLoading = true;
    apiError = '';
    try {
      const res = await fetch('/api/designer/bank-account');
      const result = await res.json();
      if (result.success && result.data) {
        bankAccount = {
          id: result.data.id,
          bankName: result.data.bankName,
          accountNumber: result.data.accountNumber,
          holderName: result.data.accountHolder
        };
      }
      await fetchPayoutHistory();
    } catch (err) {
      apiError = 'Gagal memuat data rekening bank';
    } finally {
      isLoading = false;
    }
  });

  const openBankModal = () => {
    if (bankAccount) {
      inputBankName = bankAccount.bankName;
      inputAccountNumber = bankAccount.accountNumber;
      inputHolderName = bankAccount.holderName;
    } else {
      inputBankName = 'BCA';
      inputAccountNumber = '';
      inputHolderName = '';
    }
    apiError = '';
    showBankModal = true;
  };

  const saveBankAccount = async () => {
    if (!inputAccountNumber.trim() || !inputHolderName.trim()) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    isLoading = true;
    apiError = '';

    try {
      const res = await fetch('/api/designer/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: inputBankName,
          accountNumber: inputAccountNumber.trim(),
          accountHolder: inputHolderName.trim()
        })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        bankAccount = {
          id: result.data.id,
          bankName: result.data.bankName,
          accountNumber: result.data.accountNumber,
          holderName: result.data.accountHolder
        };
        showBankModal = false;
      } else {
        apiError = result.error?.message || 'Gagal menyimpan rekening bank';
        alert(apiError);
      }
    } catch (err) {
      apiError = 'Terjadi kesalahan koneksi saat menyimpan';
      alert(apiError);
    } finally {
      isLoading = false;
    }
  };

  const handleWithdraw = async () => {
    const amountNum = parseInt(withdrawAmount.replace(/[^0-9]/g, ''));
    if (isNaN(amountNum) || amountNum <= 0) {
      withdrawError = 'Masukkan nominal penarikan yang valid.';
      return;
    }
    if (amountNum < minPayoutLimit) {
      withdrawError = `Minimum penarikan adalah Rp ${minPayoutLimit.toLocaleString('id-ID')}.`;
      return;
    }
    if (amountNum > availableBalance) {
      withdrawError = 'Saldo tersedia tidak mencukupi.';
      return;
    }
    if (!bankAccount?.id) {
      withdrawError = 'Rekening bank tujuan belum diatur.';
      return;
    }

    withdrawError = '';
    isWithdrawing = true;

    try {
      const res = await fetch('/api/designer/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountNum,
          bankAccountId: bankAccount.id
        })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        isWithdrawing = false;
        withdrawSuccess = true;
        
        balance = Math.max(0, balance - amountNum);
        availableBalance = Math.max(0, availableBalance - amountNum);
        
        const mockMutation = {
          id: result.data.id,
          amount: amountNum,
          balanceAfter: balance,
          type: 'DEBIT' as const,
          description: `Penarikan dana ke ${bankAccount.bankName} (${bankAccount.accountNumber})`,
          referenceId: result.data.id,
          createdAt: result.data.createdAt
        };
        
        window.dispatchEvent(new CustomEvent('designer_balance_updated', {
          detail: {
            balance,
            availableBalance,
            mutation: mockMutation
          }
        }));

        await fetchPayoutHistory();
      } else {
        withdrawError = result.error?.message || 'Gagal mengajukan penarikan dana.';
      }
    } catch (err) {
      withdrawError = 'Terjadi kesalahan koneksi saat memproses penarikan.';
    } finally {
      isWithdrawing = false;
    }
  };

  const closeWithdrawModal = () => {
    showWithdrawModal = false;
    withdrawSuccess = false;
    withdrawAmount = '';
    withdrawError = '';
  };
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
  <!-- Bank Account Settings Card -->
  <div class="bg-card border border-light rounded-2xl p-6 shadow-sm flex flex-col justify-between">
    <div>
      <div class="flex items-center gap-2 mb-3">
        <div class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <span class="material-symbols-outlined text-[18px] text-indigo-600 dark:text-indigo-400">account_balance</span>
        </div>
        <h3 class="text-[13px] font-bold text-main">Rekening Bank Tujuan</h3>
      </div>
      
      {#if isLoading && !bankAccount}
        <div class="bg-nested border border-dashed border-light rounded-xl p-5 text-center my-2 animate-pulse space-y-2">
          <div class="h-4 bg-nested rounded w-1/3 mx-auto"></div>
          <div class="h-3 bg-nested rounded w-1/2 mx-auto"></div>
        </div>
      {:else}
        {#if bankAccount}
          <div class="bg-nested border border-light rounded-xl p-4 space-y-2 mt-2">
            <div class="flex justify-between items-center">
              <span class="text-[11px] font-extrabold uppercase tracking-widest text-muted">Bank</span>
              <span class="text-xs font-bold text-main">{bankAccount.bankName}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[11px] font-extrabold uppercase tracking-widest text-muted">Nomor Rekening</span>
              <span class="text-xs font-semibold text-main font-mono">{bankAccount.accountNumber}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[11px] font-extrabold uppercase tracking-widest text-muted">Nama Pemilik</span>
              <span class="text-xs font-semibold text-main">{bankAccount.holderName}</span>
            </div>
          </div>
        {:else}
          <div class="bg-amber-500/10 border border-dashed border-amber-500/20 rounded-xl p-5 text-center my-2">
            <span class="material-symbols-outlined text-amber-500 text-[24px] mb-1">warning_amber</span>
            <p class="text-[11px] font-medium text-amber-600 dark:text-amber-400">Belum ada rekening bank terhubung.</p>
            <p class="text-[10px] text-amber-500/80 mt-0.5">Hubungkan rekening terlebih dahulu untuk melakukan penarikan dana.</p>
          </div>
        {/if}
      {/if}
    </div>

    <div class="mt-4 pt-3 border-t border-light flex gap-2">
      <button
        type="button"
        on:click={openBankModal}
        disabled={isLoading}
        class="flex-1 text-[12px] font-bold text-main bg-nested hover:bg-nested/80 rounded-xl py-2 px-4 transition-colors disabled:opacity-50"
      >
        {bankAccount ? 'Ganti Rekening' : 'Hubungkan Rekening'}
      </button>
    </div>
  </div>

  <!-- Withdraw Funds Card -->
  <div class="bg-card border border-light rounded-2xl p-6 shadow-sm flex flex-col justify-between">
    <div>
      <div class="flex items-center gap-2 mb-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <span class="material-symbols-outlined text-[18px] text-emerald-600 dark:text-emerald-400">output</span>
        </div>
        <h3 class="text-[13px] font-bold text-main">Tarik Dana Ke Rekening</h3>
      </div>
      
      <p class="text-[12px] text-secondary leading-relaxed my-2">
        Tarik akumulasi saldo hasil penjualan template langsung ke rekening bank terdaftar Anda. Proses transfer memakan waktu maksimal 1-2 hari kerja.
      </p>

      {#if availableBalance === 0 && balance > 0}
        <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex justify-between items-center mt-3 mb-2">
          <span class="text-[11px] font-bold text-amber-600 dark:text-amber-400">Saldo Mengendap</span>
          <span class="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">{formatIDR(balance)}</span>
        </div>
      {/if}

      <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex justify-between items-center mt-3">
        <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Saldo Tersedia</span>
        <span class="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">{formatIDR(availableBalance)}</span>
      </div>

      {#if availableBalance === 0 && balance > 0}
        <div class="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-2">
          <span class="material-symbols-outlined text-blue-500 text-[18px] flex-shrink-0">info</span>
          <p class="text-[10px] text-blue-600 dark:text-blue-400 leading-normal mb-0">
            Dana Anda sebesar {formatIDR(balance)} sedang dalam masa penahanan (settlement hold {settlementDelayDays} hari) dan akan otomatis masuk ke Saldo Tersedia setelah masa hold selesai.
          </p>
        </div>
      {/if}
    </div>

    <div class="mt-4 pt-3 border-t border-light">
      <button
        type="button"
        disabled={!bankAccount || availableBalance < minPayoutLimit || isLoading}
        on:click={() => showWithdrawModal = true}
        class="w-full text-[12px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-nested disabled:text-muted rounded-xl py-2 px-4 transition-colors text-center"
      >
        {#if !bankAccount}
          Hubungkan Rekening Terlebih Dahulu
        {:else if availableBalance === 0 && balance > 0}
          {balance >= minPayoutLimit ? 'Menunggu Masa Settlement' : 'Saldo Minimum Penarikan Kurang'}
        {:else if availableBalance < minPayoutLimit}
          Saldo Minimum Penarikan Kurang
        {:else}
          Tarik Dana
        {/if}
      </button>
    </div>
  </div>
</div>

<!-- Modal: Link/Change Bank Account -->
{#if showBankModal}
  <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-card border border-light rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
      <div class="flex justify-between items-center pb-2 border-b border-light">
        <h3 class="text-sm font-bold text-main">{bankAccount ? 'Ganti Rekening Bank' : 'Hubungkan Rekening Bank'}</h3>
        <button type="button" on:click={() => showBankModal = false} disabled={isLoading} class="text-muted hover:text-main flex items-center disabled:opacity-50">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <div class="space-y-3">
        <div class="space-y-1">
          <label class="text-[10px] font-extrabold uppercase tracking-widest text-muted" for="select-bank">Nama Bank</label>
          <select
            id="select-bank"
            bind:value={inputBankName}
            disabled={isLoading}
            class="w-full bg-nested border border-light rounded-xl px-3 py-2 text-xs text-main outline-none focus:border-indigo-500 disabled:opacity-50"
          >
            {#each popularBanks as bank}
              <option value={bank}>{bank}</option>
            {/each}
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] font-extrabold uppercase tracking-widest text-muted" for="input-norek">Nomor Rekening</label>
          <input
            id="input-norek"
            type="text"
            placeholder="Contoh: 7128391829"
            bind:value={inputAccountNumber}
            disabled={isLoading}
            class="w-full bg-nested border border-light rounded-xl px-3 py-2 text-xs text-main outline-none focus:border-indigo-500 font-mono disabled:opacity-50"
          />
        </div>

        <div class="space-y-1">
          <label class="text-[10px] font-extrabold uppercase tracking-widest text-muted" for="input-nama">Nama Pemilik Rekening</label>
          <input
            id="input-nama"
            type="text"
            placeholder="Nama lengkap sesuai tabungan"
            bind:value={inputHolderName}
            disabled={isLoading}
            class="w-full bg-nested border border-light rounded-xl px-3 py-2 text-xs text-main outline-none focus:border-indigo-500 disabled:opacity-50"
          />
        </div>
        
        {#if apiError}
          <div class="text-[11px] font-semibold text-rose-500 pt-1">{apiError}</div>
        {/if}
      </div>

      <div class="flex gap-2 pt-2">
        <button
          type="button"
          on:click={() => showBankModal = false}
          disabled={isLoading}
          class="flex-1 text-[12px] font-bold text-secondary bg-nested hover:bg-nested/80 rounded-xl py-2 px-3 transition-colors border border-light disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="button"
          on:click={saveBankAccount}
          disabled={isLoading}
          class="flex-1 text-[12px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl py-2 px-3 transition-colors text-center flex items-center justify-center gap-1.5"
        >
          {#if isLoading}
            <span class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Menyimpan...
          {:else}
            Simpan Rekening
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Modal: Withdraw Money -->
{#if showWithdrawModal}
  <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-card border border-light rounded-2xl p-6 max-w-sm w-full shadow-2xl">
      {#if withdrawSuccess}
        <div class="text-center py-6 space-y-4">
          <div class="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-[24px]">done</span>
          </div>
          <div class="space-y-1">
            <h4 class="text-sm font-bold text-main">Permintaan Penarikan Dikirim</h4>
            <p class="text-[11px] text-secondary px-4">
              Dana sedang diproses dan akan masuk ke rekening {bankAccount?.bankName} ({bankAccount?.accountNumber}) Anda dalam 1-2 hari kerja.
            </p>
          </div>
          <button
            type="button"
            on:click={closeWithdrawModal}
            class="text-[12px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl py-2 px-6 transition-colors"
          >
            Selesai
          </button>
        </div>
      {:else}
        <div class="space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-light">
            <h3 class="text-sm font-bold text-main">Tarik Dana</h3>
            <button type="button" on:click={closeWithdrawModal} class="text-muted hover:text-main flex items-center">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-3 bg-nested border border-light rounded-xl p-3 text-center">
            <div class="space-y-0.5">
              <span class="text-[9px] font-bold text-muted uppercase">Saldo Aktif</span>
              <p class="text-xs font-black text-main font-mono">{formatIDR(balance)}</p>
            </div>
            <div class="space-y-0.5 border-l border-light">
              <span class="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Siap Tarik</span>
              <p class="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">{formatIDR(availableBalance)}</p>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-muted" for="input-amount">Nominal Penarikan</label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-xs font-bold text-muted">Rp</span>
              <input
                id="input-amount"
                type="number"
                placeholder="0"
                bind:value={withdrawAmount}
                disabled={isWithdrawing}
                class="w-full bg-nested border border-light rounded-xl pl-9 pr-3 py-2.5 text-xs text-main font-mono outline-none focus:border-indigo-500 font-bold"
              />
            </div>
            
            <div class="flex gap-1.5 pt-1.5">
              <button
                type="button"
                on:click={() => withdrawAmount = String(Math.floor(availableBalance * 0.5))}
                class="text-[10px] font-bold bg-nested border border-light text-secondary px-2.5 py-1 rounded-lg hover:bg-nested/80"
              >
                50%
              </button>
              <button
                type="button"
                on:click={() => withdrawAmount = String(availableBalance)}
                class="text-[10px] font-bold bg-nested border border-light text-secondary px-2.5 py-1 rounded-lg hover:bg-nested/80"
              >
                100%
              </button>
            </div>
            
            {#if withdrawError}
              <p class="text-[10px] font-semibold text-rose-500 mt-1">{withdrawError}</p>
            {/if}
          </div>

          <div class="flex gap-2 pt-2">
            <button
              type="button"
              on:click={closeWithdrawModal}
              disabled={isWithdrawing}
              class="flex-1 text-[12px] font-bold text-secondary bg-nested hover:bg-nested/80 rounded-xl py-2 px-3 transition-colors border border-light"
            >
              Batal
            </button>
            <button
              type="button"
              on:click={handleWithdraw}
              disabled={isWithdrawing}
              class="flex-1 text-[12px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl py-2 px-3 transition-colors text-center flex items-center justify-center gap-1.5"
            >
              {#if isWithdrawing}
                <span class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Memproses...
              {:else}
                Konfirmasi
              {/if}
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- Riwayat Penarikan Dana -->
<div class="bg-card border border-light rounded-2xl p-6 shadow-sm space-y-4 mt-5">
  <div class="flex items-center justify-between border-b border-light pb-3">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
        <span class="material-symbols-outlined text-[18px] text-indigo-600 dark:text-indigo-400">history</span>
      </div>
      <h3 class="text-[13px] font-bold text-main">Riwayat Penarikan Dana</h3>
    </div>
  </div>

  {#if isLoadingPayouts}
    <div class="space-y-3">
      <div class="h-10 bg-nested rounded-xl animate-pulse"></div>
      <div class="h-10 bg-nested rounded-xl animate-pulse"></div>
    </div>
  {:else}
    {#if payoutHistory.length === 0}
      <div class="text-center py-8 text-secondary">
        <span class="material-symbols-outlined text-[32px] text-muted mb-1">receipt_long</span>
        <p class="text-[12px]">Belum ada riwayat penarikan dana.</p>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-light text-muted uppercase tracking-wider text-[10px]">
              <th class="py-2.5 font-extrabold">Tanggal</th>
              <th class="py-2.5 font-extrabold">Nominal</th>
              <th class="py-2.5 font-extrabold">Status</th>
              <th class="py-2.5 font-extrabold">Keterangan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-light">
            {#each payoutHistory as payout}
              <tr>
                <td class="py-3 text-main font-mono">
                  {new Date(payout.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td class="py-3 text-main font-bold font-mono">{formatIDR(payout.amount)}</td>
                <td class="py-3">
                  {#if payout.status === 'processing'}
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 animate-pulse">
                      <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping flex-shrink-0"></span>
                      Processing
                    </span>
                  {:else if payout.status === 'completed'}
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/25">
                      Completed
                    </span>
                  {:else if payout.status === 'rejected'}
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/25">
                      Rejected
                    </span>
                  {:else}
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/25">
                      {payout.status}
                    </span>
                  {/if}
                </td>
                <td class="py-3 text-secondary">
                  <div class="truncate max-w-[200px]">
                    {payout.gatewayMessage || (payout.status === 'processing' ? 'Sedang diproses oleh platform' : payout.status === 'completed' ? 'Dana berhasil ditransfer' : 'Penarikan ditolak')}
                  </div>
                  {#if payout.xenditPayoutId || payout.gatewayReference}
                    <div class="text-[9px] text-muted font-mono mt-0.5 whitespace-nowrap">
                      {#if payout.xenditPayoutId}
                        ID: {payout.xenditPayoutId}
                      {/if}
                      {#if payout.xenditPayoutId && payout.gatewayReference}
                        <span class="mx-1">|</span>
                      {/if}
                      {#if payout.gatewayReference}
                        Ref: {payout.gatewayReference}
                      {/if}
                    </div>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  {/if}
</div>
