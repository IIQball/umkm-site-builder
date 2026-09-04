<script context="module" lang="ts">
  export type NavUser = {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    image?: string | null;
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { signOut } from '@/lib/auth-client';
  import {
    Sun,
    Moon,
    LayoutDashboard,
    Palette,
    ShoppingBag,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Shield,
    Sparkles,
    Store,
    Wallet,
  } from 'lucide-svelte';

  export let user: NavUser | null = null;
  export let currentPath: string = '';

  let isDark = false;
  let isUserMenuOpen = false;
  let isMobileMenuOpen = false;
  let isLoggingOut = false;

  let menuContainer: HTMLDivElement;

  onMount(() => {
    // Detect theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    applyTheme(isDark);

    if (!currentPath && typeof window !== 'undefined') {
      currentPath = window.location.pathname;
    }

    // Click outside listener for user dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (menuContainer && !menuContainer.contains(event.target as Node)) {
        isUserMenuOpen = false;
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
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
    try {
      await signOut();
      window.location.href = '/auth/login';
    } catch {
      window.location.href = '/auth/login';
    }
  };

  const getRoleBadge = (role?: string | null) => {
    switch (role) {
      case 'designer':
        return { label: 'Desainer', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
      case 'admin':
        return { label: 'Admin', color: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30' };
      case 'superadmin':
        return { label: 'Super Admin', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30' };
      default:
        return { label: 'Tenant Toko', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' };
    }
  };

  const getDashboardHref = (role?: string | null) => {
    if (role === 'designer') return '/designer/wallet';
    if (role === 'admin' || role === 'superadmin') return '/admin/templates';
    return '/dashboard';
  };

  const getDashboardLabel = (role?: string | null) => {
    if (role === 'designer') return 'Studio Desainer';
    if (role === 'admin' || role === 'superadmin') return 'Panel Admin';
    return 'Dashboard Toko';
  };

  $: userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');
  $: roleMeta = getRoleBadge(user?.role);
  $: dashboardHref = getDashboardHref(user?.role);
  $: dashboardLabel = getDashboardLabel(user?.role);
</script>

<nav class="sticky top-0 z-50 bg-card/85 backdrop-blur-xl border-b border-light transition-colors shadow-xs">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 sm:h-18">
      <!-- Left: Brand Logo & Public Nav Links -->
      <div class="flex items-center gap-8">
        <!-- Logo Emblem -->
        <a href="/" class="flex items-center gap-2.5 group cursor-pointer">
          <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary via-indigo-600 to-violet-500 text-white flex items-center justify-center font-black text-base shadow-md shadow-primary/20 group-hover:scale-105 group-hover:shadow-primary/35 transition-all duration-300">
            <Sparkles size={18} class="stroke-[2.5]" />
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-base sm:text-lg tracking-tight text-main group-hover:text-primary transition-colors">
                UMKM Builder
              </span>
              <span class="bg-primary/10 text-primary border border-primary/20 text-3xs font-extrabold px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                SaaS
              </span>
            </div>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center gap-1">
          <a
            href="/"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all {currentPath === '/'
              ? 'bg-primary/10 text-primary font-extrabold'
              : 'text-secondary hover:text-main hover:bg-nested'}"
          >
            Beranda
          </a>
          <a
            href="/templates"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all {currentPath.startsWith('/templates')
              ? 'bg-primary/10 text-primary font-extrabold'
              : 'text-secondary hover:text-main hover:bg-nested'}"
          >
            Katalog Template
          </a>
          <a
            href="/umkm"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all {currentPath.startsWith('/umkm')
              ? 'bg-primary/10 text-primary font-extrabold'
              : 'text-secondary hover:text-main hover:bg-nested'}"
          >
            Direktori UMKM
          </a>
        </div>
      </div>

      <!-- Right: Theme Toggle -> Divider -> Auth Buttons / User Profile Dropdown -->
      <div class="flex items-center gap-3">
        <!-- 1. Theme Toggle (Sun/Moon switch before auth buttons) -->
        <button
          type="button"
          on:click={toggleTheme}
          aria-label="Ubah tema"
          class="w-9 h-9 rounded-2xl bg-nested hover:bg-nested/80 border border-light text-secondary hover:text-main flex items-center justify-center transition-all shadow-2xs hover:shadow-xs cursor-pointer"
          title={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
        >
          {#if isDark}
            <Sun size={17} class="text-amber-400 animate-fade-in" />
          {:else}
            <Moon size={17} class="text-slate-700 animate-fade-in" />
          {/if}
        </button>

        <!-- Vertical Subtle Divider -->
        <div class="w-[1px] h-6 bg-light hidden sm:block"></div>

        <!-- 2. Auth Actions or User Profile Dropdown -->
        {#if user}
          <!-- User Dropdown Menu Container -->
          <div class="relative" bind:this={menuContainer}>
            <button
              type="button"
              on:click|stopPropagation={() => (isUserMenuOpen = !isUserMenuOpen)}
              class="flex items-center gap-2.5 p-1 sm:pl-2.5 sm:pr-3 py-1.5 rounded-2xl bg-nested/80 hover:bg-card border border-light text-main transition-all shadow-2xs hover:shadow-sm cursor-pointer group"
            >
              <!-- Avatar Circle with Initial / Image -->
              <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                {#if user.image}
                  <img src={user.image} alt={user.name || 'User'} class="w-full h-full object-cover rounded-xl" />
                {:else}
                  <span>{userInitial}</span>
                {/if}
              </div>

              <!-- User Name & Role (Desktop) -->
              <div class="hidden sm:flex flex-col text-left min-w-0 max-w-[120px]">
                <span class="text-xs font-bold text-main truncate leading-tight">
                  {user.name || 'Pengguna'}
                </span>
                <span class="text-3xs text-secondary truncate font-medium">
                  {roleMeta.label}
                </span>
              </div>

              <!-- Dropdown Chevron -->
              <ChevronDown
                size={14}
                class="text-muted transition-transform duration-200 {isUserMenuOpen ? 'rotate-180 text-primary' : ''}"
              />
            </button>

            <!-- Dropdown Popover Card -->
            {#if isUserMenuOpen}
              <div
                class="absolute right-0 mt-2 w-64 rounded-3xl bg-card border border-light shadow-xl shadow-indigo-500/10 p-2 space-y-1.5 z-50 animate-fade-in-up"
              >
                <!-- Profile Header -->
                <div class="p-3 bg-nested/70 rounded-2xl border border-light/60 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs flex-shrink-0">
                    {#if user.image}
                      <img src={user.image} alt={user.name || 'User'} class="w-full h-full object-cover rounded-2xl" />
                    {:else}
                      <span>{userInitial}</span>
                    {/if}
                  </div>
                  <div class="flex flex-col min-w-0">
                    <p class="text-xs font-bold text-main truncate leading-snug">
                      {user.name || 'Pengguna'}
                    </p>
                    <p class="text-3xs text-secondary truncate font-sans">
                      {user.email || '-'}
                    </p>
                    <div class="mt-1">
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-4xs font-bold border {roleMeta.color}">
                        {roleMeta.label}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Navigation Links -->
                <div class="py-1 space-y-0.5 text-xs font-semibold text-secondary">
                  <a
                    href={dashboardHref}
                    class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-main hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    {#if user.role === 'designer'}
                      <Wallet size={15} class="text-emerald-500" />
                    {:else if user.role === 'admin' || user.role === 'superadmin'}
                      <Shield size={15} class="text-indigo-500" />
                    {:else}
                      <Store size={15} class="text-primary" />
                    {/if}
                    <span>{dashboardLabel}</span>
                  </a>

                  {#if user.role === 'tenant'}
                    <a
                      href="/dashboard/orders"
                      class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-main hover:bg-nested transition-colors cursor-pointer"
                    >
                      <ShoppingBag size={15} class="text-amber-500" />
                      <span>Riwayat Pembelian</span>
                    </a>
                  {:else if user.role === 'designer'}
                    <a
                      href="/designer/orders"
                      class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-main hover:bg-nested transition-colors cursor-pointer"
                    >
                      <ShoppingBag size={15} class="text-amber-500" />
                      <span>Pesanan Masuk</span>
                    </a>
                  {/if}

                  <a
                    href="/templates"
                    class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-main hover:bg-nested transition-colors cursor-pointer"
                  >
                    <Palette size={15} class="text-violet-500" />
                    <span>Katalog Template</span>
                  </a>
                </div>

                <div class="border-t border-light my-1"></div>

                <!-- Logout Button -->
                <button
                  type="button"
                  on:click={handleSignOut}
                  disabled={isLoggingOut}
                  class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {#if isLoggingOut}
                    <span class="material-symbols-outlined text-sm animate-spin">refresh</span>
                    <span>Keluar...</span>
                  {:else}
                    <LogOut size={15} />
                    <span>Keluar dari Akun</span>
                  {/if}
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <!-- Guest Auth Actions -->
          <div class="hidden sm:flex items-center gap-2">
            <a
              href="/auth/login"
              class="px-4 py-2 rounded-2xl text-xs font-bold text-secondary hover:text-main hover:bg-nested transition-all cursor-pointer"
            >
              Masuk
            </a>
            <a
              href="/auth/login?mode=register"
              class="px-4 py-2 rounded-2xl bg-gradient-to-r from-primary via-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white text-xs font-bold shadow-sm hover:shadow-md hover:shadow-primary/20 transition-all cursor-pointer"
            >
              Daftar Gratis
            </a>
          </div>
        {/if}

        <!-- Mobile Hamburger Button -->
        <div class="md:hidden">
          <button
            type="button"
            on:click={() => (isMobileMenuOpen = !isMobileMenuOpen)}
            class="w-9 h-9 rounded-2xl bg-nested border border-light text-secondary hover:text-main flex items-center justify-center transition-all cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {#if isMobileMenuOpen}
              <X size={18} />
            {:else}
              <Menu size={18} />
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Drawer / Menu Dropdown -->
  {#if isMobileMenuOpen}
    <div class="md:hidden border-t border-light bg-card p-4 space-y-4 shadow-lg animate-fade-in">
      <!-- Mobile Links -->
      <div class="flex flex-col space-y-1">
        <a
          href="/"
          class="px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all {currentPath === '/'
            ? 'bg-primary/10 text-primary'
            : 'text-secondary hover:bg-nested'}"
        >
          Beranda
        </a>
        <a
          href="/templates"
          class="px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all {currentPath.startsWith('/templates')
            ? 'bg-primary/10 text-primary'
            : 'text-secondary hover:bg-nested'}"
        >
          Katalog Template
        </a>
        <a
          href="/umkm"
          class="px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all {currentPath.startsWith('/umkm')
            ? 'bg-primary/10 text-primary'
            : 'text-secondary hover:bg-nested'}"
        >
          Direktori UMKM
        </a>
      </div>

      <div class="border-t border-light pt-3">
        {#if user}
          <div class="space-y-2">
            <a
              href={dashboardHref}
              class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-sm cursor-pointer"
            >
              <LayoutDashboard size={15} />
              <span>{dashboardLabel}</span>
            </a>
            <button
              type="button"
              on:click={handleSignOut}
              class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/10 text-rose-600 font-bold text-xs cursor-pointer"
            >
              <LogOut size={15} />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        {:else}
          <div class="grid grid-cols-2 gap-2">
            <a
              href="/auth/login"
              class="flex items-center justify-center px-4 py-2.5 rounded-2xl bg-nested text-main font-bold text-xs border border-light"
            >
              Masuk
            </a>
            <a
              href="/auth/login?mode=register"
              class="flex items-center justify-center px-4 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-sm"
            >
              Daftar Gratis
            </a>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</nav>
