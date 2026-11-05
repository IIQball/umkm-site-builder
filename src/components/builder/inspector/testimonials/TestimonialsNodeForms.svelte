<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import type { TestimonialItem } from '@/types';
  import { Star, CheckCircle2 } from 'lucide-svelte';
  import ImageUploadDropzone from '../ImageUploadDropzone.svelte';
  import {
    DEFAULT_TESTIMONIALS,
    DEFAULT_CLIENT_LOGOS,
    type ClientLogoItem,
  } from '../../sections/testimonials/testimonials.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: testimonials = (Array.isArray(section.props?.testimonials) && section.props.testimonials.length > 0
    ? (section.props.testimonials as TestimonialItem[])
    : DEFAULT_TESTIMONIALS) as TestimonialItem[];

  $: logos = (Array.isArray(section.props?.logos) && section.props.logos.length > 0
    ? (section.props.logos as ClientLogoItem[])
    : DEFAULT_CLIENT_LOGOS) as ClientLogoItem[];

  $: title = (section.props?.title as string) || (section.props?.heading as string) || '';
  $: subtitle = (section.props?.subtitle as string) || '';
  $: badgeText = (section.props?.badgeText as string) || '';

  $: itemIndex = (() => {
    if (nodeId.startsWith('testi_item_')) return parseInt(nodeId.replace('testi_item_', ''), 10);
    if (nodeId.startsWith('testi_avatar_')) return parseInt(nodeId.replace('testi_avatar_', ''), 10);
    if (nodeId.startsWith('testi_logo_')) return parseInt(nodeId.replace('testi_logo_', ''), 10);
    if (nodeId.startsWith('item_')) return parseInt(nodeId.replace('item_', ''), 10);
    const foundIdx = testimonials.findIndex((t) => t.id === nodeId);
    if (foundIdx !== -1) return foundIdx;
    return 0;
  })();

  $: currentTesti = testimonials[itemIndex] || testimonials[0];
  $: currentLogo = logos[itemIndex] || logos[0];

  function updateTestiField(field: keyof TestimonialItem, value: any) {
    const updated = [...testimonials];
    if (updated[itemIndex]) {
      updated[itemIndex] = { ...updated[itemIndex], [field]: value };
      onPropChange('testimonials', updated);
    }
  }
</script>

