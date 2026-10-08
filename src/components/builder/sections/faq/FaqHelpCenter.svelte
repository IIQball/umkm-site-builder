<script lang="ts">
  import type { FAQItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveFaqItemStyle } from './faqStyles.helpers';
  import { resolveFeatureIcon } from '../../sections/features/featureIcons';

  export let sectionId: string = '';
  export let faqs: (FAQItem & { iconName?: string })[] = [];
  export let nodeStyles: Record<string, Record<string, string>> = {};

  const DEFAULT_ICONS = ['package', 'refresh-cw', 'users', 'credit-card', 'shield-check', 'help-circle'];

  function selectCard(e: Event, idx: number, item: FAQItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `faq_item_${idx}`);
    }
  }
</script>

<div class="cq-faq-grid-3 text-left">
  {#each faqs as item, index (item.id || index)}
    {@const IconComponent = resolveFeatureIcon(item.iconName || DEFAULT_ICONS[index % DEFAULT_ICONS.length])}
    {@const isCardActive = $canvasStore.selectedSectionId === sectionId && $canvasStore.selectedNodeId === (item.id || `faq_item_${index}`)}
    {@const itemStyle = resolveFaqItemStyle(item, index, nodeStyles)}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, item)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, item); }}
      class={`p-5 rounded-3xl border border-[var(--color-border)] bg-[var(--theme-surface, var(--color-card-base))] shadow-xs space-y-3 transition-all duration-200 cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100 shadow-md'
          : 'hover:shadow-md hover:border-[var(--theme-primary, var(--color-primary))]/30'
      }`}
      style="background: {itemStyle.backgroundColor || 'var(--theme-surface, var(--color-card-base))'}; border-color: {itemStyle.borderColor || 'var(--color-border)'}; border-radius: var(--theme-btn-border-radius, var(--btn-radius, 24px));"
    >
      <div class="w-10 h-10 rounded-2xl bg-[var(--theme-primary, var(--color-primary))]/10 text-[var(--theme-primary, var(--color-primary))] border border-[var(--theme-primary, var(--color-primary))]/20 flex items-center justify-center">
        <svelte:component this={IconComponent} size={18} />
      </div>

      <h3
        class="font-heading font-bold text-xs sm:text-sm line-clamp-1"
        style="color: {itemStyle.color || 'var(--theme-text-primary, var(--color-text-main))'}; font-family: var(--theme-heading-font, var(--font-heading));"
      >
        {item.question}
      </h3>

      <p class="text-xs text-[var(--theme-text-muted, var(--color-text-secondary))] leading-relaxed line-clamp-3 pt-1 border-t border-[var(--color-border)] font-sans" style="font-family: var(--theme-body-font, var(--font-family));">
        {item.answer}
      </p>
    </div>
  {/each}
</div>
