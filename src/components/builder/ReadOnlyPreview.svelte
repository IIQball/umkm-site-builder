<script lang="ts">
  import {
    Monitor,
    Tablet,
    Smartphone,
    ArrowLeft,
    Clock,
    CheckCircle2,
    XCircle,
    FileEdit,
    ExternalLink,
  } from 'lucide-svelte';
  import SectionRenderer from './sections/SectionRenderer.svelte';
  import type { TemplateSection } from '@/schemas/template.schema';

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

  let viewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';

  $: sections = template?.config?.sections || [];
</script>

<div class="min-h-screen bg-slate-950 flex flex-col font-sans">
  <!-- Top Admin Status & Navigation Banner -->
  <header class="sticky top-0 z-50 border-b shadow-lg bg-slate-900 border-slate-800">
    <!-- Status Specific Color Alert Bar -->
    {#if template.status === 'pending'}
      <div class="bg-amber-500/15 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-between text-amber-300">
        <div class="flex items-center gap-2.5 text-xs font-medium">
          <Clock size={16} class="text-amber-400 animate-pulse flex-shrink-0" />
          <span>
            <strong>Template Sedang Ditinjau Admin</strong> — Template ini telah diajukan dan sedang menunggu proses validasi serta persetujuan dari tim kurasi admin sebelum diterbitkan ke katalog UMKM.
          </span>
        </div>
        <span class="text-[11px] font-semibold uppercase tracking-wider bg-amber-500/20 px-2.5 py-0.5 rounded border border-amber-500/30">
          Menunggu Review
        </span>
      </div>
    {:else if template.status === 'approved'}
      <div class="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2.5 flex items-center justify-between text-emerald-300">
        <div class="flex items-center gap-2.5 text-xs font-medium">
          <CheckCircle2 size={16} class="text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Template Disetujui & Live</strong> — Template ini telah lolos kurasi admin dan dapat dibeli oleh pemilik UMKM di katalog marketplace.
          </span>
        </div>
        <span class="text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/30">
          Disetujui
        </span>
      </div>
    {:else if template.status === 'rejected'}
      <div class="bg-rose-500/15 border-b border-rose-500/30 px-6 py-2.5 flex items-center justify-between text-rose-300">
        <div class="flex items-center gap-2.5 text-xs font-medium">
          <XCircle size={16} class="text-rose-400 flex-shrink-0" />
          <span>
            <strong>Pengajuan Ditolak</strong> — {template.rejectionReason || 'Desain atau konfigurasi template memerlukan penyesuaian. Silakan perbaiki di editor dan ajukan kembali.'}
          </span>
        </div>
        <span class="text-[11px] font-semibold uppercase tracking-wider bg-rose-500/20 px-2.5 py-0.5 rounded border border-rose-500/30">
          Ditolak
        </span>
      </div>
    {:else}
      <div class="bg-blue-500/15 border-b border-blue-500/30 px-6 py-2.5 flex items-center justify-between text-blue-300">
        <div class="flex items-center gap-2.5 text-xs font-medium">
          <FileEdit size={16} class="text-blue-400 flex-shrink-0" />
          <span>
            <strong>Preview Mode (Draft)</strong> — Template masih dalam tahap pembuatan dan belum diajukan ke admin.
          </span>
        </div>
        <span class="text-[11px] font-semibold uppercase tracking-wider bg-blue-500/20 px-2.5 py-0.5 rounded border border-blue-500/30">
          Draft
        </span>
      </div>
    {/if}

    <!-- Toolbar: Back, Title, Viewport Switcher -->
    <div class="px-6 py-3 flex items-center justify-between gap-4">
      <!-- Left: Back Button & Template Name -->
      <div class="flex items-center gap-3 min-w-0">
        <a
          href={`/builder/${template.id}`}
          class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Edit di Builder</span>
        </a>

        <div class="h-4 w-px bg-slate-800" />

        <div class="min-w-0">
          <h1 class="text-sm font-bold text-white truncate">{template.name || 'Untitled Template'}</h1>
          <p class="text-[11px] text-slate-400 truncate">{template.description || 'Preview read-only tampilan website'}</p>
        </div>
      </div>

      <!-- Center: Viewport Switcher -->
      <div class="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
        <button
          type="button"
          on:click={() => (viewMode = 'desktop')}
          class={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            viewMode === 'desktop'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Tampilan Desktop (100%)"
        >
          <Monitor size={14} />
          <span class="hidden sm:inline">Desktop</span>
        </button>

        <button
          type="button"
          on:click={() => (viewMode = 'tablet')}
          class={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            viewMode === 'tablet'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Tampilan Tablet (768px)"
        >
          <Tablet size={14} />
          <span class="hidden sm:inline">Tablet</span>
        </button>

        <button
          type="button"
          on:click={() => (viewMode = 'mobile')}
          class={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            viewMode === 'mobile'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Tampilan Mobile (375px)"
        >
          <Smartphone size={14} />
          <span class="hidden sm:inline">Mobile</span>
        </button>
      </div>

      <!-- Right: Direct Link / Home CTA -->
      <div>
        <a
          href="/"
          class="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span>Dashboard</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  </header>

  <!-- Read-Only Canvas Area -->
  <main class="flex-1 overflow-y-auto p-6 flex justify-center items-start bg-slate-900/40">
    <div
      class={`transition-all duration-300 ease-in-out bg-white text-slate-900 shadow-2xl overflow-hidden my-4 flex flex-col ${
        viewMode === 'desktop'
          ? 'w-full max-w-5xl rounded-xl min-h-[800px] border border-slate-800'
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
