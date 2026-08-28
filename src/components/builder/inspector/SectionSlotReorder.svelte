<script lang="ts">
  import { Layers, ArrowUp, ArrowDown } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../stores/editorStore';

  export let section: TemplateSection;

  const defaultSlotsBySection: Record<string, string[]> = {
    hero: ['badge', 'title', 'subtitle', 'image', 'cta'],
    header_announcement: ['announcement_bar', 'logo', 'nav_links', 'cta'],
    faq: ['title', 'subtitle', 'faq_list'],
    features: ['title', 'subtitle', 'features_grid'],
  };

  const slotLabels: Record<string, string> = {
    badge: 'Promo Badge',
    title: 'Judul Heading',
    subtitle: 'Deskripsi Subtitle',
    image: 'Gambar / Visual Media',
    cta: 'Tombol CTA',
    announcement_bar: 'Announcement Bar',
    logo: 'Logo & Brand',
    nav_links: 'Menu Navigasi',
    faq_list: 'Daftar Pertanyaan FAQ',
    features_grid: 'Daftar Keunggulan',
  };

  $: elementOrder = (section.props?.elementOrder as string[]) || defaultSlotsBySection[section.type] || [];

  const handleMoveSlot = (fromIdx: number, direction: -1 | 1) => {
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= elementOrder.length) return;
    editorStore.reorderSectionSlot(section.id, fromIdx, toIdx);
  };
</script>

{#if elementOrder.length > 1}
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <Layers size={13} class="text-[var(--theme-primary,#2563eb)]" />
      <span>Urutan Slot Elemen</span>
    </div>

    <div class="space-y-1.5">
      {#each elementOrder as slot, index}
        <div class="flex items-center justify-between p-2 rounded-lg bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 text-xs">
          <span class="font-medium text-base-content">{slotLabels[slot] || slot}</span>
          <div class="flex items-center gap-1">
            <button
              type="button"
              disabled={index === 0}
              on:click={() => handleMoveSlot(index, -1)}
              class="p-1 rounded bg-base-100 hover:bg-base-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Pindah ke Atas"
            >
              <ArrowUp size={12} />
            </button>
            <button
              type="button"
              disabled={index === elementOrder.length - 1}
              on:click={() => handleMoveSlot(index, 1)}
              class="p-1 rounded bg-base-100 hover:bg-base-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Pindah ke Bawah"
            >
              <ArrowDown size={12} />
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
