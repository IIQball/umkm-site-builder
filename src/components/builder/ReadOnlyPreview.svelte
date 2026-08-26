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
  import { editorStore, canvasStore } from './stores/editorStore';
  import type { EditorTemplate } from './stores/editorStore.types';
  import { ensureValidTemplate } from './stores/editorStore.types';
  import { DEFAULT_TEMPLATE_THEME, type TemplateTheme } from '@/schemas';
  import TemplateCardAction from '@/components/public/TemplateCardAction.svelte';
  import { formatCurrency } from '@/lib/utils/format';

  export let template: EditorTemplate;
  export let isOwner: boolean = false;
  export let isDesigner: boolean = false;
  export let isLoggedIn: boolean = false;
  export let isOwned: boolean = false;
  export let storeId: string | null = null;

  let viewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  let isDark = false;

  $: safeTemplate = template ? ensureValidTemplate(template) : null;
  $: sections = safeTemplate?.config?.sections || [];
  $: theme = (safeTemplate?.config?.theme || DEFAULT_TEMPLATE_THEME) as TemplateTheme;

  $: canvasCssVars = [
    `--theme-primary: ${theme.colors?.primary || '#3b82f6'}`,
    `--theme-secondary: ${theme.colors?.secondary || '#64748b'}`,
    `--theme-bg: ${isDark ? '#090d16' : (theme.colors?.background || '#ffffff')}`,
    `--theme-surface: ${isDark ? '#111827' : (theme.colors?.surface || '#f8fafc')}`,
    `--theme-text-primary: ${isDark ? '#f8fafc' : (theme.colors?.textPrimary || '#0f172a')}`,
    `--theme-text-muted: ${isDark ? '#94a3b8' : (theme.colors?.textMuted || '#64748b')}`,
    `--theme-font-heading: ${theme.typography?.headingFont || 'Inter, sans-serif'}`,
    `--theme-font-body: ${theme.typography?.fontFamily || 'Inter, sans-serif'}`,
    `--theme-btn-radius: ${theme.buttons?.borderRadius || '8px'}`,
    `--theme-max-width: ${theme.layout?.maxWidth || '1200px'}`,
    `--active-safe-zone: ${viewMode === 'mobile' ? '16px' : viewMode === 'tablet' ? '24px' : '32px'}`,
  ].join('; ');

  function setDeviceView(mode: 'desktop' | 'tablet' | 'mobile') {
    viewMode = mode;
    canvasStore.setViewMode(mode);
    editorStore.setViewMode(mode);
  }

  onMount(() => {
    if (safeTemplate) {
      editorStore.init(safeTemplate);
    }
    setDeviceView(viewMode);
    isDark = document.documentElement.getAttribute('data-theme') === 'dark' || document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    isDark = !isDark;
    const themeName = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeName);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', themeName);
    canvasStore.toggleEditorTheme();
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = isOwner ? '/designer/templates' : '/templates';
      }
    }
  };
</script>

