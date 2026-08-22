<script lang="ts">
  export let label: string;
  export let value: string | number;
  export let badge: string = '';
  export let badgeCls: string = '';
  export let iconCls: string = '';
  export let icon: string = '';
  export let borderAccent: string = '';
  export let valueSuffix: string = '';
  export let description: string = '';
</script>

<div class="bg-card border border-light rounded-2xl p-5 relative overflow-hidden shadow-sm transition-all hover:shadow-md {borderAccent}">
  <div class="flex items-start justify-between gap-3">
    <div class="min-w-0 flex-1">
      <p class="text-[11px] font-extrabold uppercase tracking-wider text-muted truncate">{label}</p>
      <div class="flex items-baseline gap-1.5 mt-2">
        <p class="text-2xl font-black text-main font-mono tracking-tight leading-none whitespace-nowrap">
          {value}
        </p>
        {#if valueSuffix}
          <span class="text-xs font-semibold text-muted">{valueSuffix}</span>
        {/if}
      </div>
    </div>
    {#if icon}
      <div class="icon-wrapper flex-shrink-0 {iconCls}">
        <span class="material-symbols-outlined icon-filled text-lg">
          {icon}
        </span>
      </div>
    {/if}
  </div>

  {#if badge}
    <div class="mt-3.5 flex items-center">
      <span class="badge-custom {badgeCls}">
        <span class="material-symbols-outlined icon-filled text-[12px]">
          {#if label.includes('Saldo') || label.includes('Disetujui')}
            check_circle
          {:else if label.includes('Pendapatan') || label.includes('Total')}
            trending_up
          {:else if label.includes('Hold') || label.includes('Menunggu')}
            hourglass_top
          {:else}
            verified
          {/if}
        </span>
        {badge}
      </span>
    </div>
  {/if}

  {#if description}
    <p class="text-[11px] text-muted mt-3 leading-relaxed border-t border-light pt-2.5">
      {description}
    </p>
  {/if}
</div>