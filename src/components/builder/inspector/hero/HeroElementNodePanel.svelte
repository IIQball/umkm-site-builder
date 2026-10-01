<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { Sparkles, Type, FileText, MousePointerClick, Image as ImageIcon, Sliders } from 'lucide-svelte';
  import HeroImageStyleSettings from '../../content/hero/HeroImageStyleSettings.svelte';
  import NodeStyleControls from '../NodeStyleControls.svelte';
  import { isHeroNonBackgroundImage, supportsHeroImage } from '../../sections/hero/heroLayout.helpers';
  import { btnVariantOptions } from '../nodeContent.constants';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: activePreset =
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    section.layoutPreset ||
    'split_left_text';

  $: ctaVariant = (section.props?.ctaVariant as string) ?? 'primary';
  $: imageFrame = (section.props?.imageFrame as string) ?? 'none';
  $: imageShape = (section.props?.imageShape as string) ?? 'rounded';

  $: supportsImage = supportsHeroImage(activePreset);
  $: isNonBg = isHeroNonBackgroundImage(activePreset);
  $: isHeroImageVerticalStack = activePreset === 'centered_minimal';

  const ALIAS_MAP: Record<string, string> = {
    hero_badge: 'badge',
    badge: 'hero_badge',
    hero_title: 'title',
    title: 'hero_title',
    hero_subtitle: 'subtitle',
    subtitle: 'hero_subtitle',
    hero_cta: 'cta',
    cta: 'hero_cta',
    hero_cta_primary: 'cta',
    hero_cta_secondary: 'secondary_cta',
    hero_image: 'image',
    image: 'hero_image',
    hero_media: 'image',
    hero_founder_photo: 'image',
  };

  function getNodeStyleVal(id: string, prop: 'color' | 'marginTop' | 'marginBottom'): string {
    const nodeStyles = section.props?.nodeStyles as Record<string, Record<string, string>> | undefined;
    const direct = nodeStyles?.[id]?.[prop];
    if (direct !== undefined && direct !== '') return direct;
    const alias = ALIAS_MAP[id];
    return (alias && nodeStyles?.[alias]?.[prop]) || '';
  }

  function setNodeStyleVal(id: string, prop: 'color' | 'marginTop' | 'marginBottom', value: string) {
    const currentProps = section.props || {};
    const currentNodeStyles = (currentProps.nodeStyles as Record<string, Record<string, string>> | undefined) || {};
    const nodeObj = { ...(currentNodeStyles[id] || {}) };
    nodeObj[prop] = value;

    const alias = ALIAS_MAP[id];
    const updatedStyles = {
      ...currentNodeStyles,
      [id]: nodeObj,
      ...(alias ? { [alias]: nodeObj } : {}),
    };
    onPropChange('nodeStyles', updatedStyles);
  }

  $: isSecondaryCta = nodeId === 'hero_cta_secondary' || nodeId === 'secondary_cta';
</script>

<div class="space-y-4 text-left">
  {#if nodeId === 'badge' || nodeId === 'hero_badge'}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <Sparkles size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Lencana Promo (Badge)</span>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom')}
        colorLabel="Warna Teks Lencana (Token)"
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
        onMarginTopChange={(mt) => setNodeStyleVal(nodeId, 'marginTop', mt)}
        onMarginBottomChange={(mb) => setNodeStyleVal(nodeId, 'marginBottom', mb)}
      />
    </div>

  {:else if nodeId === 'title' || nodeId === 'hero_title'}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <Type size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Judul Utama (H1)</span>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom') || (section.styles?.titleMarginBottom as string) || '0px'}
        colorLabel="Warna Teks Judul (Token)"
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
        onMarginTopChange={(mt) => setNodeStyleVal(nodeId, 'marginTop', mt)}
        onMarginBottomChange={(mb) => {
          setNodeStyleVal(nodeId, 'marginBottom', mb);
          onPropChange('titleMarginBottom', mb);
        }}
      />
    </div>

  {:else if nodeId === 'subtitle' || nodeId === 'hero_subtitle'}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <FileText size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Subjudul & Penjelasan</span>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom') || (section.styles?.subtitleMarginBottom as string) || '0px'}
        colorLabel="Warna Teks Subjudul (Token)"
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
        onMarginTopChange={(mt) => setNodeStyleVal(nodeId, 'marginTop', mt)}
        onMarginBottomChange={(mb) => {
          setNodeStyleVal(nodeId, 'marginBottom', mb);
          onPropChange('subtitleMarginBottom', mb);
        }}
      />
    </div>

  {:else if nodeId === 'cta' || nodeId === 'hero_cta' || nodeId === 'hero_cta_primary' || nodeId === 'hero_cta_secondary' || nodeId === 'secondary_cta'}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <MousePointerClick size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>{isSecondaryCta ? 'Gaya Tombol Aksi Sekunder' : 'Gaya Tombol Aksi (CTA)'}</span>
      </div>
      <div class="space-y-1">
        <label class="block font-semibold text-xs text-base-content/80" for="hero-cta-variant">
          Varian Tombol
        </label>
        <select
          id="hero-cta-variant"
          value={ctaVariant}
          on:change={(e) => onPropChange('ctaVariant', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        >
          {#each btnVariantOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom')}
        colorLabel="Warna Teks Tombol (Token)"
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
        onMarginTopChange={(mt) => setNodeStyleVal(nodeId, 'marginTop', mt)}
        onMarginBottomChange={(mb) => setNodeStyleVal(nodeId, 'marginBottom', mb)}
      />
    </div>

  {:else if nodeId === 'image' || nodeId === 'hero_image' || nodeId === 'hero_media' || nodeId === 'hero_founder_photo' || nodeId === 'hero_bento_image'}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <ImageIcon size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Pengaturan Gaya Gambar</span>
      </div>
      {#if supportsImage}
        {#if isNonBg}
          <HeroImageStyleSettings {imageFrame} {imageShape} {onPropChange} />
        {/if}
        {#if isHeroImageVerticalStack}
          <NodeStyleControls
            showTextColor={false}
            showMargins={true}
            marginTop={getNodeStyleVal(nodeId, 'marginTop')}
            marginBottom={getNodeStyleVal(nodeId, 'marginBottom')}
            onMarginTopChange={(mt) => setNodeStyleVal(nodeId, 'marginTop', mt)}
            onMarginBottomChange={(mb) => setNodeStyleVal(nodeId, 'marginBottom', mb)}
          />
        {/if}
      {:else}
        <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl">
          Preset tata letak ini tidak menggunakan ilustrasi gambar terpisah.
        </p>
      {/if}
    </div>

  {:else}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
        <Sliders size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
        <span>Gaya Elemen Hero</span>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom')}
        onColorChange={(c) => setNodeStyleVal(nodeId, 'color', c)}
        onMarginTopChange={(mt) => setNodeStyleVal(nodeId, 'marginTop', mt)}
        onMarginBottomChange={(mb) => setNodeStyleVal(nodeId, 'marginBottom', mb)}
      />
    </div>
  {/if}
</div>
