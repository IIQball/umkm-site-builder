<script lang="ts">
  import { Sparkles, Plus, Trash2 } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import type { FooterMenuLink } from '@/types';
  import { DEFAULT_MENU_LINKS } from '../../sections/footer/footer.helpers';

  export let section: TemplateSection;
  export let nodeId: string | null = null;
  export let onPropChange: (prop: string, val: unknown) => void;

  $: props = section.props || {};
  $: activePreset = (section.layoutPreset || props.layoutPreset || section.styles?.layoutPreset || 'multi_column') as string;

  $: tagline = (props.tagline as string) || (props.description as string) || '';
  $: whatsappNumber = (props.whatsappNumber as string) || '';
  $: address = (props.address as string) || '';
  $: storeHours = (props.storeHours as string) || '';

  $: floatingCtaTitle = (props.floatingCtaTitle as string) || '';
  $: floatingCtaSubtitle = (props.floatingCtaSubtitle as string) || '';
  $: floatingCtaButtonText = (props.floatingCtaButtonText as string) || '';

  $: newsletterBadge = (props.newsletterBadge as string) || '';
  $: newsletterTitle = (props.newsletterTitle as string) || '';
  $: newsletterSubtitle = (props.newsletterSubtitle as string) || '';
  $: newsletterButtonText = (props.newsletterButtonText as string) || '';

  $: statusBadgeText = (props.statusBadgeText as string) || '';
  $: statusBadgeSubtext = (props.statusBadgeSubtext as string) || '';
  $: statusChatButtonText = (props.statusChatButtonText as string) || '';

  $: boxedOfficialBadge = (props.boxedOfficialBadge as string) || '';
  $: boxedPrimaryCtaText = (props.boxedPrimaryCtaText as string) || '';
  $: boxedPrimaryCtaLink = (props.boxedPrimaryCtaLink as string) || '';
  $: boxedSecondaryCtaText = (props.boxedSecondaryCtaText as string) || '';

  $: communityTitle = (props.communityTitle as string) || '';
  $: communitySubtitle = (props.communitySubtitle as string) || '';
  $: googleMapsUrl = (props.googleMapsUrl as string) || '';
  $: copyrightText = (props.copyrightText as string) || '';

  $: menuLinks = (Array.isArray(props.footerLinks) && props.footerLinks.length > 0
    ? props.footerLinks
    : Array.isArray(props.menuLinks) && props.menuLinks.length > 0
      ? props.menuLinks
      : DEFAULT_MENU_LINKS) as FooterMenuLink[];

  function updateLink(idx: number, field: keyof FooterMenuLink, val: string) {
    const updated = menuLinks.map((item, i) => (i === idx ? { ...item, [field]: val } : item));
    onPropChange('footerLinks', updated);
    onPropChange('menuLinks', updated);
  }

  function addLink() {
    const newLinks = [...menuLinks, { label: 'Tautan Baru', url: '#products' }];
    onPropChange('footerLinks', newLinks);
    onPropChange('menuLinks', newLinks);
  }

  function removeLink(idx: number) {
    if (menuLinks.length <= 1) return;
    const newLinks = menuLinks.filter((_, i) => i !== idx);
    onPropChange('footerLinks', newLinks);
    onPropChange('menuLinks', newLinks);
  }
</script>

