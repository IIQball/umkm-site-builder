<script lang="ts">
  import { Upload, X, Loader2 } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import {
    nodeTextColorOptions,
    nodeMarginOptions,
    btnVariantOptions,
    btnHeightOptions,
  } from '../nodeContent.constants';
  import {
    compressToWebP,
    uploadToCloudinary,
    deleteOldImage,
  } from '../imageUpload.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: badgeText = (section.props?.badgeText as string) ?? '';
  $: badgeColor = (section.props?.badgeColor as string) ?? 'primary';
  $: title = (section.props?.title as string) ?? '';
  $: subtitle = (section.props?.subtitle as string) ?? '';
  $: imageUrl = (section.props?.imageUrl as string) ?? '';
  $: imageMode = (section.props?.imageMode as 'element' | 'background') ?? 'element';
  $: ctaText = (section.props?.ctaText as string) ?? '';
  $: ctaLink = (section.props?.ctaLink as string) ?? '#';
  $: ctaVariant = (section.props?.ctaVariant as string) ?? 'primary';

  function getTitleStyle(property: 'color' | 'backgroundColor'): string {
    const nodeStyles = section.props?.nodeStyles as Record<string, Record<string, string>> | undefined;
    return nodeStyles?.title?.[property] ?? '';
  }

  function handleTitleColorChange(colorVal: string) {
    const currentStyles = (section.props?.nodeStyles as Record<string, Record<string, string>>) || {};
    const titleStyles = { ...(currentStyles.title || {}), color: colorVal };
    onPropChange('nodeStyles', { ...currentStyles, title: titleStyles });
  }

  let isUploading = false;
  let errorMessage = '';
  let fileInput: HTMLInputElement;

  async function handleImageFileChange(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    errorMessage = '';
    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      errorMessage = 'Format file wajib JPG, JPEG, atau PNG';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errorMessage = 'Ukuran maksimal file sebelum dikompresi adalah 5MB';
      return;
    }

    try {
      isUploading = true;
      const webpBlob = await compressToWebP(file, 1920, 1080);
      const url = await uploadToCloudinary(webpBlob, 'templates', `${Date.now()}_banner.webp`);
      
      const oldUrl = (section.props?.imageUrl as string) || '';
      if (oldUrl && oldUrl !== url) {
        await deleteOldImage(oldUrl);
      }
      onPropChange('imageUrl', url);
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Upload gagal';
    } finally {
      isUploading = false;
      if (fileInput) fileInput.value = '';
    }
  }

  async function handleRemoveNodeImage() {
    const oldUrl = (section.props?.imageUrl as string) || '';
    onPropChange('imageUrl', '');
    if (oldUrl) {
      await deleteOldImage(oldUrl);
    }
  }
</script>

