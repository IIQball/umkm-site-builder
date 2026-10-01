<script lang="ts">
  export let id: string;
  export let label: string;
  export let value: number;
  export let min: number = 0;
  export let max: number = 64;
  export let step: number = 8;
  export let chips: number[] = [];
  export let color: 'primary' | 'secondary' = 'primary';
  export let onChange: (val: number) => void;

  $: badgeClass = color === 'primary' ? 'badge-primary text-primary-content' : 'badge-secondary !text-white';
  $: rangeClass = color === 'primary' ? 'range-primary' : 'range-secondary';
  $: activeChipClass = color === 'primary' ? 'bg-primary text-primary-content font-bold shadow-2xs' : 'bg-secondary !text-white font-bold shadow-2xs';
</script>

<div class="space-y-1.5">
  <div class="flex items-center justify-between text-xs">
    <label for={id} class="font-semibold text-base-content/80 flex items-center gap-1.5 text-[11px]">
      <slot name="icon" />
      <span>{label}</span>
    </label>
    <span class="badge badge-sm {badgeClass} font-mono">{value}px</span>
  </div>

  <input
    {id}
    type="range"
    {min}
    {max}
    {step}
    {value}
    on:input={(e) => onChange(Number(e.currentTarget.value))}
    class="range range-xs {rangeClass} w-full"
  />

  {#if chips.length > 0}
    <div class="flex items-center gap-1 flex-wrap pt-0.5">
      {#each chips as chip}
        <button
          type="button"
          on:click={() => onChange(chip)}
          class="px-1.5 py-0.5 rounded text-[10px] font-mono transition-all {value === chip ? activeChipClass : 'bg-base-200/80 text-base-content/70 hover:bg-base-300'}"
        >
          {chip}px
        </button>
      {/each}
    </div>
  {/if}
</div>
