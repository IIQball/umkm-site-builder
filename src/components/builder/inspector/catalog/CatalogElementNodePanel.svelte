<script lang="ts">
  import { formatIDR } from '@/lib/currency';
  import type { TemplateSection } from '@/schemas';
  import type { ProductItem } from '@/types';
  import { Sparkles, Type, FileText, MousePointerClick, Image as ImageIcon, ShoppingBag, Clock, ListFilter } from 'lucide-svelte';
  import NodeStyleControls from '../NodeStyleControls.svelte';
  import { DEFAULT_DEMO_PRODUCTS } from '../../sections/productCatalog.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onSectionUpdate: (section: TemplateSection) => void = () => {};

  $: products = (Array.isArray(section.props?.products) && section.props.products.length > 0
    ? (section.props.products as ProductItem[])
    : DEFAULT_DEMO_PRODUCTS) as ProductItem[];

  $: itemIndex = (() => {
    if (nodeId.startsWith('product_item_')) return parseInt(nodeId.replace('product_item_', ''), 10);
    if (nodeId.startsWith('product_image_')) return parseInt(nodeId.replace('product_image_', ''), 10);
    if (nodeId.startsWith('item_')) return parseInt(nodeId.replace('item_', ''), 10);
    const foundIdx = products.findIndex((p) => p.id === nodeId);
    if (foundIdx !== -1) return foundIdx;
    return 0;
  })();

  $: currentProduct = products[itemIndex] || products[0];

  $: isBadge = nodeId === 'badge' || nodeId === 'catalog_badge';
  $: isTitle = nodeId === 'title' || nodeId === 'catalog_title' || nodeId === 'catalog_header';
  $: isSubtitle = nodeId === 'subtitle' || nodeId === 'catalog_subtitle';
  $: isProductItem = nodeId.startsWith('product_item_') || nodeId.startsWith('item_') || products.some((p) => p.id === nodeId);
  $: isProductImage = nodeId.startsWith('product_image_');
  $: isCta = nodeId === 'catalog_cta' || nodeId === 'cta';
  $: isCategories = nodeId === 'catalog_categories' || nodeId === 'catalog_sidebar';
  $: isTimer = nodeId === 'catalog_timer';

  $: effectiveTargetId = isProductItem
    ? (currentProduct?.id || `product_item_${itemIndex}`)
    : nodeId;

  function getNodeStyleVal(id: string, prop: 'color' | 'marginTop' | 'marginBottom'): string {
    const nodeStyles = section.props?.nodeStyles as Record<string, Record<string, string>> | undefined;
    if (!nodeStyles) return '';
    if (isProductItem) {
      return nodeStyles[currentProduct?.id || '']?.[prop] || nodeStyles[`product_item_${itemIndex}`]?.[prop] || '';
    }
    return nodeStyles[id]?.[prop] || '';
  }

  function setNodeStyleVal(id: string, prop: 'color' | 'marginTop' | 'marginBottom', value: string) {
    const currentProps = section.props || {};
    const currentNodeStyles = (currentProps.nodeStyles as Record<string, Record<string, string>> | undefined) || {};
    const updated = { ...currentNodeStyles };

    if (isProductItem) {
      const pId = currentProduct?.id;
      const slotId = `product_item_${itemIndex}`;
      if (pId) {
        updated[pId] = { ...(updated[pId] || {}), [prop]: value };
      }
      updated[slotId] = { ...(updated[slotId] || {}), [prop]: value };
    } else {
      updated[id] = { ...(updated[id] || {}), [prop]: value };
    }

    onSectionUpdate({ ...section, props: { ...currentProps, nodeStyles: updated } });
  }
</script>

