<script lang="ts">
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let badgeText: string = 'Premium Barber & Grooming';
  export let tagName: string = 'h1';
  export let title: string = 'Potongan Rapi, Tampil Percaya Diri Setiap Saat';
  export let subtitle: string = 'Pelayanan ramah dengan kapster ahli dan produk perawatan premium untuk menunjang gaya Anda.';
  export let ctaText: string = 'Konfirmasi Jadwal via WhatsApp';
  export let waNumber: string = '';
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  let selectedService = 'Haircut + Wash + Pomade (Rp 50.000)';
  let userPhone = '';

  const handleBooking = () => {
    const text = `Halo, saya ingin booking layanan: ${selectedService}. No kontak saya: ${userPhone || '-'}`;
    const url = generateWhatsAppLink(waNumber, text);
    window.open(url, '_blank');
  };
</script>

<div class="py-10">
  <div class="cq-grid-split items-center">
    <div class="text-left">
      {#if badgeText}
        <span
          data-node="badge"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'badge')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'badge')}
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[var(--theme-text-primary,#0f172a)] text-xs font-semibold mb-6 cursor-pointer"
        >
          {badgeText}
        </span>
      {/if}

      <svelte:element
        this={tagName || 'h1'}
        data-node="title"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'title')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'title')}
        class="cq-title-lg font-extrabold text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-4 cursor-pointer"
      >
        {title}
      </svelte:element>

      <div
        data-node="subtitle"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'subtitle')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'subtitle')}
        class="cursor-pointer mb-4"
      >
        <p class="text-base text-[var(--theme-text-muted,#64748b)] leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div class="flex items-center gap-4 text-xs text-[var(--theme-text-muted,#64748b)] font-medium pt-2">
        <span>📍 Lokasi Strategis</span>
        <span>☕ Free Wi-Fi & Lounge</span>
      </div>
    </div>

    <!-- Booking Form Card -->
    <div data-node="cta" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-lg text-left space-y-3 w-full">
      <h3 class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)]">Jadwalkan Kunjungan</h3>
      <div>
        <label for="service-select" class="block text-[11px] font-semibold text-[var(--theme-text-muted,#64748b)] mb-1">Pilih Layanan</label>
        <select
          id="service-select"
          bind:value={selectedService}
          class="w-full h-9 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-[var(--theme-text-primary,#0f172a)] outline-none"
        >
          <option>Haircut + Wash + Pomade (Rp 50.000)</option>
          <option>Shaving & Hot Towel (Rp 35.000)</option>
          <option>Paket Full Grooming (Rp 75.000)</option>
        </select>
      </div>
      <div>
        <label for="phone-input" class="block text-[11px] font-semibold text-[var(--theme-text-muted,#64748b)] mb-1">Nomor WhatsApp Anda</label>
        <input
          id="phone-input"
          type="text"
          bind:value={userPhone}
          placeholder="0812xxxxxxx"
          class="w-full h-9 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-[var(--theme-text-primary,#0f172a)] outline-none"
        />
      </div>
      <button
        type="button"
        on:click={handleBooking}
        style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 16px); background-color: var(--theme-primary, #0f172a); color: var(--theme-btn-primary-text, #ffffff);"
        class="w-full mt-2 text-xs font-bold hover:opacity-90 active:scale-[0.98] transition-all"
      >
        {ctaText || 'Konfirmasi Jadwal via WhatsApp'}
      </button>
    </div>
  </div>
</div>
