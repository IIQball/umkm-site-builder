<script lang="ts">
  import { Plus, Trash2, ExternalLink } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { FooterMenuLink } from '@/types';

  export let menuLinks: FooterMenuLink[] = [];
  export let onPropChange: (prop: string, val: unknown) => void;

  export const SECTION_TARGET_OPTIONS = [
    { label: 'Beranda (Hero Banner)', value: '#hero', defaultName: 'Beranda' },
    { label: 'Keunggulan & Fitur', value: '#features', defaultName: 'Keunggulan' },
    { label: 'Katalog Produk', value: '#products', defaultName: 'Katalog' },
    { label: 'Tanya Jawab (FAQ)', value: '#faq', defaultName: 'Tanya Jawab' },
    { label: 'Lokasi Gerai (Peta)', value: '#maps', defaultName: 'Lokasi Toko' },
    { label: 'Ulasan Pelanggan', value: '#testimonials', defaultName: 'Testimoni' },
    { label: 'Kontak & Info Footer', value: '#footer', defaultName: 'Kontak Kami' },
    { label: 'Tautan Kustom / Luar Web...', value: 'custom', defaultName: 'Link Luar' },
  ];

  function getSelectedTarget(url: string): string {
    const found = SECTION_TARGET_OPTIONS.find((opt) => opt.value === url);
    return found ? found.value : 'custom';
  }

  function handleTargetChange(idx: number, targetValue: string) {
    const updated = [...menuLinks];
    const current = updated[idx];
    if (targetValue === 'custom') {
      updated[idx] = {
        ...current,
        url: current.url.startsWith('#') ? 'https://' : current.url,
      };
    } else {
      const option = SECTION_TARGET_OPTIONS.find((opt) => opt.value === targetValue);
      const isDefaultLabel = !current.label || SECTION_TARGET_OPTIONS.some((opt) => opt.defaultName === current.label);
      updated[idx] = {
        ...current,
        url: targetValue,
        label: isDefaultLabel && option ? option.defaultName : current.label,
      };
    }
    updateLinks(updated);
  }

  function updateLinkField(idx: number, field: keyof FooterMenuLink, val: string) {
    const updated = menuLinks.map((item, i) => (i === idx ? { ...item, [field]: val } : item));
    updateLinks(updated);
  }

  function addLink() {
    const newLinks = [...menuLinks, { label: 'Katalog', url: '#products' }];
    updateLinks(newLinks);
  }

  function removeLink(idx: number) {
    if (menuLinks.length <= 1) return;
    const newLinks = menuLinks.filter((_, i) => i !== idx);
    updateLinks(newLinks);
  }

  function updateLinks(links: FooterMenuLink[]) {
    onPropChange('footerLinks', links);
    onPropChange('menuLinks', links);
  }
</script>

<div class="space-y-3">
  <div class="flex items-center justify-between">
    <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Tautan Menu Navigasi</h4>
    <Button
      type="button"
      variant="primary"
      size="xs"
      on:click={addLink}
      class="!h-auto !min-h-0 !py-1 !px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1"
    >
      <Plus size={12} /> Tambah Menu
    </Button>
  </div>

  <div class="space-y-2">
    {#each menuLinks as link, idx}
      {@const selectedTarget = getSelectedTarget(link.url)}
      <div class="p-2.5 rounded-xl bg-base-200/50 border border-base-300 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold text-base-content/60">Menu #{idx + 1}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            on:click={() => removeLink(idx)}
            disabled={menuLinks.length <= 1}
            class="!w-6 !h-6 !min-h-0 !p-1 text-error hover:bg-error/10 rounded disabled:opacity-30"
            title="Hapus Menu"
          >
            <Trash2 size={12} />
          </Button>
        </div>

        <div class="space-y-1.5">
          <div>
            <label for={`link-label-${idx}`} class="block text-[10px] font-semibold text-base-content/70 mb-0.5">
              Nama Teks Menu
            </label>
            <input
              id={`link-label-${idx}`}
              type="text"
              value={link.label}
              on:input={(e) => updateLinkField(idx, 'label', e.currentTarget.value)}
              placeholder="Contoh: Katalog Produk"
              class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label for={`link-target-${idx}`} class="block text-[10px] font-semibold text-base-content/70 mb-0.5">
              Tujuan Halaman (Bagian Seksi)
            </label>
            <select
              id={`link-target-${idx}`}
              value={selectedTarget}
              on:change={(e) => handleTargetChange(idx, e.currentTarget.value)}
              class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded-lg text-xs text-base-content focus:outline-none focus:border-primary cursor-pointer font-medium"
            >
              {#each SECTION_TARGET_OPTIONS as opt}
                <option value={opt.value}>{opt.label}</option>
              {/each}
            </select>
          </div>

          {#if selectedTarget === 'custom'}
            <div class="pt-0.5">
              <label for={`link-url-${idx}`} class="block text-[10px] font-semibold text-base-content/70 mb-0.5 flex items-center gap-1">
                <ExternalLink size={10} />
                <span>URL Tautan Kustom</span>
              </label>
              <input
                id={`link-url-${idx}`}
                type="text"
                value={link.url}
                on:input={(e) => updateLinkField(idx, 'url', e.currentTarget.value)}
                placeholder="https://..."
                class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded-lg text-xs font-mono"
              />
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