<div class="space-y-4 text-left">
  {#if nodeId === 'footer_brand' || nodeId === 'footer_brand_logo'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Identitas & Logo Brand</h4>
      <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl space-y-1">
        <div class="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold text-xs">
          <Sparkles size={13} />
          <span>Tersinkronisasi Otomatis</span>
        </div>
        <p class="text-[11px] text-base-content/70">
          Nama toko dan logo di footer otomatis tersinkronisasi dari Header agar selalu konsisten di seluruh halaman.
        </p>
      </div>
      {#if activePreset === 'boxed_card_footer'}
        <div>
          <label for="b-badge" class="block text-xs font-semibold text-base-content/70 mb-1">Badge Resmi</label>
          <input id="b-badge" type="text" value={boxedOfficialBadge} on:input={(e) => onPropChange('boxedOfficialBadge', e.currentTarget.value)} placeholder="Gerai Resmi UMKM" class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
        </div>
      {/if}
      <div>
        <label for="b-tagline" class="block text-xs font-semibold text-base-content/70 mb-1">Deskripsi / Tagline Toko</label>
        <textarea id="b-tagline" rows="2" value={tagline} on:input={(e) => { onPropChange('tagline', e.currentTarget.value); onPropChange('description', e.currentTarget.value); }} placeholder="Pelopor kuliner khas nusantara..." class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs resize-y"></textarea>
      </div>
    </div>

  {:else if nodeId === 'footer_contact'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Kontak & Alamat Toko</h4>
      <div>
        <label for="c-wa" class="block text-xs font-semibold text-base-content/70 mb-1">Nomor WhatsApp</label>
        <input id="c-wa" type="text" value={whatsappNumber} on:input={(e) => onPropChange('whatsappNumber', e.currentTarget.value)} placeholder="6281234567890" class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-mono" />
      </div>
      <div>
        <label for="c-addr" class="block text-xs font-semibold text-base-content/70 mb-1">Alamat Fisik</label>
        <textarea id="c-addr" rows="2" value={address} on:input={(e) => onPropChange('address', e.currentTarget.value)} placeholder="Jl. Raya Sukowati No. 42..." class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs resize-y"></textarea>
      </div>
      <div>
        <label for="c-hrs" class="block text-xs font-semibold text-base-content/70 mb-1">Jam Operasional</label>
        <input id="c-hrs" type="text" value={storeHours} on:input={(e) => onPropChange('storeHours', e.currentTarget.value)} placeholder="08.00 - 21.00 WIB" class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
      </div>
      {#if activePreset === 'centered_simple' || activePreset === 'live_status_badge'}
        <div>
          <label for="c-btn" class="block text-xs font-semibold text-base-content/70 mb-1">Teks Tombol Chat</label>
          <input id="c-btn" type="text" value={statusChatButtonText} on:input={(e) => onPropChange('statusChatButtonText', e.currentTarget.value)} placeholder="Chat Admin" class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
        </div>
      {/if}
      {#if activePreset === 'boxed_card_footer'}
        <div class="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label for="b-cta1-t" class="block text-xs font-semibold text-base-content/70 mb-1">Teks CTA 1</label>
            <input id="b-cta1-t" type="text" value={boxedPrimaryCtaText} on:input={(e) => onPropChange('boxedPrimaryCtaText', e.currentTarget.value)} placeholder="Katalog Resmi" class="w-full px-2 py-1 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
          </div>
          <div>
            <label for="b-cta1-l" class="block text-xs font-semibold text-base-content/70 mb-1">Link CTA 1</label>
            <input id="b-cta1-l" type="text" value={boxedPrimaryCtaLink} on:input={(e) => onPropChange('boxedPrimaryCtaLink', e.currentTarget.value)} placeholder="#products" class="w-full px-2 py-1 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
          </div>
        </div>
        <div>
          <label for="b-cta2-t" class="block text-xs font-semibold text-base-content/70 mb-1">Teks CTA 2</label>
          <input id="b-cta2-t" type="text" value={boxedSecondaryCtaText} on:input={(e) => onPropChange('boxedSecondaryCtaText', e.currentTarget.value)} placeholder="Konsultasi" class="w-full px-2 py-1 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
        </div>
      {/if}
    </div>

  {:else if nodeId === 'footer_navigation'}
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Tautan Menu Navigasi</h4>
        <button type="button" on:click={addLink} class="px-2 py-1 bg-primary text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer"><Plus size={12} /> Tambah</button>
      </div>
      <div class="space-y-2">
        {#each menuLinks as link, idx}
          <div class="p-2 rounded-xl bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-base-content/50">Menu #{idx + 1}</span>
              <button type="button" on:click={() => removeLink(idx)} class="text-error hover:bg-error/10 p-1 rounded cursor-pointer" title="Hapus"><Trash2 size={12} /></button>
            </div>
            <div class="grid grid-cols-2 gap-1.5">
              <input type="text" value={link.label} on:input={(e) => updateLink(idx, 'label', e.currentTarget.value)} placeholder="Nama Menu" class="px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded text-xs" />
              <input type="text" value={link.url} on:input={(e) => updateLink(idx, 'url', e.currentTarget.value)} placeholder="#products" class="px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded text-xs" />
            </div>
          </div>
        {/each}
      </div>
    </div>

  {:else if nodeId === 'footer_floating_cta'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Banner Floating CTA</h4>
      <div>
        <label for="fl-title" class="block text-xs font-semibold text-base-content/70 mb-1">Judul Penawaran</label>
        <input id="fl-title" type="text" value={floatingCtaTitle} on:input={(e) => onPropChange('floatingCtaTitle', e.currentTarget.value)} placeholder="Ingin Pesan Menu Katering?" class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
      </div>
      <div>
        <label for="fl-sub" class="block text-xs font-semibold text-base-content/70 mb-1">Subjudul</label>
        <textarea id="fl-sub" rows="2" value={floatingCtaSubtitle} on:input={(e) => onPropChange('floatingCtaSubtitle', e.currentTarget.value)} class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs resize-y"></textarea>
      </div>
      <div>
        <label for="fl-btn" class="block text-xs font-semibold text-base-content/70 mb-1">Teks Tombol</label>
        <input id="fl-btn" type="text" value={floatingCtaButtonText} on:input={(e) => onPropChange('floatingCtaButtonText', e.currentTarget.value)} placeholder="Chat Sekarang" class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
      </div>
    </div>

  {:else if nodeId === 'footer_newsletter'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Form Langganan Promo WA</h4>
      <div>
        <label for="nl-b" class="block text-xs font-semibold text-base-content/70 mb-1">Badge Promo</label>
        <input id="nl-b" type="text" value={newsletterBadge} on:input={(e) => onPropChange('newsletterBadge', e.currentTarget.value)} placeholder="Voucher Diskon 15%" class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
      </div>
      <div>
        <label for="nl-t" class="block text-xs font-semibold text-base-content/70 mb-1">Judul Utama</label>
        <input id="nl-t" type="text" value={newsletterTitle} on:input={(e) => onPropChange('newsletterTitle', e.currentTarget.value)} placeholder="Dapatkan Info Promo" class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
      </div>
      <div>
        <label for="nl-s" class="block text-xs font-semibold text-base-content/70 mb-1">Subjudul</label>
        <textarea id="nl-s" rows="2" value={newsletterSubtitle} on:input={(e) => onPropChange('newsletterSubtitle', e.currentTarget.value)} class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs resize-y"></textarea>
      </div>
      <div>
        <label for="nl-bt" class="block text-xs font-semibold text-base-content/70 mb-1">Teks Tombol Form</label>
        <input id="nl-bt" type="text" value={newsletterButtonText} on:input={(e) => onPropChange('newsletterButtonText', e.currentTarget.value)} placeholder="Daftar Promo" class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
      </div>
    </div>

  {:else if nodeId === 'footer_status_badge'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Bilah Status Operasional Toko</h4>
      <div>
        <label for="st-t" class="block text-xs font-semibold text-base-content/70 mb-1">Teks Status Toko</label>
        <input id="st-t" type="text" value={statusBadgeText} on:input={(e) => onPropChange('statusBadgeText', e.currentTarget.value)} placeholder="TOKO BUKA" class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
      </div>
      <div>
        <label for="st-s" class="block text-xs font-semibold text-base-content/70 mb-1">Subteks Operasional</label>
        <input id="st-s" type="text" value={statusBadgeSubtext} on:input={(e) => onPropChange('statusBadgeSubtext', e.currentTarget.value)} placeholder="Siap Menerima Pesanan" class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
      </div>
    </div>

  {:else if nodeId === 'footer_mini_map'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Peta Mini Lokasi</h4>
      <div>
        <label for="m-url" class="block text-xs font-semibold text-base-content/70 mb-1">URL Google Maps / Query</label>
        <input id="m-url" type="text" value={googleMapsUrl} on:input={(e) => onPropChange('googleMapsUrl', e.currentTarget.value)} placeholder="https://maps.google.com/maps?q=..." class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
      </div>
    </div>

  {:else if nodeId === 'footer_socials'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Ubin Tautan Sosial Media</h4>
      <div>
        <label for="so-t" class="block text-xs font-semibold text-base-content/70 mb-1">Judul Showcase</label>
        <input id="so-t" type="text" value={communityTitle} on:input={(e) => onPropChange('communityTitle', e.currentTarget.value)} placeholder="Terhubung dengan Kami" class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
      </div>
      <div>
        <label for="so-s" class="block text-xs font-semibold text-base-content/70 mb-1">Subjudul</label>
        <textarea id="so-s" rows="2" value={communitySubtitle} on:input={(e) => onPropChange('communitySubtitle', e.currentTarget.value)} class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs resize-y"></textarea>
      </div>
    </div>

  {:else if nodeId === 'footer_copyright'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Baris Hak Cipta (Copyright)</h4>
      <div>
        <label for="cr-val" class="block text-xs font-semibold text-base-content/70 mb-1">Teks Hak Cipta</label>
        <input id="cr-val" type="text" value={copyrightText} on:input={(e) => onPropChange('copyrightText', e.currentTarget.value)} placeholder="© 2026 Warung Berkah..." class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs" />
      </div>
    </div>
  {/if}
</div>
