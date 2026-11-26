<script lang="ts">
  import type { FAQItem } from "@/types";
  import { ChevronDown } from "lucide-svelte";
  import { canvasStore } from "../../stores/editorStore";
  import { resolveFaqItemStyle } from "./faqStyles.helpers";

  export let sectionId: string = "";
  export let faqs: FAQItem[] = [];
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let isLiveStorefront: boolean = false;

  let openSet = new Set<number>([0]);

  function toggle(idx: number) {
    if (openSet.has(idx)) {
      openSet.delete(idx);
    } else {
      openSet.add(idx);
    }
    openSet = new Set(openSet);
  }

  function handleToggle(idx: number, item: FAQItem) {
    toggle(idx);
    if (sectionId && !isLiveStorefront) {
      canvasStore.selectNode(sectionId, item.id || `faq_item_${idx}`);
    }
  }

  $: col1 = faqs.filter((_, i) => i % 2 === 0);
  $: col2 = faqs.filter((_, i) => i % 2 !== 0);
</script>

<div class="cq-faq-grid-2 text-left">
  <!-- Column 1 -->
  <div class="flex flex-col gap-3">
    {#each col1 as item, i (item.id || i * 2)}
      {@const originalIdx = i * 2}
      {@const isOpen = openSet.has(originalIdx)}
      {@const isItemActive =
        $canvasStore.selectedSectionId === sectionId &&
        $canvasStore.selectedNodeId === (item.id || `faq_item_${originalIdx}`)}
      {@const itemStyle = resolveFaqItemStyle(item, originalIdx, nodeStyles)}
      {@const controlId = `faq-control-${sectionId || 'col1'}-${originalIdx}`}
      {@const panelId = `faq-panel-${sectionId || 'col1'}-${originalIdx}`}

      <div
        class={`overflow-hidden shadow-xs transition-all duration-200 ${
          isItemActive
            ? "ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 shadow-md"
            : "hover:border-[var(--theme-primary, var(--color-primary))]/50"
        }`}
        style="background: {itemStyle.backgroundColor ||
          'var(--theme-surface, var(--color-card-base))'}; border: 1px solid {itemStyle.borderColor ||
          'var(--color-border)'}; border-radius: var(--theme-btn-border-radius, var(--btn-radius, 16px));"
      >
        <button
          id={controlId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          on:click={() => handleToggle(originalIdx, item)}
          class="w-full min-h-[44px] p-4 flex items-center justify-between gap-3 text-left font-heading font-bold text-xs hover:opacity-80 transition-colors cursor-pointer"
          style="color: {itemStyle.color ||
            'var(--theme-text-primary, var(--color-text-main))'}; font-family: var(--theme-heading-font, var(--font-heading));"
        >
          <span class="flex-1 min-w-0">{item.question}</span>
          <span
            class={`p-1.5 rounded-xl transition-transform duration-200 shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
            style="background: var(--color-nested-base); color: {isOpen
              ? 'var(--theme-primary, var(--color-primary))'
              : 'var(--theme-text-muted, var(--color-text-secondary))'};"
          >
            <ChevronDown size={14} />
          </span>
        </button>

        {#if isOpen}
          <div
            id={panelId}
            role="region"
            aria-labelledby={controlId}
            class="px-4 pb-4 pt-1 text-xs leading-relaxed border-t"
            style="color: var(--theme-text-muted, var(--color-text-secondary)); border-color: var(--color-border); font-family: var(--theme-body-font, var(--font-family));"
          >
            {item.answer}
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Column 2 -->
  <div class="flex flex-col gap-3">
    {#each col2 as item, i (item.id || i * 2 + 1)}
      {@const originalIdx = i * 2 + 1}
      {@const isOpen = openSet.has(originalIdx)}
      {@const isItemActive =
        $canvasStore.selectedSectionId === sectionId &&
        $canvasStore.selectedNodeId === (item.id || `faq_item_${originalIdx}`)}
      {@const itemStyle = resolveFaqItemStyle(item, originalIdx, nodeStyles)}
      {@const controlId = `faq-control-${sectionId || 'col2'}-${originalIdx}`}
      {@const panelId = `faq-panel-${sectionId || 'col2'}-${originalIdx}`}

      <div
        class={`overflow-hidden shadow-xs transition-all duration-200 ${
          isItemActive
            ? "ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 shadow-md"
            : "hover:border-[var(--theme-primary, var(--color-primary))]/50"
        }`}
        style="background: {itemStyle.backgroundColor ||
          'var(--theme-surface, var(--color-card-base))'}; border: 1px solid {itemStyle.borderColor ||
          'var(--color-border)'}; border-radius: var(--theme-btn-border-radius, var(--btn-radius, 16px));"
      >
        <button
          id={controlId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          on:click={() => handleToggle(originalIdx, item)}
          class="w-full min-h-[44px] p-4 flex items-center justify-between gap-3 text-left font-heading font-bold text-xs hover:opacity-80 transition-colors cursor-pointer"
          style="color: {itemStyle.color ||
            'var(--theme-text-primary, var(--color-text-main))'}; font-family: var(--theme-heading-font, var(--font-heading));"
        >
          <span class="flex-1 min-w-0">{item.question}</span>
          <span
            class={`p-1.5 rounded-xl transition-transform duration-200 shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
            style="background: var(--color-nested-base); color: {isOpen
              ? 'var(--theme-primary, var(--color-primary))'
              : 'var(--theme-text-muted, var(--color-text-secondary))'};"
          >
            <ChevronDown size={14} />
          </span>
        </button>

        {#if isOpen}
          <div
            id={panelId}
            role="region"
            aria-labelledby={controlId}
            class="px-4 pb-4 pt-1 text-xs leading-relaxed border-t"
            style="color: var(--theme-text-muted, var(--color-text-secondary)); border-color: var(--color-border); font-family: var(--theme-body-font, var(--font-family));"
          >
            {item.answer}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
