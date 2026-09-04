<script lang="ts">
  import type { FAQItem } from '@/types';
  import { Package, RefreshCw, Users, HelpCircle, CreditCard, ShieldCheck } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let faqs: (FAQItem & { iconName?: string })[] = [];

  function selectCard(e: Event, idx: number, item: FAQItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `faq_item_${idx}`);
    }
  }

  function getIcon(name?: string, index: number = 0) {
    const icons = [Package, RefreshCw, Users, CreditCard, ShieldCheck, HelpCircle];
    if (name === 'Package') return Package;
    if (name === 'RefreshCw') return RefreshCw;
    if (name === 'Users' || name === 'Handshake') return Users;
    if (name === 'CreditCard') return CreditCard;
    if (name === 'ShieldCheck') return ShieldCheck;
    return icons[index % icons.length];
  }
</script>

<div class="cq-faq-grid-3 text-left">
  {#each faqs as item, index (item.id || index)}
    {@const IconComponent = getIcon(item.iconName, index)}
    {@const isCardActive = $canvasStore.selectedNodeId === (item.id || `faq_item_${index}`)}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, item)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, item); }}
      class={`p-5 rounded-3xl border border-[var(--color-border,rgba(15,23,42,0.08))] bg-[var(--color-card-base,var(--theme-surface,#ffffff))] shadow-xs space-y-3 transition-all duration-200 cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900 shadow-md'
          : 'hover:shadow-md hover:border-[var(--theme-primary,#2563eb)]/30'
      }`}
    >
      <div class="w-10 h-10 rounded-2xl bg-[var(--theme-primary,#2563eb)]/10 text-[var(--theme-primary,#2563eb)] border border-[var(--theme-primary,#2563eb)]/20 flex items-center justify-center">
        <svelte:component this={IconComponent} size={18} />
      </div>

      <h4 class="font-[var(--font-heading,inherit)] font-bold text-xs sm:text-sm text-[var(--color-text-main,var(--theme-text-primary,#0f172a))] line-clamp-1">
        {item.question}
      </h4>

      <p class="text-xs text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] leading-relaxed line-clamp-3 pt-1 border-t border-[var(--color-border,rgba(15,23,42,0.08))] font-[var(--font-family,inherit)]">
        {item.answer}
      </p>
    </div>
  {/each}
</div>
