<script lang="ts">
  import { onMount } from 'svelte';
  import { Sun, Moon } from 'lucide-svelte';
  import Navbar from './sections/Navbar.svelte';
  import Hero from './sections/Hero.svelte';
  import About from './sections/About.svelte';
  import Kategori from './sections/Kategori.svelte';
  import Featured from './sections/Featured.svelte';
  import Builder from './sections/Builder.svelte';
  import HowItWorks from './sections/HowItWorks.svelte';
  import Testimonial from './sections/Testimonial.svelte';
  import CTA from './sections/CTA.svelte';
  import Footer from './sections/Footer.svelte';
  import { setupHeroAnimations, setupScrollRevealAnimations, setupAboutScrollAnimation } from './utils/animations';
  import { fullEyebrow, fullH2 } from './utils/constants';

  let isDark = false;
  let themeToggleBtn: HTMLElement;

  // Navbar refs
  let nav: HTMLElement;
  let navBrandText: HTMLElement;

  // Hero refs
  let heroWrap: HTMLElement;
  let heroWelcome: HTMLElement;
  let mapVisual: HTMLElement;
  let mapJatim: HTMLImageElement;
  let mapBwi: HTMLImageElement;
  let welcomeLead: HTMLElement;
  let pinokaSrc: HTMLElement;
  let pinokaFlip: HTMLElement;
  let heroFinal: HTMLElement;
  let scrollHint: HTMLElement;

  // About refs
  let aboutSection: HTMLElement;
  let aboutArtEl: HTMLElement;
  let aboutVideo: HTMLVideoElement;
  let eyebrowEl: HTMLElement;
  let eyebrowCursorEl: HTMLElement;
  let h2El: HTMLElement;
  let h2CursorEl: HTMLElement;
  let fadeContentEl: HTMLElement;

  function toggleTheme() {
    isDark = !isDark;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('pinoka_theme', isDark ? 'dark' : 'light');
    }
  }

  $: if (typeof document !== 'undefined') {
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }

  onMount(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('pinoka_theme');
      if (saved === 'dark') {
        isDark = true;
      } else if (saved === 'light') {
        isDark = false;
      }
    }

    // Dynamic import untuk GSAP
    import('gsap').then((gsapModule) => {
      const gsap = gsapModule.default;
      import('gsap/ScrollTrigger').then((scrollTriggerModule) => {
        gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);

        const mm = gsap.matchMedia();

        mm.add('(min-width: 861px)', () => {
          setupHeroAnimations(
            nav,
            heroWrap,
            mapVisual,
            mapJatim,
            mapBwi,
            heroWelcome,
            welcomeLead,
            pinokaSrc,
            pinokaFlip,
            navBrandText,
            heroFinal,
            scrollHint,
            themeToggleBtn
          );

          setupScrollRevealAnimations();
          setupAboutScrollAnimation(
            aboutSection,
            aboutArtEl,
            aboutVideo,
            eyebrowEl,
            eyebrowCursorEl,
            h2El,
            h2CursorEl,
            fadeContentEl,
            fullEyebrow,
            fullH2
          );

          scrollTriggerModule.ScrollTrigger.refresh();
        });

        mm.add('(max-width: 860px)', () => {
          gsap.set(themeToggleBtn, {
            opacity: 1,
            scale: 1
          });

          gsap.set(nav, {
            opacity: 1,
            pointerEvents: 'auto'
          });

          gsap.set(mapBwi, {
            opacity: 1
          });

          gsap.set(heroFinal, {
            opacity: 1,
            pointerEvents: 'auto'
          });

          gsap.utils
            .toArray<HTMLElement>('.gsap-reveal')
            .forEach((element) => {
              gsap.fromTo(
                element,
                {
                  opacity: 0,
                  y: 30
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  ease: 'power3.out',
                  scrollTrigger: {
                    trigger: element,
                    start: 'top 90%'
                  }
                }
              );
            });
        });
      });
    });
  });
</script>

<svelte:head>
  <title>Pinoka — Temukan UMKM di Seluruh Banyuwangi</title>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
  <link rel="preload" as="image" href="/assets/Map Jawa Timur.png" />
  <link rel="preload" as="image" href="/assets/Map Banyuwangi.png" />
  <link rel="preload" as="image" href="/assets/Map Jawa Timur Malam.png" />
  <link rel="preload" as="image" href="/assets/Map Banyuwangi Malam.png" />
