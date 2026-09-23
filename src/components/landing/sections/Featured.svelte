<script lang="ts">
  import { MapPin, Star } from 'lucide-svelte';
  import { featured } from '../utils/constants';
</script>

<section class="section-pad" id="umkm" style="padding-top:0;">
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
                  ? '/assets/shop1.png'
                  : '/assets/shop2.png'
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

<style>
  .section-pad {
    padding: 110px 0;
  }

  .wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 32px;
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
    width: 75%;
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

  @media (max-width: 1024px) {
    .feat-card {
      flex: 0 0 260px;
    }
  }

  @media (max-width: 768px) {
    .section-pad {
      padding: 60px 0;
    }

    .section-head h2 {
      font-size: clamp(22px, 2.8vw, 32px);
    }

    .feat-card {
      flex: 0 0 240px;
    }

    .feat-thumb {
      height: 140px;
    }

    .wrap {
      padding: 0 24px;
    }
  }

  @media (max-width: 520px) {
    .section-pad {
      padding: 48px 0;
    }

    .section-head {
      margin-bottom: 32px;
    }

    .section-head h2 {
      font-size: clamp(20px, 4vw, 28px);
    }

    .section-head p {
      font-size: 14px;
    }

    .feat-card {
      flex: 0 0 220px;
    }

    .feat-thumb {
      height: 130px;
    }

    .feat-body {
      padding: 14px 14px 18px;
    }

    .feat-card h3 {
      font-size: 14px;
    }

    .wrap {
      padding: 0 16px;
    }
  }
</style>
