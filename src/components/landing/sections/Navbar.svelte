<script lang="ts">
  export let nav: HTMLElement;
  export let navBrandText: HTMLElement;
</script>

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

<style>
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

  :global(.landing-page.light-theme) .nav.scrolled {
    background: rgba(255, 255, 255, 0.88);
    border-bottom: 1px solid rgba(23, 18, 31, 0.1);
  }

  :global(.landing-page.dark-theme) .nav.scrolled {
    background: rgba(0, 0, 0, 0.88);
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
</style>
