<script lang="ts">
  import type { AuthenticatedUser } from '@/lib/auth';
  import type { NavGroup } from './sidebar.helpers';
  import { createEventDispatcher } from 'svelte';

  export let user: AuthenticatedUser;
  export let navGroups: NavGroup[] = [];
  export let drawerOpen = false;
  export let currentPath = '';

  const dispatch = createEventDispatcher<{
    openDrawer: void;
    closeDrawer: void;
    signOut: void;
  }>();

  $: userInitial = (user.name ?? user.email).charAt(0).toUpperCase();

  const isActive = (href: string): boolean => {
    if (!currentPath) return false;
    const cleanCurrent = currentPath.replace(/\/$/, '') || '/';
    const cleanHref = href.replace(/\/$/, '') || '/';
    if (cleanHref === '/dashboard') return cleanCurrent === '/dashboard';
    return cleanCurrent === cleanHref || cleanCurrent.startsWith(cleanHref + '/');
  };
</script>

<!-- # MOBILE — FAB + SLIDE-OVER DRAWER -->
<button
  type="button"
  on:click={() => dispatch('openDrawer')}
  class="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:bg-primary/95 active:scale-95 transition-all cursor-pointer"
  aria-label="Buka menu navigasi"
>
  <span class="material-symbols-outlined text-xl">menu</span>
</button>

{#if drawerOpen}
  <button
    type="button"
    class="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm cursor-pointer border-none"
    on:click={() => dispatch('closeDrawer')}
    aria-label="Tutup menu"
  ></button>
{/if}

<!-- Drawer panel -->
<div
  class="md:hidden fixed top-0 right-0 z-50 h-full w-72 bg-card shadow-2xl flex flex-col transition-transform duration-300 ease-in-out border-l border-light"
  style="transform: translateX({drawerOpen ? '0' : '100%'})"
  aria-hidden={!drawerOpen}
  role="dialog"
  aria-modal="true"
  aria-label="Menu navigasi"
>
  <div class="flex items-center justify-between h-14 px-4 border-b border-light">
    <div class="flex items-center gap-2.5">
      <div class="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-sm">
        <span class="material-symbols-outlined icon-filled text-sm">storefront</span>
      </div>
      <span class="font-bold text-sm text-main">UMKM Builder</span>
    </div>
    <button
      type="button"
      on:click={() => dispatch('closeDrawer')}
      class="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-main hover:bg-nested transition-colors cursor-pointer"
      aria-label="Tutup menu"
    >
      <span class="material-symbols-outlined text-sm">close</span>
    </button>
  </div>

  <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-4" aria-label="Menu utama mobile">
    {#each navGroups as group (group.title)}
      <div>
        <p class="text-2xs font-bold font-heading uppercase tracking-wider text-muted px-2 pb-1.5">
          {group.title}
        </p>
        <div class="space-y-0.5">
          {#each group.items as item (item.href)}
            {@const active = isActive(item.href)}
            <a
              href={item.href}
              on:click={() => dispatch('closeDrawer')}
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors {active
                ? 'bg-slate-900 text-white dark:bg-primary dark:text-white font-bold'
                : 'text-secondary hover:bg-nested hover:text-main'}"
            >
              <span class="material-symbols-outlined text-sm" class:icon-filled={active}>{item.icon}</span>
              <span class="flex-1">{item.label}</span>
              {#if active}
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
              {/if}
            </a>
          {/each}
        </div>
      </div>
    {/each}
  </nav>

  <div class="border-t border-light p-3 space-y-1">
    <div class="flex items-center gap-2.5 px-2 py-2">
      <div class="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
        {userInitial}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-main truncate">{user.name ?? user.email}</p>
        <span class="text-xs font-bold text-primary uppercase">{user.role}</span>
      </div>
    </div>
    <button
      type="button"
      on:click={() => dispatch('signOut')}
      class="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
    >
      <span class="material-symbols-outlined text-sm">logout</span>
      <span>Keluar</span>
    </button>
  </div>
</div>
