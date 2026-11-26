<script lang="ts">
  import { Plus, Trash2, Share2, Phone, ExternalLink } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { FooterSocialLink } from '@/types';
  import { DEFAULT_SOCIAL_LINKS } from '../../sections/footer/footer.helpers';
  import { normalizeWhatsAppNumber } from '@/lib/whatsapp';

  export let socialLinks: FooterSocialLink[] = [];
  export let communityTitle: string = '';
  export let communitySubtitle: string = '';
  export let onPropChange: (prop: string, val: unknown) => void;

  const PLATFORM_OPTIONS = [
    { value: 'whatsapp', label: 'WhatsApp', defaultSubtext: 'Fast Response' },
    { value: 'instagram', label: 'Instagram', defaultSubtext: '@toko.official' },
    { value: 'tiktok', label: 'TikTok', defaultSubtext: 'Video Menu' },
    { value: 'facebook', label: 'Facebook', defaultSubtext: 'Halaman Toko' },
    { value: 'shopee', label: 'Shopee Official', defaultSubtext: 'Toko Online' },
    { value: 'tokopedia', label: 'Tokopedia', defaultSubtext: 'Official Store' },
    { value: 'youtube', label: 'YouTube Channel', defaultSubtext: 'Vlog & Resep' },
    { value: 'twitter', label: 'X (Twitter)', defaultSubtext: '@toko.official' },
    { value: 'other', label: 'Tautan Lainnya', defaultSubtext: 'Kunjungi Link' },
  ];

  $: effectiveLinks = Array.isArray(socialLinks) && socialLinks.length > 0
    ? socialLinks
    : DEFAULT_SOCIAL_LINKS;

  function updateLinks(items: FooterSocialLink[]) {
    onPropChange('socialLinks', items);
    onPropChange('footerSocialLinks', items);
  }

  function handlePlatformChange(idx: number, newPlatform: string) {
    const opt = PLATFORM_OPTIONS.find((p) => p.value === newPlatform);
    const updated = effectiveLinks.map((item, i) => {
      if (i !== idx) return item;
      let url = item.url;
      if (newPlatform === 'whatsapp' && !url.includes('wa.me')) {
        const clean = normalizeWhatsAppNumber(item.handle || item.url);
        url = clean ? `https://wa.me/${clean}` : 'https://wa.me/6281234567890';
      }
      return {
        ...item,
        platform: newPlatform,
        label: opt ? opt.label : item.label,
        subtext: opt ? opt.defaultSubtext : item.subtext,
        url,
      };
    });
    updateLinks(updated);
  }

  function updateItem(idx: number, field: keyof FooterSocialLink, val: string) {
    const updated = effectiveLinks.map((item, i) => (i === idx ? { ...item, [field]: val } : item));
    updateLinks(updated);
  }

  function getWaDisplayNumber(url?: string, handle?: string): string {
    const match = (url || '').match(/wa\.me\/(\d+)/);
    if (match && match[1]) {
      const raw = match[1];
      return raw.startsWith('62') ? '0' + raw.slice(2) : raw;
    }
    const handleDigits = (handle || '').replace(/\D/g, '');
    if (handleDigits.length >= 8) {
      return handleDigits.startsWith('62') ? '0' + handleDigits.slice(2) : handleDigits;
    }
    const urlDigits = (url || '').replace(/\D/g, '');
    if (urlDigits.length >= 8) {
      return urlDigits.startsWith('62') ? '0' + urlDigits.slice(2) : urlDigits;
    }
    return '';
  }

  function handleWaPhoneChange(idx: number, rawInput: string) {
    const cleanNumber = normalizeWhatsAppNumber(rawInput);
    const waUrl = cleanNumber ? `https://wa.me/${cleanNumber}` : '';
    const updated = effectiveLinks.map((item, i) => {
      if (i !== idx) return item;
      return {
        ...item,
        url: waUrl,
        handle: rawInput.trim() || item.handle,
      };
    });
    updateLinks(updated);
  }

  function addSocialLink() {
    const newLink: FooterSocialLink = {
      platform: 'instagram',
      label: 'Instagram',
      subtext: '@toko.official',
      url: 'https://instagram.com',
    };
    updateLinks([...effectiveLinks, newLink]);
  }

  function removeSocialLink(idx: number) {
    if (effectiveLinks.length <= 1) return;
    const updated = effectiveLinks.filter((_, i) => i !== idx);
    updateLinks(updated);
  }
</script>

