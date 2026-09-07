<script lang="ts">
  import {
    Loader2,
    Palette,
    Sparkles,
    ShoppingBag,
    Store,
    Check,
  } from 'lucide-svelte';
  import ConfirmTemplateModal from './ConfirmTemplateModal.svelte';
  import { Badge, Button } from '@/components/ui';
  import { toast } from '@/lib/toast';

  export let storeId = '';
  export let currentTemplateId = '';

  type TemplateItem = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    thumbnailUrl: string | null;
    designerName: string;
    isFree?: boolean;
    acquiredAt?: string | Date | null;
  };

  let templates: TemplateItem[] = [];
  let loading = true;
  let error = '';
  let applyingId = '';

  let modalOpen = false;
  let pendingTemplateId = '';
  let pendingTemplateName = '';

  $: currentTemplateName = templates.find((t) => t.id === currentTemplateId)?.name || '';

  async function fetchTemplates() {
    loading = true;
    error = '';
    try {
      const res = await fetch('/api/tenant/templates');
      if (!res.ok) {
        throw new Error('Gagal memuat template milik Anda');
      }
      const result = await res.json();
      templates = result.data?.templates || result.templates || [];
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Terjadi kesalahan saat memuat template';
    } finally {
      loading = false;
    }
  }

  function requestApply(id: string, name: string) {
    pendingTemplateId = id;
    pendingTemplateName = name;
    modalOpen = true;
  }

  async function handleConfirmApply() {
    if (!pendingTemplateId || !storeId) return;

    applyingId = pendingTemplateId;
    modalOpen = false;

    try {
      const res = await fetch(`/api/stores/${storeId}/apply-template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: pendingTemplateId }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error?.message || 'Gagal menerapkan template');
      }

      currentTemplateId = pendingTemplateId;
      toast.success(`Template "${pendingTemplateName}" berhasil diterapkan ke toko Anda!`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Gagal menerapkan template';
      toast.error(msg);
    } finally {
      applyingId = '';
      pendingTemplateId = '';
      pendingTemplateName = '';
    }
  }

  function handleCancelApply() {
    modalOpen = false;
    pendingTemplateId = '';
    pendingTemplateName = '';
  }

  fetchTemplates();
</script>

<div class="space-y-6">
  {#if loading}
    <div class="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-light text-center">
      <Loader2 size={36} class="animate-spin text-primary mb-3" />
      <p class="text-sm font-semibold text-main font-heading">Memuat Koleksi Desain Toko...</p>
      <p class="text-xs text-secondary mt-1">Mengambil daftar template yang telah Anda miliki</p>
    </div>
  {:else if error}
    <div class="p-8 bg-error/10 border border-error/20 rounded-3xl text-center space-y-3">
      <p class="text-xs font-semibold text-error">{error}</p>
      <Button variant="secondary" size="sm" on:click={fetchTemplates}>
        <span>Coba Lagi</span>
      </Button>
    </div>
  {:else if templates.length === 0}
    <!-- Empty State: No Owned Templates -->
    <div class="bg-card border border-light rounded-3xl p-10 sm:p-12 text-center space-y-4 shadow-xs">
      <div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-2xs">
        <ShoppingBag size={32} />
      </div>
      <div class="max-w-md mx-auto space-y-1.5">
        <h3 class="text-heading-md font-bold text-main font-heading">
          Belum Ada Template Milik Anda
        </h3>
        <p class="text-body-sm text-secondary leading-relaxed">
          Anda belum memiliki template desain. Jelajahi katalog marketplace kami untuk menemukan dan membeli tema yang cocok untuk toko UMKM Anda.
        </p>
      </div>
      <div class="pt-2 flex justify-center">
        <Button href="/templates" variant="primary" size="md" className="font-bold">
          <Palette size={16} />
          <span>Jelajahi Marketplace Template</span>
        </Button>
      </div>
    </div>
  {:else}
    <!-- Templates Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each templates as tpl (tpl.id)}
        {@const isActive = currentTemplateId === tpl.id}
        <div
          class="bg-card border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
          class:border-primary={isActive}
          class:ring-2={isActive}
          class:ring-primary={isActive}
          class:border-light={!isActive}
        >
          <!-- Thumbnail Mockup (16:9) -->
          <div class="relative aspect-video w-full bg-nested overflow-hidden border-b border-light">
            {#if tpl.thumbnailUrl}
              <img
                src={tpl.thumbnailUrl}
                alt={tpl.name}
                class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                loading="lazy"
              />
            {:else}
              <div class="flex flex-col items-center justify-center w-full h-full text-secondary gap-1.5 bg-nested">
                <Store size={36} class="text-primary/60" />
                <span class="text-2xs font-medium">Tema Toko UMKM</span>
              </div>
            {/if}

            <!-- Badges -->
            <div class="absolute top-3 right-3 flex items-center gap-1.5">
              {#if isActive}
                <Badge variant="emerald" dot size="sm">
                  Aktif Digunakan
                </Badge>
              {:else if tpl.isFree}
                <Badge variant="sky" size="sm">
                  Gratis
                </Badge>
              {:else}
                <Badge variant="secondary" size="sm">
                  Sudah Dimiliki
                </Badge>
              {/if}
            </div>
          </div>

          <!-- Content Body -->
          <div class="p-5 flex-1 flex flex-col justify-between gap-4">
            <div class="space-y-1.5">
              <h3 class="font-heading font-bold text-base text-main leading-snug line-clamp-1">
                {tpl.name}
              </h3>
              {#if tpl.description}
                <p class="text-xs text-secondary line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
              {/if}
              <div class="pt-1 flex items-center justify-between text-2xs text-secondary font-medium">
                <span>Kreator: <strong class="text-main font-semibold">{tpl.designerName}</strong></span>
                <span class="text-emerald-600 dark:text-emerald-400 font-bold">Lisensi Aktif</span>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="pt-2 border-t border-light">
              {#if isActive}
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  disabled
                  className="font-bold text-xs"
                >
                  <Check size={14} class="text-emerald-500" />
                  <span>Sedang Aktif di Toko</span>
                </Button>
              {:else}
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  disabled={!!applyingId}
                  loading={applyingId === tpl.id}
                  className="font-bold text-xs shadow-2xs"
                  on:click={() => requestApply(tpl.id, tpl.name)}
                >
                  <Sparkles size={14} />
                  <span>Terapkan ke Toko</span>
                </Button>
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
  on:confirm={handleConfirmApply}
  on:cancel={handleCancelApply}
/>
