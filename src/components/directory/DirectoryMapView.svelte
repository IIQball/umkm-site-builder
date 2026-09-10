<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { DirectoryStore } from './directory.types';
  import { DEFAULT_PLATFORM_REGION } from '@/config/platform';

  export let stores: DirectoryStore[] = [];
  export let userLocation: { lat: number; lng: number; label?: string } | null = null;
  export let selectedStoreId: string | null = null;

  let mapElement: HTMLDivElement;
  let map: any = null;
  let L: any = null;
  let userMarker: any = null;
  let storeMarkers: Map<string, any> = new Map();
  let isMapReady = false;

  function getStoreUrl(subdomain: string) {
    if (typeof window === 'undefined') return '#';
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseHost = isLocal ? 'localhost:4321' : window.location.host.replace(/^www\./, '');
    return `${window.location.protocol}//${subdomain}.${baseHost}`;
  }

  function getWhatsAppUrl(waNumber: string, storeName: string) {
    let clean = waNumber.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    return `https://wa.me/${clean}?text=${encodeURIComponent(`Halo ${storeName}, saya menemukan toko Anda di Direktori UMKM.`)}`;
  }

  function renderPopupContent(store: DirectoryStore): string {
    const storeUrl = getStoreUrl(store.subdomain);
    const categoryHtml = store.category
      ? `<span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:600;background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;margin-bottom:6px;">${store.category.name}</span>`
      : '';
    const distanceHtml = store.distance !== null
      ? `<div style="display:flex;align-items:center;gap:4px;font-size:12px;font-weight:600;color:#059669;margin-bottom:6px;">📍 ${store.distance} km dari Anda</div>`
      : '';
    const addressHtml = store.address
      ? `<div style="font-size:11px;color:#6b7280;margin-bottom:8px;line-height:1.3;">${store.address}</div>`
      : '';
    const waButton = store.waNumber
      ? `<a href="${getWhatsAppUrl(store.waNumber, store.name)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;justify-content:center;padding:6px 10px;border-radius:8px;background:#22c55e;color:#fff;font-size:11px;font-weight:600;text-decoration:none;">WhatsApp</a>`
      : '';

    return `
      <div style="font-family:inherit;min-width:180px;max-width:240px;padding:2px 0;">
        <div style="font-weight:700;font-size:14px;color:#111827;margin-bottom:4px;">${store.name}</div>
        ${categoryHtml}
        ${distanceHtml}
        ${addressHtml}
        <div style="display:flex;gap:6px;margin-top:8px;">
          <a href="${storeUrl}" target="_blank" rel="noopener noreferrer" style="flex:1;display:inline-flex;align-items:center;justify-content:center;padding:6px 12px;border-radius:8px;background:#059669;color:#fff;font-size:11px;font-weight:600;text-decoration:none;">Kunjungi Toko</a>
          ${waButton}
        </div>
      </div>
    `;
  }

  function updateMarkers() {
    if (!isMapReady || !map || !L) return;

    // Clear existing store markers
    storeMarkers.forEach((marker) => marker.remove());
    storeMarkers.clear();

    const validStoreCoords: [number, number][] = [];

    // 1. User Marker
    if (userLocation) {
      const userLatLng: [number, number] = [userLocation.lat, userLocation.lng];

      if (!userMarker) {
        const userIcon = L.divIcon({
          className: 'custom-user-marker',
          html: `
            <div style="position:relative;width:24px;height:24px;">
              <span style="position:absolute;inset:-6px;border-radius:9999px;background:rgba(59,130,246,0.35);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></span>
              <span style="position:relative;display:flex;width:24px;height:24px;border-radius:9999px;background:#2563eb;border:3px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.25);align-items:center;justify-content:center;color:#fff;font-size:10px;"></span>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        userMarker = L.marker(userLatLng, { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
        userMarker.bindPopup(`<div style="font-size:12px;font-weight:600;color:#1e3a8a;">📍 ${userLocation.label ? `Lokasi: ${userLocation.label}` : 'Lokasi Anda Saat Ini'}</div>`);
      } else {
        userMarker.setLatLng(userLatLng);
      }
    } else if (userMarker) {
      userMarker.remove();
      userMarker = null;
    }

    // 2. UMKM Store Markers
    stores.forEach((store) => {
      if (typeof store.latitude === 'number' && typeof store.longitude === 'number') {
        const latLng: [number, number] = [store.latitude, store.longitude];
        validStoreCoords.push(latLng);

        const storeIcon = L.divIcon({
          className: 'custom-store-pin',
          html: `
            <div style="position:relative;cursor:pointer;display:flex;align-items:center;justify-content:center;width:34px;height:34px;background:#059669;border-radius:9999px;border:2.5px solid #ffffff;box-shadow:0 4px 12px rgba(0,0,0,0.2);color:#ffffff;transition:transform 0.2s ease;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -18],
        });

        const marker = L.marker(latLng, { icon: storeIcon }).addTo(map);
        marker.bindPopup(renderPopupContent(store));
        storeMarkers.set(store.id, marker);

        if (selectedStoreId === store.id) {
          marker.openPopup();
        }
      }
    });

    // 3. Dynamic Camera Framing via Leaflet fitBounds
    if (userLocation) {
      const allPoints: [number, number][] = [[userLocation.lat, userLocation.lng], ...validStoreCoords];
      if (allPoints.length === 1) {
        map.setView(allPoints[0], 15);
      } else {
        map.fitBounds(L.latLngBounds(allPoints), { padding: [40, 40], maxZoom: 15 });
      }
    } else if (validStoreCoords.length > 0) {
      if (validStoreCoords.length === 1) {
        map.setView(validStoreCoords[0], 14);
      } else {
        map.fitBounds(L.latLngBounds(validStoreCoords), { padding: [40, 40], maxZoom: 15 });
      }
    } else {
      // Fallback: Pusat Wilayah Platform (SSOT src/config/platform.ts)
      map.setView(
        [DEFAULT_PLATFORM_REGION.center.lat, DEFAULT_PLATFORM_REGION.center.lng],
        DEFAULT_PLATFORM_REGION.defaultZoom
      );
    }
  }

  function centerOnUser() {
    if (map && userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1 });
      if (userMarker) userMarker.openPopup();
    }
  }

  function resetView() {
    updateMarkers();
  }

  onMount(async () => {
    // Dynamically inject leaflet CSS if needed
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    try {
      const leafletModule = await import('leaflet');
      L = leafletModule.default || leafletModule;

      const initialCenter: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : [DEFAULT_PLATFORM_REGION.center.lat, DEFAULT_PLATFORM_REGION.center.lng];

      map = L.map(mapElement, {
        zoomControl: false,
        attributionControl: false,
      }).setView(initialCenter, userLocation ? 14 : DEFAULT_PLATFORM_REGION.defaultZoom);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>')
        .addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      isMapReady = true;
      updateMarkers();
    } catch (err) {
      console.error('Failed to initialize Leaflet map:', err);
    }
  });

  onDestroy(() => {
    if (map) {
      map.remove();
      map = null;
    }
  });

  $: if (isMapReady && (stores || userLocation)) {
    updateMarkers();
  }

  $: if (isMapReady && selectedStoreId && storeMarkers.has(selectedStoreId)) {
    const m = storeMarkers.get(selectedStoreId);
    if (m) {
      map.flyTo(m.getLatLng(), 15, { duration: 0.8 });
      m.openPopup();
    }
  }
