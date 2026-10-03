<script lang="ts">
  import { Modal, Badge, Button } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';
  import { formatDate } from '@/lib/utils/format';
  import { Printer, Store, User, ShieldCheck, CheckCircle2 } from 'lucide-svelte';

  export let open: boolean = false;
  export let order: any = null;
  export let isAdmin: boolean = false;
  export let onClose: () => void = () => {};

  $: adminFee = Number(order?.adminFee || 0);
  $: amount = Number(order?.amount || 0);
  $: basePrice = order?.basePrice !== undefined ? Number(order.basePrice) : Math.max(0, amount - adminFee);
  $: showAdminFee = isAdmin || (adminFee > 0 && Boolean(order?.assistedBy));
  $: displayId = order?.externalId || order?.id || '-';

  function handlePrint() {
    window.print();
  }
</script>

<Modal
  {open}
  size="lg"
  bodyPadding={false}
  showCloseButton={true}
  on:close={onClose}
  class="max-w-2xl w-full"
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-2.5 text-sm font-bold text-main font-heading">
      <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        <span class="material-symbols-outlined text-lg">receipt_long</span>
      </div>
      <div>
        <span>Faktur Pembelian Resmi</span>
        <span class="text-3xs text-secondary font-mono block font-normal">No. {displayId}</span>
      </div>
    </div>
  </svelte:fragment>

  {#if order}
    <!-- Printable Invoice Container -->
    <div class="p-6 sm:p-8 space-y-6 invoice-print-area">
      <!-- Invoice Header & Brand -->
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-light">
        <div>
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-main text-canvas flex items-center justify-center font-black text-xs">
              P
            </div>
            <span class="text-lg font-black tracking-tight text-main font-heading">Pinoka</span>
          </div>
          <p class="text-2xs text-secondary mt-1">Platform Pembuat Website & Toko Online UMKM</p>
        </div>

        <div class="text-left sm:text-right">
          <Badge variant="success" size="sm" dot>Lunas & Terverifikasi</Badge>
          <p class="text-2xs text-secondary font-mono mt-1.5">
            {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <!-- Parties Involved -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-nested/80 border border-light text-xs">
        <div>
          <span class="text-3xs font-bold text-secondary uppercase tracking-wider block">Penerima Lisensi / Merchant</span>
          <div class="flex items-center gap-1.5 mt-1 font-bold text-main">
            <User size={14} class="text-primary flex-shrink-0" />
            <span class="truncate">{order.merchantName || 'Merchant Terdaftar'}</span>
          </div>
          {#if order.storeName}
            <div class="flex items-center gap-1.5 mt-0.5 text-secondary">
              <Store size={13} class="flex-shrink-0" />
              <span class="truncate">{order.storeName}</span>
            </div>
          {/if}
        </div>

        <div>
          <span class="text-3xs font-bold text-secondary uppercase tracking-wider block">Kanal Pembayaran & Gateway</span>
          <div class="flex items-center gap-1.5 mt-1 font-bold text-main">
            <ShieldCheck size={14} class="text-success flex-shrink-0" />
            <span>Xendit Secured Invoicing</span>
          </div>
          <span class="text-3xs text-secondary font-mono block mt-0.5">
            Metode: {order.paymentChannel || 'Bank Transfer / QRIS'}
          </span>
        </div>
      </div>

      <!-- Line Items Table -->
      <div class="border border-light rounded-2xl overflow-hidden">
        <table class="w-full text-xs">
          <thead class="bg-nested/60 border-b border-light text-secondary font-semibold">
            <tr>
              <th class="py-2.5 px-4 text-left font-sans">Deskripsi Layanan</th>
              <th class="py-2.5 px-4 text-right font-sans w-36">Subtotal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-light">
            <tr>
              <td class="py-3 px-4">
                <span class="font-bold text-main block">{order.template?.name || 'Lisensi Template Desain Toko'}</span>
                <span class="text-3xs text-secondary mt-0.5 block font-mono">
                  ID: #{order.template?.id ? order.template.id.slice(0, 10) : '—'}
                </span>
              </td>
              <td class="py-3 px-4 text-right font-mono font-semibold text-main">
                {formatIDR(basePrice)}
              </td>
            </tr>

            {#if showAdminFee && adminFee > 0}
              <tr class="bg-primary/5">
                <td class="py-3 px-4">
                  <span class="font-bold text-primary block">Biaya Jasa Pendampingan</span>
                  <span class="text-3xs text-secondary mt-0.5 block">
                    Fee layanan pendampingan & konfigurasi template oleh admin resmi
                  </span>
                </td>
                <td class="py-3 px-4 text-right font-mono font-bold text-primary">
                  +{formatIDR(adminFee)}
                </td>
              </tr>
            {/if}

            <tr>
              <td class="py-2.5 px-4 text-secondary">Biaya Penanganan Sistem</td>
              <td class="py-2.5 px-4 text-right font-mono text-success font-bold text-3xs">Gratis Rp 0</td>
            </tr>
          </tbody>
          <tfoot class="bg-nested/90 border-t border-light font-bold">
            <tr>
              <td class="py-3 px-4 text-sm font-heading text-main">Total Pembayaran</td>
              <td class="py-3 px-4 text-right text-base font-mono font-black text-primary">
                {formatIDR(amount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Specific Fee Clarification Note for Admin Assisted Invoices -->
      {#if showAdminFee && adminFee > 0}
        <div class="p-3.5 rounded-2xl bg-warning/10 border border-warning/20 text-xs text-warning space-y-1">
          <div class="flex items-center gap-1.5 font-bold">
            <span class="material-symbols-outlined text-sm">info</span>
            <span>Keterangan Biaya Pendampingan:</span>
          </div>
          <p class="text-3xs leading-relaxed opacity-90">
            Faktur ini mencakup <strong>Biaya Jasa Pendampingan</strong> sebesar <strong>{formatIDR(adminFee)}</strong>. Biaya ini dikreditkan ke saldo dompet admin pendamping sebagai imbal jasa asistensi toko merchant binaan.
          </p>
        </div>
      {/if}

      <!-- Security / Authentic Seal -->
      <div class="flex items-center justify-between pt-2 text-3xs text-secondary border-t border-light">
        <span class="font-mono">Ref ID: {order.id}</span>
        <span class="flex items-center gap-1 text-success font-medium">
          <CheckCircle2 size={12} />
          Dokumen Sah & Diterbitkan Secara Elektronik
        </span>
      </div>
    </div>
  {/if}

  <svelte:fragment slot="footer">
    <div class="flex items-center justify-end gap-2 w-full print:hidden">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        on:click={onClose}
      >
        <span>Tutup</span>
      </Button>

      <Button
        type="button"
        variant="primary"
        size="sm"
        class="font-bold flex items-center gap-1.5 shadow-sm"
        on:click={handlePrint}
      >
        <Printer size={15} />
        <span>Cetak / Simpan PDF</span>
      </Button>
    </div>
  </svelte:fragment>
</Modal>

<style>
  @media print {
    :global(body *) {
      visibility: hidden;
    }
    :global(.invoice-print-area),
    :global(.invoice-print-area *) {
      visibility: visible;
    }
    :global(.invoice-print-area) {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      margin: 0;
      padding: 20px !important;
      background: white !important;
      color: black !important;
    }
  }
</style>
