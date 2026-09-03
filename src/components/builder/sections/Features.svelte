<script lang="ts">
  import { editorStore, activeNodeId } from '../stores/editorStore';
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
  import './features/features.css';

  export let props: FeaturesProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'grid_3_cards';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'grid_3_cards';

  $: items = mapRawFeatureItems(props);
  $: denseItems = getDenseFeatureItems(items);

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
  class="feature-card w-full relative overflow-hidden"
  style="container-type: inline-size; container-name: featurecard;"
>
  <div
    class="builder-safe-container"
    style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px);"
  >
    {#if activePreset === 'horizontal_list'}
      <FeaturesHorizontalList
        badgeText={props?.badgeText || 'Standar Kualitas'}
        title={props?.title || 'Komitmen Terbaik di Setiap Pesanan'}
        subtitle={props?.subtitle || 'Kami memastikan setiap tahapan dari kebun hingga ke tangan Anda melewati proses kurasi ketat.'}
        {items}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'banner_inline_bar'}
      <FeaturesBannerInlineBar
        items={items.slice(0, 3)}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'bento_grid_asymmetric'}
      <FeaturesBentoGrid
        badgeText={props?.badgeText || 'Benefit Utama'}
        title={props?.title || 'Dirancang Khusus untuk Kebutuhan Harian'}
        subtitle={props?.subtitle || 'Setiap detail kami perhitungkan demi kenyamanan penggunaan produk jangka panjang.'}
        {items}
        mainImageUrl={props?.mainImageUrl || items[0]?.imageUrl || ''}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'alternating_zigzag_rows'}
      <FeaturesAlternatingZigzag
        badgeText={props?.badgeText || 'Proses Produksi'}
        title={props?.title || ''}
        subtitle={props?.subtitle || ''}
        items={items.slice(0, 4)}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'interactive_tabs'}
      <FeaturesInteractiveTabs
        badgeText={props?.badgeText || 'Varian Unggulan'}
        title={props?.title || 'Eksplorasi Varian Rasa Favorit'}
        subtitle={props?.subtitle || 'Pilih varian untuk melihat detail rasa, keunggulan, dan bahan baku.'}
        items={items.slice(0, 4)}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'vertical_accordion_showcase'}
      <FeaturesVerticalAccordion
        badgeText={props?.badgeText || 'Proses Teliti'}
        title={props?.title || 'Kualitas Diperiksa Langkah demi Langkah'}
        subtitle={props?.subtitle || 'Setiap tahapan pengolahan dipantau secara berkala untuk menjaga higienitas dan mutu rasa.'}
        items={items.slice(0, 4)}
        mainImageUrl={props?.mainImageUrl || items[0]?.imageUrl || ''}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'sticky_scroll_highlight'}
      <FeaturesStickyScroll
        badgeText={typeof props?.badgeText === 'string' ? props.badgeText : 'Nilai Tambah Kami'}
        title={typeof props?.title === 'string' ? props.title : 'Pelayanan Nyaman Dari Awal Hingga Selesai'}
        subtitle={typeof props?.subtitle === 'string' ? props.subtitle : 'Kami tidak sekadar menjual barang, melainkan memberikan pengalaman belanja yang transparan dan amanah.'}
        items={items.slice(0, 4)}
        ctaText={typeof props?.ctaText === 'string' ? props.ctaText : 'Hubungi Kami Langsung'}
        ctaLink={typeof props?.ctaLink === 'string' ? props.ctaLink : '#'}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'dense_icon_matrix'}
      <FeaturesDenseMatrix
        badgeText={props?.badgeText || 'Ringkasan Keunggulan'}
        title={props?.title || 'Semua Kebaikan Dalam Satu Kemasan'}
        subtitle={props?.subtitle || 'Ringkasan keunggulan formula herbal alami kami untuk kesehatan harian.'}
        items={denseItems}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />

    {:else if activePreset === 'before_after_comparison'}
      <FeaturesComparison
        badgeText={props?.badgeText || 'Komparasi Kualitas'}
        title={props?.title || 'Bandingkan Kualitasnya'}
        subtitle={props?.subtitle || 'Mengapa beralih ke produk olahan tangan UMKM kami jauh lebih menguntungkan?'}
        beforeTitle={props?.beforeTitle || 'Produk Pasaran Biasa'}
        beforeItems={props?.beforeItems || [
          'Memakai minyak curah berulang kali',
          'Pengawet kimia sintetis berlebih',
          'Tekstur keras dan cepat tengik',
          'Tanpa jaminan sertifikasi resmi',
        ]}
        afterTitle={props?.afterTitle || 'Olahan Dapur UMKM Kami'}
        afterItems={props?.afterItems || [
          'Minyak kelapa murni sekali pakai',
          '100% bumbu rempah segar alami',
          'Renyah tahan 6 bulan berkat kemasan vakum',
          'Bersertifikat Halal MUI & BPOM',
        ]}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />

    {:else}
      <!-- Preset 1 (Default): grid_3_cards -->
      <FeaturesGrid3Cards
        badgeText={props?.badgeText || 'Keunggulan Layanan Kami'}
        title={props?.title || 'Kenapa Memilih Produk UMKM Kami?'}
        subtitle={props?.subtitle || 'Kami memadukan bahan baku lokal pilihan dengan proses produksi higienis bersertifikasi resmi.'}
        items={items.slice(0, 3)}
        {isActive}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
        onReorder={handleReorder}
      />
    {/if}
  </div>
</section>
