<script lang="ts">
  import type { FAQItem } from "@/types";
  import { ChevronDown } from "lucide-svelte";
  import { canvasStore } from "../../stores/editorStore";
  import { resolveFaqItemStyle } from "./faqStyles.helpers";

  export let sectionId: string = "";
  export let faqs: FAQItem[] = [];
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let isLiveStorefront: boolean = false;

  let openIndex: number | null = 0;

  function toggle(idx: number) {
    openIndex = openIndex === idx ? null : idx;
  }

  function handleToggle(idx: number, item: FAQItem) {
    toggle(idx);
    if (sectionId && !isLiveStorefront) {
      canvasStore.selectNode(sectionId, item.id || `faq_item_${idx}`);
    }
  }
</script>

<div class="max-w-3xl mx-auto flex flex-col gap-3 text-left">
  {#each faqs as item, index (item.id || index)}
    {@const isOpen = openIndex === index}
    {@const isItemActive =
      $canvasStore.selectedSectionId === sectionId &&
      $canvasStore.selectedNodeId === (item.id || `faq_item_${index}`)}
    {@const itemStyle = resolveFaqItemStyle(item, index, nodeStyles)}
    {@const controlId = `faq-control-${sectionId || 'single'}-${index}`}
    {@const panelId = `faq-panel-${sectionId || 'single'}-${index}`}

    <div
      class={`overflow-hidden shadow-xs transition-all duration-200 ${
        isItemActive
          ? "ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 shadow-md"
          : "hover:border-[var(--theme-primary, var(--color-primary))]/50"
      }`}
      style="background: {itemStyle.backgroundColor ||
        'var(--theme-surface, var(--color-card-base))'}; border: 1px solid {itemStyle.borderColor ||
        'var(--color-border)'}; border-radius: var(--theme-btn-border-radius, var(--btn-radius, 16px)); margin-top: {itemStyle.marginTop}; margin-bottom: {itemStyle.marginBottom};"
    >
      <button
        id={controlId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        on:click={() => handleToggle(index, item)}
        class="w-full min-h-[44px] p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-heading font-bold text-xs sm:text-sm hover:opacity-80 transition-colors cursor-pointer"
        style="color: {itemStyle.color ||
          'var(--theme-text-primary, var(--color-text-main))'}; font-family: var(--theme-heading-font, var(--font-heading)); font-size: var(--theme-text-h3, var(--text-h3-size, 18px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700));"
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
          <ChevronDown size={15} />
        </span>
      </button>

      {#if isOpen}
        <div
          id={panelId}
          role="region"
          aria-labelledby={controlId}
          class="px-5 pb-5 pt-1 text-xs leading-relaxed border-t"
          style="color: var(--theme-text-muted, var(--color-text-secondary)); border-color: var(--color-border); font-family: var(--theme-body-font, var(--font-family)); font-size: var(--theme-text-body, var(--text-body-size, 16px)); font-weight: var(--theme-text-body-weight, var(--text-body-weight, 400));"
        >
          {item.answer}
        </div>
      {/if}
    </div>
  {/each}
</div>
