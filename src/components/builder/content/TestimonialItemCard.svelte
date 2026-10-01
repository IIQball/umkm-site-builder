<script lang="ts">
  import { ChevronUp, ChevronDown, Trash2, CheckCircle2, Star, Plus } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { TestimonialItem } from '@/types';
  import ImageUploadDropzone from '../inspector/ImageUploadDropzone.svelte';

  export let item: TestimonialItem;
  export let index: number;
  export let totalItems: number;
  export let onFieldChange: (field: keyof TestimonialItem, value: any) => void;
  export let onMove: (direction: 'up' | 'down') => void;
  export let onRemove: () => void;

  let newCommentAuthor = '';
  let newCommentText = '';

  function handleAddComment() {
    if (!newCommentText.trim()) return;
    const updated = [
      ...(item.comments || []),
      {
        author: newCommentAuthor.trim() || 'Pengunjung',
        text: newCommentText.trim(),
        time: 'Baru saja',
      },
    ];
    onFieldChange('comments', updated);
    newCommentText = '';
    newCommentAuthor = '';
  }
</script>

<div class="p-3 bg-base-200/50 border border-base-300 rounded-lg space-y-3 text-left">
  <!-- Card Header -->
  <div class="flex items-center justify-between gap-2 border-b border-base-300/60 pb-2">
    <div class="flex items-center gap-2 min-w-0">
      {#if item.avatar}
        <img src={item.avatar} alt={item.customerName} class="w-6 h-6 rounded-full object-cover shrink-0" />
      {:else}
        <div class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-2xs shrink-0">
          {(item.customerName || 'U').charAt(0).toUpperCase()}
        </div>
      {/if}
      <span class="font-heading font-bold text-xs text-base-content truncate">
        Review #{index + 1}: {item.customerName || 'Ulasan Baru'}
      </span>
    </div>

    <div class="flex items-center gap-0.5 shrink-0">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        on:click={() => onMove('up')}
        disabled={index === 0}
        class="!p-1 !h-6 !w-6 !min-h-0 !min-w-0 text-base-content/50 hover:text-base-content disabled:opacity-20"
        title="Pindah ke Atas"
      >
        <ChevronUp size={13} />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        on:click={() => onMove('down')}
        disabled={index === totalItems - 1}
        class="!p-1 !h-6 !w-6 !min-h-0 !min-w-0 text-base-content/50 hover:text-base-content disabled:opacity-20"
        title="Pindah ke Bawah"
      >
        <ChevronDown size={13} />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        on:click={onRemove}
        class="!p-1 !h-6 !w-6 !min-h-0 !min-w-0 text-base-content/50 hover:text-error rounded"
        title="Hapus"
      >
        <Trash2 size={13} />
      </Button>
    </div>
  </div>

  <!-- Form Fields -->
  <div class="space-y-2.5">
    <div class="space-y-1">
      <label for={`testi-name-${index}`} class="block font-semibold text-2xs text-base-content/70">Nama Pelanggan</label>
      <input
        id={`testi-name-${index}`}
        type="text"
        value={item.customerName ?? ''}
        on:input={(e) => onFieldChange('customerName', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content font-bold focus:outline-none focus:border-primary"
        placeholder="Nama Pelanggan"
      />
    </div>

    <div class="space-y-1">
      <label for={`testi-rating-${index}`} class="block font-semibold text-2xs text-base-content/70">
        Jumlah Bintang Rating: {item.rating ?? 5} / 5
      </label>
      <div class="flex items-center gap-2">
        <input
          id={`testi-rating-${index}`}
          type="range"
          min="1"
          max="5"
          step="1"
          value={item.rating ?? 5}
          on:input={(e) => onFieldChange('rating', parseInt(e.currentTarget.value, 10))}
          class="range range-xs range-warning flex-1 cursor-pointer"
          aria-label={`Jumlah Bintang Rating Review #${index + 1}`}
        />
        <div class="flex items-center gap-0.5 text-amber-400 shrink-0">
          {#each Array(item.rating ?? 5) as _}
            <Star size={12} class="fill-current text-amber-400" />
          {/each}
        </div>
      </div>
    </div>

    <div class="space-y-1">
      <label for={`testi-comment-${index}`} class="block font-semibold text-2xs text-base-content/70">Detail Review / Ulasan</label>
      <textarea
        id={`testi-comment-${index}`}
        value={item.comment ?? ''}
        on:input={(e) => onFieldChange('comment', e.currentTarget.value)}
        rows="2"
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content focus:outline-none focus:border-primary resize-y"
        placeholder="Isi ulasan pelanggan..."
      ></textarea>
    </div>

    <div class="space-y-1">
      <label for={`testi-role-${index}`} class="block font-semibold text-2xs text-base-content/70">Keterangan / Lokasi</label>
      <input
        id={`testi-role-${index}`}
        type="text"
        value={item.role ?? ''}
        on:input={(e) => onFieldChange('role', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content focus:outline-none focus:border-primary"
        placeholder="Contoh: Pelanggan Setia • Banyuwangi"
      />
    </div>

    <div class="space-y-1">
      <label for={`testi-platform-${index}`} class="block font-semibold text-2xs text-base-content/70">Platform Ulasan</label>
      <input
        id={`testi-platform-${index}`}
        type="text"
        value={item.platform ?? ''}
        on:input={(e) => onFieldChange('platform', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content focus:outline-none focus:border-primary"
        placeholder="Contoh: WhatsApp / Instagram"
      />
    </div>

    <!-- Verified Badge Controls -->
    <div class="p-2 bg-base-100/70 border border-base-300/80 rounded-lg space-y-1.5">
      <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-base-content">
        <input
          type="checkbox"
          checked={item.verified !== false}
          on:change={(e) => onFieldChange('verified', e.currentTarget.checked)}
          class="checkbox checkbox-primary checkbox-xs rounded"
        />
        <span class="flex items-center gap-1 text-emerald-600">
          <CheckCircle2 size={12} />
          <span>Status Pembeli Terverifikasi</span>
        </span>
      </label>
      {#if item.verified !== false}
        <input
          type="text"
          value={item.verifiedText ?? 'Pembeli Terverifikasi'}
          on:input={(e) => onFieldChange('verifiedText', e.currentTarget.value)}
          class="w-full px-2 py-1 bg-base-200/50 border border-base-300 rounded text-2xs text-base-content focus:outline-none focus:border-primary"
          placeholder="Teks lencana terverifikasi (default: Pembeli Terverifikasi)"
        />
      {/if}
    </div>

    <!-- Social Post Comments Management -->
    <div class="p-3 bg-base-100/80 border border-base-300 rounded-xl space-y-3">
      <div class="flex items-center justify-between">
        <span class="font-bold text-xs text-base-content">
          Komentar / Balasan
        </span>
        <span class="text-2xs font-mono font-semibold px-2 py-0.5 rounded-full bg-base-200 text-base-content/70">
          {item.comments?.length ?? 0}
        </span>
      </div>

      {#if item.comments && item.comments.length > 0}
        <div class="space-y-1.5 max-h-36 overflow-y-auto pr-0.5">
          {#each item.comments as c, cIdx}
            <div class="p-2 bg-base-200/50 border border-base-300/60 rounded-lg text-2xs space-y-1">
              <div class="flex items-center justify-between gap-1.5">
                <span class="font-bold text-base-content truncate">{c.author}</span>
                <button
                  type="button"
                  on:click={() => {
                    const updated = (item.comments || []).filter((_, i) => i !== cIdx);
                    onFieldChange('comments', updated);
                  }}
                  class="text-error/70 hover:text-error p-0.5 rounded hover:bg-error/10 transition-colors shrink-0"
                  title="Hapus Komentar"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <p class="text-base-content/80 text-2xs leading-relaxed break-words">{c.text}</p>
            </div>
          {/each}
        </div>
      {/if}

      <!-- Form Tambah Komentar -->
      <div class="space-y-2 pt-1 border-t border-base-200">
        <div class="space-y-1.5">
          <input
            type="text"
            bind:value={newCommentAuthor}
            placeholder="Nama Pengirim (opsional)"
            class="w-full px-2.5 py-1.5 bg-base-200/60 border border-base-300 rounded-lg text-xs text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary"
          />
          <textarea
            bind:value={newCommentText}
            placeholder="Tulis balasan atau komentar..."
            rows="2"
            class="w-full px-2.5 py-1.5 bg-base-200/60 border border-base-300 rounded-lg text-xs text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary resize-none"
            on:keydown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          ></textarea>
        </div>
        <button
          type="button"
          on:click={handleAddComment}
          disabled={!newCommentText.trim()}
          class="w-full py-1.5 px-3 bg-primary hover:bg-primary/90 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
        >
          <Plus size={13} />
          <span>Tambah Komentar</span>
        </button>
      </div>
    </div>

    <!-- Avatar Upload Dropzone -->
    <div class="space-y-1 pt-1">
      <span class="block font-semibold text-2xs text-base-content/70">Foto / Gambar Pelanggan</span>
      <ImageUploadDropzone
        imageUrl={item.avatar || ''}
        onImageChange={(url) => onFieldChange('avatar', url)}
        label={`Foto ${item.customerName || `Review #${index + 1}`}`}
        folder="testimonials"
        compact={true}
      />
    </div>
  </div>
</div>
