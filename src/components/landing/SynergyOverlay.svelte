<script lang="ts">
  import { ArrowRight } from 'lucide-svelte'
  import { STAGES } from './synergy.data'

  export let activeStage = 0
</script>

<div class="relative z-10 pointer-events-none w-full h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">
    <div class="col-span-12 lg:col-span-5 pointer-events-none">
      <div class="relative min-h-[120px] sm:min-h-[140px] flex items-center">
        {#each STAGES as stage, idx}
          <div
            class="absolute inset-0 flex flex-col justify-center transition-all duration-500 ease-out max-w-sm sm:max-w-md {activeStage === idx
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'}"
          >
            <!-- Scrim Atmosferik Lembut (Background Asap) -->
            <div
              class="absolute -inset-10 -z-10 bg-gradient-to-tr from-white/90 via-white/50 to-transparent dark:from-black/95 dark:via-black/60 dark:to-transparent blur-2xl rounded-3xl pointer-events-none"
            ></div>

            <h2 class="font-heading font-black text-4xl sm:text-5xl text-base-content tracking-tight leading-none drop-shadow-sm dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              {stage.headline}
            </h2>
            <p class="text-sm text-base-content/80 font-sans mt-3 drop-shadow-sm dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {stage.subtitle}
            </p>
          </div>
        {/each}
      </div>
    </div>

    <div class="hidden lg:block lg:col-span-3 pointer-events-none"></div>

    <div class="col-span-12 lg:col-span-4 flex justify-start lg:justify-end">
      <div class="relative w-full max-w-xs min-h-[195px] sm:min-h-[205px]">
        {#each STAGES as stage, idx}
          <div
            class="card bg-base-200/75 backdrop-blur-md border border-base-content/10 p-5 rounded-2xl max-w-xs shadow-xl pointer-events-auto transition-all duration-500 ease-out absolute inset-0 flex flex-col justify-between {activeStage === idx
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-3 scale-95 pointer-events-none'}"
          >
            <div>
              <div class="flex items-center justify-between pb-2 mb-2.5 border-b border-base-content/10">
                <span class="text-[11px] font-mono tracking-wider text-base-content/50 uppercase">
                  {stage.roleLabel}
                </span>
                <div class="flex items-center gap-1">
                  {#each STAGES as _, dotIdx}
                    <span
                      class="h-1 rounded-full transition-all duration-300 {activeStage === dotIdx
                        ? 'w-3.5 bg-orange'
                        : 'w-1 bg-base-content/20'}"
                    ></span>
                  {/each}
                </div>
              </div>
              <p class="text-xs sm:text-sm text-base-content/80 leading-relaxed font-sans">
                {stage.cardDesc}
              </p>
            </div>
            <a
              href="#contact"
              class="btn btn-sm btn-neutral rounded-full mt-4 font-sans w-fit normal-case text-xs transition-transform hover:scale-105 inline-flex items-center gap-1.5 group"
            >
              <span>Eksplorasi</span>
              <ArrowRight size={13} class="transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
