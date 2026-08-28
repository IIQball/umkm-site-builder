<script lang="ts">
  import { Menu, Plus, Trash2 } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import {
    makeHandleAddArrayItem,
    makeHandleRemoveArrayItem,
  } from '../../content/content.helpers';

  export let section: TemplateSection;
  export let onPropChange: (key: string, value: unknown) => void = () => {};
  export let onSectionUpdate: (section: TemplateSection) => void = () => {};

  $: handleAddArrayItem = makeHandleAddArrayItem(section, onSectionUpdate);
  $: handleRemoveArrayItem = makeHandleRemoveArrayItem(section, onSectionUpdate);

  $: navLinks = (section.props?.navLinks as string[]) || [];

  function updateNavLink(index: number, value: string) {
    const updated = [...navLinks];
    updated[index] = value;
    onPropChange('navLinks', updated);
  }
</script>

<div class="space-y-3">
  <div class="flex items-center justify-between">
    <span class="font-semibold text-base-content flex items-center gap-1.5">
      <Menu size={13} />
      Menu Navigasi ({navLinks.length})
    </span>
    <button
      type="button"
      on:click={() => handleAddArrayItem('navLinks', 'Menu Baru')}
      class="btn btn-xs btn-primary gap-1 cursor-pointer"
    >
      <Plus size={12} /> Tambah
    </button>
  </div>

  <div class="space-y-1.5">
    {#each navLinks as link, idx}
      <div class="flex items-center gap-2">
        <input
          type="text"
          value={link}
          on:input={(e) => updateNavLink(idx, e.currentTarget.value)}
          class="flex-1 px-3 py-1 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs"
        />
        <button
          type="button"
          on:click={() => handleRemoveArrayItem('navLinks', idx)}
          class="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
          title="Hapus Menu"
        >
          <Trash2 size={13} />
        </button>
      </div>
    {/each}
  </div>
</div>
