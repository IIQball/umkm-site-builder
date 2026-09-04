<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let value: string | number = '';
  export let options: Array<{ value: string | number; label: string; disabled?: boolean }> = [];
  export let label: string = '';
  export let error: string = '';
  export let helper: string = '';
  export let placeholder: string = '';
  export let disabled: boolean = false;
  export let required: boolean = false;
  export let id: string = '';
  export let name: string = '';
  export let fullWidth: boolean = true;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  let className: string = '';
  export { className as class };

  const dispatch = createEventDispatcher<{
    change: Event;
    input: Event;
    focus: FocusEvent;
    blur: FocusEvent;
  }>();

  const sizeStyles = {
    sm: 'py-1.5 pl-3 pr-8 text-xs rounded-xl h-8 min-h-[32px]',
    md: 'py-2.5 pl-4 pr-10 text-sm rounded-xl h-10 min-h-[40px]',
    lg: 'py-3 pl-5 pr-12 text-base rounded-2xl h-12 min-h-[48px]',
  };

  $: selectId = id || (label ? `select-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : '');
  $: selectClasses = [
    'w-full bg-nested text-main border transition-all duration-150 font-sans appearance-none cursor-pointer',
    'focus:outline-none focus:bg-card',
    error
      ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)]/20'
      : 'border-light focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20',
    disabled ? 'opacity-50 cursor-not-allowed bg-nested/50' : '',
    sizeStyles[size] || sizeStyles.md,
    className,
  ]
    .filter(Boolean)
    .join(' ');
</script>

<div class="form-control {fullWidth ? 'w-full' : 'inline-block'}">
  {#if label}
    <label for={selectId} class="block text-label-caps text-muted mb-1.5">
      {label}
      {#if required}
        <span class="text-error ml-0.5">*</span>
      {/if}
    </label>
  {/if}

  <div class="relative flex items-center w-full">
    <select
      id={selectId}
      {name}
      {disabled}
      {required}
      bind:value
      class={selectClasses}
      on:change={(e) => dispatch('change', e)}
      on:input={(e) => dispatch('input', e)}
      on:focus={(e) => dispatch('focus', e)}
      on:blur={(e) => dispatch('blur', e)}
      {...$$restProps}
    >
      {#if placeholder}
        <option value="" disabled selected={!value}>{placeholder}</option>
      {/if}

      {#if options && options.length > 0}
        {#each options as opt}
          <option value={opt.value} disabled={opt.disabled}>{opt.label}</option>
        {/each}
      {:else}
        <slot />
      {/if}
    </select>

    <!-- Custom Select Dropdown Arrow Icon -->
    <div class="absolute right-3 pointer-events-none text-muted flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  </div>

  {#if error}
    <p class="text-xs text-[var(--color-error)] flex items-center gap-1 mt-1.5 font-medium animate-fade-in-up">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="flex-shrink-0"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span>{error}</span>
    </p>
  {:else if helper}
    <p class="text-body-sm text-muted mt-1.5 leading-relaxed">{helper}</p>
  {/if}
</div>
