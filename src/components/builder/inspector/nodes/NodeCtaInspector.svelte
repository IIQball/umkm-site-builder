<script lang="ts">
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection;
  export let onPropChange: (key: string, value: unknown) => void;
</script>

<div class="space-y-3">
  <div>
    <label for="node-cta-text" class="block font-semibold text-base-content/80 mb-1">Teks Tombol CTA</label>
    <input
      id="node-cta-text"
      type="text"
      value={section.props?.ctaText ?? ''}
      on:input={(e) => onPropChange('ctaText', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
      placeholder="Lihat Katalog"
    />
  </div>

  <div>
    <label for="node-cta-link" class="block font-semibold text-base-content/80 mb-1">Tujuan Tautan / Link</label>
    <input
      id="node-cta-link"
      type="text"
      value={section.props?.ctaLink ?? ''}
      on:input={(e) => onPropChange('ctaLink', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
      placeholder="#catalog"
    />
  </div>
</div>
