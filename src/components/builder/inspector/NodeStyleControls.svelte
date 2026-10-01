<script context="module" lang="ts">
  export { textColorOptions, marginOptions } from './nodeStyles.constants';
</script>

<script lang="ts">
  import { textColorOptions, marginOptions } from './nodeStyles.constants';

  export let color: string = '';

  export let marginTop: string = '0px';
  export let marginBottom: string = '0px';
  export let showTextColor: boolean = true;
  export let showMargins: boolean = true;
  export let colorLabel: string = 'Warna Teks (Token)';
  export let onColorChange: (val: string) => void = () => {};
  export let onMarginTopChange: (val: string) => void = () => {};
  export let onMarginBottomChange: (val: string) => void = () => {};

  $: activePreview = textColorOptions.find((o) => o.value === color)?.preview || (color ? color : '#94a3b8');
</script>

<div class="space-y-3 pt-2.5 border-t border-base-200">
  {#if showTextColor}
    <div class="space-y-1">
      <label class="block font-semibold text-xs text-base-content/80" for="node-color-token">
        {colorLabel}
      </label>
      <div class="flex items-center gap-2">
        <span
          class="w-4 h-4 rounded-full border border-base-300 shrink-0 shadow-2xs"
          style="background-color: {activePreview};"
        ></span>
        <select
          id="node-color-token"
          value={color}
          on:change={(e) => onColorChange(e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs text-base-content focus:outline-none focus:border-primary"
        >
          {#each textColorOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>
    </div>
  {/if}

  {#if showMargins}
    <div class="grid grid-cols-2 gap-2">
    <div class="space-y-1">
      <label class="block font-semibold text-xs text-base-content/80" for="node-margin-top">
        Margin Atas (8pt)
      </label>
      <select
        id="node-margin-top"
        value={marginTop || '0px'}
        on:change={(e) => onMarginTopChange(e.currentTarget.value)}
        class="w-full px-2 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs text-base-content focus:outline-none focus:border-primary"
      >
        {#each marginOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
    <div class="space-y-1">
      <label class="block font-semibold text-xs text-base-content/80" for="node-margin-bottom">
        Margin Bawah (8pt)
      </label>
      <select
        id="node-margin-bottom"
        value={marginBottom || '0px'}
        on:change={(e) => onMarginBottomChange(e.currentTarget.value)}
        class="w-full px-2 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs text-base-content focus:outline-none focus:border-primary"
      >
        {#each marginOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
  </div>
  {/if}
</div>
