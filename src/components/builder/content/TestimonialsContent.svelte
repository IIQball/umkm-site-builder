<script lang="ts">
  import { Plus } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import type { TestimonialItem } from '@/types';
  import { Button } from '@/components/ui';
  import { makeHandlePropChange } from './content.helpers';
  import { DEFAULT_TESTIMONIALS } from '../sections/testimonials/testimonials.helpers';
  import { getEffectiveTestimonialsElementOrder } from '../sections/testimonials/testimonialsLayout.helpers';
  import TestimonialItemCard from './TestimonialItemCard.svelte';
  import TestimonialsNodeForms from '../inspector/node-forms/TestimonialsNodeForms.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);

  $: activePreset =
    (section.layoutPreset as string) ||
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    'masonry_grid';

  $: rawTestimonials = section.props?.testimonials;
  $: testimonials = (Array.isArray(rawTestimonials) && rawTestimonials.length > 0
    ? rawTestimonials
    : DEFAULT_TESTIMONIALS) as TestimonialItem[];

  $: elementOrder = getEffectiveTestimonialsElementOrder(
    activePreset,
    section.props?.elementOrder,
    testimonials,
    (section.props?.testimonialsPreset as string) || (section.props?.layoutPreset as string) || (section.layoutPreset as string)
  );

  $: title = (section.props?.title as string) ?? '';
  $: subtitle = (section.props?.subtitle as string) ?? '';
  $: badgeText = (section.props?.badgeText as string) ?? '';

  function getCurrentTestimonials(): TestimonialItem[] {
    const raw = section.props?.testimonials;
    return Array.isArray(raw) && raw.length > 0 ? [...raw] : [...DEFAULT_TESTIMONIALS];
  }

  function handleTestimonialChange(index: number, key: keyof TestimonialItem, value: unknown) {
    const list = getCurrentTestimonials();
    list[index] = { ...list[index], [key]: value };
    onUpdate({
      ...section,
      props: {
        ...(section.props || {}),
        testimonials: list,
      },
    });
  }

  function handleAddReview() {
    const list = getCurrentTestimonials();
    const nextIdx = list.length + 1;
    const newItem: TestimonialItem = {
      id: `testi_${Date.now()}`,
      customerName: `Pelanggan Baru #${nextIdx}`,
      rating: 5,
      comment: 'Kualitas produk sangat memuaskan dan pelayanannya sangat ramah!',
      avatar: '',
      role: 'Pelanggan Terverifikasi',
      platform: 'WhatsApp',
      verified: true,
      verifiedText: 'Pembeli Terverifikasi',
    };
    onUpdate({
      ...section,
      props: {
        ...(section.props || {}),
        testimonials: [...list, newItem],
      },
    });
  }

  function handleRemoveReview(index: number) {
    const list = getCurrentTestimonials();
    const updated = list.filter((_, i) => i !== index);
    onUpdate({
      ...section,
      props: {
        ...(section.props || {}),
        testimonials: updated,
      },
    });
  }

  function handleMoveReview(index: number, direction: 'up' | 'down') {
    const list = getCurrentTestimonials();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    onUpdate({
      ...section,
      props: {
        ...(section.props || {}),
        testimonials: list,
      },
    });
  }
</script>

<div class="space-y-4">
  <!-- Heading Hierarchy Settings (Sesuai dengan slot elementOrder layout) -->
  <div class="space-y-3">
    {#if elementOrder.includes('badge')}
      <div>
        <label for="testi-badge" class="block font-semibold text-xs text-base-content/80 mb-1">
          Teks Lencana (Badge)
        </label>
        <input
          id="testi-badge"
          type="text"
          value={badgeText}
          on:input={(e) => handlePropChange('badgeText', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 border border-base-300 rounded-md text-base-content text-xs placeholder-base-content/40 focus:outline-none focus:border-primary"
          placeholder="Ulasan Pembeli"
        />
      </div>
    {/if}

    {#if elementOrder.includes('title')}
      <div>
        <label for="testi-title" class="block font-semibold text-xs text-base-content/80 mb-1">
          Judul Utama Testimoni (H2)
        </label>
        <input
          id="testi-title"
          type="text"
          value={title}
          on:input={(e) => handlePropChange('title', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 border border-base-300 rounded-md text-base-content text-xs font-bold placeholder-base-content/40 focus:outline-none focus:border-primary"
          placeholder="Kata Mereka yang Sudah Mencoba"
        />
      </div>
    {/if}

    {#if elementOrder.includes('subtitle')}
      <div>
        <label for="testi-subtitle" class="block font-semibold text-xs text-base-content/80 mb-1">
          Deskripsi Subjudul
        </label>
        <textarea
          id="testi-subtitle"
          value={subtitle}
          on:input={(e) => handlePropChange('subtitle', e.currentTarget.value)}
          rows="2"
          class="w-full px-3 py-2 bg-base-200/50 border border-base-300 rounded-md text-base-content text-xs placeholder-base-content/40 focus:outline-none focus:border-primary resize-y"
          placeholder="Kepuasan rasa dan kualitas produk adalah prioritas utama kami."
        ></textarea>
      </div>
    {/if}
  </div>

  <!-- Slot Elemen Tambahan Sesuai Layout Preset -->
  {#if elementOrder.includes('testi_stats')}
    <div class="p-3 bg-base-200/30 border border-base-200 rounded-xl space-y-2">
      <TestimonialsNodeForms {section} nodeId="testi_stats" onPropChange={handlePropChange} />
    </div>
  {/if}

  {#if elementOrder.includes('testi_logo_cloud')}
    <div class="p-3 bg-base-200/30 border border-base-200 rounded-xl space-y-2">
      <TestimonialsNodeForms {section} nodeId="testi_logo_cloud" onPropChange={handlePropChange} />
    </div>
  {/if}

  {#if elementOrder.includes('testi_slider_track')}
    <div class="p-3 bg-base-200/30 border border-base-200 rounded-xl space-y-2">
      <TestimonialsNodeForms {section} nodeId="testi_slider_track" onPropChange={handlePropChange} />
    </div>
  {/if}

  <!-- Testimonials List Management -->
  <div class="pt-3 border-t border-base-200 space-y-3">
    <div class="flex items-center justify-between">
      <span class="block font-semibold text-xs text-base-content/80">
        Daftar Ulasan ({testimonials.length})
      </span>
      <Button
        type="button"
        size="xs"
        variant="ghost"
        on:click={handleAddReview}
        class="!p-0 !h-auto !min-h-0 text-[11px] font-medium text-primary hover:text-primary/80 gap-1 cursor-pointer"
      >
        <Plus size={12} />
        <span>Tambah Ulasan</span>
      </Button>
    </div>

    <div class="space-y-3">
      {#each testimonials as item, index (item.id || index)}
        <TestimonialItemCard
          {item}
          {index}
          totalItems={testimonials.length}
          onFieldChange={(field, val) => handleTestimonialChange(index, field, val)}
          onMove={(dir) => handleMoveReview(index, dir)}
          onRemove={() => handleRemoveReview(index)}
        />
      {/each}
    </div>
  </div>
</div>
