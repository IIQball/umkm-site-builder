<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button, Input, Card, Badge } from '@/components/ui';
  import { POSTER_RATIO_OPTIONS } from './poster-wizard.constants';
  import PosterRatioMockup from './PosterRatioMockup.svelte';
  import PosterStyleSelector from './PosterStyleSelector.svelte';
  import PackagingImageUploader from './PackagingImageUploader.svelte';
  import AiQualityTierSelector from './AiQualityTierSelector.svelte';
  import {
    validateAiPoster,
    type PosterStyle,
    type PosterSizeRatio,
    type AiPosterInput,
  } from '@/lib/validators/ai-poster';

  export let loading: boolean = false;
  export let initialProductName: string = '';
  export let initialTitleText: string = '';
  export let initialSubText: string = '';
  export let initialPosterStyle: PosterStyle = 'vietnam_editorial';
  export let initialSizeRatio: PosterSizeRatio = '1:1';

  const dispatch = createEventDispatcher<{
    submit: AiPosterInput;
    cancel: void;
  }>();

  let productName: string = initialProductName;
  let titleText: string = initialTitleText;
  let subText: string = initialSubText;
  let posterStyle: PosterStyle = initialPosterStyle;
  let sizeRatio: PosterSizeRatio = initialSizeRatio;
  let referenceImageBase64: string = '';
  let originalFileName: string = '';
  let originalFileSize: number = 0;
  let compressedFileSize: number = 0;
  let qualityTier: 'standard' | 'high' = 'high';
  let errors: Record<string, string> = {};

  function handleSelectRatio(ratio: PosterSizeRatio) {
    sizeRatio = ratio;
    if (errors.sizeRatio) {
      delete errors.sizeRatio;
      errors = { ...errors };
    }
  }

  function handleImageProcessed(
    event: CustomEvent<{ base64: string; compressedSize: number; originalFile: File }>
  ) {
    referenceImageBase64 = event.detail.base64;
    compressedFileSize = event.detail.compressedSize;
    originalFileName = event.detail.originalFile.name;
    originalFileSize = event.detail.originalFile.size;
    if (errors.referenceImageBase64) {
      delete errors.referenceImageBase64;
      errors = { ...errors };
    }
  }

  function handleImageRemoved() {
    referenceImageBase64 = '';
    compressedFileSize = 0;
    originalFileName = '';
    originalFileSize = 0;
  }

  function handleImageError(event: CustomEvent<string>) {
    errors = { ...errors, referenceImageBase64: event.detail };
  }

  function handleSubmit() {
    if (!productName.trim()) {
      errors = { ...errors, productName: 'Nama produk makanan wajib diisi' };
      return;
    }

    const payload = {
      featureType: 'product_poster' as const,
      productName: productName.trim(),
      titleText: titleText.trim(),
      subText: subText.trim(),
      posterStyle,
      backgroundMood: posterStyle,
      sizeRatio,
      referenceImageBase64: referenceImageBase64 || undefined,
      qualityTier,
    };

    const validation = validateAiPoster(payload);
    if (!validation.success) {
      errors = validation.errors || {};
      return;
    }

    errors = {};
    dispatch('submit', validation.data!);
  }
</script>

<div class="space-y-6">
  <!-- 1. Detail Produk & Tipografi Promosi -->
  <div class="space-y-4 p-4 rounded-2xl bg-nested/60 border border-light">
    <div>
      <Input
        label="Nama Produk"
        placeholder="Contoh: Ayam Geprek Sambal Korek, Es Kopi Susu Aren"
        bind:value={productName}
        error={errors.productName}
        helper="Nama produk makanan atau minuman yang dipromosikan."
        required
      />
    </div>

    <div>
      <Input
        label="Headline Promosi"
        placeholder="Contoh: Sensasi Pedas Nampol, Kopi Susu Aren Legit"
        bind:value={titleText}
        error={errors.titleText}
        helper="Teks judul paling menonjol pada poster (2 - 60 karakter)."
        required
      />
    </div>

    <div>
      <Input
        label="Tagline / Deskripsi Singkat (Opsional)"
        placeholder="Contoh: 100% Rempah Pilihan Khas Nusantara"
        bind:value={subText}
        error={errors.subText}
        helper="Keterangan singkat rasa, promo, atau deskripsi varian (maksimal 100 karakter)."
      />
    </div>
  </div>

  <!-- 2. Format & Rasio Aspek (dengan Mockup Ukuran Ala Canva) -->
  <div>
    <div class="flex items-center justify-between mb-2">
      <span class="block text-label-caps text-muted">
        Format & Rasio Poster <span class="text-error">*</span>
      </span>
      <span class="text-2xs text-secondary font-medium">Mockup Ukuran Layar</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {#each POSTER_RATIO_OPTIONS as opt}
        {@const isSelected = sizeRatio === opt.id}
        <div
          role="button"
          tabindex="0"
          class="text-left cursor-pointer transition-all focus:outline-none group flex flex-col"
          on:click={() => handleSelectRatio(opt.id)}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectRatio(opt.id)}
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
              <!-- Mockup Ukuran Canva-style -->
              <div class="mb-2.5 relative">
                <PosterRatioMockup ratio={opt.id} selected={isSelected} />
                {#if isSelected}
                  <div class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                {/if}
              </div>

              <div class="flex items-start justify-between gap-2 mb-1">
                <span class="font-heading font-semibold text-sm text-main">{opt.label}</span>
                <Badge variant={isSelected ? 'primary' : 'slate'} size="sm" dot={false}>
                  {opt.badge}
                </Badge>
              </div>
              <p class="text-xs text-secondary leading-relaxed mb-2">{opt.description}</p>
            </div>

            <div class="text-2xs text-muted font-mono flex items-center gap-1.5 pt-2 border-t border-light/60">
              <span class="w-1.5 h-1.5 rounded-full {isSelected ? 'bg-primary' : 'bg-muted'}"></span>
              <span>Resolusi: {opt.dimensionLabel}</span>
            </div>
          </Card>
        </div>
      {/each}
    </div>
    {#if errors.sizeRatio}
      <p class="text-xs text-error mt-1.5">{errors.sizeRatio}</p>
    {/if}
  </div>

  <!-- 3. Pilihan 10 Gaya Desain Poster Populer & Anti-AI-Slop -->
  <PosterStyleSelector
    bind:selectedStyle={posterStyle}
    error={errors.posterStyle}
  />

  <!-- 4. Upload Foto Produk Asli (Di Urutan Terakhir Sebelum Kualitas & Render) -->
  <PackagingImageUploader
    disabled={loading}
    label="Foto Produk Makanan (Opsional)"
    required={false}
    {referenceImageBase64}
    {originalFileName}
    {originalFileSize}
    {compressedFileSize}
    error={errors.referenceImageBase64 || ''}
    on:processed={handleImageProcessed}
    on:remove={handleImageRemoved}
    on:error={handleImageError}
  />

  <!-- 5. Pilihan Kualitas & Model AI -->
  <AiQualityTierSelector bind:value={qualityTier} disabled={loading} />

  <!-- 6. Aksi Formulir -->
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
        disabled={loading || !titleText.trim() || !productName.trim()}
      >
        {#if loading}
          Merancang Poster AI...
        {:else}
          Buat Poster Makanan
        {/if}
      </Button>
    </div>
  </div>
</div>
