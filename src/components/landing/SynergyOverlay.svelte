<script lang="ts">
  import { ArrowRight } from 'lucide-svelte'
  import { STAGES } from './synergy.data'

  export let activeStage = 0
  $: stage = STAGES[activeStage]
</script>

<div class="mx-auto grid w-full max-w-7xl items-center gap-8 px-6 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
  <div class="lg:col-span-5">
    <h2 id="synergy-title" class="heading-section text-main">{STAGES[0].headline}</h2>
    <p class="desc-section mt-3 text-secondary">{STAGES[0].subtitle}</p>
  </div>

  <div class="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
    <slot />
  </div>

  <div class="lg:col-span-5">
    <div role="group" aria-label="Bagian ekosistem" class="mb-4 flex flex-wrap gap-2">
      {#each STAGES as option, index (option.id)}
        <button
          type="button"
          aria-pressed={activeStage === index}
          class="rounded-full border px-3 py-1.5 text-sm font-medium {activeStage === index
            ? 'border-main bg-main text-canvas'
            : 'border-border bg-canvas text-secondary hover:text-main'}"
          on:click={() => { activeStage = index }}
        >
          {option.roleLabel}
        </button>
      {/each}
    </div>
    <div class="max-w-md rounded-2xl border border-border bg-canvas p-5">
      <h3 class="font-heading text-lg font-semibold text-main">{activeStage === 0 ? stage.roleLabel : stage.headline}</h3>
      {#if activeStage !== 0}
        <p class="body-sm mt-2 text-secondary">{stage.subtitle}</p>
      {/if}
      <p class="body-sm mt-2 text-secondary">{stage.cardDesc}</p>
      <a
        href="#contact"
        class="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-main px-3 py-1.5 font-heading text-xs-dense font-medium text-canvas"
      >
        <span>Eksplorasi</span>
        <ArrowRight size={13} />
      </a>
    </div>
  </div>
</div>
