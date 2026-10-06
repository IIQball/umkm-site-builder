<script lang="ts">
  import { Plus, Trash2 } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import { ICON_CHOICES } from './contentCustomization.helpers';
  import type { StoreContentCustomization } from '../../onboarding.types';

  export let customization: StoreContentCustomization;
  export let onUpdate: (() => void) | undefined = undefined;

  function addItem() {
    if (customization.features.items.length >= 6) return;
    customization.features.items = [
      ...customization.features.items,
      {
        icon: 'Sparkles',
        title: `Keunggulan Baru #${customization.features.items.length + 1}`,
        description: 'Tuliskan manfaat atau nilai lebih belanja di toko Anda.',
      },
    ];
    onUpdate?.();
  }

  function removeItem(index: number) {
    if (customization.features.items.length <= 1) return;
    customization.features.items = customization.features.items.filter((_, i) => i !== index);
    onUpdate?.();
  }
</script>

<div class="space-y-4 text-left">
  <!-- Section Heading & Subheading -->
  <div class="space-y-3 pb-3 border-b border-light">
    <div>
      <label for="features-heading-input" class="block text-xs font-bold text-main font-heading mb-1.5">
        Judul Seksi Keunggulan
      </label>
      <input
        id="features-heading-input"
        type="text"
        bind:value={customization.features.heading}
        on:input={() => onUpdate?.()}
        placeholder="Contoh: Mengapa Memilih Kami?"
        class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
      />
    </div>

    <div>
      <label for="features-subheading-input" class="block text-xs font-bold text-main font-heading mb-1.5">
        Subjudul Penjelas
      </label>
      <textarea
        id="features-subheading-input"
        bind:value={customization.features.subheading}
        on:input={() => onUpdate?.()}
        rows="2"
        placeholder="Penjelasan singkat nilai tambah toko Anda..."
        class="w-full bg-card text-main border border-light rounded-xl p-3 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none leading-relaxed"
      ></textarea>
    </div>
  </div>

  <!-- Repeater Header -->
  <div class="flex items-center justify-between">
    <span class="text-xs font-bold text-main font-heading">
      Daftar Butir Keunggulan ({customization.features.items.length}/6)
    </span>
    <Button
      type="button"
      size="sm"
      variant="ghost"
      disabled={customization.features.items.length >= 6}
      on:click={addItem}
      class="text-primary font-bold text-xs !px-2.5 !py-1 !h-auto gap-1"
    >
      <Plus size={14} />
      <span>Tambah Poin</span>
    </Button>
  </div>

  <!-- Items List: Spacious, Clean, No Horizontal Overflow -->
  <div class="space-y-3">
    {#each customization.features.items as item, idx}
      <div class="p-3.5 bg-card rounded-xl border border-light space-y-3 shadow-2xs">
        <div class="flex items-center justify-between gap-2 border-b border-light/60 pb-2">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xs shrink-0">
              {idx + 1}
            </span>
            <span class="text-xs font-bold text-main truncate font-heading">
              {item.title || `Poin #${idx + 1}`}
            </span>
          </div>

          {#if customization.features.items.length > 1}
            <button
              type="button"
              on:click={() => removeItem(idx)}
              class="text-secondary hover:text-error p-1 rounded-lg hover:bg-error/10 transition-colors shrink-0 cursor-pointer"
              title="Hapus butir keunggulan"
            >
              <Trash2 size={14} />
            </button>
          {/if}
        </div>

        <!-- Inputs: Formatted cleanly without cramped inline overflow -->
        <div class="space-y-2.5">
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div class="sm:col-span-5">
              <label for={`feat-icon-${idx}`} class="block text-3xs font-semibold text-secondary mb-1">
                Pilihan Ikon
              </label>
              <select
                id={`feat-icon-${idx}`}
                bind:value={item.icon}
                on:change={() => onUpdate?.()}
                class="w-full bg-nested text-main border border-light rounded-lg px-2.5 py-1.5 text-xs font-sans focus:outline-none focus:border-primary truncate cursor-pointer"
              >
                {#each ICON_CHOICES as ico}
                  <option value={ico.value}>{ico.label}</option>
                {/each}
              </select>
            </div>

            <div class="sm:col-span-7">
              <label for={`feat-title-${idx}`} class="block text-3xs font-semibold text-secondary mb-1">
                Judul Keunggulan
              </label>
              <input
                id={`feat-title-${idx}`}
                type="text"
                bind:value={item.title}
                on:input={() => onUpdate?.()}
                placeholder="Contoh: Kualitas Terjamin 100%"
                class="w-full bg-nested text-main border border-light rounded-lg px-2.5 py-1.5 text-xs font-sans font-semibold focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label for={`feat-desc-${idx}`} class="block text-3xs font-semibold text-secondary mb-1">
              Deskripsi Manfaat
            </label>
            <textarea
              id={`feat-desc-${idx}`}
              bind:value={item.description}
              on:input={() => onUpdate?.()}
              rows="2"
              placeholder="Jelaskan secara singkat manfaat belanja ini bagi pelanggan..."
              class="w-full bg-nested text-main border border-light rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:border-primary resize-none leading-relaxed"
            ></textarea>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
