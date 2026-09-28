<script lang="ts">
  import type { AuthenticatedUser } from "@/lib/auth";
  import type { NavGroup } from "./sidebar.helpers";
  import { createEventDispatcher } from "svelte";
  import TenantQuota from "./TenantQuota.svelte";

  export let user: AuthenticatedUser;
  export let navGroups: NavGroup[] = [];
  export let collapsed = false;
  export let currentPath = "";

  const dispatch = createEventDispatcher<{
    toggleCollapse: void;
    signOut: void;
  }>();

  $: sidebarWidth = collapsed ? "76px" : "260px";
  $: homePath =
    user?.role === "designer"
      ? "/designer/wallet"
      : user?.role === "admin" || user?.role === "superadmin"
        ? "/admin"
        : "/dashboard";

  const isActive = (href: string): boolean => {
    if (!currentPath) return false;
    const cleanCurrent = currentPath.replace(/\/$/, "") || "/";
    const cleanHref = href.replace(/\/$/, "") || "/";
    if (cleanHref === "/dashboard" || cleanHref === "/admin") {
      return cleanCurrent === cleanHref;
    }
    return (
      cleanCurrent === cleanHref || cleanCurrent.startsWith(cleanHref + "/")
    );
  };
</script>

<aside
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
    {#each navGroups as group (group.title)}
      <div class="space-y-1">
        {#if !collapsed}
          <p
            class="px-3 text-[10px] font-bold text-muted uppercase tracking-wider font-heading truncate"
          >
            {group.title}
          </p>
        {:else}
          <div class="h-2"></div>
        {/if}

        <div class="space-y-0.5">
          {#each group.items as item (item.href)}
            {@const active = isActive(item.href)}
            <a
              href={item.href}
              title={collapsed ? item.label : undefined}
              class="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 {collapsed
                ? 'justify-center'
                : ''} {active
                ? 'bg-main text-canvas dark:bg-nested shadow-xs'
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
  {#if user.role === "tenant"}
    <TenantQuota {collapsed} />
  {/if}
</aside>
