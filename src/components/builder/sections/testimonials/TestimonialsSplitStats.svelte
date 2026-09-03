<script lang="ts">
  import { Star } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { calculateAverageRating } from './testimonials.helpers';

  export let sectionId: string = '';
  export let testimonials: TestimonialItem[] = [];

  $: stats = calculateAverageRating(testimonials);

  function selectStats(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'testi_stats');
    }
  }

  function selectCard(e: Event, idx: number, item: TestimonialItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `testi_item_${idx}`);
    }
  }
</script>

<div class="cq-testi-split text-left">
  <!-- Skor Agregat Kiri -->
  <div
    role="button"
    tabindex="0"
    on:click={selectStats}
    on:keydown={(e) => { if (e.key === 'Enter') selectStats(e); }}
    class={`bg-card p-6 rounded-3xl border border-light/80 shadow-xs space-y-3 cursor-pointer transition-all ${
      $canvasStore.selectedNodeId === 'testi_stats'
        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md'
        : 'hover:border-slate-300 dark:hover:border-slate-700'
    }`}
  >
    <div class="flex items-baseline gap-1">
      <span class="text-4xl font-heading font-black text-main">{stats.average}</span>
      <span class="text-sm font-medium text-secondary">/ 5.0</span>
    </div>

    <div class="flex items-center gap-1 text-amber-400">
      {#each Array(5) as _}
        <Star size={15} class="fill-amber-400 text-amber-400" />
      {/each}
    </div>

    <p class="text-xs text-secondary leading-relaxed">
      Berdasarkan akumulasi <strong>{stats.total > 0 ? `${stats.total * 350}+` : '1.480+'}</strong> ulasan pembeli terverifikasi.
    </p>

    <div class="pt-3 border-t border-light/60 text-[11px] text-secondary space-y-1.5 font-mono">
      <div class="flex justify-between items-center">
        <span>Kualitas Produk</span>
        <span class="font-bold text-main">99%</span>
      </div>
      <div class="w-full h-1.5 rounded-full bg-nested overflow-hidden">
        <div class="h-full bg-emerald-500 rounded-full" style="width: 99%"></div>
      </div>

      <div class="flex justify-between items-center pt-1">
        <span>Kecepatan Kirim</span>
        <span class="font-bold text-main">98%</span>
      </div>
      <div class="w-full h-1.5 rounded-full bg-nested overflow-hidden">
        <div class="h-full bg-primary rounded-full" style="width: 98%"></div>
      </div>

      <div class="flex justify-between items-center pt-1">
        <span>Kerapian Packing</span>
        <span class="font-bold text-main">100%</span>
      </div>
      <div class="w-full h-1.5 rounded-full bg-nested overflow-hidden">
        <div class="h-full bg-blue-500 rounded-full" style="width: 100%"></div>
      </div>
    </div>
  </div>

  <!-- List Ulasan Kanan -->
  <div class="space-y-3">
    {#each testimonials.slice(0, 3) as item, index (item.id || index)}
      {@const isCardActive = $canvasStore.selectedNodeId === (item.id || `testi_item_${index}`)}

      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectCard(e, index, item)}
        on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, item); }}
        class={`p-4 rounded-2xl border border-light/80 bg-card shadow-xs space-y-1.5 transition-all duration-200 cursor-pointer ${
          isCardActive
            ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md'
            : 'hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div class="flex justify-between items-center text-xs">
          <span class="font-heading font-bold text-main">{item.customerName}</span>
          <div class="flex items-center gap-0.5 text-amber-400">
            {#each Array(item.rating || 5) as _}
              <Star size={11} class="fill-amber-400 text-amber-400" />
            {/each}
          </div>
        </div>
        <p class="text-xs text-secondary italic leading-relaxed">
          "{item.comment}"
        </p>
      </div>
    {/each}
  </div>
</div>
