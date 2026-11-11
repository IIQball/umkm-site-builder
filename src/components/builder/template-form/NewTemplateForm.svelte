<script lang="ts">
  import { onMount } from 'svelte';
  import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-svelte';
  import { Card, Textarea, Button, Badge } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';
  import { apiFetch } from '@/lib/api/parse-response';
  import { toast } from '@/lib/toast';
  import TemplateCardPreview from './TemplateCardPreview.svelte';
  import TemplatePricingSimulator from './TemplatePricingSimulator.svelte';
  import TemplateBasicDetails from './TemplateBasicDetails.svelte';

  export let backHref = '/designer/templates';
  export let categories: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
  }> = [];
  type TemplateDraftData = {
    id: string; name: string; price: number; status: string;
    description?: string | null; categoryId?: string | null;
    thumbnailUrl?: string | null; rejectionReason?: string | null;
    revisionCount?: number; revisionNotes?: string | null;
  };
  export let initialTemplate: TemplateDraftData | null = null;

  let name = initialTemplate?.name || '';
  let description = initialTemplate?.description || '';
  let selectedCategoryId = initialTemplate?.categoryId || '';
  let thumbnailUrl = initialTemplate?.thumbnailUrl || '';
  let numericPriceState = initialTemplate?.price ?? 50000;
  let priceDisplay = initialTemplate ? (initialTemplate.price === 0 ? '0' : initialTemplate.price.toLocaleString('id-ID')) : '50.000';
  let isEditMode = Boolean(initialTemplate);
  let loading = false;
  let loadingCategories = false;
  let error: string | null = null;
  let platformFeePercentage = 30;
  let designerPercentage = 70;

  $: selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId) || categories[0];
  $: selectedCategoryName = selectedCategoryObj ? selectedCategoryObj.name : 'Umum';

  onMount(async () => {
    if (!initialTemplate && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryId = urlParams.get('id') || urlParams.get('templateId');
      if (queryId) {
        try {
          const result = await apiFetch<TemplateDraftData>(
            `/api/designer/templates/draft?templateId=${encodeURIComponent(queryId)}`
          );
          if (result.success && result.data) {
            initialTemplate = result.data;
            name = result.data.name || '';
            description = result.data.description || '';
            selectedCategoryId = result.data.categoryId || '';
            thumbnailUrl = result.data.thumbnailUrl || '';
            numericPriceState = result.data.price ?? 0;
            priceDisplay = numericPriceState === 0 ? '0' : numericPriceState.toLocaleString('id-ID');
            isEditMode = true;
          }
        } catch (fetchErr) {
          console.error('Failed to load initial template data:', fetchErr);
        }
      }
    }

    if (categories.length === 0) {
      loadingCategories = true;
      try {
        const result = await apiFetch<typeof categories>('/api/public/template-categories');
        if (result.success && Array.isArray(result.data)) {
          categories = result.data;
        }
      } catch {
        categories = [];
      } finally {
        loadingCategories = false;
      }
    }
    if (!selectedCategoryId && categories.length > 0) {
      selectedCategoryId = categories[0].id;
    }

    try {
      const commResult = await apiFetch<{ platformFeePercentage: number; designerPercentage: number }>(
        '/api/public/commission'
      );
      if (commResult.success && commResult.data) {
        platformFeePercentage = commResult.data.platformFeePercentage;
        designerPercentage = commResult.data.designerPercentage;
      }
    } catch (err) {
      console.error('Gagal mengambil informasi split komisi:', err);
    }
  });

  $: if (!selectedCategoryId && categories.length > 0) {
    selectedCategoryId = categories[0].id;
  }

  $: pricePreview =
    numericPriceState > 0
      ? formatIDR(numericPriceState)
      : 'Gratis';

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!name.trim()) {
      error = 'Nama template wajib diisi';
      toast.warning(error);
      return;
    }

    loading = true;
    error = null;

    try {
      const currentTemplateId = initialTemplate?.id;
      const isUpdating = isEditMode && Boolean(currentTemplateId);
      const endpoint = isUpdating && currentTemplateId
        ? `/api/designer/templates/draft?templateId=${encodeURIComponent(currentTemplateId)}`
        : '/api/designer/templates/draft';
      const result = await apiFetch<{ id?: string }>(endpoint, {
        method: isUpdating ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          categoryId: selectedCategoryId || undefined,
          thumbnailUrl: thumbnailUrl.trim() || undefined,
          price: numericPriceState,
        }),
        fallbackError: 'Gagal memproses template. Silakan coba lagi.',
      });

      const targetId = isUpdating ? currentTemplateId : result.data?.id;

      if (result.success && targetId) {
        toast.success(isUpdating ? 'Draf template diperbarui.' : 'Draf template dibuat.');
        window.location.href = `/builder/${targetId}`;
      } else {
        error = result.message;
        toast.error(error);
      }
    } catch {
      error = 'Terjadi kesalahan sistem saat memproses template.';
      toast.error(error);
    } finally {
      loading = false;
    }
  };
