<script lang="ts">
  import {
    Zap,
    AlertCircle,
    Sparkles,
    ArrowRight,
    CheckCircle2,
  } from "lucide-svelte";
  import { Button, Badge } from "@/components/ui";

  export let balance: number = 0;
  export let totalPurchased: number = 0;
  export let activeTier: string = "trial";
  export let packageName: string = "Belum Ada Paket Aktif";
  export let loading: boolean = false;

  $: isZeroBalance = balance <= 0;
  $: isLowBalance = balance === 1;
  $: isNewAccount = totalPurchased === 0 || activeTier === "trial";
</script>

{#if !loading}
  {#if isZeroBalance}
    {#if isNewAccount}
      <!-- Nudge Ramah & Ajakan Top Up Pertama Kali untuk Merchant Baru (0 Kredit) -->
      <div
        class="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-card border border-primary/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
      >
        <div class="flex items-start gap-3">
          <div
            class="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5"
          >
            <Sparkles size={18} />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-main font-heading">
                Aktifkan Studio Visual AI Toko Anda
              </h4>
              <Badge variant="primary" size="sm" dot={true}
                >Mulai dari Rp 15.000</Badge
              >
            </div>
            <p class="text-xs text-secondary mt-0.5 leading-relaxed max-w-2xl">
              Dapatkan akses langsung ke mesin visual AI untuk membuat mockup
              kemasan 3D fotorealistis, logo toko, dan poster promosi. Pilih
              paket kredit hemat untuk memulai.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          href="/dashboard/credits/buy"
          class="w-full sm:w-auto font-bold flex-shrink-0 shadow-xs"
        >
          <span>Pilih Paket Kredit</span>
          <ArrowRight size={14} class="ml-1" />
        </Button>
      </div>
    {:else}
      <!-- Peringatan Halus saat Kuota Habis (Pernah Beli Sebelumnya) -->
      <div
        class="p-4 rounded-2xl bg-error/10 border border-error/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
      >
        <div class="flex items-start gap-3">
          <div
            class="w-9 h-9 rounded-xl bg-error/20 text-error flex items-center justify-center flex-shrink-0 mt-0.5"
          >
            <AlertCircle size={20} />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-main font-heading">
                Saldo Kredit AI Telah Habis
              </h4>
              <Badge variant="error" size="sm" dot={false}>0 Kredit</Badge>
            </div>
            <p class="text-xs text-secondary mt-0.5 leading-relaxed">
              Saldo kredit kuota toko Anda telah digunakan. Isi ulang paket
              kredit untuk melanjutkan merancang foto produk kemasan 3D dan
              poster baru.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          href="/dashboard/credits/buy"
          class="w-full sm:w-auto font-bold flex-shrink-0 shadow-xs"
        >
          <span>Top Up Kredit Sekarang</span>
          <ArrowRight size={14} class="ml-1" />
        </Button>
      </div>
    {/if}
  {:else if isLowBalance}
    <!-- Peringatan Halus Saldo Menipis (1 Kredit Tersisa) -->
    <div
      class="p-3.5 rounded-2xl bg-warning/10 border border-warning/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
    >
      <div class="flex items-start gap-3">
        <div
          class="w-8 h-8 rounded-xl bg-warning/20 text-warning flex items-center justify-center flex-shrink-0 mt-0.5"
        >
          <Zap size={16} />
        </div>
        <div>
          <h4
            class="text-xs font-bold text-main font-heading flex items-center gap-2"
          >
            <span>Sisa Saldo Menipis (1 Kredit Tersisa)</span>
            <Badge variant="warning" size="sm" dot={false}>Perlu Top Up</Badge>
          </h4>
          <p class="text-2xs text-secondary mt-0.5 leading-relaxed">
            Hanya cukup untuk 1 desain standar. Top up sekarang agar pembuatan
            mockup kemasan 3D (2 kredit) tidak terputus.
          </p>
        </div>
      </div>
      <Button
        variant="primary"
        size="sm"
        href="/dashboard/credits/buy"
        class="w-full sm:w-auto font-bold flex-shrink-0"
      >
        <span>Isi Ulang Kredit</span>
      </Button>
    </div>
  {:else}
    <!-- Ringkasan Status Kredit Aktif -->
    <div
      class="p-3 rounded-2xl bg-nested/70 border border-light/80 flex flex-wrap items-center justify-between gap-3 text-xs"
    >
      <div class="flex items-center gap-2.5 text-secondary">
        <div
          class="w-6 h-6 rounded-lg bg-success/15 text-success flex items-center justify-center flex-shrink-0"
        >
          <CheckCircle2 size={14} />
        </div>
        <span
          >Paket Aktif: <strong class="text-main font-heading"
            >{packageName}</strong
          >{#if activeTier && activeTier !== 'trial'}&nbsp;<span class="text-2xs uppercase text-muted font-mono">({activeTier})</span>{/if}</span
        >
        <span class="text-muted">•</span>
        <span
          >Saldo Siap Pakai: <strong class="text-success font-mono font-bold"
            >{balance} Kredit</strong
          ></span
        >
      </div>
      <a
        href="/dashboard/credits/buy"
        class="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
      >
        <span>+ Tambah Kuota Kredit</span>
      </a>
    </div>
  {/if}
{/if}
