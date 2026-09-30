<script lang="ts">
  import { Search, ChevronDown, Check } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import { resolveFeatureIcon } from '../sections/features/featureIcons';

  export let value: string = '';
  export let selectedIcon: string = '';
  export let options: Array<{ value: string; label: string }> = [];
  export let onSelect: (val: string) => void = () => {};
  export let label: string = 'Pilih Ikon';

  let isOpen = false;
  let searchQuery = '';

  $: effectiveValue = selectedIcon || value;
  $: selectedOpt = options.find((o) => o.value === effectiveValue) || options[0];
  $: iconPreview = selectedOpt ? selectedOpt.value : effectiveValue;

  $: filteredOptions = searchQuery.trim()
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  function handleSelect(val: string) {
    onSelect(val);
    isOpen = false;
    searchQuery = '';
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      isOpen = false;
      searchQuery = '';
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="relative w-full">
  {#if label}
    <span class="block font-medium text-[11px] text-base-content/70 mb-1">{label}</span>
  {/if}

  <!-- Trigger Button with Icon Preview -->
  <Button
    type="button"
    variant="outline"
    size="sm"
    on:click={() => (isOpen = !isOpen)}
    class="!w-full !flex !items-center !justify-between !px-2.5 !py-1.5 !h-auto !min-h-0 rounded-lg border-base-300 bg-base-100 text-xs hover:border-primary/50 font-normal"
  >
    <div class="flex items-center gap-2 truncate">
      <div class="w-5 h-5 rounded flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
        <svelte:component this={resolveFeatureIcon(iconPreview)} size={13} />
      </div>
      <span class="truncate font-medium">{selectedOpt?.label || value || 'Pilih ikon...'}</span>
    </div>
    <ChevronDown size={14} class={`text-base-content/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
  </Button>

  {#if isOpen}
    <!-- Backdrop to close -->
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div class="fixed inset-0 z-40 bg-transparent" on:click={() => (isOpen = false)}></div>

    <!-- Dropdown Panel with Search -->
    <div class="absolute left-0 right-0 top-full mt-1 z-50 p-2 rounded-xl bg-base-100 border border-base-300 shadow-xl space-y-1.5 animate-in fade-in zoom-in-95 duration-100">
      <!-- Search Input for >5 options -->
      <div class="relative flex items-center">
        <Search size={13} class="absolute left-2 text-base-content/40 pointer-events-none" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari ikon..."
          class="input input-xs input-bordered w-full pl-7 text-[11px]"
        />
      </div>

      <!-- Icon Options List -->
      <div class="max-h-48 overflow-y-auto space-y-0.5 pr-0.5">
        {#if filteredOptions.length === 0}
          <div class="text-[11px] text-center py-2 text-base-content/50">
            Tidak ada ikon yang cocok
          </div>
        {:else}
          {#each filteredOptions as opt}
            {@const isSelected = opt.value === effectiveValue}
            <Button
              type="button"
              variant={isSelected ? 'primary' : 'ghost'}
              size="xs"
              on:click={() => handleSelect(opt.value)}
              class={`!w-full !flex !items-center !justify-between !px-2 !py-1.5 !h-auto !min-h-0 rounded-lg text-xs text-left ${
                isSelected
                  ? 'font-semibold'
                  : 'text-base-content hover:bg-base-200 dark:hover:bg-slate-800'
              }`}
            >
              <div class="flex items-center gap-2 truncate">
                <div class={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-white/20' : 'bg-base-200'}`}>
                  <svelte:component this={resolveFeatureIcon(opt.value)} size={13} />
                </div>
                <span class="truncate">{opt.label}</span>
              </div>
              {#if isSelected}
                <Check size={13} class="flex-shrink-0 ml-1" />
              {/if}
            </Button>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
</div>
