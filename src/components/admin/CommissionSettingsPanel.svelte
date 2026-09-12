<script lang="ts">
  import { onMount } from 'svelte';
  import StatCard from '../ui/StatCard.svelte';
  import { Card, Button } from '@/components/ui';
  import { addToast } from '@/lib/toast';
  import CommissionSimulationCard from './commission/CommissionSimulationCard.svelte';
  import CommissionSettingsInputs from './commission/CommissionSettingsInputs.svelte';

  export let initialFeePercentage: number = 30;
  export let initialSettlementDelayDays: number = 7;
  export let initialAdminServiceFee: number = 5000;

  let platformFeePercentage: number = initialFeePercentage;
  let settlementDelayDays: number = initialSettlementDelayDays;
  let adminServiceFee: number = initialAdminServiceFee;
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
        if (result.data.adminServiceFee !== undefined) {
          adminServiceFee = Number(result.data.adminServiceFee);
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
    if (adminServiceFee < 0) {
      addToast({
        type: 'error',
        message: 'Biaya jasa pendampingan admin tidak boleh negatif',
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
          adminServiceFee: Number(adminServiceFee),
        }),
      });
      const result = await res.json();

      if (res.ok && (result.ok)) {
        addToast({
          type: 'success',
          message: 'Pengaturan komisi, fee admin & settlement berhasil disimpan!',
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
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
      label="Fee Pendampingan Admin"
      value="Rp {Number(adminServiceFee || 0).toLocaleString('id-ID')}"
      rawValue={adminServiceFee}
      icon="support_agent"
      cardTheme="blue"
      badge="Jasa Pendamping"
      footerText="Biaya bantuan transaksi tenant"
      delayClass="delay-200"
    />
    <StatCard
      label="Penahanan Settlement"
      value="{settlementDelayDays} Hari"
      rawValue={settlementDelayDays}
      icon="hourglass_top"
      cardTheme="orange"
      badge="Proteksi Fraud"
      footerText="Jeda saldo sebelum withdrawal"
      delayClass="delay-250"
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
              Konfigurasi nilai persentase potongan transaksi, fee pendampingan, dan penahanan dana
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
          <CommissionSettingsInputs
            bind:platformFeePercentage
            bind:adminServiceFee
            bind:settlementDelayDays
            {isLoading}
          />

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
