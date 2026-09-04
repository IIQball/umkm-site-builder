<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let open: boolean = false;
  export let title: string = '';
  export let description: string = '';
  export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  export let closeOnEsc: boolean = true;
  export let closeOnBackdrop: boolean = true;
  export let showCloseButton: boolean = true;
  export let bodyPadding: boolean = true;
  export let borderless: boolean = false;
  let className: string = '';
  export { className as class };

  const dispatch = createEventDispatcher<{
    close: void;
    open: void;
  }>();

  const sizeStyles = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[calc(100vw-2rem)] min-h-[80vh]',
  };

  function handleClose() {
    open = false;
    dispatch('close');
  }

  function handleKeydown(e: KeyboardEvent) {
    if (open && closeOnEsc && e.key === 'Escape') {
      e.stopPropagation();
      handleClose();
    }
  }

  function teleport(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }
    };
  }

  $: if (open) {
    dispatch('open');
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div
    use:teleport
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-sm animate-fade-in transition-all"
    role="presentation"
  >
    <!-- Accessible backdrop dismiss button -->
    {#if closeOnBackdrop}
      <button
        type="button"
        class="fixed inset-0 w-full h-full bg-transparent cursor-default border-none outline-none -z-10"
        tabindex="-1"
        aria-hidden="true"
        on:click={handleClose}
      ></button>
    {/if}

    <div
      class="w-full bg-card border border-light rounded-3xl shadow-2xl overflow-hidden relative animate-fade-in-up text-main my-auto {sizeStyles[size] || sizeStyles.md} {className}"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-desc' : undefined}
    >
      <!-- Modal Header -->
      {#if title || $$slots.header}
        <div class="px-6 sm:px-7 py-5 flex items-start justify-between gap-4 {borderless ? '' : 'border-b border-light'}">
          <div class="min-w-0 flex-1 {borderless ? 'mt-2' : ''}">
            {#if $$slots.header}
              <slot name="header" />
            {:else}
              {#if title}
                <h3 id="modal-title" class="text-heading-md font-bold text-main truncate">
                  {title}
                </h3>
              {/if}
              {#if description}
                <p id="modal-desc" class="text-body-sm text-secondary mt-1">
                  {description}
                </p>
              {/if}
            {/if}
          </div>

          {#if showCloseButton}
            <button
              type="button"
              on:click={handleClose}
              class="w-8 h-8 rounded-full bg-nested hover:bg-nested/80 border border-light text-muted hover:text-main flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer {borderless ? '-mr-2 -mt-1' : ''}"
              aria-label="Tutup Dialog"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          {/if}
        </div>
      {:else if showCloseButton}
        <!-- Absolute Close Button for headerless modals -->
        <button
          type="button"
          on:click={handleClose}
          class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-nested/80 backdrop-blur hover:bg-nested border border-light text-muted hover:text-main flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup Dialog"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      {/if}

      <!-- Modal Body -->
      <div class="px-6 sm:px-7 max-h-[75vh] overflow-y-auto {bodyPadding ? (borderless ? 'pb-6' : 'py-6') : 'py-0'}">
        <slot />
      </div>

      <!-- Modal Footer -->
      {#if $$slots.footer}
        <div class="px-6 sm:px-7 py-5 flex flex-wrap items-center justify-end gap-3 {borderless ? '' : 'bg-nested/50 border-t border-light'}">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}
