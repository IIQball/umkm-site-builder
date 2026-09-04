<script lang="ts">
  import type { AuthenticatedUser } from "@/lib/auth";

  export let user: AuthenticatedUser;
  export let userInitial: string;
  export let roleCfg: any;
  export let collapsed: boolean = false;
  export let onSignOut: () => void;
</script>

<div class="border-t border-light p-3 flex-shrink-0">
  {#if !collapsed}
    <div
      class="bg-nested/60 hover:bg-nested border border-light rounded-xl p-2.5 flex items-center gap-2.5 mb-2 shadow-2xs transition-colors group relative"
    >
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

  <button
    type="button"
    on:click={onSignOut}
    title={collapsed ? "Keluar" : undefined}
    class="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs font-medium text-muted hover:text-error hover:bg-error/10 transition-colors cursor-pointer active:scale-[0.98] {collapsed
      ? 'justify-center'
      : ''}"
  >
    <span class="material-symbols-outlined text-base flex-shrink-0">logout</span>
    {#if !collapsed}
      <span>Keluar</span>
    {/if}
  </button>
</div>
