<script lang="ts">
  import { Trash2, Ban, CheckCircle2 } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';
  import type { ConfirmModalState } from './whitelist.types';
  import { Button } from '@/components/ui';

  export let modalState: ConfirmModalState | null = null;
  export let isActionLoading = false;

  const dispatch = createEventDispatcher<{
    close: void;
    confirm: void;
  }>();

  const close = () => dispatch('close');
  const confirm = () => dispatch('confirm');
</script>

{#if modalState}
  <div class="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-nested/80 backdrop-blur-sm" on:click={close} on:keydown={(e) => e.key === 'Escape' && close()} role="button" tabindex="0"></div>
    <div class="relative bg-card w-full max-w-sm rounded-3xl shadow-2xl border border-light p-6 text-center animate-scale-up">
      <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 {modalState.type === 'remove' ? 'bg-error/10 text-error' : (modalState.currentStatus === 'active' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success')}">
        {#if modalState.type === 'remove'}
          <Trash2 size={32} />
        {:else if modalState.currentStatus === 'active'}
          <Ban size={32} />
        {:else}
          <CheckCircle2 size={32} />
        {/if}
      </div>

      <h3 class="font-black text-xl text-main mb-2">
        {#if modalState.type === 'remove'}
          Hapus Permanen?
        {:else if modalState.currentStatus === 'active'}
          Blokir Akses?
        {:else}
          Aktifkan Kembali?
        {/if}
      </h3>

      <p class="text-sm text-secondary mb-6 leading-relaxed">
        {#if modalState.type === 'remove'}
          Anda akan menghapus profil <strong class="text-main">{modalState.adminName}</strong> secara permanen. Semua data akses tidak dapat dikembalikan.
        {:else if modalState.currentStatus === 'active'}
          Akses <strong class="text-main">{modalState.adminName}</strong> akan diblokir sementara. Mereka tidak akan dapat masuk ke sistem.
        {:else}
          Akses <strong class="text-main">{modalState.adminName}</strong> akan dipulihkan. Mereka dapat masuk ke sistem kembali menggunakan sandi lama.
        {/if}
      </p>

      <div class="flex gap-3">
        <Button
          variant="secondary"
          size="md"
          className="flex-1 font-bold"
          disabled={isActionLoading}
          on:click={close}
        >
          Batal
        </Button>
        
        {#if modalState.type === 'remove'}
          <Button
            variant="destructive"
            size="md"
            className="flex-1 font-bold"
            disabled={isActionLoading}
            loading={isActionLoading}
            on:click={confirm}
          >
            Hapus
          </Button>
        {:else}
          <Button
            variant={modalState.currentStatus === 'active' ? 'orange' : 'primary'}
            size="md"
            className="flex-1 font-bold {modalState.currentStatus !== 'active' ? '!bg-emerald-600 hover:!bg-emerald-700' : ''}"
            disabled={isActionLoading}
            loading={isActionLoading}
            on:click={confirm}
          >
            {modalState.currentStatus === 'active' ? 'Blokir' : 'Aktifkan'}
          </Button>
        {/if}
      </div>
    </div>
  </div>
{/if}
