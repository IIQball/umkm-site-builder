<script lang="ts">
  import { Layers, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trash2, Plus } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../stores/editorStore';
  import {
    headerHasRowOrder,
    getDefaultHeaderRowOrder,
    getDefaultHeaderNavbarOrder,
    getHeaderRowSlotLabel,
    getHeaderNavbarSlotLabel,
  } from '../sections/header/headerLayout.helpers';

  export let section: TemplateSection;
  export let preset: string;

  $: hasRowOrder = headerHasRowOrder(preset);
  $: validRowSlots = getDefaultHeaderRowOrder(preset);
  $: headerRowOrder = (
    Array.isArray(section.props?.rowOrder) && section.props.rowOrder.length > 0
      ? section.props.rowOrder
      : validRowSlots
  ).filter((s: string) => validRowSlots.includes(s));
  $: missingRowSlots = validRowSlots.filter((s) => !headerRowOrder.includes(s));

  $: isHeaderStacked = preset === 'centered_stacked';
  $: validNavbarSlots = getDefaultHeaderNavbarOrder(preset);
  $: headerNavbarOrder = (
    Array.isArray(section.props?.navbarOrder) && section.props.navbarOrder.length > 0
      ? section.props.navbarOrder
      : Array.isArray(section.props?.elementOrder) && section.props.elementOrder.length > 0
        ? section.props.elementOrder
        : validNavbarSlots
  ).filter((s: string) => validNavbarSlots.includes(s));
  $: missingNavbarSlots = validNavbarSlots.filter((s) => !headerNavbarOrder.includes(s));

  const handleMoveGroupSlot = (groupKey: string, currentOrder: string[], fromIdx: number, direction: -1 | 1) => {
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= currentOrder.length) return;
    const order = [...currentOrder];
    const [moved] = order.splice(fromIdx, 1);
    order.splice(toIdx, 0, moved);
    editorStore.updateSectionProps(section.id, { [groupKey]: order });
  };

  const handleDeleteSlot = (groupKey: string, currentOrder: string[], slot: string) => {
    const newOrder = currentOrder.filter((s) => s !== slot);
    editorStore.updateSectionProps(section.id, { [groupKey]: newOrder });
    editorStore.deleteNode(section.id, slot);
  };

  const handleAddSlot = (groupKey: string, currentOrder: string[], slot: string) => {
    if (currentOrder.includes(slot)) return;
    const newOrder = [...currentOrder, slot];
    editorStore.updateSectionProps(section.id, { [groupKey]: newOrder });
    if (slot === 'announcement_bar') {
      editorStore.updateSectionProps(section.id, {
        showAnnouncement: true,
        announcementText: section.props?.announcementText || 'Diskon 20% khusus pesanan hari ini!',
      });
    } else if (slot === 'nav_links') {
      editorStore.updateSectionProps(section.id, {
        navLinks: ['Beranda', 'Produk', 'Tentang', 'Kontak'],
      });
    } else if (slot === 'cta') {
      editorStore.updateSectionProps(section.id, {
        ctaText: 'Chat WA',
      });
    } else if (slot === 'badge') {
      editorStore.updateSectionProps(section.id, {
        badgeText: 'Promo Spesial',
      });
    }
  };
</script>

