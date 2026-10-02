<script lang="ts">
  import { Plus, Trash2 } from 'lucide-svelte';
  import type { StoreContentCustomization } from '../../onboarding.types';

  export let customization: StoreContentCustomization;

  const ICON_CHOICES = [
    { label: 'Keamanan / Garansi', value: 'ShieldCheck' },
    { label: 'Pengiriman Cepat', value: 'Truck' },
    { label: 'Chat & WhatsApp', value: 'MessageCircle' },
    { label: 'Kualitas Juara', value: 'Award' },
    { label: 'Pelayanan Cepat', value: 'Clock' },
    { label: 'Favorit / Disukai', value: 'Heart' },
    { label: 'Bintang / Terpercaya', value: 'Star' },
    { label: 'Spesial & Baru', value: 'Sparkles' },
  ];

  function addItem() {
    if (customization.features.items.length >= 6) return;
    customization.features.items = [
      ...customization.features.items,
      {
        icon: 'Sparkles',
        title: 'Keunggulan Baru',
        description: 'Tuliskan manfaat atau kelebihan belanja di toko Anda.',
      },
    ];
  }

  function removeItem(index: number) {
    if (customization.features.items.length <= 1) return;
    customization.features.items = customization.features.items.filter((_, i) => i !== index);
  }
</script>

<div class="space-y-4">
  <!-- Section Heading & Subheading -->
  <div class="space-y-3">
    <div>
      <label for="features-heading-input" class="block text-xs font-bold text-main font-heading mb-1.5">
        Judul Seksi Keunggulan
      </label>
      <input
        id="features-heading-input"
        type="text"
        bind:value={customization.features.heading}
        placeholder="Contoh: Mengapa Memilih Kami?"
        class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
      />
    </div>

    <div>
      <label for="features-subheading-input" class="block text-xs font-bold text-main font-heading mb-1.5">
        Subjudul Penjelas
      </label>
      <input
        id="features-subheading-input"
        type="text"
        bind:value={customization.features.subheading}
        placeholder="Penjelasan singkat nilai tambah toko Anda..."
        class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  </div>

  <!-- Repeater List -->
  <div class="space-y-3 pt-2 border-t border-light">
    <div class="flex items-center justify-between">
      <span class="text-label-caps text-muted">
        Daftar Butir Keunggulan ({customization.features.items.length}/6)
      </span>
      {#if customization.features.items.length < 6}
        <button
          type="button"
          on:click={addItem}
          class="inline-flex items-center gap-1 text-2xs font-bold text-primary hover:underline cursor-pointer"
        >
          <Plus size={13} />
          <span>Tambah Poin</span>
        </button>
      {/if}
    </div>

    <div class="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
      {#each customization.features.items as item, idx}
        <div class="p-3 bg-nested rounded-xl border border-light space-y-2 relative group">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 flex-1">
              <select
                bind:value={item.icon}
                class="bg-card text-main border border-light rounded-lg px-2 py-1 text-2xs font-sans focus:outline-none focus:border-primary shrink-0"
              >
                {#each ICON_CHOICES as ico}
                  <option value={ico.value}>{ico.label}</option>
                {/each}
              </select>
              <input
                type="text"
                bind:value={item.title}
                placeholder="Judul Keunggulan"
                class="flex-1 bg-card text-main border border-light rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-primary"
              />
            </div>

            {#if customization.features.items.length > 1}
              <button
                type="button"
                on:click={() => removeItem(idx)}
                class="text-secondary hover:text-error p-1 rounded transition-colors"
                title="Hapus butir keunggulan"
              >
                <Trash2 size={13} />
              </button>
            {/if}
          </div>

          <textarea
            bind:value={item.description}
            rows="2"
            placeholder="Deskripsi keunggulan..."
            class="w-full bg-card text-main border border-light rounded-lg p-2 text-2xs font-sans focus:outline-none focus:border-primary resize-none"
          ></textarea>
        </div>
      {/each}
    </div>
  </div>
</div>