<div class="space-y-4">
  <!-- Section Title & Subtitle -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-base-content/70">
      <Share2 size={13} class="text-primary" />
      <span>Judul Ubin Media Sosial</span>
    </div>
    <div>
      <label for="so-title" class="block text-[11px] font-semibold text-base-content/80 mb-1">Judul Showcase</label>
      <input
        id="so-title"
        type="text"
        value={communityTitle}
        on:input={(e) => onPropChange('communityTitle', e.currentTarget.value)}
        placeholder="Terhubung dengan Kami di Sosial Media"
        class="w-full px-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs focus:outline-none focus:border-primary"
      />
    </div>
    <div>
      <label for="so-sub" class="block text-[11px] font-semibold text-base-content/80 mb-1">Deskripsi Subjudul</label>
      <textarea
        id="so-sub"
        rows="2"
        value={communitySubtitle}
        on:input={(e) => onPropChange('communitySubtitle', e.currentTarget.value)}
        placeholder="Ikuti info pembaruan menu harian dan promo menarik..."
        class="w-full px-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs resize-y focus:outline-none focus:border-primary"
      ></textarea>
    </div>
  </div>

  <!-- Social Media & Marketplace Links List -->
  <div class="space-y-3 pt-2.5 border-t border-base-200">
    <div class="flex items-center justify-between">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/70">
        Daftar Tautan Sosial & Marketplace ({effectiveLinks.length})
      </h4>
      <Button
        type="button"
        variant="primary"
        size="xs"
        on:click={addSocialLink}
        class="!h-auto !min-h-0 !py-1 !px-2.5 rounded-lg text-[11px] font-semibold flex items-center gap-1"
      >
        <Plus size={12} /> Tambah
      </Button>
    </div>

    <div class="space-y-3">
      {#each effectiveLinks as item, idx}
        <div class="p-3 rounded-xl bg-base-100 border border-base-200 shadow-2xs space-y-2.5">
          <!-- Card Header: Number & Delete Action -->
          <div class="flex items-center justify-between border-b border-base-200/80 pb-2">
            <div class="flex items-center gap-2">
              <span class="badge badge-sm badge-ghost font-bold text-[10px]">
                #{idx + 1}
              </span>
              <span class="text-xs font-bold text-base-content">
                {item.label || 'Tautan Media Sosial'}
              </span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              on:click={() => removeSocialLink(idx)}
              disabled={effectiveLinks.length <= 1}
              class="!w-6 !h-6 !min-h-0 !p-1 text-error hover:bg-error/10 rounded disabled:opacity-30"
              title="Hapus tautan ini"
            >
              <Trash2 size={13} />
            </Button>
          </div>

          <!-- Row 1: Platform & Nama Label -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label for={`so-plat-${idx}`} class="block text-[11px] font-semibold text-base-content/80 mb-1">
                Platform
              </label>
              <select
                id={`so-plat-${idx}`}
                value={item.platform}
                on:change={(e) => handlePlatformChange(idx, e.currentTarget.value)}
                class="w-full px-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-medium cursor-pointer focus:outline-none focus:border-primary"
              >
                {#each PLATFORM_OPTIONS as opt}
                  <option value={opt.value}>{opt.label}</option>
                {/each}
              </select>
            </div>

            <div>
              <label for={`so-label-${idx}`} class="block text-[11px] font-semibold text-base-content/80 mb-1">
                Nama Label
              </label>
              <input
                id={`so-label-${idx}`}
                type="text"
                value={item.label || ''}
                on:input={(e) => updateItem(idx, 'label', e.currentTarget.value)}
                placeholder="WhatsApp / Instagram"
                class="w-full px-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <!-- Row 2: Subteks / Handle -->
          <div>
            <label for={`so-sub-${idx}`} class="block text-[11px] font-semibold text-base-content/80 mb-1">
              Subteks / Catatan Singkat
            </label>
            <input
              id={`so-sub-${idx}`}
              type="text"
              value={item.subtext || item.handle || ''}
              on:input={(e) => {
                updateItem(idx, 'subtext', e.currentTarget.value);
                updateItem(idx, 'handle', e.currentTarget.value);
              }}
              placeholder="Contoh: Fast Response atau @toko.official"
              class="w-full px-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <!-- Row 3: WhatsApp Phone Number OR Social URL (Full Width) -->
          <div>
            {#if item.platform === 'whatsapp'}
              <label for={`so-wa-${idx}`} class="block text-[11px] font-semibold text-base-content/80 mb-1">
                Nomor WhatsApp Toko
              </label>
              <div class="relative flex items-center">
                <div class="absolute left-2.5 text-success pointer-events-none">
                  <Phone size={13} />
                </div>
                <input
                  id={`so-wa-${idx}`}
                  type="tel"
                  value={getWaDisplayNumber(item.url, item.handle)}
                  on:input={(e) => handleWaPhoneChange(idx, e.currentTarget.value)}
                  placeholder="Contoh: 081234567890"
                  class="w-full pl-8 pr-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-mono focus:outline-none focus:border-primary"
                />
              </div>
              <div class="mt-1 flex items-center justify-between text-[10px] text-base-content/60">
                <span>Tersimpan otomatis:</span>
                <span class="font-mono text-primary font-medium truncate max-w-[200px]" title={item.url}>
                  {item.url || 'https://wa.me/...'}
                </span>
              </div>
            {:else}
              <label for={`so-url-${idx}`} class="block text-[11px] font-semibold text-base-content/80 mb-1">
                URL Tautan Akun
              </label>
              <div class="relative flex items-center">
                <div class="absolute left-2.5 text-base-content/40 pointer-events-none">
                  <ExternalLink size={13} />
                </div>
                <input
                  id={`so-url-${idx}`}
                  type="url"
                  value={item.url}
                  on:input={(e) => updateItem(idx, 'url', e.currentTarget.value)}
                  placeholder="https://..."
                  class="w-full pl-8 pr-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-mono focus:outline-none focus:border-primary"
                />
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
