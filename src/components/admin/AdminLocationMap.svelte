<script lang="ts">
  import { onMount } from 'svelte';
  import DirectoryMapView from '@/components/directory/DirectoryMapView.svelte';
  import type { DirectoryStore } from '@/components/directory/directory.types';
  import { apiFetch } from '@/lib/api/parse-response';
  import { toast } from '@/lib/toast';

  let stores: DirectoryStore[] = [];
  let userLocation: { lat: number; lng: number; label?: string } | null = null;
  let loading = true;

  async function fetchStores(lat?: number, lng?: number) {
    try {
      loading = true;
      const url = new URL('/api/directory/search', window.location.origin);
      url.searchParams.set('limit', '100'); // Fetch up to 100 stores for the map
      if (lat && lng) {
        url.searchParams.set('lat', lat.toString());
        url.searchParams.set('lng', lng.toString());
        url.searchParams.set('radius', '50'); // 50km radius
      }

      const result = await apiFetch<DirectoryStore[]>(url.toString(), {
        fallbackError: 'Gagal memuat lokasi toko pada peta.',
      });

      if (result.success && Array.isArray(result.data)) {
        stores = result.data;
      } else if (!result.success) {
        toast.error(result.message);
      }
    } catch (err) {
      console.error('Failed to fetch stores for map:', err);
      toast.error('Koneksi bermasalah saat memuat peta lokasi.');
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          fetchStores(userLocation.lat, userLocation.lng);
        },
        () => {
          console.warn("Geolocation denied or unavailable on this device.");
          fetchStores(); // Fetch without location
        },
        { enableHighAccuracy: true }
      );
    } else {
      fetchStores();
    }
  });
</script>

<div class="w-full relative rounded-2xl overflow-hidden shadow-inner group">
  {#if loading && stores.length === 0}
    <div class="absolute inset-0 z-10 flex items-center justify-center bg-card/50 backdrop-blur-sm">
      <span class="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
    </div>
  {/if}
  
  <DirectoryMapView {stores} {userLocation} />
</div>
