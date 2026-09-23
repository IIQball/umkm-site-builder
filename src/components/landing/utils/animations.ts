import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function getResponsiveMapValues() {
  const vw = window.innerWidth;
  
  if (vw < 768) {
    return {
      initialXPercent: -48,
      initialYPercent: 20,
      initialScale: 1.6,
      scaleToMap: 2.9,
      mapVisualX: 'clamp(-20vw, 25vw, 30vw)'
    };
  } else if (vw < 1024) {
    return {
      initialXPercent: -44,
      initialYPercent: 15,
      initialScale: 1.4,
      scaleToMap: 2.8,
      mapVisualX: 'clamp(-15vw, 28vw, 30vw)'
    };
  }
  
    return {
    initialXPercent: -40,
    initialYPercent: -40,
    initialScale: 1.3,
    scaleToMap: 2.7,
    mapVisualX: '30vw'
  };
}

export function setupHeroAnimations(
  nav: HTMLElement,
  heroWrap: HTMLElement,
  mapVisual: HTMLElement,
  mapJatim: HTMLImageElement,
  mapBwi: HTMLImageElement,
  heroWelcome: HTMLElement,
  welcomeLead: HTMLElement,
  pinokaSrc: HTMLElement,
  pinokaFlip: HTMLElement,
  navBrandText: HTMLElement,
  heroFinal: HTMLElement,
  scrollHint: HTMLElement,
  themeToggleBtn: HTMLElement
) {
  gsap.set(nav, {
    autoAlpha: 0,
    pointerEvents: 'none'
  });

  gsap.set(themeToggleBtn, {
    opacity: 0,
    scale: 0.8
  });

  gsap.set(mapVisual, {
    opacity: 0,
    y: 70,
    xPercent: -50,
    yPercent: -50,
    scale: 1
  });

  gsap.set(heroWelcome, {
    opacity: 0,
    yPercent: -180
  });

  const mapVals = getResponsiveMapValues();
  
  gsap.set(mapJatim, {
    opacity: 1,
    xPercent: mapVals.initialXPercent,
    yPercent: mapVals.initialYPercent,
    scale: mapVals.initialScale,
    transformOrigin: '94% 80%'
  });

  gsap.set(mapBwi, {
    opacity: 0,
    xPercent: -50,
    yPercent: -50,
    scale: 1.7
  });

  gsap.set(heroFinal, {
    opacity: 0
  });

  gsap.set(pinokaSrc, {
    opacity: 1
  });

  gsap.set(pinokaFlip, {
    opacity: 0
  });

  gsap.set(navBrandText, {
    opacity: 0
  });

  gsap.set(scrollHint, {
    opacity: 1
  });

  const intro = gsap.timeline();

  intro
    .to(mapVisual, {
      opacity: 1,
      y: 0,
      duration: 0.62,
      ease: 'power3.out'
    })
    .to(
      heroWelcome,
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out'
      },
      '-=0.46'
    )
    .to(
      themeToggleBtn,
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.4)'
      },
      '-=0.4'
    );

  const heroTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: heroWrap,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      pin: false
    }
  });

  heroTimeline
    .to(
      mapJatim,
      {
        scale: mapVals.scaleToMap,
        duration: 0.24,
        ease: 'none'
      },
      0
    )
    .to(
      pinokaSrc,
      {
        opacity: 0,
        duration: 0.08,
        ease: 'none'
      },
      0
    )
    .to(
      welcomeLead,
      {
        opacity: 0,
        duration: 0.08,
        ease: 'none'
      },
      0
    )
    .to(
      mapBwi,
      {
        opacity: 1,
        duration: 0.35,
        ease: 'none'
      },
      0.132
    )
    .to(
      mapBwi,
      {
        scale: 0.65,
        duration: 0.42,
        ease: 'none'
      },
      0.132
    )
    .to(
      mapJatim,
      {
        opacity: 0,
        duration: 0.1,
        ease: 'power1.out'
      },
      0.24
    )
    .to(
      welcomeLead,
      {
        opacity: 1,
        duration: 0.105,
        ease: 'none'
      },
      0.34
    )
    .to(
      welcomeLead,
      {
        opacity: 0,
        duration: 0.1,
        ease: 'none'
      },
      0.42
    )
    .to(
      mapVisual,
      {
        x: mapVals.mapVisualX,
        scale: 1.12,
        duration: 0.2,
        ease: 'none'
      },
      0.42
    )
    .to(
      heroFinal,
      {
        opacity: 1,
        duration: 0.2,
        ease: 'none'
      },
      0.54
    )
    .to(
      nav,
      {
        autoAlpha: 1,
        pointerEvents: 'auto',
        duration: 0.4,
        ease: 'none'
      },
      0.48
    )
    .to(
      themeToggleBtn,
      {
        right: window.innerWidth < 768 ? '1rem' : window.innerWidth < 1024 ? '10rem' : '17.5rem',
        top: '1.375rem',
        duration: 0.2,
        ease: 'power2.out'
      },
      0.48
    )
    .to(
      scrollHint,
      {
        opacity: 0,
        duration: 0.28,
        ease: 'none'
      },
      0
    );

  ScrollTrigger.create({
    trigger: heroWrap,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      if (progress > 0.42 && progress < 0.72) {
        const t = gsap.utils.clamp(
          0,
          1,
          (progress - 0.42) / 0.30
        );

        const sourceRect = pinokaSrc.getBoundingClientRect();
        const destinationRect = navBrandText.getBoundingClientRect();

        const sourceSize = parseFloat(
          window.getComputedStyle(pinokaSrc).fontSize
        );

        const destinationSize = parseFloat(
          window.getComputedStyle(navBrandText).fontSize
        );

        const x = gsap.utils.interpolate(
          0,
          destinationRect.left - sourceRect.left,
          t
        );

        const y = gsap.utils.interpolate(
          0,
          destinationRect.top - sourceRect.top,
          t
        );

        const scale = gsap.utils.interpolate(
          1,
          destinationSize / sourceSize,
          t
        );

        gsap.set(pinokaFlip, {
          left: sourceRect.left,
          top: sourceRect.top,
          fontSize: sourceSize,
          x,
          y,
          scale,
          opacity: 1
        });
      } else {
        gsap.set(pinokaFlip, {
          opacity: 0
        });
      }

      gsap.set(navBrandText, {
        opacity: progress >= 0.72 ? 1 : 0
      });

      if (progress > 0.9) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  });
}

