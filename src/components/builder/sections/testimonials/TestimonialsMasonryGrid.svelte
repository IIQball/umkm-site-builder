<script lang="ts">
  import type { TestimonialItem } from '@/types';
  import { Star, CheckCircle2 } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let testimonials: TestimonialItem[] = [];

  function selectCard(e: Event, idx: number, item: TestimonialItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `testi_item_${idx}`);
    }
  }

  function selectAvatar(e: Event, idx: number) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, `testi_avatar_${idx}`);
    }
  }
</script>

<div class="cq-testi-grid-3 text-left">
  {#each testimonials as item, index (item.id || index)}
    {@const isCardActive = $canvasStore.selectedNodeId === (item.id || `testi_item_${index}`)}
    {@const isAvatarActive = $canvasStore.selectedNodeId === `testi_avatar_${index}`}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, item)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, item); }}
      class={`p-5 rounded-2xl border border-light/80 bg-card shadow-xs flex flex-col justify-between space-y-4 transition-all duration-200 cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md'
          : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div>
        <div class="flex items-center gap-1 text-amber-400 mb-2">
          {#each Array(item.rating || 5) as _}
            <Star size={13} class="fill-amber-400 text-amber-400" />
          {/each}
        </div>
        <p class="text-xs sm:text-sm text-secondary leading-relaxed italic">
          "{item.comment}"
        </p>
      </div>

      <div class="flex items-center gap-3 pt-3 border-t border-light/60 mt-auto">
        <div
          role="button"
          tabindex="0"
          on:click={(e) => selectAvatar(e, index)}
          on:keydown={(e) => { if (e.key === 'Enter') selectAvatar(e, index); }}
          class={`w-10 h-10 rounded-full overflow-hidden bg-nested shrink-0 relative cursor-pointer ${
            isAvatarActive ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <img
            src={item.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120'}
            alt={item.customerName}
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div class="min-w-0">
          <h4 class="font-heading font-bold text-xs text-main truncate">
            {item.customerName}
          </h4>
          <span class="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 size={11} />
            <span>Pembeli Terverifikasi</span>
          </span>
        </div>
      </div>
    </div>
  {/each}
</div>
