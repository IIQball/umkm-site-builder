<script lang="ts">
  import { Store, Image as ImageIcon, AlertTriangle, Check, ExternalLink } from 'lucide-svelte';
  import { Badge } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';

  export let templateId: string = '';
  export let templateName: string = '';
  export let templatePrice: number = 0;
  export let templateDescription: string | null | undefined = '';
  export let templateThumbnailUrl: string | null | undefined = '';
  export let templateCategoryName: string | null | undefined = 'Umum';
  export let status: string = 'draft';

  $: displayName = templateName.trim() || 'Untitled Template';
  $: displayDesc = (templateDescription || '').trim() || 'Belum ada deskripsi template.';
  $: displayCategory = (templateCategoryName || '').trim() || 'Umum';
  $: priceLabel = templatePrice > 0 ? formatIDR(templatePrice) : 'Gratis';
  $: hasThumbnail = Boolean(templateThumbnailUrl && templateThumbnailUrl.trim().length > 0);
  $: hasCustomName = Boolean(templateName.trim() && templateName.trim() !== 'Untitled Template');
  $: hasDescription = Boolean(templateDescription && templateDescription.trim().length > 0);
</script>

<div class="space-y-3 font-sans">
  <!-- Section Title -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-1.5">
      <span class="material-symbols-outlined text-primary text-base">visibility</span>
      <span class="font-bold text-main text-xs uppercase tracking-wider font-heading">
        Pratinjau Kartu Marketplace
      </span>
    </div>
    {#if templateId}
      <a
        href={`/builder/new?id=${encodeURIComponent(templateId)}`}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-3xs font-bold text-primary hover:underline hover:text-primary-focus transition-colors"
        title="Buka formulir inisialisasi untuk mengedit thumbnail, nama, kategori, atau harga template"
      >
        <span>Ubah Data</span>
        <ExternalLink size={11} />
      </a>
    {/if}
  </div>

  <!-- Marketplace Mockup Card Preview -->
  <div class="bg-card border border-light rounded-2xl overflow-hidden shadow-sm relative group transition-all">
    <div class="aspect-[16/10] bg-gradient-to-br from-primary/10 via-nested to-indigo-500/10 relative overflow-hidden flex items-center justify-center border-b border-light">
      {#if hasThumbnail}
        <img
          src={templateThumbnailUrl}
          alt={displayName}
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      {:else}
        <div class="text-center space-y-1.5 p-4 select-none">
          <div class="w-10 h-10 rounded-xl bg-card border border-light flex items-center justify-center text-primary mx-auto shadow-2xs">
            <Store size={20} />
          </div>
          <span class="text-3xs font-mono font-bold text-muted uppercase tracking-widest block">
            PRATINJAU VISUAL KANVAS
          </span>
          <span class="inline-flex items-center gap-1 text-3xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <AlertTriangle size={10} />
            <span>Thumbnail Belum Diunggah</span>
          </span>
        </div>
      {/if}

      <div class="absolute top-2.5 right-2.5">
        {#if status === 'rejected'}
          <Badge variant="rose" dot size="sm">Ditolak</Badge>
        {:else if status === 'approved'}
          <Badge variant="emerald" dot size="sm">Disetujui</Badge>
        {:else if status === 'pending'}
          <Badge variant="amber" dot size="sm">Review</Badge>
        {:else}
          <Badge variant="slate" dot size="sm">Draft</Badge>
        {/if}
      </div>

      <div class="absolute bottom-2.5 left-2.5">
        <span class="px-2 py-0.5 rounded-md text-3xs font-bold bg-card/90 backdrop-blur-md text-main border border-light shadow-2xs">
          {displayCategory}
        </span>
      </div>
    </div>

    <!-- Card Content Info -->
    <div class="p-3.5 space-y-2">
      <div>
        <h4 class="font-bold text-xs text-main truncate font-heading">
          {displayName}
        </h4>
        <p class="text-3xs text-secondary line-clamp-2 leading-relaxed mt-0.5 font-sans">
          {displayDesc}
        </p>
      </div>

      <div class="pt-2 border-t border-light flex items-center justify-between">
        <div>
          <span class="text-4xs text-muted uppercase font-bold block">Harga</span>
          <span class="font-mono text-xs font-black text-main">
            {priceLabel}
          </span>
        </div>
        <div class="text-3xs font-mono font-bold text-secondary bg-nested px-2 py-0.5 rounded-md border border-light">
          0 Terjual
        </div>
      </div>
    </div>
  </div>

  <!-- Completeness Checklist Card -->
  <div class="rounded-xl border border-light bg-card p-3 space-y-2 shadow-2xs">
    <div class="flex items-center justify-between text-xs font-bold text-main">
      <span>Kelengkapan Informasi Desain</span>
      {#if hasThumbnail && hasCustomName && hasDescription}
        <Badge variant="emerald" size="sm">Lengkap</Badge>
      {:else}
        <Badge variant="amber" size="sm">Belum Lengkap</Badge>
      {/if}
    </div>

    <ul class="text-2xs space-y-1.5 text-secondary font-sans">
      <li class="flex items-center justify-between">
        <span class="flex items-center gap-1.5">
          <ImageIcon size={12} class={hasThumbnail ? 'text-success' : 'text-amber-500'} />
          <span>Gambar Thumbnail</span>
        </span>
        {#if hasThumbnail}
          <span class="font-bold text-success flex items-center gap-0.5"><Check size={11} /> Terpasang</span>
        {:else}
          <span class="font-bold text-amber-500 flex items-center gap-0.5"><AlertTriangle size={11} /> Belum Ada</span>
        {/if}
      </li>

      <li class="flex items-center justify-between">
        <span class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-xs {hasCustomName ? 'text-success' : 'text-amber-500'}">title</span>
          <span>Nama Template</span>
        </span>
        {#if hasCustomName}
          <span class="font-bold text-success truncate max-w-[140px] text-right">{displayName}</span>
        {:else}
          <span class="font-bold text-amber-500">Nama Default</span>
        {/if}
      </li>

      <li class="flex items-center justify-between">
        <span class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-xs {templatePrice >= 0 ? 'text-success' : 'text-amber-500'}">payments</span>
          <span>Harga Penjualan</span>
        </span>
        <span class="font-mono font-bold text-main">{priceLabel}</span>
      </li>

      <li class="flex items-center justify-between">
        <span class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-xs {hasDescription ? 'text-success' : 'text-amber-500'}">description</span>
          <span>Deskripsi Template</span>
        </span>
        {#if hasDescription}
          <span class="font-bold text-success flex items-center gap-0.5"><Check size={11} /> Terisi</span>
        {:else}
          <span class="font-bold text-amber-500 flex items-center gap-0.5"><AlertTriangle size={11} /> Belum Diisi</span>
        {/if}
      </li>
    </ul>

    {#if !hasThumbnail}
      <div class="pt-1.5 border-t border-light/60">
        <p class="text-3xs text-amber-600 dark:text-amber-400 leading-relaxed font-sans">
          💡 <strong>Tips:</strong> Template dengan gambar thumbnail yang memikat memiliki rasio penjualan 5x lebih tinggi di katalog.
        </p>
      </div>
    {/if}
  </div>
</div>
