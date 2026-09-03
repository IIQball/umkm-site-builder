<script lang="ts">
  import { generateWhatsAppLink } from '@/lib/whatsapp';
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = 'Premium Barber & Grooming';
  export let tagName: string = 'h1';
  export let title: string = 'Potongan Rapi, Tampil Percaya Diri Setiap Saat';
  export let subtitle: string = 'Pelayanan ramah dengan kapster ahli dan produk perawatan premium untuk menunjang gaya Anda.';
  export let ctaText: string = 'Konfirmasi Jadwal via WhatsApp';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  let selectedService = 'Haircut + Wash + Pomade (Rp 50.000)';
  let userPhone = '';

  $: isBookingActive = activeNodeId === 'hero_booking_card' || activeNodeId === 'booking_card';

  const handleBooking = () => {
    const text = `Halo, saya ingin booking layanan: ${selectedService}. No kontak saya: ${userPhone || '-'}`;
    const url = generateWhatsAppLink(waNumber, text);
    window.open(url, '_blank');
  };
</script>

<div class="py-10">
  <div class="cq-grid-split items-center gap-8">
    <div class="text-left space-y-4">
      <HeroHeaderContent
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {waNumber}
        {activeNodeId}
        {selectNode}
        {selectNodeKey}
        align="left"
      />

      <div class="flex items-center gap-4 text-xs text-[var(--color-text-secondary,#334155)] font-medium pt-2">
        <span>📍 Lokasi Strategis</span>
        <span>☕ Free Wi-Fi & Lounge</span>
      </div>
    </div>

    <!-- Booking Form Card (Sub-node hero_booking_card) -->
    <div
      data-node="hero_booking_card"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_booking_card')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_booking_card')}
      class={`bg-[var(--color-card-base,#ffffff)] border border-[var(--color-border,rgba(15,23,42,0.08))] p-6 rounded-2xl shadow-lg text-left space-y-4 w-full transition-all cursor-pointer ${
        isBookingActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <h3 class="font-heading font-bold text-sm text-[var(--color-text-main,#0f172a)]">Jadwalkan Kunjungan</h3>
      <div>
        <label for="service-select" class="block text-[11px] font-semibold text-[var(--color-text-secondary,#334155)] mb-1">Pilih Layanan</label>
        <select
          id="service-select"
          bind:value={selectedService}
          class="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-[var(--color-text-main,#0f172a)] outline-none"
        >
          <option>Haircut + Wash + Pomade (Rp 50.000)</option>
          <option>Shaving & Hot Towel (Rp 35.000)</option>
          <option>Paket Full Grooming (Rp 75.000)</option>
        </select>
      </div>
      <div>
        <label for="phone-input" class="block text-[11px] font-semibold text-[var(--color-text-secondary,#334155)] mb-1">Nomor WhatsApp Anda</label>
        <input
          id="phone-input"
          type="text"
          bind:value={userPhone}
          placeholder="0812xxxxxxx"
          class="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-[var(--color-text-main,#0f172a)] outline-none"
        />
      </div>
      <button
        type="button"
        on:click={handleBooking}
        class="w-full h-10 rounded-2xl bg-[var(--color-primary,#2563eb)] text-white text-xs font-heading font-semibold hover:bg-primary-dark active:scale-[0.98] transition-all shadow-xs"
      >
        {ctaText || 'Konfirmasi Jadwal via WhatsApp'}
      </button>
    </div>
  </div>
</div>
