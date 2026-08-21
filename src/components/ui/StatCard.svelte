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

<div class="bg-card border border-main rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow {borderAccent}">
  {#if icon}
    <div class="icon-wrapper absolute right-4 top-5 {iconCls}">
      <span class="material-symbols-outlined icon-filled text-[20px]">
        {icon}
      </span>
    </div>
  {/if}

  <p class="text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1">{label}</p>

  <p class="text-[26px] font-black text-main font-mono leading-none mt-2 pr-14 whitespace-nowrap">
    {value}
    {#if valueSuffix}
      <span class="text-sm font-semibold text-muted ml-1">{valueSuffix}</span>
    {/if}
  </p>

  {#if badge}
    <div class="mt-4">
      <span class="badge-custom {badgeCls}">
        <span class="material-symbols-outlined icon-filled text-[11px]">
          {#if label === 'Saldo Aktif' || label === 'Saldo Siap Tarik'}
            check_circle
          {:else if label === 'Total Pendapatan Bersih' || label === 'Total Template' || label === 'Total'}
            trending_up
          {:else}
            verified
          {/if}
        </span>
        {badge}
      </span>
    </div>
  {/if}

  {#if description}
    <p class="text-[10px] text-muted mt-3 leading-relaxed border-t border-light pt-2 select-none">
      {description}
    </p>
  {/if}
</div>
