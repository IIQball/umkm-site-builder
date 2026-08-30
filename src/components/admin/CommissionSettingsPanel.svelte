<script lang="ts">
  import { onMount } from 'svelte';
  import StatCard from '../ui/StatCard.svelte';
  import { Card, Input, Button } from '@/components/ui';
  import { formatCurrency } from '@/lib/utils';
  import { addToast } from '@/lib/toast';

  export let initialFeePercentage: number = 30;
  export let initialSettlementDelayDays: number = 7;

  let platformFeePercentage: number = initialFeePercentage;
  let settlementDelayDays: number = initialSettlementDelayDays;
  let isLoading = false;

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
      addToast({
        type: 'error',
        message: 'Persentase fee harus antara 0% hingga 100%',
      });
      return;
    }
    if (settlementDelayDays < 0) {
      addToast({
        type: 'error',
        message: 'Durasi penahanan settlement tidak boleh negatif',
      });
      return;
    }

    isLoading = true;

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
        addToast({
          type: 'success',
          message: 'Pengaturan komisi & settlement platform berhasil disimpan!',
        });
      } else {
        addToast({
          type: 'error',
          message: result.error?.message || 'Gagal menyimpan pengaturan komisi',
        });
      }
    } catch {
      addToast({
        type: 'error',
        message: 'Terjadi kesalahan koneksi saat menyimpan',
      });
    } finally {
      isLoading = false;
    }
  };

  $: designerShare = Math.max(0, 100 - Number(platformFeePercentage || 0));
  $: samplePrice = 100000;
  $: samplePlatformFee = Math.round((samplePrice * Number(platformFeePercentage || 0)) / 100);
  $: sampleDesignerShare = samplePrice - samplePlatformFee;
</script>

