<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { AuthenticatedUser } from "@/lib/auth";
  import NavbarUserMenu from "@/components/common/NavbarUserMenu.svelte";
  import NavbarNotifications from "./navbar/NavbarNotifications.svelte";
  import { formatDate } from "@/lib/utils/format";
  import { sanitizeSearchInput } from "@/components/builder/sections/header/headerSearch.helpers";

  export let userJson: string;

  $: user = JSON.parse(userJson) as AuthenticatedUser;

  let isDark = false;
  let rawSearchQuery = "";
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onMount(() => {
    isDark = document.documentElement.getAttribute("data-theme") === "dark";
  });

  onDestroy(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
  });

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    isDark = next === "dark";
  };

  const getTodayFormatted = () => {
    return formatDate(new Date(), {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const handleSearchInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const { cleanQuery } = sanitizeSearchInput(target.value);
    rawSearchQuery = cleanQuery;

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("dashboard-search", { detail: { query: cleanQuery } }),
      );
    }, 300);
  };

  const handleClearSearch = () => {
    rawSearchQuery = "";
    if (debounceTimer) clearTimeout(debounceTimer);
    window.dispatchEvent(
      new CustomEvent("dashboard-search", { detail: { query: "" } }),
    );
  };

  const handleSearchKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClearSearch();
    }
  };
</script>

<header
  class="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-8
         bg-canvas/90 backdrop-blur-md border-b border-light flex-shrink-0"
>
  <!-- Left: search bar capsule + date pill badge -->
  <div class="flex items-center gap-3 flex-1 min-w-0 max-w-md">
    <div
      class="flex items-center gap-2.5 w-full bg-card border border-light rounded-full
             px-4 py-2 hover:border-main/40 hover:bg-card transition-all shadow-xs group"
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
        value={rawSearchQuery}
        on:input={handleSearchInput}
        on:keydown={handleSearchKeydown}
        autocomplete="off"
        spellcheck="false"
      />
      {#if rawSearchQuery}
        <button
          type="button"
          on:click={handleClearSearch}
          class="text-muted hover:text-main text-xs p-0.5 rounded-full hover:bg-nested transition-colors"
          title="Hapus pencarian (Esc)"
        >
          <span class="material-symbols-outlined text-xs block">close</span>
        </button>
      {/if}
    </div>

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

  <!-- Right: notifications, theme toggle, and user dropdown -->
  <div class="flex items-center gap-2.5 flex-shrink-0 ml-3">
    <!-- Notification Bell -->
    <NavbarNotifications {user} />

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
    <NavbarUserMenu {user} />
  </div>
</header>