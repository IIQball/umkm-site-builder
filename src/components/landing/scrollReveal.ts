import type { Action } from 'svelte/action';

interface RevealOptions {
  threshold?: number;
  delay?: number;
  scale?: boolean;
}

export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options = {}) => {
  const threshold = options.threshold ?? 0.15;
  const delay = options.delay ?? 0;
  const useScale = options.scale ?? false;

  node.classList.add(useScale ? 'lp-reveal-scale' : 'lp-reveal');

  if (delay > 0) {
    node.style.transitionDelay = `${delay}ms`;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.classList.add('revealed');
          observer.unobserve(node);
        }
      });
    },
    { threshold }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
};
