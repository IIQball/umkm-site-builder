<script lang="ts">
  import { onMount } from 'svelte';
  import { addToast } from '@/lib/toast';

  onMount(() => {
    // Simpan referensi fetch asli
    const originalFetch = window.fetch;

    // Monkey-patch fetch untuk mencegat respons global
    window.fetch = async function (...args) {
      const response = await originalFetch.apply(this, args);

      // Jika server mengembalikan 429 Too Many Requests
      if (response.status === 429) {
        addToast({
          type: "error",
          message: "Terlalu banyak permintaan. Silakan tunggu beberapa saat."
        });
      }

      return response;
    };

    // Cleanup saat komponen dibongkar (meskipun untuk layout global ini jarang terjadi)
    return () => {
      window.fetch = originalFetch;
    };
  });
</script>

<!-- Komponen ini headless (tanpa UI visual), 
     hanya berjalan di background untuk memantau request fetch. -->
