<script lang="ts">
  import {
    Sliders,
    ArrowUpDown,
    ArrowLeftRight,
    ArrowUp,
    ArrowDown,
    RotateCcw,
    Sparkles,
  } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import SpacingSliderItem from './SpacingSliderItem.svelte';
  import {
    PADDING_Y_CHIPS,
    PADDING_X_CHIPS,
    MARGIN_CHIPS,
    SPACING_PRESETS,
  } from './sectionSpacing.data';

  export let section: TemplateSection;
  export let onStyleChange: (key: string, value: string) => void;
  export let applyStyles: (updates: Record<string, string | undefined>) => void;

  let activeTab: 'padding' | 'margin' | 'presets' = 'padding';

  $: padYNum = parseInt(String(section.styles?.paddingTop || '0'), 10) || 0;
  $: padXNum = parseInt(String(section.styles?.paddingLeft || '0'), 10) || 0;
  $: marginTopNum = parseInt(String(section.styles?.marginTop || '0'), 10) || 0;
  $: marginBottomNum = parseInt(String(section.styles?.marginBottom || '0'), 10) || 0;

  function setPadY(num: number) {
    const val = `${num}px`;
    applyStyles({
      paddingTop: val,
      paddingBottom: val,
      padding: `${val} ${padXNum}px`,
    });
  }

  function setPadX(num: number) {
    const val = `${num}px`;
    applyStyles({
      paddingLeft: val,
      paddingRight: val,
      padding: `${padYNum}px ${val}`,
    });
  }

  function setMarginTop(num: number) {
    onStyleChange('marginTop', `${num}px`);
  }

  function setMarginBottom(num: number) {
    onStyleChange('marginBottom', `${num}px`);
  }

  function resetAll() {
    applyStyles({
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      paddingRight: '0px',
      padding: '0px 0px',
      marginTop: '0px',
      marginBottom: '0px',
    });
  }

  function applyQuickPreset(py: number, px: number, my: number) {
    applyStyles({
      paddingTop: `${py}px`,
      paddingBottom: `${py}px`,
      paddingLeft: `${px}px`,
      paddingRight: `${px}px`,
      padding: `${py}px ${px}px`,
      marginTop: `${my}px`,
      marginBottom: `${my}px`,
    });
  }
</script>