</script>

<div class="max-w-5xl mx-auto space-y-6 animate-fade-in">
  <Card variant="bordered" padding="none" radius="3xl" className="shadow-sm overflow-hidden">
    <!-- Card Header Banner -->
    <div
      class="p-6 md:p-8 bg-nested/50 border-b border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-2xs"
        >
          <Sparkles size={16} />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-heading-md text-main font-bold">
              Studio Inisialisasi Template
            </h1>
            {#if isEditMode}
              {#if initialTemplate?.status === 'rejected'}
                <Badge variant="error" size="sm">Perbaikan Desain</Badge>
              {:else}
                <Badge variant="primary" size="sm">Edit Draf</Badge>
              {/if}
            {:else}
              <Badge variant="secondary" size="sm">Draf Baru</Badge>
            {/if}
          </div>
          <p class="text-body-sm text-secondary mt-0.5">
            {isEditMode
              ? 'Perbarui metadata template sebelum melanjutkan ke No-Code Visual Builder'
              : 'Konfigurasi metadata awal template sebelum masuk ke No-Code Visual Builder'}
          </p>
        </div>
      </div>

      <Button
        href={backHref}
        variant="secondary"
        size="sm"
        class="self-start sm:self-auto"
      >
        <ArrowLeft size={14} />
        <span>Kembali ke Katalog</span>
      </Button>
    </div>

    <!-- Main Grid: Left Form (60%) + Right Live Preview (40%) -->
    <div
      class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-border-light)]"
    >
      <!-- Left Column: Interactive Form -->
      <form
        on:submit={handleSubmit}
        class="lg:col-span-7 p-6 md:p-8 space-y-6"
        novalidate
      >
        {#if error}
          <div
            class="flex items-start gap-2.5 p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-xs animate-fade-in-up"
          >
            <span class="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
            <p class="leading-relaxed font-sans">{error}</p>
          </div>
        {/if}

        {#if isEditMode && initialTemplate?.status === 'rejected' && initialTemplate.rejectionReason}
          <div class="p-4 rounded-2xl bg-error/10 border border-error/20 text-xs space-y-2 animate-fade-in-up">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-error font-bold">
                <span class="material-symbols-outlined text-base">assignment_late</span>
                <span>Catatan Penolakan dari Kurator</span>
              </div>
              {#if initialTemplate.revisionCount !== undefined}
                <Badge variant="error" size="sm">Revisi #{initialTemplate.revisionCount}</Badge>
              {/if}
            </div>
            <div class="p-3 bg-card/80 border border-error/20 rounded-xl text-secondary leading-relaxed font-sans">
              {initialTemplate.rejectionReason}
            </div>
            <p class="text-2xs text-muted">
              Perbaiki metadata dasar di bawah ini, lalu klik tombol simpan untuk menyelaraskan desain kanvas.
            </p>
          </div>
        {/if}

        <!-- Basic Details: Name, Category, Thumbnail -->
        <TemplateBasicDetails
          bind:name
          {loading}
          {categories}
          bind:selectedCategoryId
          {loadingCategories}
          bind:thumbnailUrl
        />

        <!-- Pricing & Income Simulator Sub-Component -->
        <TemplatePricingSimulator
          bind:numericPriceState
          bind:priceDisplay
          bind:pricePreview
          {loading}
          {platformFeePercentage}
          {designerPercentage}
        />

        <!-- Description / Tagline Input -->
        <Textarea
          id="tmpl-desc"
          label="Deskripsi Ringkas & Keunggulan (Opsional)"
          placeholder="Jelaskan karakteristik visual, target UMKM, dan fitur unik template ini..."
          bind:value={description}
          rows={3}
          disabled={loading}
        />

        <!-- Action Submit Buttons -->
        <div class="pt-4 flex items-center justify-between gap-3 border-t border-light">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
            {loading}
            className="shadow-md hover:shadow-primary/20"
          >
            <span>{isEditMode ? 'Simpan & Buka Visual Editor' : 'Buka Visual Editor'}</span>
            <ArrowRight size={16} class="ml-1" />
          </Button>
        </div>
      </form>

      <!-- Right Column: Real-Time Live Card Mockup & Studio Info Sub-Component -->
      <TemplateCardPreview
        {name}
        {description}
        {selectedCategoryName}
        {thumbnailUrl}
        {pricePreview}
        status={isEditMode && initialTemplate ? initialTemplate.status : 'draft'}
      />
    </div>
  </Card>
</div>

