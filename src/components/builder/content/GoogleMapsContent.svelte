<script lang="ts">
  import { MapPin, Info } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection | undefined = undefined;
  // Use section to prevent unused property warning
  $: currentPreset = section?.layoutPreset || 'fullwidth_map';
</script>

<div class="space-y-4">
  <!-- Dynamic Store Maps Binding Badge -->
  <div class="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-800 dark:text-blue-300 text-xs flex items-start gap-3 shadow-sm">
    <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
      <MapPin size={16} />
    </div>
    <div class="space-y-0.5">
      <p class="font-bold text-xs">Lokasi Peta: Mengikuti data lokasi toko otomatis</p>
      <p class="text-[11px] opacity-80 leading-relaxed">
        Koordinat dan alamat Google Maps disinkronkan secara otomatis dari data profil toko tenant. Di kanvas editor desainer ini ditampilkan pratinjau dummy toko contoh ({currentPreset}).
      </p>
    </div>
  </div>

  <div class="p-3 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-xl text-xs text-base-content/70 flex items-center gap-2">
    <Info size={14} class="text-base-content/50 flex-shrink-0" />
    <span>Gunakan tab <strong>Tata Letak</strong> untuk memilih variasi preset tampilan visual peta.</span>
  </div>
</div>
