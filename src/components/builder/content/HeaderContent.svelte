<script lang="ts">
  import { Plus, Trash2, ChevronUp, ChevronDown, Megaphone, Image as ImageIcon, Menu, Clock, MapPin, MessageCircle, Zap, Bike, ShieldCheck } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import {
    makeHandlePropChange,
    makeHandleAddArrayItem,
    makeHandleRemoveArrayItem,
    makeHandleMoveArrayItem,
  } from './content.helpers';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: handleAddArrayItem = makeHandleAddArrayItem(section, onUpdate);
  $: handleRemoveArrayItem = makeHandleRemoveArrayItem(section, onUpdate);
  $: handleMoveArrayItem = makeHandleMoveArrayItem(section, onUpdate);

  $: activePreset = (section.layoutPreset as string) || (section.props?.layoutPreset as string) || (section.styles?.layoutPreset as string) || 'default_split';
  $: isNoAnnouncement = ['compact_inline', 'transparent_glass_header', 'floating_pill_island'].includes(activePreset);
  $: isTopContactBar = activePreset === 'top_contact_bar';

  $: showAnnouncement = (section.props?.showAnnouncement as boolean) ?? true;
  $: logoType = section.props?.logoType || 'image_text';
  $: navLinks = (section.props?.navLinks as string[]) || [];
</script>

