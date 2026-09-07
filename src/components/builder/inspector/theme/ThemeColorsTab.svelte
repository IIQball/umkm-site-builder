<script lang="ts">
  import type { TemplateTheme } from '@/schemas';
  import { DEFAULT_THEME_COLOR_FIELDS } from '@/components/tokens/colors';

  export let theme: TemplateTheme;
  export let onColorChange: (key: string, value: string) => void = () => {};

  $: colors = theme.colors || {};

  const getColorVal = (key: string, defaultVal: string): string => {
    const record = colors as Record<string, string | undefined>;
    return record?.[key] || defaultVal;
  };
</script>

<div class="space-y-3">
  {#each DEFAULT_THEME_COLOR_FIELDS as item}
    {@const val = getColorVal(item.key, item.defaultVal)}
    <div>
      <label for={`color-${item.key}`} class="block font-semibold text-base-content/80 mb-1">{item.label}</label>
      <div class="flex items-center gap-2">
        <input
          id={`color-${item.key}`}
          type="color"
          value={val}
          on:input={(e) => onColorChange(item.key, e.currentTarget.value)}
          on:change={(e) => onColorChange(item.key, e.currentTarget.value)}
          class="w-8 h-8 rounded border border-base-300 dark:border-slate-700 cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={val}
          on:input={(e) => onColorChange(item.key, e.currentTarget.value)}
          on:change={(e) => onColorChange(item.key, e.currentTarget.value)}
          class="flex-1 px-3 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content font-mono uppercase text-xs"
        />
      </div>
    </div>
  {/each}
</div>
