<script lang="ts">
  import { onMount } from 'svelte';
  import StatCard from '../ui/StatCard.svelte';
  import { Card, Input, Button } from '@/components/ui';
  import { addToast } from '@/lib/toast';
  import CommissionSimulationCard from './commission/CommissionSimulationCard.svelte';

  export let initialFeePercentage: number = 30;
  export let initialSettlementDelayDays: number = 7;

  let platformFeePercentage: number = initialFeePercentage;
  let settlementDelayDays: number = initialSettlementDelayDays;
  let isLoading = false;

  onMount(async () => {
    try {
      const res = await fetch('/api/admin/settings/commission');
      const result = await res.json();
      if (result.ok && result.data) {
        if (result.data.platformFeePercentage !== undefined) {
          platformFeePercentage = Number(result.data.platformFeePercentage);
        }
        if (result.data.settlementDelayDays !== undefined) {
          settlementDelayDays = Number(result.data.settlementDelayDays);
        }
      }
    } catch {
      // Keep default values
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

      if (res.ok && (result.ok)) {
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
  <!-- Page Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
    <div>
      <h1 class="text-heading-lg text-main font-bold tracking-tight flex items-center gap-2.5">
        <span>Pengaturan Platform & Komisi</span>
      </h1>
      <p class="text-body-base text-secondary mt-1 max-w-2xl leading-relaxed">
        Kelola parameter pembagian hasil penjualan template otomatis antara kas platform dan dompet desainer.
      </p>
    </div>

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

  <!-- Stat Cards Grid -->
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

      <div class="p-6 md:p-8">
        <form on:submit|preventDefault={handleSave} class="space-y-8 w-full">
          <CommissionSimulationCard
            {platformFeePercentage}
            {designerShare}
            {samplePrice}
            {samplePlatformFee}
            {sampleDesignerShare}
            onSelectRatio={(val) => (platformFeePercentage = val)}
          />

          <!-- Input Fields Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Platform Fee Input -->
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

            <!-- Settlement Delay Input -->
            <div class="p-6 rounded-3xl bg-card border border-light space-y-3 shadow-2xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-orange/15 text-orange flex items-center justify-center">
                    <span class="material-symbols-outlined text-sm">hourglass_top</span>
                  </div>
                  <span class="text-xs font-bold text-main font-heading">Penahanan Settlement</span>
                </div>
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
