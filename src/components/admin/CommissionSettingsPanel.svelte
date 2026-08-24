<script lang="ts">
  import { onMount } from 'svelte';
  import StatCard from '../ui/StatCard.svelte';

  export let initialFeePercentage: number = 30;

  let platformFeePercentage: number = initialFeePercentage;
  let settlementDelayDays: number = 7;
  let isLoading = false;

  let feedback: { message: string; type: 'success' | 'error' } | null = null;

  onMount(async () => {
    try {
      const res = await fetch('/api/admin/settings/commission');
      const result = await res.json();
      if (result.success && result.data) {
        if (result.data.platformFeePercentage !== undefined) {
          platformFeePercentage = Number(result.data.platformFeePercentage);
        }
        if (result.data.settlementDelayDays !== undefined) {
          settlementDelayDays = Number(result.data.settlementDelayDays);
        }
      }
    } catch {
      // Keep initial/default values
    }
  });

  const handleSave = async () => {
    if (platformFeePercentage < 0 || platformFeePercentage > 100) {
      feedback = { message: 'Persentase fee harus antara 0% hingga 100%', type: 'error' };
      return;
    }
    if (settlementDelayDays < 0) {
      feedback = { message: 'Durasi penahanan settlement tidak boleh negatif', type: 'error' };
      return;
    }

    isLoading = true;
    feedback = null;

    try {
      const res = await fetch('/api/admin/settings/commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platformFeePercentage: Number(platformFeePercentage),
          settlementDelayDays: Number(settlementDelayDays),
        }),
      });
      const result = await res.json();

      if (res.ok && (result.success || result.ok)) {
        feedback = { message: 'Pengaturan komisi platform berhasil disimpan!', type: 'success' };
      } else {
        feedback = {
          message: result.error?.message || 'Gagal menyimpan pengaturan komisi',
          type: 'error',
        };
      }
    } catch {
      feedback = { message: 'Terjadi kesalahan koneksi saat menyimpan', type: 'error' };
    } finally {
      isLoading = false;
    }
  };

  $: designerShare = Math.max(0, 100 - Number(platformFeePercentage || 0));
</script>

<div class="w-full space-y-6">
  <!-- Page Header -->
  <div>
    <h1 class="text-xl font-black text-main tracking-tight animate-fade-in">Pengaturan Komisi Platform</h1>
    <p class="text-sm text-secondary mt-1">Konfigurasi pembagian komisi otomatis antara platform dan desainer template</p>
  </div>

  <!-- Stat Cards Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <StatCard
      label="Fee Platform"
      value="{platformFeePercentage}%"
      icon="percent"
      iconCls="icon-wrapper-indigo"
      borderAccent="border-accent-primary"
    />
    <StatCard
      label="Bagian Desainer"
      value="{designerShare}%"
      icon="brush"
      iconCls="icon-wrapper-emerald"
      borderAccent="border-accent-success"
    />
    <StatCard
      label="Penahanan Dana"
      value="{settlementDelayDays} Hari"
      icon="hourglass_top"
      iconCls="icon-wrapper-amber"
      borderAccent="border-accent-warning"
    />
  </div>

  <!-- Alert Feedback -->
  {#if feedback}
    <div 
      class="alert text-xs rounded-xl flex items-center gap-2 px-4 py-3.5 border transition-all animate-fade-in shadow-sm {feedback.type === 'success' ? 'alert-success' : 'alert-error'}"
    >
      <span class="material-symbols-outlined text-[18px] flex-shrink-0">
        {feedback.type === 'success' ? 'check_circle' : 'error'}
      </span>
      <span class="font-medium">{feedback.message}</span>
    </div>
  {/if}

  <!-- Form Card -->
  <div class="bg-card rounded-2xl border border-light p-6 shadow-sm space-y-6">
    <div class="flex items-center gap-3 pb-4 border-b border-light">
      <div class="w-10 h-10 rounded-xl icon-wrapper-indigo flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-outlined text-xl">percent</span>
      </div>
      <div>
        <h2 class="font-bold text-sm text-main">Potongan Fee Platform</h2>
        <p class="text-xs text-muted mt-0.5">Diaplikasikan untuk seluruh transaksi penjualan template berbayar</p>
      </div>
    </div>

    <form on:submit|preventDefault={handleSave} class="space-y-6">
      <div class="form-control w-full">
        <label for="platformFeePercentage" class="block text-xs font-extrabold uppercase tracking-widest text-muted mb-2">
          Persentase Fee Platform
        </label>
        <div class="relative flex items-center">
          <input
            id="platformFeePercentage"
            type="number"
            min="0"
            max="100"
            step="1"
            bind:value={platformFeePercentage}
            disabled={isLoading}
            class="w-full px-4 py-2.5 bg-nested/40 text-main border border-light focus:border-primary rounded-xl text-sm font-semibold focus:outline-none transition-colors"
            placeholder="30"
          />
          <span class="absolute right-4 font-bold text-sm text-muted select-none">%</span>
        </div>
        <p class="text-xs text-muted leading-relaxed mt-2">
          Persentase potongan fee yang diambil platform dari setiap penjualan template berbayar. Sisa persentase (<strong class="text-primary font-bold">{designerShare}%</strong>) otomatis masuk ke dompet desainer.
        </p>
      </div>

      <!-- Settlement Delay Days Input -->
      <div class="form-control w-full">
        <label for="settlementDelayDays" class="block text-xs font-extrabold uppercase tracking-widest text-muted mb-2">
          Durasi Penahanan Settlement (Hari)
        </label>
        <div class="relative flex items-center">
          <input
            id="settlementDelayDays"
            type="number"
            min="0"
            step="1"
            bind:value={settlementDelayDays}
            disabled={isLoading}
            class="w-full px-4 py-2.5 bg-nested/40 text-main border border-light focus:border-primary rounded-xl text-sm font-semibold focus:outline-none transition-colors"
            placeholder="7"
          />
          <span class="absolute right-4 font-bold text-xs text-muted select-none">Hari</span>
        </div>
        <p class="text-xs text-muted leading-relaxed mt-2">
          Jumlah hari dana penjualan ditahan sebelum ditambahkan ke saldo aktif yang dapat ditarik oleh desainer.
        </p>
      </div>

      <div class="pt-2">
        <button
          type="submit"
          class="btn btn-primary text-sm font-bold rounded-xl px-5 py-2.5 transition-all min-w-[160px]"
          disabled={isLoading}
        >
          {#if isLoading}
            <span class="loading loading-spinner loading-xs flex-shrink-0"></span>
            <span>Menyimpan...</span>
          {:else}
            <span class="material-symbols-outlined text-[18px] flex-shrink-0 icon-filled">save</span>
            <span>Simpan Pengaturan</span>
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>
