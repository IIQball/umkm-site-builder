<script lang="ts">
  import Button from '@/components/ui/Button.svelte'
</script>

<section
  id="cta"
  class="w-full bg-canvas text-main py-14 sm:py-18 md:py-22 px-4 sm:px-6 md:px-8 border-t border-border relative overflow-hidden select-none transition-colors duration-200"
>
  <!-- Background Faint Text Watermark (Pinoka in Host Grotesk) -->
  <div
    class="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden -z-0"
    aria-hidden="true"
  >
    <svg class="w-full h-auto max-h-[85%] overflow-visible select-none" viewBox="0 0 600 180" fill="currentColor">
      <text x="50%" y="60%" text-anchor="middle" dominant-baseline="middle" class="font-heading font-black text-[130px] tracking-tighter fill-main/[0.04]">
        Pinoka
      </text>
    </svg>
  </div>

  <!-- Content Container (Flat, no nested card) -->
  <div class="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">
    <!-- Main Headline -->
    <h2 class="heading-section text-main max-w-2xl">
      Siap membawa produk lokal Anda ke panggung lebih luas?
    </h2>

    <!-- Narrative Subtext -->
    <p class="desc-section text-secondary mt-3.5 sm:mt-4 max-w-lg mx-auto">
      Pinoka menyatukan kurasi desain visual, kemudahan kelola produk, dan pesanan langsung via WhatsApp untuk wirausaha Banyuwangi.
    </p>

    <!-- Dual Pill Buttons (Outline Left + Solid Right) -->
    <div class="mt-6 sm:mt-8 flex flex-row items-center justify-center gap-3 sm:gap-4">
      <Button
        href="/auth/login?mode=register"
        variant="secondary"
        size="md"
        class="!rounded-full !px-7 !font-medium !tracking-tight"
      >
        Buka toko
      </Button>

      <Button
        href="/templates"
        variant="dark"
        size="md"
        class="!rounded-full !px-7 !font-medium !tracking-tight"
      >
        Jelajahi template
      </Button>
    </div>
  </div>
</section>
