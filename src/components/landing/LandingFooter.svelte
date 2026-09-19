<script lang="ts">
  import { toast } from '@/lib/toast';

  let email = '';
  let subscribed = false;

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) {
      toast.error('Masukkan alamat email yang valid');
      return;
    }
    subscribed = true;
    toast.success('Terima kasih! Anda telah terdaftar untuk menerima pembaruan Pinoka.');
    email = '';
    setTimeout(() => {
      subscribed = false;
    }, 5000);
  };

  const navColumns = [
    {
      title: 'Produk',
      links: [
        { label: 'Katalog Toko', href: '/umkm' },
        { label: 'Template Visual', href: '/templates' },
        { label: 'WhatsApp Checkout', href: '/umkm' },
        { label: 'Katalog Desain', href: '/templates' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { label: 'Tentang Pinoka', href: '/#why-us' },
        { label: 'Nilai Keunggulan', href: '/#features' },
        { label: 'Sinergi & Komisi', href: '/#synergy' },
        { label: 'Cerita Tenant', href: '/#testimonials' },
      ],
    },
    {
      title: 'Bantuan',
      links: [
        { label: 'Pusat Bantuan', href: '/#faq' },
        { label: 'Tanya Jawab FAQ', href: '/#faq' },
        { label: 'Panduan Tenant', href: '/#features' },
        { label: 'Ajukan Fitur', href: 'mailto:halo@pinoka.id' },
      ],
    },
    {
      title: 'Ekosistem',
      links: [
        { label: 'UMKM Banyuwangi', href: '/umkm' },
        { label: 'Pasar Desainer', href: '/templates' },
        { label: 'Portal Usaha', href: '/auth/login' },
        { label: 'Bina Tenant', href: '/auth/login' },
      ],
    },
  ];
</script>

<footer
  id="contact"
  class="w-full bg-canvas text-main border-t border-border pt-16 sm:pt-20 pb-12 transition-colors duration-200"
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-16">
    <!-- Top Row: Brand Wordmark + 4 Navigation Columns -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
      <!-- Left: Giant Brand Logo -->
      <div class="lg:col-span-4 space-y-3">
        <a
          href="/"
          class="inline-block hover:opacity-90 transition-opacity select-none"
          aria-label="Pinoka Home"
        >
          <img
            src="/assets/logo/logo.webp"
            alt="Pinoka"
            class="h-10 sm:h-12 w-auto object-contain"
            width="156"
            height="48"
            loading="lazy"
          />
        </a>
        <p class="text-xs sm:text-sm text-secondary max-w-xs leading-relaxed font-sans">
          Platform digitalisasi visual dan storefront mandiri untuk perajin UMKM lokal Banyuwangi.
        </p>
      </div>

      <!-- Right: 4 Nav Columns -->
      <div class="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {#each navColumns as col}
          <div class="space-y-4">
            <p class="text-xs font-bold uppercase tracking-wider text-main font-heading">
              {col.title}
            </p>
            <ul class="space-y-2.5 list-none pl-0">
              {#each col.links as link}
                <li>
                  <a
                    href={link.href}
                    class="text-xs sm:text-sm text-secondary hover:text-main dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </div>

    <!-- Middle Row: Social Media Grid Cluster + Newsletter Subscribe Pill -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end pt-6 border-t border-border/60">
      <!-- Left: Social Media Staircase Tile Cluster -->
      <div class="lg:col-span-5 space-y-2">
        <!-- Row 1 (1 icon) -->
        <div class="flex items-center gap-2">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-nested/80 hover:bg-card border border-light flex items-center justify-center text-main hover:text-red-600 transition-colors shadow-2xs hover:shadow-xs cursor-pointer"
            aria-label="YouTube"
            title="Kunjungi YouTube Kami"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>

        <!-- Row 2 (2 icons) -->
        <div class="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-nested/80 hover:bg-card border border-light flex items-center justify-center text-main hover:text-primary transition-colors shadow-2xs hover:shadow-xs cursor-pointer"
            aria-label="GitHub"
            title="GitHub Repositori"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-nested/80 hover:bg-card border border-light flex items-center justify-center text-main hover:text-sky-500 transition-colors shadow-2xs hover:shadow-xs cursor-pointer"
            aria-label="Telegram"
            title="Komunitas Telegram"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
          </a>
        </div>

        <!-- Row 3 (4 icons) -->
        <div class="flex items-center gap-2">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-nested/80 hover:bg-card border border-light flex items-center justify-center text-main hover:text-pink-600 transition-colors shadow-2xs hover:shadow-xs cursor-pointer"
            aria-label="Instagram"
            title="Instagram Resmi"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-nested/80 hover:bg-card border border-light flex items-center justify-center text-main hover:text-black dark:hover:text-white transition-colors shadow-2xs hover:shadow-xs cursor-pointer"
            aria-label="TikTok"
            title="TikTok Pinoka"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.01 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-nested/80 hover:bg-card border border-light flex items-center justify-center text-main hover:text-black dark:hover:text-white transition-colors shadow-2xs hover:shadow-xs cursor-pointer"
            aria-label="X (Twitter)"
            title="X (Twitter)"
          >
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a
            href="https://wa.me/628123456789"
            target="_blank"
            rel="noopener noreferrer"
            class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-nested/80 hover:bg-card border border-light flex items-center justify-center text-main hover:text-emerald-600 transition-colors shadow-2xs hover:shadow-xs cursor-pointer"
            aria-label="WhatsApp"
            title="WhatsApp Support"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.677.15-.2.301-.776.979-.952 1.18-.175.201-.35.226-.651.076-.301-.15-1.272-.469-2.424-1.496-.897-.799-1.503-1.788-1.68-2.089-.175-.301-.019-.464.132-.614.136-.135.301-.35.452-.526.15-.175.2-.3.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.927-2.235-.244-.587-.492-.507-.677-.517-.175-.01-.376-.01-.577-.01s-.527.075-.802.376c-.276.3-1.053 1.029-1.053 2.509s1.078 2.909 1.229 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.38.197 1.9.12.58-.086 1.78-.727 2.03-1.429.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35zm-5.467 7.618a9.92 9.92 0 0 1-5.061-1.387l-.363-.216-3.763.987 1.004-3.669-.236-.376A9.923 9.923 0 0 1 2.08 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Right: Prominent Newsletter Subscription Form -->
      <div class="lg:col-span-7 space-y-3">
        <h2 class="text-xl sm:text-2xl font-bold text-main font-heading">
          Dapatkan info & pembaruan terkini
        </h2>

        <form on:submit|preventDefault={handleSubscribe} class="relative w-full">
          <input
            type="email"
            bind:value={email}
            placeholder="Masukkan alamat email Anda..."
            required
            class="w-full bg-nested/80 hover:bg-nested border border-light focus:bg-card rounded-full pl-5 pr-32 py-3.5 sm:py-4 text-xs sm:text-sm text-main placeholder:text-muted focus:outline-none focus:border-primary transition-all shadow-2xs font-sans"
          />
          <button
            type="submit"
            class="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {subscribed ? 'Terdaftar ✓' : 'Subscribe'}
          </button>
        </form>

        <p class="text-xs text-secondary leading-relaxed font-sans max-w-md">
          Dengan berlangganan, Anda menyetujui pembaruan berkala ekosistem Pinoka. Batal berlangganan kapan saja. <a href="/privacy" class="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Kebijakan Privasi</a>.
        </p>
      </div>
    </div>

    <!-- Bottom Row: Terms of Use & Privacy Policy + Built by info -->
    <div class="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-secondary">
      <div class="flex items-center gap-6">
        <a href="/terms" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
          Syarat & Ketentuan
        </a>
        <a href="/privacy" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
          Kebijakan Privasi
        </a>
      </div>

      <div class="text-center font-sans text-muted">
        Dibangun untuk UMKM Banyuwangi
      </div>

      <div class="text-xs text-muted font-sans">
        © 2026 Pinoka. Hak cipta dilindungi.
      </div>
    </div>
  </div>
</footer>
