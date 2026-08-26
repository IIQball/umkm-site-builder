<script lang="ts">
  import { editorStore } from '../../stores/editorStore';

  export let buttons: Record<string, unknown>;
  export let layout: Record<string, unknown>;

  const radiusPresets = [
    { label: 'Sharp (0px)', value: '0px' },
    { label: 'SM (4px)', value: '4px' },
    { label: 'MD (8px)', value: '8px' },
    { label: 'LG (16px)', value: '16px' },
    { label: 'Pill (9999px)', value: '9999px' },
  ];

  $: currentButtonRadius = String(buttons?.borderRadius || '8px');
  $: currentLayoutRadius = String(layout?.borderRadius || '16px');

  const handleButtonRadius = (val: string) => {
    editorStore.updateDesignSystemTheme('buttons', { borderRadius: val });
  };

  const handleLayoutRadius = (val: string) => {
    editorStore.updateDesignSystemTheme('layout', { borderRadius: val });
  };
</script>

<div class="space-y-4">
  <div>
    <span class="block font-semibold text-xs text-base-content/80 mb-2">Radius Sudut Tombol (Button)</span>
    <div class="grid grid-cols-3 gap-1.5 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-xs">
      {#each radiusPresets as r}
        <button
          type="button"
          on:click={() => handleButtonRadius(r.value)}
          class="py-1 px-1.5 rounded font-medium text-center transition-colors cursor-pointer {currentButtonRadius === r.value ? 'bg-base-100 font-bold text-primary shadow-sm' : 'text-base-content/60'}"
        >
          {r.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="pt-3 border-t border-base-200 dark:border-slate-800">
    <span class="block font-semibold text-xs text-base-content/80 mb-2">Radius Sudut Kartu (Layout Surface)</span>
    <div class="grid grid-cols-3 gap-1.5 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-xs">
      {#each radiusPresets as r}
        <button
          type="button"
          on:click={() => handleLayoutRadius(r.value)}
          class="py-1 px-1.5 rounded font-medium text-center transition-colors cursor-pointer {currentLayoutRadius === r.value ? 'bg-base-100 font-bold text-primary shadow-sm' : 'text-base-content/60'}"
        >
          {r.label}
        </button>
      {/each}
    </div>
  </div>
</div>
