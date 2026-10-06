<script lang="ts">
  import {
    Store,
    ShoppingBag,
    PhoneCall,
    ShieldCheck,
  } from "lucide-svelte";
  import { Badge } from "@/components/ui";
  import type { TemplateItem } from "../onboarding.types";
  import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

  export let activeTemplate: TemplateItem | undefined = undefined;
  export let storeName: string = "";
  export let subdomain: string = "";
  export let mainDomain: string = "localhost:4321";
</script>

<div class="lg:col-span-7 order-1 lg:order-2 sticky top-6">
  <div
    class="bg-card rounded-2xl border border-light shadow-sm overflow-hidden"
  >
    <!-- Mockup Browser Top Bar -->
    <div
      class="h-10 px-4 bg-nested border-b border-light flex items-center justify-between"
    >
      <div class="flex items-center gap-1.5">
        <div class="w-2.5 h-2.5 rounded-full bg-error/80"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-warning/80"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-success/80"></div>
      </div>
      <div
        class="px-3 py-1 rounded-md bg-card border border-light text-2xs font-mono text-secondary flex items-center gap-1.5 max-w-[260px] truncate shadow-2xs"
      >
        <span class="w-2 h-2 rounded-full bg-success shrink-0"></span>
        <span class="text-main font-semibold truncate"
          >{subdomain || "tokomami"}.{mainDomain}</span
        >
      </div>
      <div class="text-3xs font-bold uppercase tracking-caps text-primary">
        Preview
      </div>
    </div>

    <!-- Preview Body Canvas -->
    <div
      class="p-4 sm:p-5 bg-nested/40 min-h-[380px] max-h-[460px] overflow-y-auto scrollbar-thin"
    >
      {#if activeTemplate}
        <div class="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <!-- Mockup Store Header -->
          <div
            class="bg-card p-3 rounded-xl border border-light shadow-2xs flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs"
              >
                <Store size={15} />
              </div>
              <div>
                <h4
                  class="text-xs font-bold font-heading text-main leading-tight"
                >
                  {storeName || "Nama Toko Anda"}
                </h4>
                <p class="text-3xs text-secondary leading-tight">
                  Katalog Resmi & WhatsApp Order
                </p>
              </div>
            </div>
            <Badge variant="success" size="sm">
              Buka
            </Badge>
          </div>

          <!-- Mockup Hero Showcase Banner -->
          <div
            class="relative rounded-2xl overflow-hidden border border-light bg-slate-950 text-white min-h-[150px] flex items-center p-5"
          >
            {#if activeTemplate.thumbnailUrl}
              <img
                src={getOptimizedCloudinaryUrl(activeTemplate.thumbnailUrl, 800)}
                alt={activeTemplate.name}
                class="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
                loading="lazy"
              />
            {/if}
            <div
              class="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent"
            ></div>
            <div class="relative z-10 space-y-2 max-w-xs">
              <span
                class="text-3xs font-bold uppercase tracking-caps text-primary-light bg-primary/20 px-2 py-0.5 rounded border border-primary/30"
              >
                {activeTemplate.name}
              </span>
              <h3
                class="text-base font-bold font-heading leading-tight drop-shadow-sm"
              >
                {storeName || "Selamat Datang di Toko Kami"}
              </h3>
              <p
                class="text-xs text-white/80 line-clamp-2 leading-relaxed font-sans"
              >
                Produk berkualitas tinggi dengan pengiriman cepat langsung
                dari pengrajin & produsen terpercaya.
              </p>
              <button
                type="button"
                class="mt-1 px-3 py-1.5 rounded-lg bg-success text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <PhoneCall size={12} /> Hubungi Penjual
              </button>
            </div>
          </div>

          <!-- Mockup Product Catalog Grid Preview -->
          <div class="space-y-2">
            <div class="flex items-center justify-between px-1">
              <span
                class="text-xs font-bold text-main flex items-center gap-1"
              >
                <ShoppingBag size={13} class="text-primary" /> Produk Unggulan
              </span>
              <span class="text-3xs text-secondary font-medium"
                >3 Produk Sampel</span
              >
            </div>
            <div class="grid grid-cols-3 gap-2">
              {#each [1, 2, 3] as idx}
                <div
                  class="bg-card p-2 rounded-xl border border-light text-center space-y-1 shadow-2xs"
                >
                  <div
                    class="w-full h-14 rounded-lg bg-nested flex items-center justify-center text-secondary/60 text-3xs"
                  >
                    Foto {idx}
                  </div>
                  <p class="text-xs font-bold text-main truncate font-sans">
                    Produk Spesial #{idx}
                  </p>
                  <p class="text-2xs font-extrabold text-primary">
                    Rp 45.000
                  </p>
                </div>
              {/each}
            </div>
          </div>

          <!-- Feature Callout -->
          <div
            class="p-3 bg-card rounded-xl border border-light flex items-center gap-2.5 text-secondary"
          >
            <ShieldCheck size={16} class="text-success shrink-0" />
            <span class="text-xs leading-snug">
              Template ini sudah dioptimasi untuk kecepatan buka instan di
              smartphone.
            </span>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
