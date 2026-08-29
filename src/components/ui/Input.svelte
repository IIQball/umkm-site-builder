<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let value: string | number = '';
  export let type: string = 'text';
  export let label: string = '';
  export let error: string = '';
  export let helper: string = '';
  export let placeholder: string = '';
  export let disabled: boolean = false;
  export let readonly: boolean = false;
  export let required: boolean = false;
  export let id: string = '';
  export let name: string = '';
  export let min: number | string | undefined = undefined;
  export let max: number | string | undefined = undefined;
  export let step: number | string | undefined = undefined;
  export let autocomplete: string = 'off';
  export let fullWidth: boolean = true;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  let className: string = '';
  export { className as class };

  const dispatch = createEventDispatcher<{
    input: Event;
    change: Event;
    focus: FocusEvent;
    blur: FocusEvent;
    keydown: KeyboardEvent;
  }>();

  const sizeStyles = {
    sm: 'py-1.5 px-3 text-xs rounded-xl h-8 min-h-[32px]',
    md: 'py-2.5 px-4 text-sm rounded-xl h-10 min-h-[40px]',
    lg: 'py-3 px-5 text-base rounded-2xl h-12 min-h-[48px]',
  };

  $: inputId = id || (label ? `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : '');
  $: inputClasses = [
    'w-full bg-nested text-main border transition-all duration-150 font-sans',
    'placeholder:italic placeholder:text-[var(--color-text-light)] placeholder:opacity-80',
    'focus:outline-none focus:bg-card',
    error
      ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)]/20'
      : 'border-light focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20',
    disabled ? 'opacity-50 cursor-not-allowed bg-nested/50' : '',
    readonly ? 'bg-nested/60 cursor-default' : '',
    sizeStyles[size] || sizeStyles.md,
    $$slots.prefix ? 'pl-9' : '',
    $$slots.suffix ? 'pr-9' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
</script>

<div class="form-control {fullWidth ? 'w-full' : 'inline-block'}">
  {#if label}
    <label for={inputId} class="block text-label-caps text-muted mb-1.5">
      {label}
      {#if required}
        <span class="text-error ml-0.5">*</span>
      {/if}
    </label>
  {/if}

  <div class="relative flex items-center w-full">
    {#if $$slots.prefix}
      <div class="absolute left-3 flex items-center justify-center text-muted pointer-events-none z-10">
        <slot name="prefix" />
      </div>
    {/if}

    {#if type === 'number'}
      <input
        id={inputId}
        {name}
        type="number"
        {placeholder}
        {disabled}
        {readonly}
        {required}
        {min}
        {max}
        {step}
        {autocomplete}
        bind:value
        class={inputClasses}
        on:input={(e) => dispatch('input', e)}
        on:change={(e) => dispatch('change', e)}
        on:focus={(e) => dispatch('focus', e)}
        on:blur={(e) => dispatch('blur', e)}
        on:keydown={(e) => dispatch('keydown', e)}
        {...$$restProps}
      />
    {:else if type === 'password'}
      <input
        id={inputId}
        {name}
        type="password"
        {placeholder}
        {disabled}
        {readonly}
        {required}
        {autocomplete}
        bind:value
        class={inputClasses}
        on:input={(e) => dispatch('input', e)}
        on:change={(e) => dispatch('change', e)}
        on:focus={(e) => dispatch('focus', e)}
        on:blur={(e) => dispatch('blur', e)}
        on:keydown={(e) => dispatch('keydown', e)}
        {...$$restProps}
      />
    {:else if type === 'email'}
      <input
        id={inputId}
        {name}
        type="email"
        {placeholder}
        {disabled}
        {readonly}
        {required}
        {autocomplete}
        bind:value
        class={inputClasses}
        on:input={(e) => dispatch('input', e)}
        on:change={(e) => dispatch('change', e)}
        on:focus={(e) => dispatch('focus', e)}
        on:blur={(e) => dispatch('blur', e)}
        on:keydown={(e) => dispatch('keydown', e)}
        {...$$restProps}
      />
    {:else}
      <input
        id={inputId}
        {name}
        type="text"
        {placeholder}
        {disabled}
        {readonly}
        {required}
        {autocomplete}
        bind:value
        class={inputClasses}
        on:input={(e) => dispatch('input', e)}
        on:change={(e) => dispatch('change', e)}
        on:focus={(e) => dispatch('focus', e)}
        on:blur={(e) => dispatch('blur', e)}
        on:keydown={(e) => dispatch('keydown', e)}
        {...$$restProps}
      />
    {/if}

    {#if $$slots.suffix}
      <div class="absolute right-3 flex items-center justify-center text-muted z-10">
        <slot name="suffix" />
      </div>
    {/if}
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