export function setupScrollRevealAnimations() {
  gsap.utils
    .toArray<HTMLElement>('.gsap-reveal')
    .forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 45
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            end: 'top 60%',
            scrub: 1
          }
        }
      );
    });

  gsap.utils
    .toArray<HTMLElement>('.umkm-card')
    .forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 35,
          rotateX: 8
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            end: 'top 68%',
            scrub: 1
          },
          delay: (index % 3) * 0.04
        }
      );
    });

  gsap.utils
    .toArray<HTMLElement>('.builder-step')
    .forEach((step, index) => {
      gsap.fromTo(
        step,
        {
          opacity: 0,
          x: -30
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 88%',
            end: 'top 68%',
            scrub: 1
          },
          delay: index * 0.06
        }
      );
    });

  gsap.utils
    .toArray<HTMLElement>('.cat-card')
    .forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 35,
          rotateX: 8
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            end: 'top 68%',
            scrub: 1
          },
          delay: index * 0.04
        }
      );
    });

  gsap.utils
    .toArray<HTMLElement>('.feat-card')
    .forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          x: 55
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'left 95%',
            end: 'left 70%',
            scrub: 1
          },
          delay: index * 0.05
        }
      );
    });

  gsap.utils
    .toArray<HTMLElement>('.step')
    .forEach((step, index) => {
      gsap.fromTo(
        step,
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
            trigger: step,
            start: 'top 85%',
            end: 'top 65%',
            scrub: 1
          },
          delay: index * 0.06
        }
      );
    });

  gsap.fromTo(
    '.testi',
    {
      opacity: 0,
      scale: 0.96,
      y: 35
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.testi',
        start: 'top 85%',
        end: 'top 60%',
        scrub: 1
      }
    }
  );

  gsap.fromTo(
    '.cta',
    {
      opacity: 0,
      y: 45,
      scale: 0.97
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cta',
        start: 'top 85%',
        end: 'top 60%',
        scrub: 1
      }
    }
  );
}

