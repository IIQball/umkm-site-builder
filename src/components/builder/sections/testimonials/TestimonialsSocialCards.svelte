<script lang="ts">
  import { Heart, MessageCircle } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';
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
    {@const handle = (item.customerName || 'user').toLowerCase().replace(/\s+/g, '_')}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, item)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, item); }}
      class={`p-5 rounded-3xl border border-light/80 bg-card shadow-xs flex flex-col justify-between space-y-3 transition-all duration-200 cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md'
          : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 min-w-0">
          <div
            role="button"
            tabindex="0"
            on:click={(e) => selectAvatar(e, index)}
            on:keydown={(e) => { if (e.key === 'Enter') selectAvatar(e, index); }}
            class={`w-9 h-9 rounded-full overflow-hidden bg-nested shrink-0 cursor-pointer ${
              isAvatarActive ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {#if item.avatar}
              <img src={item.avatar} alt={item.customerName} class="w-full h-full object-cover" />
            {:else}
              <div class="w-full h-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                {(item.customerName || 'U').charAt(0).toUpperCase()}
              </div>
            {/if}
          </div>
          <div class="min-w-0">
            <h4 class="font-heading font-bold text-xs text-main truncate">
              {item.customerName}
            </h4>
            <p class="text-[10px] text-secondary/70 truncate font-mono">
              @{handle}
            </p>
          </div>
        </div>
        <span class="text-[10px] text-secondary font-mono shrink-0">
          {index === 0 ? '2j lalu' : index === 1 ? 'Kemarin' : '3h lalu'}
        </span>
      </div>

      <p class="text-xs text-main leading-relaxed">
        {item.comment}
      </p>

      <div class="flex items-center gap-4 pt-3 border-t border-light/60 text-[11px] text-secondary">
        <div class="flex items-center gap-1.5 text-rose-500">
          <Heart size={13} class="fill-rose-500/20 text-rose-500" />
          <span>{94 + index * 34} Suka</span>
        </div>
        <div class="flex items-center gap-1.5 text-secondary">
          <MessageCircle size={13} />
          <span>{8 + index * 6} Komentar</span>
        </div>
      </div>
    </div>
  {/each}
</div>
