<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { Plus } from 'lucide-svelte'
  import Button from '@/components/ui/Button.svelte'
  import WhatsAppIcon from '@/components/ui/WhatsAppIcon.svelte'

  const FAQS = [
    {
      question: 'Apakah pemilik usaha butuh keahlian koding?',
      answer: 'Tidak. Seluruh pengelolaan produk, harga, dan foto katalog dirancang sesederhana mengisi form biasa.',
    },
    {
      question: 'Bagaimana sistem pembagian hasil desainer?',
      answer: 'Desainer menerima bagi hasil transparan dari setiap aktivasi template yang digunakan oleh mitra usaha.',
    },
    {
      question: 'Ke mana uang hasil penjualan produk masuk?',
      answer: 'Seluruh transaksi pembayaran langsung ditransfer oleh pembeli ke rekening atau dompet digital pemilik usaha via integrasi chat instan tanpa potongan pihak ketiga.',
    },
    {
      question: 'Siapa yang dapat mendaftar?',
      answer: 'Wirausaha yang memiliki produk otentik daerah dan desainer visual yang ingin berkontribusi pada ekonomi lokal.',
    },
  ];

  let containerEl: HTMLElement;
  let leftColEl: HTMLElement;
  let rightColEl: HTMLElement;
  let openIndex: number | null = 0;
  let ctx: gsap.Context | null = null;

  const toggleFaq = (index: number) => {
    openIndex = openIndex === index ? null : index;
  };

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerEl) return;

    ctx = gsap.context(() => {
      if (leftColEl) {
        gsap.fromTo(
          leftColEl,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerEl,
              start: 'top 85%',
              end: 'bottom 15%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }

      if (rightColEl) {
        const items = rightColEl.querySelectorAll('.faq-item');
        gsap.fromTo(
          items,
          { y: 30, scale: 0.98, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: rightColEl,
              start: 'top 85%',
              end: 'bottom 15%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }
    }, containerEl);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timer);
  });

  onDestroy(() => {
    ctx?.revert();
  });
</script>

<section
  id="faq"
  bind:this={containerEl}
  class="w-full bg-canvas text-main py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 border-t border-border relative select-none transition-colors duration-200"
>
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      <!-- Left Column: Headline & Subtext (col-span-5) -->
      <div bind:this={leftColEl} class="lg:col-span-5 flex flex-col will-change-transform">
        <span class="text-xs font-mono text-orange tracking-widest uppercase mb-3 block font-semibold">
          Tanya Jawab
        </span>
        <h2 class="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white leading-[1.12] mb-5">
          Hal yang Sering Ditanyakan.
        </h2>
        <p class="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-sm">
          Semua jawaban mendasar seputar alur kerja, biaya, dan kolaborasi di ekosistem Pinoka.
        </p>

        <!-- Interactive Direct Support Callout Card -->
        <div class="mt-8 p-5 rounded-2xl bg-nested/80 border border-border flex items-center justify-between gap-4 transition-all duration-300 hover:border-orange/40 hover:shadow-lg dark:hover:shadow-2xl group">
          <div class="flex items-center gap-3">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <p class="text-xs font-semibold text-main">Butuh bantuan langsung?</p>
              <p class="text-2xs font-mono text-muted">Tim kami siap via WhatsApp</p>
            </div>
          </div>
          <Button
            href="https://wa.me/6281234567890?text=Halo%20Pinoka,%20saya%20ingin%20tanya%20seputar%20platform"
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
            size="sm"
            class="!rounded-full !px-3.5 !py-1.5 !bg-neutral-900 dark:!bg-white !text-white dark:!text-neutral-950 font-sans text-xs font-medium transition-all duration-200 group-hover:scale-105 active:scale-95 shrink-0 shadow-sm gap-1.5"
          >
            <WhatsAppIcon size={14} className="shrink-0" />
            <span>Hubungi</span>
          </Button>
        </div>
      </div>

      <!-- Right Column: Interactive Hairline Accordion (col-span-7) -->
      <div bind:this={rightColEl} class="lg:col-span-7 border-t border-border will-change-transform">
        {#each FAQS as faq, index}
          <div class="faq-item border-b border-border px-4 -mx-4 rounded-xl transition-all duration-300 {openIndex === index ? 'bg-neutral-50/80 dark:bg-neutral-900/50' : 'hover:bg-neutral-50/40 dark:hover:bg-neutral-900/30'}">
            <button
              type="button"
              on:click={() => toggleFaq(index)}
              class="w-full py-4 sm:py-5 flex items-center justify-between text-left gap-4 cursor-pointer group"
              aria-expanded={openIndex === index}
            >
              <span class="font-heading font-medium text-base sm:text-lg lg:text-xl transition-colors duration-200 {openIndex === index ? 'text-orange font-semibold' : 'text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white'}">
                {faq.question}
              </span>
              <span
                class="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0 transition-all duration-300 {openIndex === index ? 'rotate-45 border-orange text-orange bg-orange/10 scale-105' : 'text-neutral-400 group-hover:border-neutral-400 dark:group-hover:border-white/20 group-hover:scale-105'}"
              >
                <Plus size={14} class="shrink-0" />
              </span>
            </button>

            <!-- Smooth Hardware-Accelerated CSS Grid Height Expansion -->
            <div class="grid transition-all duration-300 ease-out {openIndex === index ? 'grid-rows-[1fr] opacity-100 pb-4' : 'grid-rows-[0fr] opacity-0 pb-0'}">
              <div class="overflow-hidden">
                <p class="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-light leading-relaxed pr-8 sm:pr-12">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
