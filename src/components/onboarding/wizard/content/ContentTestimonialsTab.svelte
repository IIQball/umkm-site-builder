<script lang="ts">
  import { Plus, Trash2, ChevronUp, ChevronDown, Star } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { StoreContentCustomization, StoreTestimonialItem } from '../../onboarding.types';

  export let customization: StoreContentCustomization;
  export let onUpdate: (() => void) | undefined = undefined;

  const MAX_TESTIMONIALS = 6;

  $: if (!customization.testimonials) {
    customization.testimonials = {
      heading: 'Apa Kata Pelanggan Kami',
      subheading: 'Ulasan jujur dari pelanggan setia yang telah merasakan kepuasan produk kami.',
      items: [],
    };
  }

  $: items = customization.testimonials?.items || [];

  function handleFieldChange(idx: number, field: keyof StoreTestimonialItem, value: unknown) {
    if (!customization.testimonials) return;
    const list = [...customization.testimonials.items];
    list[idx] = { ...list[idx], [field]: value };
    customization.testimonials.items = list;
    onUpdate?.();
  }

  function handleAdd() {
    if (!customization.testimonials || items.length >= MAX_TESTIMONIALS) return;
    const newItem: StoreTestimonialItem = {
      id: `testi_${Date.now()}`,
      customerName: `Pelanggan Baru #${items.length + 1}`,
      rating: 5,
      comment: 'Pelayanan cepat dan kualitas produk sangat memuaskan!',
      role: 'Pelanggan Setia',
    };
    customization.testimonials.items = [...items, newItem];
    onUpdate?.();
  }

  function handleRemove(idx: number) {
    if (!customization.testimonials || items.length <= 1) return;
    customization.testimonials.items = items.filter((_, i) => i !== idx);
    onUpdate?.();
  }

  function handleMove(idx: number, direction: 'up' | 'down') {
    if (!customization.testimonials) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const list = [...items];
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    customization.testimonials.items = list;
    onUpdate?.();
  }

  function handleHeadingChange(val: string) {
    if (!customization.testimonials) return;
    customization.testimonials.heading = val;
    onUpdate?.();
  }

  function handleSubheadingChange(val: string) {
    if (!customization.testimonials) return;
    customization.testimonials.subheading = val;
    onUpdate?.();
  }
</script>

