<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let value: string = '';
  export let label: string = '';
  export let error: string = '';
  export let helper: string = '';
  export let placeholder: string = '';
  export let disabled: boolean = false;
  export let readonly: boolean = false;
  export let required: boolean = false;
  export let rows: number = 3;
  export let maxlength: number | undefined = undefined;
  export let id: string = '';
  export let name: string = '';
  export let resizable: boolean = true;
  export let fullWidth: boolean = true;
  let className: string = '';
  export { className as class };

  const dispatch = createEventDispatcher<{
    input: Event;
    change: Event;
    focus: FocusEvent;
    blur: FocusEvent;
    keydown: KeyboardEvent;
  }>();

  $: textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : '');
  $: textareaClasses = [
    'w-full bg-nested text-main border rounded-2xl py-2.5 px-4 text-sm transition-all duration-150 font-sans',
    'placeholder:italic placeholder:text-[var(--color-text-light)] placeholder:opacity-80',
    'focus:outline-none focus:bg-card',
    error
      ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)]/20'
      : 'border-light focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20',
    disabled ? 'opacity-50 cursor-not-allowed bg-nested/50' : '',
    readonly ? 'bg-nested/60 cursor-default' : '',
    resizable ? 'resize-y' : 'resize-none',
    className,
  ]
    .filter(Boolean)
    .join(' ');
</script>

<div class="form-control {fullWidth ? 'w-full' : 'inline-block'}">
  {#if label}
    <div class="flex items-center justify-between mb-1.5">
      <label for={textareaId} class="block text-label-caps text-muted">
        {label}
        {#if required}
          <span class="text-error ml-0.5">*</span>
        {/if}
      </label>
      {#if maxlength !== undefined}
        <span class="text-2xs font-mono text-muted">
          {value.length}/{maxlength}
        </span>
      {/if}
    </div>
  {/if}

  <textarea
    id={textareaId}
    {name}
    {rows}
    {maxlength}
    {placeholder}
    {disabled}
    {readonly}
    {required}
    bind:value
    class={textareaClasses}
    on:input={(e) => dispatch('input', e)}
    on:change={(e) => dispatch('change', e)}
    on:focus={(e) => dispatch('focus', e)}
    on:blur={(e) => dispatch('blur', e)}
    on:keydown={(e) => dispatch('keydown', e)}
    {...$$restProps}
  ></textarea>

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
