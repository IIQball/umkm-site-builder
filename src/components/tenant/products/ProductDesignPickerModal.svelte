<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { X, Image } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import { apiFetch } from '@/lib/api/parse-response';
  import { getWebpProductUrl } from '@/components/tenant/ai-studio/gallery-download.helpers';
  import type { AiAssetItem } from '@/components/tenant/ai-studio/gallery.constants';

  export let open: boolean = false;
  export let filterType: 'packaging_mockup' | 'logo' | 'product_poster' | 'all' = 'all';
  export let title: string = 'Pilih dari Galeri Desain AI';
  export let description: string = 'Klik salah satu gambar untuk langsung memasangnya ke produk (format WebP)';

  const dispatch = createEventDispatcher<{
    select: string;
    close: void;
  }>();

  let assets: AiAssetItem[] = [];
  let loading = false;

  $: displayedAssets = filterType !== 'all'
    ? assets.filter((a) => a.featureType === filterType)
    : assets;

  async function loadGallery() {
    loading = true;
    try {
      const res = await apiFetch<AiAssetItem[] | { items?: AiAssetItem[] }>('/api/tenant/ai/history');
      if (res.success && res.data) {
        assets = Array.isArray(res.data) ? res.data : (res.data.items || []);
      }
    } catch {
      // offline fallback
    } finally {
      loading = false;
    }
  }

  function handleSelect(asset: AiAssetItem) {
    const webpUrl = getWebpProductUrl(asset.cloudinaryUrl);
    dispatch('select', webpUrl);
    handleClose();
  }

  function handleClose() {
    open = false;
    dispatch('close');
  }

  $: if (open && assets.length === 0) {
    loadGallery();
  }

  onMount(() => {
    if (open) loadGallery();
  });
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    on:keydown={(e) => (e.key === 'Escape') && handleClose()}
    on:click|self={handleClose}
  >
    <div class="relative w-full max-w-3xl max-h-[85vh] bg-card border border-light rounded-3xl p-5 shadow-2xl flex flex-col space-y-4 overflow-hidden">
      <!-- Header Ringkas -->
      <div class="flex items-center justify-between pb-3 border-b border-light">
        <div>
          <h3 class="font-heading font-bold text-base text-main">
            {title}
          </h3>
          <p class="text-2xs text-secondary">
            {description}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          class="w-8 h-8 rounded-full bg-nested hover:bg-card border border-light text-muted hover:text-main"
          on:click={handleClose}
          aria-label="Tutup pemilih gambar"
        >
          <X size={16} />
        </Button>
      </div>

      <!-- Grid Kartu Gambar -->
      <div class="flex-1 overflow-y-auto pr-1">
        {#if loading}
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {#each [1, 2, 3, 4, 5, 6, 7, 8] as _}
              <div class="aspect-square bg-nested rounded-2xl animate-pulse"></div>
            {/each}
          </div>
        {:else if displayedAssets.length === 0}
          <div class="text-center py-12 text-secondary space-y-2">
            <div class="w-12 h-12 rounded-full bg-nested flex items-center justify-center mx-auto text-muted">
              <Image size={22} />
            </div>
            <p class="text-xs">
              {filterType === 'logo'
                ? 'Belum ada aset Logo di Galeri AI Studio toko Anda. Buat logo terlebih dahulu di menu AI Studio.'
                : 'Belum ada aset visual yang cocok di Galeri Desain AI toko Anda.'}
            </p>
          </div>
        {:else}
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {#each displayedAssets as asset (asset.id)}
              <div
                role="button"
                tabindex="0"
                class="group relative aspect-square rounded-2xl overflow-hidden bg-nested border-2 border-transparent hover:border-primary focus:border-primary shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
                on:click={() => handleSelect(asset)}
                on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect(asset)}
                title="Pilih gambar ini"
              >
                <img
                  src={asset.cloudinaryUrl}
                  alt="Desain AI"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span class="text-xs font-semibold text-white bg-primary px-3 py-1.5 rounded-full shadow-md">
                    Gunakan
                  </span>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
