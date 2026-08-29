<script lang="ts">
  import type { BadgeVariant } from '../tokens/colors';

  export let variant: BadgeVariant = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let dot: boolean = false;
  export let pulse: boolean = false;
  export let uppercase: boolean = true;
  let className: string = '';
  export { className as class };

  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    primary: {
      container:
        'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/25',
      dot: 'bg-indigo-500',
    },
    indigo: {
      container:
        'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/25',
      dot: 'bg-indigo-500',
    },
    secondary: {
      container: 'bg-nested text-secondary border-light',
      dot: 'bg-slate-500',
    },
    slate: {
      container: 'bg-nested text-secondary border-light',
      dot: 'bg-slate-500',
    },
    success: {
      container:
        'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
      dot: 'bg-emerald-500',
    },
    emerald: {
      container:
        'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
      dot: 'bg-emerald-500',
    },
    warning: {
      container:
        'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25',
      dot: 'bg-amber-500',
    },
    amber: {
      container:
        'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25',
      dot: 'bg-amber-500',
    },
    error: {
      container:
        'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25',
      dot: 'bg-rose-500',
    },
    rose: {
      container:
        'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25',
      dot: 'bg-rose-500',
    },
    info: {
      container:
        'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25',
      dot: 'bg-sky-500',
    },
    sky: {
      container:
        'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25',
      dot: 'bg-sky-500',
    },
    violet: {
      container:
        'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/25',
      dot: 'bg-violet-500',
    },
  };

  const sizeStyles = {
    sm: 'text-3xs py-0.5 px-2 gap-1',
    md: 'text-2xs py-1 px-2.5 gap-1.5',
    lg: 'text-xs py-1.5 px-3.5 gap-2',
  };

  $: styleConfig = variantStyles[variant] || variantStyles.primary;
  $: badgeClasses = [
    'inline-flex items-center font-heading font-bold border rounded-full select-none shadow-2xs leading-none',
    styleConfig.container,
    sizeStyles[size] || sizeStyles.md,
    uppercase ? 'uppercase tracking-caps' : 'tracking-normal',
    className,
  ]
    .filter(Boolean)
    .join(' ');
</script>

<span class={badgeClasses} {...$$restProps}>
  {#if dot}
    <span
      class="w-1.5 h-1.5 rounded-full flex-shrink-0 {styleConfig.dot} {pulse ? 'animate-pulse' : ''}"
      aria-hidden="true"
    ></span>
  {/if}
  <slot />
</span>
