<script lang="ts">
  import { onMount } from "svelte";
  import { Card, Button } from "@/components/ui";
  import { addToast } from "@/lib/toast";
  import CommissionSimulationCard from "./commission/CommissionSimulationCard.svelte";
  import CommissionSettingsInputs from "./commission/CommissionSettingsInputs.svelte";
  import CommissionStatsGrid from "./commission/CommissionStatsGrid.svelte";

  export let initialFeePercentage: number = 30;
  export let initialSettlementDelayDays: number = 7;
  export let initialAdminServiceFee: number = 5000;
  export let initialMaxStoreBranches: number = 5;

  let platformFeePercentage: number = initialFeePercentage;
  let settlementDelayDays: number = initialSettlementDelayDays;
  let adminServiceFee: number = initialAdminServiceFee;
  let maxStoreBranches: number = initialMaxStoreBranches;
  let isLoading = false;

  onMount(async () => {
    try {
      const res = await fetch("/api/admin/settings/commission");
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
        if (result.data.maxStoreBranches !== undefined) {
          maxStoreBranches = Number(result.data.maxStoreBranches);
        }
      }
    } catch {
      // Keep default values
    }
  });

  const handleSave = async () => {
    if (platformFeePercentage < 0 || platformFeePercentage > 100) {
      addToast({
        type: "error",
        message: "Persentase fee harus antara 0% hingga 100%",
      });
      return;
    }
    if (settlementDelayDays < 0) {
      addToast({
        type: "error",
        message: "Durasi penahanan settlement tidak boleh negatif",
      });
      return;
    }
    if (adminServiceFee < 0) {
      addToast({
        type: "error",
        message: "Biaya jasa pendampingan admin tidak boleh negatif",
      });
      return;
    }
    if (maxStoreBranches < 1 || maxStoreBranches > 50) {
      addToast({
        type: "error",
        message: "Maksimal cabang toko harus antara 1 hingga 50 cabang",
      });
      return;
    }

    isLoading = true;

    try {
      const res = await fetch("/api/admin/settings/commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformFeePercentage: Number(platformFeePercentage),
          settlementDelayDays: Number(settlementDelayDays),
          adminServiceFee: Number(adminServiceFee),
          maxStoreBranches: Number(maxStoreBranches),
        }),
      });
      const result = await res.json();

      if (res.ok && result.ok) {
        addToast({
          type: "success",
          message:
            "Pengaturan komisi, fee admin, settlement & batas cabang berhasil disimpan!",
        });
      } else {
        addToast({
          type: "error",
          message: result.error?.message || "Gagal menyimpan pengaturan platform",
        });
      }
    } catch {
      addToast({
        type: "error",
        message: "Terjadi kesalahan koneksi saat menyimpan",
      });
    } finally {
      isLoading = false;
    }
  };

  $: designerShare = Math.max(0, 100 - Number(platformFeePercentage || 0));
  $: samplePrice = 100000;
  $: samplePlatformFee = Math.round(
    (samplePrice * Number(platformFeePercentage || 0)) / 100,
  );
  $: sampleDesignerShare = samplePrice - samplePlatformFee;
</script>

<div class="w-full space-y-8 md:space-y-10">
  <!-- Page Header -->
  <div
    class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2"
  >
    <div>
      <h1
        class="text-heading-lg text-main font-bold tracking-tight flex items-center gap-2.5"
      >
        <span>Pengaturan Platform & Komisi</span>
      </h1>
      <p class="text-body-base text-secondary mt-1 max-w-2xl leading-relaxed">
        Kelola parameter pembagian hasil penjualan template otomatis antara kas
        platform dan dompet desainer.
      </p>
    </div>

    <div class="flex items-center gap-2 flex-shrink-0">
      <Button
        href="/admin/users"
        variant="secondary"
        size="md"
        className="font-bold"
      >
        <span class="material-symbols-outlined text-primary text-base"
          >group</span
        >
        <span>Manajemen Pengguna</span>
      </Button>
    </div>
  </div>

  <!-- Stat Cards Layout (1 Full di Kiri, 4 Sub di Kanan sesuai Frame 1100) -->
  <CommissionStatsGrid
    {platformFeePercentage}
    {designerShare}
    {adminServiceFee}
    {settlementDelayDays}
    {maxStoreBranches}
    {samplePrice}
    {samplePlatformFee}
  />

  <!-- Settings Configuration Card -->
  <div class="animate-fade-in-up delay-300">
    <Card
      variant="bordered"
      padding="none"
      radius="2xl"
      className="shadow-xs overflow-hidden"
    >
      <div
        class="p-5 sm:p-6 border-b border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs"
          >
            <span class="material-symbols-outlined text-lg">tune</span>
          </div>
          <div>
            <h3
              class="text-heading-md text-main font-bold font-heading leading-tight"
            >
              Parameter Finansial & Toko
            </h3>
            <p class="text-body-sm text-secondary mt-0.5 font-sans">
              Konfigurasi nilai persentase potongan transaksi, fee pendampingan,
              penahanan dana, dan batas cabang toko
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
            bind:maxStoreBranches
            {isLoading}
          />

          <div
            class="pt-4 border-t border-light flex items-center justify-end gap-3"
          >
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isLoading}
              disabled={isLoading}
              className="min-w-[180px] shadow-xs active:scale-95 font-bold rounded-2xl"
            >
              <span
                class="material-symbols-outlined text-[18px] mr-1.5 icon-filled"
                >save</span
              >
              <span>Simpan Parameter</span>
            </Button>
          </div>
        </form>
      </div>
    </Card>
  </div>
</div>