{#if nodeId === 'testimonials_header' || nodeId === 'header' || nodeId === 'testimonials_container' || nodeId === 'testimonials_grid'}
  <div class="space-y-3 text-left">
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="testi-header-badge">Teks Lencana (Badge)</label>
      <input
        id="testi-header-badge"
        type="text"
        value={badgeText}
        on:input={(e) => onPropChange('badgeText', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        placeholder="Ulasan Pembeli"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="testi-header-title">Judul Section Testimoni (H2)</label>
      <input
        id="testi-header-title"
        type="text"
        value={title}
        on:input={(e) => onPropChange('title', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-bold"
        placeholder="Kata Mereka yang Sudah Mencoba"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="testi-header-sub">Deskripsi Subjudul</label>
      <textarea
        id="testi-header-sub"
        rows="2"
        value={subtitle}
        on:input={(e) => onPropChange('subtitle', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        placeholder="Ulasan kepuasan pelanggan..."
      ></textarea>
    </div>
  </div>
{:else if nodeId === 'title'}
  <div class="space-y-1 text-left">
    <label class="font-semibold text-xs text-base-content" for="testi-title-node">Judul Utama Testimoni (H2)</label>
    <input
      id="testi-title-node"
      type="text"
      value={title}
      on:input={(e) => onPropChange('title', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-bold"
      placeholder="Kata Mereka yang Sudah Mencoba"
    />
  </div>
{:else if nodeId === 'subtitle'}
  <div class="space-y-1 text-left">
    <label class="font-semibold text-xs text-base-content" for="testi-subtitle-node">Deskripsi Subjudul</label>
    <textarea
      id="testi-subtitle-node"
      rows="3"
      value={subtitle}
      on:input={(e) => onPropChange('subtitle', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
      placeholder="Ulasan kepuasan pelanggan..."
    ></textarea>
  </div>
{:else if nodeId === 'badge'}
  <div class="space-y-1 text-left">
    <label class="font-semibold text-xs text-base-content" for="testi-badge-node">Teks Lencana (Badge)</label>
    <input
      id="testi-badge-node"
      type="text"
      value={badgeText}
      on:input={(e) => onPropChange('badgeText', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
      placeholder="Ulasan Pembeli"
    />
  </div>
{:else if nodeId.startsWith('testi_avatar_')}
  <div class="space-y-3 text-left">
    <ImageUploadDropzone
      imageUrl={currentTesti?.avatar || ''}
      onImageChange={(url) => updateTestiField('avatar', url)}
      label={`Foto Avatar: ${currentTesti?.customerName || `Pengulas #${itemIndex + 1}`}`}
      maxWidth={400}
      maxHeight={400}
      folder="testimonials"
    />
  </div>
{:else if nodeId.startsWith('testi_item_') || nodeId.startsWith('item_') || testimonials.some(t => t.id === nodeId)}
  <div class="space-y-3 text-left">
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="testi-name">Nama Pengulas</label>
      <input
        id="testi-name"
        type="text"
        value={currentTesti?.customerName || ''}
        on:input={(e) => updateTestiField('customerName', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-bold"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="testi-role">Keterangan / Lokasi / Domisili</label>
      <input
        id="testi-role"
        type="text"
        value={currentTesti?.role || ''}
        on:input={(e) => updateTestiField('role', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        placeholder="Pelanggan Setia • Banyuwangi"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="testi-rating">
        Jumlah Bintang Rating: {currentTesti?.rating || 5} / 5
      </label>
      <div class="flex items-center gap-2">
        <input
          id="testi-rating"
          type="range"
          min="1"
          max="5"
          step="1"
          value={currentTesti?.rating || 5}
          on:input={(e) => updateTestiField('rating', parseInt(e.currentTarget.value, 10) || 5)}
          class="range range-xs range-warning flex-1 cursor-pointer"
          aria-label="Jumlah Bintang Rating"
        />
        <div class="flex items-center gap-0.5 text-amber-400 shrink-0">
          {#each Array(currentTesti?.rating || 5) as _}
            <Star size={12} class="fill-current text-amber-400" />
          {/each}
        </div>
      </div>
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="testi-comment">Isi Ulasan Testimoni</label>
      <textarea
        id="testi-comment"
        rows="3"
        value={currentTesti?.comment || ''}
        on:input={(e) => updateTestiField('comment', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
      ></textarea>
    </div>

    <!-- Verified Badge Setting -->
    <div class="p-2.5 bg-base-200/60 border border-base-300 rounded-lg space-y-1.5">
      <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-base-content">
        <input
          type="checkbox"
          checked={currentTesti?.verified !== false}
          on:change={(e) => updateTestiField('verified', e.currentTarget.checked)}
          class="checkbox checkbox-primary checkbox-xs rounded"
        />
        <span class="flex items-center gap-1 text-emerald-600">
          <CheckCircle2 size={12} />
          <span>Status Pembeli Terverifikasi</span>
        </span>
      </label>
      {#if currentTesti?.verified !== false}
        <input
          type="text"
          value={currentTesti?.verifiedText ?? 'Pembeli Terverifikasi'}
          on:input={(e) => updateTestiField('verifiedText', e.currentTarget.value)}
          class="w-full px-2.5 py-1 bg-base-100 border border-base-300 rounded text-2xs text-base-content focus:outline-none focus:border-primary"
          placeholder="Teks lencana terverifikasi"
        />
      {/if}
    </div>

    <!-- Foto Avatar -->
    <div class="space-y-1 pt-1">
      <span class="block font-semibold text-xs text-base-content">Foto Avatar Pengulas</span>
      <ImageUploadDropzone
        imageUrl={currentTesti?.avatar || ''}
        onImageChange={(url) => updateTestiField('avatar', url)}
        label={`Foto ${currentTesti?.customerName || `Pengulas #${itemIndex + 1}`}`}
        folder="testimonials"
        compact={true}
      />
    </div>
  </div>
{:else if nodeId === 'testi_spotlight_quote'}
  <div class="space-y-1 text-left">
    <label class="font-semibold text-xs text-base-content" for="testi-spotlight-quote-inp">Kutipan Ulasan Utama Spotlight</label>
    <textarea
      id="testi-spotlight-quote-inp"
      rows="4"
      value={currentTesti?.comment || ''}
      on:input={(e) => updateTestiField('comment', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
    ></textarea>
  </div>
{:else if nodeId === 'testi_spotlight_author'}
  <div class="space-y-3 text-left">
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="testi-spotlight-name">Nama Pembeli</label>
      <input
        id="testi-spotlight-name"
        type="text"
        value={currentTesti?.customerName || ''}
        on:input={(e) => updateTestiField('customerName', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-bold"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="testi-spotlight-role">Identitas / Keterangan Order</label>
      <input
        id="testi-spotlight-role"
        type="text"
        value={currentTesti?.role || ''}
        on:input={(e) => updateTestiField('role', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
      />
    </div>
  </div>
{:else if nodeId === 'testi_stats'}
  <div class="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl space-y-1 text-left">
    <p class="font-semibold text-xs text-amber-700 dark:text-amber-300">Skor Rating Agregat</p>
    <p class="text-[11px] text-base-content/70">
      Kalkulasi otomatis rata-rata skor bintang ulasan dan akumulasi jumlah ulasan terverifikasi pelanggan.
    </p>
  </div>
{:else if nodeId === 'testi_slider_track'}
  <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl space-y-1 text-left">
    <p class="font-semibold text-xs text-blue-700 dark:text-blue-300">Track Slider Ulasan</p>
    <p class="text-[11px] text-base-content/70">
      Menampilkan ulasan pelanggan secara dinamis dengan interaksi navigasi sentuh atau rotasi otomatis loop.
    </p>
  </div>
{:else if nodeId === 'testi_logo_cloud' || nodeId.startsWith('testi_logo_')}
  <div class="space-y-2 text-left">
    <p class="font-semibold text-xs text-base-content">Logo Kemitraan: {currentLogo?.name || 'Mitra'}</p>
    <p class="text-[11px] text-base-content/60">
      Menampilkan logo instansi, komunitas, atau mitra korporat yang telah mempercayai UMKM Anda.
    </p>
  </div>
{/if}
