<script lang="ts">
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: badgeText = (section.props?.badgeText as string) ?? '';
  $: title = (section.props?.title as string) ?? '';
  $: subtitle = (section.props?.subtitle as string) ?? '';
  $: titleTag = (section.props?.titleTag as string) || 'h2';

  let h1Warning = false;

  const handleTagChange = (newTag: string) => {
    if (newTag === 'h1') {
      h1Warning = true;
      onPropChange('titleTag', 'h2');
    } else {
      h1Warning = false;
      onPropChange('titleTag', newTag);
    }
  };
</script>

<div class="space-y-4 text-left">
  <div class="space-y-1">
    <label class="font-semibold text-xs text-base-content/80" for="feat-heading-badge">Badge / Tagline</label>
    <input
      id="feat-heading-badge"
      type="text"
      value={badgeText}
      on:input={(e) => onPropChange('badgeText', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs"
      placeholder="Keunggulan Layanan Kami"
    />
  </div>

  <div class="space-y-1">
    <label class="font-semibold text-xs text-base-content/80" for="feat-heading-title">Judul Utama (Heading)</label>
    <input
      id="feat-heading-title"
      type="text"
      value={title}
      on:input={(e) => onPropChange('title', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs"
      placeholder="Kenapa Memilih Produk UMKM Kami?"
    />
  </div>

  <div class="space-y-1">
    <label class="font-semibold text-xs text-base-content/80" for="feat-title-tag">Level Tipografi (Tag Semantik)</label>
    <select
      id="feat-title-tag"
      value={titleTag}
      on:change={(e) => handleTagChange(e.currentTarget.value)}
      class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
    >
      <option value="h2">H2 (Section Title - Rekomendasi)</option>
      <option value="h3">H3 (Card Title)</option>
      <option value="h4">H4 (Subtitle/Tagline)</option>
      <option value="p">Body (Paragraf)</option>
      <option value="h1">H1 (Hero Only)</option>
    </select>
    {#if h1Warning}
      <p class="text-rose-500 text-[11px] font-medium leading-tight mt-1">
        ⚠️ Peringatan: Tag H1 hanya diperbolehkan satu kali pada Section Hero (Single H1 Policy SSOT). Otomatis disetel ke H2.
      </p>
    {/if}
  </div>

  <div class="space-y-1">
    <label class="font-semibold text-xs text-base-content/80" for="feat-heading-subtitle">Subjudul (Subtitle)</label>
    <textarea
      id="feat-heading-subtitle"
      value={subtitle}
      on:input={(e) => onPropChange('subtitle', e.currentTarget.value)}
      rows="3"
      class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs resize-y"
      placeholder="Penjelasan keunggulan produk/layanan..."></textarea>
  </div>
</div>
