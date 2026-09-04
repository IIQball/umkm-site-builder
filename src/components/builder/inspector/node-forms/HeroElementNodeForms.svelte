<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import {
    nodeTextColorOptions,
    nodeMarginOptions,
    btnVariantOptions,
    btnHeightOptions,
  } from '../nodeContent.constants';
  import HeroImageNodeForm from './HeroImageNodeForm.svelte';
  import HeroExtraNodeForms from './HeroExtraNodeForms.svelte';
  import { isHeroImageSupported } from '../../sections/hero/hero.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: badgeText = (section.props?.badgeText as string) ?? '';
  $: badgeColor = (section.props?.badgeColor as string) ?? 'primary';
  $: title = (section.props?.title as string) ?? '';
  $: subtitle = (section.props?.subtitle as string) ?? '';
  $: ctaText = (section.props?.ctaText as string) ?? '';
  $: ctaLink = (section.props?.ctaLink as string) ?? '#';
  $: ctaVariant = (section.props?.ctaVariant as string) ?? 'primary';
  $: tagName = (section.props?.tagName as string) || 'h1';

  $: activePreset = (section.layoutPreset || section.props?.layoutPreset || section.styles?.layoutPreset || 'split_left_text') as string;
  $: hasImageSupport = isHeroImageSupported(activePreset);

  function getTitleStyle(property: 'color' | 'backgroundColor'): string {
    const nodeStyles = section.props?.nodeStyles as Record<string, Record<string, string>> | undefined;
    return nodeStyles?.title?.[property] ?? '';
  }

  function handleTitleColorChange(colorVal: string) {
    const currentStyles = (section.props?.nodeStyles as Record<string, Record<string, string>>) || {};
    const titleStyles = { ...(currentStyles.title || {}), color: colorVal };
    onPropChange('nodeStyles', { ...currentStyles, title: titleStyles });
  }
</script>

{#if nodeId === 'badge' || nodeId === 'hero_badge'}
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
{:else if nodeId === 'title' || nodeId === 'hero_title'}
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
    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="hero-title-tag">Level Tipografi (Tag Semantik)</label>
      <select
        id="hero-title-tag"
        value={tagName}
        on:change={(e) => onPropChange('tagName', e.currentTarget.value)}
        class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
      >
        <option value="h1">H1 (Hero Only - SSOT Single H1)</option>
        <option value="h2">H2 (Section Title)</option>
        <option value="h3">H3 (Card Title)</option>
        <option value="h4">H4 (Subtitle/Tagline)</option>
      </select>
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
{:else if nodeId === 'subtitle' || nodeId === 'hero_subtitle'}
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
{:else if nodeId === 'image' || nodeId === 'hero_image' || nodeId === 'hero_media' || nodeId === 'hero_founder_photo' || nodeId === 'hero_bento_image'}
  {#if hasImageSupport}
    <HeroImageNodeForm {section} {onPropChange} />
  {:else}
    <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl">
      Preset tata letak ini tidak menggunakan ilustrasi gambar.
    </p>
  {/if}
{:else if nodeId === 'cta' || nodeId === 'hero_cta' || nodeId === 'hero_cta_primary' || nodeId === 'hero_cta_secondary'}
  <div class="space-y-3">
    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="cta-text-input">Teks Tombol CTA</label>
      <input
        id="cta-text-input"
        type="text"
        value={ctaText}
        on:input={(e) => onPropChange('ctaText', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs"
        placeholder="Lihat Katalog"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="cta-link-input">Tautan Tombol CTA (URL)</label>
      <input
        id="cta-link-input"
        type="text"
        value={ctaLink}
        on:input={(e) => onPropChange('ctaLink', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs font-mono"
        placeholder="#products"
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
        <label class="font-semibold text-base-content" for="cta-height-select">Tinggi Tombol</label>
        <select
          id="cta-height-select"
          value={section.styles?.buttonHeight || 'md'}
          on:change={(e) => onPropChange('buttonHeight', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        >
          {#each btnHeightOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
{:else}
  <HeroExtraNodeForms {section} {nodeId} {onPropChange} />
{/if}
