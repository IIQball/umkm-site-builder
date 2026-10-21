<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { Button, Input, Card, Badge, SearchableSelect } from '@/components/ui';
  import {
    LOGO_CONCEPT_OPTIONS,
    BUSINESS_CATEGORY_OPTIONS,
  } from './logo-wizard.constants';
  import LogoConceptVisual from './LogoConceptVisual.svelte';
  import LogoPaletteSelector from './LogoPaletteSelector.svelte';
  import LogoLockupSelector from './LogoLockupSelector.svelte';
  import AiQualityTierSelector from './AiQualityTierSelector.svelte';
  import {
    validateAiLogo,
    type LogoConceptType,
    type LogoLockupType,
    type LogoFontFamily,
    type AiLogoInput,
  } from '@/lib/validators/ai-logo';

  export let loading: boolean = false;
  export let initialStoreName: string = '';
  export let initialCategory: string = 'Kuliner & Makanan';
  export let initialConcept: LogoConceptType = 'letter_fusion';

  const dispatch = createEventDispatcher<{
    submit: AiLogoInput;
    cancel: void;
  }>();

  interface CategoryOptionItem {
    value: string;
    label: string;
    sublabel?: string;
  }

  let storeName: string = initialStoreName;
  let categoryOptions: CategoryOptionItem[] = BUSINESS_CATEGORY_OPTIONS.map((c) => ({
    value: c.name,
    label: c.name,
    sublabel: c.description,
  }));
  let isLoadingCategories = false;
  let selectedCategory: string = initialCategory || categoryOptions[0]?.value || 'Kuliner & Makanan';
  let selectedConcept: LogoConceptType = initialConcept;
  let lockupType: LogoLockupType = 'icon_only';
  let fontFamily: LogoFontFamily = 'Plus Jakarta Sans';
  let logoText: string = '';
  let selectedColors: string[] = ['#C85A32', '#F7F4EE', '#2A2A2A'];
  let qualityTier: 'standard' | 'high' = 'high';
  let focalSubject: string = '';
  let errors: Record<string, string> = {};

  async function loadBusinessCategories() {
    isLoadingCategories = true;
    try {
      const res = await fetch('/api/public/business-categories');
      if (res.ok) {
        const json = await res.json();
        const items = json.data || json;
        if (Array.isArray(items) && items.length > 0) {
          categoryOptions = items.map((cat: { name: string; description?: string | null }) => ({
            value: cat.name,
            label: cat.name,
            sublabel: cat.description || undefined,
          }));
          if (!categoryOptions.some((opt) => opt.value === selectedCategory)) {
            selectedCategory = categoryOptions[0].value;
          }
        }
      }
    } catch {
      // Fallback tetap menggunakan BUSINESS_CATEGORY_OPTIONS
    } finally {
      isLoadingCategories = false;
    }
  }

  onMount(() => {
    loadBusinessCategories();
  });

  function handleSelectConcept(conceptId: LogoConceptType) {
    selectedConcept = conceptId;
    if (errors.conceptType) {
      delete errors.conceptType;
      errors = { ...errors };
    }
  }

  function handleLockupChange(type: LogoLockupType) {
    lockupType = type;
    if ((type === 'vertical' || type === 'horizontal') && !logoText.trim() && storeName.trim()) {
      logoText = storeName.trim();
    }
    if (errors.lockupType) {
      delete errors.lockupType;
      errors = { ...errors };
    }
  }

  function handleSubmit() {
    const payload = {
      storeName: storeName.trim(),
      conceptType: selectedConcept,
      visualStyle: selectedConcept,
      businessCategory: selectedCategory,
      lockupType,
      fontFamily,
      logoText: logoText.trim(),
      colorPalette: selectedColors,
      qualityTier,
      focalSubject: focalSubject.trim() || undefined,
    };

    const validation = validateAiLogo(payload);
    if (!validation.success) {
      errors = validation.errors || {};
      return;
    }

    errors = {};
    dispatch('submit', validation.data!);
  }
</script>