<div class="space-y-6">
  <!-- Top Contact Bar Configuration (for top_contact_bar preset) -->
  {#if isTopContactBar}
    <div class="space-y-3 p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
        <Clock size={14} class="text-emerald-500" />
        <span>Info Kontak & Jam Operasional</span>
      </div>

      <div>
        <label for="store-hours" class="block font-medium text-[11px] text-base-content/70 mb-1">
          Jam Operasional Toko
        </label>
        <input
          id="store-hours"
          type="text"
          value={section.props?.storeHours ?? 'Buka: 08.00 - 21.00 WIB'}
          on:input={(e) => handlePropChange('storeHours', e.currentTarget.value)}
          class="w-full px-3 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="Buka: 08.00 - 21.00 WIB"
        />
      </div>

      <div>
        <label for="store-address" class="flex items-center gap-1 font-medium text-[11px] text-base-content/70 mb-1">
          <MapPin size={11} class="text-blue-500" />
          <span>Alamat Toko Singkat</span>
        </label>
        <input
          id="store-address"
          type="text"
          value={section.props?.address ?? 'Jakarta, Indonesia'}
          on:input={(e) => handlePropChange('address', e.currentTarget.value)}
          class="w-full px-3 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="Jakarta, Indonesia"
        />
      </div>

      <div>
        <label for="store-status" class="block font-medium text-[11px] text-base-content/70 mb-1">
          Teks Status Toko
        </label>
        <input
          id="store-status"
          type="text"
          value={section.props?.storeStatus ?? 'Toko Buka'}
          on:input={(e) => handlePropChange('storeStatus', e.currentTarget.value)}
          class="w-full px-3 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="Toko Buka"
        />
      </div>
    </div>
  {:else if !isNoAnnouncement}
    <!-- 1. Editable Announcement Bar Configuration -->
    <div class="space-y-3 p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
          <Megaphone size={14} class="text-blue-500" />
          <span>Announcement & Teks Promo</span>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showAnnouncement}
            on:change={(e) => handlePropChange('showAnnouncement', e.currentTarget.checked)}
            class="sr-only peer"
          />
          <div class="w-8 h-4 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {#if showAnnouncement}
        <div class="space-y-2">
          <div>
            <label for="announcement-text" class="block font-medium text-[11px] text-base-content/70 mb-1">
              Teks Pengumuman / Broadcast Promo
            </label>
            <input
              id="announcement-text"
              type="text"
              value={section.props?.announcementText ?? ''}
              on:input={(e) => handlePropChange('announcementText', e.currentTarget.value)}
              class="w-full px-3 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs placeholder-base-content/40 focus:outline-none focus:border-blue-500"
              placeholder="Diskon 20% khusus pesanan hari ini..."
            />
          </div>

          <div>
            <label for="free-shipping-text" class="block font-medium text-[11px] text-base-content/70 mb-1">
              Ketentuan Gratis Ongkir / Benefit Toko
            </label>
            <input
              id="free-shipping-text"
              type="text"
              value={section.props?.freeShippingText ?? ''}
              on:input={(e) => handlePropChange('freeShippingText', e.currentTarget.value)}
              class="w-full px-3 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs placeholder-base-content/40 focus:outline-none focus:border-blue-500"
              placeholder="Gratis ongkir min. belanja Rp 250rb"
            />
          </div>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Preset Specific Options -->
  {#if activePreset === 'promo_countdown_banner'}
    <div class="space-y-3 p-3 bg-rose-500/10 rounded-xl border border-rose-500/30">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
        <Zap size={14} class="fill-current text-rose-500" />
        <span>Konfigurasi Promo Countdown</span>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label for="promo-title" class="block font-medium text-[11px] text-base-content/70 mb-1">Judul Promo</label>
          <input
            id="promo-title"
            type="text"
            value={section.props?.promoTitle ?? '⚡ FLASH SALE'}
            on:input={(e) => handlePropChange('promoTitle', e.currentTarget.value)}
            class="w-full px-3 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs focus:outline-none focus:border-rose-500"
            placeholder="⚡ FLASH SALE"
          />
        </div>
        <div>
          <label for="promo-duration" class="block font-medium text-[11px] text-base-content/70 mb-1">Durasi (Jam)</label>
          <input
            id="promo-duration"
            type="number"
            min="1"
            max="72"
            value={section.props?.promoDurationHours ?? 4}
            on:input={(e) => handlePropChange('promoDurationHours', Number(e.currentTarget.value) || 4)}
            class="w-full px-3 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs focus:outline-none focus:border-rose-500"
            placeholder="4"
          />
        </div>
      </div>
    </div>

  {:else if activePreset === 'delivery_order_cta'}
    <div class="space-y-3 p-3 bg-orange-500/10 rounded-xl border border-orange-500/30">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-orange-700 dark:text-orange-300">
        <Bike size={14} class="text-orange-500" />
        <span>Konfigurasi Pesan Delivery</span>
      </div>
      <div>
        <label for="delivery-text" class="block font-medium text-[11px] text-base-content/70 mb-1">Info Layanan Kirim</label>
        <input
          id="delivery-text"
          type="text"
          value={section.props?.deliveryText ?? '🛵 Siap Kirim Instan: Estimasi 30 Menit'}
          on:input={(e) => handlePropChange('deliveryText', e.currentTarget.value)}
          class="w-full px-3 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs focus:outline-none focus:border-orange-500"
        />
      </div>
      <div>
        <label for="delivery-partners" class="block font-medium text-[11px] text-base-content/70 mb-1">Mitra Kurir</label>
        <input
          id="delivery-partners"
          type="text"
          value={section.props?.deliveryPartners ?? 'Tersedia GrabFood & GoFood'}
          on:input={(e) => handlePropChange('deliveryPartners', e.currentTarget.value)}
          class="w-full px-3 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs focus:outline-none focus:border-orange-500"
        />
      </div>
    </div>

  {:else if activePreset === 'store_badge_highlight'}
    <div class="space-y-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
        <ShieldCheck size={14} class="text-emerald-500" />
        <span>Badges Legalitas Toko</span>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label for="bpom-text" class="block font-medium text-[11px] text-base-content/70 mb-1">Badge 1</label>
          <input
            id="bpom-text"
            type="text"
            value={section.props?.bpomText ?? '✓ BPOM'}
            on:input={(e) => handlePropChange('bpomText', e.currentTarget.value)}
            class="w-full px-3 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label for="halal-text" class="block font-medium text-[11px] text-base-content/70 mb-1">Badge 2</label>
          <input
            id="halal-text"
            type="text"
            value={section.props?.halalText ?? '✓ Halal MUI'}
            on:input={(e) => handlePropChange('halalText', e.currentTarget.value)}
            class="w-full px-3 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  {/if}

  <!-- 2. Logo Configuration -->
  <div class="space-y-3 p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800">
    <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
      <ImageIcon size={14} class="text-blue-500" />
      <span>Logo Brand Toko</span>
    </div>

    <div>
      <span class="block font-medium text-[11px] text-base-content/70 mb-1">Tipe Tampilan Logo</span>
      <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
        <button
          type="button"
          on:click={() => handlePropChange('logoType', 'image_only')}
          class={`py-1 rounded font-medium transition-colors cursor-pointer ${
            logoType === 'image_only' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          Gambar
        </button>
        <button
          type="button"
          on:click={() => handlePropChange('logoType', 'text_only')}
          class={`py-1 rounded font-medium transition-colors cursor-pointer ${
            logoType === 'text_only' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          Teks
        </button>
        <button
          type="button"
          on:click={() => handlePropChange('logoType', 'image_text')}
          class={`py-1 rounded font-medium transition-colors cursor-pointer ${
            logoType === 'image_text' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          Kombinasi
        </button>
      </div>
    </div>

    {#if logoType === 'text_only' || logoType === 'image_text'}
      <div>
        <label for="logo-text" class="block font-medium text-[11px] text-base-content/70 mb-1">
          Nama Toko / Brand
        </label>
        <input
          id="logo-text"
          type="text"
          value={section.props?.logoText ?? ''}
          on:input={(e) => handlePropChange('logoText', e.currentTarget.value)}
          class="w-full px-3 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="Nama Brand UMKM"
        />
      </div>
    {/if}

    {#if logoType === 'image_only' || logoType === 'image_text'}
      <!-- Bentuk Logo: Kotak vs Bulat -->
      <div>
        <span class="block font-medium text-[11px] text-base-content/70 mb-1">Bentuk Logo</span>
        <div class="grid grid-cols-2 gap-1.5 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
          <button
            type="button"
            on:click={() => handlePropChange('logoShape', 'square')}
            class={`py-1 rounded font-medium transition-colors cursor-pointer ${
              (section.props?.logoShape || 'square') === 'square' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
            }`}
          >
            Kotak / Default
          </button>
          <button
            type="button"
            on:click={() => handlePropChange('logoShape', 'circle')}
            class={`py-1 rounded font-medium transition-colors cursor-pointer ${
              section.props?.logoShape === 'circle' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
            }`}
          >
            Bulat (Circle)
          </button>
        </div>
      </div>

      <!-- File Picker Logo Langsung -->
      <div>
        <label for="header-logo-upload" class="block font-medium text-[11px] text-base-content/70 mb-1">Upload File Logo</label>
        <input
          id="header-logo-upload"
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          class="block w-full text-xs text-base-content/70 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          on:change={async (e) => {
            const file = e.currentTarget.files?.[0];
            if (!file) return;
            const signRes = await fetch('/api/media/sign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ folder: 'templates' }) });
            if (!signRes.ok) return;
            const { data: signData } = await signRes.json();
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', signData.apiKey);
            formData.append('timestamp', signData.timestamp);
            formData.append('signature', signData.signature);
            formData.append('folder', signData.folder);
            const cloudRes = await fetch(signData.uploadUrl, { method: 'POST', body: formData });
            if (!cloudRes.ok) return;
            const cloudData = await cloudRes.json();
            handlePropChange('logoImageUrl', cloudData.secure_url);
          }}
        />
      </div>
    {/if}
  </div>

  <!-- 3. Navigation Menu Links -->
  <div class="space-y-3 p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800">
    <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
      <Menu size={14} class="text-blue-500" />
      <span>Menu Navigasi</span>
    </div>

    <div class="space-y-2">
      {#each navLinks as link, index}
        <div class="flex items-center gap-1.5 p-1 bg-base-100 dark:bg-slate-950/80 border border-base-300 dark:border-slate-800 rounded-lg">
          <input
            type="text"
            value={link}
            on:input={(e) => {
              const updated = [...navLinks];
              updated[index] = e.currentTarget.value;
              handlePropChange('navLinks', updated);
            }}
            class="flex-1 px-2.5 py-1 bg-transparent text-xs text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
            placeholder="Nama Menu"
          />
          <div class="flex items-center">
            <button
              type="button"
              on:click={() => handleMoveArrayItem('navLinks', index, 'up')}
              disabled={index === 0}
              class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              title="Pindah ke Atas"
            >
              <ChevronUp size={13} />
            </button>
            <button
              type="button"
              on:click={() => handleMoveArrayItem('navLinks', index, 'down')}
              disabled={index === navLinks.length - 1}
              class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              title="Pindah ke Bawah"
            >
              <ChevronDown size={13} />
            </button>
            <button
              type="button"
              on:click={() => handleRemoveArrayItem('navLinks', index)}
              class="p-1 text-base-content/50 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors cursor-pointer ml-0.5"
              title="Hapus Menu"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      {/each}
      <button
        type="button"
        on:click={() => handleAddArrayItem('navLinks', 'Menu Baru')}
        class="w-full flex items-center justify-center gap-1 py-1.5 border border-dashed border-base-300 dark:border-slate-700 rounded-md text-xs text-base-content/60 hover:text-blue-500 hover:border-blue-500 transition-colors cursor-pointer"
      >
        <Plus size={13} />
        <span>Tambah Menu Navigasi</span>
      </button>
    </div>
  </div>

  <!-- 4. Tombol Aksi WhatsApp (CTA) -->
  <div class="space-y-3 p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800">
    <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
      <MessageCircle size={14} class="text-emerald-500" />
      <span>Tombol WhatsApp (CTA)</span>
    </div>

    <!-- Info SSOT WhatsApp Store Number -->
    <div class="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <MessageCircle size={15} class="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <div>
          <span class="font-bold block text-[11px]">No. WhatsApp Otomatis (SSOT)</span>
          <span class="text-[10px] opacity-80">Terintegrasi otomatis dari data `stores.waNumber`.</span>
        </div>
      </div>
    </div>

    <div>
      <label for="header-cta-text" class="block font-medium text-[11px] text-base-content/70 mb-1">
        Teks Tombol CTA
      </label>
      <input
        id="header-cta-text"
        type="text"
        value={section.props?.ctaText ?? 'Chat WA'}
        on:input={(e) => handlePropChange('ctaText', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs placeholder-base-content/40 focus:outline-none focus:border-blue-500"
        placeholder="Chat WA"
      />
    </div>
  </div>
</div>
