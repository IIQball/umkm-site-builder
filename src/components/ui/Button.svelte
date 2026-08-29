<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' = 'primary';
  export let size: 'sm' | 'md' | 'lg' | 'icon' = 'md';
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let fullWidth: boolean = false;
  export let href: string = '';
  export let title: string = '';
  export let id: string = '';
  let className: string = '';
  export { className as class };

  const dispatch = createEventDispatcher<{
    click: MouseEvent;
    focus: FocusEvent;
    blur: FocusEvent;
  }>();

  const variantStyles = {
    primary:
      'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] active:scale-[0.98] border border-transparent shadow-xs hover:shadow-md',
    secondary:
      'bg-nested text-main hover:bg-nested/80 border border-light active:scale-[0.98] shadow-2xs',
    outline:
      'bg-transparent text-main border border-light hover:border-primary hover:text-primary active:scale-[0.98]',
    ghost:
      'bg-transparent text-secondary hover:text-main hover:bg-nested active:scale-[0.98] border border-transparent',
    destructive:
      'bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90 active:scale-[0.98] border border-transparent shadow-xs',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5 h-8 min-h-[32px]',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2 h-10 min-h-[40px]',
    lg: 'text-base px-5 py-3 rounded-2xl gap-2.5 h-12 min-h-[48px]',
    icon: 'p-2 rounded-xl h-9 w-9 min-h-[36px] min-w-[36px] justify-center items-center',
  };

  $: isDisabled = disabled || loading;
  $: baseClasses = [
    'inline-flex items-center justify-center font-heading font-semibold transition-all duration-150 cursor-pointer select-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100',
    variantStyles[variant] || variantStyles.primary,
    sizeStyles[size] || sizeStyles.md,
    fullWidth ? 'w-full flex' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
</script>

{#if href && !isDisabled}
  <a
    {href}
    {id}
    {title}
    class={baseClasses}
    on:click={(e) => dispatch('click', e)}
    on:focus={(e) => dispatch('focus', e)}
    on:blur={(e) => dispatch('blur', e)}
    {...$$restProps}
  >
    {#if loading}
      <svg
        class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    {/if}
    <slot />
  </a>
{:else}
  <button
    {type}
    {id}
    {title}
    disabled={isDisabled}
    class={baseClasses}
    on:click={(e) => dispatch('click', e)}
    on:focus={(e) => dispatch('focus', e)}
    on:blur={(e) => dispatch('blur', e)}
    {...$$restProps}
  >
    {#if loading}
      <svg
        class="animate-spin -ml-1 mr-2 h-4 w-4 text-current flex-shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    {/if}
    <slot />
  </button>
{/if}
