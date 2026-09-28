<script lang="ts">
  import { ChevronDown, Sparkles, LayoutDashboard, LogOut } from 'lucide-svelte'
  import {
    type NavUser,
    getRoleBadge,
    getRoleNavLinks,
    getDashboardHref,
    getDashboardLabel
  } from './navbar.helpers'

  export let isOpen: boolean = false
  export let user: NavUser | null = null
  export let berandaItems: { label: string; href: string }[] = []
  export let helpCenterItems: { label: string; href: string }[] = []
  export let currentPath: string = ''
  export let onSignOut: () => void = () => {}
  export let isLoggingOut: boolean = false
  export let onClose: () => void = () => {}

  let expandedSection: 'account' | 'beranda' | 'help' | null = user ? 'account' : 'beranda'

  $: userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')
  $: roleMeta = getRoleBadge(user?.role)
  $: roleNavLinks = getRoleNavLinks(user?.role)
  $: dashboardHref = getDashboardHref(user?.role)
  $: dashboardLabel = getDashboardLabel(user?.role)

  const toggleSection = (section: 'account' | 'beranda' | 'help') => {
    expandedSection = expandedSection === section ? null : section
  }

  const handleLinkClick = (href: string, e: MouseEvent) => {
    onClose()
    if (href.startsWith('/#') && (typeof window !== 'undefined') && (window.location.pathname === '/' || window.location.pathname === '')) {
      const targetId = href.replace('/#', '')
      const targetEl = document.getElementById(targetId)
      if (targetEl) {
        e.preventDefault()
        targetEl.scrollIntoView({ behavior: 'smooth' })
        history.pushState(null, '', href)
      }
    }
  }
</script>

