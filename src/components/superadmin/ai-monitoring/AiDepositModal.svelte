<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { toast } from '@/lib/toast';
  import { Modal, Button, Input, Badge } from '@/components/ui';
  import { DollarSign, Landmark, Info, ArrowRight, Loader2 } from 'lucide-svelte';
  import { formatCurrencyInput, parseCurrencyInput } from '@/lib/currency';

  export let isOpen = false;

  const dispatch = createEventDispatcher<{
    success: void;
    close: void;
  }>();

  let amountUsd: string | number = '';
  let displayAmountIdr = '';
  let description = '';
  let isSubmitting = false;

  // Auto-kalkulasi kurs riil (IDR per USD)
  $: numUsd = typeof amountUsd === 'number' ? amountUsd : parseFloat(String(amountUsd).replace(',', '.')) || 0;
  $: numIdr = parseCurrencyInput(displayAmountIdr);
  $: exchangeRate = numUsd > 0 && numIdr > 0 ? Math.round(numIdr / numUsd) : 0;
  $: isValid = numUsd > 0 && numIdr > 0 && exchangeRate > 0;

  const handleIdrInput = (e: Event) => {
    const nativeEvent = (e as CustomEvent<Event>).detail || e;
    const target = (nativeEvent?.target || e.target) as HTMLInputElement | null;
    const rawVal = target ? target.value : displayAmountIdr;
    const cleanDigits = String(rawVal).replace(/\D/g, '');
    displayAmountIdr = cleanDigits ? formatCurrencyInput(cleanDigits) : '';
    if (target) {
      target.value = displayAmountIdr;
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    isOpen = false;
    dispatch('close');
  };

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    isSubmitting = true;

    try {
      const response = await fetch('/api/admin/ai/deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amountUsd: numUsd,
          amountIdr: numIdr,
          description: description.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        toast.success('Deposit AI berhasil dicatat dengan kurs riil!');
        amountUsd = '';
        displayAmountIdr = '';
        description = '';
        isOpen = false;
        dispatch('success');
        dispatch('close');
      } else {
        const errorMsg = result?.error?.message || result?.message || 'Gagal mencatat deposit AI';
        toast.error(errorMsg);
      }
    } catch {
      toast.error('Terjadi kesalahan koneksi saat mencatat deposit');
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Modal bind:open={isOpen} on:close={handleClose} size="md">
  <svelte:fragment slot="header">
    <div class="flex items-center gap-2.5">
      <div class="p-2 rounded-xl bg-primary/10 text-primary">
        <Landmark size={20} />
      </div>
      <div>
        <h3 class="font-bold text-main text-base leading-snug">
          Catat Deposit Saldo AI
        </h3>
        <p class="text-xs text-secondary mt-0.5">
          Perbarui riwayat deposit operasional OpenAI dan tetapkan kurs riil sistem.
        </p>
      </div>
    </div>
  </svelte:fragment>

  <form on:submit|preventDefault={handleSubmit} class="space-y-4 py-1">
    <!-- Row: Amount USD & Amount IDR -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input
        id="amountUsd"
        label="Nominal USD ($)"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Contoh: 10.00"
        bind:value={amountUsd}
        disabled={isSubmitting}
        required
      >
        <svelte:fragment slot="prefix">
          <DollarSign size={16} />
        </svelte:fragment>
      </Input>

      <Input
        id="amountIdr"
        label="Nominal IDR (Rp)"
        type="text"
        inputmode="numeric"
        placeholder="Contoh: 162.000"
        bind:value={displayAmountIdr}
        on:input={handleIdrInput}
        disabled={isSubmitting}
        required
      >
        <svelte:fragment slot="prefix">
          <span class="text-xs font-bold text-muted">Rp</span>
        </svelte:fragment>
      </Input>
    </div>

    <!-- Live Auto-Calculation Callout -->
    <div class="rounded-xl p-3.5 border transition-all {exchangeRate > 0 ? 'bg-primary/5 border-primary/20' : 'bg-nested/30 border-light'}">
      <div class="flex items-start gap-2.5">
        <Info size={16} class="text-primary mt-0.5 shrink-0" />
        <div class="text-xs space-y-1">
          <div class="font-semibold text-main flex items-center gap-2">
            <span>Kurs Riil Dihitung:</span>
            {#if exchangeRate > 0}
              <Badge variant="primary" size="md" dot={false} class="font-mono font-bold">
                1 USD = Rp {exchangeRate.toLocaleString('id-ID')}
              </Badge>
            {:else}
              <span class="text-secondary italic text-xs">Masukkan nominal USD dan IDR</span>
            {/if}
          </div>
          <p class="text-secondary leading-relaxed">
            Kurs ini akan menjadi acuan biaya riil token untuk seluruh merchant platform hingga deposit baru dicatat.
          </p>
        </div>
      </div>
    </div>

    <!-- Description input -->
    <Input
      id="depositDescription"
      label="Keterangan / Referensi (Opsional)"
      type="text"
      placeholder="Contoh: Top-up saldo OpenAI via Visa Corporate"
      bind:value={description}
      disabled={isSubmitting}
    />

    <!-- Actions -->
    <div class="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3 border-t border-light">
      <Button
        variant="outline"
        size="md"
        type="button"
        class="w-full sm:w-auto"
        disabled={isSubmitting}
        on:click={handleClose}
      >
        Batal
      </Button>

      <Button
        variant="primary"
        size="md"
        type="submit"
        class="w-full sm:w-auto"
        disabled={!isValid || isSubmitting}
      >
        {#if isSubmitting}
          <Loader2 size={16} class="animate-spin mr-1.5" />
          Menyimpan...
        {:else}
          <ArrowRight size={16} class="mr-1.5" />
          Simpan Deposit
        {/if}
      </Button>
    </div>
  </form>
</Modal>
