<script lang="ts">
  import { Clock, CreditCard, HelpCircle, ArrowUpRight } from 'lucide-svelte';
  import { Card } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';

  export let minPayoutLimit = 50000;
  export let settlementDelayDays = 7;
</script>

<Card
  variant="bordered"
  padding="none"
  radius="2xl"
  class="shadow-xs overflow-hidden h-full flex flex-col justify-between"
>
  <!-- Guidelines List -->
  <div class="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-center">
    <div class="flex items-start gap-3">
      <div class="w-7 h-7 rounded-lg bg-nested flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
        <CreditCard size={15} />
      </div>
      <div>
        <h4 class="text-xs font-bold text-main font-heading">Batas Minimum Penarikan</h4>
        <p class="text-2xs text-secondary leading-relaxed font-sans">
          Penarikan dana dapat diajukan dengan saldo minimum <span class="font-bold text-main">{formatIDR(minPayoutLimit)}</span> per transaksi pencairan.
        </p>
      </div>
    </div>

    <div class="flex items-start gap-3">
      <div class="w-7 h-7 rounded-lg bg-nested flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
        <Clock size={15} />
      </div>
      <div>
        <h4 class="text-xs font-bold text-main font-heading">Masa Tunggu Settlement</h4>
        <p class="text-2xs text-secondary leading-relaxed font-sans">
          Komisi fee penjualan template tertahan selama <span class="font-bold text-main">{settlementDelayDays} hari</span> sebelum dialihkan ke saldo siap tarik.
        </p>
      </div>
    </div>

    <div class="flex items-start gap-3">
      <div class="w-7 h-7 rounded-lg bg-nested flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
        <HelpCircle size={15} />
      </div>
      <div>
        <h4 class="text-xs font-bold text-main font-heading">Rekening Terverifikasi</h4>
        <p class="text-2xs text-secondary leading-relaxed font-sans">
          Maksimal hingga 3 rekening bank tujuan yang dapat disimpan. Pastikan nama pemilik rekening sesuai identitas Anda.
        </p>
      </div>
    </div>
  </div>

  <!-- Card Footer -->
  <div class="px-5 py-3.5 sm:px-6 bg-nested/50 border-t border-light flex items-center justify-between">
    <span class="text-3xs text-secondary font-medium font-sans">
      Pencairan otomatis diproses transfer antar-bank
    </span>
    <a
      href="/admin/transactions"
      class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
    >
      <span>Riwayat Faktur</span>
      <ArrowUpRight size={14} />
    </a>
  </div>
</Card>
