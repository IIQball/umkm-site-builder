<script lang="ts">
  import { Menu, Plus, Trash2 } from 'lucide-svelte';
  import { Button } from '@/components/ui';
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
    <Button
      type="button"
      variant="primary"
      size="xs"
      on:click={() => handleAddArrayItem('navLinks', 'Menu Baru')}
      class="!h-auto !min-h-0 !py-1 !px-2 gap-1"
    >
      <Plus size={12} /> Tambah
    </Button>
  </div>

  <div class="space-y-1.5">
    {#each navLinks as link, idx}
      <div class="flex items-center gap-2">
        <input
          type="text"
          value={link}
          on:input={(e) => updateNavLink(idx, e.currentTarget.value)}
          class="flex-1 px-3 py-1 bg-base-200/50 border border-base-300 rounded-lg focus:outline-none focus:border-primary text-xs"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          on:click={() => handleRemoveArrayItem('navLinks', idx)}
          class="!w-6 !h-6 !min-h-0 !p-0 text-error hover:bg-error/10"
          title="Hapus Menu"
        >
          <Trash2 size={13} />
        </Button>
      </div>
    {/each}
  </div>
</div>
