<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import type { FAQItem } from '@/types';
  import { DEFAULT_FAQS } from '../../sections/faq/faq.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: faqs = (Array.isArray(section.props?.faqs) && section.props.faqs.length > 0
    ? (section.props.faqs as FAQItem[])
    : DEFAULT_FAQS) as FAQItem[];

  $: title = (section.props?.title as string) || (section.props?.heading as string) || '';
  $: subtitle = (section.props?.subtitle as string) || '';
  $: badgeText = (section.props?.badgeText as string) || '';
  $: waNumber = (section.props?.whatsappNumber as string) || (section.props?.waNumber as string) || '';

  $: itemIndex = (() => {
    if (nodeId.startsWith('faq_item_')) return parseInt(nodeId.replace('faq_item_', ''), 10);
    if (nodeId.startsWith('item_')) return parseInt(nodeId.replace('item_', ''), 10);
    return 0;
  })();

  $: currentFaq = faqs[itemIndex] || faqs[0];

  function updateFaqField(field: keyof FAQItem, value: any) {
    const updated = [...faqs];
    if (updated[itemIndex]) {
      updated[itemIndex] = { ...updated[itemIndex], [field]: value };
      onPropChange('faqs', updated);
    }
  }
</script>

{#if nodeId === 'faq_header' || nodeId === 'header'}
  <div class="space-y-3 text-left">
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="faq-header-title">Judul Section FAQ (H2)</label>
      <input
        id="faq-header-title"
        type="text"
        value={title}
        on:input={(e) => onPropChange('title', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-bold"
        placeholder="Pertanyaan yang Sering Diajukan"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="faq-header-sub">Deskripsi Subjudul</label>
      <textarea
        id="faq-header-sub"
        rows="2"
        value={subtitle}
        on:input={(e) => onPropChange('subtitle', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        placeholder="Temukan solusi cepat dan informasi penting..."
      ></textarea>
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="faq-header-badge">Teks Badge Tagline</label>
      <input
        id="faq-header-badge"
        type="text"
        value={badgeText}
        on:input={(e) => onPropChange('badgeText', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        placeholder="Pusat Bantuan Konsumen"
      />
    </div>
  </div>
{:else if nodeId === 'faq_cs_card'}
  <div class="space-y-3 text-left">
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="faq-wa-num">Nomor WhatsApp Bantuan CS</label>
      <input
        id="faq-wa-num"
        type="text"
        value={waNumber}
        on:input={(e) => onPropChange('whatsappNumber', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-mono"
        placeholder="6281234567890"
      />
      <p class="text-[10px] text-base-content/60">
        Otomatis tersambung ke tautan deep-link chat WA toko.
      </p>
    </div>
  </div>
{:else if nodeId === 'faq_search_bar'}
  <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl space-y-1 text-left">
    <p class="font-semibold text-xs text-blue-700 dark:text-blue-300">Bilah Pencarian FAQ</p>
    <p class="text-[11px] text-base-content/70">
      Fitur input pencarian interaktif real-time yang memfilter kata kunci pertanyaan & jawaban secara instan bagi pengunjung web.
    </p>
  </div>
{:else if nodeId === 'faq_tabs'}
  <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl space-y-1 text-left">
    <p class="font-semibold text-xs text-blue-700 dark:text-blue-300">Tab Kategori FAQ</p>
    <p class="text-[11px] text-base-content/70">
      Mengelompokkan daftar tanya jawab ke dalam tab topik seperti Pemesanan, Pembayaran, dan Pengiriman.
    </p>
  </div>
{:else if nodeId.startsWith('faq_item_') || nodeId.startsWith('item_')}
  <div class="space-y-3 text-left">
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="faq-question">Pertanyaan</label>
      <input
        id="faq-question"
        type="text"
        value={currentFaq?.question || ''}
        on:input={(e) => updateFaqField('question', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-bold"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="faq-answer">Jawaban</label>
      <textarea
        id="faq-answer"
        rows="4"
        value={currentFaq?.answer || ''}
        on:input={(e) => updateFaqField('answer', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
      ></textarea>
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="faq-category">Kategori Pertanyaan</label>
      <input
        id="faq-category"
        type="text"
        value={currentFaq?.category || 'Umum'}
        on:input={(e) => updateFaqField('category', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        placeholder="Pemesanan / Pembayaran / Pengiriman"
      />
    </div>
  </div>
{/if}
