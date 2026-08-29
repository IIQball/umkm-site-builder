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
  export let footerText: string = 'Bulan ini vs lalu';
  export let colorTheme: 'indigo' | 'emerald' | 'amber' | 'violet' | 'sky' | 'rose' = 'indigo';
  export let delayClass: string = '';

  let displayValue: string = typeof value === 'string' ? value : String(value);

  const themeStyles = {
    indigo: {
      card: 'border-indigo-500/25 bg-gradient-to-br from-indigo-500/8 via-card to-card hover:border-indigo-500/40 hover:shadow-indigo-500/10',
      iconBox: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
      badge: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
      arrow: 'hover:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
      beam: 'from-transparent via-indigo-500 to-transparent',
      glow: 'bg-indigo-500/25',
    },
    emerald: {
      card: 'border-emerald-500/25 bg-gradient-to-br from-emerald-500/8 via-card to-card hover:border-emerald-500/40 hover:shadow-emerald-500/10',
      iconBox: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
      badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      arrow: 'hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
      beam: 'from-transparent via-emerald-500 to-transparent',
      glow: 'bg-emerald-500/25',
    },
    amber: {
      card: 'border-amber-500/25 bg-gradient-to-br from-amber-500/8 via-card to-card hover:border-amber-500/40 hover:shadow-amber-500/10',
      iconBox: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      arrow: 'hover:bg-amber-500/15 text-amber-600 dark:text-amber-400',
      beam: 'from-transparent via-amber-500 to-transparent',
      glow: 'bg-amber-500/25',
    },
    violet: {
      card: 'border-violet-500/25 bg-gradient-to-br from-violet-500/8 via-card to-card hover:border-violet-500/40 hover:shadow-violet-500/10',
      iconBox: 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20',
      badge: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30',
      arrow: 'hover:bg-violet-500/15 text-violet-600 dark:text-violet-400',
      beam: 'from-transparent via-violet-500 to-transparent',
      glow: 'bg-violet-500/25',
    },
    sky: {
      card: 'border-sky-500/25 bg-gradient-to-br from-sky-500/8 via-card to-card hover:border-sky-500/40 hover:shadow-sky-500/10',
      iconBox: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20',
      badge: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
      arrow: 'hover:bg-sky-500/15 text-sky-600 dark:text-sky-400',
      beam: 'from-transparent via-sky-500 to-transparent',
      glow: 'bg-sky-500/25',
    },
    rose: {
      card: 'border-rose-500/25 bg-gradient-to-br from-rose-500/8 via-card to-card hover:border-rose-500/40 hover:shadow-rose-500/10',
      iconBox: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20',
      badge: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
      arrow: 'hover:bg-rose-500/15 text-rose-600 dark:text-rose-400',
      beam: 'from-transparent via-rose-500 to-transparent',
      glow: 'bg-rose-500/25',
    },
  };

  $: t = themeStyles[colorTheme] || themeStyles.indigo;

  onMount(() => {
    let target = 0;
    let isCurrency = false;

    if (typeof rawValue === 'number') {
      target = rawValue;
      isCurrency = typeof value === 'string' && value.includes('Rp');
    } else if (typeof value === 'number') {
      target = value;
    } else if (typeof value === 'string') {
      isCurrency = value.includes('Rp');
      const clean = value.replace(/[^0-9]/g, '');
      target = parseInt(clean, 10) || 0;
    }

    if (target > 0) {
      const duration = 1200;
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
          requestAnimationFrame(updateCount);
        } else {
          displayValue = typeof value === 'string' ? value : String(value);
        }
      };

      requestAnimationFrame(updateCount);
    }
  });
</script>

