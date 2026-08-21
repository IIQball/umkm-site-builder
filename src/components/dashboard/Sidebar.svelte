<script lang="ts">
  import { signOut } from '@/lib/auth-client';
  import type { AuthenticatedUser } from '@/lib/auth';
  import { onMount } from 'svelte';

  export let userJson: string;

  const user: AuthenticatedUser = JSON.parse(userJson);

  // ── Role-based nav ────────────────────────────────────────────────────────
  type NavItem = { label: string; href: string; icon: string; group?: string };

  const getNavItems = (role: AuthenticatedUser['role']): NavItem[] => {
    if (role === 'designer') return [
      // GENERAL group
      { label: 'Dashboard',         href: '/designer/wallet',    icon: 'account_balance_wallet', group: 'GENERAL' },
      { label: 'Template Saya',     href: '/designer/templates', icon: 'grid_view',              group: 'GENERAL' },
      // ACCOUNT group
      { label: 'Profil Desainer',   href: '/auth/settings',      icon: 'manage_accounts',        group: 'ACCOUNT' },
      { label: 'Kembali ke Publik', href: '/public/templates',   icon: 'open_in_new',            group: 'ACCOUNT' },
    ];
    if (role === 'tenant') return [
      { label: 'Dashboard',       href: '/dashboard',            icon: 'dashboard' },
      { label: 'Produk',          href: '/dashboard/products',   icon: 'inventory_2' },
      { label: 'Kategori',        href: '/dashboard/categories', icon: 'category' },
      { label: 'Pengaturan Toko', href: '/dashboard/store',      icon: 'store' },
    ];
    if (role === 'admin' || role === 'superadmin') return [
      { label: 'Overview',           href: '/dashboard',          icon: 'monitoring' },
      { label: 'Kurasi Template',    href: '/admin/templates',    icon: 'palette' },
      { label: 'Pengaturan Komisi',  href: '/admin/settings',     icon: 'settings' },
      { label: 'Manajemen User',     href: '/admin/users',        icon: 'group' },
      { label: 'Transaksi',          href: '/admin/transactions', icon: 'receipt_long' },
    ];
    return [{ label: 'Dashboard', href: '/dashboard', icon: 'dashboard' }];
  };

  const navItems = getNavItems(user.role);
  const isDesigner = user.role === 'designer';
  const userInitial = (user.name ?? user.email).charAt(0).toUpperCase();

  // Groups for designer sidebar
  const generalItems = navItems.filter((i) => i.group === 'GENERAL');
  const accountItems = navItems.filter((i) => i.group === 'ACCOUNT');
  const flatItems    = navItems.filter((i) => !i.group);

  // ── Collapse (desktop) ────────────────────────────────────────────────────
  let collapsed = false;

  onMount(() => {
    collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const toggleCollapse = () => {
    collapsed = !collapsed;
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  };

  // ── Active link detection ─────────────────────────────────────────────────
  let currentPath = '';
  onMount(() => { currentPath = window.location.pathname; });

  const isActive = (href: string): boolean => {
    if (href === '/dashboard') return currentPath === '/dashboard';
    return currentPath.startsWith(href);
  };

  // ── Mobile drawer ─────────────────────────────────────────────────────────
  let drawerOpen = false;
  const openDrawer = () => { drawerOpen = true; };
  const closeDrawer = () => { drawerOpen = false; };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/auth/login';
  };

  $: sidebarWidth = collapsed ? '72px' : '256px';
</script>

<!-- ═══════════════════════════════════════════════════
     DESKTOP SIDEBAR — Nexus-style clean white
═══════════════════════════════════════════════════ -->
<aside
  class="hidden md:flex flex-col bg-card border-r border-light
         transition-[width] duration-300 ease-in-out overflow-hidden flex-shrink-0 relative z-20"
  style="width: {sidebarWidth}"
  aria-label="Navigasi Dashboard"
>
  <!-- Brand -->
  <div class="flex items-center h-14 px-3 border-b border-light gap-2.5 flex-shrink-0">
    {#if !collapsed}
      <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm shadow-indigo-600/25">
        <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1">storefront</span>
      </div>
      <div class="flex-1 min-w-0">
        <span class="font-bold text-[13px] text-main tracking-tight truncate block leading-tight select-none">
          UMKM Builder
        </span>
        <span class="text-[10px] text-muted uppercase tracking-wider leading-tight select-none">
          Designer Hub
        </span>
      </div>
    {:else}
      <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-indigo-600/25">
        <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1">storefront</span>
      </div>
    {/if}
    <button
      type="button"
      on:click={toggleCollapse}
      class="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-muted
             hover:text-main hover:bg-nested transition-colors flex-shrink-0"
      title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
      aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
    >
      <span class="material-symbols-outlined text-[17px]">
        {collapsed ? 'chevron_right' : 'chevron_left'}
      </span>
    </button>
  </div>

  <!-- Nav links -->
  <nav class="flex-1 overflow-y-auto py-4 px-2.5 space-y-0.5" aria-label="Menu utama">
    {#if isDesigner}
      <!-- GENERAL group -->
      {#if !collapsed}
        <p class="text-[10px] font-extrabold uppercase tracking-widest text-muted px-2.5 pb-1.5">General</p>
      {/if}
      {#each generalItems as item}
        {@const active = isActive(item.href)}
        <a
          href={item.href}
          title={collapsed ? item.label : undefined}
          class="flex items-center gap-3 px-2.5 py-2 rounded-xl text-[13px] font-medium
                 transition-colors group
                 {active
                   ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400'
                   : 'text-secondary hover:bg-nested hover:text-main'}"
        >
          <span
            class="material-symbols-outlined text-[19px] flex-shrink-0 transition-colors"
            style={active ? "font-variation-settings:'FILL' 1" : ''}
          >
            {item.icon}
          </span>
          {#if !collapsed}
            <span class="truncate leading-none {active ? 'font-semibold' : ''}">{item.label}</span>
            {#if active}
              <span class="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></span>
            {/if}
          {/if}
        </a>
      {/each}

      <!-- ACCOUNT group -->
      {#if !collapsed}
        <p class="text-[10px] font-extrabold uppercase tracking-widest text-muted px-2.5 pb-1.5 pt-4">Account</p>
      {:else}
        <div class="border-t border-light my-2"></div>
      {/if}
      {#each accountItems as item}
        {@const active = isActive(item.href)}
        <a
          href={item.href}
          title={collapsed ? item.label : undefined}
          class="flex items-center gap-3 px-2.5 py-2 rounded-xl text-[13px] font-medium
                 transition-colors group
                 {active
                   ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400'
                   : 'text-secondary hover:bg-nested hover:text-main'}"
        >
          <span class="material-symbols-outlined text-[19px] flex-shrink-0">{item.icon}</span>
          {#if !collapsed}
            <span class="truncate leading-none">{item.label}</span>
          {/if}
        </a>
      {/each}

    {:else}
      <!-- Non-designer: flat list (unchanged behavior) -->
      {#each flatItems as item}
        {@const active = isActive(item.href)}
        <a
          href={item.href}
          title={collapsed ? item.label : undefined}
          class="flex items-center gap-3 px-2.5 py-2 rounded-xl text-[13px] font-medium
                 transition-colors group
                 {active
                   ? 'bg-primary/10 text-primary'
                   : 'text-secondary hover:bg-nested hover:text-main'}"
        >
          <span class="material-symbols-outlined text-[19px] flex-shrink-0">{item.icon}</span>
          {#if !collapsed}
            <span class="truncate leading-none">{item.label}</span>
            {#if active}
              <span class="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
            {/if}
          {/if}
        </a>
      {/each}
    {/if}
  </nav>

  <!-- User footer card -->
  <div class="border-t border-light p-2.5 flex-shrink-0">
    {#if !collapsed}
      <div class="bg-nested border border-light rounded-xl px-3 py-2.5 flex items-center gap-2.5 mb-2">
        <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center
                    font-bold text-sm flex-shrink-0 shadow-sm shadow-indigo-600/25">
          {userInitial}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[12px] font-semibold text-main truncate leading-tight">
            {user.name ?? user.email}
          </p>
          <span class="inline-flex items-center text-[10px] font-bold text-indigo-600 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-1.5 py-0.5 uppercase tracking-wider mt-0.5">
            {user.role}
          </span>
        </div>
      </div>
    {/if}
    <button
      type="button"
      on:click={handleSignOut}
      title={collapsed ? 'Keluar' : undefined}
      class="flex items-center gap-3 w-full px-2.5 py-2 rounded-xl text-[13px] font-medium
             text-muted hover:text-rose-500 hover:bg-rose-50/10 transition-colors"
    >
      <span class="material-symbols-outlined text-[18px] flex-shrink-0">logout</span>
      {#if !collapsed}
        <span>Keluar</span>
      {/if}
    </button>
  </div>
</aside>

<!-- ═══════════════════════════════════════════════════
     MOBILE — FAB + SLIDE-OVER DRAWER
═══════════════════════════════════════════════════ -->
<button
  type="button"
  on:click={openDrawer}
  class="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
         bg-indigo-600 text-white shadow-xl shadow-indigo-600/30
         flex items-center justify-center
         hover:bg-indigo-700 active:scale-95 transition-all"
  aria-label="Buka menu navigasi"
>
  <span class="material-symbols-outlined text-[24px]">menu</span>
</button>

<!-- Backdrop -->
{#if drawerOpen}
  <button
    type="button"
    class="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
    on:click={closeDrawer}
    aria-label="Tutup menu"
  ></button>
{/if}

<!-- Drawer panel -->
<div
  class="md:hidden fixed top-0 right-0 z-50 h-full w-72 bg-card
         shadow-2xl flex flex-col
         transition-transform duration-300 ease-in-out border-l border-light"
  style="transform: translateX({drawerOpen ? '0' : '100%'})"
  aria-hidden={!drawerOpen}
  role="dialog"
  aria-modal="true"
  aria-label="Menu navigasi"
>
  <div class="flex items-center justify-between h-14 px-4 border-b border-light">
    <div class="flex items-center gap-2.5">
      <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-indigo-600/25">
        <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1">storefront</span>
      </div>
      <span class="font-bold text-[13px] text-main">UMKM Builder</span>
    </div>
    <button
      type="button"
      on:click={closeDrawer}
      class="w-8 h-8 rounded-lg flex items-center justify-center text-muted
             hover:text-main hover:bg-nested transition-colors"
      aria-label="Tutup menu"
    >
      <span class="material-symbols-outlined text-[20px]">close</span>
    </button>
  </div>

  <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5" aria-label="Menu utama mobile">
    {#if isDesigner}
      <p class="text-[10px] font-extrabold uppercase tracking-widest text-muted px-2 pb-2">General</p>
      {#each generalItems as item}
        {@const active = isActive(item.href)}
        <a
          href={item.href}
          on:click={closeDrawer}
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                 transition-colors
                 {active ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-secondary hover:bg-nested hover:text-main'}"
        >
          <span class="material-symbols-outlined text-[20px]">{item.icon}</span>
          <span class="flex-1">{item.label}</span>
          {#if active}<span class="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></span>{/if}
        </a>
      {/each}
      <p class="text-[10px] font-extrabold uppercase tracking-widest text-muted px-2 pb-2 pt-4">Account</p>
      {#each accountItems as item}
        {@const active = isActive(item.href)}
        <a
          href={item.href}
          on:click={closeDrawer}
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                 transition-colors
                 {active ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-secondary hover:bg-nested hover:text-main'}"
        >
          <span class="material-symbols-outlined text-[20px]">{item.icon}</span>
          <span class="flex-1">{item.label}</span>
        </a>
      {/each}
    {:else}
      {#each flatItems as item}
        {@const active = isActive(item.href)}
        <a
          href={item.href}
          on:click={closeDrawer}
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                 transition-colors
                 {active ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-nested hover:text-main'}"
        >
          <span class="material-symbols-outlined text-[20px]">{item.icon}</span>
          <span class="flex-1">{item.label}</span>
          {#if active}<span class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>{/if}
        </a>
      {/each}
    {/if}
  </nav>

  <div class="border-t border-light p-3 space-y-1">
    <div class="flex items-center gap-2.5 px-2 py-2">
      <div class="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-indigo-600/25">
        {userInitial}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-main truncate">{user.name ?? user.email}</p>
        <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{user.role}</span>
      </div>
    </div>
    <button
      type="button"
      on:click={handleSignOut}
      class="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium
             text-muted hover:text-rose-500 hover:bg-rose-50/10 transition-colors"
    >
      <span class="material-symbols-outlined text-[20px]">logout</span>
      <span>Keluar</span>
    </button>
  </div>
</div>
