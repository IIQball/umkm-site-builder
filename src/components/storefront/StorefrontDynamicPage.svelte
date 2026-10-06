<script lang="ts">
  import { onMount } from 'svelte';
  import type { TemplateConfig, TemplateSection } from '@/schemas';
  import type { ProductItem } from '@/types';
  import SectionRenderer from '@/components/builder/sections/SectionRenderer.svelte';
  import { editorStore } from '@/components/builder/stores/editorStore';
  import StoreStatusBanner from './StoreStatusBanner.svelte';
  import { trackAnalyticsEvent } from '@/lib/analytics/track';

  export let config: TemplateConfig;
  export let store: any;
  export let products: ProductItem[] = [];
  export let categories: Array<{ id: string; name: string; slug: string }> = [];
  export let isOpen: boolean = true;

  $: sections = (config?.sections || []) as TemplateSection[];

  onMount(() => {
    // 1. Initialize editorStore document state so sub-components (like Footer reading $documentStore) work seamlessly
    if (store && config) {
      editorStore.init({
        id: store.templateId || 'storefront',
        name: store.name || 'Store',
        config: config,
      });
    }

    // 2. Track store view event
    if (store?.id) {
      trackAnalyticsEvent(store.id, 'store_view');
    }

    // 3. Responsive viewport viewMode detector for builder components reading $canvasStore.viewMode
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        editorStore.setViewMode('mobile');
      } else if (width < 1024) {
        editorStore.setViewMode('tablet');
      } else {
        editorStore.setViewMode('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
</script>

<div class="storefront-root min-h-screen w-full bg-canvas text-main font-sans flex flex-col">
  <StoreStatusBanner {isOpen} />

  <main class="flex-1 w-full">
    {#each sections as section (section.id)}
      {@const enrichedSection = section.type === 'product_catalog'
        ? {
            ...section,
            props: {
              ...(section.props || {}),
              // isLiveStorefront=true: always use real DB products (even empty []). Never fall back to template demo data.
              products: products,
              whatsappNumber: store?.waNumber || section.props?.whatsappNumber,
              storeName: store?.name || section.props?.storeName,
              storeId: store?.id,
            }
          }
        : section.type === 'header_announcement'
        ? {
            ...section,
            props: {
              ...(section.props || {}),
              logoText: store?.name || section.props?.logoText || 'Toko UMKM',
              storeName: store?.name || section.props?.storeName,
              categories: categories.length > 0 ? categories : (section.props?.categories || []),
              whatsappNumber: store?.waNumber || section.props?.whatsappNumber,
              whatsappTemplate: store?.whatsappTemplate || section.props?.whatsappTemplate,
            }
          }
        : section.type === 'google_maps'
        ? {
            ...section,
            props: {
              ...(section.props || {}),
              address: store?.address || section.props?.address,
              googleMapsUrl: store?.googleMapsUrl || section.props?.googleMapsUrl,
              googleMapsEmbedUrl: store?.googleMapsEmbedUrl || section.props?.googleMapsEmbedUrl,
              latitude: store?.latitude ?? section.props?.latitude,
              longitude: store?.longitude ?? section.props?.longitude,
              whatsappNumber: store?.waNumber || section.props?.whatsappNumber,
              storeName: store?.name || section.props?.storeName,
            }
          }
        : section.type === 'footer'
        ? {
            ...section,
            props: {
              ...(section.props || {}),
              brandName: store?.name || section.props?.brandName,
              address: store?.address || section.props?.address,
              whatsappNumber: store?.waNumber || section.props?.whatsappNumber,
              googleMapsUrl: store?.googleMapsUrl || section.props?.googleMapsUrl,
            }
          }
        : section}
      <SectionRenderer
        section={enrichedSection}
        isActive={false}
        storeId={store?.id || null}
        {store}
        isLiveStorefront={true}
      />
    {/each}
  </main>
</div>

<style>
  /* 
   * Strict Storefront Presentation Isolation:
   * Public storefront visitors must NEVER see builder editor artifacts
   * (hover dashed outlines, selection rings, or builder edit cursors).
   */
  :global(.storefront-root [class*="hover:outline"]:hover),
  :global(.storefront-root [class*="hover:outline-dashed"]:hover),
  :global(.storefront-root [class*="outline-dashed"]),
  :global(.storefront-root [class*="outline-dashed"]:hover),
  :global(.storefront-root [data-node]),
  :global(.storefront-root [data-node-key]),
  :global(.storefront-root [data-node]:hover),
  :global(.storefront-root [data-node-key]:hover) {
    outline: none !important;
    outline-offset: 0 !important;
  }

  /* Suppress builder selection rings and active node backgrounds */
  :global(.storefront-root [class*="ring-2"]:not(input):not(textarea):not(select):not(button):not(a):not(.keep-ring)),
  :global(.storefront-root [data-node].ring-2:not(input):not(textarea):not(select)),
  :global(.storefront-root [data-node-key].ring-2:not(input):not(textarea):not(select)),
  :global(.storefront-root [role="button"][data-node].ring-2),
  :global(.storefront-root .footer-card [role="button"].ring-2),
  :global(.storefront-root .header-nav-container [role="button"].ring-2) {
    box-shadow: none !important;
    --tw-ring-shadow: 0 0 #0000 !important;
    --tw-ring-offset-shadow: 0 0 #0000 !important;
    background-color: transparent !important;
  }

  /* Reset builder selectable wrappers cursor back to default text / arrow cursor */
  :global(.storefront-root [data-node]:not(a):not(button):not(input):not(select):not(textarea):not(summary):not(label):not([role="tab"]):not(.cursor-pointer)),
  :global(.storefront-root [data-node-key]:not(a):not(button):not(input):not(select):not(textarea):not(summary):not(label):not([role="tab"]):not(.cursor-pointer)),
  :global(.storefront-root [role="button"][data-node]:not(a):not(button):not(input):not(select):not(textarea):not(summary):not(label):not([role="tab"]):not(.cursor-pointer)),
  :global(.storefront-root .footer-card [role="button"]:not(a):not(button):not(.cursor-pointer)),
  :global(.storefront-root .cq-footer-bottom-bar > div:not(a):not(button):not(.cursor-pointer)) {
    cursor: default !important;
  }

  /* Ensure real interactive elements retain pointer cursor */
  :global(.storefront-root a),
  :global(.storefront-root button),
  :global(.storefront-root .builder-header-nav-link),
  :global(.storefront-root [role="tab"]) {
    cursor: pointer !important;
  }
</style>
