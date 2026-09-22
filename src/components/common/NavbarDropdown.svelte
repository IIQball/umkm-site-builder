<script lang="ts">
  import { ChevronDown, ArrowUpRight } from 'lucide-svelte'

  export let label: string
  export let isOpen: boolean = false
  export let isActive: boolean = false
  export let onToggle: () => void
  export let onClose: () => void
  export let items: {
    label: string
    href: string
    desc?: string
  }[] = []

  const handleItemClick = (href: string, e: MouseEvent) => {
    onClose()
    if (href.startsWith('/#') && (typeof window !== 'undefined') && (window.location.pathname === '/' || window.location.pathname === '')) {
      const targetId = href.replace('/#', '')
      const targetEl = document.getElementById(targetId)
      if (targetEl) {
        e.preventDefault()
        targetEl.scrollIntoView({ behavior: 'smooth' })
        history.pushState(null, '', href)
      }
    }
  }
</script>

<div class="relative nav-dropdown-container shrink-0">
  <button
    type="button"
    on:click|stopPropagation={onToggle}
    aria-expanded={isOpen}
    class={isActive
      ? 'px-3.5 lg:px-4 py-2 rounded-full bg-main text-canvas dark:bg-white dark:text-slate-950 label-caps font-bold tracking-wider shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0'
      : 'px-3.5 lg:px-4 py-2 rounded-full bg-card/70 hover:bg-card text-main/80 hover:text-main dark:bg-white/5 dark:hover:bg-white/15 dark:text-white/85 dark:hover:text-white label-caps font-medium tracking-wider border border-border/80 dark:border-white/15 backdrop-blur-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0'}
  >
    <span>{label}</span>
    <ChevronDown
      size={13}
      class="transition-transform duration-200 shrink-0 {isOpen
        ? 'rotate-180 text-orange'
        : isActive
          ? 'text-canvas/80 dark:text-slate-950/80'
          : 'text-muted dark:text-white/80'}"
    />
  </button>

  {#if isOpen}
    <div
      class="absolute left-0 top-full mt-2.5 w-72 sm:w-80 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/80 dark:border-white/10 text-main shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      <div class="max-h-[380px] overflow-y-auto no-scrollbar">
        {#each items as item}
          <a
            href={item.href}
            on:click={(e) => handleItemClick(item.href, e)}
            class="block px-4 py-3 sm:py-3.5 border-b border-border/60 dark:border-white/10 last:border-b-0 hover:bg-nested/60 dark:hover:bg-white/[0.05] transition-colors duration-150 group cursor-pointer"
          >
            <div class="flex items-center justify-between gap-3">
              <span class="font-heading font-semibold text-xs sm:text-sm text-main dark:text-neutral-100 group-hover:text-orange transition-colors truncate min-w-0">
                {item.label}
              </span>
              <ArrowUpRight
                size={14}
                class="text-muted dark:text-white/60 group-hover:text-main dark:group-hover:text-white transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
              />
            </div>
            {#if item.desc}
              <p class="body-sm text-secondary dark:text-neutral-400 mt-1 leading-relaxed">
                {item.desc}
              </p>
            {/if}
          </a>
        {/each}
      </div>
    </div>
  {/if}
</div>
