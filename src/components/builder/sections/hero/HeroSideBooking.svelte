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
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'booking_card'];

  let selectedService = 'Haircut + Wash + Pomade (Rp 50.000)';
  let userPhone = '';

  $: hasBooking = elementOrder.includes('booking_card');
  $: bookingIdx = elementOrder.indexOf('booking_card');
  $: titleIdx = elementOrder.indexOf('title') !== -1 ? elementOrder.indexOf('title') : 1;
  $: isBookingLeft = bookingIdx !== -1 ? bookingIdx < titleIdx : false;
  $: isBookingActive = activeNodeId === 'hero_booking_card' || activeNodeId === 'booking_card';

  const handleBooking = () => {
    const text = `Halo, saya ingin booking layanan: ${selectedService}. No kontak saya: ${userPhone || '-'}`;
    const url = generateWhatsAppLink(waNumber, text);
    window.open(url, '_blank');
  };
</script>

<div class="py-10">
  {#if !hasBooking}
    <div class="max-w-2xl mx-auto text-center space-y-4">
      <HeroHeaderContent
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {waNumber}
        {activeNodeId}
        {selectNode}
        {selectNodeKey}
        {elementOrder}
        align="center"
      />
      <div class="flex items-center justify-center gap-4 text-xs text-[var(--color-text-secondary)] font-medium pt-2">
        <span>📍 Lokasi Strategis</span>
        <span>☕ Free Wi-Fi & Lounge</span>
      </div>
    </div>
  {:else}
    <div class="cq-grid-split items-center gap-8">
      {#if isBookingLeft}
        <!-- Booking Form Card (Kiri) -->
        <div
          data-node="hero_booking_card"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'hero_booking_card')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_booking_card')}
          class={`card bg-[var(--color-card-base)] border border-[var(--color-border)] p-6 rounded-2xl shadow-lg text-left space-y-4 w-full transition-all cursor-pointer ${
            isBookingActive
              ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
              : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
          }`}
        >
          <h3 class="font-heading font-bold text-sm text-[var(--color-text-main)]">Jadwalkan Kunjungan</h3>
          <div>
            <label for="service-select" class="block text-[11px] font-semibold text-[var(--color-text-secondary)] mb-1">Pilih Layanan</label>
            <select
              id="service-select"
              bind:value={selectedService}
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--color-nested-base); border-color: var(--color-border); color: var(--color-text-main);"
              class="select select-bordered select-sm w-full h-10 text-xs font-normal"
            >
              <option>Haircut + Wash + Pomade (Rp 50.000)</option>
              <option>Shaving & Hot Towel (Rp 35.000)</option>
              <option>Paket Full Grooming (Rp 75.000)</option>
            </select>
          </div>
          <div>
            <label for="phone-input" class="block text-[11px] font-semibold text-[var(--color-text-secondary)] mb-1">Nomor WhatsApp Anda</label>
            <input
              id="phone-input"
              type="text"
              bind:value={userPhone}
              placeholder="0812xxxxxxx"
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--color-nested-base); border-color: var(--color-border); color: var(--color-text-main);"
              class="input input-bordered input-sm w-full h-10 text-xs"
            />
          </div>
          <button
            type="button"
            on:click={handleBooking}
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, currentColor);"
            class="btn btn-primary btn-sm w-full h-10 text-xs font-heading font-semibold shadow-xs"
          >
            {ctaText || 'Konfirmasi Jadwal via WhatsApp'}
          </button>
        </div>

        <!-- Text Content (Kanan) -->
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
            {elementOrder}
            align="left"
          />
          <div class="flex items-center gap-4 text-xs text-[var(--color-text-secondary)] font-medium pt-2">
            <span>📍 Lokasi Strategis</span>
            <span>☕ Free Wi-Fi & Lounge</span>
          </div>
        </div>
      {:else}
        <!-- Text Content (Kiri) -->
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
            {elementOrder}
            align="left"
          />
          <div class="flex items-center gap-4 text-xs text-[var(--color-text-secondary)] font-medium pt-2">
            <span>📍 Lokasi Strategis</span>
            <span>☕ Free Wi-Fi & Lounge</span>
          </div>
        </div>

        <!-- Booking Form Card (Kanan) -->
        <div
          data-node="hero_booking_card"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'hero_booking_card')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_booking_card')}
          class={`card bg-[var(--color-card-base)] border border-[var(--color-border)] p-6 rounded-2xl shadow-lg text-left space-y-4 w-full transition-all cursor-pointer ${
            isBookingActive
              ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
              : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
          }`}
        >
          <h3 class="font-heading font-bold text-sm text-[var(--color-text-main)]">Jadwalkan Kunjungan</h3>
          <div>
            <label for="service-select" class="block text-[11px] font-semibold text-[var(--color-text-secondary)] mb-1">Pilih Layanan</label>
            <select
              id="service-select"
              bind:value={selectedService}
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--color-nested-base); border-color: var(--color-border); color: var(--color-text-main);"
              class="select select-bordered select-sm w-full h-10 text-xs font-normal"
            >
              <option>Haircut + Wash + Pomade (Rp 50.000)</option>
              <option>Shaving & Hot Towel (Rp 35.000)</option>
              <option>Paket Full Grooming (Rp 75.000)</option>
            </select>
          </div>
          <div>
            <label for="phone-input" class="block text-[11px] font-semibold text-[var(--color-text-secondary)] mb-1">Nomor WhatsApp Anda</label>
            <input
              id="phone-input"
              type="text"
              bind:value={userPhone}
              placeholder="0812xxxxxxx"
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--color-nested-base); border-color: var(--color-border); color: var(--color-text-main);"
              class="input input-bordered input-sm w-full h-10 text-xs"
            />
          </div>
          <button
            type="button"
            on:click={handleBooking}
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, currentColor);"
            class="btn btn-primary btn-sm w-full h-10 text-xs font-heading font-semibold shadow-xs"
          >
            {ctaText || 'Konfirmasi Jadwal via WhatsApp'}
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>
