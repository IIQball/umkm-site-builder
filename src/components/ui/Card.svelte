<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let variant: 'bordered' | 'elevated' | 'flat' | 'nested' | 'gradient' = 'bordered';
  export let padding: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  export let radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' = '2xl';
  export let hoverable: boolean = false;
  export let topBeam: boolean | string = false;
  export let beam: boolean = false;
  export let beamColor: string = 'indigo-500';
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
    elevated: 'bg-card border border-light shadow-md hover:shadow-lg',
    flat: 'bg-card border-none shadow-none',
    nested: 'bg-nested border border-light shadow-none',
    gradient: 'bg-gradient-to-br from-indigo-500/8 via-card to-card border border-indigo-500/20 shadow-xs',
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

  $: hasBeam = topBeam || beam;
  $: activeBeamColor = typeof topBeam === 'string' ? topBeam : (beamColor.includes('-') ? beamColor : `${beamColor}-500`);

  $: cardClasses = [
    'relative overflow-hidden transition-all duration-200 text-main',
    variantStyles[variant] || variantStyles.bordered,
    paddingStyles[padding] || paddingStyles.md,
    radiusStyles[radius] || radiusStyles['2xl'],
    hoverable ? 'hover:-translate-y-0.5 hover:shadow-md cursor-pointer' : '',
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
  {#if hasBeam}
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-{activeBeamColor} to-transparent rounded-full z-20 pointer-events-none"
    ></div>
  {/if}
  <slot />
</div>

