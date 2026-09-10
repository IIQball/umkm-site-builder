<script lang="ts">
  import { Input } from '@/components/ui';

  export let platformFeePercentage: number = 30;
  export let adminServiceFee: number = 5000;
  export let settlementDelayDays: number = 7;
  export let isLoading: boolean = false;
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div class="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <span class="material-symbols-outlined text-sm">support_agent</span>
        </div>
        <span class="text-xs font-bold text-main font-heading">Fee Pendampingan Admin</span>
      </div>
      <div class="flex items-center gap-1">
        <button
          type="button"
          on:click={() => (adminServiceFee = 0)}
          class="px-2 py-0.5 rounded-full text-3xs font-bold border transition-all cursor-pointer {adminServiceFee === 0 ? 'bg-primary text-white border-primary shadow-2xs' : 'bg-nested text-muted border-light'}"
        >
          0
        </button>
        <button
          type="button"
          on:click={() => (adminServiceFee = 5000)}
          class="px-2 py-0.5 rounded-full text-3xs font-bold border transition-all cursor-pointer {adminServiceFee === 5000 ? 'bg-primary text-white border-primary shadow-2xs' : 'bg-nested text-muted border-light'}"
        >
          5rb
        </button>
        <button
          type="button"
          on:click={() => (adminServiceFee = 10000)}
          class="px-2 py-0.5 rounded-full text-3xs font-bold border transition-all cursor-pointer {adminServiceFee === 10000 ? 'bg-primary text-white border-primary shadow-2xs' : 'bg-nested text-muted border-light'}"
        >
          10rb
        </button>
      </div>
    </div>
    <Input
      id="adminServiceFee"
      type="number"
      min="0"
      step="1000"
      placeholder="5000"
      bind:value={adminServiceFee}
      disabled={isLoading}
      className="font-bold text-sm"
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
        <button
          type="button"
          on:click={() => (settlementDelayDays = 3)}
          class="px-2 py-0.5 rounded-full text-3xs font-bold border transition-all cursor-pointer {settlementDelayDays === 3 ? 'bg-orange text-white border-orange shadow-2xs' : 'bg-nested text-muted border-light'}"
        >
          3H
        </button>
        <button
          type="button"
          on:click={() => (settlementDelayDays = 7)}
          class="px-2 py-0.5 rounded-full text-3xs font-bold border transition-all cursor-pointer {settlementDelayDays === 7 ? 'bg-orange text-white border-orange shadow-2xs' : 'bg-nested text-muted border-light'}"
        >
          7H
        </button>
        <button
          type="button"
          on:click={() => (settlementDelayDays = 14)}
          class="px-2 py-0.5 rounded-full text-3xs font-bold border transition-all cursor-pointer {settlementDelayDays === 14 ? 'bg-orange text-white border-orange shadow-2xs' : 'bg-nested text-muted border-light'}"
        >
          14H
        </button>
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
</div>
