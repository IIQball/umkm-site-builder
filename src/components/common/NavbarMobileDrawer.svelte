<script lang="ts">
  export let isOpen: boolean = false;
  export let navItems: { label: string; href: string }[] = [];
  export let currentPath: string = '';
</script>

{#if isOpen}
  <div class="md:hidden border-t border-border dark:border-white/10 bg-card/95 backdrop-blur-2xl p-4 space-y-3">
    <div class="flex flex-wrap gap-2">
      {#each navItems as item}
        {@const isActive = item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href)}
        <a
          href={item.href}
          class={isActive
            ? 'px-4 py-2 rounded-full bg-main text-canvas dark:bg-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider'
            : 'px-3.5 py-2 rounded-full bg-nested/80 text-main/80 dark:bg-white/5 dark:text-white/80 font-medium text-xs uppercase tracking-wider border border-border dark:border-white/15'}
        >
          {item.label}
        </a>
      {/each}
    </div>

    <div class="pt-3 border-t border-border dark:border-white/10 flex items-center justify-between">
      <a href="/#contact" class="text-xs uppercase tracking-wider text-secondary dark:text-slate-300">KONTAK</a>
      <a href="/auth/login?mode=register" class="text-xs font-semibold uppercase tracking-wider text-main dark:text-white flex items-center gap-1">
        <span>DAFTAR GRATIS</span>
        <span>&rarr;</span>
      </a>
    </div>
  </div>
{/if}
