<script lang="ts">
  import { ChevronUp, ChevronDown, Trash2 } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { FeatureItem } from '@/types';
  import { FEATURE_ICON_OPTIONS } from '../../sections/features/featureIcons';
  import SearchableIconDropdown from '../../inspector/SearchableIconDropdown.svelte';
  import ImageUploadDropzone from '../../inspector/ImageUploadDropzone.svelte';

  export let feature: FeatureItem;
  export let index: number;
  export let totalFeatures: number;
  export let hasItemImages: boolean = false;
  export let onFieldChange: (field: string, val: unknown) => void;
  export let onMove: (direction: 'up' | 'down') => void;
  export let onRemove: () => void;
</script>

<div class="p-3 bg-base-200/50 border border-base-300 rounded-lg space-y-3 text-left">
  <!-- Card Header -->
  <div class="flex items-center justify-between gap-2 border-b border-base-300/60 pb-2">
    <span class="font-heading font-bold text-xs text-base-content truncate">
      Fitur #{index + 1}: {feature.title || 'Fitur Baru'}
    </span>

    <div class="flex items-center gap-0.5 shrink-0">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        on:click={() => onMove('up')}
        disabled={index === 0}
        class="!p-1 !h-6 !w-6 !min-h-0 !min-w-0 text-base-content/50 hover:text-base-content disabled:opacity-20"
        title="Pindah ke Atas"
      >
        <ChevronUp size={13} />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        on:click={() => onMove('down')}
        disabled={index === totalFeatures - 1}
        class="!p-1 !h-6 !w-6 !min-h-0 !min-w-0 text-base-content/50 hover:text-base-content disabled:opacity-20"
        title="Pindah ke Bawah"
      >
        <ChevronDown size={13} />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        on:click={onRemove}
        class="!p-1 !h-6 !w-6 !min-h-0 !min-w-0 text-base-content/50 hover:text-error rounded"
        title="Hapus Fitur"
      >
        <Trash2 size={13} />
      </Button>
    </div>
  </div>

  <!-- Form Fields: 1 Kolom Penuh Stacked Vertikal -->
  <div class="space-y-2.5">
    <!-- Judul Fitur -->
    <div class="space-y-1">
      <label for={`feat-title-${index}`} class="block font-semibold text-2xs text-base-content/70">
        Judul Fitur
      </label>
      <input
        id={`feat-title-${index}`}
        type="text"
        value={feature.title ?? ''}
        on:input={(e) => onFieldChange('title', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content font-bold focus:outline-none focus:border-primary"
        placeholder="Contoh: Toko Terpercaya"
      />
    </div>

    <!-- Pilihan Ikon (Full Width) -->
    <div class="space-y-1">
      <span class="block font-semibold text-2xs text-base-content/70">
        Ikon Fitur
      </span>
      <SearchableIconDropdown
        label=""
        options={FEATURE_ICON_OPTIONS}
        selectedIcon={feature.iconName || feature.icon || 'sparkles'}
        onSelect={(val) => {
          onFieldChange('icon', val);
          onFieldChange('iconName', val);
        }}
      />
    </div>

    <!-- Deskripsi Keunggulan -->
    <div class="space-y-1">
      <label for={`feat-desc-${index}`} class="block font-semibold text-2xs text-base-content/70">
        Deskripsi Keunggulan
      </label>
      <textarea
        id={`feat-desc-${index}`}
        value={feature.description ?? ''}
        on:input={(e) => onFieldChange('description', e.currentTarget.value)}
        rows="2"
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content focus:outline-none focus:border-primary resize-y"
        placeholder="Deskripsi singkat keunggulan..."
      ></textarea>
    </div>

    <!-- Label Lencana / Badge (Opsional) -->
    <div class="space-y-1">
      <label for={`feat-badge-${index}`} class="block font-semibold text-2xs text-base-content/70">
        Label Lencana / Badge (Opsional)
      </label>
      <input
        id={`feat-badge-${index}`}
        type="text"
        value={feature.badge ?? ''}
        on:input={(e) => onFieldChange('badge', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content focus:outline-none focus:border-primary"
        placeholder="Contoh: Populer / Baru"
      />
    </div>

    <!-- Teks Tombol / Statistik (Opsional) -->
    <div class="space-y-1">
      <label for={`feat-stat-${index}`} class="block font-semibold text-2xs text-base-content/70">
        Teks Tombol / Statistik (Opsional)
      </label>
      <input
        id={`feat-stat-${index}`}
        type="text"
        value={feature.statLabel ?? ''}
        on:input={(e) => onFieldChange('statLabel', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content focus:outline-none focus:border-primary"
        placeholder="Contoh: Lihat Detail / 100+ Terjual"
      />
    </div>

    <!-- Tautan / Link URL (Opsional) -->
    <div class="space-y-1">
      <label for={`feat-link-${index}`} class="block font-semibold text-2xs text-base-content/70">
        Tautan / Link URL (Opsional)
      </label>
      <input
        id={`feat-link-${index}`}
        type="text"
        value={feature.linkUrl ?? ''}
        on:input={(e) => onFieldChange('linkUrl', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content focus:outline-none focus:border-primary"
        placeholder="Contoh: #katalog atau https://wa.me/..."
      />
    </div>

    <!-- Gambar Fitur (Jika Didukung) -->
    {#if hasItemImages}
      <div class="space-y-1 pt-1">
        <span class="block font-semibold text-2xs text-base-content/70">
          Gambar Fitur
        </span>
        <ImageUploadDropzone
          compact={true}
          imageUrl={feature.imageUrl || ''}
          onImageChange={(url) => onFieldChange('imageUrl', url)}
          label={`Gambar Fitur #${index + 1}`}
          placeholderTitle="Tarik Gambar ke Sini"
          placeholderSubtitle="pilih manual"
          folder="features"
        />
      </div>
    {/if}
  </div>
</div>
