<script lang="ts">
  import type { FAQProps, SectionStyles, FAQItem } from '@/types';
  import './faq/faq.css';
  import { DEFAULT_FAQS } from './faq/faq.helpers';
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
  export let layoutPreset: string = 'accordion_single_col';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'accordion_single_col';

  // Dual-mode data: Live Tenant DB vs Designer Manual props vs Fallback Mock data
  $: faqs = (Array.isArray(props?.faqs) && props.faqs.length > 0
    ? props.faqs
    : DEFAULT_FAQS) as (FAQItem & { category?: string; iconName?: string })[];

  $: title = (props?.title as string) || (props?.heading as string) || 'Pertanyaan yang Sering Diajukan';
  $: subtitle = (props?.subtitle as string) || 'Temukan solusi cepat dan informasi penting seputar layanan serta produk kami.';
  $: badgeText = (props?.badgeText as string) || 'Pusat Bantuan Konsumen';
  $: waNumber = (props?.whatsappNumber as string) || (props?.waNumber as string) || '';
</script>

<div
  data-node="faq_container"
  class="faq-card w-full box-border py-12"
  style="container-type: inline-size; container-name: faqcard;"
>
  <div
    class="builder-safe-container w-full"
    style="max-width: var(--active-max-width, var(--theme-max-width, 1200px)); margin: 0 auto; padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px);"
  >
    <!-- Header Section (hidden inside sidebar split preset since it renders its own heading) -->
    {#if activePreset !== 'split_faq_sidebar'}
      <FaqHeader
        {sectionId}
        {title}
        {subtitle}
        {badgeText}
        align="center"
      />
    {/if}

    {#if activePreset === 'split_faq_sidebar'}
      <FaqSplitSidebar
        {sectionId}
        {faqs}
        {waNumber}
        {title}
        {subtitle}
      />
    {:else if activePreset === 'grid_2_col_cards'}
      <FaqGridCards {sectionId} {faqs} />
    {:else if activePreset === 'accordion_two_col'}
      <FaqAccordionTwoCol {sectionId} {faqs} />
    {:else if activePreset === 'chat_style_faq'}
      <FaqChatStyle {sectionId} {faqs} />
    {:else if activePreset === 'search_filtered_faq'}
      <FaqSearchFiltered {sectionId} {faqs} />
    {:else if activePreset === 'categorized_tabs_faq'}
      <FaqCategorizedTabs {sectionId} {faqs} />
    {:else if activePreset === 'compact_numbered_list'}
      <FaqNumberedList {sectionId} {faqs} />
    {:else if activePreset === 'floating_help_center'}
      <FaqHelpCenter {sectionId} {faqs} />
    {:else if activePreset === 'horizontal_faq_cards'}
      <FaqHorizontalCards {sectionId} {faqs} />
    {:else}
      <!-- Default: accordion_single_col -->
      <FaqAccordionSingle {sectionId} {faqs} />
    {/if}
  </div>
</div>
