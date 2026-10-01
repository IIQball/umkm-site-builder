<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import type { TestimonialItem } from '@/types';
  import {
    Sparkles,
    Type,
    FileText,
    MessageSquareQuote,
    Image as ImageIcon,
    BarChart3,
    Sliders,
    Layers,
    User,
  } from 'lucide-svelte';
  import NodeStyleControls from '../NodeStyleControls.svelte';
  import { DEFAULT_TESTIMONIALS } from '../../sections/testimonials/testimonials.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};
  export let onSectionUpdate: (section: TemplateSection) => void = () => {};

  $: activePreset =
    (section.layoutPreset as string) ||
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    'masonry_grid';

  $: testimonials = (Array.isArray(section.props?.testimonials) && section.props.testimonials.length > 0
    ? (section.props.testimonials as TestimonialItem[])
    : DEFAULT_TESTIMONIALS) as TestimonialItem[];

  $: itemIndex = (() => {
    if (nodeId.startsWith('testi_item_')) return parseInt(nodeId.replace('testi_item_', ''), 10);
    if (nodeId.startsWith('testi_avatar_')) return parseInt(nodeId.replace('testi_avatar_', ''), 10);
    if (nodeId.startsWith('testi_logo_')) return parseInt(nodeId.replace('testi_logo_', ''), 10);
    if (nodeId.startsWith('item_')) return parseInt(nodeId.replace('item_', ''), 10);
    const foundIdx = testimonials.findIndex((t) => t.id === nodeId);
    if (foundIdx !== -1) return foundIdx;
    return 0;
  })();

  $: currentTesti = testimonials[itemIndex] || testimonials[0];

  $: isBadge = nodeId === 'badge' || nodeId === 'testi_badge';
  $: isTitle = nodeId === 'title' || nodeId === 'testimonials_header' || nodeId === 'header';
  $: isSubtitle = nodeId === 'subtitle' || nodeId === 'testi_subtitle';
  $: isTestiItem =
    nodeId.startsWith('testi_item_') ||
    nodeId.startsWith('item_') ||
    testimonials.some((t) => t.id === nodeId);
  $: isAvatar = nodeId.startsWith('testi_avatar_');
  $: isSpotlightQuote = nodeId === 'testi_spotlight_quote';
  $: isSpotlightAuthor = nodeId === 'testi_spotlight_author';
  $: isStats = nodeId === 'testi_stats';
  $: isSliderTrack = nodeId === 'testi_slider_track';
  $: isLogoCloud = nodeId === 'testi_logo_cloud' || nodeId.startsWith('testi_logo_');

  // Gating rule: Margin hanya aktif pada tata letak bertumpuk atas-ke-bawah (vertical stack).
  // Non-vertikal / multi-kolom samping (grid, carousel, split, dsb) dinonaktifkan.
  $: isVerticalStackCard = activePreset === 'single_spotlight' || activePreset === 'chat_bubble_flow';
  $: showItemMargins = isVerticalStackCard;

  const ALIAS_MAP: Record<string, string> = {
    badge: 'testi_badge',
    testi_badge: 'badge',
    title: 'testimonials_header',
    testimonials_header: 'title',
    header: 'title',
    subtitle: 'testi_subtitle',
    testi_subtitle: 'subtitle',
  };

  function getNodeStyleVal(id: string, prop: 'color' | 'marginTop' | 'marginBottom'): string {
    const nodeStyles = section.props?.nodeStyles as Record<string, Record<string, string>> | undefined;
    if (!nodeStyles) return '';
    if (isTestiItem) {
      return (
        nodeStyles[currentTesti?.id || '']?.[prop] ||
        nodeStyles[`testi_item_${itemIndex}`]?.[prop] ||
        nodeStyles[`item_${itemIndex}`]?.[prop] ||
        ''
      );
    }
    const direct = nodeStyles[id]?.[prop];
    if (direct !== undefined && direct !== '') return direct;
    const alias = ALIAS_MAP[id];
    return (alias && nodeStyles[alias]?.[prop]) || '';
  }

  function setNodeStyleVal(id: string, prop: 'color' | 'marginTop' | 'marginBottom', value: string) {
    const currentProps = section.props || {};
    const currentNodeStyles = (currentProps.nodeStyles as Record<string, Record<string, string>> | undefined) || {};
    const updated = { ...currentNodeStyles };

    if (isTestiItem) {
      const tId = currentTesti?.id;
      const slotId = `testi_item_${itemIndex}`;
      if (tId) {
        updated[tId] = { ...(updated[tId] || {}), [prop]: value };
      }
      updated[slotId] = { ...(updated[slotId] || {}), [prop]: value };
    } else {
      updated[id] = { ...(updated[id] || {}), [prop]: value };
      const alias = ALIAS_MAP[id];
      if (alias) {
        updated[alias] = { ...(updated[alias] || {}), [prop]: value };
      }
    }

    onPropChange('nodeStyles', updated);
    onSectionUpdate({ ...section, props: { ...currentProps, nodeStyles: updated } });
  }
