<script lang="ts">
  import { Plus, Trash2 } from 'lucide-svelte';
  import type { StoreContentCustomization } from '../../onboarding.types';

  export let customization: StoreContentCustomization;

  function addFaq() {
    if (customization.faq.faqs.length >= 8) return;
    customization.faq.faqs = [
      ...customization.faq.faqs,
      {
        question: 'Pertanyaan baru seputar layanan atau produk?',
        answer: 'Tuliskan jawaban lengkap dan jelas untuk membantu calon pembeli.',
      },
    ];
  }

  function removeFaq(index: number) {
    if (customization.faq.faqs.length <= 1) return;
    customization.faq.faqs = customization.faq.faqs.filter((_, i) => i !== index);
  }
</script>

<div class="space-y-4">
  <!-- Section Heading & Subheading -->
  <div class="space-y-3">
    <div>
      <label for="faq-heading-input" class="block text-xs font-bold text-main font-heading mb-1.5">
        Judul Seksi FAQ
      </label>
      <input
        id="faq-heading-input"
        type="text"
        bind:value={customization.faq.heading}
        placeholder="Contoh: Pertanyaan yang Sering Diajukan"
        class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
      />
    </div>

    <div>
      <label for="faq-subheading-input" class="block text-xs font-bold text-main font-heading mb-1.5">
        Subjudul Penjelas
      </label>
      <input
        id="faq-subheading-input"
        type="text"
        bind:value={customization.faq.subheading}
        placeholder="Jawaban cepat seputar toko, pemesanan, dan transaksi..."
        class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  </div>

  <!-- Repeater List -->
  <div class="space-y-3 pt-2 border-t border-light">
    <div class="flex items-center justify-between">
      <span class="text-label-caps text-muted">
        Daftar Pertanyaan & Jawaban ({customization.faq.faqs.length}/8)
      </span>
      {#if customization.faq.faqs.length < 8}
        <button
          type="button"
          on:click={addFaq}
          class="inline-flex items-center gap-1 text-2xs font-bold text-primary hover:underline cursor-pointer"
        >
          <Plus size={13} />
          <span>Tambah FAQ</span>
        </button>
      {/if}
    </div>

    <div class="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
      {#each customization.faq.faqs as item, idx}
        <div class="p-3 bg-nested rounded-xl border border-light space-y-2 relative group">
          <div class="flex items-center justify-between gap-2">
            <span class="text-2xs font-bold font-mono px-2 py-0.5 rounded bg-card border border-light text-secondary">
              Q{idx + 1}
            </span>
            <input
              type="text"
              bind:value={item.question}
              placeholder="Tuliskan pertanyaan..."
              class="flex-1 bg-card text-main border border-light rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-primary"
            />
            {#if customization.faq.faqs.length > 1}
              <button
                type="button"
                on:click={() => removeFaq(idx)}
                class="text-secondary hover:text-error p-1 rounded transition-colors"
                title="Hapus pertanyaan ini"
              >
                <Trash2 size={13} />
              </button>
            {/if}
          </div>

          <textarea
            bind:value={item.answer}
            rows="2"
            placeholder="Tuliskan jawaban..."
            class="w-full bg-card text-main border border-light rounded-lg p-2 text-2xs font-sans focus:outline-none focus:border-primary resize-none"
          ></textarea>
        </div>
      {/each}
    </div>
  </div>
</div>
