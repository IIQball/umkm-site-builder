<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { HelpCircle } from 'lucide-svelte';
  import { driver, type Driver } from 'driver.js';
  import 'driver.js/dist/driver.css';
  import { getDriverSteps, isTourCompleted, setTourCompleted } from './tour.helpers';

  export let role: string = 'tenant';
  export let currentPath: string = '';

  let driverInstance: Driver | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;

  $: isSuperAdmin = (role || '').toLowerCase() === 'superadmin';

  export function startTour() {
    if (typeof window === 'undefined' || isSuperAdmin) return;

    if (driverInstance && driverInstance.isActive()) {
      driverInstance.destroy();
    }

    const path = currentPath || window.location.pathname;
    const steps = getDriverSteps(role, path);
    if (!steps || steps.length === 0) return;

    driverInstance = driver({
      showProgress: true,
      animate: true,
      stagePadding: window.innerWidth < 640 ? 4 : 8,
      stageRadius: 14,
      popoverClass: 'pinoka-tour-popover',
      nextBtnText: 'Lanjut',
      prevBtnText: 'Kembali',
      doneBtnText: 'Selesai',
      progressText: '{{current}} dari {{total}}',
      skipMissingElement: true,
      steps,
      onDestroyed: () => {
        setTourCompleted(role, true, path);
      },
    });

    driverInstance.drive();
  }

  onMount(() => {
    if (isSuperAdmin) return;
    const path = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '');
    // Jalankan panduan otomatis bila pengguna pertama kali membuka rute halaman dasbor ini
    if (!isTourCompleted(role, path)) {
      timer = setTimeout(() => {
        startTour();
      }, 700);
    }
  });

  onDestroy(() => {
    if (timer) clearTimeout(timer);
    if (driverInstance && driverInstance.isActive()) {
      driverInstance.destroy();
    }
  });
</script>

{#if !isSuperAdmin}
<!-- Floating Re-Trigger Button (Pojok Kanan Bawah, Lebar Alami w-auto) -->
<button
  type="button"
  on:click={startTour}
  class="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-card/95 hover:bg-card border border-light shadow-md hover:shadow-lg text-xs font-bold text-main transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer backdrop-blur-md w-auto select-none"
  title="Buka tur panduan fitur dasbor"
  aria-label="Panduan Dasbor"
>
  <div class="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
    <HelpCircle size={15} />
  </div>
  <span class="font-sans whitespace-nowrap">Panduan Dasbor</span>
</button>
{/if}

<style>
  :global(.driver-popover.pinoka-tour-popover) {
    background-color: var(--color-card-base, #ffffff);
    color: var(--color-text-main, #0f172a);
    border: 1px solid var(--color-border, rgba(15, 23, 42, 0.1));
    border-radius: 1.25rem;
    padding: 1.25rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.15);
    font-family: var(--font-ui-sans, system-ui, sans-serif);
    max-width: 320px;
    z-index: 1000000000;
  }

  :global(.pinoka-tour-popover .driver-popover-title) {
    font-family: var(--font-ui-heading, system-ui, sans-serif);
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-text-main, #0f172a);
    margin-bottom: 0.5rem;
    line-height: 1.35;
  }

  :global(.pinoka-tour-popover .driver-popover-description) {
    font-size: 0.8125rem;
    line-height: 1.55;
    color: var(--color-text-secondary, #475569);
    margin-bottom: 1rem;
  }

  :global(.pinoka-tour-popover .driver-popover-footer) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--color-border-light, rgba(15, 23, 42, 0.08));
    padding-top: 0.75rem;
    margin-top: 0.75rem;
  }

  :global(.pinoka-tour-popover .driver-popover-progress-text) {
    font-size: 0.725rem;
    font-weight: 600;
    color: var(--color-text-muted, #64748b);
    font-family: monospace;
  }

  :global(.pinoka-tour-popover .driver-popover-footer-btn) {
    border-radius: 9999px;
    padding: 0.35rem 0.85rem;
    font-size: 0.75rem;
    font-weight: 600;
    transition: all 0.15s ease-in-out;
    cursor: pointer;
  }

  :global(.pinoka-tour-popover .driver-popover-prev-btn) {
    background-color: transparent;
    color: var(--color-text-muted, #64748b);
    border: 1px solid var(--color-border);
  }

  :global(.pinoka-tour-popover .driver-popover-prev-btn:hover) {
    background-color: var(--color-nested-base, #f1f5f9);
    color: var(--color-text-main, #0f172a);
  }

  :global(.pinoka-tour-popover .driver-popover-next-btn),
  :global(.pinoka-tour-popover .driver-popover-done-btn) {
    background-color: var(--color-primary, #36C6FD);
    color: var(--color-card-base, #ffffff);
    border: 1px solid transparent;
    box-shadow: 0 2px 6px rgba(var(--color-primary-rgb, 54 198 253), 0.35);
  }

  :global(.pinoka-tour-popover .driver-popover-next-btn:hover),
  :global(.pinoka-tour-popover .driver-popover-done-btn:hover) {
    filter: brightness(0.95);
    transform: translateY(-0.5px);
  }

  :global(.pinoka-tour-popover .driver-popover-close-btn) {
    color: var(--color-text-muted, #94a3b8);
    top: 0.85rem;
    right: 0.85rem;
    font-size: 1.15rem;
  }

  :global(.pinoka-tour-popover .driver-popover-close-btn:hover) {
    color: var(--color-text-main, #0f172a);
  }

  :global(.pinoka-tour-popover .driver-popover-arrow) {
    border-color: var(--color-card-base, #ffffff);
  }
</style>
