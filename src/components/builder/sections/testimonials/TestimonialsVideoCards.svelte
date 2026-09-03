<script lang="ts">
  import { Play } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { DEFAULT_VIDEO_REVIEWS } from './testimonials.helpers';

  export let sectionId: string = '';
  export let testimonials: TestimonialItem[] = [];

  $: videoItems = testimonials.length > 0 ? testimonials : (DEFAULT_VIDEO_REVIEWS as any);

  function selectCard(e: Event, idx: number, item: any) {
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
  {#each videoItems as item, index (item.id || item.customerName + index)}
    {@const isCardActive = $canvasStore.selectedNodeId === (item.id || `testi_item_${index}`)}
    {@const isAvatarActive = $canvasStore.selectedNodeId === `testi_avatar_${index}`}
    {@const coverImg = item.coverImageUrl || item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, item)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, item); }}
      class={`relative rounded-3xl overflow-hidden aspect-[9/15] bg-slate-900 shadow-md group cursor-pointer transition-all duration-200 ${
        isCardActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-2xl'
          : 'hover:shadow-xl'
      }`}
    >
      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectAvatar(e, index)}
        on:keydown={(e) => { if (e.key === 'Enter') selectAvatar(e, index); }}
        class={`absolute inset-0 cursor-pointer ${isAvatarActive ? 'ring-2 ring-blue-500' : ''}`}
      >
        <img
          src={coverImg}
          alt={item.customerName}
          class="w-full h-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <!-- Play Button Overlay -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="w-12 h-12 rounded-full bg-white/95 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform pl-0.5">
          <Play size={20} class="fill-slate-950 text-slate-950" />
        </div>
      </div>

      <!-- Bottom Card Info -->
      <div class="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/95 via-black/50 to-transparent text-white pointer-events-none">
        <h4 class="font-heading font-bold text-xs sm:text-sm text-white line-clamp-1">
          {item.title || item.comment || 'Video Ulasan Pelanggan'}
        </h4>
        <p class="text-[11px] text-slate-300 mt-0.5 truncate">
          {item.customerName} {item.location ? `• ${item.location}` : ''}
        </p>
      </div>
    </div>
  {/each}
</div>
