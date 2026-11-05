<script lang="ts">
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection;
  export let nodeId: string = 'features_heading';
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: badgeText = (section.props?.badgeText as string) ?? '';
  $: title = (section.props?.title as string) ?? '';
  $: subtitle = (section.props?.subtitle as string) ?? '';

  $: showBadge = nodeId === 'badge' || nodeId === 'feature_badge' || nodeId === 'features_heading' || nodeId === 'header';
  $: showTitle = nodeId === 'title' || nodeId === 'feature_title' || nodeId === 'features_heading' || nodeId === 'header';
  $: showSubtitle = nodeId === 'subtitle' || nodeId === 'feature_subtitle' || nodeId === 'features_heading' || nodeId === 'header';
</script>

<div class="space-y-4 text-left">
  {#if showBadge}
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content/80" for="feat-heading-badge">Badge / Tagline</label>
      <input
        id="feat-heading-badge"
        type="text"
        value={badgeText}
        on:input={(e) => onPropChange('badgeText', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg focus:outline-none focus:border-primary text-xs"
        placeholder="Keunggulan Layanan Kami"
      />
    </div>
  {/if}

  {#if showTitle}
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content/80" for="feat-heading-title">Judul Utama (Heading)</label>
      <input
        id="feat-heading-title"
        type="text"
        value={title}
        on:input={(e) => onPropChange('title', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg focus:outline-none focus:border-primary text-xs"
        placeholder="Kenapa Memilih Produk UMKM Kami?"
      />
    </div>
  {/if}

  {#if showSubtitle}
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content/80" for="feat-heading-subtitle">Subjudul (Subtitle)</label>
      <textarea
        id="feat-heading-subtitle"
        value={subtitle}
        on:input={(e) => onPropChange('subtitle', e.currentTarget.value)}
        rows="3"
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg focus:outline-none focus:border-primary text-xs resize-y"
        placeholder="Penjelasan keunggulan produk/layanan..."></textarea>
    </div>
  {/if}
</div>
