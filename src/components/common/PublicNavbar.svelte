<script context="module" lang="ts">
  export type { NavUser } from './navbar.helpers';
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { signOut } from '@/lib/auth-client';
  import { Sun, Moon, Menu, X } from 'lucide-svelte';
  import {
    type NavUser,
    berandaItems,
    helpCenterItems,
  } from './navbar.helpers';
  import NavbarUserMenu from './NavbarUserMenu.svelte';
  import NavbarMobileDrawer from './NavbarMobileDrawer.svelte';
  import Button from '@/components/ui/Button.svelte';
  import NavbarDropdown from './NavbarDropdown.svelte';

  export let user: NavUser | null = null;
  export let currentPath: string = '';

  let isDark = true;
  let isMobileMenuOpen = false;
  let isLoggingOut = false;
  let navMode: 'transparent' | 'hidden' | 'normal' = currentPath === '/' ? 'transparent' : 'normal';
  let ticking = false;
  let openDropdown: 'beranda' | 'help' | null = null;

  const toggleDropdown = (name: 'beranda' | 'help') => {
    openDropdown = openDropdown === name ? null : name;
  };

  const closeDropdowns = () => {
    openDropdown = null;
  };

  const updateNavMode = () => {
    if (window.scrollY > 5500 && navMode === 'normal') return;
    const heroTrack = document.getElementById('hero-scroll-track');
    if (!heroTrack) {
      navMode = 'normal';
      return;
    }
    const rect = heroTrack.getBoundingClientRect();
    const maxScroll = rect.height - window.innerHeight;

    // 1. Initial entrance or at hero top (where hero texts are visible)
    if (window.scrollY <= 40 || -rect.top <= 40) {
      navMode = 'transparent';
    }
    // 2. Scrolling within hero section: navbar disappears completely
    else if (rect.bottom > 80 && -rect.top < maxScroll) {
      navMode = 'hidden';
    }
    // 3. Post-hero sections: normal & always visible
    else {
      navMode = 'normal';
    }
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateNavMode();
        ticking = false;
      });
      ticking = true;
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.nav-dropdown-container')) {
      closeDropdowns();
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeDropdowns();
    }
  };

  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    applyTheme(isDark);

    if (!currentPath && typeof window !== 'undefined') {
      currentPath = window.location.pathname;
    }

    updateNavMode();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeydown);
    }
  });

  const toggleTheme = () => {
    isDark = !isDark;
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const applyTheme = (dark: boolean) => {
    const themeName = dark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeName);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSignOut = async () => {
    isLoggingOut = true;
    try { await signOut(); } finally { window.location.href = '/auth/login'; }
  };

  $: isSolidBackground = isMobileMenuOpen || openDropdown !== null;

  $: headerClasses = isSolidBackground
    ? 'translate-y-0 opacity-100 pointer-events-auto bg-card dark:bg-slate-950 border-b border-border/80 dark:border-white/10 shadow-md backdrop-blur-none'
    : navMode === 'transparent'
      ? 'translate-y-0 opacity-100 pointer-events-auto bg-transparent border-b border-transparent shadow-none backdrop-blur-none'
      : navMode === 'hidden'
        ? '-translate-y-full opacity-0 pointer-events-none border-b border-transparent shadow-none'
        : 'translate-y-0 opacity-100 pointer-events-auto navbar-glass-surface border-b border-border/80 dark:border-white/10 shadow-sm backdrop-blur-md';
</script>

<header class="sticky top-0 z-50 w-full box-border transition-all duration-300 ease-out {headerClasses}">
  <div class="w-full h-16 md:h-20 min-h-[64px] md:min-h-[80px] max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between gap-3 sm:gap-4 box-border">
    
    <!-- 1. Left: Architectural Pill Navigation Capsules (Desktop only) -->
    <div class="hidden md:flex items-center gap-1.5 lg:gap-2 shrink-0">
      <!-- Dropdown: Beranda (Semua menu landing page) -->
      <NavbarDropdown
        label="BERANDA"
        items={berandaItems}
        isOpen={openDropdown === 'beranda'}
        isActive={currentPath === '/'}
        onToggle={() => toggleDropdown('beranda')}
        onClose={closeDropdowns}
      />

      <!-- Dropdown: Help Center (Syarat & Ketentuan, Pusat Bantuan, Kebijakan Privasi) -->
      <NavbarDropdown
        label="HELP CENTER"
        items={helpCenterItems}
        isOpen={openDropdown === 'help'}
        isActive={currentPath === '/terms' || currentPath === '/privacy'}
        onToggle={() => toggleDropdown('help')}
        onClose={closeDropdowns}
      />

      <!-- Direct Link: UMKM -->
      <a
        href="/umkm"
        class={currentPath.startsWith('/umkm')
          ? 'px-4 lg:px-5 py-2 rounded-full bg-main text-canvas dark:bg-white dark:text-slate-950 font-bold text-[11px] lg:text-xs tracking-wider uppercase shadow-sm transition-all duration-200 shrink-0'
          : 'px-3.5 lg:px-4 py-2 rounded-full bg-card/70 hover:bg-card text-main/80 hover:text-main dark:bg-white/5 dark:hover:bg-white/15 dark:text-white/85 dark:hover:text-white font-medium text-[11px] lg:text-xs tracking-wider uppercase border border-border/80 dark:border-white/15 backdrop-blur-sm transition-all duration-200 shrink-0'}
      >
        UMKM
      </a>

      <!-- Direct Link: Template -->
      <a
        href="/templates"
        class={currentPath.startsWith('/templates')
          ? 'px-4 lg:px-5 py-2 rounded-full bg-main text-canvas dark:bg-white dark:text-slate-950 font-bold text-[11px] lg:text-xs tracking-wider uppercase shadow-sm transition-all duration-200 shrink-0'
          : 'px-3.5 lg:px-4 py-2 rounded-full bg-card/70 hover:bg-card text-main/80 hover:text-main dark:bg-white/5 dark:hover:bg-white/15 dark:text-white/85 dark:hover:text-white font-medium text-[11px] lg:text-xs tracking-wider uppercase border border-border/80 dark:border-white/15 backdrop-blur-sm transition-all duration-200 shrink-0'}
      >
        Template
      </a>
    </div>

    <!-- Mobile Left Brand Indicator (Mobile only) -->
    <div class="md:hidden flex items-center shrink-0">
      <a href="/" class="flex items-center gap-2 shrink-0 select-none">
        <div class="grid grid-cols-3 gap-0.5 w-5 h-5 shrink-0 items-center justify-center">
          {#each Array(9) as _}
            <span class="w-1.5 h-1.5 rounded-[1px] bg-main dark:bg-white"></span>
          {/each}
        </div>
        <span class="font-sans font-bold text-base sm:text-lg tracking-wider uppercase leading-none select-none text-main dark:text-white">PINOKA</span>
      </a>
    </div>

    <!-- 2. Center: Matrix Dot Grid & Brand Logo (Desktop only) -->
    <a href="/" class="hidden md:flex items-center gap-2.5 shrink-0 group cursor-pointer transition-transform duration-200 hover:scale-[1.02] select-none">
      <div class="grid grid-cols-3 gap-0.5 w-5 h-5 shrink-0 items-center justify-center">
        {#each Array(9) as _}
          <span class="w-1.5 h-1.5 rounded-[1px] bg-main dark:bg-white transition-colors group-hover:bg-orange"></span>
        {/each}
      </div>
      <div class="flex flex-col leading-tight text-left">
        <span class="font-sans font-bold text-sm lg:text-base tracking-wider uppercase text-main dark:text-white group-hover:text-orange transition-colors leading-none">
          PINOKA
        </span>
        <span class="font-sans text-[11px] font-medium tracking-widest text-muted dark:text-slate-400 uppercase mt-0.5">
          banyuwangi
        </span>
      </div>
    </a>

    <!-- 3. Right: Action Buttons, Theme Toggle, Auth / CTA -->
    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
      <a
        href="/#contact"
        class="hidden sm:inline-block text-[11px] lg:text-xs uppercase tracking-wider text-secondary hover:text-main dark:text-slate-300 dark:hover:text-white font-medium transition-colors shrink-0"
      >
        KONTAK
      </a>

      {#if !user}
        <Button
          href="/auth/login"
          variant="primary"
          class="hidden sm:inline-flex !rounded-full !h-10 px-5 text-xs font-semibold tracking-wider uppercase shadow-xs shrink-0"
        >
          Masuk
        </Button>
      {/if}

      <!-- Circular Theme Toggle Button -->
      <Button
        id="theme-toggle-btn"
        variant="ghost"
        on:click={toggleTheme}
        aria-label="Ubah tema"
        title={isDark ? 'Mode Terang' : 'Mode Gelap'}
        class="!w-10 !h-10 !p-0 !rounded-full bg-card/70 hover:bg-card border border-neutral-200 dark:border-neutral-800 dark:bg-white/5 dark:hover:bg-white/10 text-main dark:text-white shadow-sm shrink-0"
      >
        {#if isDark}
          <Sun size={18} class="text-amber-400 shrink-0" />
        {:else}
          <Moon size={18} class="text-slate-700 dark:text-white shrink-0" />
        {/if}
      </Button>

      <!-- User Profile Dropdown or Mobile Auth Button -->
      {#if user}
        <NavbarUserMenu {user} onSignOut={handleSignOut} {isLoggingOut} />
      {:else}
        <Button
          href="/auth/login"
          variant="primary"
          class="sm:hidden !rounded-full !h-10 px-4 text-xs font-semibold whitespace-nowrap shadow-xs shrink-0"
        >
          Masuk
        </Button>
      {/if}

      <!-- Circular Mobile Menu Toggle Button -->
      <div class="md:hidden shrink-0">
        <Button
          variant="ghost"
          on:click={() => (isMobileMenuOpen = !isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          class="!w-10 !h-10 !p-0 !rounded-full bg-card/70 hover:bg-card border border-neutral-200 dark:border-neutral-800 text-main dark:bg-white/5 dark:text-white shadow-sm shrink-0"
        >
          {#if isMobileMenuOpen}
            <X size={18} class="shrink-0" />
          {:else}
            <Menu size={18} class="shrink-0" />
          {/if}
        </Button>
      </div>
    </div>
  </div>

  <!-- Mobile Drawer Menu -->
  <NavbarMobileDrawer
    isOpen={isMobileMenuOpen}
    {berandaItems}
    {helpCenterItems}
    {currentPath}
    onClose={() => (isMobileMenuOpen = false)}
  />
</header>
