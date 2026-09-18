<script lang="ts">
  import { HERO_SCENES, calculateSceneOpacity } from './HeroCaptions'

  export let currentFrame = 1
</script>

<div class="absolute inset-0 pointer-events-none z-20 flex items-end justify-start p-6 sm:p-12 md:p-16">
  <div class="max-w-lg w-full grid grid-cols-1 items-end relative">
    {#each HERO_SCENES as scene (scene.id)}
      {@const opacity = calculateSceneOpacity(currentFrame, scene)}
      {#if opacity > 0.005}
        <div
          class="col-start-1 row-start-1 p-2 sm:p-4 will-change-[opacity,transform] pointer-events-none select-none"
          style:opacity="{opacity.toFixed(3)}"
          style:transform="translateY({((1 - opacity) * 10).toFixed(1)}px)"
        >
          <!-- Bayang-bayang / Scrim Atmosferik Lembut (Tanpa Kotak/Border) -->
          <div
            class="absolute -inset-10 -z-10 bg-gradient-to-tr from-white/90 via-white/50 to-transparent dark:from-black/95 dark:via-black/60 dark:to-transparent blur-2xl rounded-3xl pointer-events-none"
          ></div>

          <h2 class="font-heading font-semibold text-2xl sm:text-3xl md:text-4xl text-neutral-950 dark:text-white tracking-tight leading-tight drop-shadow-sm dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {scene.headline}
          </h2>
          <p class="font-sans text-xs sm:text-sm md:text-base text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed mt-2.5 max-w-md drop-shadow-sm dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {scene.subtext}
          </p>
        </div>
      {/if}
    {/each}
  </div>
</div>
