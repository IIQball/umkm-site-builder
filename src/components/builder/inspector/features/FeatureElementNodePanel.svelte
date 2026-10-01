<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { Sparkles, Type, FileText, MousePointerClick, Image as ImageIcon, Layers, Sliders } from 'lucide-svelte';
  import NodeStyleControls from '../NodeStyleControls.svelte';
  import { getFeaturesSlotLabel } from '../../sections/features/featuresLayout.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: activePreset =
    (section.layoutPreset as string) ||
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    'grid_3_cards';

  const ALIAS_MAP: Record<string, string> = {
    feature_badge: 'badge',
    badge: 'feature_badge',
    feature_title: 'title',
    title: 'feature_title',
    features_heading: 'title',
    feature_subtitle: 'subtitle',
    subtitle: 'feature_subtitle',
    feature_cta: 'cta',
    cta: 'feature_cta',
    features_image: 'image',
    image: 'features_image',
  };

  function getNodeStyleVal(id: string, prop: 'color' | 'marginTop' | 'marginBottom'): string {
    const nodeStyles = section.props?.nodeStyles as Record<string, Record<string, string>> | undefined;
    const direct = nodeStyles?.[id]?.[prop];
    if (direct !== undefined && direct !== '') return direct;
    const alias = ALIAS_MAP[id];
    return (alias && nodeStyles?.[alias]?.[prop]) || '';
  }

  function setNodeStyleVal(id: string, prop: 'color' | 'marginTop' | 'marginBottom', value: string) {
    const currentProps = section.props || {};
    const currentNodeStyles = (currentProps.nodeStyles as Record<string, Record<string, string>> | undefined) || {};
    const nodeObj = { ...(currentNodeStyles[id] || {}) };
    nodeObj[prop] = value;

    const alias = ALIAS_MAP[id];
    const updatedStyles = {
      ...currentNodeStyles,
      [id]: nodeObj,
      ...(alias ? { [alias]: nodeObj } : {}),
    };
    onPropChange('nodeStyles', updatedStyles);
  }

  $: isItemNode = nodeId.startsWith('feature_item_') || nodeId.startsWith('item_');
  $: isFeatureListSlot = [
    'feature_cards',
    'feature_rows',
    'ribbon_bar',
    'bento_spotlight',
    'bento_cards',
    'zigzag_items',
    'tab_nav',
    'tab_card',
    'accordion_list',
    'scroll_cards',
    'icon_matrix',
    'features_grid',
  ].includes(nodeId);
</script>

<div class="space-y-4 text-left">
  {#if nodeId === 'badge' || nodeId === 'feature_badge'}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <Sparkles size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Lencana & Tagline Fitur</span>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom') || '12px'}
        colorLabel="Warna Teks Lencana (Token)"
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
        onMarginTopChange={(mt) => setNodeStyleVal(nodeId, 'marginTop', mt)}
        onMarginBottomChange={(mb) => setNodeStyleVal(nodeId, 'marginBottom', mb)}
      />
    </div>

  {:else if nodeId === 'title' || nodeId === 'feature_title' || nodeId === 'features_heading'}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <Type size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Judul Utama (Heading)</span>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom') || '12px'}
        colorLabel="Warna Judul Fitur (Token)"
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
        onMarginTopChange={(mt) => setNodeStyleVal(nodeId, 'marginTop', mt)}
        onMarginBottomChange={(mb) => setNodeStyleVal(nodeId, 'marginBottom', mb)}
      />
    </div>

  {:else if nodeId === 'subtitle' || nodeId === 'feature_subtitle'}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <FileText size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Subjudul & Deskripsi Fitur</span>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom') || '0px'}
        colorLabel="Warna Subjudul (Token)"
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
        onMarginTopChange={(mt) => setNodeStyleVal(nodeId, 'marginTop', mt)}
        onMarginBottomChange={(mb) => setNodeStyleVal(nodeId, 'marginBottom', mb)}
      />
    </div>

  {:else if isItemNode}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <Layers size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Kartu Item Fitur</span>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        showMargins={false}
        colorLabel="Warna Teks Item (Token)"
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
      />
    </div>

  {:else if isFeatureListSlot}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <Layers size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya {getFeaturesSlotLabel(nodeId, activePreset)}</span>
      </div>
      <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl">
        Tata letak wadah kartu fitur diatur otomatis oleh preset {activePreset}. Untuk mengubah warna teks item, klik langsung kartu fitur pada kanvas.
      </p>
    </div>

  {:else if nodeId === 'image' || nodeId === 'features_image'}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <ImageIcon size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Gambar Ilustrasi Fitur</span>
      </div>
      <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl">
        Posisi gambar ilustrasi diatur berdampingan (split 2-kolom) sesuai preset tata letak fitur.
      </p>
    </div>

  {:else if nodeId === 'cta'}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <MousePointerClick size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Tombol WhatsApp (CTA)</span>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom')}
        colorLabel="Warna Teks Tombol (Token)"
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
        onMarginTopChange={(mt) => setNodeStyleVal(nodeId, 'marginTop', mt)}
        onMarginBottomChange={(mb) => setNodeStyleVal(nodeId, 'marginBottom', mb)}
      />
    </div>

  {:else}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <Sliders size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Elemen: {nodeId}</span>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom')}
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
        onMarginTopChange={(mt) => setNodeStyleVal(nodeId, 'marginTop', mt)}
        onMarginBottomChange={(mb) => setNodeStyleVal(nodeId, 'marginBottom', mb)}
      />
    </div>
  {/if}
</div>
