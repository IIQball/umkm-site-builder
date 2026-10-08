<script lang="ts">
  import type { FAQItem } from '@/types';
  import { HelpCircle } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveFaqItemStyle } from './faqStyles.helpers';

  export let sectionId: string = '';
  export let faqs: FAQItem[] = [];
  export let nodeStyles: Record<string, Record<string, string>> = {};

  function selectCard(e: Event, idx: number, item: FAQItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `faq_item_${idx}`);
    }
  }

  // Scroll-on-drag state
  let scrollContainer: HTMLDivElement;
  let isDragging = false;
  let dragStartX = 0;
  let scrollStartX = 0;

  function onDragStart(e: MouseEvent) {
    if (!scrollContainer) return;
    isDragging = true;
    dragStartX = e.clientX;
    scrollStartX = scrollContainer.scrollLeft;
    scrollContainer.style.cursor = 'grabbing';
    scrollContainer.style.userSelect = 'none';
  }

  function onDragMove(e: MouseEvent) {
    if (!isDragging || !scrollContainer) return;
    const dx = e.clientX - dragStartX;
    scrollContainer.scrollLeft = scrollStartX - dx;
  }

  function onDragEnd() {
    if (!scrollContainer) return;
    isDragging = false;
    scrollContainer.style.cursor = 'grab';
    scrollContainer.style.userSelect = '';
  }

  function scrollRight() {
    if (!scrollContainer) return;
    scrollContainer.scrollBy({ left: 280, behavior: 'smooth' });
  }

  function onWheel(e: WheelEvent) {
    if (!scrollContainer) return;
    if (e.ctrlKey || e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      scrollContainer.scrollLeft += delta;
    }
  }
</script>

<div class="w-full">
  <div class="flex justify-between items-center mb-3 px-1 text-xs text-[var(--theme-text-muted, var(--color-text-secondary))]">
    <span
      class="font-heading font-bold text-[var(--theme-text-primary, var(--color-text-main))]"
      style="font-family: var(--theme-heading-font, var(--font-heading));"
    >Tanya Jawab Populer</span>
    <!-- Tertiary/ghost style scroll button -->
    <button
      type="button"
      on:click={scrollRight}
      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-heading font-semibold transition-all cursor-pointer border border-transparent hover:border-[var(--theme-primary,var(--color-primary))]/40 hover:bg-[var(--theme-primary,var(--color-primary))]/10 active:scale-95 text-[var(--theme-primary,var(--color-primary))]"
      aria-label="Geser ke samping"
    >
      <span>Geser ke samping</span>
      <span aria-hidden="true">→</span>
    </button>
  </div>

  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    bind:this={scrollContainer}
    class="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 snap-x no-scrollbar text-left"
    style="cursor: grab;"
    on:mousedown={onDragStart}
    on:mousemove={onDragMove}
    on:mouseup={onDragEnd}
    on:mouseleave={onDragEnd}
    on:wheel={onWheel}
  >
    {#each faqs as item, index (item.id || index)}
      {@const isCardActive = $canvasStore.selectedSectionId === sectionId && $canvasStore.selectedNodeId === (item.id || `faq_item_${index}`)}
      {@const itemStyle = resolveFaqItemStyle(item, index, nodeStyles)}

      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectCard(e, index, item)}
        on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, item); }}
        class={`w-64 shrink-0 snap-start p-5 rounded-3xl bg-[var(--theme-surface, var(--color-card-base))] border border-[var(--color-border)] shadow-xs space-y-2 transition-all duration-200 cursor-pointer ${
          isCardActive
            ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100 shadow-md'
            : 'hover:shadow-md hover:border-[var(--theme-primary, var(--color-primary))]/30'
        }`}
        style="background: {itemStyle.backgroundColor || 'var(--theme-surface, var(--color-card-base))'}; border-color: {itemStyle.borderColor || 'var(--color-border)'}; border-radius: var(--theme-btn-border-radius, var(--btn-radius, 24px));"
      >
        <div class="w-7 h-7 rounded-xl bg-[var(--theme-primary, var(--color-primary))]/10 text-[var(--theme-primary, var(--color-primary))] flex items-center justify-center">
          <HelpCircle size={14} />
        </div>

        <h3
          class="font-heading font-bold text-xs line-clamp-2"
          style="color: {itemStyle.color || 'var(--theme-text-primary, var(--color-text-main))'}; font-family: var(--theme-heading-font, var(--font-heading));"
        >
          {item.question}
        </h3>

        <p class="text-xs text-[var(--theme-text-muted, var(--color-text-secondary))] leading-relaxed line-clamp-4 pt-1 border-t border-[var(--color-border)] font-sans" style="font-family: var(--theme-body-font, var(--font-family));">
          {item.answer}
        </p>
      </div>
    {/each}
  </div>
</div>
