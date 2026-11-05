<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button, Input, Card, Badge } from '@/components/ui';
  import { PACKAGING_TYPE_OPTIONS } from './packaging-wizard.constants';
  import PackagingVisualPreview from './PackagingVisualPreview.svelte';
  import PackagingImageUploader from './PackagingImageUploader.svelte';
  import PackagingPresentationSelector from './PackagingPresentationSelector.svelte';
  import AiQualityTierSelector from './AiQualityTierSelector.svelte';
  import {
    validateAiPackaging,
    type PackagingType,
    type MockupPresentationStyle,
    type AiPackagingInput,
  } from '@/lib/validators/ai-packaging';

  export let loading: boolean = false;
  export let initialProductLabel: string = '';
  export let initialPackagingType: PackagingType = 'standing_pouch';

  const dispatch = createEventDispatcher<{
    submit: AiPackagingInput & { originalFileName?: string; compressedSize?: number };
    cancel: void;
  }>();

  let packagingType: PackagingType = initialPackagingType;
  let presentationStyle: MockupPresentationStyle = 'clean_studio';
  let productLabel: string = initialProductLabel;
  let referenceImageBase64: string = '';
  let originalFile: File | null = null;
  let originalFileSize = 0;
  let compressedFileSize = 0;
  let qualityTier: 'standard' | 'high' = 'high';
  let errors: Record<string, string> = {};

  function handleImageProcessed(event: CustomEvent<{
    base64: string;
    compressedSize: number;
    originalFile: File;
  }>) {
    const detail = event.detail;
    referenceImageBase64 = detail.base64;
    compressedFileSize = detail.compressedSize;
    originalFile = detail.originalFile;
    originalFileSize = detail.originalFile.size;
    if (errors.referenceImageBase64) {
      delete errors.referenceImageBase64;
      errors = { ...errors };
    }
  }

  function handleImageRemove() {
    referenceImageBase64 = '';
    originalFile = null;
    originalFileSize = 0;
    compressedFileSize = 0;
  }

  function handleImageError(event: CustomEvent<string>) {
    errors = { ...errors, referenceImageBase64: event.detail };
  }

  function handleSelectType(typeId: PackagingType) {
    packagingType = typeId;
    if (errors.packagingType) {
      delete errors.packagingType;
      errors = { ...errors };
    }
  }

  function handleSubmit() {
    const payload = {
      packagingType,
      presentationStyle,
      productLabel: productLabel.trim(),
      referenceImageBase64,
      qualityTier,
    };

    const validation = validateAiPackaging(payload);
    if (!validation.success) {
      errors = validation.errors || {};
      return;
    }

    errors = {};
    dispatch('submit', {
      ...validation.data!,
      originalFileName: originalFile?.name,
      compressedSize: compressedFileSize,
    });
  }
</script>

<div class="space-y-6">
  <!-- 1. Input Label Produk -->
  <div>
    <Input
      label="Label / Nama Varian Produk"
      placeholder="Contoh: Keripik Pisang Cokelat Lumer, Sambal Bawang Spesial"
      bind:value={productLabel}
      error={errors.productLabel}
      helper="Teks label atau nama varian produk yang akan tertera pada kemasan."
      required
    />
  </div>

  <!-- 2. Pilihan Jenis Kemasan (dengan Gambar Contoh Visual) -->
  <div>
    <div class="flex items-center justify-between mb-2">
      <span class="block text-label-caps text-muted">
        Pilih Jenis Kemasan <span class="text-error">*</span>
      </span>
      <span class="text-2xs text-secondary font-medium">Contoh Visual Kemasan 3D</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {#each PACKAGING_TYPE_OPTIONS as opt}
        {@const isSelected = packagingType === opt.id}
        <div
          role="button"
          tabindex="0"
          class="text-left cursor-pointer transition-all focus:outline-none group flex flex-col"
          on:click={() => handleSelectType(opt.id)}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectType(opt.id)}
        >
          <Card
            variant={isSelected ? 'bordered' : 'nested'}
            padding="sm"
            radius="lg"
            class="h-full border-2 transition-all flex flex-col justify-between relative {isSelected
              ? 'border-primary ring-2 ring-primary/30 bg-primary/5 shadow-xs'
              : 'border-transparent hover:border-light'}"
          >
            <div>
              <!-- Visual Contoh Gambar Kemasan -->
              <div class="mb-2.5 relative">
                <PackagingVisualPreview type={opt.id} selected={isSelected} />
                {#if isSelected}
                  <div class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                {/if}
              </div>

              <div class="flex items-start justify-between gap-2 mb-1">
                <span class="font-heading font-semibold text-sm text-main">{opt.title}</span>
                <Badge variant={isSelected ? 'primary' : 'slate'} size="sm" dot={false}>
                  {opt.badge}
                </Badge>
              </div>
              <p class="text-xs text-secondary leading-relaxed mb-2">{opt.description}</p>
            </div>

            <div class="text-2xs text-muted font-mono flex items-center gap-1 pt-2 border-t border-light/60">
              <span class="w-1.5 h-1.5 rounded-full {isSelected ? 'bg-primary' : 'bg-muted'}"></span>
              <span>{opt.recommendation}</span>
            </div>
          </Card>
        </div>
      {/each}
    </div>
    {#if errors.packagingType}
      <p class="text-xs text-error mt-1.5">{errors.packagingType}</p>
    {/if}
  </div>

  <!-- 3. Gaya Presentasi Mockup & Latar Studio -->
  <PackagingPresentationSelector
    bind:presentationStyle
    error={errors.presentationStyle}
  />

  <!-- 4. Upload Foto Produk Asli (Di Urutan Terakhir Sebelum Kualitas & Render) -->
  <PackagingImageUploader
    disabled={loading}
    label="Foto Produk Asli (Wajib)"
    required={true}
    {referenceImageBase64}
    originalFileName={originalFile?.name || ''}
    {originalFileSize}
    {compressedFileSize}
    error={errors.referenceImageBase64 || ''}
    on:processed={handleImageProcessed}
    on:remove={handleImageRemove}
    on:error={handleImageError}
  />

  <!-- 4. Pilihan Kualitas & Model AI -->
  <AiQualityTierSelector bind:value={qualityTier} disabled={loading} />

  <!-- Aksi Form -->
  <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-light">
    <Badge variant={qualityTier === 'high' ? 'indigo' : 'slate'} size="md" dot={true}>
      Dibutuhkan {qualityTier === 'high' ? 2 : 1} Kredit
    </Badge>
    <div class="flex items-center gap-3">
      <Button
        variant="ghost"
        size="md"
        on:click={() => dispatch('cancel')}
        disabled={loading}
      >
        Batal
      </Button>
      <Button
        variant="primary"
        size="md"
        on:click={handleSubmit}
        {loading}
        disabled={loading || !productLabel.trim() || !referenceImageBase64}
      >
        {#if loading}
          Membuat Mockup AI...
        {:else}
          Render Mockup Kemasan
        {/if}
      </Button>
    </div>
  </div>
</div>
