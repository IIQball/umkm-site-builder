<script lang="ts">
  import { onMount } from 'svelte';
  import { formatIDR } from '@/lib/utils/format';

  export let balance: number;

  interface BankAccount {
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

  const popularBanks = ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB Niaga', 'Permata'];

  onMount(() => {
    const saved = localStorage.getItem('designer_bank_account');
    if (saved) {
      bankAccount = JSON.parse(saved);
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
    showBankModal = true;
  };

  const saveBankAccount = () => {
    if (!inputAccountNumber.trim() || !inputHolderName.trim()) {
      alert('Semua kolom wajib diisi!');
      return;
    }
    const newAccount: BankAccount = {
      bankName: inputBankName,
      accountNumber: inputAccountNumber.trim(),
      holderName: inputHolderName.trim()
    };
    localStorage.setItem('designer_bank_account', JSON.stringify(newAccount));
    bankAccount = newAccount;
    showBankModal = false;
  };

  const handleWithdraw = () => {
    const amountNum = parseInt(withdrawAmount.replace(/[^0-9]/g, ''));
    if (isNaN(amountNum) || amountNum <= 0) {
      withdrawError = 'Masukkan nominal penarikan yang valid.';
      return;
    }
    if (amountNum < 10000) {
      withdrawError = 'Minimum penarikan adalah Rp 10.000.';
      return;
    }
    if (amountNum > balance) {
      withdrawError = 'Saldo aktif tidak mencukupi.';
      return;
    }

    withdrawError = '';
    isWithdrawing = true;

    // Simulate API request
    setTimeout(() => {
      isWithdrawing = false;
      withdrawSuccess = true;
      balance = Math.max(0, balance - amountNum);
      
      // Dispatch custom local storage mutation simulation so ledger can read it if needed
      const mockMutation = {
        id: 'mut_' + Date.now(),
        amount: amountNum,
        balanceAfter: balance,
        type: 'DEBIT',
        description: `Penarikan dana ke ${bankAccount?.bankName} (${bankAccount?.accountNumber})`,
        referenceId: 'REF' + Math.floor(100000 + Math.random() * 900000),
        createdAt: new Date().toISOString()
      };
      
      // Save simulated withdrawal to storage for session persistence
      const savedMutations = JSON.parse(localStorage.getItem('designer_mock_mutations') || '[]');
      savedMutations.unshift(mockMutation);
      localStorage.setItem('designer_mock_mutations', JSON.stringify(savedMutations));
      
      // Dispatch custom event to let parent update mutations list
      window.dispatchEvent(new CustomEvent('designer_balance_updated', { detail: { balance, mutation: mockMutation } }));
    }, 1500);
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
    </div>

    <div class="mt-4 pt-3 border-t border-light flex gap-2">
      <button
        type="button"
        on:click={openBankModal}
        class="flex-1 text-[12px] font-bold text-main bg-nested hover:bg-nested/80 rounded-xl py-2 px-4 transition-colors"
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

      <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex justify-between items-center mt-3">
        <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Saldo Tersedia</span>
        <span class="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">{formatIDR(balance)}</span>
      </div>
    </div>

    <div class="mt-4 pt-3 border-t border-light">
      <button
        type="button"
        disabled={!bankAccount || balance < 10000}
        on:click={() => showWithdrawModal = true}
        class="w-full text-[12px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-nested disabled:text-muted rounded-xl py-2 px-4 transition-colors text-center"
      >
        {!bankAccount ? 'Hubungkan Rekening Terlebih Dahulu' : balance < 10000 ? 'Saldo Minimum Penarikan Kurang' : 'Tarik Dana'}
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
        <button type="button" on:click={() => showBankModal = false} class="text-muted hover:text-main flex items-center">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <div class="space-y-3">
        <div class="space-y-1">
          <label class="text-[10px] font-extrabold uppercase tracking-widest text-muted" for="select-bank">Nama Bank</label>
          <select
            id="select-bank"
            bind:value={inputBankName}
            class="w-full bg-nested border border-light rounded-xl px-3 py-2 text-xs text-main outline-none focus:border-indigo-500"
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
            class="w-full bg-nested border border-light rounded-xl px-3 py-2 text-xs text-main outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div class="space-y-1">
          <label class="text-[10px] font-extrabold uppercase tracking-widest text-muted" for="input-nama">Nama Pemilik Rekening</label>
          <input
            id="input-nama"
            type="text"
            placeholder="Nama lengkap sesuai tabungan"
            bind:value={inputHolderName}
            class="w-full bg-nested border border-light rounded-xl px-3 py-2 text-xs text-main outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div class="flex gap-2 pt-2">
        <button
          type="button"
          on:click={() => showBankModal = false}
          class="flex-1 text-[12px] font-bold text-secondary bg-nested hover:bg-nested/80 rounded-xl py-2 px-3 transition-colors border border-light"
        >
          Batal
        </button>
        <button
          type="button"
          on:click={saveBankAccount}
          class="flex-1 text-[12px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl py-2 px-3 transition-colors text-center"
        >
          Simpan Rekening
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

          <div class="bg-nested border border-light rounded-xl p-3 text-center space-y-0.5">
            <span class="text-[10px] font-bold text-muted">SALDO AKTIF</span>
            <p class="text-lg font-black text-main font-mono">{formatIDR(balance)}</p>
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
                on:click={() => withdrawAmount = String(Math.floor(balance * 0.5))}
                class="text-[10px] font-bold bg-nested border border-light text-secondary px-2.5 py-1 rounded-lg hover:bg-nested/80"
              >
                50%
              </button>
              <button
                type="button"
                on:click={() => withdrawAmount = String(balance)}
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
