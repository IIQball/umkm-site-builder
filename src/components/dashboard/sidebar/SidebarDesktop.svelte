<script lang="ts">
  import type { AuthenticatedUser } from '@/lib/auth';
  import type { NavItem } from './sidebar.helpers';
  import { createEventDispatcher } from 'svelte';

  export let user: AuthenticatedUser;
  export let generalItems: NavItem[] = [];
  export let accountItems: NavItem[] = [];
  export let flatItems: NavItem[] = [];
  export let collapsed = false;
  export let currentPath = '';

  const dispatch = createEventDispatcher<{
    toggleCollapse: void;
    signOut: void;
  }>();

  $: isDesigner = user.role === 'designer';
  $: userInitial = (user.name ?? user.email).charAt(0).toUpperCase();
  $: sidebarWidth = collapsed ? '72px' : '256px';

  const isActive = (href: string): boolean => {
    if (href === '/dashboard') return currentPath === '/dashboard';
    return currentPath.startsWith(href);
  };
</script>

<aside
  class="hidden md:flex flex-col bg-card border-r border-light transition-[width] duration-300 ease-in-out overflow-hidden flex-shrink-0 relative z-20"
  style="width: {sidebarWidth}"
  aria-label="Navigasi Dashboard"
>
  <!-- Brand -->
  <div class="flex items-center h-14 px-3 border-b border-light gap-2.5 flex-shrink-0">
    {#if !collapsed}
      <div class="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm">
        <span class="material-symbols-outlined icon-filled text-sm">storefront</span>
      </div>
      <div class="flex-1 min-w-0">
        <span class="font-bold text-sm text-main tracking-tight truncate block leading-tight select-none">
          UMKM Builder
        </span>
        <span class="text-xs text-muted leading-tight select-none">
          Designer Hub
        </span>
      </div>
    {:else}
      <div class="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-sm">
        <span class="material-symbols-outlined icon-filled text-sm">storefront</span>
      </div>
    {/if}
    <button
      type="button"
      on:click={() => dispatch('toggleCollapse')}
      class="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-main hover:bg-nested transition-colors flex-shrink-0 cursor-pointer"
      title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
      aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
    >
      <span class="material-symbols-outlined text-sm">
        {collapsed ? 'chevron_right' : 'chevron_left'}
      </span>
    </button>
  </div>

  <!-- Nav links -->
  <nav class="flex-1 overflow-y-auto py-4 px-2.5 space-y-0.5" aria-label="Menu utama">
    {#if isDesigner}
      <!-- GENERAL group -->
      {#if !collapsed}
        <p class="text-xs font-extrabold uppercase tracking-widest text-muted px-2.5 pb-1.5">General</p>
      {/if}
      {#each generalItems as item}
        {@const active = isActive(item.href)}
        <a
          href={item.href}
          title={collapsed ? item.label : undefined}
          class="flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium transition-colors group {active ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-nested hover:text-main'}"
        >
          <span
            class="material-symbols-outlined text-sm flex-shrink-0 transition-colors"
            class:icon-filled={active}
          >
            {item.icon}
          </span>
          {#if !collapsed}
            <span class="truncate leading-none {active ? 'font-semibold' : ''}">{item.label}</span>
            {#if active}
              <span class="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
            {/if}
          {/if}
        </a>
      {/each}

      <!-- ACCOUNT group -->
      {#if !collapsed}
        <p class="text-xs font-extrabold uppercase tracking-widest text-muted px-2.5 pb-1.5 pt-4">Account</p>
      {:else}
        <div class="border-t border-light my-2"></div>
      {/if}
      {#each accountItems as item}
        {@const active = isActive(item.href)}
        <a
          href={item.href}
          title={collapsed ? item.label : undefined}
          class="flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium transition-colors group {active ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-nested hover:text-main'}"
        >
          <span class="material-symbols-outlined text-sm flex-shrink-0">{item.icon}</span>
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
          class="flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium transition-colors group {active ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-nested hover:text-main'}"
        >
          <span class="material-symbols-outlined text-sm flex-shrink-0">{item.icon}</span>
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
        <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center
                    font-bold text-sm flex-shrink-0 shadow-sm">
          {userInitial}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-main truncate leading-tight">
            {user.name ?? user.email}
          </p>
          <span class="inline-flex items-center text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-1.5 py-0.5 mt-0.5">
            {user.role}
          </span>
        </div>
      </div>
    {/if}
    <button
      type="button"
      on:click={() => dispatch('signOut')}
      title={collapsed ? 'Keluar' : undefined}
      class="flex items-center gap-3 w-full px-2.5 py-2 rounded-xl text-sm font-medium text-muted hover:text-rose-500 hover:bg-rose-50/10 transition-colors cursor-pointer"
    >
      <span class="material-symbols-outlined text-sm flex-shrink-0">logout</span>
      {#if !collapsed}
        <span>Keluar</span>
      {/if}
    </button>
  </div>
</aside>
