<script lang="ts">
  import type { FAQProps, SectionStyles, FAQItem } from '@/types';
  import './faq/faq.css';
  import { DEFAULT_FAQS } from './faq/faq.helpers';
  import { getEffectiveFaqElementOrder } from './faq/faqLayout.helpers';
  import FaqHeader from './faq/FaqHeader.svelte';
  import FaqAccordionSingle from './faq/FaqAccordionSingle.svelte';
  import FaqSplitSidebar from './faq/FaqSplitSidebar.svelte';
  import FaqGridCards from './faq/FaqGridCards.svelte';
  import FaqAccordionTwoCol from './faq/FaqAccordionTwoCol.svelte';
  import FaqChatStyle from './faq/FaqChatStyle.svelte';
  import FaqSearchFiltered from './faq/FaqSearchFiltered.svelte';
  import FaqCategorizedTabs from './faq/FaqCategorizedTabs.svelte';
  import FaqNumberedList from './faq/FaqNumberedList.svelte';
  import FaqHelpCenter from './faq/FaqHelpCenter.svelte';
  import FaqHorizontalCards from './faq/FaqHorizontalCards.svelte';

  export let props: FAQProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'accordion_single_col';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'accordion_single_col';

  // Dual-mode data: Live Tenant DB vs Designer Manual props vs Fallback Mock data
  $: faqs = (Array.isArray(props?.faqs) && props.faqs.length > 0
    ? props.faqs
    : DEFAULT_FAQS) as (FAQItem & { category?: string; iconName?: string })[];

  $: title = (props?.title as string) || (props?.heading as string) || 'Pertanyaan yang Sering Diajukan';
  $: subtitle = (props?.subtitle as string) || (props?.subheading as string) || 'Temukan solusi cepat dan informasi penting seputar layanan serta produk kami.';
  $: badgeText = (props?.badgeText as string) || 'Pusat Bantuan Konsumen';
  $: waNumber = (props?.whatsappNumber as string) || (props?.waNumber as string) || '';

  $: nodeStyles = (props?.nodeStyles as Record<string, Record<string, string>>) || {};
  $: csIcon = (props?.csIcon as string) || 'HelpCircle';
  $: csTitle = (props?.csTitle as string) || 'Butuh Bantuan Langsung?';
  $: csDesc = (props?.csDesc as string) || 'Tim customer service kami siap membalas pesan dan membantu konsultasi produk Anda.';
  $: csButtonText = (props?.csButtonText as string) || 'Chat WhatsApp CS Toko';

  $: effectiveOrder = getEffectiveFaqElementOrder(
    activePreset,
    props?.elementOrder,
    faqs,
    (props?.faqPreset as string) || (props?.layoutPreset as string) || layoutPreset
  );

  const getSlotOrder = (slot: string) => {
    const idx = effectiveOrder.indexOf(slot);
    return idx === -1 ? 99 : idx;
  };

  $: visibleFaqs = faqs.filter(
    (_, idx) =>
      !effectiveOrder.length ||
      effectiveOrder.includes('faq_list') ||
      effectiveOrder.includes('faq_items') ||
      effectiveOrder.includes(`item_${idx}`) ||
      effectiveOrder.includes(`faq_item_${idx}`)
  );

  $: hasHeader =
    activePreset !== 'split_faq_sidebar' &&
    (!effectiveOrder.length ||
      effectiveOrder.includes('badge') ||
      effectiveOrder.includes('faq_badge') ||
      effectiveOrder.includes('title') ||
      effectiveOrder.includes('faq_title') ||
      effectiveOrder.includes('subtitle') ||
      effectiveOrder.includes('faq_subtitle'));

  $: headerMinOrder = Math.min(
    getSlotOrder('badge'),
    getSlotOrder('title'),
    getSlotOrder('subtitle')
  );
  $: listOrder = Math.min(
    getSlotOrder('faq_list'),
    ...faqs.map((_, i) => getSlotOrder(`faq_item_${i}`))
  );
</script>

<div
  data-node="faq_container"
  class="faq-card w-full box-border py-12"
  style="container-type: inline-size; container-name: faqcard;"
>
  <div
    class="builder-safe-container w-full flex flex-col"
    style="max-width: var(--active-max-width, var(--theme-max-width, 1200px)); margin: 0 auto; padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px);"
  >
    <!-- Header Section (hidden inside sidebar split preset since it renders its own heading) -->
    {#if hasHeader}
      <div style="order: {headerMinOrder};" class="w-full">
        <FaqHeader
          {sectionId}
          {title}
          {subtitle}
          {badgeText}
          align="center"
          elementOrder={effectiveOrder}
          {nodeStyles}
          {isActive}
        />
      </div>
    {/if}

    <div style="order: {listOrder};" class="w-full">
      {#if activePreset === 'split_faq_sidebar'}
        <FaqSplitSidebar
          {sectionId}
          faqs={visibleFaqs}
          {waNumber}
          {title}
          {subtitle}
          {nodeStyles}
          {isActive}
          {csIcon}
          {csTitle}
          {csDesc}
          {csButtonText}
          elementOrder={effectiveOrder}
        />
      {:else if activePreset === 'grid_2_col_cards'}
        <FaqGridCards {sectionId} faqs={visibleFaqs} {nodeStyles} />
      {:else if activePreset === 'accordion_two_col'}
        <FaqAccordionTwoCol {sectionId} faqs={visibleFaqs} {nodeStyles} />
      {:else if activePreset === 'chat_style_faq'}
        <FaqChatStyle {sectionId} faqs={visibleFaqs} {nodeStyles} />
      {:else if activePreset === 'search_filtered_faq'}
        <FaqSearchFiltered {sectionId} faqs={visibleFaqs} {nodeStyles} elementOrder={effectiveOrder} />
      {:else if activePreset === 'categorized_tabs_faq'}
        <FaqCategorizedTabs {sectionId} faqs={visibleFaqs} {nodeStyles} elementOrder={effectiveOrder} />
      {:else if activePreset === 'compact_numbered_list'}
        <FaqNumberedList {sectionId} faqs={visibleFaqs} {nodeStyles} />
      {:else if activePreset === 'floating_help_center'}
        <FaqHelpCenter {sectionId} faqs={visibleFaqs} {nodeStyles} />
      {:else if activePreset === 'horizontal_faq_cards'}
        <FaqHorizontalCards {sectionId} faqs={visibleFaqs} {nodeStyles} />
      {:else}
        <!-- Default: accordion_single_col -->
        <FaqAccordionSingle {sectionId} faqs={visibleFaqs} {nodeStyles} />
      {/if}
    </div>
  </div>
</div>
