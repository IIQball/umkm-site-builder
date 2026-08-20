<script lang="ts">
  import { signOut } from '@/lib/auth-client';
  import type { AuthenticatedUser } from '@/lib/auth';
  import { onMount } from 'svelte';

  export let userJson: string;

  const user: AuthenticatedUser = JSON.parse(userJson);

  // ── Role-based nav ────────────────────────────────────────────────────────
  type NavItem = { label: string; href: string; icon: string };

  const getNavItems = (role: AuthenticatedUser['role']): NavItem[] => {
    if (role === 'designer') return [
      { label: 'Dashboard',          href: '/dashboard',          icon: 'dashboard' },
      { label: 'Template Saya',      href: '/designer/templates', icon: 'grid_view' },
      { label: 'Buat Template',      href: '/builder/new',        icon: 'add_circle' },
      { label: 'Dompet',             href: '/designer/wallet',    icon: 'account_balance_wallet' },
    ];
    if (role === 'tenant') return [
      { label: 'Dashboard',          href: '/dashboard',          icon: 'dashboard' },
      { label: 'Produk',             href: '/dashboard/products', icon: 'inventory_2' },
      { label: 'Kategori',           href: '/dashboard/categories', icon: 'category' },
      { label: 'Pengaturan Toko',    href: '/dashboard/store',    icon: 'store' },
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
  const userInitial = (user.name ?? user.email).charAt(0).toUpperCase();

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

  // Sidebar width as CSS variable for smooth transition
  $: sidebarWidth = collapsed ? '72px' : '256px';
</script>

<!-- ═══════════════════════════════════════════════════
     DESKTOP SIDEBAR
═══════════════════════════════════════════════════ -->
<aside
  class="hidden md:flex flex-col bg-base-100/80 backdrop-blur-md border-r border-base-200/60
         transition-[width] duration-300 ease-in-out overflow-hidden flex-shrink-0 relative z-20"
  style="width: {sidebarWidth}"
  aria-label="Navigasi Dashboard"
>
  <!-- Brand row -->
  <div class="flex items-center h-14 px-3 border-b border-base-200/60 gap-2 flex-shrink-0">
    {#if !collapsed}
      <div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm shadow-blue-600/30">
        U
      </div>
      <span class="font-bold text-sm text-base-content tracking-tight truncate flex-1 select-none">
        UMKM Builder
      </span>
    {/if}
    <button
      type="button"
      on:click={toggleCollapse}
      class="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-base-content/40
             hover:text-base-content hover:bg-base-200 transition-colors"
      title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
      aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
    >
      <span class="material-symbols-outlined text-[18px]">
        {collapsed ? 'chevron_right' : 'chevron_left'}
      </span>
    </button>
  </div>

  <!-- Nav links -->
  <nav class="flex-1 overflow-y-auto py-3 px-2 space-y-0.5" aria-label="Menu utama">
    {#each navItems as item}
      {@const active = isActive(item.href)}
      <a
        href={item.href}
        title={collapsed ? item.label : undefined}
        class="flex items-center gap-3 px-2 py-2.5 rounded-xl text-xs font-medium
               transition-colors group
               {active
                 ? 'bg-primary/10 text-primary'
                 : 'text-base-content/60 hover:bg-base-200 hover:text-base-content'}"
      >
        <span
          class="material-symbols-outlined text-[20px] flex-shrink-0 transition-colors
                 {active ? 'text-primary' : 'text-base-content/40 group-hover:text-base-content'}"
        >
          {item.icon}
        </span>
        {#if !collapsed}
          <span class="truncate leading-none">{item.label}</span>
          {#if active}
            <span class="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
          {/if}
        {/if}
      </a>
    {/each}
  </nav>

  <!-- User + Logout -->
  <div class="border-t border-base-200/60 p-2 space-y-0.5 flex-shrink-0">
    {#if !collapsed}
      <div class="flex items-center gap-2.5 px-2 py-2 rounded-xl">
        <div class="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center
                    font-bold text-xs flex-shrink-0 shadow-sm shadow-blue-600/30">
          {userInitial}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-base-content truncate leading-tight">
            {user.name ?? user.email}
          </p>
          <p class="text-[10px] text-base-content/40 uppercase tracking-wider leading-tight mt-0.5">
            {user.role}
          </p>
        </div>
      </div>
    {/if}
    <button
      type="button"
      on:click={handleSignOut}
      title={collapsed ? 'Keluar' : undefined}
      class="flex items-center gap-3 w-full px-2 py-2 rounded-xl text-xs font-medium
             text-base-content/50 hover:text-rose-500 hover:bg-rose-500/8 transition-colors"
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
<!-- FAB: bottom-right thumb zone -->
<button
  type="button"
  on:click={openDrawer}
  class="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
         bg-blue-600 text-white shadow-xl shadow-blue-600/30
         flex items-center justify-center
         hover:bg-blue-700 active:scale-95 transition-all"
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
  class="md:hidden fixed top-0 right-0 z-50 h-full w-72 bg-base-100
         shadow-2xl flex flex-col
         transition-transform duration-300 ease-in-out"
  style="transform: translateX({drawerOpen ? '0' : '100%'})"
  aria-hidden={!drawerOpen}
  role="dialog"
  aria-modal="true"
  aria-label="Menu navigasi"
>
  <!-- Drawer header -->
  <div class="flex items-center justify-between h-14 px-4 border-b border-base-200/60">
    <div class="flex items-center gap-2">
      <div class="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-blue-600/30">U</div>
      <span class="font-bold text-sm text-base-content">UMKM Builder</span>
    </div>
    <button
      type="button"
      on:click={closeDrawer}
      class="w-8 h-8 rounded-lg flex items-center justify-center text-base-content/40
             hover:text-base-content hover:bg-base-200 transition-colors"
      aria-label="Tutup menu"
    >
      <span class="material-symbols-outlined text-[20px]">close</span>
    </button>
  </div>

  <!-- Drawer nav -->
  <nav class="flex-1 overflow-y-auto py-3 px-3 space-y-0.5" aria-label="Menu utama mobile">
    {#each navItems as item}
      {@const active = isActive(item.href)}
      <a
        href={item.href}
        on:click={closeDrawer}
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
               transition-colors
               {active
                 ? 'bg-primary/10 text-primary'
                 : 'text-base-content/60 hover:bg-base-200 hover:text-base-content'}"
      >
        <span class="material-symbols-outlined text-[20px] {active ? 'text-primary' : 'text-base-content/40'}">
          {item.icon}
        </span>
        <span class="flex-1">{item.label}</span>
        {#if active}
          <span class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
        {/if}
      </a>
    {/each}
  </nav>

  <!-- Drawer footer -->
  <div class="border-t border-base-200/60 p-3 space-y-1">
    <div class="flex items-center gap-2.5 px-2 py-2">
      <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-blue-600/30">
        {userInitial}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-base-content truncate">{user.name ?? user.email}</p>
        <p class="text-xs text-base-content/40 uppercase tracking-wider">{user.role}</p>
      </div>
    </div>
    <button
      type="button"
      on:click={handleSignOut}
      class="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium
             text-base-content/50 hover:text-rose-500 hover:bg-rose-500/8 transition-colors"
    >
      <span class="material-symbols-outlined text-[20px]">logout</span>
      <span>Keluar</span>
    </button>
  </div>
</div>
