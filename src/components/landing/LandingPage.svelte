<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  import {
    MapPin,
    Star
  } from 'lucide-svelte';

  gsap.registerPlugin(ScrollTrigger);

  const categories = [
    {
      name: 'Kuliner',
      desc: 'Warung, kafe, camilan khas',
      count: '210 UMKM',
      color1: '#ff7a54',
      color2: '#ff9a6b'
    },
    {
      name: 'Fashion',
      desc: 'Batik, konveksi, aksesori',
      count: '96 UMKM',
      color1: '#8b6bff',
      color2: '#b39dff'
    },
    {
      name: 'Kerajinan',
      desc: 'Anyaman, kayu, gerabah',
      count: '78 UMKM',
      color1: '#ffb45c',
      color2: '#ffd28a'
    },
    {
      name: 'Jasa',
      desc: 'Servis, laundry, salon',
      count: '142 UMKM',
      color1: '#33c9ab',
      color2: '#7fe3cd'
    },
    {
      name: 'Pertanian',
      desc: 'Hasil kebun, kopi, madu',
      count: '64 UMKM',
      color1: '#7cc24a',
      color2: '#a7dd7c'
    },
    {
      name: 'Wisata',
      desc: 'Homestay, sewa alat, tur',
      count: '50 UMKM',
      color1: '#ff6b95',
      color2: '#ff9ab6'
    }
  ];

  const featured = [
    {
      name: 'Kopi Osing',
      loc: 'Kecamatan Giri',
      tag: 'Kuliner',
      rate: '4.9'
    },
    {
      name: 'Batik Sembulungan',
      loc: 'Kecamatan Kalipuro',
      tag: 'Fashion',
      rate: '4.8'
    },
    {
      name: 'Anyaman Bambu Krajan',
      loc: 'Kecamatan Glagah',
      tag: 'Kerajinan',
      rate: '4.7'
    },
    {
      name: 'Rumah Madu Ijen',
      loc: 'Kecamatan Licin',
      tag: 'Pertanian',
      rate: '5.0'
    },
    {
      name: 'Homestay Sukamade',
      loc: 'Kecamatan Pesanggaran',
      tag: 'Wisata',
      rate: '4.8'
    }
  ];

  const steps = [
    {
      n: '01',
      t: 'Daftar usahamu',
      d: 'Isi nama, kategori, dan lokasi UMKM lewat formulir singkat.'
    },
    {
      n: '02',
      t: 'Verifikasi tim',
      d: 'Tim Pinoka meninjau data dan menghubungimu dalam 2x24 jam.'
    },
    {
      n: '03',
      t: 'Tampil di peta',
      d: 'Etalase digitalmu aktif dan bisa ditemukan lewat pencarian.'
    },
    {
      n: '04',
      t: 'Ditemukan pembeli',
      d: 'Warga dan wisatawan menemukan usahamu berdasarkan lokasi.'
    }
  ];

  let nav: HTMLElement;
  let heroWrap: HTMLElement;
  let mapVisual: HTMLElement;
  let mapJatim: HTMLImageElement;
  let mapBwi: HTMLImageElement;
  let heroWelcome: HTMLElement;
  let welcomeLead: HTMLElement;
  let pinokaSrc: HTMLElement;
  let pinokaFlip: HTMLElement;
  let navBrandText: HTMLElement;
  let heroFinal: HTMLElement;
  let scrollHint: HTMLElement;

  let aboutSection: HTMLElement;
  let aboutArtEl: HTMLElement;
  let aboutVideo: HTMLVideoElement;
  let eyebrowEl: HTMLElement;
  let eyebrowCursorEl: HTMLElement;
  let h2El: HTMLElement;
  let h2CursorEl: HTMLElement;
  let fadeContentEl: HTMLElement;

  const fullEyebrow = 'Kenapa Pinoka';
  const fullH2 = 'Setiap etalase kecil punya cerita yang layak ditemukan';

  onMount(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 861px)', () => {
        gsap.set(nav, {
          autoAlpha: 0,
          pointerEvents: 'none'
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

        gsap.set(mapJatim, {
          opacity: 1,
          xPercent: -40,
          yPercent: 10,
          scale: 1.3,
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
          // Zone 1: Jawa Timur
          .to(
            mapJatim,
            {
              scale: 2.7,
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

          // Jawa Timur → Banyuwangi
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

          // Welcome text muncul kembali
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

          // Map bergeser ke kanan
          .to(
            mapVisual,
            {
              x: '30vw',
              scale: 1.12,
              duration: 0.2,
              ease: 'none'
            },
            0.42
          )

          // Hero final
          .to(
            heroFinal,
            {
              opacity: 1,
              duration: 0.2,
              ease: 'none'
            },
            0.54
          )

          // Navbar
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

          // Scroll hint hilang
          .to(
            scrollHint,
            {
              opacity: 0,
              duration: 0.28,
              ease: 'none'
            },
            0
          );

        // PINOKA terbang ke navbar
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
              const destinationRect =
                navBrandText.getBoundingClientRect();

              const sourceSize =
                parseFloat(
                  window.getComputedStyle(pinokaSrc).fontSize
                );

              const destinationSize =
                parseFloat(
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
      });

      mm.add('(max-width: 860px)', () => {
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

      function setupAboutScroll() {
        if (!aboutSection) return;

        if (aboutVideo) {
          aboutVideo.pause();
          try {
            aboutVideo.currentTime = 0;
          } catch (e) {}
        }

        gsap.set(aboutArtEl, { opacity: 0, scale: 0.94 });
        if (eyebrowEl) eyebrowEl.textContent = '';
        if (h2El) h2El.textContent = '';
        if (eyebrowCursorEl) eyebrowCursorEl.classList.remove('active');
        if (h2CursorEl) h2CursorEl.classList.remove('active');
        gsap.set(fadeContentEl, { opacity: 0, y: 20 });

        let fadeTriggered = false;

        ScrollTrigger.create({
          trigger: aboutSection,
          start: 'top 10%',
          end: '+=400',
          pin: true,
          scrub: 0.2,
          onUpdate: (self) => {
            const p = self.progress;

            // 1. Asset animation: Fade in slowly + video currentTime scrub up to middle (50% duration)
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
              const maxTime = dur * 0.5; // stop at middle of animation (building done)
              aboutVideo.currentTime = Math.min(p * maxTime, maxTime);
            }

            // 2. Typewriter: Eyebrow first (0.0 to 0.2), H2 second (0.2 to 1.0)
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

            // 3. Fade in paragraph & stats after typing & building complete (p >= 0.95)
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

      setupAboutScroll();

      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
    };
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
</svelte:head>

<nav bind:this={nav} class="nav" id="nav">
  <div class="brand" id="navBrand">
    <span class="dot"></span>
    <span bind:this={navBrandText} id="navBrandText">Pinoka</span>
  </div>

  <ul class="nav-links">
    <li>
      <a href="#home" class="active">Home</a>
    </li>
    <li>
      <a href="#kategori">Kategori</a>
    </li>
    <li>
      <a href="/umkm">UMKM</a>
    </li>
    <li>
      <a href="#cara">Cara Kerja</a>
    </li>
  </ul>

  <div class="nav-actions">
    <a href="/login" class="btn btn-ghost">Masuk</a>
    <a href="/register" class="btn btn-solid">Daftar UMKM</a>
  </div>
</nav>

<span bind:this={pinokaFlip} class="pinoka-flip" id="pinokaFlip">
  PINOKA
</span>

<section bind:this={heroWrap} class="hero-pin-wrap" id="home">
  <div class="hero-sticky">
    <div bind:this={heroWelcome} class="hero-welcome" id="heroWelcome">
      <h1>
        <span bind:this={welcomeLead} id="welcomeLead">
          Selamat Datang di
        </span>
        <span class="w-pinoka" bind:this={pinokaSrc} id="pinokaSrc">
          PINOKA
        </span>
      </h1>
    </div>

    <div bind:this={mapVisual} class="map-visual" id="mapVisual">
      <img
        bind:this={mapJatim}
        id="mapJatim"
        src="/assets/Map Jawa Timur.png"
        alt="Peta Jawa Timur"
      />

      <img
        bind:this={mapBwi}
        id="mapBwi"
        src="/assets/Map Banyuwangi.png"
        alt="Peta Kabupaten Banyuwangi"
      />
    </div>

    <div bind:this={heroFinal} class="hero-final">
      <span class="hero-eyebrow">
        Direktori UMKM Digital
      </span>

      <h1>
        Temukan UMKM<br />
        di Seluruh<br />
        Banyuwangi
      </h1>

      <p>
        Jelajahi ratusan usaha lokal, dari kuliner sampai kerajinan,
        dan temukan cerita di balik setiap etalase kecil di Banyuwangi.
      </p>

      <div class="hero-actions">
        <a href="/umkm" class="btn btn-solid btn-lg">
          Jelajahi
        </a>

        <a href="/register" class="btn btn-ghost btn-lg">
          Daftarkan Usaha
        </a>
      </div>
    </div>

    <div bind:this={scrollHint} class="scroll-hint">
      <span>Scroll ke bawah</span>
      <span class="chevron"></span>
    </div>
  </div>
</section>

<section class="about" bind:this={aboutSection}>
  <div class="wrap about-grid">
    <div class="about-art" bind:this={aboutArtEl}>
      <video
        bind:this={aboutVideo}
        src="/assets/building-bundle.webm"
        muted
        playsinline
        preload="auto"
        onloadedmetadata={() => {
          if (aboutVideo) {
            aboutVideo.pause();
            aboutVideo.currentTime = 0;
          }
        }}
        oncanplay={() => {
          if (aboutVideo) {
            aboutVideo.pause();
          }
        }}
        class="about-video"
      ></video>
    </div>

    <div class="about-copy">
      <span class="eyebrow">
        <span bind:this={eyebrowEl}>Kenapa Pinoka</span><span class="type-cursor" bind:this={eyebrowCursorEl}>|</span>
      </span>

      <h2>
        <span bind:this={h2El}>Setiap etalase kecil punya cerita yang layak ditemukan</span><span class="type-cursor" bind:this={h2CursorEl}>|</span>
      </h2>

      <div class="about-fade-content" bind:this={fadeContentEl}>
        <p>
          Pinoka menghubungkan warga dan wisatawan langsung dengan
          pelaku UMKM di setiap kecamatan Banyuwangi. Cari berdasarkan
          lokasi, kategori, atau produk, lalu kunjungi tokonya langsung
          dari peta digital kami.
        </p>

        <div class="about-stats">
          <div>
            <strong>640+</strong>
            <span>UMKM terdaftar</span>
          </div>

          <div>
            <strong>24</strong>
            <span>Kecamatan</span>
          </div>

          <div>
            <strong>12rb</strong>
            <span>Kunjungan / bulan</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section-pad" id="kategori">
  <div class="wrap">
    <div class="section-head gsap-reveal">
      <span class="eyebrow">Kategori</span>

      <h2>Cari sesuai yang kamu butuhkan</h2>

      <p>
        Enam kategori utama menampung sebagian besar UMKM di
        Banyuwangi, dari dapur rumahan sampai bengkel kerajinan.
      </p>
    </div>

    <div class="cat-grid" id="catGrid">
      {#each categories as category}
        <div
          class="cat-card"
          style={`--cat-color-1:${category.color1};--cat-color-2:${category.color2};`}
        >
          <div
            class="cat-icon"
            style={`background:linear-gradient(150deg,${category.color1},${category.color2})`}
          >
            <div class="cube">
              <i
                style="background:rgba(255,255,255,.35);transform:translate(-4px,-4px);"
              ></i>

              <i
                style="background:rgba(0,0,0,.12);"
              ></i>
            </div>
          </div>

          <h3>{category.name}</h3>

          <p>{category.desc}</p>

          <span class="count">
            {category.count}
          </span>
        </div>
      {/each}
    </div>
  </div>
</section>

<section
  class="section-pad"
  id="umkm"
  style="padding-top:0;"
>
  <div class="wrap">
    <div class="section-head gsap-reveal">
      <span class="eyebrow">Pilihan Minggu Ini</span>

      <h2>UMKM yang sedang naik daun</h2>

      <p>
        Kurasi singkat dari tim Pinoka, diperbarui tiap minggu
        berdasarkan aktivitas dan ulasan pengunjung.
      </p>
    </div>

    <div class="feat-strip" id="featStrip">
      {#each featured as item, index}
        <div class="feat-card">
          <div class="feat-thumb">
            <span class="feat-badge">
              {item.tag}
            </span>

            <img
              src={
                index % 2 === 0
                  ? '/assets/cute building.png'
                  : '/assets/Avatar Kucing.png'
              }
              alt={item.name}
            />
          </div>

          <div class="feat-body">
            <h3>{item.name}</h3>

            <span class="loc">
              <MapPin size={13} />
              {item.loc}
            </span>

            <span class="rate">
              <b>
                <Star size={13} fill="currentColor" />
                {item.rate}
              </b>
              · terverifikasi
            </span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<section class="section-pad" id="cara">
  <div class="wrap">
    <div class="section-head gsap-reveal">
      <span class="eyebrow">Cara Kerja</span>

      <h2>Dari daftar sampai ditemukan pembeli</h2>

      <p>
        Empat langkah sederhana untuk membawa usahamu ke peta
        digital Banyuwangi.
      </p>
    </div>

    <div class="steps" id="stepsGrid">
      {#each steps as step}
        <div class="step">
          <span class="num">{step.n}</span>

          <h3>{step.t}</h3>

          <p>{step.d}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<section class="section-pad">
  <div class="wrap">
    <div class="testi">
      <div class="testi-art">
        <img
          src="/assets/Avatar Kucing.png"
          alt="Maskot Pinoka"
        />
      </div>

      <div class="testi-quote">
        <p>
          Sejak terdaftar di Pinoka, warung kopi kami mulai
          kedatangan pengunjung dari luar kota yang sebelumnya
          nggak tahu kami ada.
        </p>

        <div class="testi-who">
          <div class="testi-avatar">RS</div>

          <div>
            <strong>Retno Sulistya</strong>

            <span>
              Pemilik Kopi Osing, Kecamatan Giri
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section
  class="section-pad"
  id="daftar"
  style="padding-top:0;"
>
  <div class="wrap">
    <div class="cta">
      <div class="cta-copy">
        <h2>
          Punya usaha di Banyuwangi? Tampil di Pinoka.
        </h2>

        <p>
          Pendaftaran gratis dan hanya butuh lima menit. Tim kami
          membantu verifikasi dan menata etalase digitalmu.
        </p>

        <a href="/register" class="btn btn-solid btn-lg">
          Daftarkan UMKM
        </a>
      </div>

      <div class="cta-art">
        <img
          src="/assets/Avatar Kucing.png"
          alt="Maskot Pinoka"
        />
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">
    <div class="foot-top">
      <div class="foot-brand">
        <div class="brand">
          <span class="dot"></span>
          Pinoka
        </div>

        <p>
          Direktori UMKM digital untuk Kabupaten Banyuwangi.
          Dibuat agar usaha kecil lebih mudah ditemukan.
        </p>
      </div>

      <div class="foot-cols">
        <div class="foot-col">
          <h4>Jelajah</h4>

          <a href="#kategori">Kategori</a>
          <a href="/umkm">UMKM Pilihan</a>
          <a href="#cara">Cara Kerja</a>
        </div>

        <div class="foot-col">
          <h4>Untuk Pemilik Usaha</h4>

          <a href="/register">Daftarkan Usaha</a>
          <a href="/login">Masuk Akun</a>
          <a href="#">Pusat Bantuan</a>
        </div>

        <div class="foot-col">
          <h4>Ikuti Kami</h4>

          <a href="#">Instagram</a>
          <a href="#">TikTok</a>
          <a href="#">WhatsApp</a>
        </div>
      </div>
    </div>

    <div class="foot-bottom">
      <span>
        © 2026 Pinoka. Dibuat untuk UMKM Banyuwangi.
      </span>

      <span>
        Kabupaten Banyuwangi, Jawa Timur
      </span>
    </div>
  </div>
</footer>

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

  .wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 32px;
  }

  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 500;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 22px 40px;

    transition:
      background 0.35s ease,
      padding 0.35s ease,
      box-shadow 0.35s ease,
      border-color 0.35s ease;

    border-bottom: 1px solid transparent;
    opacity: 0;
    pointer-events: none;
  }

  .nav.scrolled {
    background: rgba(18, 14, 28, 0.82);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    padding: 14px 40px;
    border-bottom: 1px solid var(--line);
  }

  .brand {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 22px;
    letter-spacing: 0.5px;

    background: linear-gradient(
      120deg,
      #c8b6ff,
      #8b6bff 55%,
      #ff9a6b
    );

    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;

    display: flex;
    align-items: center;
    gap: 8px;
  }

  .brand .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--coral);
    box-shadow: 0 0 10px var(--coral);
  }

  .nav-links {
    display: flex;
    gap: 34px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-links a {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-1);
    transition: color 0.2s ease;
    position: relative;
    padding-bottom: 4px;
  }

  .nav-links a.active {
    color: var(--ink-0);
  }

  .nav-links a.active::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(
      90deg,
      var(--violet-1),
      var(--coral)
    );
  }

  .nav-links a:hover {
    color: var(--ink-0);
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .btn {
    font-size: 13px;
    font-weight: 700;
    padding: 11px 22px;
    border-radius: 100px;
    border: 1px solid transparent;

    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .btn-ghost {
    border-color: rgba(255, 255, 255, 0.18);
    color: var(--ink-0);
    background: transparent;
  }

  .btn-ghost:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .btn-solid {
    background: linear-gradient(
      120deg,
      var(--violet-1),
      var(--violet-2)
    );
    color: #fff;
    box-shadow: 0 8px 24px -8px rgba(91, 61, 240, 0.7);
  }

  .btn-solid:hover {
    filter: brightness(1.08);
  }

  .btn-lg {
    padding: 15px 30px;
    font-size: 14.5px;
  }

  .hero-pin-wrap {
    height: 400vh;
    position: relative;
  }

  .hero-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    background: var(--bg-0);
  }

  .map-visual {
    position: absolute;
    top: 53%;
    left: 50%;
    width: min(72vw, 960px);
    z-index: 2;
    will-change: transform;
  }

  .map-visual img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;

    transform: translate(-50%, -50%);

    filter: drop-shadow(0 30px 50px rgba(0, 0, 0, 0.5));

    will-change: transform, opacity;
  }

  #mapBwi {
    opacity: 0;
  }

  #mapJatim {
    transform-origin: 94% 80%;
  }

  .hero-welcome {
    position: absolute;
    top: 24%;
    left: 50%;

    transform: translate(-50%, -50%);

    z-index: 4;

    text-align: center;
    width: 100%;
    padding: 0 24px;
  }

  .hero-welcome h1 {
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--ink-0);
    font-size: clamp(22px, 3.1vw, 34px);
    line-height: 1.3;
  }

  #welcomeLead,
  .w-pinoka {
    display: inline-block;
  }

  .hero-final {
    position: absolute;
    top: 50%;
    left: 7%;

    width: min(38vw, 460px);

    transform: translate(0, -50%);

    text-align: left;
    z-index: 5;

    opacity: 0;
    pointer-events: none;
  }

  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: 0.08em;

    color: var(--amber);
    text-transform: uppercase;

    margin-bottom: 16px;
  }

  .hero-eyebrow::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--amber);
  }

  .hero-final h1 {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(30px, 3.6vw, 46px);
    line-height: 1.12;
    color: var(--ink-0);
    margin: 0 0 18px;
  }

  .hero-final p {
    font-size: 15.5px;
    color: var(--ink-1);
    max-width: 38ch;
    margin: 0 0 26px;
  }

  .hero-actions {
    display: flex;
    gap: 12px;
  }

  .pinoka-flip {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 900;

    font-family: var(--font-display);
    font-weight: 700;
    color: var(--ink-0);

    white-space: nowrap;
    pointer-events: none;
    opacity: 0;

    transform-origin: top left;
  }

  .scroll-hint {
    position: absolute;
    left: 50%;
    bottom: 42px;

    transform: translateX(-50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    font-size: 12.5px;
    color: var(--ink-2);
    letter-spacing: 0.05em;

    z-index: 3;
  }

  .scroll-hint .chevron {
    width: 16px;
    height: 16px;

    border-right: 2px solid var(--ink-2);
    border-bottom: 2px solid var(--ink-2);

    transform: rotate(45deg);

    animation: bob 1.6s ease-in-out infinite;
  }

  @keyframes bob {
    0%,
    100% {
      transform: translateY(0) rotate(45deg);
    }

    50% {
      transform: translateY(6px) rotate(45deg);
    }
  }

  .eyebrow {
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--coral);
    margin-bottom: 14px;
    display: block;
  }

  .section-head {
    max-width: 640px;
    margin-bottom: 56px;
  }

  .section-head h2 {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(26px, 3vw, 38px);
    color: var(--ink-0);
    line-height: 1.2;
    margin: 0 0 14px;
  }

  .section-head p {
    color: var(--ink-1);
    font-size: 15.5px;
    max-width: 56ch;
  }

  .section-pad {
    padding: 110px 0;
  }

  .about {
    padding: 120px 0 60px;
  }

  .about-grid {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    gap: 64px;
    align-items: center;
  }

  .about-art {
    position: relative;
    aspect-ratio: 1 / 1;
    border-radius: 28px;

    background: linear-gradient(
      160deg,
      #241c38,
      #1a1428
    );

    border: 1px solid var(--line);

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;
  }

  .about-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 24px;
    display: block;
  }

  .about-copy .eyebrow {
    margin-bottom: 16px;
    display: inline-flex;
    align-items: center;
  }

  .about-copy h2 {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(26px, 3vw, 36px);
    margin: 0 0 20px;
    line-height: 1.22;
    min-height: 2.4em;
  }

  .type-cursor {
    display: inline-block;
    color: var(--coral, #ff7a54);
    margin-left: 2px;
    font-weight: 300;
    visibility: hidden;
  }

  :global(.type-cursor.active) {
    visibility: visible;
    animation: blink-cursor 0.6s infinite alternate;
  }

  @keyframes blink-cursor {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.15;
    }
  }

  .about-fade-content {
    will-change: opacity, transform;
  }

  .about-copy p {
    color: var(--ink-1);
    font-size: 15.5px;
    margin: 0 0 28px;
    max-width: 52ch;
  }

  .about-stats {
    display: flex;
    gap: 36px;
    flex-wrap: wrap;
  }

  .about-stats div {
    min-width: 110px;
  }

  .about-stats strong {
    font-family: var(--font-display);
    display: block;
    font-size: 30px;
    color: var(--ink-0);
  }

  .about-stats span {
    font-size: 13px;
    color: var(--ink-2);
  }

  .cat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .cat-card {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);

    padding: 28px 26px;

    display: flex;
    flex-direction: column;
    gap: 16px;

    transform-style: preserve-3d;
    will-change: transform, opacity;
  }

  .cat-icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
  }

  .cat-card h3 {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 18px;
    color: var(--ink-0);
  }

  .cat-card p {
    font-size: 13.8px;
    color: var(--ink-2);
  }

  .cat-card .count {
    margin-top: auto;
    font-size: 12.5px;
    color: var(--ink-1);
    font-weight: 600;
  }

  .cube {
    width: 30px;
    height: 30px;
    position: relative;
    transform-style: preserve-3d;
  }

  .cube i {
    position: absolute;
    inset: 0;
    border-radius: 4px;
  }

  .feat-strip {
    display: flex;
    gap: 22px;
    overflow-x: auto;
    padding-bottom: 10px;
    scrollbar-width: none;
  }

  .feat-strip::-webkit-scrollbar {
    display: none;
  }

  .feat-card {
    flex: 0 0 300px;

    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);

    overflow: hidden;

    display: flex;
    flex-direction: column;

    will-change: transform, opacity;
  }

  .feat-thumb {
    height: 170px;

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;

    background: linear-gradient(
      160deg,
      #2a2140,
      #1c1530
    );
  }

  .feat-thumb img {
    width: 56%;
    filter: drop-shadow(
      0 16px 20px rgba(0, 0, 0, 0.45)
    );
  }

  .feat-badge {
    position: absolute;
    top: 14px;
    left: 14px;

    font-size: 11px;
    font-weight: 700;

    padding: 6px 12px;
    border-radius: 100px;

    background: rgba(255, 180, 92, 0.16);
    color: var(--amber);
    letter-spacing: 0.02em;
  }

  .feat-body {
    padding: 20px 22px 24px;

    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .feat-body h3 {
    font-family: var(--font-display);
    font-size: 17px;
    font-weight: 600;
    color: var(--ink-0);
  }

  .feat-body .loc {
    font-size: 12.8px;
    color: var(--ink-2);

    display: flex;
    align-items: center;
    gap: 6px;
  }

  .feat-body .rate {
    margin-top: 6px;
    font-size: 13px;
    color: var(--ink-1);

    display: flex;
    align-items: center;
    gap: 6px;
  }

  .feat-body .rate b {
    color: var(--amber);

    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;

    counter-reset: step;
  }

  .step {
    position: relative;
    padding-top: 8px;
    will-change: transform, opacity;
  }

  .step .num {
    font-family: var(--font-display);
    font-size: 44px;
    font-weight: 700;

    background: linear-gradient(
      160deg,
      #8b6bff,
      #3a2c66
    );

    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;

    line-height: 1;
    margin-bottom: 18px;
    display: block;
  }

  .step h3 {
    font-size: 16.5px;
    font-weight: 600;
    color: var(--ink-0);
    margin: 0 0 8px;

    font-family: var(--font-display);
  }

  .step p {
    font-size: 13.8px;
    color: var(--ink-2);
  }

  .step:not(:last-child)::after {
    content: '';

    position: absolute;
    top: 26px;
    left: calc(100% - 6px);

    width: calc(100% - 30px);
    height: 1px;

    background: repeating-linear-gradient(
      90deg,
      var(--line) 0 6px,
      transparent 6px 12px
    );

    display: none;
  }

  .testi {
    border-radius: 32px;
    padding: 64px;

    position: relative;
    overflow: hidden;

    background: linear-gradient(
      150deg,
      #241c38,
      #180f2a
    );

    border: 1px solid var(--line);

    display: grid;
    grid-template-columns: 0.7fr 1.3fr;
    gap: 48px;
    align-items: center;
  }

  .testi-art {
    display: flex;
    justify-content: center;
  }

  .testi-art img {
    width: 80%;
    filter: drop-shadow(
      0 26px 34px rgba(0, 0, 0, 0.5)
    );
  }

  .testi-quote p {
    font-family: var(--font-display);
    font-size: clamp(19px, 2.1vw, 25px);
    font-weight: 600;
    color: var(--ink-0);
    line-height: 1.5;
    margin: 0 0 26px;
  }

  .testi-who {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .testi-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;

    background: linear-gradient(
      140deg,
      var(--coral),
      var(--amber)
    );

    display: flex;
    align-items: center;
    justify-content: center;

    font-weight: 700;
    font-family: var(--font-display);
    color: #241205;
  }

  .testi-who strong {
    display: block;
    font-size: 14.5px;
    color: var(--ink-0);
  }

  .testi-who span {
    font-size: 12.8px;
    color: var(--ink-2);
  }

  .cta {
    border-radius: 32px;
    padding: 70px 56px;

    position: relative;
    overflow: hidden;

    background: linear-gradient(
      120deg,
      #3a2c78,
      #231a3e 60%
    );

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;

    will-change: transform, opacity;
  }

  .cta::before {
    content: '';
    position: absolute;
    inset: 0;

    background: radial-gradient(
      60% 90% at 90% 10%,
      rgba(255, 122, 84, 0.28),
      transparent 60%
    );
  }

  .cta-copy {
    position: relative;
    z-index: 1;
    max-width: 520px;
  }

  .cta-copy h2 {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(24px, 2.6vw, 32px);
    margin: 0 0 14px;
  }

  .cta-copy p {
    color: var(--ink-1);
    font-size: 15px;
    margin: 0 0 26px;
  }

  .cta-art {
    position: relative;
    z-index: 1;
    width: 190px;
    flex-shrink: 0;
  }

  .cta-art img {
    width: 100%;
    filter: drop-shadow(
      0 20px 26px rgba(0, 0, 0, 0.5)
    );
  }

  footer {
    border-top: 1px solid var(--line);
    padding: 56px 0 34px;
  }

  .foot-top {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    flex-wrap: wrap;
    margin-bottom: 40px;
  }

  .foot-brand p {
    color: var(--ink-2);
    font-size: 13.5px;
    max-width: 280px;
    margin-top: 14px;
  }

  .foot-cols {
    display: flex;
    gap: 56px;
    flex-wrap: wrap;
  }

  .foot-col h4 {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--ink-1);
    margin: 0 0 16px;
  }

  .foot-col a {
    display: block;
    font-size: 13.8px;
    color: var(--ink-2);
    margin-bottom: 10px;
  }

  .foot-col a:hover {
    color: var(--ink-0);
  }

  .foot-bottom {
    border-top: 1px solid var(--line);
    padding-top: 24px;

    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;

    font-size: 12.5px;
    color: var(--ink-2);
  }

  @media (min-width: 900px) {
    .step:not(:last-child)::after {
      display: block;
    }
  }

  @media (max-width: 900px) {
    .about-grid {
      grid-template-columns: 1fr;
    }

    .cat-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .steps {
      grid-template-columns: repeat(2, 1fr);
    }

    .testi {
      grid-template-columns: 1fr;
      padding: 40px 28px;
      text-align: center;
    }

    .testi-who {
      justify-content: center;
    }

    .nav-links {
      display: none;
    }
  }

  @media (max-width: 860px) {
    .nav {
      opacity: 1;
      pointer-events: auto;
    }

    .hero-pin-wrap {
      height: auto;
    }

    .hero-sticky {
      position: relative;
      height: auto;

      padding: 150px 24px 60px;

      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      gap: 36px;

      overflow: visible;
    }

    .hero-welcome {
      display: none;
    }

    .map-visual {
      position: relative;
      top: auto;
      left: auto;

      transform: none !important;

      width: 78%;
      margin: 0 auto;
    }

    #mapJatim {
      display: none;
    }

    #mapBwi {
      opacity: 1 !important;
    }

    .hero-final {
      position: relative;
      top: auto;
      left: auto;

      transform: none !important;

      width: 100%;

      text-align: center;

      opacity: 1 !important;
      pointer-events: auto !important;
    }

    .hero-final p {
      margin-left: auto;
      margin-right: auto;
    }

    .hero-actions {
      justify-content: center;
    }

    .pinoka-flip {
      display: none;
    }

    .scroll-hint {
      display: none;
    }
  }

  @media (max-width: 760px) {
    .cta {
      flex-direction: column;
      text-align: center;
    }

    .cta-art {
      order: -1;
    }
  }

  @media (max-width: 520px) {
    .cat-grid {
      grid-template-columns: 1fr;
    }

    .steps {
      grid-template-columns: 1fr;
    }

    .wrap {
      padding: 0 20px;
    }

    .cta {
      padding: 44px 26px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .scroll-hint .chevron {
      animation: none;
    }
  }
</style>

