<script lang="ts">
  import { formatIDR, formatSmartIDR } from "@/lib/currency";

  export let label: string;
  export let value: string | number;
  export let rawValue: number | undefined = undefined;
  export let badge: string = "";
  export let badgeCls: string = "";
  export let iconCls: string = "";
  export let icon: string = "";
  export let borderAccent: string = "";
  export let valueSuffix: string = "";
  export let description: string = "";
  export let isHero: boolean = false;
  export let cardTheme: "default" | "dark" | "orange" | "blue" = "default";
  export let footerText: string = "";
  export let delayClass: string = "";
  export let compactCurrency: boolean = true;

  let displayValue: string = typeof value === "string" ? value : String(value);

  $: resolvedTheme = isHero ? "dark" : cardTheme;
  $: isDarkCard = resolvedTheme === "dark";
  $: isOrangeCard = resolvedTheme === "orange";
  $: isBlueCard = resolvedTheme === "blue";
  $: isColoredCard = isDarkCard || isOrangeCard || isBlueCard;
  let animationId: number;

  $: valueLength = displayValue ? displayValue.length : 0;
  $: valueSizeClass =
    valueLength > 16
      ? "text-lg sm:text-xl"
      : valueLength > 12
        ? "text-xl sm:text-2xl"
        : "text-heading-md sm:text-2xl";

  const animate = (val: string | number, rawVal?: number) => {
    let target = 0;
    let isCurrency = false;

    if (typeof rawVal === "number") {
      target = rawVal;
      isCurrency = typeof val === "string" && val.includes("Rp");
    } else if (typeof val === "number") {
      target = val;
    } else if (typeof val === "string") {
      isCurrency = val.includes("Rp");
      const clean = val.replace(/[^0-9]/g, "");
      target = parseInt(clean, 10) || 0;
    }

    if (typeof window === "undefined") {
      if (isCurrency && compactCurrency) {
        displayValue = formatSmartIDR(target || val);
      } else {
        displayValue = typeof val === "string" ? val : String(val);
      }
      return;
    }

    if (animationId) {
      window.cancelAnimationFrame(animationId);
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
          displayValue = compactCurrency
            ? formatSmartIDR(current)
            : formatIDR(current);
        } else {
          displayValue = current.toLocaleString("id-ID");
        }

        if (progress < 1) {
          animationId = requestAnimationFrame(updateCount);
        } else {
          if (isCurrency && compactCurrency) {
            displayValue = formatSmartIDR(target);
          } else {
            displayValue = typeof val === "string" ? val : String(val);
          }
        }
      };

      animationId = requestAnimationFrame(updateCount);
    } else {
      if (isCurrency && compactCurrency) {
        displayValue = formatSmartIDR(target || val);
      } else {
        displayValue = typeof val === "string" ? val : String(val);
      }
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
    ? 'bg-main text-canvas dark:bg-nested dark:text-white border border-border/80 dark:border-white/10 shadow-sm'
    : isOrangeCard
      ? 'bg-orange text-white border border-orange/20 shadow-md shadow-orange/10'
      : isBlueCard
        ? 'bg-primary text-white border border-primary/20 shadow-md shadow-primary/10'
        : 'bg-card border border-light shadow-xs hover:border-border hover:shadow-md'}
    rounded-3xl p-5 sm:p-6 transition-all flex flex-col justify-between min-h-[168px] w-full h-full animate-fade-in-up {borderAccent} {delayClass}"
>
  <!-- Header: Label + Icon Container -->
  <div class="flex items-start justify-between gap-2.5">
    <p
      class="text-xs font-bold uppercase tracking-wider font-heading leading-snug break-words flex-1 min-w-0 {isColoredCard
        ? 'text-white/80'
        : 'text-muted'}"
    >
      {label}
    </p>
    {#if icon}
      <div
        class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 {isDarkCard
          ? 'bg-white/10 text-white border border-white/15'
          : isColoredCard
            ? 'bg-white/15 text-white border border-white/20'
            : 'bg-nested dark:bg-white/5 border border-light dark:border-white/10 text-muted dark:text-secondary'}"
      >
        <span class="material-symbols-outlined text-base {iconCls}">{icon}</span>
      </div>
    {/if}
  </div>

  <!-- Value Body: Sharp authoritative typography -->
  <div class="my-3 min-w-0 w-full overflow-hidden">
    <div class="flex items-baseline gap-1.5 min-w-0 overflow-x-hidden">
      <p
        class="{valueSizeClass} font-black font-mono tracking-tight leading-none whitespace-nowrap {isColoredCard
          ? 'text-white'
          : 'text-main dark:text-white'}"
      >
        {displayValue}
      </p>
      {#if valueSuffix}
        <span
          class="text-xs font-medium flex-shrink-0 whitespace-nowrap {isColoredCard
            ? 'text-white/70'
            : 'text-muted'}">{valueSuffix}</span>
      {/if}
    </div>
  </div>

  <!-- Footer: Clean description / status / helper note -->
  <div
    class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t text-2xs {isDarkCard
      ? 'border-white/10 text-white/75'
      : isColoredCard
        ? 'border-white/20 text-white/80'
        : 'border-light/60 dark:border-white/10 text-muted'}"
  >
    {#if badge}
      <span
        class="inline-flex items-center gap-1.5 font-bold px-2.5 py-0.5 rounded-full border {isDarkCard
          ? 'bg-white/10 border-white/15 text-white/90'
          : isColoredCard
            ? 'bg-white/20 border-white/30 text-white'
            : 'bg-nested dark:bg-white/5 border-light dark:border-white/10 text-secondary dark:text-main'} {badgeCls}"
      >
        <span
          class="w-1.5 h-1.5 rounded-full {isDarkCard
            ? 'bg-success'
            : isColoredCard
              ? 'bg-white'
              : 'bg-success'}"
        ></span>
        <span>{badge}</span>
      </span>
    {/if}
    {#if description}
      <span
        class={isColoredCard
          ? "text-white/80"
          : "text-muted dark:text-secondary"}>{description}</span>
    {:else if footerText}
      <span
        class="font-normal {isColoredCard
          ? 'text-white/80'
          : 'text-muted dark:text-secondary'}">{footerText}</span>
    {/if}
  </div>
</div>
