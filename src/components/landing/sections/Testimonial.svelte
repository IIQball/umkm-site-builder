<script lang="ts">
</script>

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

<style>
  .section-pad {
    padding: 110px 0;
  }

  .wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 32px;
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

  @media (max-width: 1024px) {
    .section-pad {
      padding: 80px 0;
    }
  }

  @media (max-width: 768px) {
    .section-pad {
      padding: 60px 0;
    }

    .wrap {
      padding: 0 24px;
    }
  }

  @media (max-width: 760px) {
    .testi {
      flex-direction: column;
      text-align: center;
    }

    .testi-art {
      order: -1;
    }
  }

  @media (max-width: 520px) {
    .section-pad {
      padding: 48px 0;
    }

    .testi {
      padding: 32px 20px;
      gap: 16px;
    }

    .wrap {
      padding: 0 16px;
    }
  }
</style>
