<script lang="ts">
  import {
    ArrowLeft,
    Check,
    Copy,
    Clock,
    CreditCard,
    RefreshCw,
    LayoutDashboard,
    Palette,
    Store,
    Sparkles,
    CheckCircle2,
    Lock,
    Zap,
    Smartphone,
    Globe,
  } from 'lucide-svelte';
  import type { CheckoutPageData } from '@/types';
  import { Badge, Button } from '@/components/ui';
  import { toast } from '@/lib/toast';
  import TransactionStatus from './TransactionStatus.svelte';
  import PaymentModal from './PaymentModal.svelte';

  export let pageData: CheckoutPageData;
  export let checkoutTitle: string;
  export let checkoutDescription: string;
  export let lineItemTitle: string;
  export let lineItemSubtitle: string;
  export let isTemplatePurchase: boolean;
  export let invoiceId: string;

  let copied = false;

  const copyInvoice = async () => {
    try {
      await navigator.clipboard.writeText(pageData.invoiceId);
      copied = true;
      toast.info('Nomor invoice berhasil disalin');
      setTimeout(() => {
        copied = false;
      }, 2500);
    } catch {
      toast.error('Gagal menyalin nomor invoice');
    }
  };

  const openPaymentModal = () => {
    const modal = document.getElementById('payment_modal');
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };
</script>

