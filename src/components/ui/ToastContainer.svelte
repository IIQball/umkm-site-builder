<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-svelte';
  import { toast } from '@/lib/toast';

  onMount(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    const errorDesc = params.get('error_description');
    const successParam = params.get('success');
    const warningParam = params.get('warning');
    const infoParam = params.get('info');

    let shouldClean = false;

    if (errorParam || errorDesc) {
      shouldClean = true;
      const isUnauthorized =
        errorParam?.toLowerCase().includes('unauthorized') ||
        errorDesc?.toLowerCase().includes('unauthorized') ||
        errorParam?.toLowerCase().includes('unable_to_create_user') ||
        errorDesc?.toLowerCase().includes('unable_to_create_user');

      if (isUnauthorized) {
        toast.warning(
          'Akun Google ini belum terdaftar di sistem. Silakan hubungi Administrator untuk mendaftarkan akun Anda.',
          'Akses Akun Dibatasi'
        );
      } else {
        toast.error(
          errorDesc || errorParam || 'Terjadi kesalahan saat memproses permintaan.',
          'Terjadi Kesalahan'
        );
      }
    } else if (successParam) {
      shouldClean = true;
      toast.success(successParam, 'Berhasil');
    } else if (warningParam) {
      shouldClean = true;
      toast.warning(warningParam, 'Perhatian');
    } else if (infoParam) {
      shouldClean = true;
      toast.info(infoParam, 'Informasi');
    }

    if (shouldClean) {
      params.delete('error');
      params.delete('error_description');
      params.delete('success');
      params.delete('warning');
      params.delete('info');
      const query = params.toString() ? `?${params.toString()}` : '';
      const cleanUrl = `${window.location.pathname}${query}${window.location.hash}`;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  });
</script>

{#if $toast.length > 0}
  <div
    class="toast toast-top toast-end z-[9999] p-4 flex flex-col gap-2.5 max-w-sm sm:max-w-md pointer-events-none"
    aria-live="polite"
    aria-atomic="true"
  >
    {#each $toast as item (item.id)}
      <div
        in:fly={{ y: -20, duration: 250 }}
        out:fade={{ duration: 200 }}
        class={`alert shadow-2xl flex items-start gap-3 pointer-events-auto border ${
          item.type === 'success'
            ? 'alert-success border-success/30 text-success-content'
            : item.type === 'error'
            ? 'alert-error border-error/30 text-error-content'
            : item.type === 'warning'
            ? 'alert-warning border-warning/30 text-warning-content'
            : 'alert-info border-info/30 text-info-content'
        }`}
        role="alert"
      >
        <div class="shrink-0 mt-0.5">
          {#if item.type === 'success'}
            <CheckCircle2 size={20} class="stroke-current" />
          {:else if item.type === 'error'}
            <AlertCircle size={20} class="stroke-current" />
          {:else if item.type === 'warning'}
            <AlertTriangle size={20} class="stroke-current" />
          {:else}
            <Info size={20} class="stroke-current" />
          {/if}
        </div>

        <div class="flex-1 min-w-0">
          {#if item.title}
            <h4 class="font-bold text-sm leading-tight mb-0.5">{item.title}</h4>
          {/if}
          <p class="text-xs leading-relaxed opacity-95 break-words">{item.message}</p>
        </div>

        <button
          type="button"
          class="btn btn-ghost btn-xs btn-circle hover:bg-black/10 text-current shrink-0"
          on:click={() => toast.remove(item.id)}
          aria-label="Tutup notifikasi"
        >
          <X size={14} />
        </button>
      </div>
    {/each}
  </div>
{/if}