{#if isOpen}
  <div class="md:hidden border-t border-border/80 dark:border-white/10 bg-card dark:bg-canvas shadow-2xl px-5 py-4 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
    
    <!-- User Profile Strip (Only when logged in) -->
    {#if user}
      <div class="flex items-center justify-between p-3 rounded-2xl bg-nested/50 dark:bg-white/[0.04] border border-border/80 dark:border-white/10">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded-full bg-orange text-white font-heading font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden">
            {#if user.image}
              <img src={user.image} alt={user.name || 'User'} class="w-full h-full object-cover" />
            {:else}
              <span>{userInitial}</span>
            {/if}
          </div>
          <div class="min-w-0">
            <p class="font-heading font-semibold text-xs text-main dark:text-white truncate">{user.name || 'Pengguna'}</p>
            <p class="text-2xs font-sans text-muted dark:text-slate-400 truncate">{user.email || '-'}</p>
          </div>
        </div>
        {#if roleMeta}
          <span class="label-caps text-xs-dense px-2 py-0.5 rounded-full border {roleMeta.color}">
            {roleMeta.label}
          </span>
        {/if}
      </div>
    {/if}

    <!-- Primary Quick Actions: UMKM & Template -->
    <div class="flex items-center gap-2">
      <a
        href="/umkm"
        on:click={onClose}
        class={currentPath.startsWith('/umkm')
          ? 'flex-1 text-center py-2.5 rounded-full bg-main text-canvas dark:bg-white dark:text-slate-950 label-caps font-bold tracking-wider shadow-sm'
          : 'flex-1 text-center py-2.5 rounded-full bg-nested/80 dark:bg-white/5 text-main dark:text-white label-caps font-medium tracking-wider border border-border dark:border-white/10'}
      >
        UMKM
      </a>
      <a
        href="/templates"
        on:click={onClose}
        class={currentPath.startsWith('/templates')
          ? 'flex-1 text-center py-2.5 rounded-full bg-main text-canvas dark:bg-white dark:text-slate-950 label-caps font-bold tracking-wider shadow-sm'
          : 'flex-1 text-center py-2.5 rounded-full bg-nested/80 dark:bg-white/5 text-main dark:text-white label-caps font-medium tracking-wider border border-border dark:border-white/10'}
      >
        Template
      </a>
    </div>

    <!-- Accordion: Dashboard & Akun Menu (Only when logged in) -->
    {#if user}
      <div class="rounded-2xl border border-border/80 dark:border-white/10 bg-nested/40 dark:bg-white/[0.02] overflow-hidden">
        <button
          type="button"
          on:click={() => toggleSection('account')}
          class="w-full flex items-center justify-between p-3.5 text-left cursor-pointer"
        >
          <span class="label-caps text-main dark:text-white flex items-center gap-1.5 tracking-wider">
            <LayoutDashboard size={14} class="text-orange" />
            <span>{dashboardLabel}</span>
          </span>
          <ChevronDown size={14} class="text-muted dark:text-white/80 transition-transform duration-200 {expandedSection === 'account' ? 'rotate-180 text-orange' : ''}" />
        </button>

        {#if expandedSection === 'account'}
          <div class="px-3 pb-3 pt-1 space-y-1 border-t border-border/60 dark:border-white/5">
            {#each roleNavLinks as link}
              <a
                href={link.href}
                on:click={onClose}
                class="px-3 py-2 rounded-xl body-sm font-medium text-secondary hover:text-main dark:text-slate-300 dark:hover:text-white hover:bg-nested/80 dark:hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <svelte:component this={link.icon} size={14} class="text-orange shrink-0" />
                  <span class="truncate">{link.label}</span>
                </div>
                <span class="text-xs text-muted dark:text-slate-500">&rarr;</span>
              </a>
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Accordion: Beranda (Landing Page Sections) -->
    <div class="rounded-2xl border border-border/80 dark:border-white/10 bg-nested/40 dark:bg-white/[0.02] overflow-hidden">
      <button
        type="button"
        on:click={() => toggleSection('beranda')}
        class="w-full flex items-center justify-between p-3.5 text-left cursor-pointer"
      >
        <span class="label-caps text-main dark:text-white flex items-center gap-1.5 tracking-wider">
          <Sparkles size={14} class="text-orange" />
          <span>Menu Beranda (Landing)</span>
        </span>
        <ChevronDown size={14} class="text-muted dark:text-white/80 transition-transform duration-200 {expandedSection === 'beranda' ? 'rotate-180 text-orange' : ''}" />
      </button>

      {#if expandedSection === 'beranda'}
        <div class="px-3 pb-3 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5 border-t border-border/60 dark:border-white/5">
          {#each berandaItems as item}
            <a
              href={item.href}
              on:click={(e) => handleLinkClick(item.href, e)}
              class="px-3 py-2 rounded-xl body-sm font-medium text-secondary hover:text-main dark:text-slate-300 dark:hover:text-white hover:bg-nested/80 dark:hover:bg-white/10 transition-colors flex items-center justify-between"
            >
              <span>{item.label}</span>
              <span class="text-xs text-muted dark:text-slate-500">&rarr;</span>
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
        <span class="label-caps text-main dark:text-white flex items-center gap-1.5 tracking-wider">
          <span>Help Center</span>
        </span>
        <ChevronDown size={14} class="text-muted dark:text-white/80 transition-transform duration-200 {expandedSection === 'help' ? 'rotate-180 text-orange' : ''}" />
      </button>

      {#if expandedSection === 'help'}
        <div class="px-3 pb-3 pt-1 space-y-1 border-t border-border/60 dark:border-white/5">
          {#each helpCenterItems as item}
            <a
              href={item.href}
              on:click={(e) => handleLinkClick(item.href, e)}
              class="px-3 py-2 rounded-xl body-sm font-medium text-secondary hover:text-main dark:text-slate-300 dark:hover:text-white hover:bg-nested/80 dark:hover:bg-white/10 transition-colors flex items-center justify-between"
            >
              <span>{item.label}</span>
              <span class="text-xs text-muted dark:text-slate-500">&rarr;</span>
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
        class="label-caps text-secondary hover:text-main dark:text-slate-300 dark:hover:text-white tracking-wider"
      >
        KONTAK
      </a>

      {#if user}
        <div class="flex items-center gap-2">
          <button
            type="button"
            on:click={onSignOut}
            disabled={isLoggingOut}
            class="px-3 py-2 rounded-full text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 label-caps font-semibold text-xs tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut size={13} />
            <span>Keluar</span>
          </button>
          <a
            href={dashboardHref}
            on:click={onClose}
            class="px-4 py-2 rounded-full bg-main text-canvas dark:bg-white dark:text-slate-950 label-caps font-bold tracking-wider shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Dashboard</span>
            <span>&rarr;</span>
          </a>
        </div>
      {:else}
        <a
          href="/auth/login?mode=register"
          on:click={onClose}
          class="px-4 py-2 rounded-full bg-orange hover:bg-orange-dark text-white label-caps font-bold tracking-wider shadow-sm transition-all flex items-center gap-1.5"
        >
          <span>Daftar Gratis</span>
          <span>&rarr;</span>
        </a>
      {/if}
    </div>
  </div>
{/if}
