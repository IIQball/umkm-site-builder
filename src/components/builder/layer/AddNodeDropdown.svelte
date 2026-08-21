<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../stores/editorStore';

  export let section: TemplateSection;
  export let onClose: () => void;

  const addNode = (nodeType: string) => {
    editorStore.addNode(section.id, nodeType);
    onClose();
  };

  type NodeOption = { type: string; label: string };

  const heroNodes: NodeOption[] = [
    { type: 'badge', label: '+ Promo Badge' },
    { type: 'title', label: '+ Heading Title' },
    { type: 'subtitle', label: '+ Subtitle Description' },
    { type: 'image', label: '+ Banner Image' },
    { type: 'cta', label: '+ Action Button (CTA)' },
  ];

  const sectionNodeMap: Partial<Record<TemplateSection['type'], NodeOption[]>> = {
    header_announcement: [{ type: 'nav', label: '+ Nav Link Menu' }],
    features: [{ type: 'item', label: '+ Card Fitur Baru' }],
    product_catalog: [{ type: 'item', label: '+ Produk Baru' }],
    testimonials: [{ type: 'item', label: '+ Review Testimoni' }],
    faq: [{ type: 'item', label: '+ FAQ Accordion' }],
  };

  $: nodeOptions = section.type === 'hero' ? heroNodes : (sectionNodeMap[section.type] || []);
</script>

<div class="mt-1 p-1 bg-base-100 border border-base-200 dark:border-slate-800 rounded-lg shadow-xl space-y-0.5 z-40 text-base-content">
  {#each nodeOptions as opt}
    <button
      type="button"
      on:click={() => addNode(opt.type)}
      class="w-full text-left px-2 py-1 text-[10px] text-base-content/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 rounded cursor-pointer"
    >
      {opt.label}
    </button>
  {/each}
</div>
