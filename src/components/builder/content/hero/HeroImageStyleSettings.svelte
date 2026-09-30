<script lang="ts">
  import { Button } from '@/components/ui';
  import {
    HERO_IMAGE_FRAME_OPTIONS,
    HERO_IMAGE_SHAPE_OPTIONS,
  } from '../../sections/hero/heroIcons';

  export let imageFrame: string = 'none';
  export let imageShape: string = 'rounded';
  export let onPropChange: (key: string, value: unknown) => void = () => {};
</script>

<div class="space-y-3 pt-2.5 border-t border-base-300">
  <!-- Pilihan Bingkai / Card / Grid -->
  <div>
    <label for="hero-image-frame" class="block font-semibold text-xs text-base-content/80 mb-1">
      Bingkai Foto Hero
    </label>
    <div class="grid grid-cols-3 gap-1 bg-base-200/60 p-1 rounded-lg border border-base-300 text-xs">
      {#each HERO_IMAGE_FRAME_OPTIONS as opt}
        <Button
          type="button"
          size="xs"
          variant={(imageFrame || 'none') === opt.value ? 'primary' : 'ghost'}
          on:click={() => onPropChange('imageFrame', opt.value)}
          class={`!py-1.5 !px-1 !h-auto !min-h-0 rounded font-medium text-center text-[11px] truncate ${
            (imageFrame || 'none') === opt.value
              ? 'font-bold shadow-xs'
              : 'text-base-content/60 hover:text-base-content'
          }`}
          title={opt.label}
        >
          {opt.value === 'none' ? 'Tanpa Card' : opt.value === 'card' ? 'Dengan Card' : 'Aksen Grid'}
        </Button>
      {/each}
    </div>
  </div>

  <!-- Pilihan Bentuk Gambar (Shape) -->
  <div>
    <label for="hero-image-shape" class="block font-semibold text-xs text-base-content/80 mb-1">
      Bentuk Gambar
    </label>
    <div class="grid grid-cols-4 gap-1 bg-base-200/60 p-1 rounded-lg border border-base-300 text-xs">
      {#each HERO_IMAGE_SHAPE_OPTIONS as opt}
        <Button
          type="button"
          size="xs"
          variant={(imageShape || 'rounded') === opt.value ? 'primary' : 'ghost'}
          on:click={() => onPropChange('imageShape', opt.value)}
          class={`!py-1.5 !px-1 !h-auto !min-h-0 rounded font-medium text-center text-[11px] truncate ${
            (imageShape || 'rounded') === opt.value
              ? 'font-bold shadow-xs'
              : 'text-base-content/60 hover:text-base-content'
          }`}
          title={opt.label}
        >
          {opt.value === 'rounded' ? 'Membulat' : opt.value === 'square' ? 'Kotak' : opt.value === 'circle' ? 'Bulat' : 'Squircle'}
        </Button>
      {/each}
    </div>
  </div>
</div>