<div class="w-full space-y-8 md:space-y-10">
  <!-- Page Header (matching designer/wallet & designer/templates style) -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
    <div>
      <h1 class="text-heading-lg text-main font-bold tracking-tight flex items-center gap-2.5">
        <span>Pengaturan Platform & Komisi</span>
      </h1>
      <p class="text-body-base text-secondary mt-1 max-w-2xl leading-relaxed">
        Kelola parameter pembagian hasil penjualan template otomatis antara kas platform dan dompet desainer.
      </p>
    </div>

    <!-- Quick Action / Link -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <Button
        href="/admin/users"
        variant="secondary"
        size="md"
        className="font-bold"
      >
        <span class="material-symbols-outlined text-primary text-base">group</span>
        <span>Manajemen Pengguna</span>
      </Button>
    </div>
  </div>

  <!-- Stat Cards Grid (animated on client load) -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <StatCard
      label="Fee Platform"
      value="{platformFeePercentage}%"
      rawValue={platformFeePercentage}
      icon="percent"
      cardTheme="dark"
      badge="Kas SaaS"
      footerText="Potongan otomatis per transaksi"
      delayClass="delay-100"
    />
    <StatCard
      label="Bagian Desainer"
      value="{designerShare}%"
      rawValue={designerShare}
      icon="brush"
      cardTheme="default"
      badge="Hak Desainer"
      footerText="Masuk langsung ke dompet kreator"
      delayClass="delay-150"
    />
    <StatCard
      label="Penahanan Settlement"
      value="{settlementDelayDays} Hari"
      rawValue={settlementDelayDays}
      icon="hourglass_top"
      cardTheme="orange"
      badge="Proteksi Fraud"
      footerText="Jeda saldo sebelum dapat ditarik"
      delayClass="delay-200"
    />
  </div>

  <!-- Settings Configuration Card -->
  <div class="animate-fade-in-up delay-300">
    <Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden">
      <!-- Header inside Card -->
      <div class="p-5 sm:p-6 border-b border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <span class="material-symbols-outlined text-lg">tune</span>
          </div>
          <div>
            <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
              Parameter Finansial & Bagi Hasil
            </h3>
            <p class="text-body-sm text-secondary mt-0.5 font-sans">
              Konfigurasi nilai persentase potongan transaksi dan kebijakan penahanan dana
            </p>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="p-6 md:p-8">
        <form on:submit|preventDefault={handleSave} class="space-y-8 w-full">
          <!-- Split Ratio Visual Gauge -->
          <div class="p-6 rounded-3xl bg-nested/70 border border-light space-y-4 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold font-heading uppercase tracking-wider text-muted">
                Rasio Pembagian Komisi
              </span>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  on:click={() => (platformFeePercentage = 20)}
                  class="px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer {platformFeePercentage === 20 ? 'bg-card text-main border-slate-400 dark:border-slate-500 shadow-2xs' : 'bg-card text-secondary border-light hover:text-main'}"
                >
                  20% / 80%
                </button>
                <button
                  type="button"
                  on:click={() => (platformFeePercentage = 30)}
                  class="px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer {platformFeePercentage === 30 ? 'bg-card text-main border-slate-400 dark:border-slate-500 shadow-2xs' : 'bg-card text-secondary border-light hover:text-main'}"
                >
                  30% / 70% (Standar)
                </button>
                <button
                  type="button"
                  on:click={() => (platformFeePercentage = 40)}
                  class="px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer {platformFeePercentage === 40 ? 'bg-card text-main border-slate-400 dark:border-slate-500 shadow-2xs' : 'bg-card text-secondary border-light hover:text-main'}"
                >
                  40% / 60%
                </button>
              </div>
            </div>

            <!-- Progress Bar Barcode -->
            <div class="h-3.5 w-full bg-nested border border-light rounded-full overflow-hidden flex shadow-inner">
              <div
                class="bg-primary h-full transition-all duration-300 relative group"
                style="width: {platformFeePercentage}%"
              ></div>
              <div
                class="bg-emerald-500 h-full transition-all duration-300 relative group"
                style="width: {designerShare}%"
              ></div>
            </div>

            <div class="flex items-center justify-between text-xs font-bold font-heading pt-1">
              <span class="text-primary flex items-center gap-1.5 font-sans">
                <span class="w-2 h-2 rounded-full bg-primary"></span>
                Fee Platform: {platformFeePercentage}%
              </span>
              <span class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-sans">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                Hak Desainer: {designerShare}%
              </span>
            </div>

            <!-- Simulation Calculation Box -->
            <div class="pt-3 text-xs text-secondary flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-light/60 font-sans">
              <span>Simulasi penjualan template <strong>{formatCurrency(samplePrice)}</strong>:</span>
              <div class="flex items-center gap-3 font-mono font-bold">
                <span class="text-primary">Platform: {formatCurrency(samplePlatformFee)}</span>
                <span class="text-muted">•</span>
                <span class="text-emerald-600 dark:text-emerald-400">Desainer: {formatCurrency(sampleDesignerShare)}</span>
              </div>
            </div>
          </div>

          <!-- Input Fields Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Platform Fee -->
            <div class="p-6 rounded-3xl bg-card border border-light space-y-3 shadow-2xs">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span class="material-symbols-outlined text-sm">percent</span>
                </div>
                <span class="text-xs font-bold text-main font-heading">Potongan Fee Platform</span>
              </div>

              <Input
                id="platformFeePercentage"
                type="number"
                min="0"
                max="100"
                step="1"
                placeholder="30"
                bind:value={platformFeePercentage}
                disabled={isLoading}
                className="font-bold text-sm"
                helper="Persentase potongan kas SaaS dari setiap penjualan."
              >
                <span slot="suffix" class="font-bold text-sm text-muted select-none">%</span>
              </Input>

              <!-- Slider control -->
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                bind:value={platformFeePercentage}
                disabled={isLoading}
                class="w-full accent-primary cursor-pointer h-2 bg-nested rounded-lg"
              />
            </div>

            <!-- Settlement Delay -->
            <div class="p-6 rounded-3xl bg-card border border-light space-y-3 shadow-2xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-orange/15 text-orange flex items-center justify-center">
                    <span class="material-symbols-outlined text-sm">hourglass_top</span>
                  </div>
                  <span class="text-xs font-bold text-main font-heading">Penahanan Settlement</span>
                </div>
                <!-- Presets -->
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    on:click={() => (settlementDelayDays = 3)}
                    class="px-2.5 py-0.5 rounded-full text-3xs font-bold border transition-all cursor-pointer {settlementDelayDays === 3 ? 'bg-orange text-white border-orange shadow-2xs' : 'bg-nested text-muted border-light'}"
                  >
                    3H
                  </button>
                  <button
                    type="button"
                    on:click={() => (settlementDelayDays = 7)}
                    class="px-2.5 py-0.5 rounded-full text-3xs font-bold border transition-all cursor-pointer {settlementDelayDays === 7 ? 'bg-orange text-white border-orange shadow-2xs' : 'bg-nested text-muted border-light'}"
                  >
                    7H
                  </button>
                  <button
                    type="button"
                    on:click={() => (settlementDelayDays = 14)}
                    class="px-2.5 py-0.5 rounded-full text-3xs font-bold border transition-all cursor-pointer {settlementDelayDays === 14 ? 'bg-orange text-white border-orange shadow-2xs' : 'bg-nested text-muted border-light'}"
                  >
                    14H
                  </button>
                </div>
              </div>

              <Input
                id="settlementDelayDays"
                type="number"
                min="0"
                step="1"
                placeholder="7"
                bind:value={settlementDelayDays}
                disabled={isLoading}
                className="font-bold text-sm"
                helper="Durasi penahanan saldo sebelum dapat di-withdraw."
              >
                <span slot="suffix" class="font-bold text-xs text-muted select-none">Hari</span>
              </Input>
            </div>
          </div>

          <!-- Save Button -->
          <div class="pt-4 border-t border-light flex items-center justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isLoading}
              disabled={isLoading}
              className="min-w-[180px] shadow-xs active:scale-95 font-bold rounded-2xl"
            >
              <span class="material-symbols-outlined text-[18px] mr-1.5 icon-filled">save</span>
              <span>Simpan Parameter</span>
            </Button>
          </div>
        </form>
      </div>
    </Card>
  </div>
</div>
