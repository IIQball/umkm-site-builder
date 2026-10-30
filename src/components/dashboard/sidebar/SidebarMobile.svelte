<script lang="ts">
  import type { AuthenticatedUser } from "@/lib/auth";
  import { getDashboardHomePath, isPathActive, type NavGroup } from "./sidebar.helpers";
  import { createEventDispatcher } from "svelte";
  import TenantQuota from "./TenantQuota.svelte";

  export let user: AuthenticatedUser;
  export let navGroups: NavGroup[] = [];
  export let drawerOpen = false;
  export let currentPath = "";
  export let isLoggingOut = false;

  const dispatch = createEventDispatcher<{
    openDrawer: void;
    closeDrawer: void;
    signOut: void;
  }>();

  $: homePath = getDashboardHomePath(user?.role);
</script>

<!-- # MOBILE — FAB + SLIDE-OVER DRAWER -->
<button
  id="mobile-sidebar-fab"
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
      <div class="space-y-1">
        <p
          class="text-2xs font-bold font-heading uppercase tracking-wider text-muted px-2 pb-1.5"
        >
          {group.title}
        </p>
        <div class="space-y-0.5">
          {#each group.items as item (item.href)}
            {@const active = isPathActive(currentPath, item.href)}
            <a
              href={item.href}
              on:click={() => dispatch("closeDrawer")}
              aria-label={item.label}
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors {active
                ? 'bg-main text-canvas dark:bg-primary dark:text-white font-bold shadow-xs'
                : 'text-secondary hover:bg-nested hover:text-main'}"
            >
              <span
                class="material-symbols-outlined text-sm flex-shrink-0"
                class:icon-filled={active}>{item.icon}</span
              >
              <span class="flex-1 truncate">{item.label}</span>
              {#if active}
                <span class="relative flex h-2 w-2 flex-shrink-0">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75"
                  ></span>
                  <span
                    class="relative inline-flex rounded-full h-2 w-2 bg-orange"
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

  <div class="border-t border-light p-3">
    <!-- Sign Out Button -->
    <button
      type="button"
      on:click={() => dispatch("signOut")}
      disabled={isLoggingOut}
      class="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-muted hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
      aria-label="Keluar dari akun"
    >
      <span class="material-symbols-outlined text-base flex-shrink-0" class:animate-spin={isLoggingOut}>power_settings_new</span>
      <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
    </button>
  </div>
</div>