export function setupAboutScrollAnimation(
  aboutSection: HTMLElement,
  aboutArtEl: HTMLElement,
  aboutVideo: HTMLVideoElement | undefined,
  eyebrowEl: HTMLElement | undefined,
  eyebrowCursorEl: HTMLElement | undefined,
  h2El: HTMLElement | undefined,
  h2CursorEl: HTMLElement | undefined,
  fadeContentEl: HTMLElement | undefined,
  fullEyebrow: string,
  fullH2: string
) {
  if (!aboutSection) return;

  if (aboutVideo) {
    aboutVideo.pause();
    try {
      aboutVideo.currentTime = 0;
    } catch {
      // ignore error
    }
  }

  gsap.set(aboutArtEl, { opacity: 0, scale: 0.94 });
  if (eyebrowEl) eyebrowEl.textContent = '';
  if (h2El) h2El.textContent = '';
  if (eyebrowCursorEl) eyebrowCursorEl.classList.remove('active');
  if (h2CursorEl) h2CursorEl.classList.remove('active');
  if (fadeContentEl) gsap.set(fadeContentEl, { opacity: 0, y: 20 });

  let fadeTriggered = false;

  ScrollTrigger.create({
    trigger: aboutSection,
    start: 'top 10%',
    end: '+=400',
    pin: true,
    scrub: 0.2,
    onUpdate: (self) => {
      const p = self.progress;

      if (aboutArtEl) {
        const artOpacity = Math.min(p / 0.35, 1);
        const artScale = 0.94 + 0.06 * Math.min(p / 0.35, 1);
        gsap.set(aboutArtEl, { opacity: artOpacity, scale: artScale });
      }

      if (aboutVideo) {
        const dur =
          aboutVideo.duration &&
          !isNaN(aboutVideo.duration) &&
          aboutVideo.duration > 0
            ? aboutVideo.duration
            : 7.0;
        const maxTime = dur * 0.5;
        aboutVideo.currentTime = Math.min(p * maxTime, maxTime);
      }

      const eyebrowLen = fullEyebrow.length;
      const h2Len = fullH2.length;

      if (p <= 0.2) {
        const count = Math.floor((p / 0.2) * eyebrowLen);
        if (eyebrowEl) eyebrowEl.textContent = fullEyebrow.slice(0, count);
        if (h2El) h2El.textContent = '';
        if (eyebrowCursorEl) eyebrowCursorEl.classList.add('active');
        if (h2CursorEl) h2CursorEl.classList.remove('active');
      } else {
        if (eyebrowEl) eyebrowEl.textContent = fullEyebrow;
        if (eyebrowCursorEl) eyebrowCursorEl.classList.remove('active');

        const h2Progress = Math.min((p - 0.2) / 0.8, 1);
        const count = Math.floor(h2Progress * h2Len);
        if (h2El) h2El.textContent = fullH2.slice(0, count);

        if (p < 0.98) {
          if (h2CursorEl) h2CursorEl.classList.add('active');
        } else {
          if (h2CursorEl) h2CursorEl.classList.remove('active');
        }
      }

      if (fadeContentEl) {
        if (p >= 0.95) {
          if (!fadeTriggered) {
            fadeTriggered = true;
            gsap.to(fadeContentEl, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        } else {
          if (fadeTriggered) {
            fadeTriggered = false;
            gsap.to(fadeContentEl, {
              opacity: 0,
              y: 20,
              duration: 0.3,
              ease: 'power2.in',
              overwrite: 'auto'
            });
          }
        }
      }
    }
  });
}