{#if isHero}
  <!-- Hero Card Variant (Rich Royal Gradient with Ambient Glow & Smooth Top Beam) -->
  <div class="bg-gradient-to-br from-[#5551FF] via-[#6366F1] to-[#4338CA] dark:from-[#2d2b6e] dark:via-[#3730a3] dark:to-[#1e1b60] text-white rounded-3xl p-6 md:p-7 shadow-xl shadow-indigo-500/25 dark:shadow-indigo-900/40 relative overflow-hidden flex flex-col justify-between min-h-[185px] w-full transition-all hover:shadow-2xl hover:shadow-indigo-500/35 group animate-fade-in-up {delayClass}">
    <!-- Smooth top accent luminous beam (fades softly to transparent at both ends) -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full z-20 pointer-events-none"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-3 bg-white/20 blur-md rounded-full pointer-events-none z-10"></div>

    <!-- Ambient glowing light orb -->
    <div class="absolute -right-10 -bottom-10 w-44 h-44 bg-white/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -left-10 -top-10 w-36 h-36 bg-indigo-300/20 rounded-full blur-2xl pointer-events-none"></div>

    <!-- Header: Icon + Label + Action Button -->
    <div class="flex items-start justify-between gap-3 relative z-10">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
          <span class="material-symbols-outlined text-lg {iconCls}">{icon || 'account_balance_wallet'}</span>
        </div>
        <p class="text-xs font-bold text-white/90 uppercase tracking-wider">{label}</p>
      </div>
      <div class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 flex items-center justify-center flex-shrink-0 transition-transform group-hover:rotate-45 shadow-xs">
        <span class="material-symbols-outlined text-base">north_east</span>
      </div>
    </div>

    <!-- Value Body (Expands dynamically, never cuts off) -->
    <div class="my-4 relative z-10 min-w-0">
      <div class="flex flex-wrap items-baseline gap-2">
        <p class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-mono tracking-tight leading-tight break-all">
          {displayValue}
        </p>
        {#if valueSuffix}
          <span class="text-sm font-semibold text-white/85">{valueSuffix}</span>
        {/if}
      </div>
    </div>

    <!-- Footer: Status Pill + Subtitle -->
    <div class="flex flex-wrap items-center justify-between gap-2 relative z-10 pt-2 border-t border-white/20">
      {#if badge}
        <span class="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
          <span class="material-symbols-outlined text-xs">verified</span>
          {badge}
        </span>
      {/if}
      {#if description}
        <p class="text-2xs text-white/80">{description}</p>
      {:else}
        <span class="text-2xs text-white/75 font-medium">{footerText}</span>
      {/if}
    </div>
  </div>
{:else}
  <!-- Colorful Modern Card Variant (Smooth ambient theme gradient & Smooth Top Beam) -->
  <div class="bg-card border rounded-3xl p-6 md:p-7 relative overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between min-h-[185px] w-full {t.card} {borderAccent} group animate-fade-in-up {delayClass}">
    <!-- Smooth top accent luminous beam (fades softly to transparent at both ends) -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r {t.beam} rounded-full z-20 pointer-events-none"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-3.5 {t.glow} blur-md rounded-full pointer-events-none z-10"></div>
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-9 h-9 rounded-2xl {t.iconBox} flex items-center justify-center flex-shrink-0 shadow-xs">
          <span class="material-symbols-outlined text-lg {iconCls}">{icon || 'insights'}</span>
        </div>
        <p class="text-xs font-bold text-muted uppercase tracking-wider">{label}</p>
      </div>
      <div class="w-8 h-8 rounded-full bg-nested hover:bg-nested/80 border border-light text-main flex items-center justify-center flex-shrink-0 transition-transform group-hover:rotate-45 {t.arrow}">
        <span class="material-symbols-outlined text-base">north_east</span>
      </div>
    </div>

    <!-- Value Body (Expands dynamically, never cuts off) -->
    <div class="my-4 min-w-0">
      <div class="flex flex-wrap items-baseline gap-2">
        <p class="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-main font-mono tracking-tight leading-tight break-all">
          {displayValue}
        </p>
        {#if valueSuffix}
          <span class="text-body-sm font-semibold text-muted">{valueSuffix}</span>
        {/if}
      </div>
    </div>

    <!-- Footer: Status Pill + Subtitle -->
    <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-light">
      {#if badge}
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border {t.badge} shadow-2xs">
          <span class="material-symbols-outlined text-xs">
            {#if label.includes('Saldo') || label.includes('Disetujui')}
              check_circle
            {:else if label.includes('Pendapatan') || label.includes('Total')}
              trending_up
            {:else if label.includes('Hold') || label.includes('Mengendap')}
              hourglass_top
            {:else}
              verified
            {/if}
          </span>
          {badge}
        </span>
      {:else if badgeCls}
        <span class="badge-custom {badgeCls} text-xs py-1 px-3 rounded-full font-bold">
          {badge}
        </span>
      {/if}
      {#if description}
        <p class="text-2xs text-muted">{description}</p>
      {:else}
        <span class="text-2xs text-muted font-medium">{footerText}</span>
      {/if}
    </div>
  </div>
{/if}