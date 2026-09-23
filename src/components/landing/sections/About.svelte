<script lang="ts">
  export let aboutSection: HTMLElement;
  export let aboutArtEl: HTMLElement;
  export let aboutVideo: HTMLVideoElement | undefined;
  export let eyebrowEl: HTMLElement | undefined;
  export let eyebrowCursorEl: HTMLElement | undefined;
  export let h2El: HTMLElement | undefined;
  export let h2CursorEl: HTMLElement | undefined;
  export let fadeContentEl: HTMLElement | undefined;
</script>

<section class="about" bind:this={aboutSection}>
  <div class="wrap about-grid">
    <div class="about-art" bind:this={aboutArtEl}>
      <img
        src="/assets/store1.png"
        alt="Toko UMKM Banyuwangi"
        class="about-image"
      />
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

<style>
  .about {
    padding: 120px 0 60px;
  }

  .wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 32px;
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

  :global(.landing-page.light-theme) .about-art {
    background: linear-gradient(
      160deg,
      #f5f0fb,
      #ede5fc
    );
  }

  :global(.landing-page.dark-theme) .about-art {
    background: linear-gradient(
      160deg,
      #000000,
      #050505
    );
  }

  .about-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 24px;
    display: block;
  }

  .about-image {
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
    color: var(--ink-0);
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

  :global(.landing-page.light-theme) .eyebrow {
    color: #ff6b3d;
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

  @media (max-width: 1024px) {
    .about {
      padding: 80px 0 40px;
    }

    .about-grid {
      gap: 48px;
    }

    .about-stats {
      gap: 28px;
    }

    .about-stats strong {
      font-size: 26px;
    }
  }

  @media (max-width: 768px) {
    .about {
      padding: 60px 0 30px;
    }

    .about-grid {
      gap: 36px;
    }

    .about-copy h2 {
      font-size: clamp(22px, 2.5vw, 30px);
    }

    .about-copy p {
      font-size: 14.5px;
    }

    .about-stats {
      gap: 24px;
    }

    .about-stats strong {
      font-size: 24px;
    }
  }

  @media (max-width: 520px) {
    .about {
      padding: 48px 0 24px;
    }

    .about-grid {
      gap: 24px;
    }

    .about-copy h2 {
      font-size: clamp(20px, 4.5vw, 26px);
      min-height: auto;
    }

    .about-copy p {
      font-size: 14px;
    }

    .about-stats {
      flex-direction: column;
      gap: 20px;
    }

    .about-stats div {
      min-width: 100%;
    }

    .about-stats strong {
      font-size: 22px;
    }
  }
</style>
