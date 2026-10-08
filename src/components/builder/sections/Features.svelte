<script lang="ts">
  import { editorStore, activeNodeId, canvasStore } from '../stores/editorStore';
  import type { FeaturesProps, SectionStyles, FeatureItem } from '@/types';
  import {
    FeaturesGrid3Cards,
    FeaturesHorizontalList,
    FeaturesBannerInlineBar,
    FeaturesBentoGrid,
    FeaturesAlternatingZigzag,
    FeaturesInteractiveTabs,
    FeaturesVerticalAccordion,
    FeaturesStickyScroll,
    FeaturesDenseMatrix,
    FeaturesComparison,
  } from './features';
  import {
    mapRawFeatureItems,
    getDenseFeatureItems,
  } from './features/features.helpers';
  import { getEffectiveFeaturesElementOrder } from './features/featuresLayout.helpers';
  import './features/features.css';

  export let props: FeaturesProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'grid_3_cards';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'grid_3_cards';
  $: elementOrder = getEffectiveFeaturesElementOrder(
    activePreset,
    props?.elementOrder,
    props?.featuresPreset as string
  );

  $: items = mapRawFeatureItems(props);
  $: denseItems = getDenseFeatureItems(items);
  $: nodeStyles = (props?.nodeStyles || {}) as Record<string, Record<string, string>>;
  $: currentActiveNodeId = (isActive && $canvasStore?.selectedSectionId === sectionId) ? $activeNodeId : null;

  $: effectiveTitle = (typeof props?.title === 'string' && props.title.trim())
    ? props.title
    : ((props?.heading as string) || undefined);
  $: effectiveSubtitle = (typeof props?.subtitle === 'string' && props.subtitle.trim())
    ? props.subtitle
    : ((props?.subheading as string) || undefined);

  $: customBgColor = styles?.bgColorToken
    ? `var(--theme-${styles.bgColorToken === 'textPrimary' ? 'text-primary' : styles.bgColorToken === 'textMuted' ? 'text-muted' : styles.bgColorToken})`
    : styles?.backgroundColor;
  $: sectionBgStyle = customBgColor ? `background-color: ${customBgColor};` : 'background-color: var(--color-bg-base);';

  $: marginTop = styles?.marginTop ? (typeof styles.marginTop === 'number' ? `${styles.marginTop}px` : styles.marginTop) : '0px';
  $: marginBottom = styles?.marginBottom ? (typeof styles.marginBottom === 'number' ? `${styles.marginBottom}px` : styles.marginBottom) : '0px';
  $: paddingTop = styles?.paddingTop !== undefined ? (typeof styles.paddingTop === 'number' ? `${styles.paddingTop}px` : styles.paddingTop) : '48px';
  $: paddingBottom = styles?.paddingBottom !== undefined ? (typeof styles.paddingBottom === 'number' ? `${styles.paddingBottom}px` : styles.paddingBottom) : '48px';
  $: paddingLeft = styles?.paddingLeft !== undefined ? (typeof styles.paddingLeft === 'number' ? `${styles.paddingLeft}px` : styles.paddingLeft) : 'var(--active-safe-zone, var(--active-margin, 32px))';
  $: paddingRight = styles?.paddingRight !== undefined ? (typeof styles.paddingRight === 'number' ? `${styles.paddingRight}px` : styles.paddingRight) : 'var(--active-safe-zone, var(--active-margin, 32px))';

  const handleSelectNode = (e: MouseEvent | KeyboardEvent, key: string) => {
    e.stopPropagation();
    if (sectionId) {
      editorStore.selectNode(sectionId, key);
    }
  };

  const handleReorder = (newItems: FeatureItem[]) => {
    if (!sectionId) return;
    editorStore.updateSectionProps(sectionId, {
      items: newItems,
      features: newItems,
    });
  };
</script>

<section
  id={sectionId}
  data-node="features_container"
  class="feature-card w-full relative overflow-hidden {isActive ? 'relative z-10' : ''}"
  style="{sectionBgStyle} margin-top: {marginTop}; margin-bottom: {marginBottom}; container-type: inline-size; container-name: featurecard;"
