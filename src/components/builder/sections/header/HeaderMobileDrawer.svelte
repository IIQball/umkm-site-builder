<script lang="ts">
  import { onMount } from 'svelte';
  import { X, ChevronDown, MessageCircle, Clock, MapPin, Bike, ShieldCheck, CheckCircle2, Zap } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { generateWhatsAppLink } from '@/lib/whatsapp';
  import { stripEmoji } from './headerIcons';
  import { navigateToSection } from './headerNav.helpers';

  export let isOpen: boolean = false;
  export let onClose: () => void;
  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let activePreset: string = 'default_split';
  export let waNumber: string = '';
  export let ctaText: string = 'Chat WA';
  export let storeHours: string = 'Buka: 08.00 - 21.00 WIB';
  export let address: string = 'Jakarta, Indonesia';
  export let storeStatus: string = 'Toko Buka';
  export let categories: Array<{ id?: string; name: string; slug?: string; description?: string; desc?: string; href?: string }> = [];

  $: navLinks = Array.isArray(props?.navLinks) && props.navLinks.length > 0
    ? props.navLinks
    : ['Beranda', 'Produk', 'Tentang', 'Kontak'];

  let isCategoriesOpen = false;

  $: defaultCategories = [
    { name: 'Makanan & Kuliner', desc: 'Aneka snack & kuliner khas', href: '#produk' },
    { name: 'Fashion & Pakaian', desc: 'Batik & busana muslim', href: '#produk' },
    { name: 'Kerajinan Tangan', desc: 'Karya seni handmade lokal', href: '#produk' },
    { name: 'Minuman Segar', desc: 'Kopi & minuman herbal', href: '#produk' },
  ];

  // Kategori toko tenant otomatis didahulukan; desainer builder menggunakan props.categories
  $: displayCategories = (Array.isArray(categories) && categories.length > 0)
    ? categories
    : ((Array.isArray(props?.categories) && props.categories.length > 0)
        ? props.categories
        : defaultCategories);

  $: waUrl = generateWhatsAppLink(waNumber, (props?.whatsappTemplate as string) || '');

  // Safe countdown timer tanpa bug NaN
  let countdownSecs = 14400;
  let timerInterval: any = null;

  $: {
    const rawH = Number(props?.promoDurationHours);
    const validH = (Number.isFinite(rawH) && rawH > 0) ? rawH : 4;
    countdownSecs = validH * 3600;
  }

  onMount(() => {
    timerInterval = setInterval(() => {
      if (countdownSecs > 0) countdownSecs--;
    }, 1000);
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  });

  $: timerHours = Math.floor(countdownSecs / 3600);
  $: timerMinutes = Math.floor((countdownSecs % 3600) / 60);
  $: timerSeconds = countdownSecs % 60;
  $: formattedCountdown = `${String(timerHours).padStart(2, '0')} Jam ${String(timerMinutes).padStart(2, '0')} Mnt ${String(timerSeconds).padStart(2, '0')} Dtk`;
</script>

