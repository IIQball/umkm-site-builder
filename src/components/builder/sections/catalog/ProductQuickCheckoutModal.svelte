<script lang="ts">
  import { firstProductImageUrl } from '@/lib/products/image';
  import { ArrowLeft, Plus, Minus } from 'lucide-svelte';
  import { fly } from 'svelte/transition';
  import WhatsAppIcon from '../../../ui/WhatsAppIcon.svelte';
  import Button from '../../../ui/Button.svelte';
  import Input from '../../../ui/Input.svelte';
  import Textarea from '../../../ui/Textarea.svelte';
  import Select from '../../../ui/Select.svelte';
  import Card from '../../../ui/Card.svelte';
  import Badge from '../../../ui/Badge.svelte';
  import { formatIDR } from '@/lib/currency';
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  interface StoreProduct {
    id: string;
    name: string;
    basePrice: number;
    imageUrls?: unknown;
    imageUrl?: string;
    category?: { name: string };
    description?: string;
    variants?: Record<string, unknown>[];
  }

  export let product: StoreProduct;
  export let storeWaNumber: string = '';
  export let onBack: () => void;
  export let onAddToCart: ((data: { product: StoreProduct; qty: number; selections: unknown; variantId?: string; price: number }) => void) | null = null;
  export let mode: 'buy_now' | 'add_to_cart' = 'buy_now';

  let qty = 1;
  let selectedVariants: Record<string, Record<string, unknown>> = {};
  
  // Quick form for direct checkout
  let form = {
    name: "",
    phone: "",
    address: "",
    delivery: "Kurir Toko / Standar",
    notes: ""
  };

  $: basePrice = Number(product?.basePrice) || 0;
  
  // Safe normalized variants grouping
  $: normalizedVariants = Array.isArray(product?.variants) 
    ? product.variants.map((group: Record<string, unknown>, idx: number) => ({
        id: (group?.id as string) || `group_${idx}`,
        groupName: (group?.groupName as string) || (group?.name as string) || `Varian ${idx + 1}`,
        options: Array.isArray(group?.options) ? group.options : []
      }))
    : [];

  // Default selection when variants change
  $: if (normalizedVariants.length > 0 && Object.keys(selectedVariants).length === 0) {
    const initial: Record<string, Record<string, unknown>> = {};
    normalizedVariants.forEach((group) => {
      if (group.options.length > 0) {
        initial[group.groupName] = group.options[0];
      }
    });
    selectedVariants = initial;
  }

  const handleSelectVariant = (groupKey: string, option: Record<string, unknown>) => {
    selectedVariants[groupKey] = option;
    selectedVariants = { ...selectedVariants };
  };

  const handleQtyChange = (delta: number) => {
    const next = qty + delta;
    if (next >= 1 && next <= 99) qty = next;
  };

  $: variantAdjustment = Object.values(selectedVariants).reduce(
    (sum: number, option: Record<string, unknown>) => sum + ((option?.priceAdjustment as number) || 0),
    0
  );
  $: unitPrice = basePrice + variantAdjustment;
  $: totalPrice = unitPrice * qty;

  const handleCheckout = () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat Pengiriman.");
      return;
    }

    const selectionsText = Object.values(selectedVariants)
      .map((opt: Record<string, unknown>) => opt.name)
      .join(", ") || "Standar";

    const message = `Halo, saya ingin memesan produk berikut secara langsung:\n\n*${product?.name}*\nJumlah: ${qty}\nVarian: ${selectionsText}\nSubtotal: ${formatIDR(totalPrice)}\n\n*DATA PENGIRIMAN:*\nNama: ${form.name}\nWhatsApp: ${form.phone}\nAlamat: ${form.address}\nPengiriman: ${form.delivery}\nCatatan: ${form.notes || "-"}\n\nMohon konfirmasi ketersediaan & info pembayaran. Terima kasih!`;
    
    const waUrl = generateWhatsAppLink(storeWaNumber || '6281234567890', message);
    window.open(waUrl, "_blank");
  };
</script>

<div
  in:fly={{ y: 20, duration: 300 }}
  out:fly={{ y: 20, duration: 200 }}
  class="py-4 sm:py-8 max-w-5xl mx-auto text-left"
