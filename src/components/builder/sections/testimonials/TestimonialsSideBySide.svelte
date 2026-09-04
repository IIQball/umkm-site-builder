<script lang="ts">
  import { Star, Sparkles } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let testimonials: TestimonialItem[] = [];

  $: displayCards = testimonials.length >= 3 ? testimonials.slice(0, 3) : [
    {
      customerName: 'Rudi Hermawan',
      rating: 5,
      comment: 'Harga sangat bersahabat untuk kualitas bahan baku asli tanpa pengawet.',
      role: 'Pelanggan Toko',
    },
    {
      customerName: 'PT Solusi Dinamika',
      rating: 5,
      comment: 'Sudah jadi langganan tetap kantor kami untuk hidangan rapat bulanan. Selalu rapi dan higienis!',
      role: 'Klien Korporat',
    },
    {
      customerName: 'Maria Latupono',
      rating: 5,
      comment: 'Packing aman sampai Papua tanpa ada kemasan yang pecah atau bocor.',
      role: 'Pelanggan Luar Pulau',
    },
  ];

  function selectCard(e: Event, idx: number, item: any) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `testi_item_${idx}`);
    }
  }
</script>

<div class="cq-side-3-grid text-left">
  {#each displayCards as item, index (item.id || index)}
    {@const isHighlighted = index === 1}
    {@const isCardActive = $canvasStore.selectedNodeId === (item.id || `testi_item_${index}`)}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, item)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, item); }}
      class={`p-6 rounded-3xl transition-all duration-200 cursor-pointer relative space-y-3 ${
        isHighlighted
          ? 'bg-slate-900 text-white shadow-xl cq-side-3-highlight'
          : 'bg-card border border-light/80 shadow-xs hover:shadow-md'
      } ${
        isCardActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-2xl'
          : ''
      }`}
    >
      {#if isHighlighted}
        <span class="absolute -top-2.5 right-6 bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <Sparkles size={11} />
          <span>TOP REVIEW</span>
        </span>
      {/if}

      <div class="flex items-center gap-1 text-amber-400">
        {#each Array(item.rating || 5) as _}
          <Star size={13} class="fill-amber-400 text-amber-400" />
        {/each}
      </div>

      <p class={`text-xs sm:text-sm leading-relaxed ${isHighlighted ? 'text-slate-200 font-medium' : 'text-secondary italic'}`}>
        "{item.comment}"
      </p>

      <div class={`pt-3 border-t ${isHighlighted ? 'border-slate-800' : 'border-light/60'}`}>
        <h5 class={`font-heading font-bold text-xs ${isHighlighted ? 'text-white' : 'text-main'}`}>
          — {item.customerName}
        </h5>
        {#if item.role}
          <span class={`text-[10px] ${isHighlighted ? 'text-slate-400' : 'text-secondary'}`}>
            {item.role}
          </span>
        {/if}
      </div>
    </div>
  {/each}
</div>
