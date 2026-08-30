<script lang="ts">
  import type { AuthenticatedUser } from "@/lib/auth";
  import { getRoleConfig, type NavGroup } from "./sidebar.helpers";
  import { createEventDispatcher } from "svelte";

  export let user: AuthenticatedUser;
  export let navGroups: NavGroup[] = [];
  export let collapsed = false;
  export let currentPath = "";

  const dispatch = createEventDispatcher<{
    toggleCollapse: void;
    signOut: void;
  }>();

  $: isDesigner = user.role === "designer";
  $: userInitial = (user.name ?? user.email).charAt(0).toUpperCase();
  $: roleCfg = getRoleConfig(user.role);
  $: sidebarWidth = collapsed ? "76px" : "260px";

  const isActive = (href: string): boolean => {
    if (!currentPath) return false;
    const cleanCurrent = currentPath.replace(/\/$/, "") || "/";
    const cleanHref = href.replace(/\/$/, "") || "/";
    if (cleanHref === "/dashboard") return cleanCurrent === "/dashboard";
    return (
      cleanCurrent === cleanHref || cleanCurrent.startsWith(cleanHref + "/")
    );
  };
</script>

<aside
  class="hidden md:flex flex-col bg-card border-r border-light transition-[width] duration-300 ease-in-out flex-shrink-0 relative z-40 shadow-sm select-none"
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
      : 'px-4 gap-3'}"
  >
    <a
      href="/dashboard"
      class="w-10 h-10 rounded-2xl bg-slate-900 text-white dark:bg-blue-600 flex items-center justify-center font-bold shadow-xs flex-shrink-0 group transition-all hover:scale-105"
      title="UMKM Builder"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="text-white"
      >
        <path
          d="M4 7C7 4.5 11 4.5 14 7C17 9.5 21 9.5 24 7"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        />
        <path
          d="M0 12C3 9.5 7 9.5 10 12C13 14.5 17 14.5 20 12"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        />
        <path
          d="M4 17C7 14.5 11 14.5 14 17C17 19.5 21 19.5 24 17"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        />
      </svg>
    </a>

    {#if !collapsed}
      <div class="flex-1 min-w-0 animate-fade-in">
        <span
          class="font-heading font-extrabold text-sm text-main tracking-tight truncate block leading-tight"
        >
          UMKM Builder
        </span>
        <span
          class="text-2xs font-medium text-muted leading-tight block truncate mt-0.5"
        >
          {isDesigner
            ? "Designer Workspace"
            : user.role === "admin" || user.role === "superadmin"
              ? "Admin Portal"
              : "Merchant Portal"}
        </span>
      </div>

      <!-- Collapse button in expanded header -->
      <button
        type="button"
        on:click={() => dispatch("toggleCollapse")}
        class="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-main hover:bg-nested border border-transparent hover:border-light transition-all flex-shrink-0 cursor-pointer active:scale-95"
        title="Ciutkan sidebar"
        aria-label="Ciutkan sidebar"
      >
        <span class="material-symbols-outlined text-sm">chevron_left</span>
      </button>
    {/if}
  </div>

  <!-- Nav Links Rail (Grouped for all roles) -->
  <nav
    class="flex-1 overflow-y-auto overflow-x-hidden py-5 px-3 space-y-4"
    aria-label="Menu utama"
  >
    {#each navGroups as group, groupIdx (group.title)}
      <div>
        {#if !collapsed}
          <p
            class="text-2xs font-bold font-heading uppercase tracking-wider text-muted px-2.5 pb-2"
          >
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
              class="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all group relative active:scale-[0.98] {active
                ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-xs font-bold'
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
                  class="truncate leading-none {active
                    ? 'font-bold text-white'
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
                <!-- Mini dot in collapsed mode -->
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

  <!-- Bottom User Profile & Sign Out -->
  <div class="border-t border-light p-3 flex-shrink-0">
    {#if !collapsed}
      <!-- Expanded Clean User Profile Card -->
      <div
        class="bg-nested/60 hover:bg-nested border border-light rounded-xl p-2.5 flex items-center gap-2.5 mb-2 shadow-2xs transition-colors group relative"
      >
        <!-- Solid Neutral Avatar with Clean Status Dot -->
        <div class="relative flex-shrink-0">
          <div
            class="w-8 h-8 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center font-bold text-xs shadow-xs"
          >
            {userInitial}
          </div>
          <span
            class="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-card"
            title="Online"
          ></span>
        </div>

        <!-- User Info & Role Tag -->
        <div class="flex-1 min-w-0">
          <p
            class="text-xs font-semibold text-main truncate leading-tight"
            title={user.name ?? user.email}
          >
            {user.name ?? user.email}
          </p>
          <div class="flex items-center gap-1.5 mt-1">
            <span
              class="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border {roleCfg.badgeBg} leading-none"
            >
              <span class="material-symbols-outlined text-[10px] leading-none"
                >{roleCfg.icon}</span
              >
              <span>{roleCfg.badgeLabel}</span>
            </span>
          </div>
        </div>

        <!-- Settings Link -->
        <a
          href="/auth/settings"
          class="w-6 h-6 rounded-lg flex items-center justify-center text-muted hover:text-main hover:bg-card border border-transparent hover:border-light transition-colors flex-shrink-0"
          title="Pengaturan Akun"
          aria-label="Pengaturan Akun"
        >
          <span class="material-symbols-outlined text-xs">settings</span>
        </a>
      </div>
    {:else}
      <!-- Collapsed Mode: Centered Avatar with Status Dot -->
      <div class="flex justify-center mb-2">
        <a
          href="/auth/settings"
          class="relative group cursor-pointer block"
          title="{user.name ?? user.email} • {roleCfg.label}"
        >
          <div
            class="w-8 h-8 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center font-bold text-xs shadow-xs transition-transform group-hover:scale-105"
          >
            {userInitial}
          </div>
          <span
            class="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-card"
          ></span>
        </a>
      </div>
    {/if}

    <!-- Sign Out Button -->
    <button
      type="button"
      on:click={() => dispatch("signOut")}
      title={collapsed ? "Keluar" : undefined}
      class="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs font-medium text-muted hover:text-error hover:bg-error/10 transition-colors cursor-pointer active:scale-[0.98] {collapsed
        ? 'justify-center'
        : ''}"
    >
      <span class="material-symbols-outlined text-base flex-shrink-0"
        >logout</span
      >
      {#if !collapsed}
        <span>Keluar</span>
      {/if}
    </button>
  </div>
</aside>
