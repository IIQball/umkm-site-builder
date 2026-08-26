<script lang="ts">
  import { editorStore } from '../stores/editorStore';
  import type { FeaturesProps, SectionStyles } from '@/types';
  import FeaturesGridPreset from './features/FeaturesGridPreset.svelte';
  import FeaturesHorizontalPreset from './features/FeaturesHorizontalPreset.svelte';

  export let props: FeaturesProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'grid_3_cards';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'grid_3_cards';
  $: features = Array.isArray(props?.features) && props.features.length > 0
    ? props.features
    : [
        {
          icon: 'shield',
          title: 'Toko Terpercaya',
          description: 'Dipercaya oleh ribuan pelanggan di seluruh Indonesia dengan rekam jejak terbaik.',
        },
        {
          icon: 'truck',
          title: 'Pengiriman Cepat',
          description: 'Gratis ongkos kirim dan pengiriman kilat terjamin aman sampai tujuan.',
        },
        {
          icon: 'award',
          title: 'Produk Berkualitas',
          description: 'Garansi produk original 100% dan jaminan uang kembali jika cacat.',
        },
        {
          icon: 'star',
          title: 'Pelayanan Ramah',
          description: 'Tim customer service responsif siap membantu setiap kebutuhan Anda.',
        },
      ];

  let draggedIdx: number | null = null;
  let dropTargetIdx: number | null = null;

  const onDragStart = (e: DragEvent, index: number) => {
    if (!isActive) return;
    draggedIdx = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
    }
  };

  const onDragOver = (e: DragEvent, index: number) => {
    if (!isActive || draggedIdx === null || draggedIdx === index) return;
    e.preventDefault();
    dropTargetIdx = index;
  };

  const onDrop = (e: DragEvent, targetIdx: number) => {
    if (!isActive || draggedIdx === null) return;
    e.preventDefault();
    if (draggedIdx !== targetIdx) {
      const items = [...features];
      const [moved] = items.splice(draggedIdx, 1);
      items.splice(targetIdx, 0, moved);
      editorStore.updateSectionProps(sectionId, { features: items });
    }
    draggedIdx = null;
    dropTargetIdx = null;
  };
</script>

<section
  class="relative w-full py-12 transition-all {isActive ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-base-100' : ''}"
  style:background-color="var(--theme-bg)"
>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
    <!-- Header -->
    <div class="mb-10 text-center max-w-2xl mx-auto">
      {#if props.badge}
        <span class="inline-block px-3 py-1 mb-2 text-xs font-bold uppercase tracking-wider rounded-full bg-primary/10 text-primary">
          {props.badge}
        </span>
      {/if}
      <h2 class="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
        {props.title || 'Keunggulan & Layanan Kami'}
      </h2>
      {#if props.subtitle}
        <p class="mt-2 text-sm text-base-content/60">{props.subtitle}</p>
      {/if}
    </div>

    <!-- Presets -->
    {#if activePreset === 'horizontal_list' || activePreset === 'banner_inline_bar' || activePreset === 'icon_pill_chips' || activePreset === 'split_image_feature'}
      <FeaturesHorizontalPreset {features} {activePreset} imageUrl={typeof props?.imageUrl === 'string' ? props.imageUrl : ''} />
    {:else}
      <FeaturesGridPreset
        {features}
        {activePreset}
        {isActive}
        {draggedIdx}
        {dropTargetIdx}
        {onDragStart}
        {onDragOver}
        {onDrop}
      />
    {/if}
  </div>
</section>
