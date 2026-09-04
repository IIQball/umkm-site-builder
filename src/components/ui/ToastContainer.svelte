<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-svelte';
  import { toast } from '@/lib/toast';

  // Prevent SSR bundler warning while keeping client transitions
  const _transitions = { fade, fly };
  void _transitions;

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
      } else if (errorParam?.toLowerCase() === 'account_suspended' || errorDesc?.toLowerCase() === 'account_suspended') {
        toast.error(
          'Akun Anda telah ditangguhkan. Silakan hubungi Administrator untuk informasi lebih lanjut.',
          'Akses Ditolak'
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
        class={`alert shadow-xl flex items-center gap-3 pointer-events-auto border py-3 px-4 rounded-2xl ${
          item.type === 'success'
            ? 'bg-emerald-600 text-white border-emerald-500/30 shadow-emerald-600/20'
            : item.type === 'error'
            ? 'bg-rose-600 text-white border-rose-500/30 shadow-rose-600/20'
            : item.type === 'warning'
            ? 'bg-orange text-white border-orange-light/30 shadow-orange/20'
            : 'bg-primary text-white border-primary-light/30 shadow-primary/20'
        }`}
        role="alert"
      >
        <div class="shrink-0 flex items-center justify-center">
          {#if item.type === 'success'}
            <CheckCircle2 size={20} class="stroke-current" strokeWidth={2.5} />
          {:else if item.type === 'error'}
            <AlertCircle size={20} class="stroke-current" strokeWidth={2.5} />
          {:else if item.type === 'warning'}
            <AlertTriangle size={20} class="stroke-current" strokeWidth={2.5} />
          {:else}
            <Info size={20} class="stroke-current" strokeWidth={2.5} />
          {/if}
        </div>

        <div class="flex-1 min-w-0 flex flex-col justify-center">
          {#if item.title}
            <h4 class="font-extrabold text-sm leading-tight mb-0.5 text-white font-heading">{item.title}</h4>
          {/if}
          <p class="text-xs font-medium text-white/95 leading-normal break-words font-sans">{item.message}</p>
        </div>

        <button
          type="button"
          class="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/20 text-white shrink-0 cursor-pointer active:scale-95 transition-all"
          on:click={() => toast.remove(item.id)}
          aria-label="Tutup notifikasi"
        >
          <X size={14} />
        </button>
      </div>
    {/each}
  </div>
{/if}
