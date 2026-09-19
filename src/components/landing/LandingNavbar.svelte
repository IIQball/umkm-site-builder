<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Menu,
    X,
    Compass,
    Blocks,
    Handshake,
    ShoppingBag,
    Rocket,
  } from 'lucide-svelte';

  let scrolled = false;
  let mobileOpen = false;

  const NAV_LINKS = [
    { label: 'Jelajah Sekitar', href: '#jelajah', icon: Compass },
    { label: 'No-Code Builder', href: '#builder', icon: Blocks },
    { label: 'Sinergi Pemkab', href: '#sinergi', icon: Handshake },
    { label: 'Katalog UMKM', href: '/umkm', icon: ShoppingBag },
  ] as const;

  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 20;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const scrollTo = (href: string) => {
    mobileOpen = false;
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = href;
    }
  };
</script>

<nav
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
  class:scrolled
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 sm:h-18">
      <!-- Brand Logo -->
      <a href="/" class="flex items-center gap-2.5 group cursor-pointer">
        <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[var(--lp-cyan)] to-[var(--lp-purple)] flex items-center justify-center shadow-lg shadow-[var(--lp-cyan)]/20 group-hover:scale-105 transition-transform duration-300">
          <Rocket size={18} class="text-white stroke-[2.5]" />
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span class="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-[var(--lp-cyan)] transition-colors">
              UMKM Builder
            </span>
            <span class="bg-[var(--lp-cyan)]/15 text-[var(--lp-cyan)] border border-[var(--lp-cyan)]/30 text-3xs font-extrabold px-1.5 py-0.2 rounded-md uppercase tracking-wider">
              Banyuwangi
            </span>
          </div>
        </div>
      </a>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-1.5 p-1 rounded-2xl border border-white/5 bg-white/[0.02]">
        {#each NAV_LINKS as link}
          <button
            type="button"
            on:click={() => scrollTo(link.href)}
            class="px-4 py-2 rounded-xl text-xs font-bold text-[var(--lp-text-secondary)] hover:text-white hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <svelte:component this={link.icon} size={14} class="opacity-75" />
            <span>{link.label}</span>
          </button>
        {/each}
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-3">
        <a
          href="/auth/login?mode=register"
          class="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white transition-all cursor-pointer shadow-lg shadow-[var(--lp-cyan)]/20 hover:shadow-[var(--lp-cyan)]/40 hover:scale-[1.02] active:scale-[0.98]"
          style="background: linear-gradient(135deg, var(--lp-cyan), var(--lp-purple));"
        >
          <Rocket size={14} />
          <span>Mulai Gratis</span>
        </a>

        <!-- Mobile Menu Toggle -->
        <button
          type="button"
          on:click={() => (mobileOpen = !mobileOpen)}
          class="md:hidden w-9 h-9 rounded-2xl border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] text-white flex items-center justify-center cursor-pointer backdrop-blur-xl"
          aria-label="Toggle menu"
        >
          {#if mobileOpen}
            <X size={18} />
          {:else}
            <Menu size={18} />
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Menu Dropdown -->
  {#if mobileOpen}
    <div class="md:hidden border-t border-[var(--lp-glass-border)] bg-[#0E131F]/95 backdrop-blur-2xl p-4 space-y-2 lp-slide-up">
      {#each NAV_LINKS as link}
        <button
          type="button"
          on:click={() => scrollTo(link.href)}
          class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[var(--lp-text-secondary)] hover:text-white hover:bg-white/5 transition-all cursor-pointer text-left"
        >
          <svelte:component this={link.icon} size={16} class="text-[var(--lp-cyan)]" />
          <span>{link.label}</span>
        </button>
      {/each}
      <div class="pt-3 border-t border-[var(--lp-glass-border)]">
        <a
          href="/auth/login?mode=register"
          class="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-white shadow-lg"
          style="background: linear-gradient(135deg, var(--lp-cyan), var(--lp-purple));"
        >
          <Rocket size={16} />
          <span>Mulai Buat Website Gratis</span>
        </a>
      </div>
    </div>
  {/if}
</nav>

<style>
  nav {
    background: transparent;
    border-bottom: 1px solid transparent;
  }
  nav.scrolled {
    background: var(--lp-glass);
    backdrop-filter: blur(24px) saturate(1.6);
    -webkit-backdrop-filter: blur(24px) saturate(1.6);
    border-bottom-color: var(--lp-glass-border);
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  }
</style>
