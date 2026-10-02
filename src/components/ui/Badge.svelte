<script lang="ts">
  import type { BadgeVariant } from '../tokens/colors'

  export let variant: BadgeVariant = 'secondary'
  export let size: 'sm' | 'md' | 'lg' = 'md'
  export let dot: boolean = true
  export let pulse: boolean = false
  export let uppercase: boolean = false
  let className: string = ''
  export { className as class }

  // Minimal neutral badge container with subtle border dot color mapped to semantic classes
  const dotColorStyles: Record<BadgeVariant, { dot: string, text?: string }> = {
    primary: { dot: 'bg-primary' },
    indigo: { dot: 'bg-primary' },
    secondary: { dot: 'bg-secondary' },
    slate: { dot: 'bg-muted' },
    success: { dot: 'bg-success' },
    emerald: { dot: 'bg-success' },
    warning: { dot: 'bg-warning' },
    amber: { dot: 'bg-warning' },
    error: { dot: 'bg-error' },
    rose: { dot: 'bg-error' },
    info: { dot: 'bg-info' },
    sky: { dot: 'bg-info' },
    violet: { dot: 'bg-accent' },
    orange: { dot: 'bg-orange' }
  }

  const sizeStyles = {
    sm: 'text-3xs py-0.5 px-2 gap-1.5',
    md: 'text-2xs py-1 px-2.5 gap-1.5',
    lg: 'text-xs py-1.5 px-3 gap-2'
  }

  $: styleConfig = dotColorStyles[variant] || dotColorStyles.secondary
  $: badgeClasses = [
    'inline-flex items-center font-medium border rounded-full select-none leading-none bg-nested text-secondary dark:text-main border-light',
    sizeStyles[size] || sizeStyles.md,
    uppercase ? 'uppercase tracking-wider text-micro font-bold font-heading' : 'tracking-tight',
    className
  ]
    .filter(Boolean)
    .join(' ')
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

