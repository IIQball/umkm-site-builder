<script lang="ts">
  import { Building2, Pencil } from 'lucide-svelte';
  import { formatIDR } from '@/lib/utils/format';
  import { Button } from '@/components/ui';
  import type { BankAccount } from '@/types';

  export let bankAccount: BankAccount | null = null;
  export let isLoading: boolean = false;
  export let balance: number = 0;
  export let availableBalance: number = 0;
  export let minPayoutLimit: number = 50000;
  export let settlementDelayDays: number = 7;
  export let onOpenBankModal: () => void;
  export let onOpenWithdrawModal: () => void;

  $: resolvedHolderName = (
    bankAccount?.accountHolder ||
    bankAccount?.holderName ||
    (bankAccount as any)?.accountHolderName ||
    (bankAccount as any)?.userName ||
    'Belum Diatur'
  ).toUpperCase();
</script>

<div class="mb-6">
  {#if isLoading && !bankAccount}
    <div class="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center animate-pulse space-y-4 shadow-xl">
      <div class="h-8 bg-slate-900 rounded-xl w-1/4 mx-auto"></div>
      <div class="h-6 bg-slate-900 rounded-lg w-1/2 mx-auto"></div>
      <div class="h-12 bg-slate-900 rounded-2xl w-1/3 mx-auto mt-4"></div>
    </div>
  {:else if bankAccount}
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-orange/30 p-6 sm:p-8 text-white shadow-2xl shadow-black/30 group hover:border-orange/50 transition-all duration-300">
      <div class="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-orange/20 blur-3xl pointer-events-none"></div>
      <div class="absolute -left-12 -bottom-12 w-52 h-52 rounded-full bg-orange/10 blur-2xl pointer-events-none"></div>
      <div class="absolute inset-0 bg-[radial-gradient(theme(colors.orange.DEFAULT)_1px,transparent_1px)] [background-size:18px_18px] opacity-10 pointer-events-none"></div>

      <div class="relative z-10">
        <!-- Top Row -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 border border-amber-300/60 shadow-sm relative overflow-hidden flex items-center justify-center flex-shrink-0">
              <div class="w-full h-full border border-amber-900/30 rounded-[3px] grid grid-cols-2 gap-0.5 opacity-70">
                <div class="border-r border-b border-amber-900/40"></div>
                <div class="border-b border-amber-900/40"></div>
                <div class="border-r border-amber-900/40"></div>
                <div></div>
              </div>
            </div>

            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white/60">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1.5-2.5" />
              <path d="M5.5 17.5A6.5 6.5 0 0 0 12 11c0-3.59-1.5-5.5-4-6.5" />
              <path d="M2.5 20.5A10.5 10.5 0 0 0 13 10c0-5.8-2.5-9-6.5-10.5" />
            </svg>
          </div>

          <div class="flex items-center gap-2.5">
            <div class="inline-flex items-center gap-1.5 bg-orange/20 border border-orange/35 text-white px-3.5 py-1.5 rounded-full text-xs font-black font-mono uppercase tracking-wider backdrop-blur-md">
              <span class="w-2 h-2 rounded-full bg-orange animate-pulse"></span>
              <span>{bankAccount.bankName}</span>
            </div>

            <button
              type="button"
              class="px-3 py-1.5 rounded-full text-xs font-semibold text-white border border-white/40 hover:border-white bg-white/10 hover:bg-white/20 backdrop-blur-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="Ganti Rekening Bank"
              on:click={onOpenBankModal}
            >
              <Pencil size={12} class="text-white" />
              <span>Ganti Rekening</span>
            </button>
          </div>
        </div>

        <!-- Middle Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mb-8">
          <div>
            <span class="text-[10px] text-white/50 font-bold uppercase tracking-widest font-heading block mb-1">
              Nomor Rekening Terdaftar
            </span>
            <p class="font-mono text-xl sm:text-2xl font-black tracking-widest text-white drop-shadow-sm">
              •••• &nbsp;•••• &nbsp;•••• &nbsp;<span class="text-orange-light font-black">{bankAccount.accountNumber.length > 4 ? bankAccount.accountNumber.slice(-4) : bankAccount.accountNumber}</span>
            </p>
          </div>

          <div class="flex items-end justify-between sm:justify-end gap-4">
            <div class="space-y-0.5 min-w-0 sm:text-right">
              <span class="text-[10px] text-white/50 uppercase tracking-widest font-bold font-heading block">
                Pemilik Rekening
              </span>
              <p class="text-xs sm:text-sm font-bold text-white uppercase truncate font-mono tracking-wide">
                {resolvedHolderName}
              </p>
            </div>

            <div class="flex items-center -space-x-2.5 opacity-90 flex-shrink-0">
              <div class="w-7 h-7 rounded-full bg-orange shadow-xs"></div>
              <div class="w-7 h-7 rounded-full bg-amber-400/90 backdrop-blur-xs shadow-xs"></div>
            </div>
          </div>
        </div>

        <!-- Lower Tray -->
        <div class="pt-5 border-t border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-5 bg-black/40 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-5 sm:p-7 rounded-b-3xl backdrop-blur-md">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-white/80 font-heading">
                Saldo Siap Dicairkan
              </span>
              <span class="text-3xs font-mono text-white/60 bg-white/10 border border-white/10 px-2 py-0.5 rounded-full">
                Min: {formatIDR(minPayoutLimit)}
              </span>
            </div>

            <p class="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight leading-none">
              {formatIDR(availableBalance)}
            </p>

            <p class="text-2xs text-white/60 font-sans mt-1">
              {#if availableBalance >= minPayoutLimit}
                Saldo memenuhi batas penarikan dan siap ditransfer
              {:else if availableBalance > 0}
                Belum mencapai batas minimum penarikan ({formatIDR(minPayoutLimit)})
              {:else}
                Tidak ada saldo siap tarik saat ini
              {/if}
            </p>

            {#if availableBalance === 0 && balance > 0}
              <p class="text-2xs text-amber-300/90 font-medium">
                * Saldo <strong>{formatIDR(balance)}</strong> dalam masa hold ({settlementDelayDays} hari) dan akan aktif otomatis.
              </p>
            {/if}
          </div>

          <div class="flex-shrink-0">
            <Button
              variant="orange"
              size="md"
              className="w-full sm:w-auto shadow-lg shadow-orange-500/25 px-6 font-bold"
              disabled={!bankAccount || availableBalance < minPayoutLimit || isLoading}
              on:click={onOpenWithdrawModal}
            >
              <span class="material-symbols-outlined text-lg">payments</span>
              <span>
                {#if availableBalance >= minPayoutLimit}
                  Tarik {formatIDR(availableBalance)}
                {:else}
                  Tarik Dana ke Bank
                {/if}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-dashed border-orange/35 p-8 text-center text-white shadow-xl flex flex-col items-center justify-center">
      <div class="w-14 h-14 rounded-2xl bg-orange/15 border border-orange/30 text-orange flex items-center justify-center mb-3 shadow-xs">
        <Building2 size={26} />
      </div>
      <h3 class="text-lg font-bold text-white font-heading">Hubungkan Rekening Bank Tujuan</h3>
      <p class="text-xs text-slate-300 mt-1 max-w-md leading-relaxed font-sans">
        Daftarkan nomor rekening bank di Indonesia untuk menerima pencairan komisi penjualan template secara instan.
      </p>
      <div class="mt-5">
        <Button
          variant="orange"
          size="md"
          className="shadow-lg shadow-orange-500/25 px-6 font-bold"
          on:click={onOpenBankModal}
        >
          <span class="material-symbols-outlined text-lg">add_link</span>
          <span>Hubungkan Rekening Sekarang</span>
        </Button>
      </div>
    </div>
  {/if}
</div>