<div class="space-y-4">
  <!-- Group 1: Tata Letak Baris (Atas - Bawah) -->
  {#if hasRowOrder}
    <div class="space-y-2">
      <div class="flex items-center justify-between border-b border-base-200 dark:border-slate-800 pb-1.5">
        <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70">
          <Layers size={13} class="text-[var(--theme-primary, var(--color-primary))]" />
          <span>Tata Letak Baris</span>
        </div>
        <span class="text-3xs font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-base-200 dark:bg-slate-800 text-base-content/60">
          Atas - Bawah
        </span>
      </div>

      <div class="space-y-1.5">
        {#each headerRowOrder as slot, index}
          <div class="flex items-center justify-between p-2 rounded-lg bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 text-xs">
            <span class="font-medium text-base-content">
              {getHeaderRowSlotLabel(slot, preset)}
            </span>
            <div class="flex items-center gap-1">
              <button
                type="button"
                disabled={index === 0}
                on:click={() => handleMoveGroupSlot('rowOrder', headerRowOrder, index, -1)}
                class="btn btn-ghost btn-xs btn-square bg-base-100 disabled:opacity-30"
                title="Pindah ke Atas"
                aria-label="Pindah ke Atas"
              >
                <ArrowUp size={12} />
              </button>
              <button
                type="button"
                disabled={index === headerRowOrder.length - 1}
                on:click={() => handleMoveGroupSlot('rowOrder', headerRowOrder, index, 1)}
                class="btn btn-ghost btn-xs btn-square bg-base-100 disabled:opacity-30"
                title="Pindah ke Bawah"
                aria-label="Pindah ke Bawah"
              >
                <ArrowDown size={12} />
              </button>
              <button
                type="button"
                on:click={() => handleDeleteSlot('rowOrder', headerRowOrder, slot)}
                class="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-error hover:bg-error/10 ml-0.5"
                title="Hapus Elemen"
                aria-label="Hapus Elemen"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        {/each}

        {#if missingRowSlots.length > 0}
          <div class="flex flex-wrap gap-1 pt-1">
            {#each missingRowSlots as slot}
              <button
                type="button"
                on:click={() => handleAddSlot('rowOrder', headerRowOrder, slot)}
                class="btn btn-ghost btn-xs border border-dashed border-primary/40 text-primary hover:bg-primary/10 gap-1 font-semibold"
              >
                <Plus size={10} />
                <span>Tambah {getHeaderRowSlotLabel(slot, preset)}</span>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Group 2: Elemen Bilah Navigasi -->
  <div class="space-y-2">
    <div class="flex items-center justify-between border-b border-base-200 dark:border-slate-800 pb-1.5">
      <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70">
        <Layers size={13} class="text-[var(--theme-primary, var(--color-primary))]" />
        <span>Elemen Bilah Navigasi</span>
      </div>
      <span class="badge badge-ghost badge-xs font-mono font-semibold uppercase">
        {isHeaderStacked ? 'Atas - Bawah' : 'Kiri - Kanan'}
      </span>
    </div>

    <div class="space-y-1.5">
      {#each headerNavbarOrder as slot, index}
        <div class="flex items-center justify-between p-2 rounded-lg bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 text-xs">
          <span class="font-medium text-base-content">
            {getHeaderNavbarSlotLabel(slot)}
          </span>
          <div class="flex items-center gap-1">
            <button
              type="button"
              disabled={index === 0}
              on:click={() => handleMoveGroupSlot('navbarOrder', headerNavbarOrder, index, -1)}
              class="btn btn-ghost btn-xs btn-square bg-base-100 disabled:opacity-30"
              title={isHeaderStacked ? 'Pindah ke Atas' : 'Pindah ke Kiri'}
              aria-label={isHeaderStacked ? 'Pindah ke Atas' : 'Pindah ke Kiri'}
            >
              {#if isHeaderStacked}
                <ArrowUp size={12} />
              {:else}
                <ArrowLeft size={12} />
              {/if}
            </button>
            <button
              type="button"
              disabled={index === headerNavbarOrder.length - 1}
              on:click={() => handleMoveGroupSlot('navbarOrder', headerNavbarOrder, index, 1)}
              class="btn btn-ghost btn-xs btn-square bg-base-100 disabled:opacity-30"
              title={isHeaderStacked ? 'Pindah ke Bawah' : 'Pindah ke Kanan'}
              aria-label={isHeaderStacked ? 'Pindah ke Bawah' : 'Pindah ke Kanan'}
            >
              {#if isHeaderStacked}
                <ArrowDown size={12} />
              {:else}
                <ArrowRight size={12} />
              {/if}
            </button>
            <button
              type="button"
              on:click={() => handleDeleteSlot('navbarOrder', headerNavbarOrder, slot)}
              class="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-error hover:bg-error/10 ml-0.5"
              title="Hapus Elemen"
              aria-label="Hapus Elemen"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      {/each}

      {#if missingNavbarSlots.length > 0}
        <div class="flex flex-wrap gap-1 pt-1">
          {#each missingNavbarSlots as slot}
            <button
              type="button"
              on:click={() => handleAddSlot('navbarOrder', headerNavbarOrder, slot)}
              class="btn btn-ghost btn-xs border border-dashed border-primary/40 text-primary hover:bg-primary/10 gap-1 font-semibold"
            >
              <Plus size={10} />
              <span>Tambah {getHeaderNavbarSlotLabel(slot)}</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
