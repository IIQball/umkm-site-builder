<script lang="ts">
  import { HERO_SCENES, calculateSceneOpacity } from './HeroCaptions'

  export let currentFrame = 1
</script>

<div class="absolute inset-0 pointer-events-none z-20 overflow-hidden">
  <div class="w-full h-full max-w-7xl mx-auto px-6 sm:px-12 pt-16 md:pt-20 pb-6 sm:pb-8 md:pb-10 relative">
    {#each HERO_SCENES as scene (scene.id)}
      {@const opacity = calculateSceneOpacity(currentFrame, scene)}
      {#if opacity > 0.005}
        {#if scene.id === 'collaboration'}
          <!-- Scene 1: Layout Asimetris (Kiri Atas & Kanan Tengah) -->
          <div class="relative w-full h-full">
            <!-- Headline Kiri Atas -->
            <div
              class="absolute top-24 sm:top-28 md:top-32 left-0 max-w-xl will-change-[opacity,transform] pointer-events-none select-none"
              style:opacity="{opacity.toFixed(3)}"
              style:transform="translateY({((1 - opacity) * 10).toFixed(1)}px)"
            >
              <div
                class="absolute -inset-6 sm:-inset-8 bg-canvas/50 dark:bg-canvas/60 blur-2xl -z-10 pointer-events-none rounded-3xl"
              ></div>
              <h2 class="heading-section text-main text-left">
                {@html scene.headline}
              </h2>
            </div>

            <!-- Subtext Kanan Tengah dengan Asap Difusi Halus -->
            <div
              class="absolute right-0 top-[52%] -translate-y-1/2 max-w-xs sm:max-w-sm md:max-w-[360px] will-change-[opacity,transform] pointer-events-none select-none"
              style:opacity="{opacity.toFixed(3)}"
              style:transform="translateY({((1 - opacity) * 10).toFixed(1)}px)"
            >
              <div class="relative">
                <div
                  class="absolute -inset-4 bg-canvas/50 dark:bg-canvas/65 blur-xl -z-10 pointer-events-none rounded-2xl"
                ></div>
                <p class="desc-section text-main dark:text-white text-left font-semibold drop-shadow-sm dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {scene.subtext}
                </p>
              </div>
            </div>
          </div>
        {/if}

        {#if scene.id === 'decision'}
          <!-- Scene 2: Layout Kiri Atas Bertumpuk -->
          <div class="relative w-full h-full">
            <div
              class="absolute top-24 sm:top-28 md:top-32 left-0 max-w-md sm:max-w-lg will-change-[opacity,transform] pointer-events-none select-none"
              style:opacity="{opacity.toFixed(3)}"
              style:transform="translateY({((1 - opacity) * 10).toFixed(1)}px)"
            >
              <div
                class="absolute -inset-6 sm:-inset-8 bg-canvas/50 dark:bg-canvas/60 blur-2xl -z-10 pointer-events-none rounded-3xl"
              ></div>
              <h2 class="heading-section text-main text-left">
                {@html scene.headline}
              </h2>
              <div class="relative mt-4 sm:mt-5 max-w-xs sm:max-w-sm md:max-w-[360px]">
                <div
                  class="absolute -inset-4 bg-canvas/50 dark:bg-canvas/65 blur-xl -z-10 pointer-events-none rounded-2xl"
                ></div>
                <p class="desc-section text-main dark:text-white text-left font-semibold drop-shadow-sm dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {scene.subtext}
                </p>
              </div>
            </div>
          </div>
        {/if}

        {#if scene.id === 'breakthrough'}
          <!-- Scene 3: Layout Kiri Bawah -->
          <div class="relative w-full h-full">
            <div
              class="absolute bottom-2 sm:bottom-4 left-0 max-w-lg will-change-[opacity,transform] pointer-events-none select-none"
              style:opacity="{opacity.toFixed(3)}"
              style:transform="translateY({((1 - opacity) * 10).toFixed(1)}px)"
            >
              <div
                class="absolute -inset-6 sm:-inset-8 bg-canvas/50 dark:bg-canvas/60 blur-2xl -z-10 pointer-events-none rounded-3xl"
              ></div>
              <h2 class="heading-section text-main text-left">
                {@html scene.headline}
              </h2>
              <div class="relative mt-4 sm:mt-5 max-w-xs sm:max-w-sm md:max-w-[360px]">
                <div
                  class="absolute -inset-4 bg-canvas/50 dark:bg-canvas/65 blur-xl -z-10 pointer-events-none rounded-2xl"
                ></div>
                <p class="desc-section text-main dark:text-white text-left font-semibold drop-shadow-sm dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {scene.subtext}
                </p>
              </div>
            </div>
          </div>
        {/if}

        {#if scene.id === 'showcase'}
          <!-- Scene 4: Layout Kanan Atas -->
          <div class="relative w-full h-full">
            <div
              class="absolute top-24 sm:top-28 md:top-32 right-0 max-w-lg text-left sm:text-right flex flex-col items-start sm:items-end will-change-[opacity,transform] pointer-events-none select-none"
              style:opacity="{opacity.toFixed(3)}"
              style:transform="translateY({((1 - opacity) * 10).toFixed(1)}px)"
            >
              <div
                class="absolute -inset-6 sm:-inset-8 bg-canvas/50 dark:bg-canvas/60 blur-2xl -z-10 pointer-events-none rounded-3xl"
              ></div>
              <h2 class="heading-section text-main text-left sm:text-right">
                {@html scene.headline}
              </h2>
              <div class="relative mt-4 sm:mt-5 max-w-xs sm:max-w-sm md:max-w-[360px]">
                <div
                  class="absolute -inset-4 bg-canvas/50 dark:bg-canvas/65 blur-xl -z-10 pointer-events-none rounded-2xl"
                ></div>
                <p class="desc-section text-main dark:text-white text-left font-semibold drop-shadow-sm dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {scene.subtext}
                </p>
              </div>
            </div>
          </div>
        {/if}

        {#if scene.id === 'map'}
          <!-- Scene 5: Layout Kiri Atas -->
          <div class="relative w-full h-full">
            <div
              class="absolute top-24 sm:top-28 md:top-32 left-0 max-w-md sm:max-w-lg will-change-[opacity,transform] pointer-events-none select-none"
              style:opacity="{opacity.toFixed(3)}"
              style:transform="translateY({((1 - opacity) * 10).toFixed(1)}px)"
            >
              <div
                class="absolute -inset-6 sm:-inset-8 bg-canvas/50 dark:bg-canvas/60 blur-2xl -z-10 pointer-events-none rounded-3xl"
              ></div>
              <h2 class="heading-section text-main text-left">
                {@html scene.headline}
              </h2>
              <div class="relative mt-4 sm:mt-5 max-w-xs sm:max-w-sm md:max-w-[360px]">
                <div
                  class="absolute -inset-4 bg-canvas/50 dark:bg-canvas/65 blur-xl -z-10 pointer-events-none rounded-2xl"
                ></div>
                <p class="desc-section text-main dark:text-white text-left font-semibold drop-shadow-sm dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {scene.subtext}
                </p>
              </div>
            </div>
          </div>
        {/if}
      {/if}
    {/each}
  </div>
</div>
