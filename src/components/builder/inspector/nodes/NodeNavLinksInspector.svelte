<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { Menu, Trash2, Plus } from 'lucide-svelte';
  import { makeHandleAddArrayItem, makeHandleRemoveArrayItem } from '../../content/content.helpers';

  export let section: TemplateSection;
  export let onPropChange: (key: string, value: unknown) => void;
  export let onSectionUpdate: (section: TemplateSection) => void;

  $: handleAddArrayItem = makeHandleAddArrayItem(section, onSectionUpdate);
  $: handleRemoveArrayItem = makeHandleRemoveArrayItem(section, onSectionUpdate);
  $: navLinks = (section.props?.navLinks as string[]) || [];
</script>

<div class="space-y-3">
  <div class="flex items-center gap-1.5 font-semibold text-base-content">
    <Menu size={14} class="text-blue-500" />
    <span>Daftar Menu Navigasi</span>
  </div>
  <div class="space-y-2">
    {#each navLinks as link, index}
      <div class="flex items-center gap-1.5 p-1 bg-base-200/50 dark:bg-slate-950/80 border border-base-300 dark:border-slate-800 rounded-lg">
        <input
          type="text"
          value={link}
          on:input={(e) => {
            const updated = [...navLinks];
            updated[index] = e.currentTarget.value;
            onPropChange('navLinks', updated);
          }}
          class="flex-1 px-2.5 py-1 bg-transparent text-xs text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="Nama Menu"
        />
        <button
          type="button"
          on:click={() => handleRemoveArrayItem('navLinks', index)}
          class="p-1 text-base-content/50 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
          title="Hapus Menu"
        >
          <Trash2 size={13} />
        </button>
      </div>
    {/each}
    <button
      type="button"
      on:click={() => handleAddArrayItem('navLinks', 'Menu Baru')}
      class="w-full flex items-center justify-center gap-1 py-1.5 border border-dashed border-base-300 dark:border-slate-700 rounded-md text-xs text-base-content/60 hover:text-blue-500 hover:border-blue-500 transition-colors cursor-pointer"
    >
      <Plus size={13} />
      <span>Tambah Menu</span>
    </button>
  </div>
</div>
