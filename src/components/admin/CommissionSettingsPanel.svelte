<script lang="ts">
  import { onMount } from 'svelte';

  export let initialFeePercentage: number = 30;

  let platformFeePercentage: number = initialFeePercentage;
  let isLoading = false;

  let feedback: { message: string; type: 'success' | 'error' } | null = null;

  onMount(async () => {
    try {
      const res = await fetch('/api/admin/settings/commission');
      const result = await res.json();
      if (result.success && result.data?.platformFeePercentage !== undefined) {
        platformFeePercentage = Number(result.data.platformFeePercentage);
      }
    } catch {
      // Keep initialFeePercentage
    }
  });

  const handleSave = async () => {
    if (platformFeePercentage < 0 || platformFeePercentage > 100) {
      feedback = { message: 'Persentase fee harus antara 0% hingga 100%', type: 'error' };
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

<div class="max-w-2xl space-y-6">
  <!-- Page Header -->
  <div>
    <h1 class="text-2xl font-bold text-base-content tracking-tight">Pengaturan Komisi Platform</h1>
    <p class="text-xs text-base-content/60 mt-1">Konfigurasi pembagian komisi otomatis antara platform dan desainer template</p>
  </div>

  <!-- Alert Feedback -->
  {#if feedback}
    <div class="alert alert-{feedback.type === 'success' ? 'success' : 'error'} text-white shadow-md text-xs rounded-xl flex items-center gap-2">
      <span class="material-symbols-outlined text-[18px]">
        {feedback.type === 'success' ? 'check_circle' : 'error'}
      </span>
      <span>{feedback.message}</span>
    </div>
  {/if}

  <!-- Form Card -->
  <div class="bg-base-100 rounded-2xl border border-base-200 p-6 shadow-sm space-y-6">
    <div class="flex items-center gap-3 pb-4 border-b border-base-200">
      <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        <span class="material-symbols-outlined text-xl">percent</span>
      </div>
      <div>
        <h2 class="font-bold text-sm text-base-content">Potongan Fee Platform</h2>
        <p class="text-xs text-base-content/50">Diaplikasikan untuk seluruh transaksi penjualan template berbayar</p>
      </div>
    </div>

    <form on:submit|preventDefault={handleSave} class="space-y-4">
      <div class="form-control">
        <label for="platformFeePercentage" class="label text-xs font-semibold text-base-content">
          <span>Persentase Fee Platform</span>
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
            class="input input-bordered w-full pr-12 text-sm font-semibold rounded-xl focus:input-primary"
            placeholder="30"
          />
          <span class="absolute right-4 font-bold text-sm text-base-content/40 select-none">%</span>
        </div>
        <label for="platformFeePercentage" class="label">
          <span class="text-[11px] text-base-content/60 leading-relaxed">
            Persentase potongan fee yang diambil platform dari setiap penjualan template berbayar. Sisa persentase (<strong class="text-primary font-bold">{designerShare}%</strong>) otomatis masuk ke dompet desainer.
          </span>
        </label>
      </div>

      <!-- Preview Split breakdown card -->
      <div class="bg-base-200/50 rounded-xl p-4 border border-base-200 grid grid-cols-2 gap-4 text-center">
        <div class="space-y-1 border-r border-base-200 pr-2">
          <span class="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">Bagian Platform</span>
          <p class="text-lg font-black text-primary">{platformFeePercentage}%</p>
        </div>
        <div class="space-y-1 pl-2">
          <span class="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">Bagian Desainer</span>
          <p class="text-lg font-black text-emerald-600 dark:text-emerald-400">{designerShare}%</p>
        </div>
      </div>

      <div class="pt-2">
        <button
          type="submit"
          class="btn btn-primary w-full sm:w-auto rounded-xl gap-2 font-semibold text-xs min-w-[160px]"
          disabled={isLoading}
        >
          {#if isLoading}
            <span class="loading loading-spinner loading-xs"></span>
            <span>Menyimpan...</span>
          {:else}
            <span class="material-symbols-outlined text-[18px]">save</span>
            <span>Simpan Pengaturan</span>
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>
