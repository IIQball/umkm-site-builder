<script lang="ts">
  import {
    Monitor,
    Tablet,
    Smartphone,
    Undo2,
    Redo2,
    Grid,
    Grid2X2,
  } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import { editorStore, canvasStore, canUndo, canRedo } from '../stores/editorStore';

  export let viewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  export let onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
</script>

<!-- Center: Responsive Mode Switcher & Guides -->
<div class="flex items-center gap-1.5 sm:gap-3">
  <!-- Undo / Redo buttons -->
  <div class="hidden sm:flex items-center bg-nested rounded-lg p-0.5 border border-light">
    <Button
      type="button"
      size="xs"
      variant="ghost"
      on:click={() => editorStore.undo()}
      disabled={!$canUndo}
      class="!p-1 !h-auto !min-h-0 rounded text-secondary hover:text-main hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed"
      title="Undo (Ctrl+Z)"
    >
      <Undo2 size={13} />
    </Button>
    <Button
      type="button"
      size="xs"
      variant="ghost"
      on:click={() => editorStore.redo()}
      disabled={!$canRedo}
      class="!p-1 !h-auto !min-h-0 rounded text-secondary hover:text-main hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed"
      title="Redo (Ctrl+Shift+Z)"
    >
      <Redo2 size={13} />
    </Button>
  </div>

  <!-- Device breakpoint toggles -->
  <div class="flex items-center bg-nested rounded-lg p-0.5 border border-light">
    <Button
      type="button"
      size="xs"
      variant={viewMode === 'desktop' ? 'secondary' : 'ghost'}
      on:click={() => onViewModeChange('desktop')}
      class="!flex !items-center !gap-1 !px-2 !py-1 !h-auto !min-h-0 rounded text-xs {viewMode === 'desktop' ? 'bg-card text-main font-semibold shadow-xs' : 'text-secondary hover:text-main'}"
      title="Desktop (100% full width)"
    >
      <Monitor size={12} />
      <span class="hidden md:inline text-3xs">Desktop</span>
    </Button>

    <Button
      type="button"
      size="xs"
      variant={viewMode === 'tablet' ? 'secondary' : 'ghost'}
      on:click={() => onViewModeChange('tablet')}
      class="!flex !items-center !gap-1 !px-2 !py-1 !h-auto !min-h-0 rounded text-xs {viewMode === 'tablet' ? 'bg-card text-main font-semibold shadow-xs' : 'text-secondary hover:text-main'}"
      title="Tablet (768px)"
    >
      <Tablet size={12} />
      <span class="hidden md:inline text-3xs">Tablet</span>
    </Button>

    <Button
      type="button"
      size="xs"
      variant={viewMode === 'mobile' ? 'secondary' : 'ghost'}
      on:click={() => onViewModeChange('mobile')}
      class="!flex !items-center !gap-1 !px-2 !py-1 !h-auto !min-h-0 rounded text-xs {viewMode === 'mobile' ? 'bg-card text-main font-semibold shadow-xs' : 'text-secondary hover:text-main'}"
      title="Mobile (375px)"
    >
      <Smartphone size={12} />
      <span class="hidden md:inline text-3xs">Mobile</span>
    </Button>
  </div>

  <!-- Figma-style Columns & Pixel Grid Guide Toggles -->
  <div class="hidden lg:flex items-center bg-nested rounded-lg p-0.5 border border-light">
    <Button
      type="button"
      size="xs"
      variant={$canvasStore.showColumnGrid ? 'secondary' : 'ghost'}
      on:click={() => canvasStore.toggleColumnGrid()}
      class="!flex !items-center !gap-1 !px-2 !py-1 !h-auto !min-h-0 rounded text-xs {$canvasStore.showColumnGrid ? 'bg-card text-primary font-semibold shadow-xs' : 'text-secondary hover:text-main'}"
      title="Toggle Figma 12/8/4 Column Layout Grid (Ctrl+G)"
    >
      <Grid size={12} />
      <span class="text-3xs">Kolom</span>
    </Button>

    <Button
      type="button"
      size="xs"
      variant={$canvasStore.showPixelGrid ? 'secondary' : 'ghost'}
      on:click={() => canvasStore.togglePixelGrid()}
      class="!flex !items-center !gap-1 !px-2 !py-1 !h-auto !min-h-0 rounded text-xs {$canvasStore.showPixelGrid ? 'bg-card text-primary font-semibold shadow-xs' : 'text-secondary hover:text-main'}"
      title="Toggle 8px Pixel Grid Pattern"
    >
      <Grid2X2 size={12} />
      <span class="text-3xs">Grid</span>
    </Button>
  </div>
</div>
