<script lang="ts">
  import { editorStore, canvasStore } from '../stores/editorStore';
  import type { FeaturesProps, SectionStyles } from '@/types';
  import { ShieldCheck, Truck, Award, Star, CheckCircle, ArrowRight } from 'lucide-svelte';

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
  {#if activePreset === 'grid_4_compact'}
    <!-- Preset A: Grid 4 Compact (Desktop: 4-Col, Tablet: 2x2, Mobile: 1-Col) -->
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

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {#each features as feature, index (feature.title + index)}
          <div
            data-node="feature_card"
            class="p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center justify-between"
          >
            <div data-node="feature_icon" class="w-12 h-12 rounded-lg bg-blue-50 text-[var(--theme-primary,#2563eb)] flex items-center justify-center mb-4 border border-blue-100">
              <svelte:component this={renderIcon(feature.icon)} size={22} />
            </div>
            <h3 data-node="feature_title" class="text-base font-bold mb-2 text-[var(--theme-text-primary,#0f172a)]">
              {feature.title}
            </h3>
            <p data-node="feature_desc" class="text-xs leading-relaxed text-[var(--theme-text-muted,#64748b)]">
              {feature.description}
            </p>
          </div>
        {/each}
      </div>
    </div>

  {:else if activePreset === 'numbered_process'}
    <!-- Preset B: Numbered Process (3 sequential ordering steps 01, 02, 03) -->
    <div class="py-12">
      <div class="mb-10 text-center">
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
          {props?.title || 'Cara Mudah Belanja di Toko Kami'}
        </h2>
        <p class="text-sm text-[var(--theme-text-muted,#64748b)] max-w-xl mx-auto">
          {props?.subtitle || 'Langkah sederhana dari memilih produk hingga pesanan sampai di depan rumah Anda'}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {#each features.slice(0, 3) as feature, index}
          <div
            data-node="feature_card"
            class="p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col items-start text-left relative z-10"
          >
            <div class="flex items-center justify-between w-full mb-4">
              <span class="w-10 h-10 rounded-full bg-[var(--theme-primary,#2563eb)] text-white font-black text-sm flex items-center justify-center shadow-md">
                0{index + 1}
              </span>
              <div class="text-[var(--theme-primary,#2563eb)]">
                <svelte:component this={renderIcon(feature.icon)} size={20} />
              </div>
            </div>
            <h3 data-node="feature_title" class="text-base sm:text-lg font-bold mb-2 text-[var(--theme-text-primary,#0f172a)]">
              {feature.title}
            </h3>
            <p data-node="feature_desc" class="text-xs sm:text-sm leading-relaxed text-[var(--theme-text-muted,#64748b)]">
              {feature.description}
            </p>
          </div>
        {/each}
      </div>
    </div>

  {:else if activePreset === 'feature_bento_grid'}
    <!-- Preset C: Feature Bento Grid (1 large card on left, 2 stacked cards on right) -->
    <div class="py-12">
      <div class="mb-8 text-center">
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
          {props?.title || 'Standar Kualitas Terbaik'}
        </h2>
        <p class="text-sm text-[var(--theme-text-muted,#64748b)] max-w-xl mx-auto">
          {props?.subtitle || 'Alasan mengapa ribuan pelanggan setia memilih produk kami'}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <!-- 1 Large Main Card (Col 1-6) -->
        {#if features[0]}
          <div
            data-node="feature_card"
            class="md:col-span-6 p-8 rounded-3xl bg-[var(--theme-primary,#2563eb)] text-white shadow-xl flex flex-col justify-between text-left min-h-[260px]"
          >
            <div>
              <div class="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6 backdrop-blur-md">
                <svelte:component this={renderIcon(features[0].icon)} size={28} />
              </div>
              <h3 data-node="feature_title" class="text-2xl font-black mb-3">
                {features[0].title}
              </h3>
              <p data-node="feature_desc" class="text-sm text-blue-100 leading-relaxed max-w-md">
                {features[0].description}
              </p>
            </div>
            <div class="mt-6 flex items-center gap-2 text-xs font-bold text-blue-100">
              <span>Keunggulan Utama</span>
              <ArrowRight size={14} />
            </div>
          </div>
        {/if}

        <!-- 2 Stacked Cards on Right (Col 7-12) -->
        <div class="md:col-span-6 flex flex-col gap-6">
          {#each features.slice(1, 3) as feature}
            <div
              data-node="feature_card"
              class="p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex items-start gap-4 text-left flex-1"
            >
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-[var(--theme-primary,#2563eb)] flex items-center justify-center flex-shrink-0 border border-blue-100">
                <svelte:component this={renderIcon(feature.icon)} size={22} />
              </div>
              <div>
                <h4 data-node="feature_title" class="text-base font-bold mb-1 text-[var(--theme-text-primary,#0f172a)]">
                  {feature.title}
                </h4>
                <p data-node="feature_desc" class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

  {:else if activePreset === 'icon_pill_chips'}
    <!-- Preset D: Icon Pill Chips (Collection of pill chips flex-wrap) -->
    <div class="py-12 flex flex-col items-center text-center gap-6">
      <div>
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
          {props?.title || 'Jaminan & Fasilitas Kami'}
        </h2>
        <p class="text-sm text-[var(--theme-text-muted,#64748b)] max-w-xl mx-auto">
          {props?.subtitle || 'Kemudahan dan kenyamanan transaksi di setiap pesanan'}
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-3 max-w-3xl">
        {#each features as feature}
          <div
            data-node="feature_card"
            class="h-12 px-6 rounded-full bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex items-center gap-3 transition-transform hover:scale-105 cursor-pointer"
          >
            <div class="text-[var(--theme-primary,#2563eb)] flex-shrink-0">
              <svelte:component this={renderIcon(feature.icon)} size={18} />
            </div>
            <span data-node="feature_title" class="text-xs sm:text-sm font-bold text-[var(--theme-text-primary,#0f172a)] whitespace-nowrap">
              {feature.title}
            </span>
          </div>
        {/each}
      </div>
    </div>

  {:else if activePreset === 'split_image_feature'}
    <!-- Preset E: Split Image Feature (Left store photo 5 cols, Right 4 checklist items 7 cols) -->
    <div class="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      <div class="md:col-span-5 w-full">
        <div class="p-2 rounded-2xl bg-base-200/60 dark:bg-slate-800/60 border border-base-300 dark:border-slate-800 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
            alt="Store Production"
            class="w-full aspect-[4/3] object-cover rounded-lg"
          />
        </div>
      </div>

      <div class="md:col-span-7 flex flex-col gap-4 text-left">
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight">
          {props?.title || 'Komitmen Kualitas & Pelayanan'}
        </h2>
        <p class="text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed mb-2">
          {props?.subtitle || 'Kami berdedikasi memberikan produk terbaik dengan kontrol mutu ketat.'}
        </p>

        <div class="flex flex-col gap-3">
          {#each features as feature}
            <div data-node="feature_card" class="p-4 rounded-xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 flex items-start gap-3">
              <CheckCircle size={18} class="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 data-node="feature_title" class="text-sm font-bold text-[var(--theme-text-primary,#0f172a)]">
                  {feature.title}
                </h4>
                <p data-node="feature_desc" class="text-xs text-[var(--theme-text-muted,#64748b)]">
                  {feature.description}
                </p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

  {:else if activePreset === 'banner_inline_bar'}
    <!-- Preset 3: Banner Inline Bar (Ribbon h-16 / 64px horizontal strip) -->
    <div class="w-full py-4 px-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-around gap-6">
      {#each features as feature, index (feature.title + index)}
        <div
          data-node="feature_card"
          class="flex items-center gap-3 min-w-0"
        >
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
        {#each features.slice(0, 3) as feature, index (feature.title + index)}
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
