<script lang="ts">
  import { Plus } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import type { FAQItem } from '@/types';
  import { Button } from '@/components/ui';
  import { makeHandlePropChange } from './content.helpers';
  import { DEFAULT_FAQS } from '../sections/faq/faq.helpers';
  import { getEffectiveFaqElementOrder } from '../sections/faq/faqLayout.helpers';
  import FaqItemCard from './FaqItemCard.svelte';
  import FaqNodeForms from '../inspector/node-forms/FaqNodeForms.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);

  $: preset =
    (section.layoutPreset as string) ||
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    'accordion_single_col';

  $: rawFaqs = section.props?.faqs;
  $: faqs = (Array.isArray(rawFaqs) && rawFaqs.length > 0
    ? rawFaqs
    : DEFAULT_FAQS) as FAQItem[];

  $: elementOrder = getEffectiveFaqElementOrder(preset, section.props?.elementOrder, faqs);

  $: title = (section.props?.title as string) || (section.props?.heading as string) || '';
  $: subtitle = (section.props?.subtitle as string) ?? '';
  $: badgeText = (section.props?.badgeText as string) ?? '';

  function getCurrentFaqs(): FAQItem[] {
    const raw = section.props?.faqs;
    return Array.isArray(raw) && raw.length > 0 ? [...raw] : [...DEFAULT_FAQS];
  }

  function handleFaqChange(index: number, key: keyof FAQItem, value: unknown) {
    const list = getCurrentFaqs();
    list[index] = { ...list[index], [key]: value };
    onUpdate({
      ...section,
      props: {
        ...(section.props || {}),
        faqs: list,
      },
    });
  }

  function handleAddFaq() {
    const list = getCurrentFaqs();
    const nextIdx = list.length + 1;
    const newItem: FAQItem = {
      id: `faq_${Date.now()}`,
      question: `Pertanyaan Baru #${nextIdx}?`,
      answer: 'Tuliskan jawaban yang jelas dan informatif untuk membantu pelanggan toko.',
      category: 'Umum',
    };
    onUpdate({
      ...section,
      props: {
        ...(section.props || {}),
        faqs: [...list, newItem],
      },
    });
  }

  function handleRemoveFaq(index: number) {
    const list = getCurrentFaqs();
    const updated = list.filter((_, i) => i !== index);
    onUpdate({
      ...section,
      props: {
        ...(section.props || {}),
        faqs: updated,
      },
    });
  }

  function handleMoveFaq(index: number, direction: 'up' | 'down') {
    const list = getCurrentFaqs();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    onUpdate({
      ...section,
      props: {
        ...(section.props || {}),
        faqs: list,
      },
    });
  }
</script>

<div class="space-y-4">
  <!-- Heading Hierarchy Settings (Sesuai elemen layout aktif) -->
  <div class="space-y-3">
    {#if elementOrder.includes('badge')}
      <div>
        <label for="faq-badge" class="block font-semibold text-xs text-base-content/80 mb-1">
          Teks Lencana (Badge)
        </label>
        <input
          id="faq-badge"
          type="text"
          value={badgeText}
          on:input={(e) => handlePropChange('badgeText', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 border border-base-300 rounded-md text-base-content text-xs placeholder-base-content/40 focus:outline-none focus:border-primary"
          placeholder="Pusat Bantuan Konsumen"
        />
      </div>
    {/if}

    {#if elementOrder.includes('title')}
      <div>
        <label for="faq-title" class="block font-semibold text-xs text-base-content/80 mb-1">
          Judul Utama FAQ (H2)
        </label>
        <input
          id="faq-title"
          type="text"
          value={title}
          on:input={(e) => handlePropChange('title', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 border border-base-300 rounded-md text-base-content text-xs font-bold placeholder-base-content/40 focus:outline-none focus:border-primary"
          placeholder="Pertanyaan yang Sering Diajukan"
        />
      </div>
    {/if}

    {#if elementOrder.includes('subtitle')}
      <div>
        <label for="faq-subtitle" class="block font-semibold text-xs text-base-content/80 mb-1">
          Deskripsi Subjudul
        </label>
        <textarea
          id="faq-subtitle"
          value={subtitle}
          on:input={(e) => handlePropChange('subtitle', e.currentTarget.value)}
          rows="2"
          class="w-full px-3 py-2 bg-base-200/50 border border-base-300 rounded-md text-base-content text-xs placeholder-base-content/40 focus:outline-none focus:border-primary resize-y"
          placeholder="Temukan solusi cepat dan informasi penting seputar layanan serta produk kami."
        ></textarea>
      </div>
    {/if}
  </div>

  <!-- Elemen Khusus Layout Preset (CS Card, Search Bar, Tabs) -->
  {#if elementOrder.includes('faq_cs_card')}
    <div class="p-3 bg-base-200/30 border border-base-200 rounded-xl space-y-2">
      <FaqNodeForms {section} nodeId="faq_cs_card" onPropChange={handlePropChange} />
    </div>
  {/if}

  {#if elementOrder.includes('faq_search_bar')}
    <div class="p-3 bg-base-200/30 border border-base-200 rounded-xl space-y-2">
      <FaqNodeForms {section} nodeId="faq_search_bar" onPropChange={handlePropChange} />
    </div>
  {/if}

  {#if elementOrder.includes('faq_tabs')}
    <div class="p-3 bg-base-200/30 border border-base-200 rounded-xl space-y-2">
      <FaqNodeForms {section} nodeId="faq_tabs" onPropChange={handlePropChange} />
    </div>
  {/if}

  <!-- FAQs List Management -->
  <div class="pt-3 border-t border-base-200 space-y-3">
    <div class="flex items-center justify-between">
      <span class="block font-semibold text-xs text-base-content/80">
        Daftar Pertanyaan ({faqs.length})
      </span>
      <Button
        type="button"
        size="xs"
        variant="ghost"
        on:click={handleAddFaq}
        class="!p-0 !h-auto !min-h-0 text-[11px] font-medium text-primary hover:text-primary/80 gap-1 cursor-pointer"
      >
        <Plus size={12} />
        <span>Tambah Pertanyaan</span>
      </Button>
    </div>

    <div class="space-y-3">
      {#each faqs as item, index (item.id || index)}
        <FaqItemCard
          {item}
          {index}
          totalItems={faqs.length}
          onFieldChange={(field, val) => handleFaqChange(index, field, val)}
          onMove={(dir) => handleMoveFaq(index, dir)}
          onRemove={() => handleRemoveFaq(index)}
        />
      {/each}
    </div>
  </div>
</div>
