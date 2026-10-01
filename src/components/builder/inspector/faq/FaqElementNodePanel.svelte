<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import type { FAQItem } from '@/types';
  import {
    Sparkles,
    Type,
    FileText,
    HelpCircle,
    MessageSquare,
    Search,
    ListFilter,
    Sliders,
    Layers,
  } from 'lucide-svelte';
  import NodeStyleControls from '../NodeStyleControls.svelte';
  import { DEFAULT_FAQS } from '../../sections/faq/faq.helpers';
  import { isFaqCardMarginAllowed } from '../../sections/faq/faqStyles.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};
  export let onSectionUpdate: (section: TemplateSection) => void = () => {};

  $: activePreset =
    (section.layoutPreset as string) ||
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    'accordion_single_col';

  $: faqs = (Array.isArray(section.props?.faqs) && section.props.faqs.length > 0
    ? (section.props.faqs as FAQItem[])
    : DEFAULT_FAQS) as FAQItem[];

  $: itemIndex = (() => {
    if (nodeId.startsWith('faq_item_')) return parseInt(nodeId.replace('faq_item_', ''), 10);
    if (nodeId.startsWith('item_')) return parseInt(nodeId.replace('item_', ''), 10);
    const foundIdx = faqs.findIndex((f) => f.id === nodeId);
    if (foundIdx !== -1) return foundIdx;
    return 0;
  })();

  $: currentFaq = faqs[itemIndex] || faqs[0];

  $: isBadge = nodeId === 'badge' || nodeId === 'faq_badge';
  $: isTitle = nodeId === 'title' || nodeId === 'faq_header' || nodeId === 'header' || nodeId === 'faq_title';
  $: isSubtitle = nodeId === 'subtitle' || nodeId === 'faq_subtitle';
  $: isCsCard = nodeId === 'faq_cs_card';
  $: isSearchBar = nodeId === 'faq_search_bar';
  $: isTabs = nodeId === 'faq_tabs';
  $: isFaqItem =
    nodeId.startsWith('faq_item_') ||
    nodeId.startsWith('item_') ||
    faqs.some((f) => f.id === nodeId);

  $: showItemMargins = isFaqCardMarginAllowed(activePreset, nodeId);

  const ALIAS_MAP: Record<string, string> = {
    badge: 'faq_badge',
    faq_badge: 'badge',
    title: 'faq_header',
    faq_header: 'title',
    header: 'title',
    faq_title: 'title',
    subtitle: 'faq_subtitle',
    faq_subtitle: 'subtitle',
  };

  $: effectiveStyleKey = (() => {
    if (isFaqItem && currentFaq?.id) return currentFaq.id;
    if (isFaqItem) return `faq_item_${itemIndex}`;
    return nodeId;
  })();

  $: nodeStyles = (section.props?.nodeStyles as Record<string, Record<string, string>>) || {};
  $: currentStyle = nodeStyles[effectiveStyleKey] || (ALIAS_MAP[nodeId] ? nodeStyles[ALIAS_MAP[nodeId]] : {}) || {};

  function handleStyleUpdate(field: string, val: string) {
    const updatedNodeStyles = { ...nodeStyles };
    const targetKey = effectiveStyleKey;
    const existing = updatedNodeStyles[targetKey] || (ALIAS_MAP[nodeId] ? updatedNodeStyles[ALIAS_MAP[nodeId]] : {}) || {};

    updatedNodeStyles[targetKey] = {
      ...existing,
      [field]: val,
    };

    if (ALIAS_MAP[nodeId] && targetKey !== ALIAS_MAP[nodeId]) {
      updatedNodeStyles[ALIAS_MAP[nodeId]] = {
        ...(updatedNodeStyles[ALIAS_MAP[nodeId]] || {}),
        [field]: val,
      };
    }

    if (onSectionUpdate && section) {
      onSectionUpdate({
        ...section,
        props: {
          ...(section.props || {}),
          nodeStyles: updatedNodeStyles,
        },
      });
    } else {
      onPropChange('nodeStyles', updatedNodeStyles);
    }
  }
</script>

<div class="space-y-4">
  <!-- Info Header Context -->
  <div class="flex items-center gap-2 p-2.5 bg-base-200/50 rounded-lg border border-base-300/80">
    <div class="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
      {#if isBadge}
        <Sparkles size={14} />
      {:else if isTitle}
        <Type size={14} />
      {:else if isSubtitle}
        <FileText size={14} />
      {:else if isCsCard}
        <MessageSquare size={14} />
      {:else if isSearchBar}
        <Search size={14} />
      {:else if isTabs}
        <ListFilter size={14} />
      {:else}
        <HelpCircle size={14} />
      {/if}
    </div>
    <div class="min-w-0 flex-1">
      <div class="font-heading font-bold text-xs text-base-content truncate">
        {#if isBadge}
          Lencana & Tagline
        {:else if isTitle}
          Judul Utama Section FAQ (H2)
        {:else if isSubtitle}
          Deskripsi Subjudul FAQ
        {:else if isCsCard}
          Kartu Bantuan CS WhatsApp
        {:else if isSearchBar}
          Bilah Pencarian FAQ
        {:else if isTabs}
          Tab Kategori FAQ
        {:else if isFaqItem}
          Pertanyaan #{itemIndex + 1}: {currentFaq?.question || 'Tanya Jawab'}
        {:else}
          Elemen FAQ: {nodeId}
        {/if}
      </div>
      <div class="text-2xs text-base-content/60 truncate">
        Kustomisasi gaya visual khusus untuk elemen ini
      </div>
    </div>
  </div>

  {#if isCsCard}
    <!-- Gating Notice for Side CS Card -->
    <div class="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-700 dark:text-amber-300 text-2xs space-y-1">
      <div class="flex items-center gap-1 font-semibold">
        <Layers size={11} />
        <span>Margin Samping Terkunci</span>
      </div>
      <p class="leading-relaxed">
        Margin vertikal dinonaktifkan untuk kartu bantuan samping (kiri) agar tinggi dan perataan kolom tetap presisi dengan daftar pertanyaan.
      </p>
    </div>
  {:else if isFaqItem && !showItemMargins}
    <!-- Gating Notice for Grid/Horizontal Layouts -->
    <div class="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-700 dark:text-blue-300 text-2xs space-y-1">
      <div class="flex items-center gap-1 font-semibold">
        <Sliders size={11} />
        <span>Margin Kartu Dinonaktifkan</span>
      </div>
      <p class="leading-relaxed">
        Margin per kartu dinonaktifkan pada tata letak grid / multi-kolom samping / horizontal agar ketinggian dan jarak antar kartu tetap sejajar serta rapi.
      </p>
    </div>
  {/if}

  <!-- Unified Node Style Controls -->
  <NodeStyleControls
    color={currentStyle.color || ''}
    marginTop={currentStyle.marginTop || '0px'}
    marginBottom={currentStyle.marginBottom || '0px'}
    showMargins={showItemMargins}
    colorLabel={isFaqItem ? 'Warna Teks Pertanyaan (Token)' : 'Warna Teks Elemen (Token)'}
    onColorChange={(val) => handleStyleUpdate('color', val)}
    onMarginTopChange={(val) => handleStyleUpdate('marginTop', val)}
    onMarginBottomChange={(val) => handleStyleUpdate('marginBottom', val)}
  />
</div>
