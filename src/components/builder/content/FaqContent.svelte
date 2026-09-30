<script lang="ts">
  import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { Button } from '@/components/ui';
  import {
    makeHandleArrayItemChange,
    makeHandleAddArrayItem,
    makeHandleRemoveArrayItem,
    makeHandleMoveArrayItem,
  } from './content.helpers';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handleArrayItemChange = makeHandleArrayItemChange(section, onUpdate);
  $: handleAddArrayItem = makeHandleAddArrayItem(section, onUpdate);
  $: handleRemoveArrayItem = makeHandleRemoveArrayItem(section, onUpdate);
  $: handleMoveArrayItem = makeHandleMoveArrayItem(section, onUpdate);

  interface FAQItem {
    question?: string;
    answer?: string;
  }

  $: faqs = (section.props?.faqs as FAQItem[]) || [];
</script>

<div class="space-y-3">
  <div class="flex items-center justify-between">
    <span class="block font-semibold text-base-content/80">Daftar FAQ (Tanya Jawab)</span>
    <Button
      type="button"
      size="xs"
      variant="ghost"
      on:click={() => handleAddArrayItem('faqs', { question: 'Pertanyaan baru?', answer: 'Jawaban penjelasan untuk pelanggan.' })}
      class="!p-0 !h-auto !min-h-0 text-[11px] font-medium text-primary hover:text-primary/80 gap-1"
    >
      <Plus size={12} />
      <span>Tambah FAQ</span>
    </Button>
  </div>

  <div class="space-y-3">
    {#each faqs as faq, index}
      <div class="p-3 bg-base-200/50 border border-base-300 rounded-lg space-y-2">
        <div class="flex items-center justify-between gap-2">
          <input
            type="text"
            value={faq.question ?? ''}
            on:input={(e) => handleArrayItemChange('faqs', index, 'question', e.currentTarget.value)}
            class="flex-1 px-2.5 py-1 bg-base-100 border border-base-300 rounded text-base-content focus:outline-none focus:border-primary"
            placeholder="Pertanyaan..."
          />
          <div class="flex items-center">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              on:click={() => handleMoveArrayItem('faqs', index, 'up')}
              disabled={index === 0}
              class="!p-1 !h-6 !w-6 !min-h-0 !min-w-0 text-base-content/50 hover:text-base-content disabled:opacity-20"
              title="Pindah ke Atas"
            >
              <ChevronUp size={13} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              on:click={() => handleMoveArrayItem('faqs', index, 'down')}
              disabled={index === faqs.length - 1}
              class="!p-1 !h-6 !w-6 !min-h-0 !min-w-0 text-base-content/50 hover:text-base-content disabled:opacity-20"
              title="Pindah ke Bawah"
            >
              <ChevronDown size={13} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              on:click={() => handleRemoveArrayItem('faqs', index)}
              class="!p-1 !h-6 !w-6 !min-h-0 !min-w-0 text-base-content/50 hover:text-rose-500 rounded"
              title="Hapus FAQ"
            >
              <Trash2 size={13} />
            </Button>
          </div>
        </div>
        <textarea
          value={faq.answer ?? ''}
          on:input={(e) => handleArrayItemChange('faqs', index, 'answer', e.currentTarget.value)}
          rows="2"
          class="w-full px-2.5 py-1 bg-base-100 border border-base-300 rounded text-base-content focus:outline-none focus:border-primary"
          placeholder="Jawaban penjelasan..."></textarea>
      </div>
    {/each}
  </div>
</div>
