<script lang="ts">
  import { Sun, Moon } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { getStoredTheme, applyTheme } from '@/lib/utils/theme';
  import { onMount } from 'svelte';

  export let size: 'sm' | 'md' = 'sm';
  export let customClass: string = '';

  let isDark = false;

  $: if ($canvasStore) {
    isDark = $canvasStore.editorTheme === 'dark' || $canvasStore.previewTheme === 'dark';
  }

  onMount(() => {
    if (!$canvasStore?.editorTheme) {
      isDark = getStoredTheme() === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark';
    }
  });

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation();
    if (typeof canvasStore?.toggleEditorTheme === 'function') {
      canvasStore.toggleEditorTheme();
    } else {
      const current = getStoredTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      isDark = next === 'dark';
    }
  };
  $: sizePadding = size === 'md' ? 'p-2.5' : 'p-2';
  $: iconSize = size === 'md' ? 18 : 16;
</script>

<button
  type="button"
  on:click={handleToggle}
  class={`${sizePadding} text-muted hover:text-main hover:bg-nested rounded-full transition-colors active:scale-95 group cursor-pointer flex items-center justify-center flex-shrink-0 ${customClass}`}
  aria-label="Ganti mode tema"
  title={isDark ? 'Ubah ke Mode Terang' : 'Ubah ke Mode Gelap'}
>
  {#if isDark}
    <Sun size={iconSize} class="text-warning transition-transform duration-300 group-hover:rotate-90" />
  {:else}
    <Moon size={iconSize} class="text-secondary transition-transform duration-300 group-hover:-rotate-45" />
  {/if}
</button>

