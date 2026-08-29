<script lang="ts">
  import type { AuthenticatedUser } from '@/lib/auth';
  import type { NavGroup } from './sidebar.helpers';
  import { createEventDispatcher } from 'svelte';

  export let user: AuthenticatedUser;
  export let navGroups: NavGroup[] = [];
  export let collapsed = false;
  export let currentPath = '';

  const dispatch = createEventDispatcher<{
    toggleCollapse: void;
    signOut: void;
  }>();

  $: isDesigner = user.role === 'designer';
  $: userInitial = (user.name ?? user.email).charAt(0).toUpperCase();
  $: sidebarWidth = collapsed ? '76px' : '260px';

  const isActive = (href: string): boolean => {
    if (!currentPath) return false;
    const cleanCurrent = currentPath.replace(/\/$/, '') || '/';
    const cleanHref = href.replace(/\/$/, '') || '/';
    if (cleanHref === '/dashboard') return cleanCurrent === '/dashboard';
    return cleanCurrent === cleanHref || cleanCurrent.startsWith(cleanHref + '/');
  };
</script>

<aside
  class="hidden md:flex flex-col bg-card border-r border-light transition-[width] duration-300 ease-in-out overflow-hidden flex-shrink-0 relative z-20 shadow-sm select-none"
  style="width: {sidebarWidth}"
  aria-label="Navigasi Dashboard"
>
  <!-- Brand Header -->
  <div class="flex items-center h-16 px-3.5 border-b border-light gap-3 flex-shrink-0">
    <div class="w-10 h-10 rounded-2xl bg-nested border border-light flex items-center justify-center text-main font-bold shadow-sm flex-shrink-0 group hover:border-primary/40 transition-colors">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-main group-hover:text-primary transition-colors">
        <path d="M4 7C7 4.5 11 4.5 14 7C17 9.5 21 9.5 24 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
        <path d="M0 12C3 9.5 7 9.5 10 12C13 14.5 17 14.5 20 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
        <path d="M4 17C7 14.5 11 14.5 14 17C17 19.5 21 19.5 24 17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
      </svg>
    </div>

    {#if !collapsed}
      <div class="flex-1 min-w-0 animate-fade-in">
        <span class="font-heading font-extrabold text-sm text-main tracking-tight truncate block leading-tight">
          UMKM Builder
        </span>
        <span class="text-2xs font-medium text-muted leading-tight block truncate mt-0.5">
          {isDesigner ? 'Designer Workspace' : user.role === 'admin' || user.role === 'superadmin' ? 'Admin Portal' : 'Merchant Portal'}
        </span>
      </div>
    {/if}

    <button
      type="button"
      on:click={() => dispatch('toggleCollapse')}
      class="ml-auto w-7 h-7 rounded-xl flex items-center justify-center text-muted hover:text-main hover:bg-nested border border-transparent hover:border-light transition-all flex-shrink-0 cursor-pointer"
      title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
      aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
    >
      <span class="material-symbols-outlined text-sm">
        {collapsed ? 'chevron_right' : 'chevron_left'}
      </span>
    </button>
  </div>

  <!-- Nav Links Rail (Grouped for all roles) -->
  <nav class="flex-1 overflow-y-auto py-5 px-3 space-y-4" aria-label="Menu utama">
    {#each navGroups as group, groupIdx (group.title)}
      <div>
        {#if !collapsed}
          <p class="text-2xs font-bold font-heading uppercase tracking-wider text-muted px-2.5 pb-2">
            {group.title}
          </p>
        {:else if groupIdx > 0}
          <div class="border-t border-light my-2"></div>
        {/if}

        <div class="space-y-1">
          {#each group.items as item (item.href)}
            {@const active = isActive(item.href)}
            <a
              href={item.href}
              title={collapsed ? item.label : undefined}
              class="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all group relative {active
                ? 'bg-slate-900 text-white dark:bg-primary dark:text-white shadow-md shadow-slate-900/10 font-bold'
                : 'text-secondary hover:bg-nested hover:text-main'}"
            >
              <span
                class="material-symbols-outlined text-lg flex-shrink-0 transition-transform group-hover:scale-105"
                class:icon-filled={active}
              >
                {item.icon}
              </span>
              {#if !collapsed}
                <span class="truncate leading-none {active ? 'font-bold text-white' : ''}">
                  {item.label}
                </span>
                {#if active}
                  <span class="ml-auto flex items-center justify-center flex-shrink-0">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                  </span>
                {/if}
              {:else if active}
                <!-- Mini dot in collapsed mode -->
                <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400"></span>
              {/if}
            </a>
          {/each}
        </div>
      </div>
    {/each}
  </nav>

  <!-- Bottom User Profile & Sign Out -->
  <div class="border-t border-light p-3 flex-shrink-0">
    {#if !collapsed}
      <div class="bg-nested border border-light rounded-2xl p-2.5 flex items-center gap-2.5 mb-2.5 shadow-2xs">
        <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
          {userInitial}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-main truncate leading-tight">
            {user.name ?? user.email}
          </p>
          <span class="inline-flex items-center text-3xs font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full px-2 py-0.5 mt-0.5">
            {user.role}
          </span>
        </div>
      </div>
    {/if}
    <button
      type="button"
      on:click={() => dispatch('signOut')}
      title={collapsed ? 'Keluar' : undefined}
      class="flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl text-xs font-semibold text-muted hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
    >
      <span class="material-symbols-outlined text-lg flex-shrink-0">logout</span>
      {#if !collapsed}
        <span>Keluar</span>
      {/if}
    </button>
  </div>
</aside>
