<script lang="ts">
  import { ChevronDown, Sparkles } from 'lucide-svelte';

  export let isOpen: boolean = false;
  export let berandaItems: { label: string; href: string }[] = [];
  export let helpCenterItems: { label: string; href: string }[] = [];
  export let currentPath: string = '';
  export let onClose: () => void = () => {};

  let expandedSection: 'beranda' | 'help' | null = 'beranda';

  const toggleSection = (section: 'beranda' | 'help') => {
    expandedSection = expandedSection === section ? null : section;
  };

  const handleLinkClick = (href: string, e: MouseEvent) => {
    onClose();
    if (href.startsWith('/#') && (typeof window !== 'undefined') && (window.location.pathname === '/' || window.location.pathname === '')) {
      const targetId = href.replace('/#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', href);
      }
    }
  };
</script>

{#if isOpen}
  <div class="md:hidden border-t border-border/80 dark:border-white/10 bg-card dark:bg-slate-950 shadow-2xl px-5 py-4 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
    
    <!-- Primary Quick Actions: UMKM & Template -->
    <div class="flex items-center gap-2">
      <a
        href="/umkm"
        on:click={onClose}
        class={currentPath.startsWith('/umkm')
          ? 'flex-1 text-center py-2.5 rounded-full bg-main text-canvas dark:bg-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm'
          : 'flex-1 text-center py-2.5 rounded-full bg-nested/80 dark:bg-white/5 text-main dark:text-white font-medium text-xs uppercase tracking-wider border border-border dark:border-white/10'}
      >
        UMKM
      </a>
      <a
        href="/templates"
        on:click={onClose}
        class={currentPath.startsWith('/templates')
          ? 'flex-1 text-center py-2.5 rounded-full bg-main text-canvas dark:bg-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm'
          : 'flex-1 text-center py-2.5 rounded-full bg-nested/80 dark:bg-white/5 text-main dark:text-white font-medium text-xs uppercase tracking-wider border border-border dark:border-white/10'}
      >
        Template
      </a>
    </div>

    <!-- Accordion: Beranda (Landing Page Sections) -->
    <div class="rounded-2xl border border-border/80 dark:border-white/10 bg-nested/40 dark:bg-white/[0.02] overflow-hidden">
      <button
        type="button"
        on:click={() => toggleSection('beranda')}
        class="w-full flex items-center justify-between p-3.5 text-left cursor-pointer"
      >
        <span class="text-xs font-bold uppercase tracking-wider text-main dark:text-white flex items-center gap-1.5">
          <Sparkles size={14} class="text-orange" />
          <span>Menu Beranda (Landing)</span>
        </span>
        <ChevronDown size={14} class="text-muted transition-transform duration-200 {expandedSection === 'beranda' ? 'rotate-180 text-orange' : ''}" />
      </button>

      {#if expandedSection === 'beranda'}
        <div class="px-3 pb-3 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5 border-t border-border/60 dark:border-white/5">
          {#each berandaItems as item}
            <a
              href={item.href}
              on:click={(e) => handleLinkClick(item.href, e)}
              class="px-3 py-2 rounded-xl text-xs font-medium text-secondary hover:text-main dark:text-slate-300 dark:hover:text-white hover:bg-nested/80 dark:hover:bg-white/10 transition-colors flex items-center justify-between"
            >
              <span>{item.label}</span>
              <span class="text-[10px] text-muted dark:text-slate-500">&rarr;</span>
            </a>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Accordion: Help Center -->
    <div class="rounded-2xl border border-border/80 dark:border-white/10 bg-nested/40 dark:bg-white/[0.02] overflow-hidden">
      <button
        type="button"
        on:click={() => toggleSection('help')}
        class="w-full flex items-center justify-between p-3.5 text-left cursor-pointer"
      >
        <span class="text-xs font-bold uppercase tracking-wider text-main dark:text-white flex items-center gap-1.5">
          <span>Help Center</span>
        </span>
        <ChevronDown size={14} class="text-muted transition-transform duration-200 {expandedSection === 'help' ? 'rotate-180 text-orange' : ''}" />
      </button>

      {#if expandedSection === 'help'}
        <div class="px-3 pb-3 pt-1 space-y-1 border-t border-border/60 dark:border-white/5">
          {#each helpCenterItems as item}
            <a
              href={item.href}
              on:click={(e) => handleLinkClick(item.href, e)}
              class="px-3 py-2 rounded-xl text-xs font-medium text-secondary hover:text-main dark:text-slate-300 dark:hover:text-white hover:bg-nested/80 dark:hover:bg-white/10 transition-colors flex items-center justify-between"
            >
              <span>{item.label}</span>
              <span class="text-[10px] text-muted dark:text-slate-500">&rarr;</span>
            </a>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Bottom Action Bar -->
    <div class="pt-3 border-t border-border/80 dark:border-white/10 flex items-center justify-between">
      <a
        href="/#contact"
        on:click={(e) => handleLinkClick('/#contact', e)}
        class="text-xs uppercase tracking-wider font-semibold text-secondary hover:text-main dark:text-slate-300 dark:hover:text-white"
      >
        KONTAK
      </a>
      <a
        href="/auth/login?mode=register"
        on:click={onClose}
        class="px-4 py-2 rounded-full bg-orange hover:bg-orange-dark text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5"
      >
        <span>Daftar Gratis</span>
        <span>&rarr;</span>
      </a>
    </div>
  </div>
{/if}
