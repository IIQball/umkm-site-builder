<script lang="ts">
  import { PaintBucket } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection;
  export let onStyleChange: (key: string, value: string) => void;

  const bgTokenOptions = [
    { value: 'transparent', label: 'Transparan' },
    { value: 'var(--theme-bg, #ffffff)', label: 'Background Kanvas (Canvas)' },
    { value: 'var(--theme-surface, #f8fafc)', label: 'Surface / Card Background' },
    { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand (Warna Utama)' },
    { value: 'var(--theme-secondary, #2563eb)', label: 'Secondary / Accent' },
  ];
</script>

<div class="space-y-4">
  <!-- Token-Based Background Color -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70 border-b border-base-200 pb-1.5">
      <PaintBucket size={13} class="text-primary" />
      <span>Warna Background (Token Sistem)</span>
    </div>

    <div>
      <label for="style-bg-token" class="block font-semibold text-xs text-base-content/80 mb-1">
        Background Section
      </label>
      <select
        id="style-bg-token"
        value={section.styles?.backgroundColor || 'transparent'}
        on:change={(e) => onStyleChange('backgroundColor', e.currentTarget.value)}
        on:input={(e) => onStyleChange('backgroundColor', e.currentTarget.value)}
        class="w-full px-2.5 py-2 bg-base-200/50 border border-base-300 rounded-lg text-xs text-base-content focus:outline-none focus:border-primary"
      >
        {#each bgTokenOptions as bg}
          <option value={bg.value}>{bg.label}</option>
        {/each}
      </select>
    </div>
  </div>
</div>