<div class="space-y-6">
  <!-- 1. Input Informasi Toko & Kategori Bisnis -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <Input
        label="Nama Toko / Merek"
        placeholder="Contoh: Kopi Harum, Loafwright Bakery"
        bind:value={storeName}
        error={errors.storeName}
        helper="Nama toko utama yang diolah menjadi metafora visual."
        required
      />
    </div>

    <div>
      <SearchableSelect
        id="category-select"
        label="Kategori Bisnis Toko"
        placeholder={isLoadingCategories ? 'Memuat kategori...' : 'Pilih atau cari kategori bisnis...'}
        searchPlaceholder="Ketik untuk mencari kategori..."
        options={categoryOptions}
        bind:value={selectedCategory}
        error={errors.businessCategory}
        helper="Menentukan objek visual dan simbol domain usaha Anda."
        required
        searchable
        clearable={false}
      />
    </div>
  </div>

  <!-- 2. Konsep & Bentuk Logo (dengan Contoh Visual Logo) -->
  <div>
    <div class="flex items-center justify-between mb-2">
      <span class="block text-label-caps text-muted">
        Konsep & Bentuk Logo <span class="text-error">*</span>
      </span>
      <span class="text-2xs text-secondary font-medium">Contoh Visual Tiap Gaya</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {#each LOGO_CONCEPT_OPTIONS as opt}
        {@const isSelected = selectedConcept === opt.id}
        <div
          role="button"
          tabindex="0"
          class="text-left cursor-pointer transition-all focus:outline-none group flex flex-col"
          on:click={() => handleSelectConcept(opt.id)}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectConcept(opt.id)}
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
              <!-- Visual Contoh Logo di Tiap Layout -->
              <div class="mb-2.5 relative">
                <LogoConceptVisual concept={opt.id} selected={isSelected} />
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

            <div class="text-2xs text-muted flex items-center gap-1 font-mono pt-2 border-t border-light/60">
              <span class="w-1.5 h-1.5 rounded-full {isSelected ? 'bg-primary' : 'bg-muted'}"></span>
              <span>Contoh: {opt.example}</span>
            </div>
          </Card>
        </div>
      {/each}
    </div>
    {#if errors.conceptType}
      <p class="text-xs text-error mt-1.5">{errors.conceptType}</p>
    {/if}
  </div>

  <!-- Fokus Objek / Simbol (Opsional) -->
  <Input
    label="Fokus Objek / Simbol (Opsional)"
    placeholder="Contoh: Ayam jago, daun kopi, kelinci"
    bind:value={focalSubject}
    error={errors.focalSubject}
    maxlength={30}
    helper="Maksimal 3 kata untuk mengarahkan simbol utama logo"
  />

  <!-- 3. Teks Singkat di Logo (Otomatis Diisi Saat Memilih Format Vertikal/Horizontal) -->
  <div class="p-4 bg-nested/60 rounded-2xl border border-light space-y-1">
    <Input
      label="Teks Nama Merek di Logo"
      placeholder="Contoh: KOPI HARUM (Maksimal 2 kata)"
      bind:value={logoText}
      error={errors.logoText}
      maxlength={20}
      helper="Maksimal 2 kata singkat agar logo tetap rapi dan terbaca jelas. Otomatis terisi saat memilih tata letak bertuliskan nama merek."
    />
  </div>

  <!-- 4. Susunan Tata Letak & Tipografi Font Logo (Lockup) -->
  <LogoLockupSelector
    bind:lockupType
    bind:fontFamily
    error={errors.lockupType}
    on:change={(e) => handleLockupChange(e.detail)}
  />

  <!-- 5. Palet Warna Logo (Maksimal 3 Warna) -->
  <LogoPaletteSelector bind:selectedColors bind:error={errors.colorPalette} />

  <!-- 6. Kualitas & Model AI -->
  <AiQualityTierSelector bind:value={qualityTier} disabled={loading} />

  <!-- Aksi Formulir -->
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
        disabled={loading || !storeName.trim()}
      >
        {#if loading}
          Merancang Logo AI...
        {:else}
          Buat Logo Toko Sekarang
        {/if}
      </Button>
    </div>
  </div>
</div>
