<script lang="ts">
  import { MessageCircle } from 'lucide-svelte';
  import type { FAQProps, SectionStyles, FAQItem } from '@/types';
  import FaqAccordionPreset from './faq/FaqAccordionPreset.svelte';
  import FaqGridPreset from './faq/FaqGridPreset.svelte';
  import FaqInteractivePreset from './faq/FaqInteractivePreset.svelte';

  export let props: FAQProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'accordion_single_col';

  void sectionId;
  void isActive;

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'accordion_single_col';
  $: rawFaqs = (Array.isArray(props?.faqs) && props.faqs.length > 0
    ? props.faqs
    : [
        {
          question: 'Berapa lama proses pengiriman pesanan?',
          answer: 'Pesanan diproses dalam 1x24 jam dan sampai dalam 1-3 hari kerja tergantung lokasi tujuan pengiriman.',
        },
        {
          question: 'Bagaimana cara melakukan pembayaran?',
          answer: 'Kami menerima pembayaran melalui transfer Bank, E-Wallet (GoPay, OVO, Dana, ShopeePay), dan QRIS instan.',
        },
        {
          question: 'Apakah produk bergaransi?',
          answer: 'Ya, semua produk kami memiliki garansi 100% original dan jaminan penggantian barang baru jika rusak saat pengiriman.',
        },
        {
          question: 'Apakah bisa pesan dalam jumlah banyak (grosir)?',
          answer: 'Tentu bisa! Hubungi WhatsApp admin kami untuk mendapatkan harga khusus pesanan grosir dan kemitraan.',
        },
        {
          question: 'Bagaimana cara melacak resi pengiriman?',
          answer: 'Nomor resi otomatis dikirimkan via WhatsApp setelah pesanan diserahkan ke pihak ekspedisi.',
        },
      ]) as FAQItem[];

  $: activeStoreWaNumber = (props?.whatsappNumber as string) || (props?.waNumber as string) || '628123456789';
  $: waLink = `https://wa.me/${activeStoreWaNumber.replace(/[^0-9]/g, '')}`;

  let openIndex: number | null = 0;

  function toggleFaq(index: number) {
    openIndex = openIndex === index ? null : index;
  }
</script>

<section
  class="relative w-full py-12 transition-all {isActive ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-base-100' : ''}"
  style:background-color="var(--theme-bg)"
>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
    <!-- Header -->
    <div class="mb-10 text-center max-w-2xl mx-auto">
      {#if props.badge}
        <span class="inline-block px-3 py-1 mb-2 text-xs font-bold uppercase tracking-wider rounded-full bg-primary/10 text-primary">
          {props.badge}
        </span>
      {/if}
      <h2 class="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
        {props.title || 'Pertanyaan yang Sering Diajukan'}
      </h2>
      {#if props.subtitle}
        <p class="mt-2 text-sm text-base-content/60">{props.subtitle}</p>
      {/if}
    </div>

    <!-- Presets -->
    {#if activePreset === 'grid_2_col_cards' || activePreset === 'categorized_tabs_faq'}
      <FaqGridPreset faqs={rawFaqs} />
    {:else if activePreset === 'searchable_faq_box' || activePreset === 'bubble_chat_faq'}
      <FaqInteractivePreset faqs={rawFaqs} {activePreset} {openIndex} {toggleFaq} />
    {:else}
      <FaqAccordionPreset faqs={rawFaqs} {activePreset} {openIndex} {toggleFaq} {waLink} />
    {/if}

    <!-- Bottom Contact CTA for banner bottom preset -->
    {#if activePreset === 'faq_contact_banner_bottom'}
      <div class="mt-10 p-6 rounded-2xl bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 text-center space-y-3 max-w-2xl mx-auto">
        <h4 class="font-bold text-sm text-base-content">Masih punya pertanyaan yang belum terjawab?</h4>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer shadow-sm"
        >
          <MessageCircle size={15} />
          <span>Hubungi Kami via WhatsApp</span>
        </a>
      </div>
    {/if}
  </div>
</section>
