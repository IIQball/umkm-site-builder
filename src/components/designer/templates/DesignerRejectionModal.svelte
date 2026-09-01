<script lang="ts">
  import { Modal, Button } from '@/components/ui';

  export let selectedRejection: { name: string; reason: string } | null = null;
  export let onClose: () => void;
</script>

<Modal
  open={!!selectedRejection}
  size="sm"
  on:close={onClose}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/25 text-rose-500 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">feedback</span>
      </div>
      <div>
        <h3 class="text-base font-extrabold text-main font-heading leading-tight">
          Catatan Kurasi Admin
        </h3>
        <p class="text-2xs text-muted mt-0.5 truncate max-w-[200px]">
          {selectedRejection?.name}
        </p>
      </div>
    </div>
  </svelte:fragment>

  <div class="space-y-4 pt-1">
    <div class="p-4 rounded-2xl bg-nested border border-light text-xs text-main leading-relaxed font-sans whitespace-pre-wrap">
      {selectedRejection?.reason}
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Button
        variant="secondary"
        size="sm"
        className="rounded-xl font-bold"
        on:click={onClose}
      >
        Tutup
      </Button>
    </div>
  </div>
</Modal>
