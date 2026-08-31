<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let variant: 'bordered' | 'elevated' | 'flat' | 'nested' | 'gradient' = 'bordered';
  export let padding: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  export let radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' = '2xl';
  export let hoverable: boolean = false;
  export let id: string = '';
  export let role: string | undefined = undefined;
  let className: string = '';
  export { className as class };

  const dispatch = createEventDispatcher<{
    click: MouseEvent;
    mouseenter: MouseEvent;
    mouseleave: MouseEvent;
  }>();

  const variantStyles = {
    bordered: 'bg-card border border-light shadow-xs',
    elevated: 'bg-card border border-light shadow-sm hover:shadow-md',
    flat: 'bg-card border-none shadow-none',
    nested: 'bg-nested border border-light shadow-none',
    gradient: 'bg-card border border-light shadow-xs',
  };

  const paddingStyles = {
    none: 'p-0',
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-6 md:p-8',
    xl: 'p-8 md:p-10',
  };

  const radiusStyles = {
    none: 'rounded-none',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    '2xl': 'rounded-3xl',
    '3xl': 'rounded-[2rem]',
    full: 'rounded-full',
  };

  $: cardClasses = [
    'relative overflow-hidden transition-all duration-150 text-main',
    variantStyles[variant] || variantStyles.bordered,
    paddingStyles[padding] || paddingStyles.md,
    radiusStyles[radius] || radiusStyles['2xl'],
    hoverable ? 'hover:-translate-y-0.5 hover:shadow-sm cursor-pointer' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
</script>

<div
  {id}
  class={cardClasses}
  {role}
  on:click={(e) => dispatch('click', e)}
  on:mouseenter={(e) => dispatch('mouseenter', e)}
  on:mouseleave={(e) => dispatch('mouseleave', e)}
  {...$$restProps}
>
  <slot />
</div>