>
  <div class="flex items-center gap-4 mb-8">
    <Button
      variant="ghost"
      size="icon"
      class="rounded-full hover:scale-105 active:scale-95 transition-all text-slate-600"
      on:click={onBack}
    >
      <ArrowLeft size={20} />
    </Button>
    <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
      {mode === 'buy_now' ? 'Beli Langsung' : 'Pilih Varian & Jumlah'}
    </h2>
  </div>

  <div class="flex flex-col lg:flex-row gap-6 lg:gap-10 {mode === 'add_to_cart' ? 'justify-center max-w-2xl mx-auto' : ''}">
    <!-- LEFT: PRODUCT DETAILS & VARIANTS -->
    <div class="flex-1 {mode === 'buy_now' ? 'lg:sticky lg:top-8 self-start' : ''}">
      <Card variant="elevated" padding="none" radius="2xl" class="flex flex-col overflow-hidden bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
        <!-- Image Container -->
        <div class="relative aspect-square sm:aspect-video lg:aspect-square overflow-hidden bg-slate-50 w-full flex-shrink-0">
          {#if firstProductImageUrl(product.imageUrls)}
            <img 
              src={firstProductImageUrl(product.imageUrls)} 
              alt={product.name}
              class="w-full h-full object-cover"
            />
          {:else if product.imageUrl}
            <img 
              src={product.imageUrl} 
              alt={product.name}
              class="w-full h-full object-cover"
            />
          {:else}
            <div class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
              <span class="text-sm">Tidak ada gambar</span>
            </div>
          {/if}
          
          {#if product.category?.name}
            <div class="absolute top-4 left-4 z-10">
              <Badge size="sm" dot={false} uppercase={true} class="bg-white/90 backdrop-blur-sm shadow-sm text-slate-700">
                {product.category.name}
              </Badge>
            </div>
          {/if}
        </div>

        <div class="p-6 sm:p-8">
          <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">{product.name}</h3>
          <p class="text-2xl font-black font-mono text-[var(--theme-primary,#2563eb)] tracking-tight mb-6">{formatIDR(unitPrice)}</p>
          
          {#if product.description}
            <div class="mb-8">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white mb-2">Deskripsi Produk</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
          {/if}

          <!-- VARIANTS -->
          {#if normalizedVariants.length > 0}
            <div class="space-y-5 mb-8">
              {#each normalizedVariants as variantGroup}
                {#if Array.isArray(variantGroup.options) && variantGroup.options.length > 0}
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">{variantGroup.groupName}</h4>
                    <div class="flex flex-wrap gap-2">
                      {#each variantGroup.options as option}
                        {@const groupKey = String(variantGroup.groupName)}
                        {@const isSelected = selectedVariants[groupKey]?.name === option.name}
                        <Button 
                          variant={isSelected ? "primary" : "secondary"}
                          size="sm"
                          class={`rounded-xl ${isSelected ? 'shadow-md' : ''}`}
                          on:click={() => handleSelectVariant(groupKey, option)}
                        >
                          {option.name} 
                          {#if option.priceAdjustment}
                            <span class="text-[10px] ml-1 opacity-80">(+{formatIDR(option.priceAdjustment)})</span>
                          {/if}
                        </Button>
                      {/each}
                    </div>
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
          
          <!-- QUANTITY -->
          <div class="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-6">
            <span class="text-sm font-bold text-slate-700 dark:text-slate-300">Jumlah</span>
            <div class="flex items-center bg-slate-50 dark:bg-slate-700 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600">
              <Button variant="ghost" size="icon" class="rounded-none h-9 w-10 text-slate-600 dark:text-slate-300" on:click={() => handleQtyChange(-1)}>
                <Minus size={16} />
              </Button>
              <span class="text-sm font-bold w-12 text-center py-1">{qty}</span>
              <Button variant="ghost" size="icon" class="rounded-none h-9 w-10 text-slate-600 dark:text-slate-300" on:click={() => handleQtyChange(1)}>
                <Plus size={16} />
              </Button>
            </div>
          </div>
          
          {#if mode === 'add_to_cart'}
            <div class="mt-8 border-t border-slate-100 dark:border-slate-700 pt-6">
              <Button
                size="lg"
                class="w-full font-bold shadow-md text-white bg-slate-900 hover:bg-slate-800"
                on:click={() => onAddToCart && onAddToCart({ product, qty, selections: selectedVariants, variantId: 'custom', price: unitPrice })}
              >
                Masukkan Keranjang - {formatIDR(totalPrice)}
              </Button>
            </div>
          {/if}
        </div>
      </Card>
    </div>

    <!-- RIGHT: FORM PEMESANAN -->
    {#if mode === 'buy_now'}
    <div class="w-full lg:w-[480px] lg:sticky lg:top-8 self-start">
      <Card variant="elevated" padding="lg" radius="2xl" class="bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
        <h3 class="text-base font-bold mb-6 text-slate-800 dark:text-slate-100">
          Informasi Pengiriman
        </h3>

        <div class="space-y-5">
          <div class="flex flex-col sm:flex-row gap-5">
            <div class="flex-1">
              <Input id="form-name" label="Nama Lengkap" required={true} bind:value={form.name} placeholder="Misal: Budi Santoso" />
            </div>
            <div class="flex-1">
              <Input id="form-phone" type="tel" label="Nomor WhatsApp" required={true} bind:value={form.phone} placeholder="Contoh: 08123456789" />
            </div>
          </div>

          <div>
            <Textarea id="form-address" label="Alamat Lengkap" required={true} bind:value={form.address} placeholder="Jalan, No Rumah, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Kodepos" rows={3} />
          </div>

          <div>
            <Select
              id="form-delivery"
              label="Opsi Pengantaran"
              required={true}
              bind:value={form.delivery}
              options={[
                { value: 'Reguler', label: 'Reguler (Estimasi 2-3 Hari)' },
                { value: 'Instan', label: 'Instan (Gojek/Grab)' }
              ]}
            />
          </div>

          <div class="mb-8">
            <Input
              id="form-notes"
              label="Catatan Tambahan (Opsional)"
              bind:value={form.notes}
              placeholder="Misal: Warna khusus, patokan rumah"
            />
          </div>

          <div class="border-t border-slate-100 dark:border-slate-700 pt-5 mb-5 flex justify-between items-center">
            <span class="text-sm text-slate-500">Total Pembayaran</span>
            <span class="text-xl font-black font-mono tracking-tight text-slate-900 dark:text-white">{formatIDR(totalPrice)}</span>
          </div>

          <Button
            size="lg"
            class="w-full text-white shadow-md border-none flex gap-1.5 sm:gap-2 bg-[#25D366] hover:bg-[#20BA56] px-2 sm:px-4"
            on:click={handleCheckout}
          >
            <WhatsAppIcon size={18} />
            <span class="sm:hidden text-[13px] whitespace-nowrap">Pesan via WA</span>
            <span class="hidden sm:inline">Kirim Pesanan via WhatsApp</span>
          </Button>
        </div>
      </Card>
    </div>
    {/if}
  </div>
</div>
