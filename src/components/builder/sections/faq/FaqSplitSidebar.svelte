<script lang="ts">
  import { ChevronDown, MessageCircle } from 'lucide-svelte';
  import type { FAQItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { buildWhatsAppHelpLink } from './faq.helpers';
  import { resolveFaqItemStyle } from './faqStyles.helpers';
  import { resolveFeatureIcon } from '../../sections/features/featureIcons';

  export let sectionId: string = '';
  export let faqs: FAQItem[] = [];
  export let waNumber: string = '';
  export let title: string = '';
  export let subtitle: string = '';
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let isActive: boolean = false;
  export let csIcon: string = 'HelpCircle';
  export let csTitle: string = 'Butuh Bantuan Langsung?';
  export let csDesc: string = 'Tim customer service kami siap membalas pesan dan membantu konsultasi produk Anda.';
  export let csButtonText: string = 'Chat WhatsApp CS Toko';

  $: CsIconComponent = resolveFeatureIcon(csIcon);

  let openIndex: number | null = 0;

  function toggle(idx: number) {
    openIndex = openIndex === idx ? null : idx;
  }

  function selectTitle(e: Event) {
    e.stopPropagation();
    if (sectionId) canvasStore.selectNode(sectionId, 'title');
  }

  function selectSubtitle(e: Event) {
    e.stopPropagation();
    if (sectionId) canvasStore.selectNode(sectionId, 'subtitle');
  }

  function selectCsCard(e: Event) {
    e.stopPropagation();
    if (sectionId) canvasStore.selectNode(sectionId, 'faq_cs_card');
  }

  function selectItem(e: Event, idx: number, item: FAQItem) {
    e.stopPropagation();
    if (sectionId) canvasStore.selectNode(sectionId, item.id || `faq_item_${idx}`);
  }

  $: isThisSectionSelected = isActive || $canvasStore?.selectedSectionId === sectionId;
  $: isTitleActive = isThisSectionSelected && ($canvasStore?.selectedNodeId === 'title' || $canvasStore?.selectedNodeId === 'faq_title');
  $: isSubtitleActive = isThisSectionSelected && ($canvasStore?.selectedNodeId === 'subtitle' || $canvasStore?.selectedNodeId === 'faq_subtitle');
  $: isCsCardActive = isThisSectionSelected && $canvasStore?.selectedNodeId === 'faq_cs_card';

  export let elementOrder: string[] = [];
  $: hasTitle = !elementOrder.length || elementOrder.includes('title') || elementOrder.includes('faq_title');
  $: hasSubtitle = !elementOrder.length || elementOrder.includes('subtitle') || elementOrder.includes('faq_subtitle');
  $: hasCsCard = !elementOrder.length || elementOrder.includes('faq_cs_card') || elementOrder.includes('cs_card');

  $: titleStyle = nodeStyles?.['title'] || nodeStyles?.['faq_title'] || {};
  $: subtitleStyle = nodeStyles?.['subtitle'] || nodeStyles?.['faq_subtitle'] || {};
  $: csCardStyle = nodeStyles?.['faq_cs_card'] || {};
</script>

<div class="cq-faq-split text-left">
  {#if hasTitle || hasSubtitle || hasCsCard}
  <!-- Left Side: CS Card & Info -->
  <div class="flex flex-col gap-4">
    {#if title && hasTitle}
      <div
        role="button"
        tabindex="0"
        data-node="title"
        on:click={selectTitle}
        on:keydown={(e) => { if (e.key === 'Enter') selectTitle(e); }}
        class={`inline-block cursor-pointer transition-all rounded-sm hover:outline-dashed hover:outline-1 hover:outline-[var(--theme-primary,var(--color-primary))]/50 ${
          isTitleActive ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2' : ''
        }`}
        style="margin-top: {titleStyle.marginTop || '0px'}; margin-bottom: {titleStyle.marginBottom || '0px'};"
      >
        <h2
          class="text-heading-lg font-heading font-black tracking-tight"
          style="color: {titleStyle.color || 'var(--theme-text-primary, var(--color-text-main))'}; font-family: var(--theme-heading-font, var(--font-heading)); font-size: var(--theme-h2-size, 26px); line-height: var(--theme-h2-line-height, 1.25);"
        >
          {title}
        </h2>
      </div>
    {/if}
    {#if subtitle && hasSubtitle}
      <div
        role="button"
        tabindex="0"
        data-node="subtitle"
        on:click={selectSubtitle}
        on:keydown={(e) => { if (e.key === 'Enter') selectSubtitle(e); }}
        class={`inline-block cursor-pointer transition-all rounded-sm hover:outline-dashed hover:outline-1 hover:outline-[var(--theme-primary,var(--color-primary))]/50 ${
          isSubtitleActive ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2' : ''
        }`}
        style="margin-top: {subtitleStyle.marginTop || '0px'}; margin-bottom: {subtitleStyle.marginBottom || '0px'};"
      >
        <p
          class="text-xs sm:text-sm leading-relaxed"
          style="color: {subtitleStyle.color || 'var(--theme-text-muted, var(--color-text-secondary))'}; font-family: var(--theme-body-font, var(--font-family));"
        >
          {subtitle}
        </p>
      </div>
    {/if}

    {#if hasCsCard}
    <div
      role="button"
      tabindex="0"
      on:click={selectCsCard}
      on:keydown={(e) => { if (e.key === 'Enter') selectCsCard(e); }}
      class={`p-6 shadow-xs flex flex-col gap-3 transition-all duration-200 cursor-pointer ${
        isCsCardActive
          ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 shadow-md'
          : 'hover:border-[var(--theme-primary, var(--color-primary))]/50'
      }`}
      style="background: {csCardStyle.backgroundColor || 'var(--theme-surface, var(--color-card-base))'}; border: 1px solid {csCardStyle.borderColor || 'var(--color-border)'}; border-radius: var(--theme-btn-border-radius, var(--btn-radius, 24px));"
    >
      <div
        class="flex items-center gap-2 text-xs font-heading font-bold"
        style="color: var(--theme-primary, var(--color-primary)); font-family: var(--theme-heading-font, var(--font-heading));"
      >
        <svelte:component this={CsIconComponent} size={17} />
        <span>{csTitle}</span>
      </div>
      <p
        class="text-xs leading-relaxed"
        style="color: {csCardStyle.color || 'var(--theme-text-muted, var(--color-text-secondary))'}; font-family: var(--theme-body-font, var(--font-family));"
      >
        {csDesc}
      </p>
      <a
        href={buildWhatsAppHelpLink(waNumber)}
        target="_blank"
        rel="noopener noreferrer"
        on:click|stopPropagation
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-heading font-bold transition-all shadow-xs active:scale-[0.98]"
        style="background: var(--theme-btn-primary-bg, var(--color-primary)); color: var(--theme-btn-primary-text, white); border-radius: var(--theme-btn-border-radius, var(--btn-radius, 16px)); font-family: var(--theme-heading-font, var(--font-heading));"
      >
        <MessageCircle size={14} />
        <span>{csButtonText}</span>
      </a>
    </div>
    {/if}
  </div>
  {/if}

  <!-- Right Side: Accordion List -->
  <div class="flex flex-col gap-3">
    {#each faqs as item, index (item.id || index)}
      {@const isOpen = openIndex === index}
      {@const isItemActive = isThisSectionSelected && $canvasStore.selectedNodeId === (item.id || `faq_item_${index}`)}
      {@const itemStyle = resolveFaqItemStyle(item, index, nodeStyles)}

      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectItem(e, index, item)}
        on:keydown={(e) => { if (e.key === 'Enter') selectItem(e, index, item); }}
        class={`overflow-hidden shadow-xs transition-all duration-200 cursor-pointer ${
          isItemActive
            ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 shadow-md'
            : 'hover:border-[var(--theme-primary, var(--color-primary))]/50'
        }`}
        style="background: {itemStyle.backgroundColor || 'var(--theme-surface, var(--color-card-base))'}; border: 1px solid {itemStyle.borderColor || 'var(--color-border)'}; border-radius: var(--theme-btn-border-radius, var(--btn-radius, 16px)); margin-top: {itemStyle.marginTop}; margin-bottom: {itemStyle.marginBottom};"
      >
        <button
          type="button"
          on:click|stopPropagation={() => toggle(index)}
          class="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-heading font-bold text-xs sm:text-sm hover:opacity-80 transition-colors cursor-pointer"
          style="color: {itemStyle.color || 'var(--theme-text-primary, var(--color-text-main))'}; font-family: var(--theme-heading-font, var(--font-heading));"
        >
          <span class="flex-1 min-w-0">{item.question}</span>
          <span
            class={`p-1.5 rounded-xl transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
            style="background: var(--color-nested-base); color: {isOpen ? 'var(--theme-primary, var(--color-primary))' : 'var(--theme-text-muted, var(--color-text-secondary))'};"
          >
            <ChevronDown size={15} />
          </span>
        </button>

        {#if isOpen}
          <div
            class="px-5 pb-5 pt-1 text-xs leading-relaxed border-t"
            style="color: var(--theme-text-muted, var(--color-text-secondary)); border-color: var(--color-border); font-family: var(--theme-body-font, var(--font-family));"
          >
            {item.answer}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
