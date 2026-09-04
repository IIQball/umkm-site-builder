<script lang="ts">
  import { onMount } from 'svelte';

  export let label: string;
  export let value: string | number;
  export let rawValue: number | undefined = undefined;
  export let badge: string = '';
  export let badgeCls: string = '';
  export let iconCls: string = '';
  export let icon: string = '';
  export let borderAccent: string = '';
  export let valueSuffix: string = '';
  export let description: string = '';
  export let isHero: boolean = false;
  export let cardTheme: 'default' | 'dark' | 'orange' | 'blue' = 'default';
  export let footerText: string = '';
  export let delayClass: string = '';

  let displayValue: string = typeof value === 'string' ? value : String(value);

  $: resolvedTheme = isHero ? 'dark' : cardTheme;
  $: isDarkCard = resolvedTheme === 'dark';
  $: isOrangeCard = resolvedTheme === 'orange';
  $: isBlueCard = resolvedTheme === 'blue';
  $: isColoredCard = isDarkCard || isOrangeCard || isBlueCard;
  let animationId: number;

  const animate = (val: string | number, rawVal?: number) => {
    if (typeof window === 'undefined') {
      displayValue = typeof val === 'string' ? val : String(val);
      return;
    }

    if (animationId) {
      window.cancelAnimationFrame(animationId);
    }
    
    let target = 0;
    let isCurrency = false;

    if (typeof rawVal === 'number') {
      target = rawVal;
      isCurrency = typeof val === 'string' && val.includes('Rp');
    } else if (typeof val === 'number') {
      target = val;
    } else if (typeof val === 'string') {
      isCurrency = val.includes('Rp');
      const clean = val.replace(/[^0-9]/g, '');
      target = parseInt(clean, 10) || 0;
    }

    if (target > 0) {
      const duration = 900;
      const startTime = performance.now();

      const updateCount = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.round(target * ease);

        if (isCurrency) {
          displayValue = 'Rp ' + current.toLocaleString('id-ID');
        } else {
          displayValue = current.toLocaleString('id-ID');
        }

        if (progress < 1) {
          animationId = requestAnimationFrame(updateCount);
        } else {
          displayValue = typeof val === 'string' ? val : String(val);
        }
      };

      animationId = requestAnimationFrame(updateCount);
    } else {
      displayValue = typeof val === 'string' ? val : String(val);
    }
  };

  $: {
    if (value !== undefined) {
      animate(value, rawValue);
    }
  }
</script>

<div
  class="{isDarkCard
    ? 'bg-slate-900 text-white dark:bg-slate-800/95 border border-slate-800 dark:border-slate-700 shadow-sm'
    : isOrangeCard
    ? 'bg-orange text-white border border-orange/20 shadow-md shadow-orange/10'
    : isBlueCard
    ? 'bg-primary text-white border border-primary/20 shadow-md shadow-primary/10'
    : 'bg-card border border-light shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'}
    rounded-3xl p-6 transition-all flex flex-col justify-between min-h-[168px] w-full h-full animate-fade-in-up {borderAccent} {delayClass}"
>
  <!-- Header: Label + Icon Container -->
  <div class="flex items-center justify-between gap-2.5">
    <p class="text-xs font-bold uppercase tracking-wider font-heading truncate {isColoredCard ? 'text-white/80' : 'text-muted'}">
      {label}
    </p>
    {#if icon}
      <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 {isDarkCard ? 'bg-slate-800 text-slate-200 border border-slate-700' : isColoredCard ? 'bg-white/15 text-white border border-white/20' : 'bg-nested border border-light text-muted'}">
        <span class="material-symbols-outlined text-base {iconCls}">{icon}</span>
      </div>
    {/if}
  </div>

  <!-- Value Body: Sharp authoritative typography -->
  <div class="my-3 min-w-0">
    <div class="flex flex-wrap items-baseline gap-1.5 min-w-0">
      <p class="text-heading-md sm:text-2xl font-black font-mono tracking-tight leading-none break-normal {isColoredCard ? 'text-white' : 'text-main'}">
        {displayValue}
      </p>
      {#if valueSuffix}
        <span class="text-xs font-medium flex-shrink-0 {isColoredCard ? 'text-white/70' : 'text-muted'}">{valueSuffix}</span>
      {/if}
    </div>
  </div>

  <!-- Footer: Clean description / status / helper note -->
  <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t text-2xs {isDarkCard ? 'border-slate-800 text-slate-400' : isColoredCard ? 'border-white/20 text-white/80' : 'border-light/60 text-muted'}">
    {#if badge}
      <span class="inline-flex items-center gap-1.5 font-bold px-2.5 py-0.5 rounded-full border {isDarkCard ? 'bg-slate-800 border-slate-700 text-slate-300' : isColoredCard ? 'bg-white/20 border-white/30 text-white' : 'bg-nested border-light text-slate-700 dark:text-slate-300'} {badgeCls}">
        <span class="w-1.5 h-1.5 rounded-full {isDarkCard ? 'bg-emerald-400' : isColoredCard ? 'bg-white' : 'bg-slate-400 dark:bg-slate-500'}"></span>
        <span>{badge}</span>
      </span>
    {/if}
    {#if description}
      <span class={isColoredCard ? 'text-white/80' : 'text-muted'}>{description}</span>
    {:else if footerText}
      <span class="font-normal {isColoredCard ? 'text-white/80' : 'text-muted'}">{footerText}</span>
    {/if}
  </div>
</div>