<script lang="ts">
  import { onMount } from "svelte";
  import { AlertTriangle, Zap } from "lucide-svelte";
  import { Modal, Button } from "@/components/ui";
  import { formatIDR } from "@/lib/currency";
  import type { CreditPackage } from "@/types";

  export let package_: CreditPackage | null = null;
  let open = false;
  let loading = false;

  function handleConfirm() {
    loading = true;
    window.dispatchEvent(
      new CustomEvent("checkout-confirm", { detail: package_ }),
    );
  }

  function handleCancel() {
    open = false;
    package_ = null;
    loading = false;
  }

  onMount(() => {
    window.addEventListener("open-modal", (e: Event) => {
      const customEvent = e as CustomEvent;
      package_ = customEvent.detail;
      open = true;
    });
  });

  $: formattedPrice = package_ ? formatIDR(package_.price) : "Rp 0";
</script>

<Modal {open} size="sm" on:close={handleCancel}>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/25 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs"
      >
        <Zap size={20} />
      </div>
      <div>
        <h3
          id="credit-checkout-title"
          class="font-bold text-main text-base font-heading"
        >
          Konfirmasi Pembelian Kredit
        </h3>
        <p class="text-xs text-secondary mt-0.5">
          Dapatkan kredit AI untuk menggunakan fitur premium
        </p>
      </div>
    </div>
  </svelte:fragment>

  {#if package_}
    <div class="space-y-4">
      <p class="text-xs text-secondary leading-relaxed">
        Anda akan membeli paket kredit AI berikut. Pembayaran akan diproses
        melalui Xendit.
      </p>

      <div
        class="bg-nested/70 rounded-2xl p-4 space-y-3 border border-light"
      >
        <div class="flex justify-between items-center">
          <span class="text-secondary text-xs">Paket:</span>
          <span class="font-bold text-main text-sm">{package_.name}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-secondary text-xs">Jumlah Kredit:</span>
          <div class="flex items-center gap-1.5">
            <Zap size={14} class="text-primary" />
            <span class="font-bold text-primary text-sm"
              >{package_.credits} kredit</span
            >
          </div>
        </div>
        <div
          class="flex justify-between items-center pt-2 border-t border-light/50"
        >
          <span class="text-secondary text-xs">Total Pembayaran:</span>
          <span class="font-bold text-primary text-base">{formattedPrice}</span>
        </div>
      </div>

      <div class="bg-info/10 rounded-xl p-3 border border-info/25 flex gap-2">
        <AlertTriangle size={16} class="text-info flex-shrink-0 mt-0.5" />
        <p class="text-xs text-secondary leading-relaxed">
          Kredit akan langsung tersedia setelah pembayaran berhasil. Anda akan
          diarahkan ke halaman invoice.
        </p>
      </div>
    </div>
  {/if}

  <svelte:fragment slot="footer">
    <Button
      variant="secondary"
      size="sm"
      disabled={loading}
      on:click={handleCancel}
    >
      Batal
    </Button>
    <Button
      variant="primary"
      size="sm"
      {loading}
      disabled={loading}
      on:click={handleConfirm}
      class="font-bold"
    >
      Lanjut ke Pembayaran
    </Button>
  </svelte:fragment>
</Modal>