</script>

<div class="relative w-full h-[480px] sm:h-[560px] rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 shadow-[0_4px_24px_rgba(0,0,0,0.06)] bg-zinc-100 dark:bg-zinc-900">
  <div bind:this={mapElement} class="w-full h-full z-0"></div>

  <!-- Map Top Controls -->
  <div class="absolute top-4 right-4 z-[400] flex flex-col gap-2">
    {#if userLocation}
      <button
        type="button"
        on:click={centerOnUser}
        title="Pusatkan ke lokasi saya"
        class="p-2.5 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-700/80 text-blue-600 dark:text-blue-400 shadow-md hover:scale-105 active:scale-95 transition-transform"
      >
        <span class="material-symbols-outlined text-[20px] block">my_location</span>
      </button>
    {/if}

    <button
      type="button"
      on:click={resetView}
      title="Tampilkan semua marker"
      class="p-2.5 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 shadow-md hover:scale-105 active:scale-95 transition-transform"
    >
      <span class="material-symbols-outlined text-[20px] block">crop_free</span>
    </button>
  </div>

  <!-- Bottom status pill -->
  <div class="absolute bottom-4 left-4 z-[400] pointer-events-none">
    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/70 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 shadow-sm font-medium">
      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
      <span>{stores.filter(s => typeof s.latitude === 'number').length} UMKM berkoordinat</span>
    </div>
  </div>
</div>