</script>

<div class="space-y-4 text-left">
  {#if isBadge}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <Sparkles size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Lencana Ulasan</span>
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

  {:else if isTitle}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <Type size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Judul Testimoni (H2)</span>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom') || '12px'}
        colorLabel="Warna Judul Testimoni (Token)"
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
        onMarginTopChange={(mt) => setNodeStyleVal(nodeId, 'marginTop', mt)}
        onMarginBottomChange={(mb) => setNodeStyleVal(nodeId, 'marginBottom', mb)}
      />
    </div>

  {:else if isSubtitle}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <FileText size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Subjudul & Deskripsi</span>
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

  {:else if isTestiItem}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <MessageSquareQuote size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Kartu: {currentTesti?.customerName || `Ulasan #${itemIndex + 1}`}</span>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom')}
        showMargins={showItemMargins}
        colorLabel="Warna Teks Ulasan (Token)"
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
        onMarginTopChange={(mt) => setNodeStyleVal(nodeId, 'marginTop', mt)}
        onMarginBottomChange={(mb) => setNodeStyleVal(nodeId, 'marginBottom', mb)}
      />
      {#if !showItemMargins}
        <p class="text-2xs text-base-content/60 italic p-2.5 bg-base-200/40 rounded-xl leading-relaxed">
          Preset tata letak ini menggunakan penataan berdampingan / grid. Jarak antar kartu diatur otomatis oleh sistem grid.
        </p>
      {:else}
        <p class="text-2xs text-emerald-600/80 dark:text-emerald-400/80 italic p-2 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 rounded-xl leading-relaxed">
          {#if activePreset === 'single_spotlight'}
            1 Kartu ulasan utama di posisi bawah (aliran vertikal). Margin atas & bawah aktif.
          {:else}
            Kartu ulasan tersusun atas-ke-bawah (aliran vertikal). Margin atas & bawah aktif.
          {/if}
        </p>
      {/if}
    </div>

  {:else if isSpotlightQuote}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <MessageSquareQuote size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Kutipan Ulasan Spotlight</span>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom') || '0px'}
        showMargins={true}
        colorLabel="Warna Teks Kutipan (Token)"
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
        onMarginTopChange={(mt) => setNodeStyleVal(nodeId, 'marginTop', mt)}
        onMarginBottomChange={(mb) => setNodeStyleVal(nodeId, 'marginBottom', mb)}
      />
    </div>

  {:else if isSpotlightAuthor}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <User size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Identitas Pengulas Spotlight</span>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        showMargins={false}
        colorLabel="Warna Teks Pengulas (Token)"
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
      />
    </div>

  {:else if isAvatar}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <ImageIcon size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Foto Avatar: {currentTesti?.customerName || `Ulasan #${itemIndex + 1}`}</span>
      </div>
      <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl leading-relaxed">
        Ukuran dan rasio foto avatar diatur otomatis oleh preset tema. Untuk mengubah foto avatar, gunakan tab Konten.
      </p>
    </div>

  {:else if isStats}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <BarChart3 size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Kartu Skor Rating Agregat</span>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        showMargins={false}
        colorLabel="Warna Teks Skor (Token)"
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
      />
      <p class="text-2xs text-base-content/60 italic p-2.5 bg-base-200/40 rounded-xl leading-relaxed">
        Posisi kartu statistik berada di kolom samping (split). Jarak diatur otomatis oleh sistem grid.
      </p>
    </div>

  {:else if isSliderTrack}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <Layers size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Alur Slider Ulasan</span>
      </div>
      <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl leading-relaxed">
        Alur pergeseran ulasan horizontal diatur otomatis oleh sistem carousel slider.
      </p>
    </div>

  {:else if isLogoCloud}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <ImageIcon size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Logo Kemitraan</span>
      </div>
      <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl leading-relaxed">
        Penataan logo mitra horizontal diatur otomatis oleh sistem flex grid.
      </p>
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
        showMargins={isVerticalStackCard}
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
        onMarginTopChange={(mt) => setNodeStyleVal(nodeId, 'marginTop', mt)}
        onMarginBottomChange={(mb) => setNodeStyleVal(nodeId, 'marginBottom', mb)}
      />
    </div>
  {/if}
</div>