>
  <div
    class="relative z-10 w-full mx-auto builder-safe-container box-border"
    style="max-width: var(--theme-max-width, var(--active-max-width, 1200px)); padding-left: {paddingLeft}; padding-right: {paddingRight}; padding-top: {paddingTop}; padding-bottom: {paddingBottom};"
  >
    {#if activePreset === 'horizontal_list'}
      <FeaturesHorizontalList
        badgeText={props?.badgeText ?? 'Standar Kualitas'}
        title={effectiveTitle ?? 'Komitmen Terbaik di Setiap Pesanan'}
        subtitle={effectiveSubtitle ?? 'Kami memastikan setiap tahapan dari kebun hingga ke tangan Anda melewati proses kurasi ketat.'}
        {items}
        {elementOrder}
        {nodeStyles}
        activeNodeId={currentActiveNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'banner_inline_bar'}
      <FeaturesBannerInlineBar
        badgeText={props?.badgeText ?? ''}
        title={effectiveTitle ?? ''}
        subtitle={effectiveSubtitle ?? ''}
        {items}
        {elementOrder}
        {nodeStyles}
        activeNodeId={currentActiveNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'bento_grid_asymmetric'}
      <FeaturesBentoGrid
        badgeText={props?.badgeText ?? 'Benefit Utama'}
        title={effectiveTitle ?? 'Dirancang Khusus untuk Kebutuhan Harian'}
        subtitle={effectiveSubtitle ?? 'Setiap detail kami perhitungkan demi kenyamanan penggunaan produk jangka panjang.'}
        {items}
        {elementOrder}
        {nodeStyles}
        mainImageUrl={props?.mainImageUrl || items[0]?.imageUrl || ''}
        activeNodeId={currentActiveNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'alternating_zigzag_rows'}
      <FeaturesAlternatingZigzag
        badgeText={props?.badgeText ?? 'Proses Produksi'}
        title={effectiveTitle ?? 'Proses Produksi Berkualitas'}
        subtitle={effectiveSubtitle ?? 'Setiap tahapan pengolahan dipantau secara berkala untuk menjaga mutu terbaik.'}
        {items}
        {elementOrder}
        {nodeStyles}
        activeNodeId={currentActiveNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'interactive_tabs'}
      <FeaturesInteractiveTabs
        badgeText={props?.badgeText ?? 'Varian Unggulan'}
        title={effectiveTitle ?? 'Eksplorasi Varian Rasa Favorit'}
        subtitle={effectiveSubtitle ?? 'Pilih varian untuk melihat detail rasa, keunggulan, dan bahan baku.'}
        {items}
        {elementOrder}
        {nodeStyles}
        activeNodeId={currentActiveNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'vertical_accordion_showcase'}
      <FeaturesVerticalAccordion
        badgeText={props?.badgeText ?? 'Proses Teliti'}
        title={effectiveTitle ?? 'Kualitas Diperiksa Langkah demi Langkah'}
        subtitle={effectiveSubtitle ?? 'Setiap tahapan pengolahan dipantau secara berkala untuk menjaga higienitas dan mutu rasa.'}
        {items}
        {elementOrder}
        {nodeStyles}
        mainImageUrl={props?.mainImageUrl || items[0]?.imageUrl || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80'}
        activeNodeId={currentActiveNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'sticky_scroll_highlight'}
      <FeaturesStickyScroll
        badgeText={typeof props?.badgeText === 'string' ? props.badgeText : 'Nilai Tambah Kami'}
        title={typeof effectiveTitle === 'string' ? effectiveTitle : 'Pelayanan Nyaman Dari Awal Hingga Selesai'}
        subtitle={typeof effectiveSubtitle === 'string' ? effectiveSubtitle : 'Kami tidak sekadar menjual barang, melainkan memberikan pengalaman belanja yang transparan dan amanah.'}
        {items}
        ctaText={typeof props?.ctaText === 'string' ? props.ctaText : 'Hubungi Kami Langsung'}
        ctaLink={typeof props?.ctaLink === 'string' ? props.ctaLink : '#'}
        {elementOrder}
        {nodeStyles}
        activeNodeId={currentActiveNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'dense_icon_matrix'}
      <FeaturesDenseMatrix
        badgeText={props?.badgeText ?? 'Ringkasan Keunggulan'}
        title={effectiveTitle ?? 'Semua Kebaikan Dalam Satu Kemasan'}
        subtitle={effectiveSubtitle ?? 'Ringkasan keunggulan formula herbal alami kami untuk kesehatan harian.'}
        items={denseItems}
        {elementOrder}
        {nodeStyles}
        activeNodeId={currentActiveNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'before_after_comparison'}
      <FeaturesComparison
        badgeText={props?.badgeText ?? 'Komparasi Kualitas'}
        title={effectiveTitle ?? 'Bandingkan Kualitasnya'}
        subtitle={effectiveSubtitle ?? 'Mengapa beralih ke produk olahan tangan UMKM kami jauh lebih menguntungkan?'}
        beforeTitle={props?.beforeTitle !== undefined ? props.beforeTitle : 'Produk Pasaran Biasa'}
        beforeItems={props?.beforeItems || [
          'Memakai minyak curah berulang kali',
          'Pengawet kimia sintetis berlebih',
          'Tekstur keras dan cepat tengik',
          'Tanpa jaminan sertifikasi resmi',
        ]}
        afterTitle={props?.afterTitle !== undefined ? props.afterTitle : 'Olahan Dapur UMKM Kami'}
        afterItems={props?.afterItems || [
          'Minyak kelapa murni sekali pakai',
          '100% bumbu rempah segar alami',
          'Renyah tahan 6 bulan berkat kemasan vakum',
          'Bersertifikat Halal MUI & BPOM',
        ]}
        {elementOrder}
        {nodeStyles}
        activeNodeId={currentActiveNodeId}
        selectNode={handleSelectNode}
      />

    {:else}
      <!-- Preset 1 (Default): grid_3_cards -->
      <FeaturesGrid3Cards
        badgeText={props?.badgeText ?? 'Keunggulan Layanan Kami'}
        title={effectiveTitle ?? 'Kenapa Memilih Produk UMKM Kami?'}
        subtitle={effectiveSubtitle ?? 'Kami memadukan bahan baku lokal pilihan dengan proses produksi higienis bersertifikasi resmi.'}
        {items}
        {isActive}
        activeNodeId={currentActiveNodeId}
        selectNode={handleSelectNode}
        onReorder={handleReorder}
        {elementOrder}
        {nodeStyles}
      />
    {/if}
  </div>
</section>
