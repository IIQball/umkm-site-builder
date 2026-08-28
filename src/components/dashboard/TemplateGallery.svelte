<script lang="ts">
  import { Loader2, CheckCircle, AlertCircle, Palette, Eye, Sparkles } from 'lucide-svelte';
  import ConfirmTemplateModal from './ConfirmTemplateModal.svelte';

  export let storeId = '';
  export let currentTemplateId = '';

  type TemplateItem = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    thumbnailUrl: string | null;
    designerName: string;
  };

  let templates: TemplateItem[] = [];
  let loading = true;
  let error = '';
  let applyingId = '';
  let toastStatus: 'idle' | 'success' | 'error' = 'idle';
  let toastMessage = '';

  let modalOpen = false;
  let pendingTemplateId = '';
  let pendingTemplateName = '';

  $: currentTemplateName = templates.find((t) => t.id === currentTemplateId)?.name || '';

  async function fetchTemplates() {
    loading = true;
    error = '';
    try {
      const res = await fetch('/api/public/templates');
      const data = await res.json();
      if (data.ok) {
        templates = data.data;
      } else {
        error = data.error?.message || 'Gagal memuat template';
      }
    } catch {
      error = 'Gagal memuat data template';
    } finally {
      loading = false;
    }
  }

  function requestApply(templateId: string, templateName: string) {
    pendingTemplateId = templateId;
    pendingTemplateName = templateName;
    modalOpen = true;
  }

  async function confirmApply() {
    if (applyingId) return;
    const templateId = pendingTemplateId;
    applyingId = templateId;
    toastStatus = 'idle';

    try {
      const res = await fetch(`/api/stores/${storeId}/apply-template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      });

      if (res.status === 401) {
        window.location.href = '/auth/login';
        return;
      }

      const data = await res.json();

      if (data.ok || data.success) {
        currentTemplateId = templateId;
        toastStatus = 'success';
        toastMessage = data.message || 'Template berhasil diterapkan!';
      } else {
        toastStatus = 'error';
        toastMessage = data.message || data.error?.message || 'Gagal menerapkan template';
      }
    } catch {
      toastStatus = 'error';
      toastMessage = 'Terjadi kesalahan jaringan';
    } finally {
      applyingId = '';
      modalOpen = false;
      pendingTemplateId = '';
      pendingTemplateName = '';
      setTimeout(() => { toastStatus = 'idle'; }, 4000);
    }
  }

  function cancelApply() {
    modalOpen = false;
    pendingTemplateId = '';
    pendingTemplateName = '';
  }

  function formatPrice(price: number): string {
    if (price === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  }

  fetchTemplates();
</script>

<div class="space-y-6">
  {#if toastStatus === 'success'}
    <div class="alert alert-success text-sm">
      <CheckCircle size={16} />
      <span>{toastMessage}</span>
    </div>
  {:else if toastStatus === 'error'}
    <div class="alert alert-error text-sm">
      <AlertCircle size={16} />
      <span>{toastMessage}</span>
    </div>
  {/if}

  {#if loading}
    <div class="flex items-center justify-center py-16">
      <Loader2 size={32} class="animate-spin text-primary" />
      <span class="ml-3 text-base-content/60">Memuat template...</span>
    </div>
  {:else if error}
    <div class="alert alert-error">
      <AlertCircle size={18} />
      <span>{error}</span>
      <button class="btn btn-sm btn-ghost" on:click={fetchTemplates}>Coba Lagi</button>
    </div>
  {:else if templates.length === 0}
    <div class="text-center py-16">
      <Palette size={48} class="mx-auto text-base-content/20 mb-4" />
      <p class="text-lg font-medium text-base-content/60">Belum ada template tersedia</p>
      <p class="text-sm text-base-content/40 mt-1">Template akan muncul setelah disetujui oleh admin</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each templates as tpl (tpl.id)}
        <div
          class="card bg-card border border-border shadow-md hover:shadow-lg transition-shadow rounded-2xl overflow-hidden"
          class:ring-2={currentTemplateId === tpl.id}
          class:ring-primary={currentTemplateId === tpl.id}
        >
          <figure class="relative h-48 bg-base-200 overflow-hidden">
            {#if tpl.thumbnailUrl}
              <img
                src={tpl.thumbnailUrl}
                alt={tpl.name}
                class="w-full h-full object-cover"
                loading="lazy"
              />
            {:else}
              <div class="flex items-center justify-center w-full h-full">
                <Palette size={40} class="text-base-content/15" />
              </div>
            {/if}
            {#if currentTemplateId === tpl.id}
              <div class="absolute top-2 right-2 badge badge-primary gap-1">
                <CheckCircle size={12} />
                Aktif
              </div>
            {/if}
            {#if tpl.price === 0}
              <div class="absolute top-2 left-2 badge badge-success gap-1">
                <Sparkles size={12} />
                Gratis
              </div>
            {/if}
          </figure>

          <div class="card-body p-4 gap-2">
            <h3 class="card-title text-base font-semibold line-clamp-1">{tpl.name}</h3>
            {#if tpl.description}
              <p class="text-sm text-base-content/60 line-clamp-2">{tpl.description}</p>
            {/if}
            <div class="flex items-center justify-between mt-1">
              <span class="text-xs text-base-content/40">oleh {tpl.designerName}</span>
              <span class="text-sm font-semibold" class:text-success={tpl.price === 0}>
                {formatPrice(tpl.price)}
              </span>
            </div>

            <div class="card-actions mt-3">
              {#if currentTemplateId === tpl.id}
                <button class="btn btn-sm btn-outline btn-primary w-full" disabled>
                  <CheckCircle size={14} />
                  Sedang Digunakan
                </button>
              {:else}
                <button
                  class="btn btn-sm btn-primary w-full"
                  disabled={!!applyingId}
                  on:click={() => requestApply(tpl.id, tpl.name)}
                >
                  {#if applyingId === tpl.id}
                    <Loader2 size={14} class="animate-spin" />
                    Menerapkan...
                  {:else}
                    <Eye size={14} />
                    Terapkan Template
                  {/if}
                </button>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<ConfirmTemplateModal
  open={modalOpen}
  templateName={pendingTemplateName}
  {currentTemplateName}
  loading={!!applyingId}
  on:confirm={confirmApply}
  on:cancel={cancelApply}
/>
