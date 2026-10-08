<script lang="ts">
  import { Check, ExternalLink, Layout } from "lucide-svelte";
  import type { TemplateItem } from "../onboarding.types";
  import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

  export let templates: TemplateItem[] = [];
  export let selectedTemplateId: string = "";
</script>

<div class="p-4 sm:p-5 rounded-2xl bg-nested border border-light space-y-3">
  <div class="flex items-center justify-between gap-2 flex-wrap">
    <div>
      <h3 class="text-xs sm:text-sm font-bold text-main font-heading">
        Pilihan Template Toko ({templates.length})
      </h3>
      <p class="text-2xs text-secondary mt-0.5 font-sans">
        Klik template untuk melihat preview langsung landing page di sebelah kanan.
      </p>
    </div>

    <a
      href="/templates"
      class="inline-flex items-center gap-1 text-2xs font-semibold text-primary hover:underline shrink-0"
    >
      <span>Katalog</span>
      <ExternalLink size={11} />
    </a>
  </div>

  <div class="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
    {#each templates as tpl (tpl.id)}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        on:click={() => (selectedTemplateId = tpl.id)}
        class="flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all duration-150 {selectedTemplateId ===
        tpl.id
          ? 'bg-primary/5 border-primary ring-1 ring-primary/20 shadow-2xs'
          : 'bg-card border-light hover:border-primary/40 hover:bg-nested/40'}"
      >
        <div
          class="w-12 h-12 rounded-lg overflow-hidden bg-nested border border-light shrink-0 relative"
        >
          {#if tpl.thumbnailUrl}
            <img
              src={getOptimizedCloudinaryUrl(tpl.thumbnailUrl, 160)}
              alt={tpl.name}
              class="w-full h-full object-cover"
              loading="lazy"
            />
          {:else}
            <div
              class="w-full h-full flex items-center justify-center text-muted"
            >
              <Layout size={16} />
            </div>
          {/if}
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <p class="text-xs font-bold text-main truncate font-heading">
              {tpl.name}
            </p>
            {#if tpl.categoryName}
              <span
                class="text-xs font-semibold px-1.5 py-0.2 rounded bg-nested text-muted border border-light"
              >
                {tpl.categoryName}
              </span>
            {/if}
          </div>
          <p class="text-2xs text-secondary line-clamp-1 mt-0.5 font-sans">
            {tpl.description || "Template toko online responsif dan optimal."}
          </p>
        </div>

        <div class="shrink-0">
          {#if selectedTemplateId === tpl.id}
            <span
              class="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-xs"
            >
              <Check size={12} strokeWidth={3} />
            </span>
          {:else}
            <span
              class="w-4 h-4 rounded-full border border-light flex items-center justify-center"
            ></span>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
