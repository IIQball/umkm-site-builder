<script lang="ts">
  import { Modal, Button, Badge } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';
  import { formatDate } from '@/lib/utils/format';
  import { Printer, Receipt } from 'lucide-svelte';
  import { printReceiptDocument, type ReceiptOrderData } from './invoiceReceipt.helpers';

  export let open: boolean = false;
  export let order: ReceiptOrderData | null = null;
  export let isAdmin: boolean = false;
  export let onClose: () => void = () => {};

  $: adminFee = Number(order?.adminFee || 0);
  $: amount = Number(order?.amount || 0);
  $: basePrice =
    order?.basePrice !== undefined
      ? Number(order.basePrice)
      : Math.max(0, amount - adminFee);
  $: showAdminFee = isAdmin || (adminFee > 0 && Boolean(order?.assistedBy));
  $: displayId = order?.externalId || order?.id || 'INV/PNK/20260813/C-1786462099001';

  $: customerName =
    order?.merchantName ||
    order?.user?.name ||
    (order?.merchantEmail ? order.merchantEmail.split('@')[0] : null) ||
    'Merchant Terdaftar';

  $: paymentDate = order?.createdAt
    ? formatDate(order.createdAt, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : formatDate(new Date(), {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  $: paymentMethod =
    order?.paymentChannel ||
    (order?.paymentGatewayRef ? 'Xendit Invoice' : 'Transfer Bank / QRIS');

  $: isAssisted = Boolean(order?.adminName || order?.assistedBy);
  $: transactionType = isAssisted ? 'Pendampingan Admin' : 'Pembelian Mandiri';

  function handlePrint() {
    if (!order) return;
    printReceiptDocument(order, isAdmin);
  }
</script>

<Modal
  {open}
  size="lg"
  bodyPadding={false}
  showCloseButton={true}
  on:close={onClose}
  class="max-w-xl w-full"
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-2 text-sm font-bold text-main font-heading">
      <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        <Receipt size={18} />
      </div>
      <div>
        <span>Nota Transaksi Resmi</span>
        <span class="text-xs text-secondary font-mono block font-normal">
          {displayId}
        </span>
      </div>
    </div>
  </svelte:fragment>

  {#if order}
    <!-- Container Luar Nota -->
    <div class="p-3 sm:p-6 bg-nested/40">
      <!-- Kertas Nota Putih (Single Card Presentation) -->
      <div
        class="bg-card text-main rounded-2xl p-6 sm:p-8 shadow-sm border border-light max-w-lg mx-auto"
      >
        <!-- Header Logo Brand Pinoka (Tengah) -->
        <div class="flex items-center justify-center gap-2 mb-6">
          <img
            src="/assets/logo/logo-pin.webp"
            alt="Pinoka"
            class="h-7 w-auto object-contain"
          />
          <span class="text-xl sm:text-2xl font-black tracking-tight text-main font-heading">
            Pinoka
          </span>
        </div>

        <!-- Sapaan & Penjelasan Status Lunas -->
        <h2 class="text-lg sm:text-xl font-bold text-main tracking-tight font-heading">
          Halo, {customerName}
        </h2>
        <p class="text-xs sm:text-sm text-secondary mt-1 leading-relaxed font-sans">
          Pembayaranmu sudah kami terima dan pesananmu tercatat lunas. Berikut rincian transaksinya.
        </p>

        <!-- Bagian: Rincian Pembayaran -->
        <div class="mt-6">
          <h3 class="text-xs sm:text-sm font-bold text-main mb-3 font-heading">
            Rincian Pembayaran
          </h3>

          <div class="space-y-2 text-xs sm:text-sm">
            <div class="flex items-start justify-between gap-4">
              <span class="text-secondary shrink-0">Nomor Invoice</span>
              <span class="font-mono font-medium text-main text-right break-all">
                {displayId}
              </span>
            </div>

            <div class="flex items-start justify-between gap-4">
              <span class="text-secondary shrink-0">Tanggal Pembayaran</span>
              <span class="font-medium text-main text-right">
                {paymentDate}
              </span>
            </div>

            <div class="flex items-start justify-between gap-4">
              <span class="text-secondary shrink-0">Metode Pembayaran</span>
              <span class="font-medium text-main text-right">
                {paymentMethod}
              </span>
            </div>

            <div class="flex items-start justify-between gap-4">
              <span class="text-secondary shrink-0">Paket / Layanan</span>
              <span class="font-medium text-main text-right">
                {order.template?.name || 'Lisensi Template Toko Online'}
              </span>
            </div>

            <div class="flex items-start justify-between gap-4">
              <span class="text-secondary shrink-0">Jenis Pembelian</span>
              <Badge variant={isAssisted ? 'primary' : 'success'} size="sm" dot={false} class="font-bold">
                {transactionType}
              </Badge>
            </div>

            {#if isAssisted && order.adminName}
              <div class="flex items-start justify-between gap-4">
                <span class="text-secondary shrink-0">Admin Pembeli</span>
                <span class="font-medium text-main text-right">
                  {order.adminName} {order.adminEmail ? `(${order.adminEmail})` : ''}
                </span>
              </div>
              <div class="flex items-start justify-between gap-4">
                <span class="text-secondary shrink-0">Merchant Penerima</span>
                <span class="font-medium text-main text-right">
                  {customerName} {order.merchantEmail ? `(${order.merchantEmail})` : ''}
                </span>
              </div>
            {:else}
              <div class="flex items-start justify-between gap-4">
                <span class="text-secondary shrink-0">Pembeli (Merchant)</span>
                <span class="font-medium text-main text-right">
                  {customerName} {order.merchantEmail ? `(${order.merchantEmail})` : ''}
                </span>
              </div>
            {/if}

            {#if order.storeName}
              <div class="flex items-start justify-between gap-4">
                <span class="text-secondary shrink-0">Toko UMKM</span>
                <span class="font-medium text-main text-right">
                  {order.storeName}
                </span>
              </div>
            {/if}
          </div>
        </div>

        <!-- Bagian: RINCIAN KOMPONEN -->
        <div class="mt-6">
          <h4 class="text-2xs font-bold text-muted uppercase tracking-widest mb-3 font-sans">
            RINCIAN KOMPONEN
          </h4>

          <div class="space-y-2 text-xs sm:text-sm">
            <div class="flex items-center justify-between gap-4">
              <span class="text-secondary">
                {order.template?.name || 'Lisensi Template Toko Online'} (Lisensi Selamanya) x1
              </span>
              <span class="font-medium text-main text-right shrink-0">
                {formatIDR(basePrice)}
              </span>
            </div>

            {#if showAdminFee && adminFee > 0}
              <div class="flex items-center justify-between gap-4">
                <span class="text-secondary">
                  Jasa Pendampingan & Setup Template (Admin) x1
                </span>
                <span class="font-medium text-main text-right shrink-0">
                  {formatIDR(adminFee)}
                </span>
              </div>
            {/if}

            <div class="flex items-center justify-between gap-4">
              <span class="text-secondary">
                Biaya Pemeliharaan & Integrasi Sistem x1
              </span>
              <span class="font-medium text-main text-right shrink-0">
                Rp 0
              </span>
            </div>
          </div>
        </div>

        <!-- Garis Pemisah & Total -->
        <div class="border-t border-light mt-5 pt-4 flex items-center justify-between gap-4">
          <span class="text-sm sm:text-base font-bold text-main font-heading">
            Total
          </span>
          <span class="text-lg sm:text-xl font-bold text-primary font-heading">
            {formatIDR(amount)}
          </span>
        </div>

        <!-- Catatan Arsip PDF -->
        <p class="text-2xs sm:text-xs text-muted mt-5 leading-relaxed font-sans">
          Invoice resmi terlampir pada email ini dalam bentuk PDF untuk keperluan arsip.
        </p>

        <!-- Garis Pemisah Bantuan -->
        <div class="border-t border-light my-4"></div>

        <!-- Hubungi Bantuan -->
        <p class="text-2xs sm:text-xs text-secondary font-sans leading-relaxed">
          Butuh bantuan? Hubungi kami di <strong class="text-main font-semibold">support@pinoka.id</strong> atau <strong class="text-main font-semibold">+62 812-3444-5565</strong>.
        </p>

        <!-- Footer Perusahaan di Dalam Kertas Nota -->
        <div class="mt-6 pt-4 border-t border-dashed border-light text-center space-y-1 text-muted font-sans select-none">
          <div class="text-xs tracking-wider">
            Instagram · Threads · X
          </div>
          <div class="text-2xs font-semibold text-secondary">
            PT. Pinoka Inovasi Nusantara
          </div>
          <div class="text-xs text-muted">
            Banyuwangi, Jawa Timur, Indonesia
          </div>
        </div>
      </div>
    </div>
  {/if}

  <svelte:fragment slot="footer">
    <div class="flex items-center justify-end gap-2 w-full">
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
        <span>Cetak / Unduh PDF</span>
      </Button>
    </div>
  </svelte:fragment>
</Modal>
