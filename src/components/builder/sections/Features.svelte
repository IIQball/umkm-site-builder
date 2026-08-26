<script lang="ts">
  import { editorStore, canvasStore } from '../stores/editorStore';
  import type { FeaturesProps, SectionStyles } from '@/types';
  import { ShieldCheck, Truck, Award, Star } from 'lucide-svelte';

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
          description: 'Dipercaya oleh ribuan pelanggan di seluruh Indonesia.',
        },
        {
          icon: 'truck',
          title: 'Pengiriman Cepat',
          description: 'Gratis ongkos kirim dan pengiriman kilat terjamin.',
        },
        {
          icon: 'award',
          title: 'Produk Berkualitas',
          description: 'Garansi produk original dan jaminan uang kembali.',
        },
      ];

  $: isMobileView = $canvasStore?.viewMode === 'mobile';

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
    if (draggedIdx === null || draggedIdx === index) return;
    e.preventDefault();
    dropTargetIdx = index;
  };

  const onDrop = (e: DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      draggedIdx = null;
      dropTargetIdx = null;
      return;
    }

    const list = [...features];
    const [moved] = list.splice(draggedIdx, 1);
    list.splice(targetIdx, 0, moved);
    editorStore.updateSectionProps(sectionId, { features: list });

    draggedIdx = null;
    dropTargetIdx = null;
  };

  const renderIcon = (iconName?: string) => {
    if (iconName === 'shield') return ShieldCheck;
    if (iconName === 'truck') return Truck;
    if (iconName === 'award') return Award;
    return Star;
  };
</script>

<div
  data-node="features_container"
  class="w-full box-border"
>
  {#if activePreset === 'banner_inline_bar'}
    <!-- Preset 3: Banner Inline Bar (Ribbon h-16 / 64px horizontal strip) -->
    <div class="w-full py-4 px-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-around gap-6">
      {#each features as feature, index (feature.title + index)}
        <div
          data-node="feature_card"
          class="flex items-center gap-3 min-w-0"
        >
          <!-- Nested radius: container 16px, inner icon pill/8px -->
          <div data-node="feature_icon" class="w-10 h-10 rounded-lg bg-blue-50 text-[var(--theme-primary,#2563eb)] flex items-center justify-center flex-shrink-0 border border-blue-100">
            <svelte:component this={renderIcon(feature.icon)} size={18} />
          </div>
          <div class="min-w-0">
            <h4 data-node="feature_title" class="text-xs sm:text-sm font-bold text-[var(--theme-text-primary,#0f172a)] truncate">
              {feature.title}
            </h4>
            <p data-node="feature_desc" class="text-[11px] text-[var(--theme-text-muted,#64748b)] hidden sm:block truncate">
              {feature.description}
            </p>
          </div>
        </div>
      {/each}
    </div>

  {:else if activePreset === 'horizontal_list'}
    <!-- Preset 2: Horizontal List (2-Col: Left Heading, Right 16px-gap rows) -->
    <div class="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <!-- Left Heading -->
      <div class="md:col-span-4 md:sticky md:top-8 flex flex-col gap-2 text-left">
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight">
          {props?.title || 'Keunggulan Produk Kami'}
        </h2>
        <p class="text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed">
          {props?.subtitle || 'Standar mutu dan komitmen terbaik untuk kepuasan setiap pelanggan.'}
        </p>
      </div>

      <!-- Right Feature Rows -->
      <div class="md:col-span-8 flex flex-col gap-4">
        {#each features as feature, index (feature.title + index)}
          <div
            data-node="feature_card"
            role="listitem"
            draggable={isActive}
            on:dragstart={(e) => onDragStart(e, index)}
            on:dragover={(e) => onDragOver(e, index)}
            on:dragleave={() => (dropTargetIdx = null)}
            on:drop={(e) => onDrop(e, index)}
            class="p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex items-start gap-4 transition-all hover:border-blue-300"
          >
            <div data-node="feature_icon" class="w-12 h-12 rounded-lg bg-blue-50 text-[var(--theme-primary,#2563eb)] flex items-center justify-center flex-shrink-0 border border-blue-100">
              <svelte:component this={renderIcon(feature.icon)} size={22} />
            </div>
            <div class="min-w-0 flex-1 text-left">
              <h3 data-node="feature_title" class="text-base font-bold text-[var(--theme-text-primary,#0f172a)] mb-1">
                {feature.title}
              </h3>
              <p data-node="feature_desc" class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>

  {:else}
    <!-- Preset 1 (Default): Grid 3 Cards (py-12 = 48px, gap-6 = 24px, card p-6 = 24px) -->
    <div class="py-12">
      {#if props?.title}
        <div class="mb-8 text-center">
          <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
            {props.title}
          </h2>
          {#if props.subtitle}
            <p class="text-sm text-[var(--theme-text-muted,#64748b)] max-w-xl mx-auto">
              {props.subtitle}
            </p>
          {/if}
        </div>
      {/if}

      <div class={`grid ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-6 w-full`}>
        {#each features as feature, index (feature.title + index)}
          <div
            data-node="feature_card"
            role="listitem"
            draggable={isActive}
            on:dragstart={(e) => onDragStart(e, index)}
            on:dragover={(e) => onDragOver(e, index)}
            on:dragleave={() => (dropTargetIdx = null)}
            on:drop={(e) => onDrop(e, index)}
            class={`p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border transition-all flex flex-col justify-between text-left min-w-0 ${
              isActive ? 'cursor-grab active:cursor-grabbing hover:border-blue-400' : ''
            } ${dropTargetIdx === index ? 'border-blue-500 ring-2 ring-blue-400/40 shadow-lg' : 'border-base-200 dark:border-slate-800 shadow-sm'} ${
              draggedIdx === index ? 'opacity-30' : ''
            }`}
          >
            <div>
              <!-- Nested radius: Card radius 16px (rounded-2xl) with p-6 (24px) -> Icon radius 8px (rounded-lg) -->
              <div data-node="feature_icon" class="w-12 h-12 rounded-lg bg-blue-50 text-[var(--theme-primary,#2563eb)] flex items-center justify-center mb-4 border border-blue-100">
                <svelte:component this={renderIcon(feature.icon)} size={22} />
              </div>
              <h3 data-node="feature_title" class="text-base sm:text-lg font-bold mb-2 text-[var(--theme-text-primary,#0f172a)]">
                {feature.title}
              </h3>
              <p data-node="feature_desc" class="text-xs sm:text-sm leading-relaxed text-[var(--theme-text-muted,#64748b)]">
                {feature.description}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
