<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let variant: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'dark' | 'orange' | 'outline' | 'ghost' = 'primary';
  export let size: 'xs' | 'sm' | 'md' | 'lg' | 'icon' = 'md';
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
      'bg-primary text-white hover:text-white hover:bg-primary/90 active:scale-[0.98] border border-transparent shadow-xs',
    dark:
      'bg-slate-900 text-white hover:text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-white active:scale-[0.98] border border-slate-800 shadow-xs',
    orange:
      'bg-orange text-white hover:text-white hover:bg-orange/90 active:scale-[0.98] border border-transparent shadow-xs',
    secondary:
      'bg-transparent text-main hover:text-main hover:bg-nested/60 border border-slate-300 dark:border-slate-700 active:scale-[0.98] shadow-2xs',
    tertiary:
      'bg-transparent text-slate-700 dark:text-slate-300 hover:text-main underline underline-offset-4 border-transparent p-0 h-auto min-h-0 active:opacity-80 shadow-none',
    outline:
      'bg-transparent text-main hover:text-main hover:bg-nested/60 border border-slate-300 dark:border-slate-700 active:scale-[0.98] shadow-2xs',
    ghost:
      'bg-transparent text-secondary hover:text-main hover:bg-nested active:scale-[0.98] border border-transparent',
    destructive:
      'bg-rose-600 text-white hover:text-white hover:bg-rose-700 active:scale-[0.98] border border-transparent shadow-xs',
  };

  const sizeStyles = {
    xs: 'text-2xs px-2.5 py-1 rounded-xl gap-1 h-7 min-h-[28px]',
    sm: 'text-xs px-3.5 py-1.5 rounded-xl gap-1.5 h-8 min-h-[32px]',
    md: 'text-sm px-4 py-2.5 rounded-2xl gap-2 h-10 min-h-[40px]',
    lg: 'text-base px-5 py-3 rounded-2xl gap-2.5 h-12 min-h-[48px]',
    icon: 'p-1.5 rounded-xl h-8 w-8 min-h-[32px] min-w-[32px] justify-center items-center',
  };

  $: isDisabled = disabled || loading;
  $: baseClasses = [
    'inline-flex items-center justify-center font-heading font-semibold transition-all duration-150 cursor-pointer select-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100',
    '[&_svg]:text-current [&_svg]:shrink-0 [&_.material-symbols-outlined]:text-current',
    variantStyles[variant] || variantStyles.primary,
    variant === 'tertiary' ? 'text-xs sm:text-sm font-medium gap-1' : (sizeStyles[size] || sizeStyles.md),
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
  </button>
{/if}