<div class="space-y-4 text-left">
  {#if isBadge}
    <div class="flex items-center gap-2 pb-2 border-b border-base-200">
      <Sparkles size={16} class="text-primary shrink-0" />
      <div>
        <h4 class="font-bold text-xs text-base-content">Lencana & Tagline</h4>
        <p class="text-[10px] text-base-content/60">Gaya teks lencana penawaran produk</p>
      </div>
    </div>
    <NodeStyleControls
      color={getNodeStyleVal('badge', 'color')}
      marginTop={getNodeStyleVal('badge', 'marginTop')}
      marginBottom={getNodeStyleVal('badge', 'marginBottom')}
      colorLabel="Warna Teks Lencana (Token)"
      onColorChange={(val) => setNodeStyleVal('badge', 'color', val)}
      onMarginTopChange={(val) => setNodeStyleVal('badge', 'marginTop', val)}
      onMarginBottomChange={(val) => setNodeStyleVal('badge', 'marginBottom', val)}
    />
  {:else if isTitle}
    <div class="flex items-center gap-2 pb-2 border-b border-base-200">
      <Type size={16} class="text-primary shrink-0" />
      <div>
        <h4 class="font-bold text-xs text-base-content">Judul Utama Katalog (H2)</h4>
        <p class="text-[10px] text-base-content/60">Gaya headline utama bagian katalog</p>
      </div>
    </div>
    <NodeStyleControls
      color={getNodeStyleVal('title', 'color')}
      marginTop={getNodeStyleVal('title', 'marginTop')}
      marginBottom={getNodeStyleVal('title', 'marginBottom')}
      colorLabel="Warna Judul Katalog (Token)"
      onColorChange={(val) => setNodeStyleVal('title', 'color', val)}
      onMarginTopChange={(val) => setNodeStyleVal('title', 'marginTop', val)}
      onMarginBottomChange={(val) => setNodeStyleVal('title', 'marginBottom', val)}
    />
  {:else if isSubtitle}
    <div class="flex items-center gap-2 pb-2 border-b border-base-200">
      <FileText size={16} class="text-primary shrink-0" />
      <div>
        <h4 class="font-bold text-xs text-base-content">Deskripsi Subjudul</h4>
        <p class="text-[10px] text-base-content/60">Gaya teks penjelasan katalog</p>
      </div>
    </div>
    <NodeStyleControls
      color={getNodeStyleVal('subtitle', 'color')}
      marginTop={getNodeStyleVal('subtitle', 'marginTop')}
      marginBottom={getNodeStyleVal('subtitle', 'marginBottom')}
      colorLabel="Warna Subjudul (Token)"
      onColorChange={(val) => setNodeStyleVal('subtitle', 'color', val)}
      onMarginTopChange={(val) => setNodeStyleVal('subtitle', 'marginTop', val)}
      onMarginBottomChange={(val) => setNodeStyleVal('subtitle', 'marginBottom', val)}
    />
  {:else if isProductItem}
    <div class="space-y-3">
      <div class="flex items-center gap-2 pb-2 border-b border-base-200">
        <ShoppingBag size={16} class="text-primary shrink-0" />
        <div class="min-w-0 flex-1">
          <h4 class="font-bold text-xs text-base-content truncate">
            Produk #{itemIndex + 1}: {currentProduct.name}
          </h4>
          <p class="text-[10px] text-base-content/60 font-mono">
            {formatIDR(currentProduct.price || 0)}
          </p>
        </div>
      </div>

      <NodeStyleControls
        color={getNodeStyleVal(effectiveTargetId, 'color')}
        showMargins={false}
        colorLabel="Warna Teks Produk (Token)"
        onColorChange={(val) => setNodeStyleVal(effectiveTargetId, 'color', val)}
      />
    </div>
  {:else if isProductImage}
    <div class="space-y-3">
      <div class="flex items-center gap-2 pb-2 border-b border-base-200">
        <ImageIcon size={16} class="text-primary shrink-0" />
        <div>
          <h4 class="font-bold text-xs text-base-content">Foto Produk #{itemIndex + 1}</h4>
          <p class="text-[10px] text-base-content/60">{currentProduct.name}</p>
        </div>
      </div>
      <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl">
        Tata letak foto produk diatur otomatis sesuai rasio aspek preset katalog yang aktif.
      </p>
    </div>
  {:else if isCta}
    <div class="space-y-3">
      <div class="flex items-center gap-2 pb-2 border-b border-base-200">
        <MousePointerClick size={16} class="text-primary shrink-0" />
        <div>
          <h4 class="font-bold text-xs text-base-content">Tombol Pesan WhatsApp (CTA)</h4>
          <p class="text-[10px] text-base-content/60">Gaya tombol checkout / order</p>
        </div>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom')}
        colorLabel="Warna Label Tombol (Token)"
        onColorChange={(val) => setNodeStyleVal(nodeId, 'color', val)}
        onMarginTopChange={(val) => setNodeStyleVal(nodeId, 'marginTop', val)}
        onMarginBottomChange={(val) => setNodeStyleVal(nodeId, 'marginBottom', val)}
      />
    </div>
  {:else if isCategories}
    <div class="space-y-3">
      <div class="flex items-center gap-2 pb-2 border-b border-base-200">
        <ListFilter size={16} class="text-primary shrink-0" />
        <div>
          <h4 class="font-bold text-xs text-base-content">Filter Kategori</h4>
          <p class="text-[10px] text-base-content/60">Gaya bilah atau tab filter</p>
        </div>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom')}
        colorLabel="Warna Teks Filter (Token)"
        onColorChange={(val) => setNodeStyleVal(nodeId, 'color', val)}
        onMarginTopChange={(val) => setNodeStyleVal(nodeId, 'marginTop', val)}
        onMarginBottomChange={(val) => setNodeStyleVal(nodeId, 'marginBottom', val)}
      />
    </div>
  {:else if isTimer}
    <div class="space-y-3">
      <div class="flex items-center gap-2 pb-2 border-b border-base-200">
        <Clock size={16} class="text-primary shrink-0" />
        <div>
          <h4 class="font-bold text-xs text-base-content">Hitung Mundur Flash Sale</h4>
          <p class="text-[10px] text-base-content/60">Gaya timer promosi batas waktu</p>
        </div>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom')}
        colorLabel="Warna Angka Timer (Token)"
        onColorChange={(val) => setNodeStyleVal(nodeId, 'color', val)}
        onMarginTopChange={(val) => setNodeStyleVal(nodeId, 'marginTop', val)}
        onMarginBottomChange={(val) => setNodeStyleVal(nodeId, 'marginBottom', val)}
      />
    </div>
  {:else}
    <div class="space-y-3">
      <div class="flex items-center gap-2 pb-2 border-b border-base-200">
        <ShoppingBag size={16} class="text-primary shrink-0" />
        <div>
          <h4 class="font-bold text-xs text-base-content">Elemen Katalog</h4>
          <p class="text-[10px] text-base-content/60">Atur warna token dan margin elemen</p>
        </div>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom')}
        onColorChange={(val) => setNodeStyleVal(nodeId, 'color', val)}
        onMarginTopChange={(val) => setNodeStyleVal(nodeId, 'marginTop', val)}
        onMarginBottomChange={(val) => setNodeStyleVal(nodeId, 'marginBottom', val)}
      />
    </div>
  {/if}
</div>
