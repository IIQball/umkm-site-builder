<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import type { FeatureItem } from '@/types';
  import { FEATURE_ICON_OPTIONS } from '../../sections/features/featureIcons';
  import { ITEM_IMAGE_FEATURE_PRESETS } from '../../sections/features/features.helpers';
  import SearchableIconDropdown from '../SearchableIconDropdown.svelte';
  import ImageUploadDropzone from '../ImageUploadDropzone.svelte';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: activePreset = (section.layoutPreset || section.props?.layoutPreset || section.styles?.layoutPreset || 'grid_3_cards') as string;
  $: hasItemImages = ITEM_IMAGE_FEATURE_PRESETS.includes(activePreset);

  $: itemIndex = Math.max(
    0,
    parseInt(nodeId.replace('feature_item_', '').replace('item_', ''), 10) || 0
  );

  $: itemsKey = Array.isArray(section.props?.items) ? 'items' : 'features';
  $: rawList = ((section.props?.[itemsKey] as FeatureItem[]) ||
    (section.props?.features as FeatureItem[]) ||
    (section.props?.items as FeatureItem[]) ||
    []) as FeatureItem[];

  $: currentItem = (rawList[itemIndex] || {
    title: `Fitur #${itemIndex + 1}`,
    description: 'Deskripsi keunggulan produk/layanan Anda.',
    icon: 'sparkles',
    iconName: 'sparkles',
  }) as FeatureItem;

  function updateItemField(field: keyof FeatureItem, value: unknown) {
    const list = [...rawList];
    while (list.length <= itemIndex) {
      list.push({
        id: `f-${list.length}`,
        title: `Fitur #${list.length + 1}`,
        description: 'Deskripsi keunggulan...',
        icon: 'sparkles',
        iconName: 'sparkles',
      });
    }

    list[itemIndex] = {
      ...list[itemIndex],
      [field]: value,
    };

    if (field === 'icon') {
      list[itemIndex].iconName = String(value);
    } else if (field === 'iconName') {
      list[itemIndex].icon = String(value);
    }

    onPropChange(itemsKey, list);
    if (itemsKey === 'items' && section.props?.features) {
      onPropChange('features', list);
    }
  }
</script>

<div class="space-y-3.5 text-left">
  <!-- Icon Selector with Search -->
  <div class="space-y-1">
    <SearchableIconDropdown
      label="Ikon Fitur"
      options={FEATURE_ICON_OPTIONS}
      selectedIcon={currentItem.iconName || currentItem.icon || 'sparkles'}
      onSelect={(val) => updateItemField('icon', val)}
    />
  </div>

  <!-- Title Input -->
  <div class="space-y-1">
    <label class="font-semibold text-xs text-base-content/80" for="feat-item-title">Judul Fitur / Benefit</label>
    <input
      id="feat-item-title"
      type="text"
      value={currentItem.title || ''}
      on:input={(e) => updateItemField('title', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg focus:outline-none focus:border-primary text-xs"
      placeholder="Judul Fitur"
    />
  </div>

  <!-- Description Textarea -->
  <div class="space-y-1">
    <label class="font-semibold text-xs text-base-content/80" for="feat-item-desc">Deskripsi Singkat</label>
    <textarea
      id="feat-item-desc"
      value={currentItem.description || ''}
      on:input={(e) => updateItemField('description', e.currentTarget.value)}
      rows="3"
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg focus:outline-none focus:border-primary text-xs resize-y"
      placeholder="Deskripsi keunggulan..."></textarea>
  </div>

  <!-- Badge & Stat Label -->
  <div class="grid grid-cols-2 gap-2">
    <div class="space-y-1">
      <label class="font-semibold text-[11px] text-base-content/70" for="feat-item-badge">Badge (Opsional)</label>
      <input
        id="feat-item-badge"
        type="text"
        value={currentItem.badge || ''}
        on:input={(e) => updateItemField('badge', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        placeholder="Alami & Murni"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-[11px] text-base-content/70" for="feat-item-stat">Label / CTA</label>
      <input
        id="feat-item-stat"
        type="text"
        value={currentItem.statLabel || ''}
        on:input={(e) => updateItemField('statLabel', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        placeholder="Terverifikasi BPOM"
      />
    </div>
  </div>

  <!-- Item Image Upload (Only for presets supporting per-item images) -->
  {#if hasItemImages}
    <div class="pt-2 border-t border-base-300">
      <ImageUploadDropzone
        imageUrl={currentItem.imageUrl || ''}
        onImageChange={(url) => updateItemField('imageUrl', url)}
        label={`Gambar Fitur #${itemIndex + 1}`}
        placeholderTitle="Tarik & Lepas Gambar ke Sini"
        placeholderSubtitle="pilih berkas gambar manual"
      />
    </div>
  {/if}

  <!-- Link URL -->
  <div class="space-y-1">
    <label class="font-semibold text-xs text-base-content/80" for="feat-item-link">Link / URL Tautan (Opsional)</label>
    <input
      id="feat-item-link"
      type="text"
      value={currentItem.linkUrl || ''}
      on:input={(e) => updateItemField('linkUrl', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg focus:outline-none focus:border-primary text-xs"
      placeholder="https://... atau #catalog"
    />
  </div>
</div>
