<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import type { TestimonialItem } from '@/types';
  import { Upload, X, Loader2, Star } from 'lucide-svelte';
  import {
    compressToWebP,
    uploadToCloudinary,
    deleteOldImage,
  } from '../imageUpload.helpers';
  import {
    isTestimonialsImageSupported,
    DEFAULT_TESTIMONIALS,
    DEFAULT_CLIENT_LOGOS,
    type ClientLogoItem,
  } from '../../sections/testimonials/testimonials.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: activePreset = (section.layoutPreset || section.props?.layoutPreset || section.styles?.layoutPreset || 'masonry_grid') as string;
  $: hasImageSupport = isTestimonialsImageSupported(activePreset);

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
    return 0;
  })();

  $: currentTesti = testimonials[itemIndex] || testimonials[0];
  $: currentLogo = logos[itemIndex] || logos[0];

  let isUploading = false;
  let errorMessage = '';
  let fileInput: HTMLInputElement;

  function updateTestiField(field: keyof TestimonialItem, value: any) {
    const updated = [...testimonials];
    if (updated[itemIndex]) {
      updated[itemIndex] = { ...updated[itemIndex], [field]: value };
      onPropChange('testimonials', updated);
    }
  }

  async function handleAvatarUpload(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    errorMessage = '';
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      errorMessage = 'Format file wajib JPG, JPEG, atau PNG';
      return;
    }

    try {
      isUploading = true;
      const webpBlob = await compressToWebP(file, 400, 400);
      const url = await uploadToCloudinary(webpBlob, 'testimonials', `${Date.now()}_testi_${itemIndex}.webp`);

      const oldUrl = currentTesti?.avatar;
      if (oldUrl && oldUrl !== url) {
        await deleteOldImage(oldUrl);
      }
      updateTestiField('avatar', url);
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Upload gambar gagal';
    } finally {
      isUploading = false;
      if (fileInput) fileInput.value = '';
    }
  }

  async function handleRemoveAvatar() {
    const oldUrl = currentTesti?.avatar;
    updateTestiField('avatar', '');
    if (oldUrl) {
      await deleteOldImage(oldUrl);
    }
  }
</script>

{#if nodeId === 'testimonials_header' || nodeId === 'header'}
  <div class="space-y-3 text-left">
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="testi-header-title">Judul Section Testimoni (H2)</label>
      <input
        id="testi-header-title"
        type="text"
        value={title}
        on:input={(e) => onPropChange('title', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-bold"
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
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        placeholder="Ulasan kepuasan pelanggan..."
      ></textarea>
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="testi-header-badge">Teks Badge Ulasan</label>
      <input
        id="testi-header-badge"
        type="text"
        value={badgeText}
        on:input={(e) => onPropChange('badgeText', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        placeholder="Ulasan Pembeli"
      />
    </div>
  </div>
{:else if nodeId.startsWith('testi_avatar_')}
  {#if hasImageSupport}
    <div class="space-y-4 text-left">
      <div class="space-y-1.5">
        <label class="font-semibold text-xs text-base-content" for="testi-avatar-upload">
          Foto Avatar: {currentTesti?.customerName || `Pengulas #${itemIndex + 1}`}
        </label>
        {#if currentTesti?.avatar}
          <div class="relative group rounded-xl overflow-hidden border border-base-300 dark:border-slate-800 bg-base-200/50 p-2 flex items-center gap-3">
            <img
              src={currentTesti.avatar}
              alt="Avatar Preview"
              class="w-12 h-12 object-cover rounded-full border border-base-300 dark:border-slate-700 bg-white"
            />
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold truncate text-base-content">{currentTesti.customerName || 'Avatar'}</p>
              <p class="text-[10px] text-base-content/60">Cloudinary WebP</p>
            </div>
            <button
              type="button"
              on:click={handleRemoveAvatar}
              class="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
              title="Hapus Foto"
            >
              <X size={14} />
            </button>
          </div>
        {:else}
          <button
            type="button"
            on:click={() => fileInput?.click()}
            disabled={isUploading}
            class="w-full border-2 border-dashed border-base-300 dark:border-slate-800 hover:border-primary/50 rounded-xl p-5 text-center cursor-pointer transition-colors bg-base-200/30 flex flex-col items-center gap-1.5"
          >
            {#if isUploading}
              <Loader2 size={18} class="animate-spin text-primary" />
              <span class="text-xs text-primary font-medium">Mengunggah...</span>
            {:else}
              <Upload size={18} class="text-base-content/50" />
              <span class="text-xs font-medium text-base-content">Pilih Foto Avatar (PNG/JPG)</span>
              <span class="text-[10px] text-base-content/60">Kompresi otomatis WebP</span>
            {/if}
          </button>
        {/if}
        <input
          id="testi-avatar-upload"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          bind:this={fileInput}
          on:change={handleAvatarUpload}
          class="hidden"
        />
        {#if errorMessage}
          <p class="text-[11px] text-error font-medium">{errorMessage}</p>
        {/if}
      </div>

      <div class="space-y-1">
        <label class="font-semibold text-xs text-base-content" for="testi-avatar-url">URL Foto Manual</label>
        <input
          id="testi-avatar-url"
          type="text"
          value={currentTesti?.avatar || ''}
          on:input={(e) => updateTestiField('avatar', e.currentTarget.value)}
          class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
          placeholder="https://images.unsplash.com/..."
        />
      </div>
    </div>
  {:else}
    <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl text-left">
      Preset tata letak ini tidak menggunakan ilustrasi avatar gambar.
    </p>
  {/if}
{:else if nodeId.startsWith('testi_item_')}
  <div class="space-y-3 text-left">
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="testi-name">Nama Pengulas</label>
      <input
        id="testi-name"
        type="text"
        value={currentTesti?.customerName || ''}
        on:input={(e) => updateTestiField('customerName', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-bold"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="testi-role">Keterangan / Lokasi / Domisili</label>
      <input
        id="testi-role"
        type="text"
        value={currentTesti?.role || ''}
        on:input={(e) => updateTestiField('role', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        placeholder="Pembeli Terverifikasi • Banyuwangi"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="testi-rating">Bintang Rating (1-5)</label>
      <div class="flex items-center gap-2">
        <input
          id="testi-rating"
          type="number"
          min="1"
          max="5"
          value={currentTesti?.rating || 5}
          on:input={(e) => updateTestiField('rating', parseInt(e.currentTarget.value, 10) || 5)}
          class="w-20 px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-mono"
        />
        <div class="flex items-center gap-0.5 text-amber-400">
          {#each Array(currentTesti?.rating || 5) as _}
            <Star size={13} class="fill-amber-400 text-amber-400" />
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
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
      ></textarea>
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
      class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
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
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-bold"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="testi-spotlight-role">Identitas / Keterangan Order</label>
      <input
        id="testi-spotlight-role"
        type="text"
        value={currentTesti?.role || ''}
        on:input={(e) => updateTestiField('role', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
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
