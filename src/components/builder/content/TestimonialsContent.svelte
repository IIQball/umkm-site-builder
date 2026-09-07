<script lang="ts">
  import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
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

  interface TestimonialItem {
    avatar?: string;
    customerName?: string;
    rating?: number;
    comment?: string;
  }

  $: testimonials = (section.props?.testimonials as TestimonialItem[]) || [];
</script>

<div class="space-y-3">
  <div class="flex items-center justify-between">
    <span class="block font-semibold text-base-content/80">Daftar Testimoni</span>
    <button
      type="button"
      on:click={() => handleAddArrayItem('testimonials', { customerName: 'Nama Pelanggan', rating: 5, comment: 'Pelayanan sangat ramah dan memuaskan!' })}
      class="flex items-center gap-1 text-[11px] font-medium text-blue-500 hover:text-blue-400 cursor-pointer"
    >
      <Plus size={12} />
      <span>Tambah Testimoni</span>
    </button>
  </div>

  <div class="space-y-3">
    {#each testimonials as item, index}
      <div class="p-3 bg-base-200/50 dark:bg-slate-950/60 border border-base-300 dark:border-slate-800 rounded-lg space-y-2">
        <div class="flex items-center justify-between gap-2">
          <input
            type="text"
            value={item.customerName ?? ''}
            on:input={(e) => handleArrayItemChange('testimonials', index, 'customerName', e.currentTarget.value)}
            class="flex-1 px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
            placeholder="Nama Pelanggan"
          />
          <select
            value={item.rating ?? 5}
            on:change={(e) => handleArrayItemChange('testimonials', index, 'rating', Number(e.currentTarget.value))}
            class="w-20 px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content text-xs focus:outline-none focus:border-blue-500"
          >
            <option value={5}>Bintang 5</option>
            <option value={4}>Bintang 4</option>
            <option value={3}>Bintang 3</option>
            <option value={2}>Bintang 2</option>
            <option value={1}>Bintang 1</option>
          </select>
          <div class="flex items-center">
            <button
              type="button"
              on:click={() => handleMoveArrayItem('testimonials', index, 'up')}
              disabled={index === 0}
              class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              title="Pindah ke Atas"
            >
              <ChevronUp size={13} />
            </button>
            <button
              type="button"
              on:click={() => handleMoveArrayItem('testimonials', index, 'down')}
              disabled={index === testimonials.length - 1}
              class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              title="Pindah ke Bawah"
            >
              <ChevronDown size={13} />
            </button>
            <button
              type="button"
              on:click={() => handleRemoveArrayItem('testimonials', index)}
              class="p-1 text-base-content/50 hover:text-rose-500 rounded transition-colors cursor-pointer"
              title="Hapus"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        <textarea
          value={item.comment ?? ''}
          on:input={(e) => handleArrayItemChange('testimonials', index, 'comment', e.currentTarget.value)}
          rows="2"
          class="w-full px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
          placeholder="Ulasan pelanggan..."></textarea>
      </div>
    {/each}
  </div>
</div>
