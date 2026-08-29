<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Sparkles,
    ArrowLeft,
    ArrowRight,
    Store,
    Check,
    Info,
  } from 'lucide-svelte';
  import { Card, Input, Textarea, Button, Badge } from '@/components/ui';
  import ImageUpload from '../shared/ImageUpload.svelte';

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
  });

  $: if (!selectedCategoryId && categories.length > 0) {
    selectedCategoryId = categories[0].id;
  }

  $: designerShare = Math.round(numericPriceState * 0.7);
  $: platformShare = numericPriceState - designerShare;

  $: pricePreview =
    numericPriceState > 0
      ? `Rp ${new Intl.NumberFormat('id-ID').format(numericPriceState)}`
      : 'Gratis';

  /** Auto-format visual masking while typing */
  const handlePriceInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const rawDigits = target.value.replace(/\D/g, '');
    target.value = rawDigits
      ? new Intl.NumberFormat('id-ID').format(Number(rawDigits))
      : '';
    priceDisplay = target.value;
    numericPriceState = Number(rawDigits) || 0;
  };

  const selectPricePreset = (val: number) => {
    numericPriceState = val;
    priceDisplay = val > 0 ? new Intl.NumberFormat('id-ID').format(val) : '0';
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
        credentials: 'same-origin',
        body: JSON.stringify({
          name: name.trim(),
          categoryId: selectedCategoryId || undefined,
          thumbnailUrl: thumbnailUrl.trim() || undefined,
          description: description.trim() || `[${selectedCategoryName}] Tema website toko online modular`,
          price: numericPriceState,
        }),
      });

      if (response.status === 401) {
        window.location.href = '/auth/login?redirect=/builder/new';
        return;
      }

      const result = await response.json();

      if (!response.ok || !result.ok || !result.data?.id) {
        throw new Error(
          result.error?.message || 'Gagal membuat draft template',
        );
      }

      window.location.href = `/builder/${result.data.id}`;
    } catch (err) {
      error =
        err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.';
      loading = false;
    }
  };
</script>

