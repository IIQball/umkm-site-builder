<script lang="ts">
  import { Badge, Button } from '@/components/ui';
  import { PRESET_COLOR_PALETTES } from './logo-wizard.constants';
  import { HEX_COLOR_REGEX } from '@/lib/validators/ai-logo';

  export let selectedColors: string[] = ['#C85A32', '#F7F4EE', '#2A2A2A'];
  export let error: string = '';

  let customColorInput: string = '#10B981';

  function applyPreset(colors: string[]) {
    selectedColors = [...colors].slice(0, 3);
    error = '';
  }

  function addCustomColor() {
    const trimmed = customColorInput.trim();
    if (!HEX_COLOR_REGEX.test(trimmed)) {
      error = 'Format warna tidak valid';
      return;
    }
    if (selectedColors.length >= 3) {
      error = 'Maksimal 3 warna agar logo tetap simpel dan elegan';
      return;
    }
    if (selectedColors.includes(trimmed.toUpperCase())) {
      error = 'Warna ini sudah ada di dalam pilihan';
      return;
    }
    selectedColors = [...selectedColors, trimmed.toUpperCase()];
    error = '';
  }

  function removeColor(index: number) {
    if (selectedColors.length <= 1) {
      error = 'Pilih minimal 1 warna dasar untuk logo Anda';
      return;
    }
    selectedColors = selectedColors.filter((_, i) => i !== index);
    error = '';
  }
</script>

<div>
  <div class="flex items-center justify-between mb-2">
    <span class="block text-label-caps text-muted">
      Pilihan Warna Logo <span class="text-error">*</span>
    </span>
    <Badge variant={selectedColors.length === 3 ? 'warning' : 'info'} size="sm" dot={true}>
      {selectedColors.length}/3 Warna (Maksimal)
    </Badge>
  </div>

  <!-- Pilihan Kombinasi Warna Cepat -->
  <div class="mb-3">
    <span class="text-2xs text-muted block mb-1.5 font-medium">Kombinasi Warna Siap Pakai:</span>
    <div class="flex flex-wrap gap-2">
      {#each PRESET_COLOR_PALETTES as preset}
        {@const isActive = preset.colors.slice(0, 3).join(',') === selectedColors.join(',')}
        <button
          type="button"
          class="px-2.5 py-1 text-xs rounded-xl border-2 flex items-center gap-1.5 transition-all cursor-pointer {isActive
            ? 'border-primary ring-2 ring-primary/30 bg-primary/10 shadow-xs text-main font-semibold'
            : 'border-light bg-nested hover:bg-card text-secondary'}"
          on:click={() => applyPreset(preset.colors)}
        >
          <div class="flex -space-x-1">
            {#each preset.colors as color}
              <span class="w-3 h-3 rounded-full border border-card shadow-xs" style="background-color: {color};"></span>
            {/each}
          </div>
          <span class="text-2xs">{preset.name}</span>
          {#if isActive}
            <span class="text-primary flex items-center justify-center ml-0.5" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- Warna yang Sedang Dipilih -->
  <div class="p-3 bg-nested rounded-2xl border border-light space-y-3">
    <div class="flex flex-wrap items-center gap-2">
      {#each selectedColors as color, index}
        <div class="flex items-center gap-1.5 px-2.5 py-1.5 bg-card rounded-xl border-2 border-primary/30 shadow-2xs">
          <span
            class="w-4 h-4 rounded-full border border-light/60 shadow-inner flex-shrink-0"
            style="background-color: {color};"
          ></span>
          <span class="text-xs font-mono font-bold text-main">{color}</span>
          <button
            type="button"
            class="ml-1 text-muted hover:text-error transition-colors p-0.5 rounded cursor-pointer"
            on:click={() => removeColor(index)}
            aria-label="Hapus warna {color}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      {/each}
    </div>

    {#if selectedColors.length < 3}
      <div class="flex items-center gap-2 pt-2 border-t border-light/60">
        <input
          type="color"
          bind:value={customColorInput}
          class="w-8 h-8 rounded-lg cursor-pointer border border-light p-0.5 bg-card"
          title="Pilih warna"
        />
        <input
          type="text"
          bind:value={customColorInput}
          placeholder="#HEX"
          maxlength="7"
          class="w-24 px-2 py-1 text-xs font-mono rounded-lg border border-light bg-card text-main uppercase"
        />
        <Button size="xs" variant="secondary" on:click={addCustomColor}>
          + Tambah Warna
        </Button>
      </div>
    {/if}
  </div>

  {#if error}
    <p class="text-xs text-error mt-1.5">{error}</p>
  {/if}
</div>
