<script lang="ts">
</script>

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
  footer {
    border-top: 1px solid var(--line);
    padding: 56px 0 34px;
  }

  .wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 32px;
  }

  .foot-top {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    flex-wrap: wrap;
    margin-bottom: 40px;
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

  @media (max-width: 768px) {
    .wrap {
      padding: 0 24px;
    }
  }

  @media (max-width: 520px) {
    footer {
      padding: 36px 0 20px;
    }

    .foot-top {
      gap: 20px;
    }

    .foot-cols {
      gap: 24px;
      width: 100%;
    }

    .wrap {
      padding: 0 16px;
    }
  }
</style>