{#if nodeId === 'badge'}
  <div class="space-y-3">
    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="badge-text-input">Teks Promo Badge</label>
      <input
        id="badge-text-input"
        type="text"
        value={badgeText}
        on:input={(e) => onPropChange('badgeText', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs"
        placeholder="Diskon 50% Hari Ini"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="badge-color-select">Varian Warna Badge</label>
      <select
        id="badge-color-select"
        value={badgeColor}
        on:change={(e) => onPropChange('badgeColor', e.currentTarget.value)}
        class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
      >
        <option value="primary">Primary Brand (Solid)</option>
        <option value="secondary">Secondary Accent</option>
        <option value="success">Success Hijau (Diskon/Promo)</option>
        <option value="warning">Warning Kuning (Limited)</option>
        <option value="neutral">Neutral Outline</option>
      </select>
    </div>
  </div>
{:else if nodeId === 'title'}
  <div class="space-y-3">
    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="hero-title-input">Judul Utama (Heading)</label>
      <textarea
        id="hero-title-input"
        rows="2"
        value={title}
        on:input={(e) => onPropChange('title', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs"
        placeholder="Judul Toko / Headline Utama"
      ></textarea>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="space-y-1">
        <label class="font-semibold text-base-content" for="title-color-select">Warna Judul</label>
        <select
          id="title-color-select"
          value={getTitleStyle('color')}
          on:change={(e) => handleTitleColorChange(e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        >
          {#each nodeTextColorOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>
      <div class="space-y-1">
        <label class="font-semibold text-base-content" for="title-margin-select">Jarak Bawah (8pt)</label>
        <select
          id="title-margin-select"
          value={section.styles?.titleMarginBottom || '16px'}
          on:change={(e) => onPropChange('titleMarginBottom', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        >
          {#each nodeMarginOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
{:else if nodeId === 'subtitle'}
  <div class="space-y-3">
    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="hero-subtitle-input">Deskripsi (Subtitle)</label>
      <textarea
        id="hero-subtitle-input"
        rows="3"
        value={subtitle}
        on:input={(e) => onPropChange('subtitle', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs"
        placeholder="Deskripsi singkat produk atau layanan toko Anda..."
      ></textarea>
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="subtitle-margin-select">Jarak Bawah (8pt)</label>
      <select
        id="subtitle-margin-select"
        value={section.styles?.subtitleMarginBottom || '24px'}
        on:change={(e) => onPropChange('subtitleMarginBottom', e.currentTarget.value)}
        class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
      >
        {#each nodeMarginOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
  </div>
{:else if nodeId === 'image'}
  <div class="space-y-3">
    <div class="space-y-1.5">
      <label class="font-semibold text-base-content" for="hero-img-upload">Banner / Media Gambar</label>
      {#if imageUrl}
        <div class="relative group rounded-xl overflow-hidden border border-base-300 dark:border-slate-800 bg-base-200/50 p-2 flex items-center gap-3">
          <img src={imageUrl} alt="Banner Preview" class="w-16 h-12 object-cover bg-white dark:bg-slate-900 rounded-lg border border-base-300" />
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold truncate text-base-content">Banner Hero</p>
            <p class="text-[10px] text-base-content/60">Terunggah ke Cloudinary (WebP)</p>
          </div>
          <button
            type="button"
            on:click={handleRemoveNodeImage}
            class="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
            title="Hapus Gambar"
          >
            <X size={14} />
          </button>
        </div>
      {:else}
        <button
          type="button"
          on:click={() => fileInput?.click()}
          disabled={isUploading}
          class="w-full border-2 border-dashed border-base-300 dark:border-slate-800 hover:border-primary/50 rounded-xl p-5 text-center cursor-pointer transition-colors bg-base-200/30 flex flex-col items-center gap-1.5"
        >
          {#if isUploading}
            <Loader2 size={18} class="animate-spin text-primary" />
            <span class="text-xs text-primary font-medium">Mengunggah gambar...</span>
          {:else}
            <Upload size={18} class="text-base-content/50" />
            <span class="text-xs font-medium text-base-content">Pilih Banner Gambar (PNG / JPG)</span>
            <span class="text-[10px] text-base-content/60">Otomatis kompres WebP &lt; 200KB</span>
          {/if}
        </button>
      {/if}
      <input
        id="hero-img-upload"
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        bind:this={fileInput}
        on:change={handleImageFileChange}
        class="hidden"
      />
      {#if errorMessage}
        <p class="text-[11px] text-error font-medium">{errorMessage}</p>
      {/if}
    </div>

    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="img-mode-select">Mode Penempatan Gambar</label>
      <select
        id="img-mode-select"
        value={imageMode}
        on:change={(e) => onPropChange('imageMode', e.currentTarget.value)}
        class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
      >
        <option value="element">Elemen Sejajar Teks (Split View)</option>
        <option value="background">Background Penuh (Full Bleed)</option>
      </select>
    </div>
  </div>
{:else if nodeId === 'cta'}
  <div class="space-y-3">
    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="cta-text-input">Teks Tombol CTA</label>
      <input
        id="cta-text-input"
        type="text"
        value={ctaText}
        on:input={(e) => onPropChange('ctaText', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs"
        placeholder="Lihat Produk / Hubungi Kami"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="cta-link-input">Tautan / Aksi Target (Link)</label>
      <input
        id="cta-link-input"
        type="text"
        value={ctaLink}
        on:input={(e) => onPropChange('ctaLink', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs font-mono"
        placeholder="#katalog atau https://wa.me/..."
      />
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="space-y-1">
        <label class="font-semibold text-base-content" for="cta-variant-select">Varian Tombol</label>
        <select
          id="cta-variant-select"
          value={ctaVariant}
          on:change={(e) => onPropChange('ctaVariant', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        >
          {#each btnVariantOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>
      <div class="space-y-1">
        <label class="font-semibold text-base-content" for="cta-height-select">Ukuran Tinggi (8pt)</label>
        <select
          id="cta-height-select"
          value={section.styles?.ctaHeight || '40px'}
          on:change={(e) => onPropChange('ctaHeight', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        >
          {#each btnHeightOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
{/if}
