<script lang="ts">
  import { colors } from '@/components/tokens/colors';

  export let balance: number = 0;
  export let percentage: number = 0;
  export let status: 'plenty' | 'low' | 'critical' | 'empty' = 'plenty';
  export let size: number = 144;
  export let strokeWidth: number = 10;

  $: isZeroOrEmpty = status === 'empty' || balance <= 0;
  $: safePercentage = isZeroOrEmpty ? 0 : Math.max(0, Math.min(100, percentage));
  $: radius = (size - strokeWidth) / 2;
  $: center = size / 2;
  $: circumference = 2 * Math.PI * radius;
  $: strokeDashoffset = isZeroOrEmpty ? circumference : circumference - (safePercentage / 100) * circumference;

  $: colorConfig = {
    plenty: {
      stroke: colors.semantic.success.DEFAULT,
      glow: colors.semantic.success.bg,
      badgeClass: 'bg-success/10 text-success border-success/20',
      label: 'Kuota Aman',
    },
    low: {
      stroke: colors.semantic.warning.DEFAULT,
      glow: colors.semantic.warning.bg,
      badgeClass: 'bg-warning/10 text-warning border-warning/20',
      label: 'Hampir Habis',
    },
    critical: {
      stroke: colors.semantic.warning.dark,
      glow: colors.semantic.warning.bg,
      badgeClass: 'bg-warning/10 text-warning border-warning/20',
      label: 'Hampir Habis',
    },
    empty: {
      stroke: colors.semantic.error.DEFAULT,
      glow: colors.semantic.error.bg,
      badgeClass: 'bg-error/10 text-error border-error/20',
      label: 'Kredit Habis',
    },
  }[status] || {
    stroke: colors.semantic.success.DEFAULT,
    glow: colors.semantic.success.bg,
    badgeClass: 'bg-success/10 text-success border-success/20',
    label: 'Kuota Aman',
  };
</script>

<div class="relative flex flex-col items-center justify-center p-2">
  <!-- Lightweight Native SVG Gauge -->
  <div class="relative flex items-center justify-center" style="width: {size}px; height: {size}px;">
    <!-- Ambient glow sinkron dengan token warna semantic -->
    <div
      class="absolute inset-2 rounded-full transition-all duration-700 pointer-events-none"
      style="background: radial-gradient(circle, {colorConfig.glow} 0%, transparent 70%);"
      aria-hidden="true"
    ></div>

    <svg
      width={size}
      height={size}
      viewBox="0 0 {size} {size}"
      class="transform -rotate-90 origin-center select-none"
      role="progressbar"
      aria-valuenow={safePercentage}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Pengukur sisa kuota kredit AI: {balance} kredit tersisa ({safePercentage} persen)"
    >
      <!-- Background Track mengacu pada token nested -->
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        stroke-width={strokeWidth}
        class={isZeroOrEmpty ? "text-error/20 dark:text-error/30" : "text-nested dark:text-nested/60"}
      />
      <!-- Active Progress Arc -->
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={colorConfig.stroke}
        stroke-width={strokeWidth}
        stroke-linecap="round"
        stroke-dasharray={circumference}
        stroke-dashoffset={strokeDashoffset}
        class="transition-all duration-700 ease-out"
      />
    </svg>

    <!-- Center Numerical Display dengan tipografi desain sistem -->
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
      <span class="text-3xl sm:text-4xl font-heading font-black {isZeroOrEmpty ? 'text-error' : status === 'critical' || status === 'low' ? 'text-warning' : 'text-main'} tracking-tight leading-none">
        {balance}
      </span>
      <span class="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">
        Kredit AI
      </span>
      <span class="text-[11px] font-semibold text-muted mt-0.5">
        {safePercentage}% Sisa
      </span>
    </div>
  </div>

  <!-- Status Capsule Badge -->
  <div class="mt-3">
    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border {colorConfig.badgeClass}">
      <span class="w-1.5 h-1.5 rounded-full" style="background-color: {colorConfig.stroke}"></span>
      {colorConfig.label}
    </span>
  </div>
</div>