{#if isOpen}
  <!-- Backdrop Overlay -->
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
    on:click|stopPropagation={onClose}
    aria-label="Tutup Menu"></div>

  <!-- Drawer Panel: True overlay dropping down right below navbar, internal scroll, NO parent resize -->
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div
    class="absolute inset-x-0 top-full z-50 shadow-2xl transition-all duration-200 ease-out max-h-[80vh] overflow-y-auto"
    style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); padding-top: 16px; padding-bottom: 24px; background-color: var(--theme-surface, var(--color-card-base, white)); color: var(--theme-text-primary, var(--color-text-main)); border-bottom: 1px solid var(--color-border); font-family: var(--theme-font-body, inherit);"
    on:click|stopPropagation
  >
    <!-- Drawer Header with Logo & Close Button (min 44x44px) -->
    <div
      style="border-bottom: 1px solid var(--color-border);"
      class="flex items-center justify-between pb-3 mb-3"
    >
      <div class="flex items-center gap-2">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
      <button
        type="button"
        on:click|stopPropagation={onClose}
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); border: 1px solid var(--color-border); background-color: var(--theme-surface, var(--color-card-base, transparent)); color: var(--theme-text-primary, var(--color-text-main));"
        class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors cursor-pointer hover:bg-[var(--color-nested-base)]"
        aria-label="Tutup Menu"
      >
        <X size={20} />
      </button>
    </div>

    <!-- Top Bar / Badges Info for Presets -->
    {#if activePreset === 'top_contact_bar'}
      <div
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--color-nested-base); border: 1px solid var(--color-border); font-family: var(--theme-font-body, inherit);"
        class="mb-4 p-3 text-xs space-y-2"
      >
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-success,#10b981)]">
            <span class="w-2 h-2 rounded-full bg-[var(--color-success,#10b981)] animate-pulse"></span>
            {storeStatus}
          </span>
          <span style="color: var(--theme-text-muted, var(--color-text-muted)); font-size: calc(var(--theme-text-caption, 12px) * 0.9);" class="flex items-center gap-1">
            <Clock size={12} class="text-[var(--color-success,#10b981)]" /> {storeHours}
          </span>
        </div>
        <div
          style="border-top: 1px solid var(--color-border); color: var(--theme-text-muted, var(--color-text-muted)); font-size: calc(var(--theme-text-caption, 12px) * 0.9);"
          class="flex items-center gap-1.5 pt-1.5"
        >
          <MapPin size={12} class="text-[var(--theme-primary,var(--color-primary))] flex-shrink-0" />
          <span class="truncate">{address}</span>
        </div>
      </div>
    {:else if activePreset === 'store_badge_highlight'}
      <div
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--color-nested-base); border: 1px solid var(--color-border); font-family: var(--theme-font-body, inherit);"
        class="mb-4 p-2.5 text-xs flex items-center gap-2"
      >
        <span
          style="border-radius: calc(var(--theme-btn-radius, var(--btn-radius, 8px)) * 0.75); background-color: color-mix(in srgb, var(--theme-primary, var(--color-primary)) 12%, transparent); color: var(--theme-primary, var(--color-primary)); border: 1px solid color-mix(in srgb, var(--theme-primary, var(--color-primary)) 30%, transparent); font-size: calc(var(--theme-text-caption, 12px) * 0.9);"
          class="inline-flex items-center gap-1 px-2 py-0.5 font-semibold"
        >
          <ShieldCheck size={12} class="flex-shrink-0" />
          <span>{stripEmoji(props.bpomText) || 'BPOM Terdaftar'}</span>
        </span>
        <span
          style="border-radius: calc(var(--theme-btn-radius, var(--btn-radius, 8px)) * 0.75); background-color: color-mix(in srgb, var(--theme-secondary, var(--color-secondary, #f97316)) 12%, transparent); color: var(--theme-secondary, var(--color-secondary, #f97316)); border: 1px solid color-mix(in srgb, var(--theme-secondary, var(--color-secondary, #f97316)) 30%, transparent); font-size: calc(var(--theme-text-caption, 12px) * 0.9);"
          class="inline-flex items-center gap-1 px-2 py-0.5 font-semibold"
        >
          <CheckCircle2 size={12} class="flex-shrink-0" />
          <span>{stripEmoji(props.halalText) || 'Halal MUI'}</span>
        </span>
      </div>
    {:else if activePreset === 'delivery_order_cta'}
      <div
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: color-mix(in srgb, var(--theme-secondary, var(--color-secondary, #f97316)) 10%, transparent); border: 1px solid color-mix(in srgb, var(--theme-secondary, var(--color-secondary, #f97316)) 25%, transparent); color: var(--theme-text-primary, var(--color-text-main)); font-family: var(--theme-font-body, inherit);"
        class="mb-4 p-2.5 text-xs space-y-1"
      >
        <div style="color: var(--theme-secondary, var(--color-secondary, #ea580c)); font-size: calc(var(--theme-text-caption, 12px) * 0.9);" class="font-semibold flex items-center gap-1.5">
          <Bike size={14} class="flex-shrink-0" style="color: var(--theme-secondary, var(--color-secondary, #ea580c));" />
          <span>{stripEmoji(props.deliveryText) || 'Siap Kirim Instan: Estimasi 30 Menit'}</span>
        </div>
        <div class="text-[10px] opacity-80 pl-5">
          {stripEmoji(props.deliveryPartners) || 'Tersedia GrabFood & GoFood'}
        </div>
      </div>
    {:else if activePreset === 'promo_countdown_banner'}
      <div
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background: linear-gradient(90deg, var(--theme-secondary, var(--color-secondary, #dc2626)), var(--theme-primary, var(--color-primary, #e11d48))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-body, inherit);"
        class="mb-4 p-2.5 text-xs space-y-1 shadow-xs"
      >
        <div class="font-bold text-[11px] flex items-center justify-between">
          <span class="inline-flex items-center gap-1.5">
            <Zap size={13} class="fill-current text-amber-300" />
            <span>{stripEmoji(props.promoTitle) || 'FLASH SALE'}</span>
          </span>
          <span
            style="border-radius: calc(var(--theme-btn-radius, var(--btn-radius, 8px)) * 0.5);"
            class="text-[10px] font-mono bg-black/30 px-2 py-0.5"
          >
            {formattedCountdown}
          </span>
        </div>
      </div>
    {/if}

    <!-- Navigation Links -->
    <nav class="flex flex-col space-y-1 py-1">
      {#each navLinks as link}
        <a
          href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
          on:click={(e) => {
            onClose();
            navigateToSection(e, link);
          }}
          style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); color: var(--theme-text-primary, var(--color-text-main)); font-family: var(--theme-font-body, inherit); font-size: var(--theme-text-body, var(--text-body-size, 14px)); font-weight: var(--text-body-weight, 500);"
          class="flex items-center justify-between px-3 py-2.5 hover:bg-[var(--color-nested-base)] hover:text-[var(--theme-primary,var(--color-primary))] transition-colors cursor-pointer"
        >
          <span>{link}</span>
        </a>
      {/each}

      <!-- Mega Menu Product Category Accordion -->
      {#if activePreset === 'mega_menu_dropdown'}
        <div class="pt-1">
          <button
            type="button"
            on:click={() => (isCategoriesOpen = !isCategoriesOpen)}
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); color: var(--theme-text-primary, var(--color-text-main)); font-family: var(--theme-font-body, inherit); font-size: var(--theme-text-body, var(--text-body-size, 14px)); font-weight: var(--text-body-weight, 500);"
            class="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[var(--color-nested-base)] transition-colors cursor-pointer"
          >
            <span>Kategori Produk</span>
            <ChevronDown size={16} class={`transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180 text-[var(--theme-primary,var(--color-primary))]' : 'text-slate-400'}`} />
          </button>

          {#if isCategoriesOpen}
            <div class="pl-3 pr-1 py-1 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
              {#each displayCategories as cat}
                <a
                  href={cat.href || '#produk'}
                  on:click={(e) => {
                    onClose();
                    navigateToSection(e, cat.href || '#produk');
                  }}
                  style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--color-nested-base); border: 1px solid var(--color-border);"
                  class="flex flex-col px-3 py-2 hover:bg-[var(--color-card-base)] transition-colors cursor-pointer"
                >
                  <span
                    style="font-family: var(--theme-font-heading, inherit); color: var(--theme-text-primary, var(--color-text-main)); font-size: var(--theme-text-caption, 12px); font-weight: var(--text-h3-weight, 600);"
                    class="block"
                  >{cat.name}</span>
                  {#if cat.desc || cat.description}
                    <span
                      style="color: var(--theme-text-muted, var(--color-text-muted)); font-size: calc(var(--theme-text-caption, 12px) * 0.85);"
                      class="block"
                    >{cat.desc || cat.description}</span>
                  {/if}
                </a>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </nav>

    <!-- WhatsApp Action Button (CTA) -->
    <div
      style="border-top: 1px solid var(--color-border);"
      class="pt-4 mt-2"
    >
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        style="height: 44px; border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px)); border: none;"
        class="w-full inline-flex items-center justify-center gap-2 font-bold shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
      >
        <MessageCircle size={16} />
        <span>{ctaText}</span>
      </a>
    </div>
  </div>
{/if}
