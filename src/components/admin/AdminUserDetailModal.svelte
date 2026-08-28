<script lang="ts">
  import { Info } from 'lucide-svelte';
  import type { AdminUserItem } from '@/types';

  export let isOpen = false;
  export let selectedUser: AdminUserItem | null = null;
  export let onClose: () => void = () => {};
</script>

{#if isOpen && selectedUser}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
    <div class="bg-card w-full max-w-sm rounded-3xl shadow-xl overflow-hidden border border-light scale-100 transition-transform">
      <div class="p-6">
        <div class="w-12 h-12 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center mb-4 text-error">
          <Info size={24} />
        </div>
        <h3 class="text-lg font-black text-main mb-1">Alasan Penangguhan</h3>
        <p class="text-xs text-muted mb-4 font-medium">Informasi penangguhan untuk akun <strong>{selectedUser.name}</strong></p>
        
        <div class="bg-nested border border-light rounded-xl p-4">
          <p class="text-sm font-semibold text-main leading-relaxed whitespace-pre-wrap">{selectedUser.suspendReason}</p>
        </div>
        
        <div class="flex items-center justify-end gap-2 pt-6">
          <button
            type="button"
            class="btn btn-sm bg-nested text-secondary hover:text-main border-none font-bold rounded-xl px-4 py-2 cursor-pointer"
            on:click={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
