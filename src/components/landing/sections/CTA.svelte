<script lang="ts">
</script>

<section class="section-pad" id="daftar" style="padding-top:0;">
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

<style>
  .section-pad {
    padding: 110px 0;
  }

  .wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 32px;
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

  @media (max-width: 1024px) {
    .cta {
      padding: 50px 40px;
      gap: 32px;
    }

    .cta-art {
      width: 160px;
    }
  }

  @media (max-width: 768px) {
    .section-pad {
      padding: 60px 0;
    }

    .cta {
      padding: 40px 32px;
      gap: 24px;
    }

    .cta-copy h2 {
      font-size: clamp(20px, 2.4vw, 26px);
    }

    .wrap {
      padding: 0 24px;
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
    .section-pad {
      padding: 48px 0;
    }

    .cta {
      padding: 32px 20px;
      gap: 16px;
    }

    .cta-copy h2 {
      font-size: clamp(18px, 4vw, 22px);
    }

    .cta-copy p {
      font-size: 13.5px;
    }

    .cta-art {
      width: 120px;
    }

    .wrap {
      padding: 0 16px;
    }
  }
</style>
