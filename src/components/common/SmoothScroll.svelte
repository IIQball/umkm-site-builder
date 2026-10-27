<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type Lenis from 'lenis';
  import type { gsap } from 'gsap';
  import type { ScrollTrigger } from 'gsap/ScrollTrigger';
  import 'lenis/dist/lenis.css';

  type GSAPType = typeof gsap;
  type ScrollTriggerType = typeof ScrollTrigger;

  let lenis: Lenis | null = null;
  let gsapInstance: GSAPType | null = null;
  let ScrollTriggerInstance: ScrollTriggerType | null = null;
  let tickerFn: ((time: number) => void) | null = null;
  let onRefresh: (() => void) | null = null;
  let handleAnchorClick: ((e: MouseEvent) => void) | null = null;

  onMount(async () => {
    // Hindari menjalankan di builder canvas editor dan pada perangkat touch/mobile
    const isTouchOrMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
    if (window.location.pathname.startsWith('/builder') || isTouchOrMobile) {
      return;
    }

    const [{ default: LenisClass }, gsapMod, stMod] = await Promise.all([
      import('lenis'),
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]);

    const gsap = gsapMod.gsap || gsapMod.default || gsapMod;
    const ScrollTrigger = stMod.ScrollTrigger || stMod.default || stMod;
    gsapInstance = gsap;
    ScrollTriggerInstance = ScrollTrigger;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    lenis = new LenisClass({
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

    (window as Window & { __lenis?: Lenis | null }).__lenis = lenis;

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
    if (onRefresh && ScrollTriggerInstance) {
      ScrollTriggerInstance.removeEventListener('refresh', onRefresh);
    }
    if (tickerFn && gsapInstance) {
      gsapInstance.ticker.remove(tickerFn);
    }
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
    if (typeof window !== 'undefined') {
      delete (window as Window & { __lenis?: Lenis | null }).__lenis;
    }
  });
</script>
