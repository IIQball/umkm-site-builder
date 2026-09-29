<script lang="ts">
  import { onMount } from 'svelte';
  
  let sliderContainer: HTMLDivElement;
  let sliderValue = 50;
  let isDragging = false;

  function handleMove(e: MouseEvent | TouchEvent) {
    if (!isDragging || !sliderContainer) return;
    
    let clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const rect = sliderContainer.getBoundingClientRect();
    let x = clientX - rect.left;
    
    // Clamp between 0 and 100%
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    
    sliderValue = (x / rect.width) * 100;
  }

  function startDrag() { isDragging = true; }
  function stopDrag() { isDragging = false; }

  onMount(() => {
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
    return () => {
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchend', stopDrag);
    };
  });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="space-y-10">
  <!-- Interactive Visual Comparison Slider -->
  <div 
    class="relative w-full max-w-4xl mx-auto h-[440px] md:h-[500px] rounded-3xl overflow-hidden cursor-ew-resize select-none border border-light shadow-2xl bg-slate-950 font-sans"
    bind:this={sliderContainer}
    on:mousedown={startDrag}
    on:touchstart={startDrag}
    on:mousemove={handleMove}
    on:touchmove|preventDefault={handleMove}
  >
    <!-- Background Layer (Right Side Revealed): WEBSITE GENERASI AI GENERIK -->
    <div class="absolute inset-0 bg-slate-900 text-slate-300 flex flex-col justify-between p-6 md:p-8">
      <!-- AI Web Header Mockup -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          <span class="ml-2 font-mono text-3xs text-slate-500">https://ai-generator-auto-store.id</span>
        </div>
        <span class="text-3xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-bold">
          Website AI Generik
        </span>
      </div>

      <!-- AI Web Main Content -->
      <div class="my-auto max-w-lg mx-auto text-center space-y-4 py-4">
        <div class="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 text-3xs font-bold px-3 py-1 rounded-full">
          <span>Layout Kaku & Hirarki Acak</span>
        </div>
        <h3 class="text-xl md:text-2xl font-black text-slate-400 font-mono leading-tight">
          Generic AI Web Template
        </h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Keluaran prompt AI sering kaku, tata letak tidak seimbang, dan tanpa integrasi pemesanan WhatsApp.
        </p>
        <div class="flex items-center justify-center gap-3 pt-2">
          <span class="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-xs font-mono border border-slate-700">
            Form Email Biasa
          </span>
        </div>
      </div>

      <!-- AI Warning Tags Footer -->
      <div class="pt-3 border-t border-slate-800 flex items-center justify-between text-3xs text-slate-500 font-mono">
        <span>Prompt Sering Meleset</span>
        <span>Tanpa Review UI/UX</span>
      </div>
    </div>

    <!-- Foreground Layer (Left Side Active): WEBSITE PLATFORM PINOKA -->
    <div 
      class="absolute inset-y-0 left-0 bg-slate-950 border-r-2 border-primary overflow-hidden shadow-2xl"
      style="width: {sliderValue}%"
    >
      <div class="absolute inset-0 w-[896px] h-[440px] md:h-[500px] flex flex-col justify-between p-6 md:p-8 bg-slate-950 text-white font-sans">
        <!-- Pinoka Web Header Mockup -->
        <div class="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span class="font-extrabold text-white font-heading">Kopi Senja Ijen</span>
            <span class="ml-2 font-mono text-3xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              kopi-senja.pinoka.id
            </span>
          </div>
          <span class="text-3xs bg-primary/20 text-primary border border-primary/30 px-2.5 py-0.5 rounded-full font-bold">
            Desain UI/UX Rapi
          </span>
        </div>

        <!-- Pinoka Web Main Content -->
        <div class="my-auto max-w-lg mx-auto text-center space-y-4 py-4">
          <div class="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-3xs font-bold px-3 py-1 rounded-full">
            <span>Optimasi UI/UX & Direct WA</span>
          </div>
          <h3 class="text-2xl md:text-3xl font-black text-white font-heading tracking-tight leading-tight">
            Kopi Robusta Asli Ijen Banyuwangi
          </h3>
          <p class="text-xs md:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Layout bersih buatan desainer lokal. Sangat ringan di HP dan pesanan otomatis masuk ke WhatsApp.
          </p>
          <div class="pt-2">
            <button class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-full text-xs font-extrabold shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2">
              <span>Pesan via WhatsApp</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>

        <!-- Pinoka Feature Tags Footer -->
        <div class="pt-3 border-t border-white/10 flex items-center justify-between text-3xs text-emerald-400 font-bold">
          <span>Visual Drag & Drop</span>
          <span>Karya Desainer Lokal</span>
        </div>
      </div>
    </div>

    <!-- Slider Handle -->
    <div 
      class="absolute top-0 bottom-0 w-0.5 bg-white -ml-px cursor-ew-resize z-20 flex items-center justify-center"
      style="left: {sliderValue}%"
    >
      <div class="w-10 h-10 bg-primary text-white border-2 border-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8L22 12L18 16"/><path d="M6 8L2 12L6 16"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
      </div>
    </div>

    <!-- Labels Overlay -->
    <div class="absolute top-4 left-4 bg-primary text-white text-3xs font-extrabold px-3 py-1.5 rounded-full pointer-events-none z-30 shadow-md">
      PINOKA BUILDER
    </div>
    <div class="absolute top-4 right-4 bg-slate-900/90 text-slate-300 border border-slate-700 text-3xs font-extrabold px-3 py-1.5 rounded-full pointer-events-none z-10">
      WEBSITE AI GENERIK
    </div>
  </div>

  <!-- Side-by-Side Comparison Feature Grid (LEFT: Pinoka Platform, RIGHT: AI Generik) -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto pt-4 text-xs font-sans">
    <!-- Pinoka Platform Card (LEFT CARD) -->
    <div class="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
      <div class="flex items-center gap-2 text-primary font-bold font-heading text-sm">
        <span class="material-symbols-outlined text-base text-emerald-500">check_circle</span>
        <span>Pinoka Builder</span>
      </div>
      <ul class="space-y-2 text-main dark:text-slate-200">
        <li class="flex items-start gap-2">
          <span class="text-emerald-500 font-bold">✓</span>
          <span><strong>Desain Karya Desainer:</strong> Dikerjakan desainer lokal dengan tata letak rapi & berstruktur.</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-emerald-500 font-bold">✓</span>
          <span><strong>Checkout via WhatsApp:</strong> Rincian order otomatis terformat dan langsung masuk ke WA toko.</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-emerald-500 font-bold">✓</span>
          <span><strong>Visual Drag & Drop:</strong> Ubah foto, teks, dan komponen langsung di kanvas tanpa perlu nulis prompt.</span>
        </li>
      </ul>
    </div>

    <!-- AI Generik Card (RIGHT CARD) -->
    <div class="p-5 rounded-2xl bg-nested/60 border border-light space-y-3">
      <div class="flex items-center gap-2 text-rose-500 font-bold font-heading text-sm">
        <span class="material-symbols-outlined text-base">cancel</span>
        <span>Website AI Generik</span>
      </div>
      <ul class="space-y-2 text-muted">
        <li class="flex items-start gap-2">
          <span class="text-rose-500 font-bold">✕</span>
          <span><strong>Layout Kaku & Pasaran:</strong> Output prompt sering acak-acakan dan mirip dengan ribuan web lain.</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-rose-500 font-bold">✕</span>
          <span><strong>Tanpa Integrasi WA:</strong> Pengunjung dipaksa isi form email biasa yang jarang dibaca.</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-rose-500 font-bold">✕</span>
          <span><strong>Edit via Prompt Meleset:</strong> Minta ubah satu bagian, elemen lain justru sering ikut rusak.</span>
        </li>
      </ul>
    </div>
  </div>
</div>
