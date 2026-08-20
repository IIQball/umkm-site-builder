<script lang="ts">
  import type { AuthenticatedUser } from '@/lib/auth';

  export let userJson: string;
  export let breadcrumb: string | undefined = undefined;

  const user: AuthenticatedUser = JSON.parse(userJson);
  const userInitial = (user.name ?? user.email).charAt(0).toUpperCase();

  const roleMeta: Record<string, { label: string; cls: string }> = {
    superadmin: { label: 'Super Admin', cls: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
    admin:      { label: 'Admin',       cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    designer:   { label: 'Designer',   cls: 'bg-blue-500/10  text-blue-600  dark:text-blue-400'  },
    tenant:     { label: 'Tenant',     cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  };
  const role = roleMeta[user.role] ?? { label: user.role, cls: 'bg-base-200 text-base-content/60' };

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
  class="sticky top-0 z-30 h-14 flex items-center justify-between px-4 md:px-5
         bg-base-100/70 backdrop-blur-md border-b border-base-200/50 flex-shrink-0"
>
  <!-- Left: page title / breadcrumb -->
  <div class="flex items-center gap-2 text-sm min-w-0">
    <a
      href="/dashboard"
      class="font-medium text-base-content/50 hover:text-base-content transition-colors truncate hidden sm:block"
    >
      Dashboard
    </a>
    {#if breadcrumb}
      <span class="text-base-content/30 hidden sm:block">/</span>
      <span class="font-semibold text-base-content truncate">{breadcrumb}</span>
    {/if}
  </div>

  <!-- Right: role pill + avatar dropdown + theme toggle -->
  <div class="flex items-center gap-2 flex-shrink-0">
    <!-- Role pill -->
    <span class="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide {role.cls}">
      {role.label}
    </span>

    <!-- Avatar + dropdown -->
    <div class="relative">
      <button
        type="button"
        on:click|stopPropagation={toggleDropdown}
        class="flex items-center gap-2 px-2 py-1.5 rounded-xl
               hover:bg-base-200 transition-colors group"
        aria-label="Menu akun"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        <div class="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center
                    font-bold text-xs shadow-sm shadow-blue-600/30 flex-shrink-0">
          {userInitial}
        </div>
        <span class="text-xs font-medium text-base-content hidden md:block max-w-[120px] truncate">
          {user.name ?? user.email}
        </span>
        <span class="material-symbols-outlined text-[16px] text-base-content/40 hidden md:block
                     transition-transform {dropdownOpen ? 'rotate-180' : ''}">
          expand_more
        </span>
      </button>

      <!-- Dropdown menu -->
      {#if dropdownOpen}
        <div
          class="absolute right-0 top-full mt-2 w-52 bg-base-100 border border-base-200
                 rounded-xl shadow-xl shadow-black/10 py-1.5 z-50
                 animate-in fade-in slide-in-from-top-1 duration-150"
          role="menu"
        >
          <div class="px-3 py-2 border-b border-base-200/60 mb-1">
            <p class="text-xs font-semibold text-base-content truncate">{user.name ?? user.email}</p>
            <p class="text-[10px] text-base-content/40 truncate mt-0.5">{user.email}</p>
          </div>
          <a
            href="/dashboard"
            class="flex items-center gap-2.5 px-3 py-2 text-xs text-base-content/70
                   hover:bg-base-200 hover:text-base-content transition-colors"
            role="menuitem"
          >
            <span class="material-symbols-outlined text-[16px]">dashboard</span>
            Dashboard
          </a>
          <a
            href="/auth/settings"
            class="flex items-center gap-2.5 px-3 py-2 text-xs text-base-content/70
                   hover:bg-base-200 hover:text-base-content transition-colors"
            role="menuitem"
          >
            <span class="material-symbols-outlined text-[16px]">manage_accounts</span>
            Pengaturan Akun
          </a>
          <div class="border-t border-base-200/60 mt-1 pt-1">
            <a
              href="/auth/login"
              class="flex items-center gap-2.5 px-3 py-2 text-xs text-rose-500
                     hover:bg-rose-500/8 transition-colors"
              role="menuitem"
            >
              <span class="material-symbols-outlined text-[16px]">logout</span>
              Keluar
            </a>
          </div>
        </div>
      {/if}
    </div>

    <!-- Theme toggle -->
    <button
      type="button"
      on:click={toggleTheme}
      class="w-8 h-8 rounded-lg flex items-center justify-center
             text-base-content/40 hover:text-base-content hover:bg-base-200 transition-colors"
      aria-label="Toggle tema gelap/terang"
      title="Toggle tema"
    >
      <span class="material-symbols-outlined text-[18px]">contrast</span>
    </button>
  </div>
</header>
