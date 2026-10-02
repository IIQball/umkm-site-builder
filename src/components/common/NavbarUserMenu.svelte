<script lang="ts">
  import { onMount } from "svelte";
  import type { NavUser } from "./navbar.helpers";
  import {
    getRoleConfig,
    getDashboardHomePath,
    getSettingsHref,
  } from "@/components/dashboard/sidebar/sidebar.helpers";
  import { signOutAndRedirect } from "@/lib/auth-client";

  export let user: NavUser;
  export let onSignOut: (() => void | Promise<void>) | undefined = undefined;
  export let isLoggingOut: boolean = false;

  let isOpen = false;
  let menuContainer: HTMLDivElement;

  $: userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
      ? user.email.charAt(0).toUpperCase()
      : "U";
  $: roleCfg = getRoleConfig(user?.role || "tenant");
  $: homePath = getDashboardHomePath(user?.role);
  $: settingsHref = getSettingsHref(user?.role);

  const handleSignOutClick = async (e: MouseEvent) => {
    e.stopPropagation();
    if (isLoggingOut) return;
    isLoggingOut = true;
    if (onSignOut) {
      await onSignOut();
    } else {
      await signOutAndRedirect();
    }
  };

  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuContainer && !menuContainer.contains(event.target as Node)) {
        isOpen = false;
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  });
</script>

<div class="relative ml-1 shrink-0" bind:this={menuContainer}>
  <button
    type="button"
    on:click|stopPropagation={() => (isOpen = !isOpen)}
    class="flex items-center gap-2 pl-1 pr-2 sm:pr-3 py-1 bg-card hover:bg-nested border border-light hover:border-main/20 rounded-full transition-all duration-200 shadow-2xs group cursor-pointer active:scale-[0.98]"
    aria-label="Menu akun"
    aria-expanded={isOpen}
    aria-haspopup="true"
  >
    <div class="relative flex-shrink-0">
      <div
        class="w-7 h-7 rounded-full bg-neutral text-neutral-content flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden"
      >
        {#if user.image}
          <img src={user.image} alt={user.name || "User"} class="w-full h-full object-cover" />
        {:else}
          <span>{userInitial}</span>
        {/if}
      </div>
      <span
        class="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-success rounded-full ring-2 ring-card"
        title="Online"
      ></span>
    </div>

    <div class="hidden sm:flex flex-col text-left min-w-0 max-w-[120px]">
      <span
        class="text-xs font-semibold text-main truncate leading-tight group-hover:text-primary transition-colors"
      >
        {user.name ?? user.email?.split("@")[0] ?? "Pengguna"}
      </span>
      <span
        class="text-[9px] font-medium uppercase tracking-wider {roleCfg.badgeText} leading-none truncate mt-0.5 flex items-center gap-0.5"
      >
        <span class="material-symbols-outlined text-[9px] leading-none"
          >{roleCfg.icon}</span
        >
        <span>{roleCfg.badgeLabel}</span>
      </span>
    </div>

    <span
      class="material-symbols-outlined text-sm text-muted group-hover:text-main transition-transform duration-200 flex-shrink-0"
      class:rotate-180={isOpen}
    >
      expand_more
    </span>
  </button>

  {#if isOpen}
    <div
      class="absolute right-0 top-full mt-2 w-64 bg-card border border-light
             rounded-2xl shadow-xl shadow-black/10 py-2 z-50 animate-fade-in"
      role="menu"
    >
      <div class="px-4 py-3 border-b border-light mb-1.5">
        <div class="flex items-center gap-2.5 mb-2">
          <div
            class="w-9 h-9 rounded-xl bg-neutral text-neutral-content flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0 overflow-hidden"
          >
            {#if user.image}
              <img src={user.image} alt={user.name || "User"} class="w-full h-full object-cover" />
            {:else}
              <span>{userInitial}</span>
            {/if}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-main truncate leading-tight">
              {user.name ?? user.email ?? "Pengguna"}
            </p>
            <p class="text-2xs text-muted truncate mt-0.5 leading-tight">
              {user.email ?? "-"}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-1">
          <span
            class="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md border {roleCfg.badgeBg} leading-none"
          >
            <span class="material-symbols-outlined text-[11px] leading-none"
              >{roleCfg.icon}</span
            >
            <span>{roleCfg.badgeLabel}</span>
          </span>

          <span
            class="inline-flex items-center gap-1.5 text-2xs text-muted font-medium"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
            <span>Aktif</span>
          </span>
        </div>
      </div>

      <a
        href={homePath}
        class="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-secondary
               hover:bg-nested hover:text-main transition-colors"
        role="menuitem"
      >
        <span class="material-symbols-outlined text-base">dashboard</span>
        Dashboard
      </a>
      <a
        href={settingsHref}
        class="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-secondary
               hover:bg-nested hover:text-main transition-colors"
        role="menuitem"
      >
        <span class="material-symbols-outlined text-base"
          >manage_accounts</span
        >
        Pengaturan Akun
      </a>
      <div class="border-t border-light mt-1.5 pt-1">
        <button
          type="button"
          on:click={handleSignOutClick}
          disabled={isLoggingOut}
          class="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-error
                 hover:bg-error/10 transition-colors cursor-pointer text-left"
          role="menuitem"
        >
          <span class="material-symbols-outlined text-base" class:animate-spin={isLoggingOut}>power_settings_new</span>
          <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
        </button>
      </div>
    </div>
  {/if}
</div>
