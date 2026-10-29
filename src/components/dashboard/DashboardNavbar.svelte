<script lang="ts">
  import { onMount } from "svelte";
  import type { AuthenticatedUser } from "@/lib/auth";
  import { Button } from "@/components/ui";
  import NavbarUserMenu from "@/components/common/NavbarUserMenu.svelte";
  import NavbarNotifications from "./navbar/NavbarNotifications.svelte";
  import { formatDate } from "@/lib/utils/format";
  import { getStoredTheme, applyTheme } from "@/lib/utils/theme";
  import { getDashboardHomePath } from "@/components/common/navbar.helpers";

  export let userJson: string;
  export let breadcrumb: string | undefined = undefined;

  $: user = JSON.parse(userJson) as AuthenticatedUser;

  let isDark = false;

  onMount(() => {
    isDark = getStoredTheme() === "dark";
  });

  const toggleTheme = () => {
    isDark = !isDark;
    applyTheme(isDark ? "dark" : "light");
  };

  const getTodayFormatted = () => {
    return formatDate(new Date(), {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  $: homePath = getDashboardHomePath(user?.role);
  $: homeLabel =
    user?.role === "designer"
      ? "Studio"
      : user?.role === "superadmin"
        ? "Super Admin"
        : user?.role === "admin"
          ? "Admin"
          : "Dashboard";

  $: breadcrumbItems = (() => {
    if (!breadcrumb) {
      return [{ label: homeLabel, href: homePath, isCurrent: true }];
    }

    const rawParts = breadcrumb
      .split(" / ")
      .map((p) => p.trim())
      .filter(Boolean);

    if (
      rawParts.length === 1 &&
      rawParts[0].toLowerCase() === homeLabel.toLowerCase()
    ) {
      return [{ label: homeLabel, href: homePath, isCurrent: true }];
    }

    const firstLower = rawParts[0]?.toLowerCase();
    const isFirstHome = [
      "dashboard",
      "super admin",
      "superadmin",
      "admin",
      "desainer",
      "designer",
      "studio",
    ].includes(firstLower);

    const items: Array<{ label: string; href?: string; isCurrent: boolean }> = [];

    if (isFirstHome) {
      items.push({
        label: rawParts[0],
        href: homePath,
        isCurrent: rawParts.length === 1,
      });
      for (let i = 1; i < rawParts.length; i++) {
        items.push({
          label: rawParts[i],
          isCurrent: i === rawParts.length - 1,
        });
      }
    } else {
      items.push({
        label: homeLabel,
        href: homePath,
        isCurrent: false,
      });
      for (let i = 0; i < rawParts.length; i++) {
        items.push({
          label: rawParts[i],
          isCurrent: i === rawParts.length - 1,
        });
      }
    }

    return items;
  })();
</script>

<header
  class="sticky top-0 z-30 h-16 flex items-center justify-between px-3 sm:px-6 md:px-8
         bg-canvas/90 backdrop-blur-md border-b border-light flex-shrink-0 gap-3"
>
  <!-- Left: Breadcrumb trail + Date pill badge -->
  <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
    <nav
      id="navbar-breadcrumbs"
      aria-label="Breadcrumb"
      class="flex items-center min-w-0"
    >
      <ol class="flex items-center gap-1.5 sm:gap-2 text-xs font-medium min-w-0">
        {#each breadcrumbItems as item, index}
          <li class="inline-flex items-center gap-1.5 sm:gap-2 min-w-0">
            {#if index > 0}
              <span
                class="material-symbols-outlined text-xs text-muted/60 shrink-0 select-none"
                aria-hidden="true"
              >
                chevron_right
              </span>
            {/if}
            {#if item.isCurrent}
              <span
                class="font-semibold text-main truncate max-w-[130px] sm:max-w-[220px] md:max-w-[320px]"
                title={item.label}
                aria-current="page"
              >
                {item.label}
              </span>
            {:else if item.href}
              <a
                href={item.href}
                class="text-secondary hover:text-main flex items-center gap-1 transition-colors hover:underline shrink-0"
                title={`Kembali ke ${item.label}`}
              >
                {#if index === 0}
                  <span
                    class="material-symbols-outlined text-base text-primary shrink-0"
                    aria-hidden="true"
                  >
                    dashboard
                  </span>
                {/if}
                <span class="truncate max-w-[90px] sm:max-w-none">{item.label}</span>
              </a>
            {:else}
              <span
                class="text-secondary truncate max-w-[90px] sm:max-w-none"
                title={item.label}
              >
                {item.label}
              </span>
            {/if}
          </li>
        {/each}
      </ol>
    </nav>

    <!-- Date pill badge (Desktop only) -->
    <div
      class="hidden lg:inline-flex items-center gap-2 bg-card border border-light px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-xs hover:border-primary/30 transition-colors shrink-0"
    >
      <span
        class="material-symbols-outlined text-sm text-primary flex-shrink-0"
        aria-hidden="true"
      >
        calendar_today
      </span>
      <span class="text-secondary">
        Hari ini, <strong class="text-main font-semibold">{getTodayFormatted()}</strong>
      </span>
    </div>
  </div>

  <!-- Right: notifications, theme toggle, and user dropdown -->
  <div class="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
    <!-- Notification Bell -->
    <div id="navbar-notifications" class="flex items-center">
      <NavbarNotifications {user} />
    </div>

    <!-- Theme Toggle -->
    <Button
      type="button"
      variant="ghost"
      size="icon"
      on:click={toggleTheme}
      class="rounded-full text-muted hover:text-main group"
      aria-label="Ganti mode tema"
      title={isDark ? "Ubah ke Mode Terang" : "Ubah ke Mode Gelap"}
    >
      {#if isDark}
        <span
          class="material-symbols-outlined text-lg transition-transform duration-300 group-hover:rotate-90"
          >light_mode</span
        >
      {:else}
        <span
          class="material-symbols-outlined text-lg transition-transform duration-300 group-hover:-rotate-45"
          >dark_mode</span
        >
      {/if}
    </Button>

    <!-- Profile Chip & Dropdown Component -->
    <div id="navbar-user-menu" class="flex items-center">
      <NavbarUserMenu {user} />
    </div>
  </div>
</header>
