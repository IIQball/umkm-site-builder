<script lang="ts">
  import { onMount } from 'svelte';
  import type { AuthenticatedUser } from '@/lib/auth';

  export let userJson: string;
  export let breadcrumb: string | undefined = undefined;

  const user: AuthenticatedUser = JSON.parse(userJson);
  const userInitial = (user.name ?? user.email).charAt(0).toUpperCase();

  const roleMeta: Record<string, { label: string; cls: string }> = {
    superadmin: { label: 'Super Admin', cls: 'badge-custom-rose' },
    admin:      { label: 'Admin',       cls: 'badge-custom-amber' },
    designer:   { label: 'Designer',   cls: 'badge-custom-indigo' },
    tenant:     { label: 'Tenant',     cls: 'badge-custom-emerald' },
  };
  const role = roleMeta[user.role] ?? { label: user.role, cls: 'badge-custom-slate' };
  const homePath = user.role === 'designer' ? '/designer/wallet' : '/dashboard';

  let dropdownOpen = false;
  let isDark = false;

  const toggleDropdown = () => { dropdownOpen = !dropdownOpen; };
  const closeDropdown = () => { dropdownOpen = false; };

  onMount(() => {
    isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  });

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
    isDark = next === 'dark';
  };

  const getTodayFormatted = () => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(new Date());
  };
</script>

<svelte:window on:click={closeDropdown} />

<header
  class="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-8
         bg-canvas/90 backdrop-blur-md border-b border-light flex-shrink-0"
>
  <!-- Left: search bar capsule + date pill badge -->
  <div class="flex items-center gap-3 flex-1 min-w-0 max-w-md">
    <label
      class="flex items-center gap-2.5 w-full bg-card border border-light rounded-full
             px-4 py-2 cursor-text hover:border-main/40 hover:bg-card transition-all shadow-xs group"
      for="navbar-search"
    >
      <span class="material-symbols-outlined text-base text-muted group-hover:text-primary transition-colors flex-shrink-0">search</span>
      <input
        id="navbar-search"
        type="text"
        placeholder="Cari fitur, template, mutasi..."
        class="bg-transparent border-none outline-none text-xs text-main
               placeholder:text-muted w-full min-w-0"
        readonly
        on:focus|preventDefault={() => {}}
      />
      <span class="hidden sm:flex items-center gap-0.5 flex-shrink-0">
        <kbd class="text-3xs font-semibold text-muted bg-nested border border-light rounded-md px-1.5 py-0.5 leading-none">⌘</kbd>
        <kbd class="text-3xs font-semibold text-muted bg-nested border border-light rounded-md px-1.5 py-0.5 leading-none">K</kbd>
      </span>
    </label>

    <!-- Date pill badge like reference image -->
    <div class="hidden lg:flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-2xs">
      <span>Today, {getTodayFormatted()}</span>
    </div>
  </div>

  <!-- Right: breadcrumb (mobile), actions, profile chip -->
  <div class="flex items-center gap-2.5 flex-shrink-0 ml-3">
    <!-- Breadcrumb (mobile only) -->
    {#if breadcrumb}
      <span class="sm:hidden text-xs font-semibold text-main truncate max-w-[120px]">
        {breadcrumb}
      </span>
    {/if}

    <!-- Settings gear icon button -->
    <a
      href="/auth/settings"
      class="w-9 h-9 rounded-full bg-card border border-light flex items-center justify-center text-muted
             hover:text-main hover:bg-nested transition-all shadow-xs cursor-pointer"
      aria-label="Pengaturan"
      title="Pengaturan"
    >
      <span class="material-symbols-outlined text-lg">settings</span>
    </a>

    <!-- Notification icon button with pulsing dot -->
    <button
      type="button"
      class="w-9 h-9 rounded-full bg-card border border-light flex items-center justify-center text-muted
             hover:text-main hover:bg-nested transition-all relative shadow-xs cursor-pointer"
      aria-label="Notifikasi"
      title="Notifikasi"
    >
      <span class="material-symbols-outlined text-lg">notifications</span>
      <span class="absolute top-2 right-2 flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-primary ring-2 ring-card"></span>
      </span>
    </button>

    <!-- Theme toggle icon button -->
    <button
      type="button"
      on:click={toggleTheme}
      class="w-9 h-9 rounded-full bg-card border border-light flex items-center justify-center
             text-muted hover:text-main hover:bg-nested transition-all shadow-xs cursor-pointer group"
      aria-label="Toggle tema gelap/terang"
      title="Toggle tema"
    >
      {#if isDark}
        <span class="material-symbols-outlined text-lg transition-transform duration-300 group-hover:rotate-90">light_mode</span>
      {:else}
        <span class="material-symbols-outlined text-lg transition-transform duration-300 group-hover:-rotate-45">dark_mode</span>
      {/if}
    </button>

    <!-- Profile chip avatar -->
    <div class="relative ml-1">
      <button
        type="button"
        on:click|stopPropagation={toggleDropdown}
        class="flex items-center gap-2.5 p-1 rounded-full hover:bg-card border border-transparent hover:border-light transition-all group cursor-pointer"
        aria-label="Menu akun"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-primary/20 flex-shrink-0">
          {userInitial}
        </div>
      </button>

      <!-- Dropdown menu -->
      {#if dropdownOpen}
        <div
          class="absolute right-0 top-full mt-2 w-56 bg-card border border-light
                 rounded-2xl shadow-xl shadow-black/10 py-2 z-50 animate-fade-in"
          role="menu"
        >
          <div class="px-3.5 py-2.5 border-b border-light mb-1">
            <p class="text-xs font-bold text-main truncate">{user.name ?? user.email}</p>
            <p class="text-2xs text-muted truncate mt-0.5">{user.email}</p>
            <span class="inline-flex items-center text-3xs font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full px-2 py-0.5 mt-1.5">
              {role.label}
            </span>
          </div>
          <a
            href={homePath}
            class="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-secondary
                   hover:bg-nested hover:text-main transition-colors"
            role="menuitem"
          >
            <span class="material-symbols-outlined text-base">dashboard</span>
            Dashboard
          </a>
          <a
            href="/auth/settings"
            class="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-secondary
                   hover:bg-nested hover:text-main transition-colors"
            role="menuitem"
          >
            <span class="material-symbols-outlined text-base">manage_accounts</span>
            Pengaturan Akun
          </a>
          <div class="border-t border-light mt-1 pt-1">
            <a
              href="/auth/login"
              class="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-error
                     hover:bg-error/10 transition-colors"
              role="menuitem"
            >
              <span class="material-symbols-outlined text-base">logout</span>
              Keluar
            </a>
          </div>
        </div>
      {/if}
    </div>
  </div>
</header>
