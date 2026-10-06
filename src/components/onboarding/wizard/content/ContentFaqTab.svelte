<script lang="ts">
  import { Plus, Trash2 } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { StoreContentCustomization } from '../../onboarding.types';

  export let customization: StoreContentCustomization;
  export let onUpdate: (() => void) | undefined = undefined;

  function addFaq() {
    if (customization.faq.faqs.length >= 8) return;
    customization.faq.faqs = [
      ...customization.faq.faqs,
      {
        question: `Pertanyaan Baru #${customization.faq.faqs.length + 1}`,
        answer: 'Tuliskan jawaban lengkap dan jelas untuk membantu calon pembeli.',
      },
    ];
    onUpdate?.();
  }

  function removeFaq(index: number) {
    if (customization.faq.faqs.length <= 1) return;
    customization.faq.faqs = customization.faq.faqs.filter((_, i) => i !== index);
    onUpdate?.();
  }
</script>

<div class="space-y-4 text-left">
  <!-- Section Heading & Subheading -->
  <div class="space-y-3 pb-3 border-b border-light">
    <div>
      <label for="faq-heading-input" class="block text-xs font-bold text-main font-heading mb-1.5">
        Judul Seksi FAQ
      </label>
      <input
        id="faq-heading-input"
        type="text"
        bind:value={customization.faq.heading}
        on:input={() => onUpdate?.()}
        placeholder="Contoh: Pertanyaan yang Sering Diajukan"
        class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
      />
    </div>

    <div>
      <label for="faq-subheading-input" class="block text-xs font-bold text-main font-heading mb-1.5">
        Subjudul Penjelas
      </label>
      <textarea
        id="faq-subheading-input"
        bind:value={customization.faq.subheading}
        on:input={() => onUpdate?.()}
        rows="2"
        placeholder="Jawaban cepat seputar toko, pemesanan, dan transaksi..."
        class="w-full bg-card text-main border border-light rounded-xl p-3 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none leading-relaxed"
      ></textarea>
    </div>
  </div>

  <!-- Repeater Header -->
  <div class="flex items-center justify-between">
    <span class="text-xs font-bold text-main font-heading">
      Daftar Pertanyaan & Jawaban ({customization.faq.faqs.length}/8)
    </span>
    <Button
      type="button"
      size="sm"
      variant="ghost"
      disabled={customization.faq.faqs.length >= 8}
      on:click={addFaq}
      class="text-primary font-bold text-xs !px-2.5 !py-1 !h-auto gap-1 cursor-pointer"
    >
      <Plus size={14} />
      <span>Tambah FAQ</span>
    </Button>
  </div>

  <!-- Repeater List: Natural Flow, No Nested Constricted Scrollbar -->
  <div class="space-y-3">
    {#each customization.faq.faqs as item, idx}
      <div class="p-3.5 bg-card rounded-xl border border-light space-y-2.5 shadow-2xs">
        <div class="flex items-center justify-between gap-2 border-b border-light/60 pb-2">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xs shrink-0 font-mono">
              Q{idx + 1}
            </span>
            <span class="text-xs font-bold text-main truncate font-heading">
              {item.question || `Pertanyaan #${idx + 1}`}
            </span>
          </div>

          {#if customization.faq.faqs.length > 1}
            <button
              type="button"
              on:click={() => removeFaq(idx)}
              class="text-secondary hover:text-error p-1 rounded-lg hover:bg-error/10 transition-colors shrink-0 cursor-pointer"
              title="Hapus pertanyaan ini"
            >
              <Trash2 size={14} />
            </button>
          {/if}
        </div>

        <div class="space-y-2">
          <div>
            <label for={`faq-q-${idx}`} class="block text-3xs font-semibold text-secondary mb-1">
              Pertanyaan
            </label>
            <input
              id={`faq-q-${idx}`}
              type="text"
              bind:value={item.question}
              on:input={() => onUpdate?.()}
              placeholder="Contoh: Bagaimana cara memesan via WhatsApp?"
              class="w-full bg-nested text-main border border-light rounded-lg px-2.5 py-1.5 text-xs font-sans font-semibold focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label for={`faq-a-${idx}`} class="block text-3xs font-semibold text-secondary mb-1">
              Jawaban
            </label>
            <textarea
              id={`faq-a-${idx}`}
              bind:value={item.answer}
              on:input={() => onUpdate?.()}
              rows="2"
              placeholder="Tuliskan jawaban yang ramah dan jelas..."
              class="w-full bg-nested text-main border border-light rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:border-primary resize-none leading-relaxed"
            ></textarea>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