<div class="space-y-4 text-left">
  <!-- Section Header Info -->
  <div class="space-y-3 pb-3 border-b border-light">
    <div>
      <label for="testi-heading-input" class="block text-xs font-bold text-main font-heading mb-1.5">
        Judul Section Ulasan
      </label>
      <input
        id="testi-heading-input"
        type="text"
        value={customization.testimonials?.heading ?? ''}
        on:input={(e) => handleHeadingChange(e.currentTarget.value)}
        placeholder="Contoh: Apa Kata Pelanggan Kami"
        class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
      />
    </div>

    <div>
      <label for="testi-subheading-input" class="block text-xs font-bold text-main font-heading mb-1.5">
        Subjudul / Deskripsi Section
      </label>
      <textarea
        id="testi-subheading-input"
        value={customization.testimonials?.subheading ?? ''}
        on:input={(e) => handleSubheadingChange(e.currentTarget.value)}
        rows="2"
        placeholder="Deskripsi singkat seputar kepuasan pelanggan..."
        class="w-full bg-card text-main border border-light rounded-xl p-3 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
      ></textarea>
    </div>
  </div>

  <!-- Testimonials Repeater Header -->
  <div class="flex items-center justify-between">
    <span class="text-xs font-bold text-main font-heading">
      Daftar Ulasan Pelanggan ({items.length}/{MAX_TESTIMONIALS})
    </span>
    <Button
      type="button"
      size="sm"
      variant="ghost"
      disabled={items.length >= MAX_TESTIMONIALS}
      on:click={handleAdd}
      class="text-primary font-bold text-xs !px-2.5 !py-1 !h-auto gap-1"
    >
      <Plus size={14} />
      <span>Tambah Ulasan</span>
    </Button>
  </div>

  <!-- Items List -->
  <div class="space-y-3">
    {#each items as item, idx (item.id || idx)}
      <div class="p-3.5 bg-card rounded-xl border border-light space-y-3 shadow-2xs">
        <div class="flex items-center justify-between gap-2 border-b border-light/60 pb-2">
          <div class="flex items-center gap-1.5 min-w-0">
            <div class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xs shrink-0">
              {(item.customerName || 'U').charAt(0).toUpperCase()}
            </div>
            <span class="text-xs font-bold text-main truncate font-heading">
              Ulasan #{idx + 1}: {item.customerName || 'Pelanggan'}
            </span>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            <button
              type="button"
              on:click={() => handleMove(idx, 'up')}
              disabled={idx === 0}
              class="p-1 rounded text-secondary hover:text-main disabled:opacity-20 transition-colors"
              title="Pindah ke Atas"
            >
              <ChevronUp size={13} />
            </button>
            <button
              type="button"
              on:click={() => handleMove(idx, 'down')}
              disabled={idx === items.length - 1}
              class="p-1 rounded text-secondary hover:text-main disabled:opacity-20 transition-colors"
              title="Pindah ke Bawah"
            >
              <ChevronDown size={13} />
            </button>
            <button
              type="button"
              on:click={() => handleRemove(idx)}
              disabled={items.length <= 1}
              class="p-1 rounded text-secondary hover:text-error disabled:opacity-20 transition-colors"
              title="Hapus Ulasan"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label for={`testi-name-${idx}`} class="block text-3xs font-semibold text-secondary mb-1">Nama Pelanggan</label>
            <input
              id={`testi-name-${idx}`}
              type="text"
              value={item.customerName}
              on:input={(e) => handleFieldChange(idx, 'customerName', e.currentTarget.value)}
              placeholder="Contoh: Ibu Ratna Dewi"
              class="w-full bg-nested text-main border border-light rounded-lg px-2.5 py-1.5 text-xs font-sans focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label for={`testi-role-${idx}`} class="block text-3xs font-semibold text-secondary mb-1">Status / Asal Pelanggan</label>
            <input
              id={`testi-role-${idx}`}
              type="text"
              value={item.role ?? ''}
              on:input={(e) => handleFieldChange(idx, 'role', e.currentTarget.value)}
              placeholder="Contoh: Pelanggan Setia • Banyuwangi"
              class="w-full bg-nested text-main border border-light rounded-lg px-2.5 py-1.5 text-xs font-sans focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label for={`testi-rating-${idx}`} class="block text-3xs font-semibold text-secondary mb-1">Rating Kepuasan</label>
          <div class="flex items-center gap-1">
            {#each [1, 2, 3, 4, 5] as star}
              <button
                type="button"
                on:click={() => handleFieldChange(idx, 'rating', star)}
                class="p-1 text-xs transition-transform active:scale-95"
              >
                <Star
                  size={16}
                  class={star <= (item.rating || 5) ? 'fill-warning text-warning' : 'text-muted'}
                />
              </button>
            {/each}
            <span class="text-2xs font-bold text-main ml-1.5">{item.rating || 5} / 5 Bintang</span>
          </div>
        </div>

        <div>
          <label for={`testi-comment-${idx}`} class="block text-3xs font-semibold text-secondary mb-1">Isi Ulasan / Testimoni</label>
          <textarea
            id={`testi-comment-${idx}`}
            rows="2"
            value={item.comment}
            on:input={(e) => handleFieldChange(idx, 'comment', e.currentTarget.value)}
            placeholder="Komentar kepuasan pelanggan..."
            class="w-full bg-nested text-main border border-light rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:border-primary resize-none"
          ></textarea>
        </div>
      </div>
    {/each}
  </div>
</div>
