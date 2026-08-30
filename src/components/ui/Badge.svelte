<script lang="ts">
  import type { BadgeVariant } from '../tokens/colors';

  export let variant: BadgeVariant = 'secondary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let dot: boolean = true;
  export let pulse: boolean = false;
  export let uppercase: boolean = false;
  let className: string = '';
  export { className as class };

  // Minimal neutral badge container with subtle border; color expressed through clean status dot
  const dotColorStyles: Record<BadgeVariant, { dot: string; text?: string }> = {
    primary: { dot: 'bg-blue-600 dark:bg-blue-400' },
    indigo: { dot: 'bg-blue-600 dark:bg-blue-400' },
    secondary: { dot: 'bg-slate-400 dark:bg-slate-500' },
    slate: { dot: 'bg-slate-400 dark:bg-slate-500' },
    success: { dot: 'bg-emerald-500' },
    emerald: { dot: 'bg-emerald-500' },
    warning: { dot: 'bg-amber-500' },
    amber: { dot: 'bg-amber-500' },
    error: { dot: 'bg-rose-500' },
    rose: { dot: 'bg-rose-500' },
    info: { dot: 'bg-sky-500' },
    sky: { dot: 'bg-sky-500' },
    violet: { dot: 'bg-violet-500' },
    orange: { dot: 'bg-orange-500' },
  };

  const sizeStyles = {
    sm: 'text-3xs py-0.5 px-2 gap-1.5',
    md: 'text-2xs py-1 px-2.5 gap-1.5',
    lg: 'text-xs py-1.5 px-3 gap-2',
  };

  $: styleConfig = dotColorStyles[variant] || dotColorStyles.secondary;
  $: badgeClasses = [
    'inline-flex items-center font-medium border rounded-full select-none leading-none bg-slate-100/90 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700/80',
    sizeStyles[size] || sizeStyles.md,
    uppercase ? 'uppercase tracking-wider text-[10px] font-bold font-heading' : 'tracking-tight',
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

