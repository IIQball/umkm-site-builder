<script lang="ts">
  import { Input } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';

  export let numericPriceState: number = 50000;
  export let priceDisplay: string = '50.000';
  export let pricePreview: string = 'Rp 50.000';
  export let loading: boolean = false;
  export let platformFeePercentage: number = 30;
  export let designerPercentage: number = 70;
  export let onPriceInput: (e: Event) => void;
  export let onSelectPricePreset: (val: number) => void;

  $: designerShare = Math.round(numericPriceState * (designerPercentage / 100));
  $: platformShare = numericPriceState - designerShare;
</script>

<div class="space-y-3 bg-nested/50 border border-light rounded-2xl p-4">
  <div class="flex items-center justify-between">
    <label for="tmpl-price" class="text-label-caps text-muted font-bold">
      Harga Jual Template (IDR)
    </label>
    <span class="text-xs font-bold font-mono {numericPriceState > 0 ? 'text-success' : 'text-muted'}">
      {pricePreview}
    </span>
  </div>

  <Input
    id="tmpl-price"
    placeholder="50.000"
    value={priceDisplay}
    on:input={onPriceInput}
    disabled={loading}
    className="font-mono font-bold text-sm"
  >
    <span slot="prefix" class="text-xs font-bold text-muted select-none">Rp</span>
  </Input>

  <!-- Quick Preset Price Chips -->
  <div class="flex items-center gap-2 pt-1">
    <button
      type="button"
      on:click={() => onSelectPricePreset(0)}
      class="px-2.5 py-1 rounded-lg text-2xs font-bold border transition-all cursor-pointer {numericPriceState === 0
        ? 'bg-emerald-500 text-white border-emerald-500'
        : 'bg-card border-light text-secondary hover:text-main'}"
    >
      Gratis (Rp 0)
    </button>
    <button
      type="button"
      on:click={() => onSelectPricePreset(25000)}
      class="px-2.5 py-1 rounded-lg text-2xs font-bold border transition-all cursor-pointer {numericPriceState === 25000
        ? 'bg-primary text-white border-primary'
        : 'bg-card border-light text-secondary hover:text-main'}"
    >
      Rp 25.000
    </button>
    <button
      type="button"
      on:click={() => onSelectPricePreset(50000)}
      class="px-2.5 py-1 rounded-lg text-2xs font-bold border transition-all cursor-pointer {numericPriceState === 50000
        ? 'bg-primary text-white border-primary'
        : 'bg-card border-light text-secondary hover:text-main'}"
    >
      Rp 50.000
    </button>
    <button
      type="button"
      on:click={() => onSelectPricePreset(100000)}
      class="px-2.5 py-1 rounded-lg text-2xs font-bold border transition-all cursor-pointer {numericPriceState === 100000
        ? 'bg-primary text-white border-primary'
        : 'bg-card border-light text-secondary hover:text-main'}"
    >
      Rp 100.000
    </button>
  </div>

  <!-- Dynamic Commission Simulator -->
  {#if numericPriceState > 0}
    <div class="pt-2 border-t border-light grid grid-cols-2 gap-2 text-center text-xs font-mono">
      <div class="bg-card p-2 rounded-xl border border-emerald-500/20">
        <span class="text-[10px] text-muted block font-sans">
          Hak Desainer ({designerPercentage}%)
        </span>
        <span class="font-extrabold text-success text-xs">
          {formatIDR(designerShare)}
        </span>
      </div>
      <div class="bg-card p-2 rounded-xl border border-light">
        <span class="text-[10px] text-muted block font-sans">
          Fee Platform ({platformFeePercentage}%)
        </span>
        <span class="font-bold text-secondary text-xs">
          {formatIDR(platformShare)}
        </span>
      </div>
    </div>
  {/if}
</div>
