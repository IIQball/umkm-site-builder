<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { Plus, Minus } from 'lucide-svelte'

  const FAQS = [
    {
      question: 'Apakah pemilik usaha butuh keahlian koding?',
      answer: 'Tidak. Seluruh pengelolaan produk, harga, dan foto katalog dirancang sesederhana mengisi formulir biasa tanpa perlu menyentuh kode sama sekali.'
    },
    {
      question: 'Bagaimana sistem pembagian hasil desainer?',
      answer: 'Desainer menerima bagi hasil transparan dari setiap aktivasi template yang digunakan oleh mitra usaha secara otomatis dan dapat dicairkan langsung.'
    },
    {
      question: 'Ke mana uang hasil penjualan produk masuk?',
      answer: 'Seluruh transaksi pembayaran langsung ditransfer oleh pembeli ke rekening atau dompet digital pemilik usaha via integrasi WhatsApp tanpa potongan pihak ketiga.'
    },
    {
      question: 'Siapa yang dapat mendaftar?',
      answer: 'Wirausaha lokal yang memiliki produk otentik daerah Banyuwangi dan desainer visual yang ingin berkontribusi mendigitalisasi ekonomi kreatif lokal.'
    },
    {
      question: 'Apakah ada biaya bulanan atau langganan hosting?',
      answer: 'Tidak ada biaya hosting bulanan tersembunyi. Setiap toko UMKM langsung aktif dengan subdomain resmi dan infrastruktur cloud yang andal.'
    },
    {
      question: 'Bagaimana cara pembeli memesan produk UMKM?',
      answer: 'Pembeli memilih produk dari etalase online toko Anda, lalu langsung terhubung ke WhatsApp bisnis toko dengan rekap pesanan yang sudah otomatis tersusun rapi.'
    }
  ]

  let containerEl: HTMLElement
  let leftColEl: HTMLElement
  let rightColEl: HTMLElement
  let openIndex: number | null = 0
  let showAll: boolean = false
  let ctx: gsap.Context | null = null

  $: displayedFaqs = showAll ? FAQS : FAQS.slice(0, 4)

  const toggleFaq = (index: number) => {
    openIndex = openIndex === index ? null : index
  }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !containerEl) return

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
              once: true
            },
            onComplete: () => {
              gsap.set(leftColEl, { clearProps: 'all' })
            }
          }
        )
      }

      if (rightColEl) {
        const items = rightColEl.querySelectorAll('.faq-item')
        gsap.fromTo(
          items,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: rightColEl,
              start: 'top 85%',
              once: true
            },
            onComplete: () => {
              gsap.set(items, { clearProps: 'all' })
            }
          }
        )
      }
    }, containerEl)

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)

    return () => clearTimeout(timer)
  })

  onDestroy(() => {
    ctx?.revert()
  })
</script>

<section
  id="faq"
  bind:this={containerEl}
  class="w-full bg-canvas text-main py-20 sm:py-24 md:py-28 px-6 sm:px-8 md:px-12 border-t border-border relative select-none transition-colors duration-200"
>
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      <!-- Left Column: Modernist Bold Headline & Direct Contact -->
      <div bind:this={leftColEl} class="lg:col-span-5 flex flex-col">
        <h2 class="heading-section text-neutral-950 dark:text-white">
          Pertanyaan? Jawaban.
        </h2>
        <p class="desc-section text-neutral-500 dark:text-neutral-400 mt-4 max-w-sm">
          Semua jawaban mendasar seputar alur kerja, sistem bagi hasil, dan aktivasi toko digital di ekosistem Pinoka.
        </p>
      </div>

      <!-- Right Column: Minimalist Left-Aligned Icon Accordion -->
      <div bind:this={rightColEl} class="lg:col-span-7 space-y-4 sm:space-y-5">
        {#each displayedFaqs as faq, index}
          <div class="faq-item transition-colors duration-200">
            <button
              type="button"
              on:click={() => toggleFaq(index)}
              class="w-full flex items-start gap-3.5 sm:gap-4 text-left cursor-pointer group py-1"
              aria-expanded={openIndex === index}
            >
              <!-- Minimal Left Icon (+ / -) -->
              <span class="mt-0.5 sm:mt-1 shrink-0 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                {#if openIndex === index}
                  <Minus size={18} strokeWidth={2.2} class="text-neutral-900 dark:text-white" />
                {:else}
                  <Plus size={18} strokeWidth={2.2} class="text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white" />
                {/if}
              </span>

              <!-- Question & Expandable Answer -->
              <div class="flex-1 min-w-0">
                <span class="heading-4 text-neutral-900 dark:text-white group-hover:text-orange transition-colors block">
                  {faq.question}
                </span>

                <!-- Smooth Height Expansion -->
                <div class="grid transition-all duration-300 ease-out {openIndex === index ? 'grid-rows-[1fr] opacity-100 pt-2.5 pb-2' : 'grid-rows-[0fr] opacity-0 pb-0'}">
                  <div class="overflow-hidden">
                    <p class="body-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          </div>
        {/each}

        <!-- Show more / Tampilkan lebih banyak Link -->
        <div class="pt-3 pl-8 sm:pl-8.5">
          <button
            type="button"
            on:click={() => {
              showAll = !showAll
              if (!showAll && openIndex !== null && openIndex >= 4) {
                openIndex = null
              }
            }}
            class="text-orange hover:text-orange/80 font-heading font-medium text-sm sm:text-base transition-colors cursor-pointer inline-flex items-center gap-1.5 focus:outline-none"
          >
            <span>{showAll ? 'Tampilkan lebih sedikit' : 'Lihat lebih banyak'}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
