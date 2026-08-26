<script lang="ts">
  import { MapPin, Info } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from './content.helpers';
  import ImageUpload from '@/components/shared/ImageUpload.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void = () => {};

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: currentPreset = section?.layoutPreset || 'fullwidth_map';
  $: imageUrl = (section?.props?.imageUrl as string) || '';
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

  <!-- Store Front Thumbnail Upload -->
  <div class="p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800 space-y-2">
    <span class="block font-semibold text-xs text-base-content/80">Foto Tampak Depan Toko / Thumbnail Map</span>
    <ImageUpload
      value={imageUrl}
      maxFiles={1}
      folder="templates"
      compact={true}
      label="Thumbnail Tampak Depan"
      onSingleUpload={(url) => handlePropChange('imageUrl', url)}
    />
  </div>

  <div class="p-3 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-xl text-xs text-base-content/70 flex items-center gap-2">
    <Info size={14} class="text-base-content/50 flex-shrink-0" />
    <span>Gunakan tab <strong>Tata Letak</strong> untuk memilih variasi preset tampilan visual peta.</span>
  </div>
</div>
