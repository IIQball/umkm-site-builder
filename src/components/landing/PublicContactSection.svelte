<script lang="ts">
  import { toast } from '@/lib/toast'
  import Input from '@/components/ui/Input.svelte'
  import SearchableSelect from '@/components/ui/SearchableSelect.svelte'
  import Textarea from '@/components/ui/Textarea.svelte'
  import { MessageCircle, Mail, Copy, ArrowRight, ShieldCheck, Send } from 'lucide-svelte'
  import { onMount } from 'svelte'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'

  let name = ''
  let phone = ''
  let email = ''
  let topic = 'Pertanyaan Umum'
  let message = ''

  let containerEl: HTMLElement
  let leftColEl: HTMLElement
  let rightColEl: HTMLElement

  const contactEmail = import.meta.env.PUBLIC_CONTACT_EMAIL || 'support@pinoka.id'
  const contactWA = import.meta.env.PUBLIC_CONTACT_WA || '6285736653639'
  const waLink = `https://wa.me/${contactWA.replace(/[^0-9]/g, '')}`

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} berhasil disalin`)
  }

  const handleWhatsApp = () => {
    if (!name || !phone || !message) {
      toast.error('Mohon lengkapi nama, nomor telepon, dan pertanyaan')
      return
    }
    const text = `Halo Tim Pinoka, saya ${name}.%0A%0A*No WA:* ${phone}%0A*Email:* ${email || '-'}%0A*Topik:* ${topic}%0A%0A*Pertanyaan:*%0A${message}`
    window.open(`${waLink}?text=${text}`, '_blank')
  }

  const handleEmail = () => {
    if (!name || !email || !message) {
      toast.error('Mohon lengkapi nama, email, dan pertanyaan')
      return
    }
    const body = `Halo Tim Pinoka,%0A%0ASaya ${name}.%0A%0ANo WA: ${phone || '-'}%0AEmail: ${email}%0ATopik: ${topic}%0A%0APertanyaan:%0A${message}`
    window.open(`mailto:${contactEmail}?subject=[${topic}] dari ${name}&body=${body}`, '_blank')
  }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !containerEl) return

    let ctx = gsap.context(() => {
      gsap.fromTo(leftColEl.children, 
        { y: 30, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: containerEl, start: 'top 80%', once: true }
        }
      )
      gsap.fromTo(rightColEl, 
        { y: 40, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.2,
          scrollTrigger: { trigger: containerEl, start: 'top 80%', once: true }
        }
      )
    }, containerEl)

    return () => ctx.revert()
  })
</script>

<section
  id="contact"
  bind:this={containerEl}
  class="w-full bg-canvas text-main py-12 sm:py-16 md:py-20 px-6 sm:px-8 md:px-12 relative select-none transition-colors duration-200 flex-1 flex flex-col justify-center"
>
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      
      <!-- Left Column: Contact Cards -->
      <div bind:this={leftColEl} class="lg:col-span-5 flex flex-col gap-6">
        
        <!-- WhatsApp Support Card -->
        <div class="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl p-6 sm:p-8 flex flex-col gap-5">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
              <MessageCircle size={24} />
            </div>
            <div>
              <h3 class="font-heading font-semibold text-lg text-emerald-950 dark:text-emerald-50">WhatsApp Support</h3>
              <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium mt-0.5">
                <span class="relative flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                Online (24/7 Fast Response)
              </div>
            </div>
          </div>
          
          <p class="text-emerald-800/80 dark:text-emerald-200/70 text-sm sm:text-base leading-relaxed">
            Konsultasi instan dengan tim customer service kami melalui WhatsApp untuk respon paling cepat.
          </p>
          
          <div class="flex items-center justify-between bg-white dark:bg-black/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl px-4 py-3.5">
            <span class="font-medium text-emerald-950 dark:text-emerald-50 tracking-wide">{contactWA}</span>
            <button type="button" on:click={() => copyToClipboard(contactWA, 'Nomor WhatsApp')} class="text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors p-1 focus:outline-none" aria-label="Salin Nomor">
              <Copy size={18} />
            </button>
          </div>
          
          <a href={waLink} target="_blank" rel="noopener noreferrer" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm shadow-emerald-600/20 active:scale-[0.98]">
            <MessageCircle size={18} />
            Chat Langsung di WhatsApp
            <ArrowRight size={18} class="ml-1" />
          </a>
        </div>
        
        <!-- Email Support Card -->
        <div class="bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col gap-5">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
              <Mail size={24} />
            </div>
            <div>
              <h3 class="font-heading font-semibold text-lg text-main">Email Support</h3>
              <p class="text-secondary text-sm mt-0.5">Untuk pertanyaan lanjutan & lampiran dokumen</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between bg-nested border border-border rounded-xl px-4 py-3.5 mt-1">
            <span class="font-medium text-main">{contactEmail}</span>
            <button type="button" on:click={() => copyToClipboard(contactEmail, 'Email')} class="text-secondary hover:text-main transition-colors p-1 focus:outline-none" aria-label="Salin Email">
              <Copy size={18} />
            </button>
          </div>
          
          <a href="mailto:{contactEmail}" class="w-full bg-transparent hover:bg-nested border border-border text-main font-medium py-3 sm:py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]">
            <Mail size={18} />
            Kirim Email Langsung
          </a>
        </div>

        <div class="flex items-start gap-3 mt-2 px-3 text-secondary">
          <ShieldCheck size={20} class="text-blue-500 shrink-0 mt-0.5" />
          <p class="text-sm leading-relaxed">
            Privasi data Anda terjamin aman. Kami tidak akan membagikan nomor atau email Anda.
          </p>
        </div>
        
      </div>
      
      <!-- Right Column: Form -->
      <div bind:this={rightColEl} class="lg:col-span-7 bg-card border border-border rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col gap-8 shadow-sm">
        <div>
          <h2 class="font-heading font-bold text-2xl text-main">Formulir Pertanyaan & Konsultasi</h2>
          <p class="text-secondary mt-2.5 leading-relaxed">
            Isi formulir di bawah ini. Pesan akan terformat otomatis saat Anda memilih untuk mengirim via WhatsApp atau Email.
          </p>
        </div>
        
        <form class="flex flex-col gap-6 font-sans [&_select]:font-sans [&_option]:font-sans [&_label]:font-bold [&_label]:text-main [&_label]:tracking-wide" on:submit|preventDefault>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input id="name" label="Nama Lengkap" bind:value={name} placeholder="Masukkan nama Anda" required />
            <Input id="phone" label="Nomor WhatsApp / Telp" type="tel" bind:value={phone} placeholder="Contoh: 081234567890" required />
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input id="email" label="Alamat Email" type="email" bind:value={email} placeholder="nama@email.com" />
            <SearchableSelect class="[&_.border-b.border-light]:!hidden" id="topic" label="Tujuan / Topik Pertanyaan" bind:value={topic} options={[
              { value: 'Pertanyaan Umum', label: 'Pertanyaan Umum' },
              { value: 'Bantuan Teknis', label: 'Bantuan Teknis' },
              { value: 'Kemitraan', label: 'Kemitraan' },
              { value: 'Lainnya', label: 'Lainnya' }
            ]} />
          </div>
          
          <Textarea id="message" label="Detail Pertanyaan" bind:value={message} placeholder="Tuliskan pertanyaan atau kendala yang ingin Anda tanyakan..." rows={5} required />
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <button type="button" on:click={handleWhatsApp} class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm shadow-emerald-600/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-black">
              <MessageCircle size={18} />
              Kirim via WhatsApp
            </button>
            <button type="button" on:click={handleEmail} class="w-full bg-nested hover:bg-card border border-border text-main font-medium py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black">
              <Send size={18} />
              Kirim via Email
            </button>
          </div>
        </form>
      </div>
      
    </div>
  </div>
</section>
