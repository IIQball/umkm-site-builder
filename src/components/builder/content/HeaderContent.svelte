<script lang="ts">
  import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas/template.schema';
  import {
    makeHandlePropChange,
    makeHandleAddArrayItem,
    makeHandleRemoveArrayItem,
    makeHandleMoveArrayItem,
  } from './content.helpers';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: handleAddArrayItem = makeHandleAddArrayItem(section, onUpdate);
  $: handleRemoveArrayItem = makeHandleRemoveArrayItem(section, onUpdate);
  $: handleMoveArrayItem = makeHandleMoveArrayItem(section, onUpdate);
</script>

<div class="space-y-3">
  <div>
    <label for="announcement-text" class="block font-semibold text-base-content/80 mb-1">Teks Pengumuman</label>
    <input
      id="announcement-text"
      type="text"
      value={section.props?.announcementText ?? ''}
      on:input={(e) => handlePropChange('announcementText', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
      placeholder="Diskon 20% khusus hari ini..."
    />
  </div>

  <div>
    <span class="block font-semibold text-base-content/80 mb-1">Menu Navigasi (Reorderable)</span>
    <div class="space-y-2">
      {#each section.props?.navLinks || [] as link, index}
        <div class="flex items-center gap-1.5 p-1 bg-base-200/50 dark:bg-slate-950/60 border border-base-300 dark:border-slate-800 rounded-lg">
          <input
            type="text"
            value={link}
            on:input={(e) => {
              const updated = [...(section.props?.navLinks || [])];
              updated[index] = e.currentTarget.value;
              handlePropChange('navLinks', updated);
            }}
            class="flex-1 px-2.5 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
            placeholder="Nama Link"
          />
          <div class="flex items-center">
            <button
              type="button"
              on:click={() => handleMoveArrayItem('navLinks', index, 'up')}
              disabled={index === 0}
              class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              title="Pindah ke Atas"
            >
              <ChevronUp size={13} />
            </button>
            <button
              type="button"
              on:click={() => handleMoveArrayItem('navLinks', index, 'down')}
              disabled={index === (section.props?.navLinks || []).length - 1}
              class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              title="Pindah ke Bawah"
            >
              <ChevronDown size={13} />
            </button>
            <button
              type="button"
              on:click={() => handleRemoveArrayItem('navLinks', index)}
              class="p-1 text-base-content/50 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors cursor-pointer ml-0.5"
              title="Hapus Link"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      {/each}
      <button
        type="button"
        on:click={() => handleAddArrayItem('navLinks', 'Menu Baru')}
        class="w-full flex items-center justify-center gap-1 py-1.5 border border-dashed border-base-300 dark:border-slate-700 rounded-md text-base-content/60 hover:text-blue-500 hover:border-blue-500 transition-colors cursor-pointer"
      >
        <Plus size={13} />
        <span>Tambah Menu</span>
      </button>
    </div>
  </div>
</div>
