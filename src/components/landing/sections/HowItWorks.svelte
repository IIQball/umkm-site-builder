<script lang="ts">
  import { howItWorksSteps } from '../utils/constants';
</script>

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
      {#each howItWorksSteps as step}
        <div class="step">
          <span class="num">{step.n}</span>

          <h3>{step.t}</h3>

          <p>{step.d}</p>
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

  @media (min-width: 900px) {
    .step:not(:last-child)::after {
      display: block;
    }
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

    .section-head h2 {
      font-size: clamp(22px, 2.8vw, 32px);
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

    .steps {
      grid-template-columns: 1fr;
    }

    .wrap {
      padding: 0 16px;
    }
  }
</style>
