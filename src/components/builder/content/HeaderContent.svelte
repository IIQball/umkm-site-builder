<script lang="ts">
  import { Plus, Trash2, ChevronUp, ChevronDown, Megaphone, Image as ImageIcon, Menu } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import {
    makeHandlePropChange,
    makeHandleAddArrayItem,
    makeHandleRemoveArrayItem,
    makeHandleMoveArrayItem,
  } from './content.helpers';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: handleAddArrayItem = makeHandleAddArrayItem(section, onUpdate);
  $: handleRemoveArrayItem = makeHandleRemoveArrayItem(section, onUpdate);
  $: handleMoveArrayItem = makeHandleMoveArrayItem(section, onUpdate);

  $: showAnnouncement = (section.props?.showAnnouncement as boolean) ?? true;
  $: logoType = section.props?.logoType || 'image_text';
  $: navLinks = (section.props?.navLinks as string[]) || [];
</script>

<div class="space-y-6">
  <!-- 1. Announcement Bar Configuration -->
  <div class="space-y-3 p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
        <Megaphone size={14} class="text-blue-500" />
        <span>Announcement Bar</span>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={showAnnouncement}
          on:change={(e) => handlePropChange('showAnnouncement', e.currentTarget.checked)}
          class="sr-only peer"
        />
        <div class="w-8 h-4 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>

    {#if showAnnouncement}
      <div>
        <label for="announcement-text" class="block font-medium text-[11px] text-base-content/70 mb-1">
          Teks Pengumuman / Promo
        </label>
        <input
          id="announcement-text"
          type="text"
          value={section.props?.announcementText ?? ''}
          on:input={(e) => handlePropChange('announcementText', e.currentTarget.value)}
          class="w-full px-3 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="Diskon 20% khusus hari ini..."
        />
      </div>
    {/if}
  </div>

  <!-- 2. Logo Configuration -->
  <div class="space-y-3 p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800">
    <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
      <ImageIcon size={14} class="text-blue-500" />
      <span>Logo Brand Toko</span>
    </div>

    <div>
      <span class="block font-medium text-[11px] text-base-content/70 mb-1">Tipe Tampilan Logo</span>
      <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
        <button
          type="button"
          on:click={() => handlePropChange('logoType', 'image_only')}
          class={`py-1 rounded font-medium transition-colors cursor-pointer ${
            logoType === 'image_only' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          Gambar
        </button>
        <button
          type="button"
          on:click={() => handlePropChange('logoType', 'text_only')}
          class={`py-1 rounded font-medium transition-colors cursor-pointer ${
            logoType === 'text_only' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          Teks
        </button>
        <button
          type="button"
          on:click={() => handlePropChange('logoType', 'image_text')}
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
        <label for="logo-text" class="block font-medium text-[11px] text-base-content/70 mb-1">
          Nama Toko / Brand
        </label>
        <input
          id="logo-text"
          type="text"
          value={section.props?.logoText ?? ''}
          on:input={(e) => handlePropChange('logoText', e.currentTarget.value)}
          class="w-full px-3 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="Nama Brand UMKM"
        />
      </div>
    {/if}

    {#if logoType === 'image_only' || logoType === 'image_text'}
      <!-- Bentuk Logo: Kotak vs Bulat -->
      <div>
        <span class="block font-medium text-[11px] text-base-content/70 mb-1">Bentuk Logo</span>
        <div class="grid grid-cols-2 gap-1.5 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
          <button
            type="button"
            on:click={() => handlePropChange('logoShape', 'square')}
            class={`py-1 rounded font-medium transition-colors cursor-pointer ${
              (section.props?.logoShape || 'square') === 'square' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
            }`}
          >
            Kotak / Default
          </button>
          <button
            type="button"
            on:click={() => handlePropChange('logoShape', 'circle')}
            class={`py-1 rounded font-medium transition-colors cursor-pointer ${
              section.props?.logoShape === 'circle' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
            }`}
          >
            Bulat (Circle)
          </button>
        </div>
      </div>

      <!-- File Picker Logo Langsung -->
      <div>
        <label for="header-logo-upload" class="block font-medium text-[11px] text-base-content/70 mb-1">Upload File Logo</label>
        <input
          id="header-logo-upload"
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          class="block w-full text-xs text-base-content/70 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          on:change={async (e) => {
            const file = e.currentTarget.files?.[0];
            if (!file) return;
            const signRes = await fetch('/api/media/sign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ folder: 'templates' }) });
            if (!signRes.ok) return;
            const { data: signData } = await signRes.json();
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', signData.apiKey);
            formData.append('timestamp', signData.timestamp);
            formData.append('signature', signData.signature);
            formData.append('folder', signData.folder);
            const cloudRes = await fetch(signData.uploadUrl, { method: 'POST', body: formData });
            if (!cloudRes.ok) return;
            const cloudData = await cloudRes.json();
            handlePropChange('logoImageUrl', cloudData.secure_url);
          }}
        />
      </div>
    {/if}
  </div>

  <!-- 3. Navigation Menu Links -->
  <div class="space-y-3 p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800">
    <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
      <Menu size={14} class="text-blue-500" />
      <span>Menu Navigasi</span>
    </div>

    <div class="space-y-2">
      {#each navLinks as link, index}
        <div class="flex items-center gap-1.5 p-1 bg-base-100 dark:bg-slate-950/80 border border-base-300 dark:border-slate-800 rounded-lg">
          <input
            type="text"
            value={link}
            on:input={(e) => {
              const updated = [...navLinks];
              updated[index] = e.currentTarget.value;
              handlePropChange('navLinks', updated);
            }}
            class="flex-1 px-2.5 py-1 bg-transparent text-xs text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
            placeholder="Nama Menu"
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
              disabled={index === navLinks.length - 1}
              class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              title="Pindah ke Bawah"
            >
              <ChevronDown size={13} />
            </button>
            <button
              type="button"
              on:click={() => handleRemoveArrayItem('navLinks', index)}
              class="p-1 text-base-content/50 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors cursor-pointer ml-0.5"
              title="Hapus Menu"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      {/each}
      <button
        type="button"
        on:click={() => handleAddArrayItem('navLinks', 'Menu Baru')}
        class="w-full flex items-center justify-center gap-1 py-1.5 border border-dashed border-base-300 dark:border-slate-700 rounded-md text-xs text-base-content/60 hover:text-blue-500 hover:border-blue-500 transition-colors cursor-pointer"
      >
        <Plus size={13} />
        <span>Tambah Menu Navigasi</span>
      </button>
    </div>
  </div>
</div>
