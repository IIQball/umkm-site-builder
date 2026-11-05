<script lang="ts">
  import type { AuthenticatedUser } from "@/lib/auth";
  import { type NavGroup, getDashboardHomePath, isPathActive } from "./sidebar.helpers";
  import { createEventDispatcher } from "svelte";
  import TenantQuota from "./TenantQuota.svelte";

  export let user: AuthenticatedUser;
  export let navGroups: NavGroup[] = [];
  export let collapsed = false;
  export let currentPath = "";
  export let isLoggingOut = false;

  const dispatch = createEventDispatcher<{
    toggleCollapse: void;
    signOut: void;
  }>();

  $: sidebarWidth = collapsed ? "76px" : "260px";
  $: homePath = getDashboardHomePath(user?.role);
</script>

<aside
  id="dashboard-sidebar"
  class="hidden md:flex flex-col bg-card border-r border-light transition-all duration-300 ease-in-out flex-shrink-0 relative z-40 shadow-sm select-none"
  style="width: {sidebarWidth}"
  aria-label="Navigasi Dashboard"
>
  <!-- Floating Edge Toggle Button when Collapsed -->
  {#if collapsed}
    <button
      type="button"
      on:click={() => dispatch("toggleCollapse")}
      class="absolute -right-3.5 top-5.5 z-50 w-7 h-7 rounded-full bg-card border border-light shadow-md flex items-center justify-center text-main hover:bg-nested hover:scale-110 active:scale-95 transition-all cursor-pointer group"
      title="Perluas sidebar"
      aria-label="Perluas sidebar"
    >
      <span
        class="material-symbols-outlined text-sm leading-none transition-transform duration-200 group-hover:scale-110"
      >
        chevron_right
      </span>
    </button>
  {/if}

  <!-- Brand Header -->
  <div
    class="flex items-center h-16 border-b border-light flex-shrink-0 transition-all duration-200 {collapsed
      ? 'justify-center px-2'
      : 'px-4 justify-between gap-3'}"
  >
    {#if collapsed}
      <a
        href={homePath}
        class="w-10 h-10 flex items-center justify-center rounded-xl hover:opacity-90 transition-all select-none group"
        title="Pinoka"
        aria-label="Pinoka"
      >
        <img
          src="/assets/logo/logo-pin.webp"
          alt="Pinoka"
          class="h-8 w-auto max-w-[32px] object-contain transition-transform duration-200 group-hover:scale-105"
          width="26"
          height="32"
          loading="eager"
        />
      </a>
    {:else}
      <a
        href={homePath}
        class="flex items-center min-w-0 hover:opacity-90 transition-opacity select-none"
        title="Pinoka"
      >
        <img
          src="/assets/logo/logo.webp"
          alt="Pinoka"
          class="h-9 w-auto max-w-[145px] object-contain"
          width="117"
          height="36"
          loading="eager"
        />
      </a>

      <button
        type="button"
        on:click={() => dispatch("toggleCollapse")}
        class="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-main hover:bg-nested transition-colors cursor-pointer shrink-0"
        title="Ciutkan sidebar"
        aria-label="Ciutkan sidebar"
      >
        <span class="material-symbols-outlined text-base">chevron_left</span>
      </button>
    {/if}
  </div>

  <!-- Navigation Groups -->
  <nav
    class="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4 scrollbar-none"
  >
    {#each navGroups as group, groupIndex (group.title)}
      <div class="space-y-1">
        {#if !collapsed}
          <p
            class="px-3 text-[10px] font-bold text-muted uppercase tracking-wider font-heading truncate"
          >
            {group.title}
          </p>
        {:else}
          {#if groupIndex > 0}
            <div class="my-2 mx-2 border-t border-light/60"></div>
          {:else}
            <div class="h-1"></div>
          {/if}
        {/if}

        <div class="space-y-0.5">
          {#each group.items as item (item.href)}
            {@const active = isPathActive(currentPath, item.href)}
            <a
              href={item.href}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
              class="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 {collapsed
                ? 'justify-center'
                : ''} {active
                ? 'bg-main text-canvas dark:bg-primary dark:text-white shadow-xs'
                : 'text-secondary hover:bg-nested hover:text-main'}"
            >
              <span
                class="material-symbols-outlined text-lg flex-shrink-0 transition-transform group-hover:scale-110"
                class:icon-filled={active}
              >
                {item.icon}
              </span>
              {#if !collapsed}
                <span
                  class="truncate leading-tight pb-[2px] {active
                    ? 'font-bold text-white dark:text-white'
                    : ''}"
                >
                  {item.label}
                </span>
                {#if active}
                  <span
                    class="ml-auto flex items-center justify-center flex-shrink-0"
                  >
                    <span class="relative flex h-2 w-2">
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75"
                      ></span>
                      <span
                        class="relative inline-flex rounded-full h-2 w-2 bg-orange"
                      ></span>
                    </span>
                  </span>
                {/if}
              {:else if active}
                <span
                  class="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange"
                ></span>
              {/if}
            </a>
          {/each}
        </div>
      </div>
    {/each}
  </nav>

  <!-- Bottom Quota & Sign Out -->
  {#if user.role === "tenant"}
    <TenantQuota {collapsed} />
  {/if}

  <div class="p-3 border-t border-light flex flex-col gap-2 shrink-0 {user.role === 'tenant' ? '' : 'mt-auto'}">
    <button
      type="button"
      on:click={() => dispatch("signOut")}
      disabled={isLoggingOut}
      class="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-muted hover:text-error hover:bg-error/10 transition-colors cursor-pointer {collapsed ? 'justify-center px-0' : ''}"
      title="Keluar"
      aria-label="Keluar dari akun"
    >
      <span class="material-symbols-outlined text-base flex-shrink-0" class:animate-spin={isLoggingOut}>
        power_settings_new
      </span>
      {#if !collapsed}
        <span class="truncate">{isLoggingOut ? "Keluar..." : "Keluar"}</span>
      {/if}
    </button>
  </div>
</aside>
