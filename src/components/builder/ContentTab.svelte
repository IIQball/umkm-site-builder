<script lang="ts">
  import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas/template.schema';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  const handlePropChange = (key: string, value: unknown) => {
    const updatedSection: TemplateSection = {
      ...section,
      props: {
        ...(section.props || {}),
        [key]: value,
      },
    };
    onUpdate(updatedSection);
  };

  const handleArrayItemChange = (arrayKey: string, index: number, itemKey: string, value: unknown) => {
    const array = [...((section.props && (section.props[arrayKey] as Record<string, unknown>[])) || [])];
    if (typeof array[index] === 'object' && array[index] !== null) {
      array[index] = {
        ...array[index],
        [itemKey]: value,
      };
    } else {
      (array as unknown[])[index] = value;
    }
    handlePropChange(arrayKey, array);
  };

  const handleAddArrayItem = (arrayKey: string, template: unknown) => {
    const array = [...((section.props && (section.props[arrayKey] as unknown[])) || [])];
    handlePropChange(arrayKey, [...array, template]);
  };

  const handleRemoveArrayItem = (arrayKey: string, index: number) => {
    const array = ((section.props && (section.props[arrayKey] as unknown[])) || []).filter(
      (_: unknown, i: number) => i !== index
    );
    handlePropChange(arrayKey, array);
  };

  const handleMoveArrayItem = (arrayKey: string, index: number, direction: 'up' | 'down') => {
    const array = [...((section.props && (section.props[arrayKey] as unknown[])) || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= array.length) return;
    const temp = array[index];
    array[index] = array[targetIndex];
    array[targetIndex] = temp;
    handlePropChange(arrayKey, array);
  };
</script>

<div class="p-4 space-y-4 text-xs">
  <!-- Header & Announcement -->
  {#if section.type === 'header_announcement'}
    <div class="space-y-3">
      <div>
        <label for="announcement-text" class="block font-semibold text-base-content/80 mb-1">Teks Pengumuman</label>
        <input
          id="announcement-text"
          type="text"
          value={section.props?.announcementText ?? ''}
          on:input={(e) => handlePropChange('announcementText', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="Diskon 20% khusus hari ini..."
        />
      </div>

      <div>
        <span class="block font-semibold text-base-content/80 mb-1">Menu Navigasi (Reorderable)</span>
        <div class="space-y-2">
          {#each section.props?.navLinks || [] as link, index}
            <div class="flex items-center gap-1.5 p-1 bg-base-200/50 dark:bg-slate-950/60 border border-base-300 dark:border-slate-800 rounded-lg">
              <input
                type="text"
                value={link}
                on:input={(e) => {
                  const updated = [...(section.props?.navLinks || [])];
                  updated[index] = e.currentTarget.value;
                  handlePropChange('navLinks', updated);
                }}
                class="flex-1 px-2.5 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
                placeholder="Nama Link"
              />
              <div class="flex items-center">
                <button
                  type="button"
                  on:click={() => handleMoveArrayItem('navLinks', index, 'up')}
                  disabled={index === 0}
                  class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                  title="Pindah ke Atas"
                >
                  <ChevronUp size={13} />
                </button>
                <button
                  type="button"
                  on:click={() => handleMoveArrayItem('navLinks', index, 'down')}
                  disabled={index === (section.props?.navLinks || []).length - 1}
                  class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                  title="Pindah ke Bawah"
                >
                  <ChevronDown size={13} />
                </button>
                <button
                  type="button"
                  on:click={() => handleRemoveArrayItem('navLinks', index)}
                  class="p-1 text-base-content/50 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors cursor-pointer ml-0.5"
                  title="Hapus Link"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          {/each}
          <button
            type="button"
            on:click={() => handleAddArrayItem('navLinks', 'Menu Baru')}
            class="w-full flex items-center justify-center gap-1 py-1.5 border border-dashed border-base-300 dark:border-slate-700 rounded-md text-base-content/60 hover:text-blue-500 hover:border-blue-500 transition-colors cursor-pointer"
          >
            <Plus size={13} />
            <span>Tambah Menu</span>
          </button>
        </div>
      </div>
    </div>

  <!-- Hero Section -->
  {:else if section.type === 'hero'}
    <div class="space-y-3">
      <div>
        <label for="hero-title" class="block font-semibold text-base-content/80 mb-1">Judul Utama (Title)</label>
        <input
          id="hero-title"
          type="text"
          value={section.props?.title ?? ''}
          on:input={(e) => handlePropChange('title', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="Selamat datang di toko kami"
        />
      </div>

      <div>
        <label for="hero-subtitle" class="block font-semibold text-base-content/80 mb-1">Subjudul (Subtitle)</label>
        <textarea
          id="hero-subtitle"
          value={section.props?.subtitle ?? ''}
          on:input={(e) => handlePropChange('subtitle', e.currentTarget.value)}
          rows="3"
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 resize-y"
          placeholder="Produk berkualitas dengan harga terjangkau"
        />
      </div>

      <div>
        <label for="hero-image" class="block font-semibold text-base-content/80 mb-1">URL Gambar Banner</label>
        <input
          id="hero-image"
          type="text"
          value={section.props?.imageUrl ?? ''}
          on:input={(e) => handlePropChange('imageUrl', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="https://images.unsplash.com/..."
        />
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label for="cta-text" class="block font-semibold text-base-content/80 mb-1">Teks Tombol CTA</label>
          <input
            id="cta-text"
            type="text"
            value={section.props?.ctaText ?? ''}
            on:input={(e) => handlePropChange('ctaText', e.currentTarget.value)}
            class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
            placeholder="Lihat Katalog"
          />
        </div>

        <div>
          <label for="cta-link" class="block font-semibold text-base-content/80 mb-1">Link CTA</label>
          <input
            id="cta-link"
            type="text"
            value={section.props?.ctaLink ?? ''}
            on:input={(e) => handlePropChange('ctaLink', e.currentTarget.value)}
            class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
            placeholder="#catalog"
          />
        </div>
      </div>

      <div>
        <label for="tag-name" class="block font-semibold text-base-content/80 mb-1">HTML Tag Heading</label>
        <select
          id="tag-name"
          value={section.props?.tagName ?? 'h1'}
          on:change={(e) => handlePropChange('tagName', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
        >
          <option value="h1">H1 (Primary Heading - SEO Optimal)</option>
          <option value="h2">H2 (Secondary Heading)</option>
        </select>
      </div>
    </div>

  <!-- Features Section -->
  {:else if section.type === 'features'}
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="block font-semibold text-base-content/80">Daftar Fitur / Keunggulan</span>
        <button
          type="button"
          on:click={() => handleAddArrayItem('features', { icon: '⭐', title: 'Fitur Baru', description: 'Deskripsi keunggulan produk/layanan Anda.' })}
          class="flex items-center gap-1 text-[11px] font-medium text-blue-500 hover:text-blue-400 cursor-pointer"
        >
          <Plus size={12} />
          <span>Tambah Fitur</span>
        </button>
      </div>

      <div class="space-y-3">
        {#each section.props?.features || [] as feature, index}
          <div class="p-3 bg-base-200/50 dark:bg-slate-950/60 border border-base-300 dark:border-slate-800 rounded-lg space-y-2">
            <div class="flex items-center justify-between gap-2">
              <input
                type="text"
                value={feature.icon ?? ''}
                on:input={(e) => handleArrayItemChange('features', index, 'icon', e.currentTarget.value)}
                class="w-16 px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-center text-base-content text-sm focus:outline-none focus:border-blue-500"
                placeholder="Icon/Emoji"
              />
              <input
                type="text"
                value={feature.title ?? ''}
                on:input={(e) => handleArrayItemChange('features', index, 'title', e.currentTarget.value)}
                class="flex-1 px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
                placeholder="Judul Fitur"
              />
              <div class="flex items-center">
                <button
                  type="button"
                  on:click={() => handleMoveArrayItem('features', index, 'up')}
                  disabled={index === 0}
                  class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                  title="Pindah ke Atas"
                >
                  <ChevronUp size={13} />
                </button>
                <button
                  type="button"
                  on:click={() => handleMoveArrayItem('features', index, 'down')}
                  disabled={index === (section.props?.features || []).length - 1}
                  class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                  title="Pindah ke Bawah"
                >
                  <ChevronDown size={13} />
                </button>
                <button
                  type="button"
                  on:click={() => handleRemoveArrayItem('features', index)}
                  class="p-1 text-base-content/50 hover:text-rose-500 rounded transition-colors cursor-pointer"
                  title="Hapus Fitur"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <textarea
              value={feature.description ?? ''}
              on:input={(e) => handleArrayItemChange('features', index, 'description', e.currentTarget.value)}
              rows="2"
              class="w-full px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
              placeholder="Deskripsi singkat fitur"
            />
          </div>
        {/each}
      </div>
    </div>

  <!-- Product Catalog Section -->
  {:else if section.type === 'product_catalog'}
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="block font-semibold text-base-content/80">Preview Katalog Produk</span>
        <button
          type="button"
          on:click={() => handleAddArrayItem('products', { name: 'Produk Baru', price: 50000, imageUrl: '', badge: 'Terlaris' })}
          class="flex items-center gap-1 text-[11px] font-medium text-blue-500 hover:text-blue-400 cursor-pointer"
        >
          <Plus size={12} />
          <span>Tambah Item</span>
        </button>
      </div>

      {#if (section.props?.products || []).length === 0}
        <div class="p-4 text-center border border-dashed border-base-300 dark:border-slate-800 rounded-lg text-base-content/50">
          <p>Belum ada produk preview.</p>
          <button
            type="button"
            on:click={() => handleAddArrayItem('products', { name: 'Produk Contoh', price: 75000, imageUrl: '', badge: 'Populer' })}
            class="mt-2 text-xs text-blue-500 hover:underline inline-block cursor-pointer"
          >
            + Buat Produk Contoh
          </button>
        </div>
      {:else}
        <div class="space-y-3">
          {#each section.props?.products || [] as product, index}
            <div class="p-3 bg-base-200/50 dark:bg-slate-950/60 border border-base-300 dark:border-slate-800 rounded-lg space-y-2">
              <div class="flex items-center justify-between gap-1.5">
                <input
                  type="text"
                  value={product.name ?? ''}
                  on:input={(e) => handleArrayItemChange('products', index, 'name', e.currentTarget.value)}
                  class="flex-1 px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
                  placeholder="Nama Produk"
                />
                <div class="flex items-center">
                  <button
                    type="button"
                    on:click={() => handleMoveArrayItem('products', index, 'up')}
                    disabled={index === 0}
                    class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                    title="Pindah ke Atas"
                  >
                    <ChevronUp size={13} />
                  </button>
                  <button
                    type="button"
                    on:click={() => handleMoveArrayItem('products', index, 'down')}
                    disabled={index === (section.props?.products || []).length - 1}
                    class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                    title="Pindah ke Bawah"
                  >
                    <ChevronDown size={13} />
                  </button>
                  <button
                    type="button"
                    on:click={() => handleRemoveArrayItem('products', index)}
                    class="p-1 text-base-content/50 hover:text-rose-500 rounded transition-colors cursor-pointer"
                    title="Hapus Produk"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={product.price ?? 0}
                  on:input={(e) => handleArrayItemChange('products', index, 'price', Number(e.currentTarget.value))}
                  class="w-full px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="Harga (Rp)"
                />
                <input
                  type="text"
                  value={product.badge ?? ''}
                  on:input={(e) => handleArrayItemChange('products', index, 'badge', e.currentTarget.value)}
                  class="w-full px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
                  placeholder="Badge (opsional)"
                />
              </div>

              <input
                type="text"
                value={product.imageUrl ?? ''}
                on:input={(e) => handleArrayItemChange('products', index, 'imageUrl', e.currentTarget.value)}
                class="w-full px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
                placeholder="URL Foto Produk"
              />
            </div>
          {/each}
        </div>
      {/if}
    </div>

  <!-- Testimonials Section -->
  {:else if section.type === 'testimonials'}
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="block font-semibold text-base-content/80">Daftar Testimoni</span>
        <button
          type="button"
          on:click={() => handleAddArrayItem('testimonials', { customerName: 'Nama Pelanggan', rating: 5, comment: 'Pelayanan sangat ramah dan memuaskan!' })}
          class="flex items-center gap-1 text-[11px] font-medium text-blue-500 hover:text-blue-400 cursor-pointer"
        >
          <Plus size={12} />
          <span>Tambah Testimoni</span>
        </button>
      </div>

      <div class="space-y-3">
        {#each section.props?.testimonials || [] as item, index}
          <div class="p-3 bg-base-200/50 dark:bg-slate-950/60 border border-base-300 dark:border-slate-800 rounded-lg space-y-2">
            <div class="flex items-center justify-between gap-2">
              <input
                type="text"
                value={item.customerName ?? ''}
                on:input={(e) => handleArrayItemChange('testimonials', index, 'customerName', e.currentTarget.value)}
                class="flex-1 px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
                placeholder="Nama Pelanggan"
              />
              <select
                value={item.rating ?? 5}
                on:change={(e) => handleArrayItemChange('testimonials', index, 'rating', Number(e.currentTarget.value))}
                class="w-20 px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content text-xs focus:outline-none focus:border-blue-500"
              >
                <option value={5}>⭐⭐⭐⭐⭐</option>
                <option value={4}>⭐⭐⭐⭐</option>
                <option value={3}>⭐⭐⭐</option>
                <option value={2}>⭐⭐</option>
                <option value={1}>⭐</option>
              </select>
              <div class="flex items-center">
                <button
                  type="button"
                  on:click={() => handleMoveArrayItem('testimonials', index, 'up')}
                  disabled={index === 0}
                  class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                  title="Pindah ke Atas"
                >
                  <ChevronUp size={13} />
                </button>
                <button
                  type="button"
                  on:click={() => handleMoveArrayItem('testimonials', index, 'down')}
                  disabled={index === (section.props?.testimonials || []).length - 1}
                  class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                  title="Pindah ke Bawah"
                >
                  <ChevronDown size={13} />
                </button>
                <button
                  type="button"
                  on:click={() => handleRemoveArrayItem('testimonials', index)}
                  class="p-1 text-base-content/50 hover:text-rose-500 rounded transition-colors cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <textarea
              value={item.comment ?? ''}
              on:input={(e) => handleArrayItemChange('testimonials', index, 'comment', e.currentTarget.value)}
              rows="2"
              class="w-full px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
              placeholder="Ulasan pelanggan..."
            />
          </div>
        {/each}
      </div>
    </div>

  <!-- FAQ Section -->
  {:else if section.type === 'faq'}
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="block font-semibold text-base-content/80">Daftar FAQ (Tanya Jawab)</span>
        <button
          type="button"
          on:click={() => handleAddArrayItem('faqs', { question: 'Pertanyaan baru?', answer: 'Jawaban penjelasan untuk pelanggan.' })}
          class="flex items-center gap-1 text-[11px] font-medium text-blue-500 hover:text-blue-400 cursor-pointer"
        >
          <Plus size={12} />
          <span>Tambah FAQ</span>
        </button>
      </div>

      <div class="space-y-3">
        {#each section.props?.faqs || [] as faq, index}
          <div class="p-3 bg-base-200/50 dark:bg-slate-950/60 border border-base-300 dark:border-slate-800 rounded-lg space-y-2">
            <div class="flex items-center justify-between gap-2">
              <input
                type="text"
                value={faq.question ?? ''}
                on:input={(e) => handleArrayItemChange('faqs', index, 'question', e.currentTarget.value)}
                class="flex-1 px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
                placeholder="Pertanyaan..."
              />
              <div class="flex items-center">
                <button
                  type="button"
                  on:click={() => handleMoveArrayItem('faqs', index, 'up')}
                  disabled={index === 0}
                  class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                  title="Pindah ke Atas"
                >
                  <ChevronUp size={13} />
                </button>
                <button
                  type="button"
                  on:click={() => handleMoveArrayItem('faqs', index, 'down')}
                  disabled={index === (section.props?.faqs || []).length - 1}
                  class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                  title="Pindah ke Bawah"
                >
                  <ChevronDown size={13} />
                </button>
                <button
                  type="button"
                  on:click={() => handleRemoveArrayItem('faqs', index)}
                  class="p-1 text-base-content/50 hover:text-rose-500 rounded transition-colors cursor-pointer"
                  title="Hapus FAQ"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <textarea
              value={faq.answer ?? ''}
              on:input={(e) => handleArrayItemChange('faqs', index, 'answer', e.currentTarget.value)}
              rows="2"
              class="w-full px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
              placeholder="Jawaban penjelasan..."
            />
          </div>
        {/each}
      </div>
    </div>

  <!-- Footer Section -->
  {:else if section.type === 'footer'}
    <div class="space-y-3">
      <div>
        <label for="whatsapp-number" class="block font-semibold text-base-content/80 mb-1">Nomor WhatsApp Toko</label>
        <input
          id="whatsapp-number"
          type="text"
          value={section.props?.whatsappNumber ?? ''}
          on:input={(e) => handlePropChange('whatsappNumber', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 font-mono"
          placeholder="628123456789"
        />
        <p class="text-[11px] text-base-content/50 mt-1">Gunakan format internasional tanpa simbol (contoh: 628123456789).</p>
      </div>

      <div>
        <label for="store-address" class="block font-semibold text-base-content/80 mb-1">Alamat Fisik / Lokasi Toko</label>
        <textarea
          id="store-address"
          value={section.props?.address ?? ''}
          on:input={(e) => handlePropChange('address', e.currentTarget.value)}
          rows="3"
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 resize-y"
          placeholder="Jl. Merdeka No. 123, Kota Anda"
        />
      </div>

      <div>
        <label for="copyright-text" class="block font-semibold text-base-content/80 mb-1">Teks Hak Cipta (Copyright)</label>
        <input
          id="copyright-text"
          type="text"
          value={section.props?.copyrightText ?? ''}
          on:input={(e) => handlePropChange('copyrightText', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="© 2026 Toko Kami. Semua hak dilindungi."
        />
      </div>
    </div>
  {/if}
</div>