</svelte:head>

<div class="landing-page" class:dark-theme={isDark} class:light-theme={!isDark}>
  <button
    bind:this={themeToggleBtn}
    type="button"
    class="theme-toggle-btn"
    onclick={toggleTheme}
    aria-label="Toggle Mode Terang/Gelap"
    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
  >
    {#if isDark}
      <Sun size={18} />
    {:else}
      <Moon size={18} />
    {/if}
  </button>

  <Navbar bind:nav bind:navBrandText />

  <Hero
    bind:isDark
    bind:heroWrap
    bind:heroWelcome
    bind:mapVisual
    bind:mapJatim
    bind:mapBwi
    bind:welcomeLead
    bind:pinokaSrc
    bind:pinokaFlip
    bind:heroFinal
    bind:scrollHint
  />

  <About
    bind:aboutSection
    bind:aboutArtEl
    bind:aboutVideo
    bind:eyebrowEl
    bind:eyebrowCursorEl
    bind:h2El
    bind:h2CursorEl
    bind:fadeContentEl
  />

  <Kategori />

  <Featured />

  <Builder />

  <HowItWorks />

  <Testimonial />

  <CTA />

  <Footer />
</div>

<style>
  :global(.landing-page) {
    --bg-0: #120e1c;
    --bg-1: #1a1428;
    --bg-2: #221a34;
    --panel: #241c38;
    --ink-0: #f6f3fb;
    --ink-1: #c9c0dd;
    --ink-2: #8d84a8;
    --violet-1: #8b6bff;
    --violet-2: #5b3df0;
    --coral: #ff7a54;
    --amber: #ffb45c;
    --teal: #33c9ab;
    --line: rgba(255, 255, 255, 0.09);
    --radius-lg: 22px;
    --radius-md: 14px;
    --font-display: 'Baloo 2', 'Plus Jakarta Sans', sans-serif;
    --font-body: 'Plus Jakarta Sans', sans-serif;

    background: var(--bg-0);
    color: var(--ink-0);
    font-family: var(--font-body);
    line-height: 1.6;
  }

  :global(.landing-page.light-theme) {
    --bg-0: #ffffff;
    --bg-1: #ffffff;
    --bg-2: #f7f7fb;
    --panel: #ffffff;
    --ink-0: #17121f;
    --ink-1: #5f586c;
    --ink-2: #81798f;
    --line: rgba(23, 18, 31, 0.1);
    background: #ffffff;
    color: var(--ink-0);
  }

  :global(.landing-page.dark-theme) {
    --bg-0: #000000;
    --bg-1: #050505;
    --bg-2: #0b0b0b;
    background: #000000;
    color: var(--ink-0);
  }

  :global(body.light-theme) {
    background: #ffffff;
  }

  :global(body.dark-theme) {
    background: #000000;
  }

  :global(.landing-page *),
  :global(.landing-page *::before),
  :global(.landing-page *::after) {
    box-sizing: border-box;
  }

  :global(.landing-page a) {
    color: inherit;
    text-decoration: none;
  }

  :global(.landing-page img) {
    max-width: 100%;
    display: block;
  }

  :global(.landing-page section) {
    position: relative;
  }

  .theme-toggle-btn {
    position: fixed;
    top: 22px;
    right: 40px;
    z-index: 700;

    width: 44px;
    height: 44px;
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    border: 1px solid var(--line);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    color: #17121f;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.14);

    cursor: pointer;
    transition:
      background 0.25s ease,
      color 0.25s ease,
      border-color 0.25s ease,
      box-shadow 0.25s ease;
  }

  :global(.landing-page.dark-theme) .theme-toggle-btn {
    background: rgba(18, 18, 18, 0.92);
    color: #f6f3fb;
    border-color: rgba(255, 255, 255, 0.14);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  }

  .theme-toggle-btn:hover {
    transform: translateY(-1px);
  }

  @media (max-width: 860px) {
    .theme-toggle-btn {
      top: 76px;
      right: 18px;
      width: 40px;
      height: 40px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.scroll-hint .chevron) {
      animation: none;
    }
  }
</style>
