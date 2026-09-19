<script lang="ts">
  import { onMount } from 'svelte';
  import { ChevronDown, LogOut } from 'lucide-svelte';
  import {
    type NavUser,
    getRoleBadge,
    getRoleNavLinks,
  } from './navbar.helpers';

  export let user: NavUser;
  export let onSignOut: () => void;
  export let isLoggingOut: boolean = false;

  let isOpen = false;
  let menuContainer: HTMLDivElement;

  $: userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');
  $: roleMeta = getRoleBadge(user?.role);
  $: roleNavLinks = getRoleNavLinks(user?.role);

  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuContainer && !menuContainer.contains(event.target as Node)) {
        isOpen = false;
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  });
</script>

<div class="relative shrink-0" bind:this={menuContainer}>
  <button
    type="button"
    on:click|stopPropagation={() => (isOpen = !isOpen)}
    class="h-10 flex items-center gap-2 pl-2 pr-3 rounded-full bg-card/70 hover:bg-card border border-neutral-200 dark:border-neutral-800 dark:bg-white/5 dark:hover:bg-white/10 text-main dark:text-white transition-all cursor-pointer shadow-sm shrink-0"
  >
    <div class="w-7 h-7 rounded-full bg-orange text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
      {#if user.image}
        <img src={user.image} alt={user.name || 'User'} class="w-full h-full object-cover" />
      {:else}
        <span>{userInitial}</span>
      {/if}
    </div>
    <ChevronDown size={14} class="text-muted dark:text-white/80 transition-transform duration-200 {isOpen ? 'rotate-180 text-orange' : ''} shrink-0" />
  </button>

  {#if isOpen}
    <div class="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border text-main shadow-2xl p-2 space-y-1 z-50">
      <div class="px-3 py-2 border-b border-border dark:border-white/10 flex items-center justify-between">
        <div class="min-w-0 pr-2">
          <p class="text-xs font-bold text-main dark:text-white truncate">{user.name || 'Pengguna'}</p>
          <p class="text-[10px] text-muted dark:text-slate-400 truncate">{user.email || '-'}</p>
        </div>
        {#if roleMeta}
          <span class="text-[9px] px-1.5 py-0.5 rounded border {roleMeta.color}">
            {roleMeta.label}
          </span>
        {/if}
      </div>
      <div class="py-1">
        {#each roleNavLinks as link}
          <a href={link.href} class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:text-main hover:bg-nested dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors">
            <svelte:component this={link.icon} size={14} />
            <span>{link.label}</span>
          </a>
        {/each}
      </div>
      <div class="border-t border-border dark:border-white/10 pt-1">
        <button
          type="button"
          on:click={onSignOut}
          disabled={isLoggingOut}
          class="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  {/if}
</div>
