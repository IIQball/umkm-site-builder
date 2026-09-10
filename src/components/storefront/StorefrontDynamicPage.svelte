<script lang="ts">
  import { onMount } from 'svelte';
  import type { TemplateConfig, TemplateSection } from '@/schemas';
  import type { ProductItem } from '@/types';
  import SectionRenderer from '@/components/builder/sections/SectionRenderer.svelte';
  import { editorStore } from '@/components/builder/stores/editorStore';
  import StoreStatusBanner from './StoreStatusBanner.svelte';

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

    // 2. Responsive viewport viewMode detector for builder components reading $canvasStore.viewMode
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

<div class="storefront-root min-h-screen w-full bg-[var(--color-bg-base,#ffffff)] text-[var(--color-text-main,#0f172a)] font-[family-name:var(--font-family,sans-serif)] flex flex-col">
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
              categories: categories.length > 0 ? categories : (section.props?.categories || []),
              whatsappNumber: store?.waNumber || section.props?.whatsappNumber,
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
