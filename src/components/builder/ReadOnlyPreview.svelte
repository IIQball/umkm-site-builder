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
  } from 'lucide-svelte';
  import SectionRenderer from './sections/SectionRenderer.svelte';
  import type { TemplateSection } from '@/schemas';
  import { onMount } from 'svelte';

  export let template: {
    id: string;
    name: string;
    description?: string | null;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    rejectionReason?: string | null;
    config: {
      sections: TemplateSection[];
      theme?: {
        primaryColor?: string;
        fontFamily?: string;
      };
    };
  };
  export let isOwner: boolean = false;

  let viewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  let isDark = false;

  $: sections = template?.config?.sections || [];

  onMount(() => {
    isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  });

  const toggleTheme = () => {
    isDark = !isDark;
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };
</script>

<div class="min-h-screen bg-base-200/50 flex flex-col font-sans text-base-content transition-colors">
  <!-- Top Admin Status & Navigation Banner -->
  <header class="sticky top-0 z-50 border-b shadow-sm bg-base-100 border-base-200">
    <!-- Status Specific Color Alert Bar (hanya untuk desainer pemilik template) -->
    {#if isOwner}
      {#if template.status === 'pending'}
        <div class="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-amber-700 dark:text-amber-300">
          <div class="flex items-center gap-2.5 text-xs font-medium">
            <Clock size={16} class="text-amber-500 animate-pulse flex-shrink-0" />
            <span>
              <strong>Template Sedang Ditinjau Admin:</strong> Template ini telah diajukan dan sedang menunggu proses validasi serta persetujuan dari tim kurasi admin sebelum diterbitkan ke katalog UMKM.
            </span>
          </div>
          <span class="text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 px-2.5 py-0.5 rounded border border-amber-500/30">
            Menunggu Review
          </span>
        </div>
      {:else if template.status === 'approved'}
        <div class="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-2.5 flex items-center justify-between text-emerald-700 dark:text-emerald-300">
          <div class="flex items-center gap-2.5 text-xs font-medium">
            <CheckCircle2 size={16} class="text-emerald-500 flex-shrink-0" />
            <span>
              <strong>Template Disetujui dan Live:</strong> Template ini telah lolos kurasi admin dan dapat dibeli oleh pemilik UMKM di katalog marketplace.
            </span>
          </div>
          <span class="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/30">
            Disetujui
          </span>
        </div>
      {:else if template.status === 'rejected'}
        <div class="bg-rose-500/10 border-b border-rose-500/20 px-6 py-2.5 flex items-center justify-between text-rose-700 dark:text-rose-300">
          <div class="flex items-center gap-2.5 text-xs font-medium">
            <XCircle size={16} class="text-rose-500 flex-shrink-0" />
            <span>
              <strong>Pengajuan Ditolak:</strong> {template.rejectionReason || 'Desain atau konfigurasi template memerlukan penyesuaian. Silakan perbaiki di editor dan ajukan kembali.'}
            </span>
          </div>
          <span class="text-[10px] font-semibold uppercase tracking-wider bg-rose-500/20 px-2.5 py-0.5 rounded border border-rose-500/30">
            Ditolak
          </span>
        </div>
      {:else}
        <div class="bg-blue-500/10 border-b border-blue-500/20 px-6 py-2.5 flex items-center justify-between text-blue-700 dark:text-blue-300">
          <div class="flex items-center gap-2.5 text-xs font-medium">
            <FileEdit size={16} class="text-blue-500 flex-shrink-0" />
            <span>
              <strong>Preview Mode (Draft):</strong> Template masih dalam tahap pembuatan dan belum diajukan ke admin.
            </span>
          </div>
          <span class="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 px-2.5 py-0.5 rounded border border-blue-500/30">
            Draft
          </span>
        </div>
      {/if}
    {/if}

    <!-- Toolbar: Title, Viewport Switcher, Theme Toggle -->
    <div class="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      <!-- Left: Template Name -->
      <div class="flex items-center gap-3 min-w-0">
        <div class="min-w-0">
          <h1 class="text-xs sm:text-sm font-bold text-base-content truncate">{template.name || 'Untitled Template'}</h1>
          <p class="text-[10px] sm:text-[11px] text-base-content/60 truncate">{template.description || 'Preview read-only tampilan website'}</p>
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
      class={`transition-all duration-300 ease-in-out bg-white text-slate-900 shadow-xl overflow-hidden my-4 flex flex-col ${
        viewMode === 'desktop'
          ? 'w-full max-w-5xl rounded-xl min-h-[800px] border border-base-300'
          : viewMode === 'tablet'
          ? 'w-[768px] rounded-2xl min-h-[800px] border-4 border-slate-700'
          : 'w-[375px] rounded-2xl min-h-[667px] border-4 border-slate-700'
      }`}
    >
      {#if sections.length === 0}
        <div class="p-16 text-center text-slate-400">
          <p class="text-sm">Belum ada section yang dikonfigurasi.</p>
        </div>
      {:else}
        <div class="flex flex-col w-full">
          {#each sections as section (section.id)}
            <SectionRenderer {section} isActive={false} />
          {/each}
        </div>
      {/if}
    </div>
  </main>
</div>
