<script lang="ts">
  export let isOpen: boolean = true;
</script>

{#if !isOpen}
  <div class="bg-orange/10 border-b border-orange/20 px-4 sm:px-6 py-3">
    <div class="max-w-[1200px] mx-auto flex items-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-orange flex-shrink-0"
        aria-hidden="true"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5m-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11m3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
      </svg>
      <div class="flex-1">
        <p class="text-sm font-semibold text-orange">Toko Sedang Tutup</p>
        <p class="text-xs text-orange/70">Pelanggan tidak dapat memesan saat ini</p>
      </div>
    </div>
  </div>
{/if}
