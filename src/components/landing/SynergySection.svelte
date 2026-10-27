<script lang="ts">
  import Synergy3DScene from './Synergy3DScene.svelte'
  import SynergyOverlay from './SynergyOverlay.svelte'

  let containerElement: HTMLElement
  let activeStage = 0
</script>

<section
  id="synergy"
  bind:this={containerElement}
  class="relative overflow-hidden w-full h-[100dvh] min-h-[100dvh] bg-canvas text-main transition-colors duration-300 select-none"
>
  <!-- Atmospheric Background Gradient for Mobile and Base Layer -->
  <div class="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"></div>

  <Synergy3DScene
    {containerElement}
    bind:activeStage
  />

  <SynergyOverlay {activeStage} />
</section>
