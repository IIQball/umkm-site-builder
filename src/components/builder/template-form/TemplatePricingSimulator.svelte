<script lang="ts">
  import { Input, Button } from '@/components/ui';
  import { formatIDR, formatCurrencyInput, parseCurrencyInput } from '@/lib/currency';

  export let numericPriceState: number = 50000;
  export let priceDisplay: string = '50.000';
  export let pricePreview: string = 'Rp 50.000';
  export let loading: boolean = false;
  export let platformFeePercentage: number = 30;
  export let designerPercentage: number = 70;
  export let onPriceInput: ((e: Event) => void) | undefined = undefined;
  export let onSelectPricePreset: ((val: number) => void) | undefined = undefined;

  $: designerShare = Math.round(numericPriceState * (designerPercentage / 100));
  $: platformShare = numericPriceState - designerShare;
  $: pricePreview = numericPriceState > 0 ? formatIDR(numericPriceState) : 'Gratis';

  $: {
    const currentParsed = parseCurrencyInput(priceDisplay);
    if (currentParsed !== numericPriceState) {
      priceDisplay = numericPriceState === 0 ? '0' : formatCurrencyInput(numericPriceState);
    }
  }

  const handleInput = (e: Event) => {
    const nativeEvent = (e as CustomEvent).detail || e;
    const target = (nativeEvent.target || e.target) as HTMLInputElement;
    const val = target ? target.value : '';
    const cleanDigits = val.replace(/\D/g, '');
    const num = Number(cleanDigits) || 0;
    numericPriceState = num;
    priceDisplay = cleanDigits ? formatCurrencyInput(cleanDigits) : '';
    if (target) {
      target.value = priceDisplay;
    }
    if (onPriceInput) {
      onPriceInput(e);
    }
  };

  const handleSelectPreset = (val: number) => {
    numericPriceState = val;
    priceDisplay = val === 0 ? '0' : formatCurrencyInput(val);
    if (onSelectPricePreset) {
      onSelectPricePreset(val);
    }
  };
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
    type="text"
    inputmode="numeric"
    value={priceDisplay}
    on:input={handleInput}
    disabled={loading}
    className="font-mono font-bold text-sm"
  >
    <span slot="prefix" class="text-xs font-bold text-muted select-none">Rp</span>
  </Input>

  <!-- Quick Preset Price Chips -->
  <div class="flex items-center gap-2 pt-1">
    <Button
      type="button"
      size="xs"
      variant={numericPriceState === 0 ? 'primary' : 'outline'}
      on:click={() => handleSelectPreset(0)}
      class="!px-2.5 !py-1 !h-auto !min-h-0 text-2xs font-bold {numericPriceState === 0
        ? '!bg-emerald-500 !text-white !border-emerald-500'
        : ''}"
    >
      Gratis (Rp 0)
    </Button>
    <Button
      type="button"
      size="xs"
      variant={numericPriceState === 25000 ? 'primary' : 'outline'}
      on:click={() => handleSelectPreset(25000)}
      class="!px-2.5 !py-1 !h-auto !min-h-0 text-2xs font-bold"
    >
      Rp 25.000
    </Button>
    <Button
      type="button"
      size="xs"
      variant={numericPriceState === 50000 ? 'primary' : 'outline'}
      on:click={() => handleSelectPreset(50000)}
      class="!px-2.5 !py-1 !h-auto !min-h-0 text-2xs font-bold"
    >
      Rp 50.000
    </Button>
    <Button
      type="button"
      size="xs"
      variant={numericPriceState === 100000 ? 'primary' : 'outline'}
      on:click={() => handleSelectPreset(100000)}
      class="!px-2.5 !py-1 !h-auto !min-h-0 text-2xs font-bold"
    >
      Rp 100.000
    </Button>
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
  {:else}
    <div class="pt-2 border-t border-light text-center py-1.5 text-2xs text-muted font-sans bg-card/60 rounded-xl border border-light">
      Template gratis tidak dikenakan fee platform dan tidak menghasilkan komisi penjualan.
    </div>
  {/if}
</div>
