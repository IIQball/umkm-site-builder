<script lang="ts">
  import { editorStore } from '../../stores/editorStore';

  export let colors: Record<string, string>;

  const colorFields: Array<{ key: string; label: string; defaultVal: string }> = [
    { key: 'primary', label: 'Primary Brand Color', defaultVal: '#3b82f6' },
    { key: 'secondary', label: 'Secondary / Accent Color', defaultVal: '#64748b' },
    { key: 'background', label: 'Canvas Background', defaultVal: '#ffffff' },
    { key: 'surface', label: 'Card / Surface Background', defaultVal: '#f8fafc' },
    { key: 'textPrimary', label: 'Heading & Primary Text', defaultVal: '#0f172a' },
    { key: 'textMuted', label: 'Body & Secondary Text', defaultVal: '#64748b' },
  ];

  const handleColorChange = (key: string, value: string) => {
    editorStore.updateDesignSystemTheme('colors', { [key]: value });
  };
</script>

<div class="space-y-4">
  <div class="grid grid-cols-1 gap-3">
    {#each colorFields as field}
      <div class="flex items-center justify-between p-2.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-xl">
        <div class="flex items-center gap-3">
          <input
            type="color"
            value={colors[field.key] || field.defaultVal}
            on:input={(e) => handleColorChange(field.key, e.currentTarget.value)}
            class="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
          />
          <div>
            <span class="block font-semibold text-xs text-base-content">{field.label}</span>
            <span class="font-mono text-[10px] text-base-content/50 uppercase">{colors[field.key] || field.defaultVal}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
