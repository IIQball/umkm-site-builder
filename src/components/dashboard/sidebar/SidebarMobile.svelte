<script lang="ts">
  import type { AuthenticatedUser } from "@/lib/auth";
  import { getRoleConfig, type NavGroup } from "./sidebar.helpers";
  import { createEventDispatcher } from "svelte";
  import TenantQuota from "./TenantQuota.svelte";

  export let user: AuthenticatedUser;
  export let navGroups: NavGroup[] = [];
  export let drawerOpen = false;
  export let currentPath = "";

  const dispatch = createEventDispatcher<{
    openDrawer: void;
    closeDrawer: void;
    signOut: void;
  }>();

  $: userInitial = (user.name ?? user.email).charAt(0).toUpperCase();
  $: roleCfg = getRoleConfig(user.role);

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

<!-- # MOBILE — FAB + SLIDE-OVER DRAWER -->
<button
  type="button"
  on:click={() => dispatch("openDrawer")}
  class="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:bg-primary/95 active:scale-95 transition-all cursor-pointer"
  aria-label="Buka menu navigasi"
>
  <span class="material-symbols-outlined text-xl">menu</span>
</button>

{#if drawerOpen}
  <button
    type="button"
    class="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm cursor-pointer border-none"
    on:click={() => dispatch("closeDrawer")}
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
  <div
    class="flex items-center justify-between h-16 px-4 border-b border-light"
  >
    <div class="flex items-center gap-2.5">
      <div
        class="w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-blue-600 flex items-center justify-center font-black text-sm shadow-sm"
      >
        <span class="material-symbols-outlined icon-filled text-sm"
          >storefront</span
        >
      </div>
      <span class="font-bold text-sm text-main">UMKM Builder</span>
    </div>
    <button
      type="button"
      on:click={() => dispatch("closeDrawer")}
      class="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-main hover:bg-nested transition-colors cursor-pointer"
      aria-label="Tutup menu"
    >
      <span class="material-symbols-outlined text-sm">close</span>
    </button>
  </div>

  <nav
    class="flex-1 overflow-y-auto py-4 px-3 space-y-4"
    aria-label="Menu utama mobile"
  >
    {#each navGroups as group (group.title)}
      <div>
        <p
          class="text-2xs font-bold font-heading uppercase tracking-wider text-muted px-2 pb-1.5"
        >
          {group.title}
        </p>
        <div class="space-y-0.5">
          {#each group.items as item (item.href)}
            {@const active = isActive(item.href)}
            <a
              href={item.href}
              on:click={() => dispatch("closeDrawer")}
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors {active
                ? 'bg-slate-900 text-white dark:bg-primary dark:text-white font-bold'
                : 'text-secondary hover:bg-nested hover:text-main'}"
            >
              <span
                class="material-symbols-outlined text-sm"
                class:icon-filled={active}>{item.icon}</span
              >
              <span class="flex-1">{item.label}</span>
              {#if active}
                <span class="relative flex h-2 w-2">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                  ></span>
                  <span
                    class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"
                  ></span>
                </span>
              {/if}
            </a>
          {/each}
        </div>
      </div>
    {/each}
    {#if user.role === 'tenant'}
      <div class="px-3 pt-2">
        <TenantQuota />
      </div>
    {/if}
  </nav>

  <div class="border-t border-light p-3 space-y-2">
    <!-- User Profile Card -->
    <div
      class="bg-nested/70 border border-light rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs"
    >
      <div class="relative flex-shrink-0">
        <div
          class="w-9 h-9 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center font-bold text-xs shadow-xs"
        >
          {userInitial}
        </div>
        <span
          class="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-card"
          title="Online"
        ></span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-main truncate leading-tight">
          {user.name ?? user.email}
        </p>
        <div class="flex items-center gap-1.5 mt-0.5">
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
      <a
        href="/auth/settings"
        on:click={() => dispatch("closeDrawer")}
        class="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-main hover:bg-card border border-transparent hover:border-light transition-colors flex-shrink-0"
        title="Pengaturan"
        aria-label="Pengaturan"
      >
        <span class="material-symbols-outlined text-sm">settings</span>
      </a>
    </div>

    <!-- Sign Out Button -->
    <button
      type="button"
      on:click={() => dispatch("signOut")}
      class="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-muted hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
    >
      <span class="material-symbols-outlined text-base">logout</span>
      <span>Keluar</span>
    </button>
  </div>
</div>
