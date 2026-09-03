<script lang="ts">
  import type { InferSelectModel } from 'drizzle-orm';
  import type { products, storeCategories } from '@/db/schema';
  import { formatCurrency } from '@/lib/utils/format';
  import { ShoppingCart } from 'lucide-svelte';
  import { fly } from 'svelte/transition';
  import CatalogCheckoutModal from '../builder/sections/catalog/CatalogCheckoutModal.svelte';
  // Trigger HMR
  import ProductQuickCheckoutModal from '../builder/sections/catalog/ProductQuickCheckoutModal.svelte';
  import Button from '../ui/Button.svelte';
  import Card from '../ui/Card.svelte';
  import Badge from '../ui/Badge.svelte';

  export let storeId: string = '';
  export let storeProducts: (InferSelectModel<typeof products> & { category: InferSelectModel<typeof storeCategories> })[] = [];
  export let categories: InferSelectModel<typeof storeCategories>[] = [];
  export let storeWaNumber: string = '';

  let activeCategory = 'all';

  $: filteredProducts = activeCategory === 'all' 
    ? storeProducts 
    : storeProducts.filter(p => p.categoryId === activeCategory);

  let currentView: "catalog" | "checkout" | "quick-checkout" | "add-to-cart" = "catalog";

  interface StoreProduct {
    id: string;
    name: string;
    basePrice: number;
    imageUrls?: string[];
    imageUrl?: string;
    category?: { name: string };
    description?: string;
    variants?: Record<string, unknown>[];
  }

  interface CartItem {
    product: StoreProduct;
    selections: Record<string, { name: string }>;
    variantId: string;
    qty: number;
    price: number;
    subtotal: number;
  }

  // Cart with local storage persistence
  let cart: CartItem[] = [];
  let isMounted = false;

  import { onMount } from 'svelte';
  $: storageKey = `cart_${storeId || 'default'}`;

  onMount(() => {
    isMounted = true;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        cart = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  });

  $: if (isMounted) {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }
  let form = { name: "", phone: "", address: "", delivery: "Reguler", notes: "" };
  let selectedProductForCheckout: StoreProduct | null = null;

  $: totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);
  $: detailedCart = cart.map((item) => ({ ...item, subtotal: item.price * item.qty }));
  $: cartTotal = detailedCart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleAddToCart = (product: unknown) => {
    selectedProductForCheckout = product as StoreProduct;
    currentView = "add-to-cart";
  };

  const handleConfirmAddToCart = ({ product, qty, selections, price }: { product: StoreProduct, qty: number, selections: unknown, variantId?: string, price: number }) => {
    const sel = selections as Record<string, { name: string }>;
    const selectionKey = Object.values(sel).map(s => s.name).sort().join('-');
    const cartVariantId = selectionKey || "default";

    const existingIdx = cart.findIndex((c) => c.product.id === product.id && c.variantId === cartVariantId);
    if (existingIdx >= 0) {
      cart[existingIdx].qty += (qty as number);
      cart = [...cart];
    } else {
      cart = [...cart, { 
        product: { ...product, imageUrl: product.imageUrls?.[0] || product.imageUrl || null } as StoreProduct, 
        variantId: cartVariantId, 
        selections: sel, 
        qty, 
        price, 
        subtotal: price * qty 
      }];
    }
    
    // Save immediately after adding
    localStorage.setItem(storageKey, JSON.stringify(cart));
    currentView = "catalog";
    selectedProductForCheckout = null;
  };

  const handleBuyNow = (product: unknown) => {
    selectedProductForCheckout = product as StoreProduct;
    currentView = "quick-checkout";
  };

  const updateCartQty = (idx: number, delta: number) => {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart = cart.filter((_, i) => i !== idx);
    else cart = [...cart];
  };

  const removeFromCart = (idx: number) => {
    cart = cart.filter((_, i) => i !== idx);
  };

  const handleCheckout = () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat Pengiriman.");
      return;
    }
    
    const itemsSummary = detailedCart
      .map((item) => {
        const p = item.product;
        const s = item.selections;
        return `• ${p.name} (x${item.qty}) - Rp ${item.subtotal.toLocaleString("id-ID")}\n  Varian: ${Object.values(s).map(opt => opt.name).join(", ") || "Standar"}`;
      })
      .join("\n");
      
    const message = `Halo, saya ingin memesan dari katalog toko:\n\n*DAFTAR PESANAN:*\n${itemsSummary}\n\n*TOTAL:* Rp ${cartTotal.toLocaleString("id-ID")}\n\n*DATA PENGIRIMAN:*\nNama: ${form.name}\nWhatsApp: ${form.phone}\nAlamat: ${form.address}\nPengiriman: ${form.delivery}\nCatatan: ${form.notes || "-"}\n\nMohon konfirmasi ketersediaan & info pembayaran. Terima kasih!`;
    
    let targetPhone = (storeWaNumber || '6281234567890').replace(/[^0-9]/g, "");
    if (targetPhone.startsWith("0")) targetPhone = "62" + targetPhone.slice(1);
    if (!targetPhone.startsWith("62")) targetPhone = "62" + targetPhone;
    
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };
</script>

