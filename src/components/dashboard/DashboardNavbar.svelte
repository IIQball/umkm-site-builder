<script lang="ts">
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
  const toggleDropdown = () => { dropdownOpen = !dropdownOpen; };
  const closeDropdown = () => { dropdownOpen = false; };

  const toggleTheme = () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
  };
</script>

<svelte:window on:click={closeDropdown} />

<header
  class="sticky top-0 z-30 h-14 flex items-center justify-between px-4 md:px-6
         bg-card/80 backdrop-blur-md border-b border-light/80 flex-shrink-0"
>
  <!-- Left: search bar capsule -->
  <div class="flex items-center gap-3 flex-1 min-w-0 max-w-xs">
    <label
      class="flex items-center gap-2 w-full bg-nested border border-light rounded-xl
             px-3 py-1.5 cursor-text hover:border-main hover:bg-card transition-colors group"
      for="navbar-search"
    >
      <span class="material-symbols-outlined text-sm text-muted flex-shrink-0">search</span>
      <input
        id="navbar-search"
        type="text"
        placeholder="Cari..."
        class="bg-transparent border-none outline-none text-xs text-main
               placeholder:text-muted w-full min-w-0"
        readonly
        on:focus|preventDefault={() => {}}
      />
      <span class="hidden sm:flex items-center gap-0.5 flex-shrink-0">
        <kbd class="text-[10px] font-medium text-muted bg-nested border border-light rounded px-1.5 py-0.5 leading-none">⌘</kbd>
        <kbd class="text-[10px] font-medium text-muted bg-nested border border-light rounded px-1.5 py-0.5 leading-none">F</kbd>
      </span>
    </label>
  </div>

  <!-- Right: breadcrumb (mobile), actions, profile chip -->
  <div class="flex items-center gap-2 flex-shrink-0 ml-3">
    <!-- Breadcrumb (mobile only) -->
    {#if breadcrumb}
      <span class="sm:hidden text-xs font-semibold text-main truncate max-w-[120px]">
        {breadcrumb}
      </span>
    {/if}

    <!-- Notification icon -->
    <button
      type="button"
      class="w-8 h-8 rounded-xl flex items-center justify-center text-muted
             hover:text-main hover:bg-nested transition-colors relative cursor-pointer"
      aria-label="Notifikasi"
      title="Notifikasi"
    >
      <span class="material-symbols-outlined text-sm">notifications</span>
    </button>

    <!-- Theme toggle -->
    <button
      type="button"
      on:click={toggleTheme}
      class="w-8 h-8 rounded-xl flex items-center justify-center
             text-muted hover:text-main hover:bg-nested transition-colors cursor-pointer"
      aria-label="Toggle tema gelap/terang"
      title="Toggle tema"
    >
      <span class="material-symbols-outlined text-sm">contrast</span>
    </button>

    <!-- Profile chip -->
    <div class="relative">
      <button
        type="button"
        on:click|stopPropagation={toggleDropdown}
        class="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl
               hover:bg-nested border border-transparent hover:border-light transition-all group cursor-pointer"
        aria-label="Menu akun"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        <div class="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center
                    font-bold text-xs shadow-sm flex-shrink-0">
          {userInitial}
        </div>
        <div class="hidden md:flex flex-col items-start min-w-0">
          <span class="text-xs font-semibold text-main max-w-[100px] truncate leading-tight">
            {user.name ?? user.email}
          </span>
          <span class="badge-custom text-[10px] font-bold border rounded-full px-1.5 py-0.5 leading-none mt-0.5 {role.cls}">
            {role.label}
          </span>
        </div>
        <span class="material-symbols-outlined text-sm text-muted hidden md:block
                     transition-transform {dropdownOpen ? 'rotate-180' : ''}">
          expand_more
        </span>
      </button>

      <!-- Dropdown menu -->
      {#if dropdownOpen}
        <div
          class="absolute right-0 top-full mt-2 w-52 bg-card border border-light
                 rounded-2xl shadow-lg shadow-black/8 py-1.5 z-50"
          role="menu"
        >
          <div class="px-3 py-2.5 border-b border-light mb-1">
            <p class="text-xs font-semibold text-main truncate">{user.name ?? user.email}</p>
            <p class="text-xs text-muted truncate mt-0.5">{user.email}</p>
          </div>
          <a
            href={homePath}
            class="flex items-center gap-2.5 px-3 py-2 text-sm text-secondary
                   hover:bg-nested hover:text-main transition-colors"
            role="menuitem"
          >
            <span class="material-symbols-outlined text-sm">dashboard</span>
            Dashboard
          </a>
          <a
            href="/auth/settings"
            class="flex items-center gap-2.5 px-3 py-2 text-sm text-secondary
                   hover:bg-nested hover:text-main transition-colors"
            role="menuitem"
          >
            <span class="material-symbols-outlined text-sm">manage_accounts</span>
            Pengaturan Akun
          </a>
          <div class="border-t border-light mt-1 pt-1">
            <a
              href="/auth/login"
              class="flex items-center gap-2.5 px-3 py-2 text-sm text-rose-500
                     hover:bg-rose-50/10 transition-colors"
              role="menuitem"
            >
              <span class="material-symbols-outlined text-sm">logout</span>
              Keluar
            </a>
          </div>
        </div>
      {/if}
    </div>
  </div>
</header>
