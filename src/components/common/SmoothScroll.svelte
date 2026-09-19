<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Lenis from 'lenis';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import 'lenis/dist/lenis.css';

  let lenis: Lenis | null = null;
  let tickerFn: ((time: number) => void) | null = null;

  onMount(() => {
    // Avoid running on builder editor to preserve native canvas and drag-and-drop
    if (window.location.pathname.startsWith('/builder')) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    lenis = new Lenis({
      autoRaf: false,
      duration: prefersReducedMotion ? 0 : 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      anchors: true,
      stopInertiaOnNavigate: true,
      allowNestedScroll: true,
      prevent: (node) => {
        return (
          node.closest?.(
            '[data-lenis-prevent], .no-lenis, .leaflet-container, #canvas-container, .builder-canvas, [role="dialog"]'
          ) !== null
        );
      },
    });

    (window as any).__lenis = lenis;

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    tickerFn = (time: number) => {
      lenis?.raf(time * 1000);
    };

    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);
  });

  onDestroy(() => {
    if (tickerFn) {
      gsap.ticker.remove(tickerFn);
    }
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
    if (typeof window !== 'undefined') {
      delete (window as any).__lenis;
    }
  });
</script>
