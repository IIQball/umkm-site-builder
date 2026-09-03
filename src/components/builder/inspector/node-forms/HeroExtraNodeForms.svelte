<script lang="ts">
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: waNumber = (section.props?.whatsappNumber as string) || (section.props?.waNumber as string) || '';
</script>

{#if nodeId === 'hero_booking_card'}
  <div class="space-y-3">
    <div class="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl space-y-1">
      <p class="font-semibold text-xs text-base-content">Form Reservasi / Booking Cepat</p>
      <p class="text-[11px] text-base-content/60">Pesanan booking otomatis diarahkan ke nomor WhatsApp pemilik toko.</p>
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="hero-booking-wa">Nomor WhatsApp Booking</label>
      <input
        id="hero-booking-wa"
        type="text"
        value={waNumber}
        on:input={(e) => onPropChange('whatsappNumber', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-mono"
        placeholder="628123456789"
      />
    </div>
  </div>
{:else if nodeId === 'hero_chat_simulation'}
  <div class="space-y-3">
    <div class="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl space-y-1">
      <p class="font-semibold text-xs text-base-content">Simulasi Bubble Chat WA</p>
      <p class="text-[11px] text-base-content/60">Menampilkan interaksi chat ramah yang memicu konversi pembelian cepat.</p>
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="hero-chat-wa">Nomor WhatsApp Toko</label>
      <input
        id="hero-chat-wa"
        type="text"
        value={waNumber}
        on:input={(e) => onPropChange('whatsappNumber', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-mono"
        placeholder="628123456789"
      />
    </div>
  </div>
{:else if nodeId === 'hero_stat_counter'}
  <div class="space-y-3">
    <div class="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl space-y-1">
      <p class="font-semibold text-xs text-base-content">Metrik Statistik Angka</p>
      <p class="text-[11px] text-base-content/60">Menampilkan 3 baris metrik pembuktian kepuasan konsumen (Social Proof).</p>
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="hero-stat-note">Catatan Metrik</label>
      <input
        id="hero-stat-note"
        type="text"
        disabled
        value="25.000+ Porsi | 4.9/5.0 Rating | 100% Halal"
        class="w-full px-3 py-1.5 bg-base-200/30 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content/60"
      />
    </div>
  </div>
{:else if nodeId === 'hero_bento_promo' || nodeId === 'hero_bento_review'}
  <div class="space-y-3">
    <div class="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl space-y-1">
      <p class="font-semibold text-xs text-base-content">Ubin Bento Tambahan</p>
      <p class="text-[11px] text-base-content/60">Ubin promo diskon & ulasan testimoni pembeli terverifikasi.</p>
    </div>
  </div>
{:else if nodeId === 'hero_pill_category'}
  <div class="space-y-3">
    <div class="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl space-y-1">
      <p class="font-semibold text-xs text-base-content">Filter Kategori Pill</p>
      <p class="text-[11px] text-base-content/60">Pengunjung dapat memilah kategori produk favorit langsung dari banner hero.</p>
    </div>
  </div>
{:else if nodeId === 'hero_email_capture'}
  <div class="space-y-3">
    <div class="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl space-y-1">
      <p class="font-semibold text-xs text-base-content">Form Email Input</p>
      <p class="text-[11px] text-base-content/60">Penangkap prospek email atau nomor kontak pelanggan baru.</p>
    </div>
  </div>
{:else if nodeId === 'hero_social_proof'}
  <div class="space-y-3">
    <div class="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl space-y-1">
      <p class="font-semibold text-xs text-base-content">Avatar Komunitas & Rating</p>
      <p class="text-[11px] text-base-content/60">Avatar tumpuk dan rating bintang 5 meningkatkan kepercayaan calon pembeli.</p>
    </div>
  </div>
{/if}
