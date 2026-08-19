<script lang="ts">
  import { editorStore } from '../stores/editorStore';
  import type { FeaturesProps, SectionStyles } from '@/types/builder';
  import { ShieldCheck, Truck, Award, Star } from 'lucide-svelte';

  export let props: FeaturesProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;

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

  $: hasCustomColor = !!styles?.color;

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

  const renderIcon = (iconName: string) => {
    if (iconName === 'shield' || iconName === '✓') return ShieldCheck;
    if (iconName === 'truck' || iconName === '🚚') return Truck;
    if (iconName === 'award' || iconName === '💯') return Award;
    return Star;
  };
</script>

<div class="max-w-6xl mx-auto w-full">
  {#if features.length === 3}
    <!-- Asymmetric Bento Layout for 3 items (Hero card + 2-card stack) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
      <!-- First Feature: Hero Card (Col 7) -->
      <div
        role="listitem"
        draggable={isActive}
        on:dragstart={(e) => onDragStart(e, 0)}
        on:dragover={(e) => onDragOver(e, 0)}
        on:dragleave={() => (dropTargetIdx = null)}
        on:drop={(e) => onDrop(e, 0)}
        class={`md:col-span-7 bg-white p-7 rounded-2xl border transition-all flex flex-col justify-between text-left ${
          isActive ? 'cursor-grab active:cursor-grabbing hover:border-blue-400' : ''
        } ${dropTargetIdx === 0 ? 'border-blue-500 ring-2 ring-blue-400/40 shadow-lg' : 'border-slate-200/80 shadow-sm'} ${
          draggedIdx === 0 ? 'opacity-30' : ''
        }`}
      >
        <div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100/80">
            <svelte:component this={renderIcon(features[0].icon)} size={24} />
          </div>
          <h3 class={`text-lg font-bold mb-2.5 ${hasCustomColor ? '' : 'text-slate-900'}`}>
            {features[0].title}
          </h3>
          <p class={`text-xs sm:text-sm leading-relaxed ${hasCustomColor ? 'opacity-80' : 'text-slate-600'}`}>
            {features[0].description}
          </p>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-600">
          <span>Keunggulan Utama Toko</span>
        </div>
      </div>

      <!-- Second & Third Features (Col 5 Stack) -->
      <div class="md:col-span-5 flex flex-col gap-5">
        {#each features.slice(1) as feature, subIndex (feature.title + subIndex)}
          <div
            role="listitem"
            draggable={isActive}
            on:dragstart={(e) => onDragStart(e, subIndex + 1)}
            on:dragover={(e) => onDragOver(e, subIndex + 1)}
            on:dragleave={() => (dropTargetIdx = null)}
            on:drop={(e) => onDrop(e, subIndex + 1)}
            class={`bg-white p-6 rounded-2xl border transition-all flex flex-col justify-between text-left flex-1 ${
              isActive ? 'cursor-grab active:cursor-grabbing hover:border-blue-400' : ''
            } ${dropTargetIdx === subIndex + 1 ? 'border-blue-500 ring-2 ring-blue-400/40 shadow-lg' : 'border-slate-200/80 shadow-sm'} ${
              draggedIdx === subIndex + 1 ? 'opacity-30' : ''
            }`}
          >
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100/80">
                <svelte:component this={renderIcon(feature.icon)} size={20} />
              </div>
              <div>
                <h3 class={`text-base font-bold mb-1.5 ${hasCustomColor ? '' : 'text-slate-900'}`}>
                  {feature.title}
                </h3>
                <p class={`text-xs leading-relaxed ${hasCustomColor ? 'opacity-80' : 'text-slate-600'}`}>
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <!-- Dynamic Responsive Grid for custom number of features -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {#each features as feature, index (feature.title + index)}
        <div
          role="listitem"
          draggable={isActive}
          on:dragstart={(e) => onDragStart(e, index)}
          on:dragover={(e) => onDragOver(e, index)}
          on:dragleave={() => (dropTargetIdx = null)}
          on:drop={(e) => onDrop(e, index)}
          class={`bg-white p-6 rounded-2xl border transition-all flex flex-col items-start text-left ${
            isActive ? 'cursor-grab active:cursor-grabbing hover:border-blue-400' : ''
          } ${dropTargetIdx === index ? 'border-blue-500 ring-2 ring-blue-400/40 shadow-lg' : 'border-slate-200/80 shadow-sm'} ${
            draggedIdx === index ? 'opacity-30' : ''
          }`}
        >
          <div class="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100/80">
            <svelte:component this={renderIcon(feature.icon)} size={22} />
          </div>
          <h3 class={`text-base font-bold mb-1.5 ${hasCustomColor ? '' : 'text-slate-900'}`}>
            {feature.title}
          </h3>
          <p class={`text-xs leading-relaxed ${hasCustomColor ? 'opacity-80' : 'text-slate-600'}`}>
            {feature.description}
          </p>
        </div>
      {/each}
    </div>
  {/if}
</div>
