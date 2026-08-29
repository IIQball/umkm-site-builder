<script lang="ts">
  import { onMount } from 'svelte';
  import StatCard from '../ui/StatCard.svelte';
  import { Card, Input, Button } from '@/components/ui';
  import { formatCurrency } from '@/lib/utils';
  import { toast } from '@/lib/toast';

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
      toast.error('Persentase fee harus antara 0% hingga 100%');
      return;
    }
    if (settlementDelayDays < 0) {
      toast.error('Durasi penahanan settlement tidak boleh negatif');
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
        toast.success('Pengaturan komisi & settlement platform berhasil disimpan!');
      } else {
        toast.error(result.error?.message || 'Gagal menyimpan pengaturan komisi');
      }
    } catch {
      toast.error('Terjadi kesalahan koneksi saat menyimpan');
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
      <a
        href="/admin/users"
        class="bg-card border border-light rounded-2xl px-4 py-2.5 text-xs font-bold text-main shadow-xs hover:border-primary/40 hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer"
      >
        <span class="material-symbols-outlined text-primary text-base">group</span>
        <span>Manajemen Pengguna</span>
      </a>
    </div>
  </div>

  <!-- Stat Cards Grid (animated on client load) -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <StatCard
      label="Fee Platform"
      value="{platformFeePercentage}%"
      rawValue={platformFeePercentage}
      icon="percent"
      colorTheme="indigo"
      badge="Kas SaaS"
      footerText="Potongan otomatis per transaksi"
      delayClass="delay-100"
    />
    <StatCard
      label="Bagian Desainer"
      value="{designerShare}%"
      rawValue={designerShare}
      icon="brush"
      colorTheme="emerald"
      badge="Hak Desainer"
      footerText="Masuk langsung ke dompet kreator"
      delayClass="delay-150"
    />
    <StatCard
      label="Penahanan Settlement"
      value="{settlementDelayDays} Hari"
      rawValue={settlementDelayDays}
      icon="hourglass_top"
      colorTheme="amber"
      badge="Proteksi Fraud"
      footerText="Jeda saldo sebelum dapat ditarik"
      delayClass="delay-200"
    />
  </div>

  <!-- Settings Configuration Card -->
  <div class="animate-fade-in-up delay-300">
    <Card variant="bordered" padding="none" radius="xl" topBeam="indigo-500">
      <!-- Header inside Card -->
      <div class="px-6 md:px-7 py-5 border-b border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-base">tune</span>
          </div>
          <div>
            <h3 class="text-heading-md text-main font-bold">Parameter Finansial & Bagi Hasil</h3>
            <p class="text-body-sm text-secondary mt-0.5">Konfigurasi nilai persentase potongan transaksi dan kebijakan penahanan dana</p>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="p-6 md:p-8">
        <form on:submit|preventDefault={handleSave} class="space-y-8 w-full">
          <!-- Split Ratio Visual Gauge -->
          <div class="p-6 rounded-2xl bg-nested/70 border border-light space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold font-heading uppercase tracking-wider text-muted">
                Rasio Pembagian Komisi
              </span>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  on:click={() => (platformFeePercentage = 20)}
                  class="px-2.5 py-1 rounded-lg text-2xs font-bold border transition-all cursor-pointer {platformFeePercentage === 20 ? 'bg-indigo-500 text-white border-indigo-500 shadow-2xs' : 'bg-card text-secondary border-light hover:text-main'}"
                >
                  20% / 80%
                </button>
                <button
                  type="button"
                  on:click={() => (platformFeePercentage = 30)}
                  class="px-2.5 py-1 rounded-lg text-2xs font-bold border transition-all cursor-pointer {platformFeePercentage === 30 ? 'bg-indigo-500 text-white border-indigo-500 shadow-2xs' : 'bg-card text-secondary border-light hover:text-main'}"
                >
                  30% / 70% (Standar)
                </button>
                <button
                  type="button"
                  on:click={() => (platformFeePercentage = 40)}
                  class="px-2.5 py-1 rounded-lg text-2xs font-bold border transition-all cursor-pointer {platformFeePercentage === 40 ? 'bg-indigo-500 text-white border-indigo-500 shadow-2xs' : 'bg-card text-secondary border-light hover:text-main'}"
                >
                  40% / 60%
                </button>
              </div>
            </div>

            <!-- Progress Bar Barcode -->
            <div class="h-3.5 w-full bg-light rounded-full overflow-hidden flex shadow-inner">
              <div
                class="bg-gradient-to-r from-indigo-600 to-indigo-500 h-full transition-all duration-300 relative group"
                style="width: {platformFeePercentage}%"
              ></div>
              <div
                class="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full transition-all duration-300 relative group"
                style="width: {designerShare}%"
              ></div>
            </div>

            <div class="flex items-center justify-between text-xs font-bold font-heading pt-1">
              <span class="text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                Fee Platform: {platformFeePercentage}%
              </span>
              <span class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Hak Desainer: {designerShare}%
              </span>
            </div>

            <!-- Simulation Calculation Box -->
            <div class="pt-3 text-xs text-secondary flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-light/60 font-sans">
              <span>Simulasi penjualan template <strong>{formatCurrency(samplePrice)}</strong>:</span>
              <div class="flex items-center gap-3 font-mono">
                <span class="text-indigo-600 dark:text-indigo-400">Platform: {formatCurrency(samplePlatformFee)}</span>
                <span class="text-muted">•</span>
                <span class="text-emerald-600 dark:text-emerald-400 font-bold">Desainer: {formatCurrency(sampleDesignerShare)}</span>
              </div>
            </div>
          </div>

          <!-- Input Fields Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Platform Fee -->
            <div class="p-5 rounded-2xl bg-card border border-light space-y-3">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
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
                class="w-full accent-indigo-600 cursor-pointer h-2 bg-nested rounded-lg"
              />
            </div>

            <!-- Settlement Delay -->
            <div class="p-5 rounded-2xl bg-card border border-light space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <span class="material-symbols-outlined text-sm">hourglass_top</span>
                  </div>
                  <span class="text-xs font-bold text-main font-heading">Penahanan Settlement</span>
                </div>
                <!-- Presets -->
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    on:click={() => (settlementDelayDays = 3)}
                    class="px-2 py-0.5 rounded text-3xs font-bold border transition-all cursor-pointer {settlementDelayDays === 3 ? 'bg-amber-500 text-white border-amber-500' : 'bg-nested text-muted border-light'}"
                  >
                    3H
                  </button>
                  <button
                    type="button"
                    on:click={() => (settlementDelayDays = 7)}
                    class="px-2 py-0.5 rounded text-3xs font-bold border transition-all cursor-pointer {settlementDelayDays === 7 ? 'bg-amber-500 text-white border-amber-500' : 'bg-nested text-muted border-light'}"
                  >
                    7H
                  </button>
                  <button
                    type="button"
                    on:click={() => (settlementDelayDays = 14)}
                    class="px-2 py-0.5 rounded text-3xs font-bold border transition-all cursor-pointer {settlementDelayDays === 14 ? 'bg-amber-500 text-white border-amber-500' : 'bg-nested text-muted border-light'}"
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
              className="min-w-[180px] shadow-md"
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
