<script lang="ts">
  import { onMount } from 'svelte';
  import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-svelte';
  import { Card, Textarea, Button, Badge } from '@/components/ui';
  import { formatIDR, formatCurrencyInput } from '@/lib/currency';
  import TemplateCardPreview from './template-form/TemplateCardPreview.svelte';
  import TemplatePricingSimulator from './template-form/TemplatePricingSimulator.svelte';
  import TemplateBasicDetails from './template-form/TemplateBasicDetails.svelte';

  export let backHref = '/designer/templates';
  export let categories: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
  }> = [];

  let name = '';
  let description = '';
  let selectedCategoryId = '';
  let thumbnailUrl = '';
  let priceDisplay = '50.000';
  let numericPriceState = 50000;
  let loading = false;
  let loadingCategories = false;
  let error: string | null = null;
  let platformFeePercentage = 30;
  let designerPercentage = 70;

  $: selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId) || categories[0];
  $: selectedCategoryName = selectedCategoryObj ? selectedCategoryObj.name : 'Umum';

  onMount(async () => {
    if (categories.length === 0) {
      loadingCategories = true;
      try {
        const res = await fetch('/api/public/template-categories');
        const json = await res.json();
        if (json.ok && Array.isArray(json.data)) {
          categories = json.data;
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
      const commRes = await fetch('/api/public/commission');
      const commJson = await commRes.json();
      if (commJson.ok && commJson.data) {
        platformFeePercentage = commJson.data.platformFeePercentage;
        designerPercentage = commJson.data.designerPercentage;
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

  /** Auto-format visual masking while typing */
  const handlePriceInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const rawDigits = target.value.replace(/\D/g, '');
    target.value = formatCurrencyInput(rawDigits);
    priceDisplay = target.value;
    numericPriceState = Number(rawDigits) || 0;
  };

  const selectPricePreset = (val: number) => {
    numericPriceState = val;
    priceDisplay = val > 0 ? formatCurrencyInput(val) : '0';
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!name.trim()) {
      error = 'Nama template wajib diisi';
      return;
    }

    loading = true;
    error = null;

    try {
      const response = await fetch('/api/designer/templates/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          categoryId: selectedCategoryId || undefined,
          thumbnailUrl: thumbnailUrl.trim() || undefined,
          price: numericPriceState,
        }),
      });

      const result = await response.json();

      if (response.ok && result.ok && result.data?.id) {
        window.location.href = `/builder/${result.data.id}`;
      } else {
        error = result.error?.message || 'Gagal membuat template baru. Silakan coba lagi.';
      }
    } catch {
      error = 'Terjadi kesalahan sistem saat membuat template.';
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
            <Badge variant="secondary" size="sm">Draf Baru</Badge>
          </div>
          <p class="text-body-sm text-secondary mt-0.5">
            Konfigurasi metadata awal template sebelum masuk ke No-Code Visual Builder
          </p>
        </div>
      </div>

      <a
        href={backHref}
        class="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-main bg-nested hover:bg-nested/80 border border-light px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
      >
        <ArrowLeft size={14} />
        <span>Kembali ke Katalog</span>
      </a>
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
            class="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs animate-fade-in-up"
          >
            <span class="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
            <p class="leading-relaxed font-sans">{error}</p>
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
          {numericPriceState}
          {priceDisplay}
          {pricePreview}
          {loading}
          {platformFeePercentage}
          {designerPercentage}
          onPriceInput={handlePriceInput}
          onSelectPricePreset={selectPricePreset}
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
            <span>Buka Visual Editor</span>
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
      />
    </div>
  </Card>
</div>
