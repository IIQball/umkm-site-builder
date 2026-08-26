<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../../stores/editorStore';
  import { Sparkles } from 'lucide-svelte';

  export let section: TemplateSection;
  export let onPropChange: (key: string, value: unknown) => void;

  function getTitleStyle(property: 'color' | 'backgroundColor'): string {
    const nodeStyles = section.props?.nodeStyles as Record<string, Record<string, string>> | undefined;
    return nodeStyles?.title?.[property] ?? '';
  }
</script>

<div class="space-y-3">
  <div>
    <label for="node-hero-title" class="block font-semibold text-base-content/80 mb-1">Judul Heading</label>
    <input
      id="node-hero-title"
      type="text"
      value={section.props?.title ?? ''}
      on:input={(e) => {
        const val = e.currentTarget.value;
        onPropChange('title', val);
        editorStore.updateSectionProps(section.id, { title: val });
      }}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
      placeholder="Selamat datang di toko kami"
    />
  </div>
  
  <div>
    <label for="node-tag-name" class="block font-semibold text-base-content/80 mb-1">Skala Tipografi (Golden Ratio)</label>
    <select
      id="node-tag-name"
      value={section.props?.tagName ?? 'h1'}
      on:change={(e) => {
        const val = e.currentTarget.value;
        onPropChange('tagName', val);
        editorStore.updateSectionProps(section.id, { tagName: val });
      }}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
    >
      <option value="h1">H1 (Heading 1 - 42px)</option>
      <option value="h2">H2 (Heading 2 - 26px)</option>
      <option value="h3">H3 (Heading 3 - 20px)</option>
      <option value="p">Body Text (16px)</option>
    </select>
  </div>

  <!-- Pilihan Warna Teks & Latar Belakang Title (Token Dropdown) -->
  <div class="pt-2 border-t border-base-300 dark:border-slate-800 space-y-3">
    <span class="block font-bold text-base-content/80 text-[11px] uppercase tracking-wider">Warna Token Judul</span>
    
    <div>
      <label for="node-title-color-token" class="block text-xs text-base-content/70 mb-1">Warna Teks Token</label>
      <select
        id="node-title-color-token"
        value={getTitleStyle('color')}
        on:change={(e) => {
          const val = e.currentTarget.value;
          editorStore.updateNodeStyleToken(section.id, 'title', 'color', val);
        }}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
      >
        <option value="">Default (Mengikuti Tema)</option>
        <option value="var(--theme-text-primary)">Teks Utama (Text Primary)</option>
        <option value="var(--theme-primary)">Warna Utama (Brand Primary)</option>
        <option value="var(--theme-secondary)">Warna Sekunder (Brand Secondary)</option>
        <option value="var(--theme-text-muted)">Teks Redup (Muted Text)</option>
        <option value="var(--theme-surface)">Warna Kartu/Surface</option>
      </select>
    </div>

    <div>
      <label for="node-title-bg-token" class="block text-xs text-base-content/70 mb-1">Latar Belakang Token (Highlight)</label>
      <select
        id="node-title-bg-token"
        value={getTitleStyle('backgroundColor')}
        on:change={(e) => {
          const val = e.currentTarget.value;
          editorStore.updateNodeStyleToken(section.id, 'title', 'backgroundColor', val);
        }}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
      >
        <option value="">Transparan (Tanpa Latar)</option>
        <option value="var(--theme-primary)">Latar Primary</option>
        <option value="var(--theme-secondary)">Latar Secondary</option>
        <option value="var(--theme-surface)">Latar Surface</option>
        <option value="var(--theme-bg)">Latar Background Kanvas</option>
      </select>
    </div>
  </div>

  <div class="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
    <Sparkles size={14} class="flex-shrink-0" />
    <span>Gunakan tab <strong>Gaya Node</strong> untuk mengatur jarak, margin, dan padding presisi.</span>
  </div>
</div>
