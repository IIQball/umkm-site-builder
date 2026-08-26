<script lang="ts">
  import { Palette, Type, MousePointerClick } from 'lucide-svelte';
  import { editorStore } from '../stores/editorStore';
  import type { TemplateTheme } from '@/schemas';
  import type { ThemeTab } from '@/types/templates';
  import ThemeColorsTab from './theme/ThemeColorsTab.svelte';
  import ThemeTypographyTab from './theme/ThemeTypographyTab.svelte';
  import ThemeButtonsLayoutTab from './theme/ThemeButtonsLayoutTab.svelte';

  let activeTab: ThemeTab = 'colors';

  $: theme = ($editorStore.template?.config.theme || {}) as TemplateTheme;
  $: colors = (theme.colors || {}) as Record<string, string>;
  $: typography = (theme.typography || {}) as Record<string, unknown>;
  $: buttons = (theme.buttons || {}) as Record<string, unknown>;
  $: layout = (theme.layout || {}) as Record<string, unknown>;
</script>

<div class="space-y-4 text-xs">
  <!-- Tab Navigation -->
  <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-xl border border-base-300 dark:border-slate-800">
    <button
      type="button"
      on:click={() => (activeTab = 'colors')}
      class="flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer {activeTab === 'colors' ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/60'}"
    >
      <Palette size={13} />
      <span>Warna</span>
    </button>
    <button
      type="button"
      on:click={() => (activeTab = 'typography')}
      class="flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer {activeTab === 'typography' ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/60'}"
    >
      <Type size={13} />
      <span>Tipografi</span>
    </button>
    <button
      type="button"
      on:click={() => (activeTab = 'buttons')}
      class="flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer {activeTab === 'buttons' ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/60'}"
    >
      <MousePointerClick size={13} />
      <span>Bentuk</span>
    </button>
  </div>

  <!-- Tab Content -->
  {#if activeTab === 'colors'}
    <ThemeColorsTab {colors} />
  {:else if activeTab === 'typography'}
    <ThemeTypographyTab {typography} />
  {:else if activeTab === 'buttons'}
    <ThemeButtonsLayoutTab {buttons} {layout} />
  {/if}
</div>
