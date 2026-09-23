<script lang="ts">
  export let isDark: boolean;
  export let heroWrap: HTMLElement;
  export let heroWelcome: HTMLElement;
  export let mapVisual: HTMLElement;
  export let mapJatim: HTMLImageElement;
  export let mapBwi: HTMLImageElement;
  export let welcomeLead: HTMLElement;
  export let pinokaSrc: HTMLElement;
  export let pinokaFlip: HTMLElement;
  export let heroFinal: HTMLElement;
  export let scrollHint: HTMLElement;
</script>

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
        src={isDark ? "/assets/Map Jawa Timur Malam.png" : "/assets/Map Jawa Timur.png"}
        alt="Peta Jawa Timur"
      />

      <img
        bind:this={mapBwi}
        id="mapBwi"
        src={isDark ? "/assets/Map Banyuwangi Malam.png" : "/assets/Map Banyuwangi.png"}
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

<style>
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
    top: 50%;
    left: 50%;
    width: min(72vw, 960px);
    aspect-ratio: 1 / 1;
    z-index: 2;
    will-change: transform;
  }

  .map-visual img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;

    transform: translate(-50%, -50%);

    filter: drop-shadow(0 20px 5px rgba(0, 0, 0, 0.5));

    will-change: transform, opacity;
  }

  :global(#mapBwi) {
    opacity: 0;
  }

  :global(#mapJatim) {
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

  :global(#welcomeLead),
  :global(.w-pinoka) {
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

  @media (max-width: 1024px) {
    .map-visual {
      width: min(80vw, 800px);
    }

    .hero-final {
      width: min(42vw, 400px);
      left: 5%;
    }

    .hero-final h1 {
      font-size: clamp(28px, 3.2vw, 40px);
    }
  }

  @media (max-width: 768px) {
    .map-visual {
      width: min(85vw, 700px);
    }

    .hero-final {
      width: min(50vw, 360px);
      left: 3%;
    }

    .hero-final h1 {
      font-size: clamp(26px, 2.8vw, 36px);
    }

    .hero-final p {
      font-size: 14.5px;
    }
  }

  @media (max-width: 520px) {
    .map-visual {
      width: min(90vw, 600px);
    }

    .hero-final {
      width: 90%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .hero-final h1 {
      font-size: clamp(24px, 5vw, 32px);
    }

    .hero-final p {
      font-size: 14px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-actions {
      flex-direction: column;
      width: 100%;
    }

    .hero-actions .btn {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 860px) {
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

    :global(#mapJatim) {
      display: none;
    }

    :global(#mapBwi) {
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

  @media (prefers-reduced-motion: reduce) {
    .scroll-hint .chevron {
      animation: none;
    }
  }
</style>
