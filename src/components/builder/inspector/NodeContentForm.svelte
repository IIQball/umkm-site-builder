<script lang="ts">
  import { Sparkles, Trash2, Menu, Plus, Upload, X, Loader2 } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../stores/editorStore';
  import {
    makeHandleAddArrayItem,
    makeHandleRemoveArrayItem,
  } from '../content/content.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};
  export let onSectionUpdate: (section: TemplateSection) => void = () => {};

  $: handleAddArrayItem = makeHandleAddArrayItem(section, onSectionUpdate);
  $: handleRemoveArrayItem = makeHandleRemoveArrayItem(section, onSectionUpdate);

  // Helper aman untuk membaca style node tanpa error type '{}'
  function getTitleStyle(property: 'color' | 'backgroundColor'): string {
    const nodeStyles = section.props?.nodeStyles as Record<string, Record<string, string>> | undefined;
    return nodeStyles?.title?.[property] ?? '';
  }

  $: showAnnouncement = (section.props?.showAnnouncement as boolean) ?? true;
  $: logoType = section.props?.logoType || 'image_text';
  $: navLinks = (section.props?.navLinks as string[]) || [];
  $: subtitle = (section.props?.subtitle as string) ?? '';
  $: imageUrl = (section.props?.imageUrl as string) ?? '';
  $: imageMode = (section.props?.imageMode as 'element' | 'background') ?? 'element';
  $: logoImageUrl = (section.props?.logoImageUrl as string) ?? '';

  // ── File Upload & WebP Compressor State ──
  let isUploading = false;
  let isDragging = false;
  let uploadProgress = 0;
  let errorMessage = '';
  let fileInput: HTMLInputElement;
  let logoFileInput: HTMLInputElement;

  async function compressToWebP(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width / height > MAX_WIDTH / MAX_HEIGHT) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context tidak tersedia'));
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.8;
        const tryExport = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('Gagal kompresi WebP'));
              if (blob.size > 200 * 1024 && q > 0.4) {
                tryExport(q - 0.15);
              } else {
                resolve(blob);
              }
            },
            'image/webp',
            q
          );
        };
        tryExport(quality);
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.src = URL.createObjectURL(file);
    });
  }

  async function deleteOldImage(urlToDelete: string) {
    if (!urlToDelete || !urlToDelete.includes('cloudinary.com')) return;
    try {
      await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToDelete }),
      });
    } catch {
      // Ignore background cleanup failure
    }
  }

  async function processSelectedFile(file: File, propKey: string = 'imageUrl') {
    errorMessage = '';
    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      errorMessage = 'Format file wajib JPG, JPEG, atau PNG';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errorMessage = 'Ukuran maksimal file sebelum dikompresi adalah 5MB';
      return;
    }

    try {
      isUploading = true;
      uploadProgress = 20;

      const webpBlob = await compressToWebP(file);
      uploadProgress = 50;

      const signRes = await fetch('/api/media/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'templates' }),
      });

      if (!signRes.ok) throw new Error('Gagal mendapatkan signature');
      const { data: signData } = await signRes.json();
      uploadProgress = 70;

      const formData = new FormData();
      formData.append('file', webpBlob, `${Date.now()}_banner.webp`);
      formData.append('api_key', signData.apiKey);
      formData.append('timestamp', signData.timestamp);
      formData.append('signature', signData.signature);
      formData.append('folder', signData.folder);

      const cloudRes = await fetch(signData.uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!cloudRes.ok) throw new Error('Upload ke Cloudinary gagal');
      const cloudData = await cloudRes.json();
      uploadProgress = 100;

      const oldUrl = (section.props?.[propKey] as string) || '';
      if (oldUrl && oldUrl !== cloudData.secure_url) {
        await deleteOldImage(oldUrl);
      }

      onPropChange(propKey, cloudData.secure_url);
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Upload gagal';
    } finally {
      isUploading = false;
      if (fileInput) fileInput.value = '';
      if (logoFileInput) logoFileInput.value = '';
    }
  }

  function handleLogoFileChange(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const f = target.files?.[0];
    if (f) processSelectedFile(f, 'logoImageUrl');
  }

  function handleImageFileChange(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const f = target.files?.[0];
    if (f) processSelectedFile(f, 'imageUrl');
  }

  async function handleRemoveNodeImage(propKey: string = 'imageUrl') {
    const oldUrl = (section.props?.[propKey] as string) || '';
    onPropChange(propKey, '');
    if (oldUrl) {
      await deleteOldImage(oldUrl);
    }
  }

  const getNodeLabel = (id: string): string => {
    switch (id) {
      case 'badge': return 'Promo Badge';
      case 'title': return 'Heading Title';
      case 'subtitle': return 'Subtitle Description';
      case 'image': return 'Banner Image';
      case 'cta': return 'CTA Button';
      case 'announcement': return 'Announcement Bar';
      case 'logo': return 'Logo & Brand';
      case 'nav_links': return 'Navigation Menu';
      default: return id;
    }
  };
  // Token-Based Color Presets for Nodes
  const nodeTextColorOptions = [
    { value: '', label: 'Default (Tema)' },
    { value: 'var(--theme-text-primary, #0f172a)', label: 'Teks Utama (Text Primary)' },
    { value: 'var(--theme-text-muted, #64748b)', label: 'Teks Redup (Text Muted)' },
    { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand (Warna Utama)' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
    { value: '#ffffff', label: 'Putih Bersih (White)' },
  ];

  const nodeBgColorOptions = [
    { value: 'transparent', label: 'Transparan' },
    { value: 'var(--theme-bg, #ffffff)', label: 'Background Kanvas' },
    { value: 'var(--theme-surface, #f8fafc)', label: 'Surface / Card Background' },
    { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
  ];

  const nodeMarginOptions = [
    { value: '0px', label: '0px (Tanpa Jarak)' },
    { value: '8px', label: '8px (Ketat)' },
    { value: '16px', label: '16px (Normal)' },
    { value: '24px', label: '24px (Renggang)' },
    { value: '32px', label: '32px (Lebar)' },
    { value: '48px', label: '48px (Sangat Lebar)' },
  ];

  const btnVariantOptions = [
    { value: 'primary', label: 'Primary Brand (Solid)' },
    { value: 'secondary', label: 'Secondary Brand (Solid)' },
    { value: 'outline', label: 'Outline (Garis Tepi)' },
  ];

  const btnHeightOptions = [
    { value: '32px', label: '32px (Compact)' },
    { value: '40px', label: '40px (Normal)' },
    { value: '48px', label: '48px (Large)' },
    { value: '56px', label: '56px (Jumbo)' },
  ];
</script>

<div class="p-4 space-y-4 text-xs text-base-content/80">
  <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl space-y-1 mb-2">
    <div class="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold">
      <Sparkles size={13} />
      <span>Edit Konten: {getNodeLabel(nodeId)}</span>
    </div>
    <p class="text-[11px] text-base-content/60">
      Atur konten dan styling token elemen secara presisi pada 8pt grid.
    </p>
  </div>

  {#if nodeId === 'announcement'}
    <div class="space-y-3">
      <div class="flex items-center justify-between p-2 bg-base-200/50 dark:bg-slate-900 rounded-lg">
        <span class="font-semibold text-base-content">Tampilkan Bar</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showAnnouncement}
            on:change={(e) => onPropChange('showAnnouncement', e.currentTarget.checked)}
            class="sr-only peer"
          />
          <div class="w-8 h-4 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div>
        <label for="node-announcement-text" class="block font-semibold text-base-content/80 mb-1">Teks Pengumuman</label>
        <input
          id="node-announcement-text"
          type="text"
          value={section.props?.announcementText ?? ''}
          on:input={(e) => onPropChange('announcementText', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
          placeholder="Diskon 20% khusus hari ini"
        />
      </div>
    </div>
  {:else if nodeId === 'logo'}
    <div class="space-y-3">
      <div>
        <span class="block font-semibold text-base-content/80 mb-1">Mode Tampilan Logo</span>
        <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
          <button
            type="button"
            on:click={() => onPropChange('logoType', 'image_only')}
            class={`py-1 rounded font-medium transition-colors cursor-pointer ${
              logoType === 'image_only' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
            }`}
          >
            Gambar
          </button>
          <button
            type="button"
            on:click={() => onPropChange('logoType', 'text_only')}
            class={`py-1 rounded font-medium transition-colors cursor-pointer ${
              logoType === 'text_only' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
            }`}
          >
            Teks
          </button>
          <button
            type="button"
            on:click={() => onPropChange('logoType', 'image_text')}
            class={`py-1 rounded font-medium transition-colors cursor-pointer ${
              logoType === 'image_text' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
            }`}
          >
            Kombinasi
          </button>
        </div>
      </div>

      {#if logoType === 'text_only' || logoType === 'image_text'}
        <div>
          <label for="node-logo-text" class="block font-semibold text-base-content/80 mb-1">Nama Toko / Brand</label>
          <input
            id="node-logo-text"
            type="text"
            value={section.props?.logoText ?? ''}
            on:input={(e) => onPropChange('logoText', e.currentTarget.value)}
            class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
            placeholder="Nama Brand UMKM"
          />
        </div>
      {/if}

      {#if logoType === 'image_only' || logoType === 'image_text'}
        <div>
          <span class="block font-semibold text-base-content/80 mb-1.5">Gambar Logo Toko</span>
          {#if logoImageUrl}
            <div class="relative group rounded-xl overflow-hidden aspect-video bg-base-200 border border-base-300 mb-2">
              <img src={logoImageUrl} alt="Logo" class="w-full h-full object-contain p-2" />
              <button
                type="button"
                on:click={() => handleRemoveNodeImage('logoImageUrl')}
                class="btn btn-circle btn-error btn-xs absolute top-2 right-2 shadow-lg"
              >
                <X size={13} />
              </button>
            </div>
          {/if}
          <input
            bind:this={logoFileInput}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            class="hidden"
            on:change={handleLogoFileChange}
          />
          <button
            type="button"
            disabled={isUploading}
            on:click={() => logoFileInput?.click()}
            class="w-full py-3 px-3 border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 rounded-xl flex flex-col items-center justify-center gap-1 text-primary cursor-pointer disabled:opacity-50"
          >
            {#if isUploading}
              <Loader2 size={20} class="animate-spin" />
              <span class="font-bold">Mengunggah... {uploadProgress}%</span>
            {:else}
              <Upload size={18} />
              <span class="font-bold">{logoImageUrl ? 'Ganti Logo' : 'Pilih File Logo'}</span>
            {/if}
          </button>
        </div>
      {/if}
    </div>
  {:else if nodeId === 'nav_links' || nodeId.startsWith('nav_')}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 font-semibold text-base-content">
        <Menu size={14} class="text-blue-500" />
        <span>Daftar Menu Navigasi</span>
      </div>
      <div class="space-y-2">
        {#each navLinks as link, index}
          <div class="flex items-center gap-1.5 p-1 bg-base-200/50 dark:bg-slate-950/80 border border-base-300 dark:border-slate-800 rounded-lg">
            <input
              type="text"
              value={link}
              on:input={(e) => {
                const updated = [...navLinks];
                updated[index] = e.currentTarget.value;
                onPropChange('navLinks', updated);
              }}
              class="flex-1 px-2.5 py-1 bg-transparent text-xs text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
              placeholder="Nama Menu"
            />
            <button
              type="button"
              on:click={() => handleRemoveArrayItem('navLinks', index)}
              class="p-1 text-base-content/50 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
              title="Hapus Menu"
            >
              <Trash2 size={13} />
            </button>
          </div>
        {/each}
        <button
          type="button"
          on:click={() => handleAddArrayItem('navLinks', 'Menu Baru')}
          class="w-full flex items-center justify-center gap-1 py-1.5 border border-dashed border-base-300 dark:border-slate-700 rounded-md text-xs text-base-content/60 hover:text-blue-500 hover:border-blue-500 transition-colors cursor-pointer"
        >
          <Plus size={13} />
          <span>Tambah Menu</span>
        </button>
      </div>
    </div>
  {:else if nodeId === 'badge'}
    <div class="space-y-2">
      <label for="node-badge-text" class="block font-semibold text-base-content/80">Teks Badge Promo</label>
      <input
        id="node-badge-text"
        type="text"
        value={section.props?.badgeText ?? ''}
        on:input={(e) => onPropChange('badgeText', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
        placeholder="Promo Spesial UMKM"
      />
    </div>
  {:else if nodeId === 'title'}
    <div class="space-y-3">
      <div>
        <label for="node-hero-title" class="block font-semibold text-base-content/80 mb-1">Judul Heading</label>
        <input
          id="node-hero-title"
          type="text"
          value={section.props?.title ?? ''}
          on:input={(e) => {
            const val = e.currentTarget.value;
            onPropChange('title', val);
            editorStore.updateSectionProps(section.id, { title: val });
          }}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
          placeholder="Selamat datang di toko kami"
        />
      </div>
      
      <div>
        <label for="node-tag-name" class="block font-semibold text-base-content/80 mb-1">Skala Tipografi (Golden Ratio)</label>
        <select
          id="node-tag-name"
          value={section.props?.tagName ?? 'h1'}
          on:change={(e) => {
            const val = e.currentTarget.value;
            onPropChange('tagName', val);
            editorStore.updateSectionProps(section.id, { tagName: val });
          }}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
        >
          <option value="h1">H1 (Heading 1 - 42px)</option>
          <option value="h2">H2 (Heading 2 - 26px)</option>
          <option value="h3">H3 (Heading 3 - 20px)</option>
          <option value="p">Body Text (16px)</option>
        </select>
      </div>

      <!-- Pilihan Warna Teks & Latar Belakang Title (Token Dropdown) -->
      <div class="pt-2 border-t border-base-300 dark:border-slate-800 space-y-3">
        <span class="block font-bold text-base-content/80 text-[11px] uppercase tracking-wider">Warna Token Judul</span>
        
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label for="node-title-color-select" class="block text-[10px] font-semibold text-base-content/60 mb-1">Warna Teks</label>
            <select
              id="node-title-color-select"
              value={getTitleStyle('color')}
              on:change={(e) => {
                editorStore.updateNodeStyles(section.id, 'title', { color: e.currentTarget.value });
              }}
              class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
            >
              {#each nodeTextColorOptions as opt}
                <option value={opt.value}>{opt.label}</option>
              {/each}
            </select>
          </div>

          <div>
            <label for="node-title-bg-select" class="block text-[10px] font-semibold text-base-content/60 mb-1">Background Judul</label>
            <select
              id="node-title-bg-select"
              value={getTitleStyle('backgroundColor') || 'transparent'}
              on:change={(e) => {
                editorStore.updateNodeStyles(section.id, 'title', { backgroundColor: e.currentTarget.value });
              }}
              class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
            >
              {#each nodeBgColorOptions as opt}
                <option value={opt.value}>{opt.label}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>
    </div>
  {:else if nodeId === 'subtitle'}
    <div class="space-y-2">
      <label for="node-hero-subtitle" class="block font-semibold text-base-content/80">Deskripsi Subtitle</label>
      <textarea
        id="node-hero-subtitle"
        value={subtitle}
        on:input={(e) => onPropChange('subtitle', e.currentTarget.value)}
        rows="4"
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500 resize-y"
        placeholder="Produk berkualitas dengan harga terjangkau..."
      />
    </div>

  <!-- ── NODE IMAGE UPLOADER LANGSUNG ── -->
  {:else if nodeId === 'image'}
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="font-semibold text-base-content/90">File Gambar Banner</span>
        {#if imageUrl}
          <span class="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
            WebP Aktif
          </span>
        {/if}
      </div>

      <!-- Mode Gambar: Elemen vs Background -->
      <div>
        <span class="block text-[11px] font-medium text-base-content/70 mb-1">Posisi Rendering:</span>
        <div class="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            on:click={() => onPropChange('imageMode', 'element')}
            class="py-1.5 px-2 rounded-lg text-xs font-bold border transition-all {imageMode === 'element' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-base-200/50 border-base-300'}"
          >
            Elemen Bebas
          </button>
          <button
            type="button"
            on:click={() => onPropChange('imageMode', 'background')}
            class="py-1.5 px-2 rounded-lg text-xs font-bold border transition-all {imageMode === 'background' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-base-200/50 border-base-300'}"
          >
            Full Background
          </button>
        </div>
      </div>

      {#if imageUrl}
        <div class="relative group rounded-xl overflow-hidden aspect-video bg-base-200 border border-base-300 shadow-inner">
          <img src={imageUrl} alt="Banner Hero" class="w-full h-full object-cover" />
          <button
            type="button"
            on:click={() => handleRemoveNodeImage('imageUrl')}
            class="btn btn-circle btn-error btn-xs absolute top-2 right-2 shadow-lg"
            title="Hapus gambar"
          >
            <X size={13} />
          </button>
        </div>
      {/if}

      <input
        bind:this={fileInput}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        class="hidden"
        on:change={handleImageFileChange}
      />

      <div
        role="region"
        aria-label="Upload file area"
        on:dragover|preventDefault={() => { isDragging = true; }}
        on:dragleave|preventDefault={() => { isDragging = false; }}
        on:drop|preventDefault={(e) => {
          isDragging = false;
          const f = e.dataTransfer?.files?.[0];
          if (f) processSelectedFile(f, 'imageUrl');
        }}
        class="rounded-xl border-2 border-dashed transition-all {isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-base-300 hover:border-blue-500/60 bg-base-200/20'}"
      >
        <button
          type="button"
          disabled={isUploading}
          on:click={() => fileInput?.click()}
          class="w-full py-4 px-3 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer disabled:opacity-50"
        >
          {#if isUploading}
            <Loader2 size={24} class="animate-spin text-blue-600" />
            <span class="text-xs font-bold text-blue-600">Mengunggah & Mengonversi... {uploadProgress}%</span>
          {:else}
            <div class="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Upload size={16} />
            </div>
            <span class="text-xs font-bold text-base-content/90">
              {imageUrl ? 'Pilih Gambar Baru (Otomatis Replace)' : 'Pilih File Gambar dari Perangkat'}
            </span>
            <span class="text-[10px] text-base-content/50">
              JPG, JPEG, PNG (Maks 5MB &bull; Auto WebP &le;200KB)
            </span>
          {/if}
        </button>
      </div>

      {#if errorMessage}
        <p class="text-xs text-rose-500 font-semibold">{errorMessage}</p>
      {/if}
    </div>

  {:else if nodeId === 'cta'}
    <div class="space-y-3">
      <div>
        <label for="node-cta-text" class="block font-semibold text-base-content/80 mb-1">Teks Tombol CTA</label>
        <input
          id="node-cta-text"
          type="text"
          value={section.props?.ctaText ?? ''}
          on:input={(e) => onPropChange('ctaText', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
          placeholder="Lihat Katalog"
        />
      </div>
      <div>
        <label for="node-cta-link" class="block font-semibold text-base-content/80 mb-1">Link Tujuan</label>
        <input
          id="node-cta-link"
          type="text"
          value={section.props?.ctaLink ?? ''}
          on:input={(e) => onPropChange('ctaLink', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
          placeholder="#catalog"
        />
      </div>

      <!-- Button Token Controls -->
      <div class="pt-2 border-t border-base-300 dark:border-slate-800 grid grid-cols-2 gap-2">
        <div>
          <label for="node-cta-variant" class="block text-[10px] font-semibold text-base-content/60 mb-1">Varian Tombol</label>
          <select
            id="node-cta-variant"
            value={section.props?.btnVariant || 'primary'}
            on:change={(e) => onPropChange('btnVariant', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
          >
            {#each btnVariantOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="node-cta-height" class="block text-[10px] font-semibold text-base-content/60 mb-1">Tinggi Tombol</label>
          <select
            id="node-cta-height"
            value={section.props?.btnHeight || '48px'}
            on:change={(e) => onPropChange('btnHeight', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
          >
            {#each btnHeightOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  {/if}

  <!-- Node Spacing Controls (8pt Locked) -->
  <div class="p-3 bg-base-200/40 dark:bg-slate-900/60 border border-base-300 dark:border-slate-800 rounded-xl space-y-2">
    <span class="block font-bold text-base-content/70 text-[11px] uppercase tracking-wider">
      Jarak Margin Elemen (8pt Grid)
    </span>
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="node-margin-top" class="block text-[10px] font-semibold text-base-content/60 mb-1">Margin Atas</label>
        <select
          id="node-margin-top"
          on:change={(e) => editorStore.updateNodeSpacing(section.id, nodeId, { marginTop: parseInt(e.currentTarget.value) || 0 })}
          class="w-full px-2 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
        >
          {#each nodeMarginOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>

      <div>
        <label for="node-margin-bottom" class="block text-[10px] font-semibold text-base-content/60 mb-1">Margin Bawah</label>
        <select
          id="node-margin-bottom"
          on:change={(e) => editorStore.updateNodeSpacing(section.id, nodeId, { marginBottom: parseInt(e.currentTarget.value) || 0 })}
          class="w-full px-2 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
        >
          {#each nodeMarginOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="pt-2 border-t border-base-200 dark:border-slate-800 flex flex-col gap-2">
    <button
      type="button"
      on:click={() => {
        if (nodeId) editorStore.deleteNode(section.id, nodeId);
      }}
      class="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
    >
      <Trash2 size={13} />
      <span>Hapus Elemen Ini</span>
    </button>

    <button
      type="button"
      on:click={() => editorStore.selectNode(section.id, null)}
      class="w-full py-2 bg-base-200 hover:bg-base-300 text-base-content rounded-lg text-xs font-semibold transition-colors cursor-pointer"
    >
      Kembali ke Setting Section
    </button>
  </div>
</div>