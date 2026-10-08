<script lang="ts">
  import { ChevronUp, ChevronDown, Trash2, HelpCircle } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { FAQItem } from '@/types';
  import SearchableIconDropdown from '../inspector/SearchableIconDropdown.svelte';
  import { PROMO_ICON_OPTIONS } from '../sections/header/headerIcons';

  export let item: FAQItem;
  export let index: number;
  export let totalItems: number;
  export let onFieldChange: (field: keyof FAQItem, value: any) => void;
  export let onMove: (direction: 'up' | 'down') => void;
  export let onRemove: () => void;
</script>

<div class="p-3 bg-base-200/50 border border-base-300 rounded-lg space-y-3 text-left">
  <!-- Card Header -->
  <div class="flex items-center justify-between gap-2 border-b border-base-300/60 pb-2">
    <div class="flex items-center gap-2 min-w-0">
      <div class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-2xs shrink-0">
        <HelpCircle size={13} />
      </div>
      <span class="font-heading font-bold text-xs text-base-content truncate">
        Pertanyaan #{index + 1}: {item.question || 'Pertanyaan Baru'}
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
      <label for={`faq-q-${index}`} class="block font-semibold text-2xs text-base-content/70">
        Kalimat Pertanyaan
      </label>
      <input
        id={`faq-q-${index}`}
        type="text"
        value={item.question ?? ''}
        on:input={(e) => onFieldChange('question', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content font-bold focus:outline-none focus:border-primary"
        placeholder="Contoh: Berapa lama estimasi pengiriman?"
      />
    </div>

    <div class="space-y-1">
      <label for={`faq-a-${index}`} class="block font-semibold text-2xs text-base-content/70">
        Jawaban Penjelasan
      </label>
      <textarea
        id={`faq-a-${index}`}
        value={item.answer ?? ''}
        on:input={(e) => onFieldChange('answer', e.currentTarget.value)}
        rows="3"
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content focus:outline-none focus:border-primary resize-y"
        placeholder="Tuliskan jawaban yang lengkap, jelas, dan membantu pelanggan..."
      ></textarea>
    </div>

    <div class="space-y-1">
      <label for={`faq-cat-${index}`} class="block font-semibold text-2xs text-base-content/70">
        Kategori Topik
      </label>
      <input
        id={`faq-cat-${index}`}
        type="text"
        value={item.category ?? 'Umum'}
        on:input={(e) => onFieldChange('category', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content focus:outline-none focus:border-primary"
        placeholder="Pemesanan / Pembayaran / Pengiriman / Garansi"
      />
    </div>

    <SearchableIconDropdown
      label="Ikon Kartu FAQ"
      selectedIcon={item.iconName || 'HelpCircle'}
      options={PROMO_ICON_OPTIONS}
      onSelect={(val) => onFieldChange('iconName', val)}
    />
  </div>
</div>
