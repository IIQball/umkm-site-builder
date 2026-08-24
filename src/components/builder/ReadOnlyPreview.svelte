<script lang="ts">
  import {
    Monitor,
    Tablet,
    Smartphone,
    Clock,
    CheckCircle2,
    XCircle,
    FileEdit,
    Sun,
    Moon,
    ArrowLeft,
  } from 'lucide-svelte';
  import SectionRenderer from './sections/SectionRenderer.svelte';
  import { onMount } from 'svelte';
  import { editorStore } from './stores/editorStore';
  import type { EditorTemplate } from './stores/editorStore.types';

  export let template: EditorTemplate;
  export let isOwner: boolean = false;

  let viewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  let isDark = false;

  $: sections = template?.config?.sections || [];
  $: theme = template?.config?.theme || {};

  $: canvasCssVars = [
    `--theme-primary: ${theme.colors?.primary || '#3b82f6'}`,
    `--theme-secondary: ${theme.colors?.secondary || '#64748b'}`,
    `--theme-bg: ${isDark ? '#090d16' : (theme.colors?.background || '#ffffff')}`,
    `--theme-surface: ${isDark ? '#111827' : (theme.colors?.surface || '#f8fafc')}`,
    `--theme-text-primary: ${isDark ? '#f8fafc' : (theme.colors?.textPrimary || '#0f172a')}`,
    `--theme-text-muted: ${isDark ? '#94a3b8' : (theme.colors?.textMuted || '#64748b')}`,
    `--theme-font-heading: ${theme.typography?.headingFont || 'Inter, sans-serif'}`,
    `--theme-font-body: ${theme.typography?.bodyFont || 'Inter, sans-serif'}`,
    `--theme-btn-radius: ${theme.buttons?.borderRadius || '8px'}`,
    `--theme-max-width: ${theme.layout?.maxWidth || '1200px'}`,
  ].join('; ');

  $: if (viewMode) {
    editorStore.setViewMode(viewMode);
  }

  onMount(() => {
    if (template) {
      editorStore.init(template);
    }
    editorStore.setViewMode(viewMode);
    isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  });

  const toggleTheme = () => {
    isDark = !isDark;
    const themeName = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  };
</script>