<div class="w-full max-w-5xl mx-auto">
  <Card
    variant="bordered"
    padding="none"
    radius="3xl"
    topBeam="indigo-500"
    className="overflow-hidden shadow-xl relative"
  >
    <!-- Header Banner -->
    <div
      class="px-6 md:px-8 py-5 border-b border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-nested/40"
    >
      <div class="flex items-center gap-3.5">
        <div
          class="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs"
        >
          <Sparkles size={20} />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-heading-md text-main font-bold">
              Studio Inisialisasi Template
            </h1>
            <Badge variant="indigo" size="sm" dot pulse>Draf Baru</Badge>
          </div>
          <p class="text-body-sm text-secondary mt-0.5">
            Konfigurasi metadata awal template sebelum masuk ke No-Code Visual
            Builder
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
            <span
              class="material-symbols-outlined text-base flex-shrink-0 mt-0.5"
              >error</span
            >
            <p class="leading-relaxed font-sans">{error}</p>
          </div>
        {/if}

        <!-- Template Name Input -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label
              for="tmpl-name"
              class="text-label-caps text-muted font-bold"
              >Nama Template Desain <span class="text-error">*</span></label
            >
            <span class="text-3xs text-muted font-mono"
              >{name.length}/60 karakter</span
            >
          </div>
          <Input
            id="tmpl-name"
            placeholder="Contoh: Template Resto & Kuliner Nusantara"
            bind:value={name}
            disabled={loading}
            maxLength={60}
            className="font-semibold"
          >
            <span
              slot="prefix"
              class="material-symbols-outlined text-base text-muted select-none"
              >palette</span
            >
          </Input>
        </div>

        <!-- Category Pills strictly from DB -->
        <div class="space-y-2">
          <span class="text-label-caps text-muted font-bold block"
            >Kategori & Ceruk Usaha</span
          >
          {#if loadingCategories}
            <div class="flex items-center gap-2 text-xs text-muted py-2">
              <span class="material-symbols-outlined text-sm animate-spin">refresh</span>
              <span>Memuat kategori...</span>
            </div>
          {:else if categories.length === 0}
            <p class="text-xs text-muted italic py-1">Belum ada kategori template di database.</p>
          {:else}
            <div class="flex flex-wrap gap-2">
              {#each categories as cat}
                <button
                  type="button"
                  on:click={() => (selectedCategoryId = cat.id)}
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border {selectedCategoryId ===
                  cat.id
                    ? 'bg-primary text-white border-primary shadow-2xs'
                    : 'bg-nested/80 border-light text-secondary hover:text-main'}"
                >
                  <span class="material-symbols-outlined text-sm"
                    >{cat.icon || 'folder'}</span
                  >
                  <span>{cat.name}</span>
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Thumbnail Upload Section -->
        <div class="space-y-2 bg-nested/40 border border-light rounded-2xl p-4">
          <div class="flex items-center justify-between">
            <span class="text-label-caps text-muted font-bold block"
              >Thumbnail Sampul Template (Opsional)</span
            >
            {#if thumbnailUrl}
              <Badge variant="emerald" size="sm" dot>Gambar Terpasang</Badge>
            {/if}
          </div>
          <ImageUpload
            folder="templates"
            maxFiles={1}
            maxSizeMB={5}
            existingUrls={thumbnailUrl ? [thumbnailUrl] : []}
            onUpload={(urls) => {
              thumbnailUrl = urls[0] || '';
            }}
          />
        </div>

        <!-- Pricing & Income Simulator -->
        <div
          class="space-y-3 bg-nested/50 border border-light rounded-2xl p-4"
        >
          <div class="flex items-center justify-between">
            <label
              for="tmpl-price"
              class="text-label-caps text-muted font-bold"
              >Harga Jual Template (IDR)</label
            >
            <span
              class="text-xs font-bold font-mono {numericPriceState > 0
                ? 'text-success'
                : 'text-muted'}"
            >
              {pricePreview}
            </span>
          </div>

          <Input
            id="tmpl-price"
            placeholder="50.000"
            value={priceDisplay}
            on:input={handlePriceInput}
            disabled={loading}
            className="font-mono font-bold text-sm"
          >
            <span
              slot="prefix"
              class="text-xs font-bold text-muted select-none">Rp</span
            >
          </Input>

          <!-- Quick Preset Price Chips -->
          <div class="flex items-center gap-2 pt-1">
            <button
              type="button"
              on:click={() => selectPricePreset(0)}
              class="px-2.5 py-1 rounded-lg text-2xs font-bold border transition-all cursor-pointer {numericPriceState ===
              0
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-card border-light text-secondary hover:text-main'}"
            >
              Gratis (Rp 0)
            </button>
            <button
              type="button"
              on:click={() => selectPricePreset(25000)}
              class="px-2.5 py-1 rounded-lg text-2xs font-bold border transition-all cursor-pointer {numericPriceState ===
              25000
                ? 'bg-primary text-white border-primary'
                : 'bg-card border-light text-secondary hover:text-main'}"
            >
              Rp 25.000
            </button>
            <button
              type="button"
              on:click={() => selectPricePreset(50000)}
              class="px-2.5 py-1 rounded-lg text-2xs font-bold border transition-all cursor-pointer {numericPriceState ===
              50000
                ? 'bg-primary text-white border-primary'
                : 'bg-card border-light text-secondary hover:text-main'}"
            >
              Rp 50.000
            </button>
            <button
              type="button"
              on:click={() => selectPricePreset(100000)}
              class="px-2.5 py-1 rounded-lg text-2xs font-bold border transition-all cursor-pointer {numericPriceState ===
              100000
                ? 'bg-primary text-white border-primary'
                : 'bg-card border-light text-secondary hover:text-main'}"
            >
              Rp 100.000
            </button>
          </div>

          <!-- Dynamic Commission Simulator -->
          {#if numericPriceState > 0}
            <div
              class="pt-2 border-t border-light grid grid-cols-2 gap-2 text-center text-xs font-mono"
            >
              <div
                class="bg-card p-2 rounded-xl border border-emerald-500/20"
              >
                <span class="text-[10px] text-muted block font-sans"
                  >Hak Desainer (70%)</span
                >
                <span class="font-extrabold text-success text-xs"
                  >Rp {new Intl.NumberFormat('id-ID').format(
                    designerShare,
                  )}</span
                >
              </div>
              <div class="bg-card p-2 rounded-xl border border-light">
                <span class="text-[10px] text-muted block font-sans"
                  >Fee Platform (30%)</span
                >
                <span class="font-bold text-secondary text-xs"
                  >Rp {new Intl.NumberFormat('id-ID').format(
                    platformShare,
                  )}</span
                >
              </div>
            </div>
          {/if}
        </div>

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
        <div
          class="pt-4 flex items-center justify-between gap-3 border-t border-light"
        >
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

      <!-- Right Column: Real-Time Live Card Mockup & Studio Info -->
      <div
        class="lg:col-span-5 p-6 md:p-8 bg-nested/30 flex flex-col justify-between space-y-6"
      >
        <div>
          <div class="flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined text-primary text-base"
              >visibility</span
            >
            <h3
              class="text-xs font-bold text-main uppercase tracking-wider font-heading"
            >
              Pratinjau Kartu Marketplace
            </h3>
          </div>

          <!-- Live Dynamic Mockup Card -->
          <div
            class="bg-card border border-light rounded-3xl overflow-hidden shadow-lg relative group transition-all"
          >
            <!-- Simulated or Uploaded Thumbnail -->
            <div
              class="aspect-[16/10] bg-gradient-to-br from-primary/15 via-nested to-indigo-500/10 relative overflow-hidden flex items-center justify-center border-b border-light"
            >
              {#if thumbnailUrl}
                <img
                  src={thumbnailUrl}
                  alt={name || 'Thumbnail Template'}
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              {:else}
                <div class="text-center space-y-2 p-6">
                  <div
                    class="w-12 h-12 rounded-2xl bg-card border border-light flex items-center justify-center text-primary mx-auto shadow-xs"
                  >
                    <Store size={24} />
                  </div>
                  <span
                    class="text-3xs font-mono font-bold text-muted uppercase tracking-widest block"
                    >PRATINJAU VISUAL KANVAS</span
                  >
                </div>
              {/if}

              <!-- Top Right Status Badge Overlay -->
              <div class="absolute top-3 right-3">
                <Badge variant="slate" dot size="sm">Draft</Badge>
              </div>

              <!-- Category Badge Overlay -->
              <div class="absolute bottom-3 left-3">
                <span
                  class="px-2.5 py-1 rounded-lg text-3xs font-bold bg-card/90 backdrop-blur-md text-main border border-light shadow-2xs"
                >
                  {selectedCategoryName}
                </span>
              </div>
            </div>

            <!-- Mockup Card Content -->
            <div class="p-5 space-y-3">
              <div>
                <h4
                  class="font-bold text-sm text-main truncate font-heading"
                >
                  {name.trim() || 'Judul Template Desain Baru'}
                </h4>
                <p
                  class="text-2xs text-secondary line-clamp-2 leading-relaxed mt-1 font-sans"
                >
                  {description.trim() ||
                    'Deskripsi visual tema website toko online UMKM responsif dan modular.'}
                </p>
              </div>

              <div
                class="pt-3 border-t border-light flex items-center justify-between"
              >
                <div>
                  <span
                    class="text-4xs text-muted uppercase font-bold block"
                    >Harga</span
                  >
                  <span
                    class="font-mono text-xs font-extrabold text-main"
                  >
                    {pricePreview}
                  </span>
                </div>
                <div
                  class="text-2xs font-mono font-bold text-secondary bg-nested px-2.5 py-1 rounded-lg border border-light"
                >
                  0 Terjual
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Studio Features Sheet -->
        <div
          class="bg-card border border-light rounded-2xl p-4 space-y-2.5 shadow-2xs"
        >
          <div class="flex items-center gap-2 text-xs font-bold text-main">
            <Info size={14} class="text-primary" />
            <span>Fasilitas No-Code Builder</span>
          </div>
          <ul class="text-2xs text-secondary space-y-1.5 font-sans">
            <li class="flex items-center gap-2">
              <span
                class="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0"
              >
                <Check size={10} />
              </span>
              <span>Editor Visual drag-and-drop no-code</span>
            </li>
            <li class="flex items-center gap-2">
              <span
                class="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0"
              >
                <Check size={10} />
              </span>
              <span>Overlay Panduan Kolom Grid Figma & Pixel Grid 8px</span>
            </li>
            <li class="flex items-center gap-2">
              <span
                class="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0"
              >
                <Check size={10} />
              </span>
              <span>Pengajuan Review langsung ke Kurator Admin</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Card>
</div>
