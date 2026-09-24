<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Lenis from 'lenis';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import 'lenis/dist/lenis.css';

  let lenis: Lenis | null = null;
  let tickerFn: ((time: number) => void) | null = null;
  let onRefresh: (() => void) | null = null;
  let handleAnchorClick: ((e: MouseEvent) => void) | null = null;

  onMount(() => {
    // Hindari menjalankan di builder canvas editor untuk menjaga native drag-and-drop
    if (window.location.pathname.startsWith('/builder')) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    lenis = new Lenis({
      autoRaf: false,
      lerp: prefersReducedMotion ? 1 : 0.085,
      smoothWheel: !prefersReducedMotion,
      syncTouch: !prefersReducedMotion,
      syncTouchLerp: 0.075,
      touchMultiplier: 1.0,
      wheelMultiplier: 1.0,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
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

    // Pastikan dimensi Lenis otomatis tersinkronisasi saat GSAP refresh
    onRefresh = () => {
      lenis?.resize();
    };
    ScrollTrigger.addEventListener('refresh', onRefresh);

    // Navigasi anchor halus untuk tautan navbar & footer
    handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          lenis?.scrollTo(el as HTMLElement, {
            offset: -80,
            duration: prefersReducedMotion ? 0 : 1.2,
          });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);
  });

  onDestroy(() => {
    if (handleAnchorClick) {
      document.removeEventListener('click', handleAnchorClick);
    }
    if (onRefresh) {
      ScrollTrigger.removeEventListener('refresh', onRefresh);
    }
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