<div class="py-12 bg-white relative">
  {#if currentView === 'catalog'}
  <div class="max-w-[1200px] mx-auto px-4 sm:px-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <h2 class="text-3xl font-bold text-slate-900">Katalog Produk</h2>
      
      <!-- Category Tabs -->
      {#if categories.length > 0}
        <div class="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 mt-4 md:mt-0 hide-scrollbar">
          <Button 
            variant={activeCategory === 'all' ? 'primary' : 'secondary'}
            class="rounded-full"
            size="sm"
            on:click={() => activeCategory = 'all'}
          >
            Semua Produk
          </Button>
          {#each categories as category}
            <Button 
              variant={activeCategory === category.id ? 'primary' : 'secondary'}
              class="rounded-full"
              size="sm"
              on:click={() => activeCategory = category.id}
            >
              {category.name}
            </Button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Product Grid -->
    {#if filteredProducts.length === 0}
      <div class="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-900 mb-2">Belum ada produk</h3>
        <p class="text-slate-500 max-w-sm mx-auto">Kategori ini belum memiliki produk aktif yang tersedia.</p>
      </div>
    {:else}
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {#each filteredProducts as product (product.id)}
          <Card variant="elevated" padding="none" class="group flex flex-col h-full">
            <!-- Image Container -->
            <div class="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-slate-50 flex-shrink-0">
              {#if Array.isArray(product.imageUrls) && product.imageUrls.length > 0}
                <img 
                  src={product.imageUrls[0]} 
                  alt={product.name}
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              {:else}
                <div class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </div>
              {/if}
              
              <!-- Badges -->
              <div class="absolute top-3 left-3 flex gap-1 z-10">
                <Badge size="sm" dot={false} uppercase={true} class="bg-white/90 backdrop-blur-sm shadow-sm text-slate-700">
                  {product.category.name}
                </Badge>
              </div>
            </div>
            
            <!-- Content -->
            <div class="p-4 flex flex-col flex-1">
              <h3 class="font-bold text-slate-900 mb-1 line-clamp-2" title={product.name}>{product.name}</h3>
              
              <div class="mt-auto pt-3 flex flex-col gap-3">
                <p class="text-lg text-[var(--theme-primary,#4f00ff)] font-black font-mono tracking-tight">{formatCurrency(product.basePrice)}</p>
                <div class="flex flex-col xl:grid xl:grid-cols-[auto_1fr] gap-1.5 sm:gap-2 w-full">
                  <Button variant="secondary" class="rounded-xl border-slate-200 text-slate-600 w-full xl:w-12 h-10 flex items-center justify-center shadow-none hover:bg-slate-100" on:click={() => handleAddToCart(product)}>
                    <ShoppingCart size={18} />
                    <span class="xl:hidden ml-2 font-bold text-sm">Keranjang</span>
                  </Button>
                  <Button variant="dark" class="rounded-xl font-bold h-10 w-full text-[13px] sm:text-sm whitespace-nowrap px-1 sm:px-2" on:click={() => handleBuyNow(product)}>
                    Beli Sekarang
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        {/each}
      </div>
    {/if}
  </div>
  {:else if currentView === 'checkout'}
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6">
      <CatalogCheckoutModal
        {detailedCart}
        {cartTotal}
        bind:form
        onBackToCatalog={() => (currentView = "catalog")}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  {:else if (currentView === 'quick-checkout' || currentView === 'add-to-cart') && selectedProductForCheckout}
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6">
      <ProductQuickCheckoutModal 
        product={selectedProductForCheckout} 
        storeWaNumber={storeWaNumber}
        mode={currentView === "add-to-cart" ? "add_to_cart" : "buy_now"}
        onAddToCart={handleConfirmAddToCart}
        onBack={() => {
          currentView = "catalog";
          selectedProductForCheckout = null;
        }}
      />
    </div>
  {/if}

  <!-- Floating Sticky Cart Pill -->
  {#if totalCartItems > 0 && currentView === "catalog"}
    <div transition:fly={{ y: 20, duration: 250 }} class="fixed bottom-6 right-6 z-40">
      <Button
        variant="dark"
        size="lg"
        class="rounded-full shadow-2xl flex items-center gap-3 border border-white/10 hover:scale-105 active:scale-95 transition-all z-50"
        on:click={() => (currentView = "checkout")}
      >
        <div class="relative flex items-center justify-center">
          <ShoppingCart size={20} />
          <span class="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
            {totalCartItems}
          </span>
        </div>
        <span class="font-bold hidden sm:inline">Keranjang</span>
        <span class="bg-white/20 px-2 py-0.5 rounded-full text-xs font-mono font-bold tracking-tight">
          Rp {cartTotal.toLocaleString("id-ID")}
        </span>
      </Button>
    </div>
  {/if}
</div>

<style>
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