<main class="w-full space-y-6 animate-fade-in-up">
  <!-- Stepper Breadcrumb Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
    <div class="flex items-center gap-2 text-xs font-semibold">
      <Button
        href={isTemplatePurchase ? '/templates' : '/dashboard'}
        variant="secondary"
        size="xs"
        className="font-bold"
      >
        <ArrowLeft size={14} />
        <span>Katalog</span>
      </Button>

      <span class="text-secondary/40">/</span>
      
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 text-primary font-bold text-xs border border-primary/20">
        <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        <span>Konfirmasi Tagihan</span>
      </div>
    </div>

    <div>
      {#if pageData.status === 'success'}
        <Badge variant="emerald" dot size="sm">
          Lunas & Terverifikasi
        </Badge>
      {:else if pageData.status === 'failed'}
        <Badge variant="rose" dot size="sm">
          Pembayaran Gagal
        </Badge>
      {:else if pageData.status === 'expired'}
        <Badge variant="warning" dot size="sm">
          Tagihan Kedaluwarsa
        </Badge>
      {:else}
        <Badge variant="amber" dot pulse size="sm">
          Menunggu Pembayaran
        </Badge>
      {/if}
    </div>
  </div>

  <!-- 2-Column Split Grid (12 Cols) -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
    
    <!-- LEFT COLUMN (md:col-span-7) - Template Presentation & Benefits -->
    <div class="md:col-span-7 space-y-6">
      <div class="bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        
        <!-- Browser Showcase Mockup -->
        <div class="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-nested shadow-sm group transition-all">
          <!-- Browser Mockup Chrome Header -->
          <div class="px-4 py-2.5 bg-canvas/80 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-red-400/80"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400/80"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></span>
            </div>
            <div class="flex-1 max-w-[200px] text-center">
              <div class="px-3 py-0.5 rounded-lg bg-card text-2xs font-mono text-secondary truncate border border-light">
                demo.umkm.id/{pageData.invoiceId.toLowerCase().slice(-6)}
              </div>
            </div>
            <div class="flex items-center gap-1 text-2xs text-secondary font-medium">
              <Sparkles size={12} class="text-primary" />
              <span>Tema Siap Pakai</span>
            </div>
          </div>

          <!-- Thumbnail Image (16:9 Aspect Ratio) -->
          <div class="aspect-video w-full relative overflow-hidden bg-nested">
            {#if pageData.templateThumbnailUrl}
              <img
                src={pageData.templateThumbnailUrl}
                alt={lineItemTitle}
                class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
              />
            {:else}
              <div class="w-full h-full flex flex-col items-center justify-center gap-2 text-secondary bg-nested">
                <Store size={48} class="text-primary/60" />
                <span class="text-xs font-semibold text-main">Pratinjau Desain Website UMKM</span>
              </div>
            {/if}
          </div>
        </div>

        <!-- Template Meta & Designer Profile -->
        <div class="space-y-3">
          <h1 class="text-heading-md sm:text-heading-lg font-bold text-main font-heading leading-snug">
            {lineItemTitle}
          </h1>
          <p class="text-body-sm text-secondary leading-relaxed">
            {pageData.templateDescription || lineItemSubtitle}
          </p>

          <div class="flex flex-wrap items-center gap-3 pt-1">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-nested border border-light text-xs text-secondary">
              <div class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-2xs font-heading">
                {(pageData.designerName || 'D')[0].toUpperCase()}
              </div>
              <span class="text-2xs">Kreator: <strong class="text-main font-semibold">{pageData.designerName || 'Desainer Resmi'}</strong></span>
              <span class="material-symbols-outlined text-primary text-[15px]">verified</span>
            </div>

            <div class="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-2xs font-semibold">
              <CheckCircle2 size={13} />
              <span>Desain Terverifikasi SaaS</span>
            </div>
          </div>
        </div>

        <!-- 2x2 Value Benefits Cards -->
        <div class="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-3">
          <h2 class="text-xs font-bold text-main uppercase tracking-wider font-heading flex items-center gap-1.5">
            <Sparkles size={14} class="text-primary" />
            <span>Fasilitas & Hak Lisensi Termasuk</span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <!-- Benefit 1 -->
            <div class="p-3.5 rounded-2xl bg-nested/60 border border-light space-y-1 hover:border-primary/30 transition-colors">
              <div class="flex items-center gap-2 text-main font-bold text-xs font-heading">
                <Zap size={15} class="text-primary shrink-0" />
                <span>Lisensi Seumur Hidup</span>
              </div>
              <p class="text-2xs text-secondary leading-relaxed">
                Sekali bayar untuk selamanya tanpa biaya langganan bulanan atau tahunan.
              </p>
            </div>

            <!-- Benefit 2 -->
            <div class="p-3.5 rounded-2xl bg-nested/60 border border-light space-y-1 hover:border-primary/30 transition-colors">
              <div class="flex items-center gap-2 text-main font-bold text-xs font-heading">
                <Palette size={15} class="text-primary shrink-0" />
                <span>No-Code Visual Editor</span>
              </div>
              <p class="text-2xs text-secondary leading-relaxed">
                Bebas ubah warna, font tipografi, banner hero, & susunan section sesuka hati.
              </p>
            </div>

            <!-- Benefit 3 -->
            <div class="p-3.5 rounded-2xl bg-nested/60 border border-light space-y-1 hover:border-primary/30 transition-colors">
              <div class="flex items-center gap-2 text-main font-bold text-xs font-heading">
                <Smartphone size={15} class="text-primary shrink-0" />
                <span>Siap Order WhatsApp</span>
              </div>
              <p class="text-2xs text-secondary leading-relaxed">
                Terhubung otomatis dengan tombol pemesanan WhatsApp toko Anda.
              </p>
            </div>

            <!-- Benefit 4 -->
            <div class="p-3.5 rounded-2xl bg-nested/60 border border-light space-y-1 hover:border-primary/30 transition-colors">
              <div class="flex items-center gap-2 text-main font-bold text-xs font-heading">
                <Globe size={15} class="text-primary shrink-0" />
                <span>Subdomain Instan</span>
              </div>
              <p class="text-2xs text-secondary leading-relaxed">
                Langsung tayang online di alamat subdomain toko UMKM Anda seketika.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT COLUMN (md:col-span-5) - Payment Card / Receipt -->
    <div class="md:col-span-5 space-y-6">
      <div class="bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        
        <!-- Header Receipt -->
        <div>
          <h2 class="text-heading-sm font-bold text-main font-heading">
            {checkoutTitle}
          </h2>
          <p class="text-body-xs text-secondary mt-0.5">
            {checkoutDescription}
          </p>
        </div>

        <!-- Invoice Chip with Copy Button -->
        <div class="flex items-center justify-between bg-nested/80 px-3.5 py-2.5 rounded-2xl border border-light">
          <div class="min-w-0">
            <span class="text-2xs text-secondary font-medium uppercase tracking-wider">No. Invoice Tagihan</span>
            <p class="font-mono text-xs font-bold text-main truncate mt-0.5">{pageData.invoiceId}</p>
          </div>
          <button
            type="button"
            class="p-2 rounded-xl bg-card hover:bg-nested text-secondary hover:text-main active:scale-95 transition-all cursor-pointer border border-light shadow-2xs"
            title="Salin Nomor Invoice"
            on:click={copyInvoice}
          >
            {#if copied}
              <Check size={14} class="text-emerald-500" />
            {:else}
              <Copy size={14} />
            {/if}
          </button>
        </div>

        <!-- Transparent Price Breakdown -->
        <div class="space-y-3 pt-1">
          <div class="flex items-center justify-between text-xs">
            <span class="text-secondary">Subtotal Template</span>
            <span class="font-semibold text-main font-mono tabular-nums">{pageData.amountFormatted}</span>
          </div>

          <div class="flex items-center justify-between text-xs">
            <span class="text-secondary">Biaya Transaksi & Gateway</span>
            <div class="flex items-center gap-1.5">
              <span class="line-through text-secondary/60 text-2xs">Rp 4.500</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">Rp 0 (Gratis)</span>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs">
            <span class="text-secondary">Pajak PPN 11%</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">Termasuk</span>
          </div>

          <div class="border-t border-slate-200 dark:border-slate-800 pt-3 flex items-baseline justify-between">
            <div>
              <span class="text-xs font-bold text-main font-heading uppercase tracking-wider">Total Tagihan</span>
              <p class="text-2xs text-secondary">Semua biaya telah termasuk</p>
            </div>
            <span class="text-heading-md font-bold text-main font-mono tabular-nums">
              {pageData.amountFormatted}
            </span>
          </div>
        </div>

        <!-- Expiry Countdown Helper -->
        {#if pageData.status === 'pending'}
          <div class="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2.5 rounded-2xl font-medium">
            <Clock size={15} class="shrink-0 text-amber-500" />
            <span>Selesaikan pembayaran dalam batas <strong class="font-bold">24 Jam</strong></span>
          </div>
        {/if}

        <!-- Primary Action Button -->
        {#if pageData.status === 'pending'}
          <div class="space-y-3 pt-2">
            {#if pageData.paymentUrl}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="font-black text-sm shadow-md hover:shadow-lg active:scale-[0.99] transition-all"
                on:click={openPaymentModal}
              >
                <CreditCard size={18} />
                <span>Bayar Sekarang</span>
              </Button>
            {:else}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="font-black text-sm shadow-md"
                on:click={() => window.location.reload()}
              >
                <RefreshCw size={18} />
                <span>Muat Ulang Halaman</span>
              </Button>
            {/if}

            <TransactionStatus
              {invoiceId}
              onStatusUpdate={(status) => {
                if (status === 'success') {
                  const modal = document.getElementById('payment_modal');
                  if (modal instanceof HTMLDialogElement) {
                    modal.close();
                  }
                  window.location.reload();
                }
              }}
            />
          </div>
        {:else if pageData.status === 'success'}
          <div class="space-y-3 pt-2">
            <Button
              href="/dashboard/templates"
              variant="primary"
              size="lg"
              fullWidth
              className="font-black text-sm shadow-md"
            >
              <Palette size={18} />
              <span>Terapkan ke Toko Saya</span>
            </Button>

            <Button
              href="/dashboard"
              variant="secondary"
              size="md"
              fullWidth
              className="font-bold"
            >
              <LayoutDashboard size={16} />
              <span>Buka Dashboard Toko</span>
            </Button>

            <TransactionStatus {invoiceId} />
          </div>
        {:else}
          <div class="space-y-3 pt-2">
            <Button
              href="/templates"
              variant="primary"
              size="lg"
              fullWidth
              className="font-black text-sm shadow-md"
            >
              <Palette size={18} />
              <span>Pilih Template Lain di Marketplace</span>
            </Button>

            <TransactionStatus {invoiceId} />
          </div>
        {/if}

        <!-- Supported Payment Methods Visual Strip -->
        <div class="pt-3 border-t border-light space-y-2">
          <div class="flex items-center justify-between text-2xs text-secondary">
            <span>Metode Pembayaran Didukung:</span>
            <span class="text-main font-semibold">QRIS, VA Bank, E-Wallet</span>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-1.5 text-2xs text-secondary/70">
            <span class="px-2 py-0.5 rounded-md bg-nested border border-light font-mono font-bold text-2xs">QRIS</span>
            <span class="px-2 py-0.5 rounded-md bg-nested border border-light font-mono font-bold text-2xs">BCA</span>
            <span class="px-2 py-0.5 rounded-md bg-nested border border-light font-mono font-bold text-2xs">Mandiri</span>
            <span class="px-2 py-0.5 rounded-md bg-nested border border-light font-mono font-bold text-2xs">BNI</span>
            <span class="px-2 py-0.5 rounded-md bg-nested border border-light font-mono font-bold text-2xs">BRI</span>
            <span class="px-2 py-0.5 rounded-md bg-nested border border-light font-mono font-bold text-2xs">GoPay</span>
            <span class="px-2 py-0.5 rounded-md bg-nested border border-light font-mono font-bold text-2xs">OVO</span>
          </div>
        </div>

        <!-- Security & Support Guarantee Footer -->
        <div class="pt-3 border-t border-light space-y-2 text-center">
          <div class="flex items-center justify-center gap-1.5 text-2xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <Lock size={13} />
            <span>Enkripsi SSL 256-Bit & Aktivasi Otomatis</span>
          </div>
          <p class="text-2xs text-secondary">
            Butuh bantuan transaksi? <a href="/contact" class="text-primary hover:underline font-semibold">Hubungi Kami</a>
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Payment Gateway Modal -->
  {#if pageData.paymentUrl}
    <PaymentModal
      paymentUrl={pageData.paymentUrl}
      onClose={() => {}}
    />
  {/if}
</main>