<div class="min-h-screen bg-base-200/50 flex flex-col font-sans text-base-content transition-colors">
  <!-- Top Admin Status & Navigation Banner -->
  <header class="sticky top-0 z-50 border-b shadow-sm bg-base-100 border-base-200">
    <!-- Status Specific Color Alert Bar (hanya untuk desainer pemilik template) -->
    {#if isOwner}
      {#if template.status === 'pending'}
        <div class="bg-warning/10 border-b border-warning/20 px-6 py-2.5 flex items-center justify-between text-warning">
          <div class="flex items-center gap-2.5 text-xs font-medium">
            <Clock size={16} class="text-warning animate-pulse flex-shrink-0" />
            <span>
              <strong>Template Sedang Ditinjau Admin:</strong> Template ini telah diajukan dan sedang menunggu proses validasi serta persetujuan dari tim kurasi admin sebelum diterbitkan ke katalog UMKM.
            </span>
          </div>
          <span class="badge-custom badge-custom-amber">
            Menunggu Review
          </span>
        </div>
      {:else if template.status === 'approved'}
        <div class="bg-success/10 border-b border-success/20 px-6 py-2.5 flex items-center justify-between text-success">
          <div class="flex items-center gap-2.5 text-xs font-medium">
            <CheckCircle2 size={16} class="text-success flex-shrink-0" />
            <span>
              <strong>Template Disetujui dan Live:</strong> Template ini telah lolos kurasi admin dan dapat dibeli oleh pemilik UMKM di katalog marketplace.
            </span>
          </div>
          <span class="badge-custom badge-custom-emerald">
            Disetujui
          </span>
        </div>
      {:else if template.status === 'rejected'}
        <div class="bg-error/10 border-b border-error/20 px-6 py-2.5 flex items-center justify-between text-error">
          <div class="flex items-center gap-2.5 text-xs font-medium">
            <XCircle size={16} class="text-error flex-shrink-0" />
            <span>
              <strong>Pengajuan Ditolak:</strong> {template.rejectionReason || 'Desain atau konfigurasi template memerlukan penyesuaian. Silakan perbaiki di editor dan ajukan kembali.'}
            </span>
          </div>
          <span class="badge-custom badge-custom-rose">
            Ditolak
          </span>
        </div>
      {:else}
        <div class="bg-info/10 border-b border-info/20 px-6 py-2.5 flex items-center justify-between text-info">
          <div class="flex items-center gap-2.5 text-xs font-medium">
            <FileEdit size={16} class="text-info flex-shrink-0" />
            <span>
              <strong>Preview Mode (Draft):</strong> Template masih dalam tahap pembuatan dan belum diajukan ke admin.
            </span>
          </div>
          <span class="badge-custom badge-custom-slate">
            Draft
          </span>
        </div>
      {/if}
    {/if}

    <!-- Toolbar: Title, Viewport Switcher, Theme Toggle -->
    <div class="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      <!-- Left: Template Name & Back Button -->
      <div class="flex items-center gap-3 min-w-0">
        <a
          href="/"
          class="inline-flex items-center justify-center p-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content/80 hover:text-base-content transition-colors cursor-pointer"
          title="Kembali ke Beranda"
        >
          <ArrowLeft size={16} />
        </a>
        <div class="min-w-0">
          <h1 class="text-xs sm:text-sm font-bold text-base-content truncate">{template.name || 'Untitled Template'}</h1>
          <p class="text-xs text-base-content/60 truncate">{template.description || 'Preview read-only tampilan website'}</p>
        </div>
      </div>

      <!-- Center: Viewport Switcher -->
      <div class="flex items-center bg-base-200/80 p-1 rounded-lg border border-base-300">
        <button
          type="button"
          on:click={() => (viewMode = 'desktop')}
          class={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
            viewMode === 'desktop'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
          title="Tampilan Desktop (100%)"
        >
          <Monitor size={14} />
          <span class="hidden sm:inline">Desktop</span>
        </button>

        <button
          type="button"
          on:click={() => (viewMode = 'tablet')}
          class={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
            viewMode === 'tablet'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
          title="Tampilan Tablet (768px)"
        >
          <Tablet size={14} />
          <span class="hidden sm:inline">Tablet</span>
        </button>

        <button
          type="button"
          on:click={() => (viewMode = 'mobile')}
          class={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
            viewMode === 'mobile'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
          title="Tampilan Mobile (375px)"
        >
          <Smartphone size={14} />
          <span class="hidden sm:inline">Mobile</span>
        </button>
      </div>

      <!-- Right: Theme Toggle -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          on:click={toggleTheme}
          class="p-1.5 rounded-lg bg-base-200 hover:bg-base-300 text-base-content/80 hover:text-base-content transition-colors cursor-pointer"
          title="Ganti Tema (Terang / Gelap)"
        >
          {#if isDark}
            <Sun size={14} class="text-amber-400" />
          {:else}
            <Moon size={14} class="text-slate-600" />
          {/if}
        </button>
      </div>
    </div>
  </header>

  <!-- Read-Only Canvas Area -->
  <main class="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start bg-base-200/60">
    <div
      style={canvasCssVars}
      class={`relative transition-all duration-300 ease-in-out shadow-2xl my-4 flex flex-col box-border overflow-x-hidden ${
        isDark ? 'theme-dark bg-slate-950 text-slate-100' : 'theme-light bg-white text-slate-900'
      } ${
        viewMode === 'desktop'
          ? 'w-full max-w-6xl min-h-[800px] border border-base-300 dark:border-slate-800 rounded-xl'
          : viewMode === 'tablet'
          ? 'w-[768px] max-w-full min-h-[800px] border border-slate-400 dark:border-slate-700 mx-auto rounded-2xl'
          : 'w-[375px] max-w-full min-h-[667px] border border-slate-400 dark:border-slate-700 mx-auto rounded-2xl'
      }`}
    >
      {#if sections.length === 0}
        <div class="p-16 text-center text-slate-400">
          <p class="text-sm">Belum ada section yang dikonfigurasi.</p>
        </div>
      {:else}
        <div class="flex flex-col w-full min-w-0 transition-all">
          {#each sections as section (section.id)}
            <SectionRenderer {section} isActive={false} />
          {/each}
        </div>
      {/if}
    </div>
  </main>
</div>
