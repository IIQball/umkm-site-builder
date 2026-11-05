<script lang="ts">
  import { Badge } from '@/components/ui';

  export let isTesting: boolean = false;
</script>

<div class="p-3 bg-warning/10 border border-warning/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
  <div class="flex items-center gap-2.5">
    <Badge variant="warning" size="sm" dot={true}>
      Developer Test Bar (?testMode=true)
    </Badge>
    <span class="text-xs text-warning font-medium hidden md:inline">
      Mode Pengujian Rahasia Aktif
    </span>
  </div>

  <label class="flex items-center gap-2 cursor-pointer select-none">
    <input
      type="checkbox"
      bind:checked={isTesting}
      class="checkbox checkbox-xs checkbox-warning rounded"
    />
    <span class="text-xs font-semibold text-main">
      Simulasi Audit (Tanpa Potong Kredit Toko)
    </span>
  </label>
</div>
