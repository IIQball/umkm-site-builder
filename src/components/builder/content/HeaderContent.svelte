<script lang="ts">
  import { MessageCircle } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from './content.helpers';
  import HeaderLogoContent from './header/HeaderLogoContent.svelte';
  import HeaderMegaMenuContent from './header/HeaderMegaMenuContent.svelte';
  import HeaderTopBarContent from './header/HeaderTopBarContent.svelte';
  import {
    getHeaderTopBarType,
    headerSupportsCta,
  } from '../sections/header/headerLayout.helpers';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);

  $: activePreset =
    (section.layoutPreset as string) ||
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    'default_split';

  $: topBarType = getHeaderTopBarType(activePreset);
  $: supportsCta = headerSupportsCta(activePreset);
  $: isStoreBadge = activePreset === 'store_badge_highlight';
  $: showAnnouncement = (section.props?.showAnnouncement as boolean) ?? true;
</script>

<div class="space-y-6">
  <!-- 1. Konfigurasi Bilah Atas & Lencana Legalitas -->
  <HeaderTopBarContent
    {section}
    {handlePropChange}
    {topBarType}
    {isStoreBadge}
    {showAnnouncement}
  />

  <!-- 2. Pengaturan Konten Kategori Mega Menu (Khusus preset mega_menu_dropdown) -->
  {#if activePreset === 'mega_menu_dropdown'}
    <HeaderMegaMenuContent {section} {handlePropChange} />
  {/if}

  <!-- 3. Logo Brand & Toko -->
  <HeaderLogoContent {section} {handlePropChange} />

  <!-- 4. Tombol WhatsApp (CTA) - Hanya ditampilkan jika preset mendukung CTA -->
  {#if supportsCta}
    <div class="space-y-3 p-3 bg-base-200/40 rounded-xl border border-base-200">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
        <MessageCircle size={14} class="text-emerald-500" />
        <span>Tombol Pesan WhatsApp (CTA)</span>
      </div>

      <div class="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <MessageCircle size={15} class="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div>
            <span class="font-bold block text-[11px]">Nomor WhatsApp Otomatis</span>
            <span class="text-[10px] opacity-80">Terhubung otomatis dengan nomor WhatsApp toko yang aktif.</span>
          </div>
        </div>
      </div>

      <div>
        <label for="header-cta-text" class="block font-medium text-[11px] text-base-content/70 mb-1">
          Teks Tombol WhatsApp
        </label>
        <input
          id="header-cta-text"
          type="text"
          value={section.props?.ctaText ?? 'Chat WA'}
          on:input={(e) => handlePropChange('ctaText', e.currentTarget.value)}
          class="input input-bordered input-xs w-full"
          placeholder="Chat WA"
        />
      </div>
    </div>
  {/if}
</div>
