<script lang="ts">
  import { editorStore } from '../../stores/editorStore';

  export let typography: Record<string, unknown>;

  const fontOptions = [
    { label: 'Inter (Sans)', value: 'Inter, sans-serif' },
    { label: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif' },
    { label: 'Poppins', value: 'Poppins, sans-serif' },
    { label: 'Outfit', value: 'Outfit, sans-serif' },
    { label: 'Playfair Display (Serif)', value: '"Playfair Display", serif' },
    { label: 'Merriweather (Serif)', value: 'Merriweather, serif' },
  ];

  $: currentHeadingFont = String(typography?.headingFont || fontOptions[0].value);
  $: currentBodyFont = String(typography?.fontFamily || fontOptions[0].value);

  const handleFontChange = (type: 'fontFamily' | 'headingFont', val: string) => {
    editorStore.updateDesignSystemTheme('typography', { [type]: val });
  };
</script>

<div class="space-y-4">
  <div>
    <label for="theme-heading-font" class="block font-semibold text-xs text-base-content/80 mb-1">Font Judul (Heading)</label>
    <select
      id="theme-heading-font"
      value={currentHeadingFont}
      on:change={(e) => handleFontChange('headingFont', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
    >
      {#each fontOptions as f}
        <option value={f.value}>{f.label}</option>
      {/each}
    </select>
  </div>

  <div>
    <label for="theme-body-font" class="block font-semibold text-xs text-base-content/80 mb-1">Font Body (Teks Umum)</label>
    <select
      id="theme-body-font"
      value={currentBodyFont}
      on:change={(e) => handleFontChange('fontFamily', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
    >
      {#each fontOptions as f}
        <option value={f.value}>{f.label}</option>
      {/each}
    </select>
  </div>
</div>
