<script lang="ts">
  import { Play, Star, CheckCircle2 } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveTestimonialItemStyle } from './testimonialStyles.helpers';

  export let sectionId: string = '';
  export let testimonials: TestimonialItem[] = [];
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: videoItems = Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : [];

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
  {#each videoItems as item, index (item.id || index)}
    {@const itemStyle = resolveTestimonialItemStyle(item, index, nodeStyles)}
    {@const isCardActive = $canvasStore.selectedSectionId === sectionId && $canvasStore.selectedNodeId === (item.id || `testi_item_${index}`)}
    {@const isAvatarActive = $canvasStore.selectedSectionId === sectionId && $canvasStore.selectedNodeId === `testi_avatar_${index}`}
    {@const coverImg = item.avatar || item.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, item)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, item); }}
      class={`relative rounded-3xl overflow-hidden aspect-[9/15] bg-slate-900 shadow-md group cursor-pointer transition-all duration-200 ${
        isCardActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 shadow-2xl'
          : 'hover:shadow-xl'
      }`}
    >
      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectAvatar(e, index)}
        on:keydown={(e) => { if (e.key === 'Enter') selectAvatar(e, index); }}
        class={`absolute inset-0 cursor-pointer ${isAvatarActive ? 'ring-2 ring-primary' : ''}`}
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
      <div class="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/95 via-black/50 to-transparent text-white pointer-events-none space-y-1">
        <div class="flex items-center gap-0.5 text-amber-400">
          {#each Array(item.rating || 5) as _}
            <Star size={11} class="fill-amber-400 text-amber-400" />
          {/each}
        </div>
        <h4
          class="font-heading font-bold text-xs sm:text-sm line-clamp-2"
          style="{itemStyle.color ? `color: ${itemStyle.color};` : 'color: #ffffff;'}"
        >
          "{item.comment || 'Ulasan Pembeli'}"
        </h4>
        <div class="flex items-center gap-1.5 text-[11px] text-slate-300">
          <span class="font-semibold text-white truncate">{item.customerName}</span>
          {#if item.verified !== false}
            <span class="text-emerald-400 flex items-center gap-0.5 text-[10px] shrink-0">
              <CheckCircle2 size={10} />
              <span>{item.verifiedText || 'Terverifikasi'}</span>
            </span>
          {/if}
          {#if item.role}
            <span class="truncate">• {item.role}</span>
          {/if}
        </div>
      </div>
    </div>
  {/each}
</div>
