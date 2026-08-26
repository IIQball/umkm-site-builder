<script lang="ts">
  import { AlertOctagon, X } from 'lucide-svelte';
  import type { TemplateItem } from '@/types/templates';

  export let isOpen: boolean;
  export let template: TemplateItem | null;
  export let onClose: () => void;
</script>

{#if isOpen && template}
  <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div
      class="bg-card border border-light w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 animate-scale-in"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-center justify-between border-b border-light pb-3">
        <div class="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
          <AlertOctagon size={18} />
          <h3 class="font-bold text-sm text-main">Alasan Penolakan Template</h3>
        </div>
        <button
          type="button"
          on:click={onClose}
          class="p-1 rounded-lg text-muted hover:text-main hover:bg-nested transition-colors cursor-pointer"
          aria-label="Tutup modal"
        >
          <X size={18} />
        </button>
      </div>

      <div class="space-y-2">
        <h4 class="font-bold text-xs text-main">{template.name}</h4>
        <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs leading-relaxed">
          <p>{template.rejectionReason || 'Tidak ada catatan alasan penolakan dari admin.'}</p>
        </div>
      </div>

      <div class="flex justify-end pt-3 border-t border-light">
        <button
          type="button"
          on:click={onClose}
          class="px-4 py-2 rounded-xl text-xs font-bold bg-nested border border-light text-secondary hover:text-main hover:bg-nested/80 transition-colors cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
{/if}
