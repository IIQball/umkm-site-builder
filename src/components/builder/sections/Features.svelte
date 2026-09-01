<script lang="ts">
  import { editorStore, canvasStore } from '../stores/editorStore';
  import type { FeaturesProps, SectionStyles } from '@/types';
  import { ShieldCheck, Truck, Award, Star, Zap, Layers } from 'lucide-svelte';
  import FeaturesBentoGrid from './features/FeaturesBentoGrid.svelte';
  import FeaturesInteractiveTabs from './features/FeaturesInteractiveTabs.svelte';
  import FeaturesVerticalAccordion from './features/FeaturesVerticalAccordion.svelte';
  import FeaturesComparison from './features/FeaturesComparison.svelte';

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
          description: 'Dipercaya oleh ribuan pelanggan di seluruh Indonesia dengan rekam jejak kepuasan tinggi.',
        },
        {
          icon: 'truck',
          title: 'Pengiriman Cepat',
          description: 'Gratis ongkos kirim dan proses packing kilat dengan proteksi ekstra aman.',
        },
        {
          icon: 'award',
          title: 'Produk Berkualitas',
          description: 'Garansi produk original 100% dan jaminan uang kembali bila ada cacat pabrik.',
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
    if (iconName === 'zap') return Zap;
    if (iconName === 'layers') return Layers;
    return Star;
  };
</script>

<div data-node="features_container" class="w-full box-border">
  {#if activePreset === 'banner_inline_bar'}
    <!-- Preset 3: Banner Inline Bar -->
    <div class="w-full py-4 px-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-around gap-6">
      {#each features as feature, index (feature.title + index)}
        <div data-node="feature_card" class="flex items-center gap-3 min-w-0">
          <div data-node="feature_icon" class="w-10 h-10 rounded-lg bg-blue-50 text-[var(--theme-primary,#2563eb)] flex items-center justify-center flex-shrink-0 border border-blue-100">
            <svelte:component this={renderIcon(feature.icon)} size={18} />
          </div>
          <div class="min-w-0 text-left">
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
    <!-- Preset 2: Horizontal List -->
    <div class="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <div class="md:col-span-4 md:sticky md:top-8 flex flex-col gap-2 text-left">
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight">
          {props?.title || 'Keunggulan Produk Kami'}
        </h2>
        <p class="text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed">
          {props?.subtitle || 'Standar mutu dan komitmen terbaik untuk kepuasan setiap pelanggan.'}
        </p>
      </div>

      <div class="md:col-span-8 flex flex-col gap-4">
        {#each features as feature, index (feature.title + index)}
          <div
            data-node="feature_card"
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

  {:else if activePreset === 'bento_grid_asymmetric'}
    <FeaturesBentoGrid {features} title={props?.title || ''} subtitle={props?.subtitle || ''} {renderIcon} />

  {:else if activePreset === 'alternating_zigzag_rows'}
    <!-- Preset 5: Alternating Zigzag Rows -->
    <div class="py-12 flex flex-col gap-12 text-left">
      {#each features as feature, index}
        {@const isReverse = index % 2 === 1}
        <div class={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${isReverse ? 'md:flex-row-reverse' : ''}`}>
          <div class={`md:col-span-6 flex flex-col gap-3 ${isReverse ? 'md:order-2' : 'md:order-1'}`}>
            <span class="text-xs font-bold uppercase tracking-wider text-[var(--theme-primary,#2563eb)]">Keunggulan #{index + 1}</span>
            <h3 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight">
              {feature.title}
            </h3>
            <p class="text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed">
              {feature.description}
            </p>
          </div>
          <div class={`md:col-span-6 p-8 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-md flex items-center justify-center min-h-[160px] ${isReverse ? 'md:order-1' : 'md:order-2'}`}>
            <div class="w-16 h-16 rounded-2xl bg-blue-50 text-[var(--theme-primary,#2563eb)] flex items-center justify-center border border-blue-100 shadow-sm">
              <svelte:component this={renderIcon(feature.icon)} size={32} />
            </div>
          </div>
        </div>
      {/each}
    </div>

  {:else if activePreset === 'interactive_tabs'}
    <FeaturesInteractiveTabs {features} title={props?.title || ''} {renderIcon} />

  {:else if activePreset === 'vertical_accordion_showcase'}
    <FeaturesVerticalAccordion {features} title={props?.title || ''} subtitle={props?.subtitle || ''} {renderIcon} />

  {:else if activePreset === 'sticky_scroll_highlight'}
    <!-- Preset 8: Sticky Scroll Highlight -->
    <div class="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left">
      <div class="md:col-span-5 md:sticky md:top-12 p-8 rounded-2xl bg-slate-900 text-white shadow-xl flex flex-col gap-4">
        <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Komitmen Pelanggan</span>
        <h3 class="text-2xl sm:text-3xl font-black text-white leading-tight">Pengalaman Belanja Terbaik</h3>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Kami memastikan setiap langkah transaksi berjalan aman, cepat, dan terpercaya untuk seluruh pelanggan setia.
        </p>
      </div>

      <div class="md:col-span-7 flex flex-col gap-4">
        {#each features as feature, idx}
          <div class="p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-blue-100 text-[var(--theme-primary,#2563eb)] font-bold text-xs flex items-center justify-center flex-shrink-0">
              {idx + 1}
            </div>
            <div>
              <h4 class="font-bold text-base text-[var(--theme-text-primary,#0f172a)] mb-1">{feature.title}</h4>
              <p class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed">{feature.description}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>

  {:else if activePreset === 'dense_icon_matrix'}
    <!-- Preset 9: Dense Icon Matrix -->
    <div class="py-12 flex flex-col gap-8 text-center">
      <div>
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
          {props?.title || 'Kelebihan Lengkap Layanan Kami'}
        </h2>
        <p class="text-sm text-[var(--theme-text-muted,#64748b)]">{props?.subtitle || 'Seluruh fitur dirancang untuk kemudahan Anda'}</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
        {#each [...features, ...features].slice(0, 6) as feature}
          <div class="p-4 rounded-xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-[var(--theme-primary,#2563eb)] flex items-center justify-center flex-shrink-0">
              <svelte:component this={renderIcon(feature.icon)} size={16} />
            </div>
            <div class="min-w-0">
              <h5 class="font-bold text-xs text-[var(--theme-text-primary,#0f172a)] truncate">{feature.title}</h5>
              <p class="text-[11px] text-[var(--theme-text-muted,#64748b)] line-clamp-2 mt-0.5">{feature.description}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>

  {:else if activePreset === 'before_after_comparison'}
    <FeaturesComparison />

  {:else}
    <!-- Preset 1 (Default): Grid 3 Cards -->
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
