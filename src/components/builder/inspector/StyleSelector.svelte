<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let styles: Record<string, string> = {};
  const dispatch = createEventDispatcher();

  const update = (key: string, value: string) => {
    const updated = { ...styles, [key]: value };
    dispatch("change", updated);
  };

  const textTokenOptions = [
    { value: '', label: 'Default (Warisan Tema)' },
    { value: 'var(--theme-text-primary, #0f172a)', label: 'Teks Utama (Primary)' },
    { value: 'var(--theme-text-muted, #64748b)', label: 'Teks Redup (Muted)' },
    { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
    { value: '#ffffff', label: 'Putih Bersih' },
  ];

  const bgTokenOptions = [
    { value: 'transparent', label: 'Transparan' },
    { value: 'var(--theme-bg, #ffffff)', label: 'Background Kanvas' },
    { value: 'var(--theme-surface, #f8fafc)', label: 'Surface / Card Background' },
    { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
  ];

  const typographyTokenOptions = [
    { value: '', label: 'Default (Tema)' },
    { value: 'var(--theme-text-caption, 10px)', label: 'Caption / Badge (10px)' },
    { value: 'var(--theme-text-body, 16px)', label: 'Body Text (16px)' },
    { value: 'var(--theme-text-h3, 20px)', label: 'H3 - Subtitle / Card (20px)' },
    { value: 'var(--theme-text-h2, 26px)', label: 'H2 - Section Heading (26px)' },
    { value: 'var(--theme-text-h1, 42px)', label: 'H1 - Hero Title (42px)' },
  ];
</script>

<div class="space-y-2 text-xs">
  <!-- Typography Token Scale -->
  <div class="flex items-center gap-2">
    <label class="font-medium w-24" for="style-font-size">Tipografi</label>
    <select
      id="style-font-size"
      class="select select-xs flex-1 bg-base-100 border border-base-300 dark:border-slate-800 rounded"
      value={styles.fontSize || ""}
      on:change={(e) => update("fontSize", e.currentTarget.value)}
    >
      {#each typographyTokenOptions as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
  </div>

  <!-- Text Color Token -->
  <div class="flex items-center gap-2">
    <label class="font-medium w-24" for="style-color">Warna Teks</label>
    <select
      id="style-color"
      class="select select-xs flex-1 bg-base-100 border border-base-300 dark:border-slate-800 rounded"
      value={styles.color || ""}
      on:change={(e) => update("color", e.currentTarget.value)}
    >
      {#each textTokenOptions as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
  </div>

  <!-- Background Color Token -->
  <div class="flex items-center gap-2">
    <label class="font-medium w-24" for="style-bg-color">Warna BG</label>
    <select
      id="style-bg-color"
      class="select select-xs flex-1 bg-base-100 border border-base-300 dark:border-slate-800 rounded"
      value={styles.backgroundColor || "transparent"}
      on:change={(e) => update("backgroundColor", e.currentTarget.value)}
    >
      {#each bgTokenOptions as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
  </div>
</div>

