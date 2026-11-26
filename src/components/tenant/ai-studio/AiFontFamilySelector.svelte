<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { AI_FONT_OPTIONS } from './font.constants';

  export let selectedFont: string = 'Plus Jakarta Sans';
  export let label: string = 'Pilihan Huruf & Tipografi';
  export let helper: string = 'Gaya bentuk huruf yang digunakan pada teks judul desain.';
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher<{
    change: string;
  }>();

  function handleSelect(fontId: string) {
    if (disabled) return;
    selectedFont = fontId;
    dispatch('change', fontId);
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Serif+Display&family=Fraunces:opsz,wght@9..144,600;700&family=Inter:wght@600;700&family=Merriweather:wght@700&family=Montserrat:wght@600;700&family=Outfit:wght@600;700&family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@600;700&family=Poppins:wght@600;700&family=Sora:wght@600;700&family=Space+Grotesk:wght@600;700&display=swap"
  />
</svelte:head>

<div class="space-y-2.5">
  <div class="flex items-center justify-between">
    <div>
      <span class="block text-label-caps text-muted">
        {label}
      </span>
      {#if helper}
        <p class="text-2xs text-secondary mt-0.5">{helper}</p>
      {/if}
    </div>
    <span class="text-2xs text-secondary font-medium font-mono">
      {selectedFont}
    </span>
  </div>

  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1 p-0.5">
    {#each AI_FONT_OPTIONS as opt}
      {@const isSelected = selectedFont === opt.id}
      <button
        type="button"
        class="text-left cursor-pointer transition-all focus:outline-none p-2.5 rounded-xl border flex flex-col justify-between {isSelected
          ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-xs'
          : 'bg-nested hover:bg-card border-light'}"
        on:click={() => handleSelect(opt.id)}
        {disabled}
      >
        <div class="space-y-1 w-full">
          <div class="flex items-center justify-between gap-1 w-full">
            <span
              class="text-xs font-bold text-main truncate block"
              style="font-family: '{opt.id}', sans-serif;"
            >
              {opt.name}
            </span>
            {#if isSelected}
              <span class="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
            {/if}
          </div>
          <span class="text-3xs px-1.5 py-0.5 rounded-md bg-card/80 border border-light/60 text-secondary font-sans inline-block">
            {opt.category}
          </span>
        </div>
        <p class="text-3xs text-secondary line-clamp-1 mt-1.5">
          {opt.description}
        </p>
      </button>
    {/each}
  </div>
</div>
