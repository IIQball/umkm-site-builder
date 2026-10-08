<script lang="ts">
  import { Input, Button } from '@/components/ui';
  import { formatCurrencyInput, parseCurrencyInput } from '@/lib/currency';

  export let platformFeePercentage: number = 30;
  export let adminServiceFee: number = 5000;
  export let settlementDelayDays: number = 7;
  export let maxStoreBranches: number = 5;
  export let maxTemplateRevisions: number = 3;
  export let isLoading: boolean = false;

  let displayFee: string = formatCurrencyInput(adminServiceFee) || '0';

  $: {
    const parsed = parseCurrencyInput(displayFee);
    if (parsed !== adminServiceFee) {
      displayFee = adminServiceFee === 0 ? '0' : formatCurrencyInput(adminServiceFee);
    }
  }

  const handleFeeInput = (e: Event) => {
    const nativeEvent = (e as CustomEvent).detail || e;
    const target = (nativeEvent.target || e.target) as HTMLInputElement;
    const val = target ? target.value : '';
    const cleanDigits = val.replace(/\D/g, '');
    const num = Number(cleanDigits) || 0;
    adminServiceFee = num;
    displayFee = cleanDigits ? formatCurrencyInput(cleanDigits) : '';
    if (target) {
      target.value = displayFee;
    }
  };

  const setFeePreset = (val: number) => {
    adminServiceFee = val;
    displayFee = val === 0 ? '0' : formatCurrencyInput(val);
  };
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- Platform Fee Input -->
  <div class="p-5 rounded-3xl bg-card border border-light space-y-3 shadow-2xs">
    <div class="flex items-center gap-2">
      <div class="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <span class="material-symbols-outlined text-sm">percent</span>
      </div>
      <span class="text-xs font-bold text-main font-heading">Potongan Fee Platform</span>
    </div>
    <Input
      id="platformFeePercentage"
      type="number"
      min="0"
      max="100"
      step="1"
      placeholder="30"
      bind:value={platformFeePercentage}
      disabled={isLoading}
      className="font-bold text-sm"
      helper="Persentase potongan kas SaaS."
    >
      <span slot="suffix" class="font-bold text-sm text-muted select-none">%</span>
    </Input>
    <input
      type="range"
      min="0"
      max="100"
      step="1"
      bind:value={platformFeePercentage}
      disabled={isLoading}
      class="w-full accent-primary cursor-pointer h-2 bg-nested rounded-lg"
    />
  </div>

  <!-- Admin Service Fee Input -->
  <div class="p-5 rounded-3xl bg-card border border-light space-y-3 shadow-2xs">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-info/15 text-info flex items-center justify-center">
          <span class="material-symbols-outlined text-sm">support_agent</span>
        </div>
        <span class="text-xs font-bold text-main font-heading">Fee Pendampingan Admin</span>
      </div>
      <div class="flex items-center gap-1">
        <Button
          size="xs"
          variant={adminServiceFee === 0 ? 'primary' : 'secondary'}
          class="!px-2 !py-0.5 !rounded-full !h-auto !min-h-0 text-xs font-bold {adminServiceFee === 0 ? 'shadow-2xs' : 'bg-nested text-muted border-light'}"
          on:click={() => setFeePreset(0)}
        >
          0
        </Button>
        <Button
          size="xs"
          variant={adminServiceFee === 5000 ? 'primary' : 'secondary'}
          class="!px-2 !py-0.5 !rounded-full !h-auto !min-h-0 text-xs font-bold {adminServiceFee === 5000 ? 'shadow-2xs' : 'bg-nested text-muted border-light'}"
          on:click={() => setFeePreset(5000)}
        >
          5rb
        </Button>
        <Button
          size="xs"
          variant={adminServiceFee === 10000 ? 'primary' : 'secondary'}
          class="!px-2 !py-0.5 !rounded-full !h-auto !min-h-0 text-xs font-bold {adminServiceFee === 10000 ? 'shadow-2xs' : 'bg-nested text-muted border-light'}"
          on:click={() => setFeePreset(10000)}
        >
          10rb
        </Button>
      </div>
    </div>
    <Input
      id="adminServiceFee"
      type="text"
      inputmode="numeric"
      placeholder="5.000"
      value={displayFee}
      on:input={handleFeeInput}
      disabled={isLoading}
      className="font-bold text-sm font-mono"
      helper="Jasa admin saat membelikan template tenant."
    >
      <span slot="prefix" class="font-bold text-xs text-muted select-none">Rp</span>
    </Input>
  </div>

  <!-- Settlement Delay Input -->
  <div class="p-5 rounded-3xl bg-card border border-light space-y-3 shadow-2xs">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-orange/15 text-orange flex items-center justify-center">
          <span class="material-symbols-outlined text-sm">hourglass_top</span>
        </div>
        <span class="text-xs font-bold text-main font-heading">Penahanan Settlement</span>
      </div>
      <div class="flex items-center gap-1">
        <Button
          size="xs"
          variant={settlementDelayDays === 3 ? 'orange' : 'secondary'}
          class="!px-2 !py-0.5 !rounded-full !h-auto !min-h-0 text-xs font-bold {settlementDelayDays === 3 ? 'shadow-2xs' : 'bg-nested text-muted border-light'}"
          on:click={() => (settlementDelayDays = 3)}
        >
          3H
        </Button>
        <Button
          size="xs"
          variant={settlementDelayDays === 7 ? 'orange' : 'secondary'}
          class="!px-2 !py-0.5 !rounded-full !h-auto !min-h-0 text-xs font-bold {settlementDelayDays === 7 ? 'shadow-2xs' : 'bg-nested text-muted border-light'}"
          on:click={() => (settlementDelayDays = 7)}
        >
          7H
        </Button>
        <Button
          size="xs"
          variant={settlementDelayDays === 14 ? 'orange' : 'secondary'}
          class="!px-2 !py-0.5 !rounded-full !h-auto !min-h-0 text-xs font-bold {settlementDelayDays === 14 ? 'shadow-2xs' : 'bg-nested text-muted border-light'}"
          on:click={() => (settlementDelayDays = 14)}
        >
          14H
        </Button>
      </div>
    </div>
    <Input
      id="settlementDelayDays"
      type="number"
      min="0"
      step="1"
      placeholder="7"
      bind:value={settlementDelayDays}
      disabled={isLoading}
      className="font-bold text-sm"
      helper="Jeda saldo sebelum dapat di-withdraw."
    >
      <span slot="suffix" class="font-bold text-xs text-muted select-none">Hari</span>
    </Input>
  </div>

  <!-- Max Store Branches Input -->
  <div class="p-5 rounded-3xl bg-card border border-light space-y-3 shadow-2xs">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <span class="material-symbols-outlined text-sm">store</span>
        </div>
        <span class="text-xs font-bold text-main font-heading">Maksimal Cabang Toko</span>
      </div>
      <div class="flex items-center gap-1">
        <Button
          size="xs"
          variant={maxStoreBranches === 3 ? 'primary' : 'secondary'}
          class="!px-2 !py-0.5 !rounded-full !h-auto !min-h-0 text-xs font-bold {maxStoreBranches === 3 ? 'shadow-2xs' : 'bg-nested text-muted border-light'}"
          on:click={() => (maxStoreBranches = 3)}
        >
          3
        </Button>
        <Button
          size="xs"
          variant={maxStoreBranches === 5 ? 'primary' : 'secondary'}
          class="!px-2 !py-0.5 !rounded-full !h-auto !min-h-0 text-xs font-bold {maxStoreBranches === 5 ? 'shadow-2xs' : 'bg-nested text-muted border-light'}"
          on:click={() => (maxStoreBranches = 5)}
        >
          5
        </Button>
        <Button
          size="xs"
          variant={maxStoreBranches === 10 ? 'primary' : 'secondary'}
          class="!px-2 !py-0.5 !rounded-full !h-auto !min-h-0 text-xs font-bold {maxStoreBranches === 10 ? 'shadow-2xs' : 'bg-nested text-muted border-light'}"
          on:click={() => (maxStoreBranches = 10)}
        >
          10
        </Button>
      </div>
    </div>
    <Input
      id="maxStoreBranches"
      type="number"
      min="1"
      max="50"
      step="1"
      placeholder="5"
      bind:value={maxStoreBranches}
      disabled={isLoading}
      className="font-bold text-sm"
      helper="Batas cabang Toko."
    >
      <span slot="suffix" class="font-bold text-xs text-muted select-none">Cabang</span>
    </Input>
  </div>

  <!-- Max Template Revisions Input -->
  <div class="p-5 rounded-3xl bg-card border border-light space-y-3 shadow-2xs">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-warning/15 text-warning flex items-center justify-center">
          <span class="material-symbols-outlined text-sm">history_edu</span>
        </div>
        <span class="text-xs font-bold text-main font-heading">Batas Pengajuan Revisi Template</span>
      </div>
      <div class="flex items-center gap-1">
        <Button
          size="xs"
          variant={maxTemplateRevisions === 3 ? 'primary' : 'secondary'}
          class="!px-2 !py-0.5 !rounded-full !h-auto !min-h-0 text-xs font-bold {maxTemplateRevisions === 3 ? 'shadow-2xs' : 'bg-nested text-muted border-light'}"
          on:click={() => (maxTemplateRevisions = 3)}
        >
          3
        </Button>
        <Button
          size="xs"
          variant={maxTemplateRevisions === 5 ? 'primary' : 'secondary'}
          class="!px-2 !py-0.5 !rounded-full !h-auto !min-h-0 text-xs font-bold {maxTemplateRevisions === 5 ? 'shadow-2xs' : 'bg-nested text-muted border-light'}"
          on:click={() => (maxTemplateRevisions = 5)}
        >
          5
        </Button>
        <Button
          size="xs"
          variant={maxTemplateRevisions === 10 ? 'primary' : 'secondary'}
          class="!px-2 !py-0.5 !rounded-full !h-auto !min-h-0 text-xs font-bold {maxTemplateRevisions === 10 ? 'shadow-2xs' : 'bg-nested text-muted border-light'}"
          on:click={() => (maxTemplateRevisions = 10)}
        >
          10
        </Button>
      </div>
    </div>
    <Input
      id="maxTemplateRevisions"
      type="number"
      min="1"
      max="20"
      step="1"
      placeholder="3"
      bind:value={maxTemplateRevisions}
      disabled={isLoading}
      className="font-bold text-sm"
      helper="Batas maksimal pengajuan revisi desain template."
    >
      <span slot="suffix" class="font-bold text-xs text-muted select-none">Kali</span>
    </Input>
  </div>
</div>
