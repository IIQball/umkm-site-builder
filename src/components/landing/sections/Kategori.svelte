<script lang="ts">
  import { MapPin, Star } from 'lucide-svelte';
  import { categoryFilters, categoryIconMap, kecamatanFilters, umkmDirectory } from '../utils/constants';
  import type { UmkmItem } from '../types/index';

  let activeCategory = 'Semua';
  let activeKecamatan = 'Semua Kecamatan';

  $: filteredUmkm = umkmDirectory.filter(
    (u) =>
      (activeCategory === 'Semua' || u.category === activeCategory) &&
      (activeKecamatan === 'Semua Kecamatan' || u.kecamatan === activeKecamatan)
  );
</script>

<section class="section-pad" id="kategori">
  <div class="wrap">
    <div class="section-head gsap-reveal">
      <span class="eyebrow">Kategori</span>

      <h2>Ada Apa di Sekitarmu?</h2>

      <p>
        Eksplorasi UMKM unggulan di setiap kecamatan Kabupaten
        Banyuwangi, dari kuliner khas sampai oleh-oleh dan fashion lokal.
      </p>
    </div>

    <div class="filter-bar gsap-reveal">
      <div class="filter-pills">
        {#each categoryFilters as filter}
          <button
            type="button"
            class="filter-pill"
            class:active={activeCategory === filter.name}
            onclick={() => (activeCategory = filter.name)}
          >
            {#if filter.icon}
              <svelte:component this={filter.icon} size={14} />
            {/if}
            {filter.name}
          </button>
        {/each}
      </div>

      <div class="filter-chips">
        {#each kecamatanFilters as kec}
          <button
            type="button"
            class="filter-chip"
            class:active={activeKecamatan === kec}
            onclick={() => (activeKecamatan = kec)}
          >
            {kec}
          </button>
        {/each}
      </div>
    </div>

    <div class="umkm-grid" id="umkmGrid">
      {#each filteredUmkm.slice(0, 6) as item (item.name)}
        <div class="umkm-card">
          <div class="umkm-card-top">
            <div class="umkm-icon">
              <svelte:component this={categoryIconMap[item.category]} size={20} />
            </div>

            <span class="umkm-rating">
              <Star size={12} fill="currentColor" />
              {item.rating}
            </span>
          </div>

          <span class="umkm-tag">{item.category} · {item.count}</span>

          <h3>{item.name}</h3>

          <p>{item.desc}</p>

          <div class="umkm-card-footer">
            <span class="umkm-loc">
              <MapPin size={13} />
              {item.kecamatan} <em>({item.distance})</em>
            </span>

            <a href="/umkm" class="btn btn-ghost umkm-detail">Detail</a>
          </div>
        </div>
      {:else}
        <p class="umkm-empty">
          Belum ada UMKM untuk filter ini. Coba kategori atau kecamatan lain.
        </p>
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

  .filter-bar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 40px;
  }

  .filter-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .filter-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;

    font-family: var(--font-body);
    font-size: 13.5px;
    font-weight: 600;
    color: var(--ink-1);

    padding: 10px 18px;
    border-radius: 100px;
    border: 1px solid var(--line);
    background: var(--panel);

    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  .filter-pill:hover {
    border-color: rgba(255, 255, 255, 0.24);
  }

  .filter-pill.active {
    background: linear-gradient(120deg, var(--violet-1), var(--violet-2));
    border-color: transparent;
    color: #fff;
  }

  .filter-chips {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 8px;
    padding-bottom: 6px;
    scrollbar-width: none;
  }

  .filter-chips::-webkit-scrollbar {
    display: none;
  }

  .filter-chip {
    flex: 0 0 auto;

    font-family: var(--font-body);
    font-size: 12.5px;
    font-weight: 600;
    color: var(--ink-2);

    padding: 7px 14px;
    border-radius: 100px;
    border: 1px solid var(--line);
    background: transparent;

    cursor: pointer;
    white-space: nowrap;
    transition: color 0.2s ease, border-color 0.2s ease;
  }

  .filter-chip:hover {
    color: var(--ink-0);
  }

  .filter-chip.active {
    border-color: var(--coral);
    color: var(--coral);
  }

  .umkm-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .umkm-empty {
    grid-column: 1 / -1;
    color: var(--ink-2);
    font-size: 14px;
    padding: 30px 0;
    text-align: center;
  }

  .umkm-card {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);

    padding: 26px 24px;

    display: flex;
    flex-direction: column;
    gap: 10px;

    will-change: transform, opacity;
  }

  .umkm-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .umkm-icon {
    width: 46px;
    height: 46px;
    border-radius: 14px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: linear-gradient(150deg, var(--violet-1), var(--coral));
    color: #fff;
  }

  .umkm-rating {
    display: inline-flex;
    align-items: center;
    gap: 4px;

    font-size: 12.5px;
    font-weight: 700;
    color: var(--amber);

    padding: 5px 10px;
    border-radius: 100px;
    background: rgba(255, 180, 92, 0.14);
  }

  .umkm-tag {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--coral);
  }

  .umkm-card h3 {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 17px;
    color: var(--ink-0);
  }

  .umkm-card p {
    font-size: 13.5px;
    color: var(--ink-2);
  }

  .umkm-card-footer {
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid var(--line);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .umkm-loc {
    display: flex;
    align-items: center;
    gap: 5px;

    font-size: 12.3px;
    color: var(--ink-2);
  }

  .umkm-loc em {
    font-style: normal;
    color: var(--ink-1);
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

  .umkm-detail {
    padding: 8px 16px;
    font-size: 12.5px;
  }

  @media (max-width: 1024px) {
    .umkm-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  }

  @media (max-width: 768px) {
    .section-pad {
      padding: 60px 0;
    }

    .section-head h2 {
      font-size: clamp(22px, 2.8vw, 32px);
    }

    .umkm-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .filter-chips {
      gap: 6px;
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

    .filter-pills {
      gap: 8px;
    }

    .filter-pill {
      padding: 8px 14px;
      font-size: 12.5px;
    }

    .umkm-grid {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .umkm-card {
      padding: 18px 16px;
    }

    .umkm-card h3 {
      font-size: 15px;
    }

    .umkm-card p {
      font-size: 12.5px;
    }

    .wrap {
      padding: 0 16px;
    }
  }
</style>
