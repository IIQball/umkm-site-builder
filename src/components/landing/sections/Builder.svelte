<script lang="ts">
  import { ArrowRight, MessageCircle } from 'lucide-svelte';
  import { builderSteps, builderProducts } from '../utils/constants';
</script>

<section class="section-pad" id="builder" style="padding-top:0;">
  <div class="wrap">
    <div class="builder-grid">
      <div class="builder-copy gsap-reveal">
        <span class="eyebrow">No-Code Builder</span>

        <h2>Rakit Etalase UMKM-mu Sendiri</h2>

        <p>
          Tiga langkah sederhana, tanpa kode, tanpa biaya. Halaman
          digital UMKM-mu siap tayang lengkap dengan tombol pesan
          WhatsApp.
        </p>

        <div class="builder-steps">
          {#each builderSteps as step}
            <div class="builder-step">
              <div class="builder-step-icon">
                <svelte:component this={step.icon} size={18} />
              </div>

              <div class="builder-step-copy">
                <span class="builder-step-label">{step.label}</span>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>

              <span class="builder-step-num">{step.n}</span>
            </div>
          {/each}
        </div>

        <a href="/register" class="btn btn-solid btn-lg builder-cta">
          Coba Builder Sekarang
          <ArrowRight size={16} />
        </a>
      </div>

      <div class="builder-mock gsap-reveal">
        <div class="mock-topbar">
          <span class="mock-dot" style="background:#ff5f57"></span>
          <span class="mock-dot" style="background:#febc2e"></span>
          <span class="mock-dot" style="background:#28c840"></span>

          <span class="mock-tab">
            <span class="mock-tab-dot"></span>
            Warung Osing Mbak Yuni
          </span>
        </div>

        <div class="mock-body">
          <h3>Warung Osing Mbak Yuni</h3>
          <p>Kuliner Khas Banyuwangi</p>

          <div class="mock-meta">
            <span class="mock-hours">Buka 08:00 – 21:00</span>
            <span class="mock-kec">Kecamatan Glagah</span>
          </div>

          <div class="mock-products">
            {#each builderProducts as product}
              <div class="mock-product">
                <span class="mock-product-emoji">🍛</span>
                <span class="mock-product-name">{product.name}</span>
                <span class="mock-product-price">{product.price}</span>
              </div>
            {/each}
          </div>

          <div class="mock-order">
            <span><MessageCircle size={15} /> Pesanan via WhatsApp</span>
            <a href="/register" class="btn btn-solid mock-order-btn">
              Uji Coba Editor
            </a>
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

  .eyebrow {
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--coral);
    margin-bottom: 14px;
    display: block;
  }

  .builder-grid {
    display: grid;
    grid-template-columns: 0.95fr 1.05fr;
    gap: 56px;
    align-items: center;
  }

  .builder-copy .eyebrow {
    margin-bottom: 16px;
  }

  .builder-copy h2 {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(26px, 3vw, 36px);
    margin: 0 0 14px;
    line-height: 1.2;
  }

  .builder-copy > p {
    color: var(--ink-1);
    font-size: 15px;
    max-width: 46ch;
    margin: 0 0 32px;
  }

  .builder-steps {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 30px;
  }

  .builder-step {
    position: relative;

    display: flex;
    align-items: flex-start;
    gap: 14px;

    padding: 18px 20px;
    border-radius: var(--radius-md);
    border: 1px solid var(--line);
    background: var(--panel);

    will-change: transform, opacity;
  }

  .builder-step-icon {
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 11px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(139, 107, 255, 0.16);
    color: var(--violet-1);
  }

  .builder-step-copy {
    flex: 1;
  }

  .builder-step-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--coral);
  }

  .builder-step h4 {
    font-family: var(--font-display);
    font-size: 15.5px;
    font-weight: 600;
    color: var(--ink-0);
    margin: 3px 0 5px;
  }

  .builder-step p {
    font-size: 13px;
    color: var(--ink-2);
  }

  .builder-step-num {
    flex-shrink: 0;
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    color: var(--ink-2);
    opacity: 0.6;
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

  .builder-cta {
    display: inline-flex;
  }

  .builder-mock {
    border-radius: var(--radius-lg);
    border: 1px solid var(--line);
    background: var(--panel);
    overflow: hidden;
    box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.5);
  }

  .mock-topbar {
    display: flex;
    align-items: center;
    gap: 7px;

    padding: 14px 18px;
    border-bottom: 1px solid var(--line);
    background: var(--bg-1);
  }

  .mock-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }

  .mock-tab {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    margin-left: 12px;
    padding: 6px 14px;
    border-radius: 100px;
    background: var(--bg-2);

    font-size: 12px;
    font-weight: 600;
    color: var(--ink-1);
  }

  .mock-tab-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--teal);
  }

  .mock-body {
    padding: 28px 26px 26px;
  }

  .mock-body h3 {
    font-family: var(--font-display);
    font-size: 19px;
    font-weight: 600;
    color: var(--ink-0);
    margin: 0 0 4px;
  }

  .mock-body > p {
    font-size: 13px;
    color: var(--ink-2);
    margin: 0 0 16px;
  }

  .mock-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 22px;
  }

  .mock-hours {
    font-size: 12px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 100px;
    background: rgba(51, 201, 171, 0.16);
    color: var(--teal);
  }

  .mock-kec {
    font-size: 12px;
    color: var(--ink-2);
    align-self: center;
  }

  .mock-products {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }

  .mock-product {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    padding: 16px 8px;
    border-radius: var(--radius-md);
    border: 1px solid var(--line);
    background: var(--bg-1);

    text-align: center;
  }

  .mock-product-emoji {
    font-size: 22px;
  }

  .mock-product-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--ink-0);
  }

  .mock-product-price {
    font-size: 11.5px;
    color: var(--teal);
    font-weight: 700;
  }

  .mock-order {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;

    padding: 14px 16px;
    border-radius: var(--radius-md);
    background: var(--bg-1);

    font-size: 12.5px;
    color: var(--ink-1);
  }

  .mock-order span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .mock-order-btn {
    padding: 8px 16px;
    font-size: 12.5px;
  }

  @media (max-width: 1024px) {
    .builder-grid {
      gap: 40px;
    }
  }

  @media (max-width: 768px) {
    .section-pad {
      padding: 60px 0;
    }

    .builder-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .builder-mock {
      order: -1;
    }

    .wrap {
      padding: 0 24px;
    }
  }

  @media (max-width: 520px) {
    .section-pad {
      padding: 48px 0;
    }

    .builder-grid {
      gap: 24px;
    }

    .builder-copy h2 {
      font-size: clamp(20px, 4vw, 28px);
    }

    .builder-copy > p {
      font-size: 14px;
    }

    .builder-steps {
      gap: 12px;
      margin-bottom: 20px;
    }

    .builder-step {
      padding: 14px 16px;
      gap: 12px;
    }

    .builder-step-icon {
      width: 32px;
      height: 32px;
    }

    .builder-step h4 {
      font-size: 14px;
    }

    .builder-step p {
      font-size: 12px;
    }

    .builder-mock {
      border-radius: var(--radius-md);
    }

    .mock-topbar {
      padding: 10px 14px;
      gap: 6px;
    }

    .mock-body {
      padding: 20px 16px 16px;
    }

    .mock-body h3 {
      font-size: 16px;
    }

    .mock-products {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-bottom: 16px;
    }

    .mock-product {
      padding: 12px 8px;
    }

    .mock-product-emoji {
      font-size: 18px;
    }

    .wrap {
      padding: 0 16px;
    }
  }
</style>
