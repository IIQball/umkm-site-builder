<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { Search, ChevronDown, Check, X } from 'lucide-svelte';

  export let value: string | number = '';
  export let options: Array<{
    value: string | number;
    label: string;
    sublabel?: string;
    disabled?: boolean;
  }> = [];
  export let label: string = '';
  export let placeholder: string = 'Pilih opsi...';
  export let searchPlaceholder: string = 'Cari opsi...';
  export let emptyText: string = 'Tidak ada hasil yang cocok';
  export let error: string = '';
  export let helper: string = '';
  export let disabled: boolean = false;
  export let required: boolean = false;
  export let id: string = '';
  export let name: string = '';
  export let fullWidth: boolean = true;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let clearable: boolean = true;
  let className: string = '';
  export { className as class };

  const dispatch = createEventDispatcher<{
    change: { value: string | number; option: (typeof options)[0] | null };
    open: void;
    close: void;
  }>();

  let isOpen = false;
  let searchQuery = '';
  let containerRef: HTMLDivElement | null = null;
  let searchInputRef: HTMLInputElement | null = null;
  let highlightedIndex = -1;

  const sizeStyles = {
    sm: 'py-2 px-3 text-xs rounded-xl min-h-[36px]',
    md: 'py-2.5 px-3.5 text-sm rounded-xl min-h-[40px]',
    lg: 'py-3 px-4 text-base rounded-2xl min-h-[48px]',
  };

  $: componentId = id || (label ? `searchable-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : 'searchable-select');

  $: selectedOption = options.find((opt) => String(opt.value) === String(value));

  $: filteredOptions = options.filter((opt) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchLabel = opt.label.toLowerCase().includes(q);
    const matchSublabel = opt.sublabel ? opt.sublabel.toLowerCase().includes(q) : false;
    return matchLabel || matchSublabel;
  });

  $: if (isOpen && searchInputRef) {
    setTimeout(() => {
      searchInputRef?.focus();
    }, 40);
  }

  const toggleDropdown = () => {
    if (disabled) return;
    isOpen = !isOpen;
    if (isOpen) {
      searchQuery = '';
      highlightedIndex = -1;
      dispatch('open');
    } else {
      dispatch('close');
    }
  };

  const selectOption = (opt: (typeof options)[0]) => {
    if (opt.disabled) return;
    value = opt.value;
    isOpen = false;
    searchQuery = '';
    dispatch('change', { value: opt.value, option: opt });
  };

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation();
    value = '';
    searchQuery = '';
    dispatch('change', { value: '', option: null });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        toggleDropdown();
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      isOpen = false;
      dispatch('close');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        highlightedIndex = (highlightedIndex + 1) % filteredOptions.length;
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        highlightedIndex = (highlightedIndex - 1 + filteredOptions.length) % filteredOptions.length;
      }
    } else if (e.key === 'Enter' && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
      e.preventDefault();
      selectOption(filteredOptions[highlightedIndex]);
    }
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (isOpen && containerRef && !containerRef.contains(event.target as Node)) {
      isOpen = false;
      searchQuery = '';
      dispatch('close');
    }
  };

  onMount(() => {
    document.addEventListener('click', handleDocumentClick, true);
  });

  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', handleDocumentClick, true);
    }
  });
</script>

<div
  bind:this={containerRef}
  class="relative {fullWidth ? 'w-full' : 'inline-block'} font-sans {className}"
  role="none"
>
  {#if name}
    <input type="hidden" {name} {value} />
  {/if}

  {#if label}
    <label for={componentId} class="block text-label-caps text-muted mb-1.5 font-medium">
      {label}
      {#if required}
        <span class="text-error ml-0.5">*</span>
      {/if}
    </label>
  {/if}

  <!-- Trigger Container -->
  <div
    id={componentId}
    role="combobox"
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-controls="{componentId}-listbox"
    tabindex={disabled ? -1 : 0}
    class="w-full flex items-center justify-between text-left bg-nested text-main border transition-all duration-150 cursor-pointer select-none
      focus:outline-none focus:bg-card
      {error ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' : 'border-light focus:border-primary focus:ring-2 focus:ring-primary/20'}
      {disabled ? 'opacity-50 cursor-not-allowed bg-nested/50 pointer-events-none' : 'hover:border-primary/40'}
      {isOpen ? 'ring-2 ring-primary/20 border-primary bg-card' : ''}
      {sizeStyles[size] || sizeStyles.md}"
    on:click={toggleDropdown}
    on:keydown={handleKeyDown}
  >
    <span class="whitespace-nowrap pr-2 {selectedOption ? 'text-main font-medium' : 'text-muted italic'}">
      {selectedOption ? selectedOption.label : placeholder}
    </span>

    <div class="flex items-center gap-1 shrink-0 text-muted ml-2">
      {#if clearable && selectedOption && !disabled}
        <button
          type="button"
          class="p-0.5 rounded-md hover:bg-nested hover:text-main text-muted transition-colors cursor-pointer"
          on:click={handleClear}
          title="Hapus pilihan"
          aria-label="Hapus pilihan"
        >
          <X size={13} />
        </button>
      {/if}
      <ChevronDown
        size={14}
        class="transition-transform duration-200 {isOpen ? 'rotate-180 text-primary' : ''}"
      />
    </div>
  </div>

  <!-- Dropdown Popover -->
  {#if isOpen}
    <div
      class="absolute left-0 top-full mt-1.5 z-50 min-w-full w-max max-w-[calc(100vw-2rem)] sm:max-w-md bg-card border border-light rounded-xl shadow-lg overflow-hidden animate-fade-in-up"
      role="listbox"
      aria-label={label || placeholder}
    >
      <!-- Search Input Header -->
      <div class="p-2 border-b border-light bg-nested/40">
        <div class="relative flex items-center">
          <Search size={13} class="absolute left-2.5 text-muted pointer-events-none" />
          <input
            bind:this={searchInputRef}
            type="text"
            bind:value={searchQuery}
            placeholder={searchPlaceholder}
            class="w-full pl-7 pr-7 py-1.5 text-xs bg-card text-main border border-light rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 placeholder:text-muted placeholder:italic font-sans"
            on:keydown|stopPropagation={handleKeyDown}
          />
          {#if searchQuery}
            <button
              type="button"
              class="absolute right-2 text-muted hover:text-main p-0.5 rounded cursor-pointer"
              on:click={() => (searchQuery = '')}
            >
              <X size={12} />
            </button>
          {/if}
        </div>
      </div>

      <!-- Options List -->
      <div class="max-h-56 overflow-y-auto p-1 divide-y divide-light/40">
        {#if filteredOptions.length === 0}
          <div class="py-6 px-3 text-center text-xs text-muted font-sans">
            <p>{emptyText}</p>
          </div>
        {:else}
          {#each filteredOptions as opt, i}
            {@const isSelected = String(opt.value) === String(value)}
            {@const isHighlighted = i === highlightedIndex}
            <button
              type="button"
              class="w-full flex items-center justify-between px-2 py-2 text-xs rounded-lg text-left transition-colors cursor-pointer
                {isSelected ? 'bg-primary/10 text-primary font-semibold' : 'text-main hover:bg-nested'}
                {isHighlighted && !isSelected ? 'bg-nested/80' : ''}
                {opt.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}"
              on:click={() => selectOption(opt)}
              role="option"
              aria-selected={isSelected}
            >
              <div class="flex flex-col min-w-0 pr-3">
                <span class="whitespace-nowrap {isSelected ? 'text-primary font-semibold' : 'text-main font-medium'}">
                  {opt.label}
                </span>
                {#if opt.sublabel}
                  <span class="text-xs-dense text-muted whitespace-nowrap mt-0.5">
                    {opt.sublabel}
                  </span>
                {/if}
              </div>

              {#if isSelected}
                <Check size={14} class="text-primary shrink-0 ml-2" />
              {/if}
            </button>
          {/each}
        {/if}
      </div>

      <!-- Footer count if many options -->
      {#if options.length > 5}
        <div class="px-3 py-1.5 border-t border-light/60 bg-nested/30 text-2xs text-muted flex justify-between items-center font-mono">
          <span>{filteredOptions.length} opsi tersedia</span>
          {#if selectedOption}
            <span class="text-primary font-semibold whitespace-nowrap ml-2">{selectedOption.label}</span>
          {/if}
        </div>
      {/if}
    </div>
  {/if}

  {#if error}
    <p class="text-xs text-error mt-1.5 font-medium">{error}</p>
  {:else if helper}
    <p class="text-xs text-muted mt-1.5 leading-relaxed">{helper}</p>
  {/if}
</div>
