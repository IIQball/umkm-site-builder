<script lang="ts">
  import { Store, Info, Check } from 'lucide-svelte';
  import { Badge } from '@/components/ui';

  export let name: string = '';
  export let description: string = '';
  export let selectedCategoryName: string = 'Umum';
  export let thumbnailUrl: string = '';
  export let pricePreview: string = 'Gratis';
</script>

<div class="lg:col-span-5 p-6 md:p-8 bg-nested/30 flex flex-col justify-between space-y-6">
  <div>
    <div class="flex items-center gap-2 mb-4">
      <span class="material-symbols-outlined text-primary text-base">visibility</span>
      <h3 class="text-xs font-bold text-main uppercase tracking-wider font-heading">
        Pratinjau Kartu Marketplace
      </h3>
    </div>

    <!-- Live Dynamic Mockup Card -->
    <div class="bg-card border border-light rounded-3xl overflow-hidden shadow-lg relative group transition-all">
      <div class="aspect-[16/10] bg-gradient-to-br from-primary/15 via-nested to-indigo-500/10 relative overflow-hidden flex items-center justify-center border-b border-light">
        {#if thumbnailUrl}
          <img
            src={thumbnailUrl}
            alt={name || 'Thumbnail Template'}
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        {:else}
          <div class="text-center space-y-2 p-6">
            <div class="w-12 h-12 rounded-2xl bg-card border border-light flex items-center justify-center text-primary mx-auto shadow-xs">
              <Store size={24} />
            </div>
            <span class="text-3xs font-mono font-bold text-muted uppercase tracking-widest block">
              PRATINJAU VISUAL KANVAS
            </span>
          </div>
        {/if}

        <div class="absolute top-3 right-3">
          <Badge variant="slate" dot size="sm">Draft</Badge>
        </div>

        <div class="absolute bottom-3 left-3">
          <span class="px-2.5 py-1 rounded-lg text-3xs font-bold bg-card/90 backdrop-blur-md text-main border border-light shadow-2xs">
            {selectedCategoryName}
          </span>
        </div>
      </div>

      <div class="p-5 space-y-3">
        <div>
          <h4 class="font-bold text-sm text-main truncate font-heading">
            {name.trim() || 'Judul Template Desain Baru'}
          </h4>
          <p class="text-2xs text-secondary line-clamp-2 leading-relaxed mt-1 font-sans">
            {description.trim() || 'Deskripsi visual tema website toko online UMKM responsif dan modular.'}
          </p>
        </div>

        <div class="pt-3 border-t border-light flex items-center justify-between">
          <div>
            <span class="text-4xs text-muted uppercase font-bold block">Harga</span>
            <span class="font-mono text-xs font-extrabold text-main">
              {pricePreview}
            </span>
          </div>
          <div class="text-2xs font-mono font-bold text-secondary bg-nested px-2.5 py-1 rounded-lg border border-light">
            0 Terjual
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-card border border-light rounded-2xl p-4 space-y-2.5 shadow-2xs">
    <div class="flex items-center gap-2 text-xs font-bold text-main">
      <Info size={14} class="text-primary" />
      <span>Fasilitas No-Code Builder</span>
    </div>
    <ul class="text-2xs text-secondary space-y-1.5 font-sans">
      <li class="flex items-center gap-2">
        <span class="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
          <Check size={10} />
        </span>
        <span>Editor Visual drag-and-drop no-code</span>
      </li>
      <li class="flex items-center gap-2">
        <span class="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
          <Check size={10} />
        </span>
        <span>Overlay Panduan Kolom Grid Figma & Pixel Grid 8px</span>
      </li>
      <li class="flex items-center gap-2">
        <span class="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
          <Check size={10} />
        </span>
        <span>Pengajuan Review langsung ke Kurator Admin</span>
      </li>
    </ul>
  </div>
</div>