<div class="space-y-3.5">
  <!-- Header Title & Quick Reset -->
  <div class="flex items-center justify-between border-b border-base-200 pb-1.5">
    <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/80">
      <Sliders size={13} class="text-[var(--theme-primary,var(--color-primary))]" />
      <span>Jarak & Padding</span>
      <span class="badge badge-xs badge-ghost font-mono text-[9px]">8px Grid</span>
    </div>

    <button
      type="button"
      on:click={resetAll}
      title="Reset semua jarak ke 0px"
      class="btn btn-ghost btn-xs text-[10px] text-base-content/60 hover:text-base-content flex items-center gap-1 px-1.5 h-6 min-h-6"
    >
      <RotateCcw size={11} />
      <span>Reset</span>
    </button>
  </div>

  <!-- Interactive Box Model Visualizer -->
  <div
    class="relative bg-base-200/40 border border-dashed border-base-300 rounded-xl p-2 select-none"
    role="region"
    aria-label="Visual Box Model Spacing"
  >
    <!-- Margin Top Pill -->
    <div class="flex items-center justify-between text-[10px] text-base-content/60 font-semibold mb-1 px-1">
      <span class="tracking-wider">MARGIN (LUAR)</span>
      <button
        type="button"
        on:click={() => (activeTab = 'margin')}
        class="font-mono px-1.5 py-0.5 rounded text-[10px] transition-all {activeTab === 'margin' ? 'bg-secondary !text-white font-bold shadow-2xs' : 'bg-base-200 text-base-content/70 hover:bg-base-300'}"
      >
        Atas: {marginTopNum}px
      </button>
    </div>

    <!-- Inner Box: Padding -->
    <div
      class="bg-primary/10 border border-primary/25 rounded-lg p-2 transition-colors cursor-pointer"
      on:click={() => (activeTab = 'padding')}
      on:keydown={(e) => e.key === 'Enter' && (activeTab = 'padding')}
      tabindex="0"
      role="button"
      aria-label="Buka tab padding"
    >
      <div class="flex items-center justify-between text-[9px] text-primary font-bold mb-1 px-0.5">
        <span class="tracking-wider">PADDING (DALAM)</span>
        <span class="font-mono bg-primary/20 text-primary px-1.5 py-0.5 rounded">
          Y: {padYNum}px
        </span>
      </div>

      <div class="flex items-center justify-between gap-1.5">
        <span class="text-[9px] font-mono text-primary font-bold bg-primary/15 px-1 py-0.5 rounded">
          {padXNum}px
        </span>
        <div class="flex-1 bg-base-100 rounded text-center py-1 px-2 border border-base-200 shadow-2xs">
          <span class="text-[10px] font-bold text-base-content/80 tracking-wider">KONTEN SEKSI</span>
        </div>
        <span class="text-[9px] font-mono text-primary font-bold bg-primary/15 px-1 py-0.5 rounded">
          {padXNum}px
        </span>
      </div>

      <div class="text-center mt-1">
        <span class="text-[9px] font-mono text-primary font-bold bg-primary/15 px-1.5 py-0.5 rounded">
          Y: {padYNum}px
        </span>
      </div>
    </div>

    <!-- Margin Bottom Pill -->
    <div class="flex items-center justify-end text-[10px] text-base-content/60 font-semibold mt-1 px-1">
      <button
        type="button"
        on:click={() => (activeTab = 'margin')}
        class="font-mono px-1.5 py-0.5 rounded text-[10px] transition-all {activeTab === 'margin' ? 'bg-secondary !text-white font-bold shadow-2xs' : 'bg-base-200 text-base-content/70 hover:bg-base-300'}"
      >
        Bawah: {marginBottomNum}px
      </button>
    </div>
  </div>

  <!-- Segmented Tabs -->
  <div class="grid grid-cols-3 gap-1 bg-base-200/60 p-1 rounded-lg text-[11px] font-medium">
    <button
      type="button"
      on:click={() => (activeTab = 'padding')}
      class="py-1 px-2 rounded-md transition-all flex items-center justify-center gap-1 {activeTab === 'padding' ? 'bg-base-100 text-primary font-bold shadow-2xs' : 'text-base-content/70 hover:text-base-content'}"
    >
      <ArrowUpDown size={12} />
      <span>Padding</span>
    </button>
    <button
      type="button"
      on:click={() => (activeTab = 'margin')}
      class="py-1 px-2 rounded-md transition-all flex items-center justify-center gap-1 {activeTab === 'margin' ? 'bg-base-100 text-secondary font-bold shadow-2xs' : 'text-base-content/70 hover:text-base-content'}"
    >
      <ArrowUp size={12} />
      <span>Margin</span>
    </button>
    <button
      type="button"
      on:click={() => (activeTab = 'presets')}
      class="py-1 px-2 rounded-md transition-all flex items-center justify-center gap-1 {activeTab === 'presets' ? 'bg-base-100 text-base-content font-bold shadow-2xs' : 'text-base-content/70 hover:text-base-content'}"
    >
      <Sparkles size={12} />
      <span>Preset</span>
    </button>
  </div>

  <!-- TAB CONTENT -->
  {#if activeTab === 'padding'}
    <div class="space-y-3.5">
      <SpacingSliderItem
        id="range-pad-y"
        label="Padding Vertikal (Tinggi Seksi)"
        value={padYNum}
        min={0}
        max={96}
        step={8}
        chips={PADDING_Y_CHIPS}
        color="primary"
        onChange={setPadY}
      >
        <ArrowUpDown size={12} slot="icon" class="text-primary" />
      </SpacingSliderItem>

      <div class="pt-2 border-t border-base-200">
        <SpacingSliderItem
          id="range-pad-x"
          label="Padding Horizontal (Samping)"
          value={padXNum}
          min={0}
          max={48}
          step={8}
          chips={PADDING_X_CHIPS}
          color="primary"
          onChange={setPadX}
        >
          <ArrowLeftRight size={12} slot="icon" class="text-primary" />
        </SpacingSliderItem>
      </div>
    </div>
  {:else if activeTab === 'margin'}
    <div class="space-y-3.5">
      <SpacingSliderItem
        id="range-margin-top"
        label="Margin Atas (Jarak ke Atas)"
        value={marginTopNum}
        min={0}
        max={64}
        step={8}
        chips={MARGIN_CHIPS}
        color="secondary"
        onChange={setMarginTop}
      >
        <ArrowUp size={12} slot="icon" class="text-secondary" />
      </SpacingSliderItem>

      <div class="pt-2 border-t border-base-200">
        <SpacingSliderItem
          id="range-margin-bot"
          label="Margin Bawah (Jarak ke Bawah)"
          value={marginBottomNum}
          min={0}
          max={64}
          step={8}
          chips={MARGIN_CHIPS}
          color="secondary"
          onChange={setMarginBottom}
        >
          <ArrowDown size={12} slot="icon" class="text-secondary" />
        </SpacingSliderItem>
      </div>
    </div>
  {:else if activeTab === 'presets'}
    <div class="space-y-2">
      <span class="block text-[11px] font-semibold text-base-content/70 mb-1">
        Pilih Profil Jarak Seksi Cepat:
      </span>
      <div class="grid grid-cols-1 gap-1.5">
        {#each SPACING_PRESETS as p}
          <button
            type="button"
            on:click={() => applyQuickPreset(p.py, p.px, p.my)}
            class="flex items-center justify-between p-2 rounded-lg bg-base-200/50 hover:bg-base-200 border border-base-300/60 transition-all text-left group"
          >
            <div>
              <span class="block font-bold text-xs text-base-content group-hover:text-primary transition-colors">
                {p.label}
              </span>
              <span class="text-[10px] text-base-content/60">{p.desc}</span>
            </div>
            <div class="text-right font-mono text-[10px] text-base-content/50">
              <div>Pad: {p.py}px / {p.px}px</div>
              <div>Mar: {p.my}px</div>
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
