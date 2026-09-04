<script lang="ts">
  import { onMount } from "svelte";
  import type { AuthenticatedUser } from "@/lib/auth";
  import { getRoleConfig } from "./sidebar/sidebar.helpers";
  import NavbarUserMenu from "./navbar/NavbarUserMenu.svelte";

  export let userJson: string;
  export let breadcrumb: string | undefined = undefined;

  const user: AuthenticatedUser = JSON.parse(userJson);
  const userInitial = (user.name ?? user.email).charAt(0).toUpperCase();
  const roleCfg = getRoleConfig(user.role);
  const homePath = user.role === "designer" ? "/designer/wallet" : "/dashboard";

  let dropdownOpen = false;
  let isDark = false;

  const toggleDropdown = () => {
    dropdownOpen = !dropdownOpen;
  };
  const closeDropdown = () => {
    dropdownOpen = false;
  };

  onMount(() => {
    isDark = document.documentElement.getAttribute("data-theme") === "dark";
  });

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    isDark = next === "dark";
  };

  const getTodayFormatted = () => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(new Date());
  };
</script>

<svelte:window on:click={closeDropdown} />

<header
  class="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-8
         bg-canvas/90 backdrop-blur-md border-b border-light flex-shrink-0"
>
  <!-- Left: search bar capsule + date pill badge -->
  <div class="flex items-center gap-3 flex-1 min-w-0 max-w-md">
    <label
      class="flex items-center gap-2.5 w-full bg-card border border-light rounded-full
             px-4 py-2 cursor-text hover:border-main/40 hover:bg-card transition-all shadow-xs group"
      for="navbar-search"
    >
      <span
        class="material-symbols-outlined text-base text-muted group-hover:text-primary transition-colors flex-shrink-0"
        >search</span
      >
      <input
        id="navbar-search"
        type="text"
        placeholder="Cari fitur, template, mutasi..."
        class="bg-transparent border-none outline-none text-xs text-main
               placeholder:text-muted w-full min-w-0"
        readonly
        on:focus|preventDefault={() => {}}
      />
      <span class="hidden sm:flex items-center gap-0.5 flex-shrink-0">
        <kbd
          class="text-3xs font-semibold text-muted bg-nested border border-light rounded-md px-1.5 py-0.5 leading-none"
          >⌘</kbd
        >
        <kbd
          class="text-3xs font-semibold text-muted bg-nested border border-light rounded-md px-1.5 py-0.5 leading-none"
          >K</kbd
        >
      </span>
    </label>

    <!-- Date pill badge -->
    <div
      class="hidden lg:inline-flex items-center gap-2 bg-card border border-light px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-xs hover:border-primary/30 transition-colors"
    >
      <span class="material-symbols-outlined text-sm text-primary flex-shrink-0"
        >calendar_today</span
      >
      <span class="text-secondary"
        >Hari ini, <strong class="text-main font-semibold"
          >{getTodayFormatted()}</strong
        ></span
      >
    </div>
  </div>

  <!-- Right: breadcrumb (mobile), actions, profile chip -->
  <div class="flex items-center gap-2.5 flex-shrink-0 ml-3">
    <!-- Breadcrumb (mobile only) -->
    {#if breadcrumb}
      <span class="text-xs font-medium text-muted md:hidden truncate max-w-[100px]">
        {breadcrumb}
      </span>
    {/if}

    <!-- Quick Navigation Links (Desktop) -->
    <div class="hidden sm:flex items-center gap-1">
      <a
        href="/templates"
        target="_blank"
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-secondary hover:text-main hover:bg-nested rounded-full transition-all border border-transparent hover:border-light"
        title="Buka Marketplace Template Publik"
      >
        <span class="material-symbols-outlined text-sm text-primary">storefront</span>
        <span>Marketplace</span>
      </a>

      {#if user.role === "designer"}
        <a
          href="/builder/new"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-full transition-all border border-primary/20"
        >
          <span class="material-symbols-outlined text-sm">add</span>
          <span>Template Baru</span>
        </a>
      {/if}
    </div>

    <!-- Notification Bell -->
    <button
      type="button"
      class="relative p-2 text-muted hover:text-main hover:bg-nested rounded-full transition-colors active:scale-95 cursor-pointer"
      aria-label="Notifikasi"
      title="Notifikasi"
    >
      <span class="material-symbols-outlined text-lg">notifications</span>
      <span
        class="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-card"
      ></span>
    </button>

    <!-- Theme Toggle -->
    <button
      type="button"
      on:click={toggleTheme}
      class="p-2 text-muted hover:text-main hover:bg-nested rounded-full transition-colors active:scale-95 group cursor-pointer"
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
    </button>

    <!-- Profile Chip & Dropdown Component -->
    <NavbarUserMenu
      {user}
      {userInitial}
      {roleCfg}
      {homePath}
      {dropdownOpen}
      onToggleDropdown={toggleDropdown}
    />
  </div>
</header>
