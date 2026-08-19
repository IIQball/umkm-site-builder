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
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        } ${dropTargetIdx === index ? 'border-blue-500 ring-2 ring-blue-400/40 shadow-lg' : 'border-slate-100 shadow-sm'} ${
          draggedIdx === index ? 'opacity-30' : ''
        }`}
      >
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
          <svelte:component this={renderIcon(feature.icon)} size={22} />
        </div>
        <h3 class={`text-base font-bold mb-2 ${hasCustomColor ? '' : 'text-slate-900'}`}>
          {feature.title}
        </h3>
        <p class={`text-xs leading-relaxed ${hasCustomColor ? 'opacity-80' : 'text-slate-600'}`}>
          {feature.description}
        </p>
      </div>
    {/each}
  </div>
</div>