<div class="min-h-screen bg-canvas flex flex-col font-sans text-main transition-colors select-none">
  <!-- Top Admin Status & Navigation Banner -->
  <header class="sticky top-0 z-50 border-b border-light shadow-sm bg-card backdrop-blur-md">
    <!-- Status Alert Bar (hanya jika desainer pemilik template) -->
    {#if isOwner}
      {#if template.status === 'pending'}
        <div class="bg-amber-500/10 border-b border-amber-500/20 px-4 sm:px-6 py-2 flex items-center justify-between text-amber-600 dark:text-amber-400">
          <div class="flex items-center gap-2 text-xs font-medium">
            <Clock size={15} class="animate-pulse flex-shrink-0" />
            <span>
              <strong>Template Sedang Ditinjau Admin:</strong> Menunggu proses validasi dan kurasi tim admin sebelum diterbitkan ke marketplace.
            </span>
          </div>
          <span class="badge-custom badge-custom-amber text-xs">
            Menunggu Review
          </span>
        </div>
      {:else if template.status === 'approved'}
        <div class="bg-emerald-500/10 border-b border-emerald-500/20 px-4 sm:px-6 py-2 flex items-center justify-between text-emerald-600 dark:text-emerald-400">
          <div class="flex items-center gap-2 text-xs font-medium">
            <CheckCircle2 size={15} class="flex-shrink-0" />
            <span>
              <strong>Template Disetujui dan Live:</strong> Siap dipublikasikan dan digunakan oleh pemilik UMKM.
            </span>
          </div>
          <span class="badge-custom badge-custom-emerald text-xs">
            Disetujui
          </span>
        </div>
      {:else if template.status === 'rejected'}
        <div class="bg-rose-500/10 border-b border-rose-500/20 px-4 sm:px-6 py-2 flex items-center justify-between text-rose-600 dark:text-rose-400">
          <div class="flex items-center gap-2 text-xs font-medium">
            <XCircle size={15} class="flex-shrink-0" />
            <span>
              <strong>Pengajuan Ditolak:</strong> {template.rejectionReason || 'Desain memerlukan penyesuaian. Silakan hubungi admin.'}
            </span>
          </div>
          <span class="badge-custom badge-custom-rose text-xs">
            Ditolak
          </span>
        </div>
      {:else}
        <div class="bg-slate-500/10 border-b border-slate-500/20 px-4 sm:px-6 py-2 flex items-center justify-between text-slate-600 dark:text-slate-400">
          <div class="flex items-center gap-2 text-xs font-medium">
            <FileEdit size={15} class="flex-shrink-0" />
            <span>
              <strong>Mode Preview (Draft):</strong> Template masih dalam tahap pembuatan.
            </span>
          </div>
          <span class="badge-custom badge-custom-slate text-xs">
            Draft
          </span>
        </div>
      {/if}
    {/if}

    <!-- Toolbar: Title, Viewport Switcher, Theme Toggle & Action CTA -->
    <div class="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      <!-- Left: Back Button & Template Name -->
      <div class="flex items-center gap-3 min-w-0">
        <button
          type="button"
          on:click|stopPropagation={handleGoBack}
          class="inline-flex items-center justify-center p-2 rounded-xl bg-nested hover:bg-light text-secondary hover:text-main transition-colors cursor-pointer border border-light active:scale-95 flex-shrink-0"
          title="Kembali"
        >
          <ArrowLeft size={16} />
        </button>
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h1 class="text-xs sm:text-sm font-bold text-main truncate max-w-[140px] sm:max-w-xs">{template.name || 'Untitled Template'}</h1>
            <span class="badge-custom badge-custom-emerald text-[11px] font-bold px-2 py-0.5 flex-shrink-0">
              {template.price === 0 ? 'Gratis' : formatCurrency(template.price)}
            </span>
          </div>
          <p class="text-[11px] text-secondary truncate max-w-[140px] sm:max-w-xs">{template.description || 'Pratinjau responsif template website'}</p>
        </div>
      </div>

      <!-- Center: Viewport Switcher -->
      <div class="flex items-center bg-nested p-1 rounded-xl border border-light shadow-inner">
        <button
          type="button"
          on:click|stopPropagation={() => setDeviceView('desktop')}
          class={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            viewMode === 'desktop'
              ? 'bg-card text-main shadow-sm border border-light'
              : 'text-secondary hover:text-main hover:bg-card/50'
          }`}
          title="Tampilan Desktop (100% / 1200px)"
        >
          <Monitor size={14} />
          <span class="hidden md:inline">Desktop</span>
        </button>

        <button
          type="button"
          on:click|stopPropagation={() => setDeviceView('tablet')}
          class={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            viewMode === 'tablet'
              ? 'bg-card text-main shadow-sm border border-light'
              : 'text-secondary hover:text-main hover:bg-card/50'
          }`}
          title="Tampilan Tablet (768px)"
        >
          <Tablet size={14} />
          <span class="hidden md:inline">Tablet</span>
        </button>

        <button
          type="button"
          on:click|stopPropagation={() => setDeviceView('mobile')}
          class={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            viewMode === 'mobile'
              ? 'bg-card text-main shadow-sm border border-light'
              : 'text-secondary hover:text-main hover:bg-card/50'
          }`}
          title="Tampilan Mobile (375px)"
        >
          <Smartphone size={14} />
          <span class="hidden md:inline">Mobile</span>
        </button>
      </div>

      <!-- Right: Action CTA & Theme Toggle -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          on:click|stopPropagation={toggleTheme}
          class="p-2 rounded-xl bg-nested hover:bg-light text-secondary hover:text-main transition-colors cursor-pointer border border-light active:scale-95 flex-shrink-0"
          title="Ganti Tema (Terang / Gelap)"
        >
          {#if isDark}
            <Sun size={15} class="text-amber-400" />
          {:else}
            <Moon size={15} class="text-slate-600" />
          {/if}
        </button>

        {#if !isDesigner && !isOwner}
          <div class="w-36 hidden sm:block">
            <TemplateCardAction
              templateId={template.id}
              price={template.price}
              {isOwned}
              {isLoggedIn}
            />
          </div>
        {/if}
      </div>
    </div>
  </header>

  <!-- Read-Only Canvas Area -->
  <main class="canvas-backdrop flex-1 w-full overflow-y-auto overflow-x-auto p-4 sm:p-6 flex justify-center items-start bg-canvas">
    <div
      id="preview-canvas-frame"
      style="{canvasCssVars}; width: {viewMode === 'desktop' ? '100%' : viewMode === 'tablet' ? '768px' : '375px'}; max-width: {viewMode === 'desktop' ? '1200px' : viewMode === 'tablet' ? '768px' : '375px'}; min-width: {viewMode === 'desktop' ? 'auto' : viewMode === 'tablet' ? '768px' : '375px'};"
      class={`relative transition-all duration-300 ease-in-out shadow-2xl my-2 flex flex-col box-border overflow-x-hidden ${
        isDark ? 'theme-dark bg-slate-950 text-slate-100' : 'theme-light bg-white text-slate-900'
      } ${
        viewMode === 'desktop'
          ? 'w-full max-w-[1200px] min-h-[800px] border border-light rounded-2xl mx-auto'
          : viewMode === 'tablet'
          ? 'w-[768px] shrink-0 min-h-[800px] border border-light mx-auto rounded-2xl'
          : 'w-[375px] shrink-0 min-h-[667px] border border-light mx-auto rounded-2xl'
      }`}
    >
      {#if sections.length === 0}
        <div class="p-16 text-center text-muted">
          <p class="text-sm">Belum ada section yang dikonfigurasi pada template ini.</p>
        </div>
      {:else}
        <div class="flex flex-col w-full min-w-0 transition-all">
          {#each sections as section (section.id)}
            <SectionRenderer {section} isActive={false} {storeId} />
          {/each}
        </div>
      {/if}
    </div>
  </main>
</div>
