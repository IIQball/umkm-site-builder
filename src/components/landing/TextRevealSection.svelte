<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  const STATEMENT =
    'Kualitas Otentik Tidak Boleh Terhenti di Kemasan Usang. PINOKA Menghubungkan UMKM Banyuwangi dengan Desainer Digital untuk Mendominasi Pasar Masa Kini.';

  const words = STATEMENT.split(' ');

  let containerRef: HTMLElement;
  let textRef: HTMLElement;
  let ctx: gsap.Context | null = null;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wordElements = textRef?.querySelectorAll('.reveal-word');

    if (!wordElements || !wordElements.length || !containerRef) return;

    if (prefersReducedMotion) {
      gsap.set(wordElements, { opacity: 1, color: '#ffffff' });
      return;
    }

    ctx = gsap.context(() => {
      gsap.fromTo(
        wordElements,
        {
          opacity: 0.15,
          color: 'var(--color-text-muted)',
        },
        {
          opacity: 1,
          color: '#ffffff',
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
          },
        }
      );
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, containerRef);
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<section
  bind:this={containerRef}
  id="manifesto-reveal"
  class="relative z-10 w-full min-h-[140vh] md:min-h-[180vh] bg-neutral-950 text-white border-b border-white/10 select-none"
>
  <!-- Sticky Pinning Stage for Continuous Scrubbing -->
  <div class="sticky top-0 h-screen w-full flex items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 px-4 sm:px-8 md:px-16 overflow-hidden">
    <div class="max-w-5xl mx-auto w-full text-center px-4">
      <h2
        bind:this={textRef}
        class="text-[clamp(1.5rem,3vw,2.25rem)] md:text-[clamp(2rem,3.2vw,2.75rem)] lg:text-[clamp(2.5rem,3.5vw,3.25rem)] font-heading font-medium tracking-tighter leading-[0.9] sm:leading-[0.88] text-center m-0"
      >
        {#each words as word}
          <span class="reveal-word inline-block mr-[0.24em] transition-colors duration-100 opacity-15 text-neutral-600">
            {word}
          </span>
        {/each}
      </h2>
    </div>
  </div>
</section>
