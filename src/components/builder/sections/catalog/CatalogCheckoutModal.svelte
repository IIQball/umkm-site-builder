<!-- Note: Inline checkout block component (rendered in-place inside catalog canvas, not an overlay dialog). -->
<script lang="ts">
  import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-svelte';
  import { fly } from 'svelte/transition';
  import WhatsAppIcon from '../../../ui/WhatsAppIcon.svelte';
  import Button from '../../../ui/Button.svelte';
  import Input from '../../../ui/Input.svelte';
  import Textarea from '../../../ui/Textarea.svelte';
  import Card from '../../../ui/Card.svelte';
  import { formatIDR } from '@/lib/currency';
  import type { ProductItem } from '@/types';

  interface CartItem {
    product: ProductItem;
    selections: Record<string, { name: string; priceAdjustment?: number } | string>;
    qty: number;
    price: number;
    subtotal: number;
  }

  export let detailedCart: CartItem[] = [];
  export let cartTotal: number = 0;
  export let form = {
    name: '',
    phone: '',
    address: '',
    notes: '',
  };
  export let onBackToCatalog: () => void;
  export let onUpdateQty: (idx: number, delta: number) => void;
  export let onRemoveItem: (idx: number) => void;
  export let onCheckout: () => void;

  const getVariantText = (selections: unknown) => {
    if (!selections) return 'Standar';
    const sel = selections as Record<string, unknown>;
    const names = Object.values(sel)
      .map((s) => {
        if (typeof s === 'object' && s && 'name' in s) {
          const opt = s as { name: string; priceAdjustment?: number };
          return opt.priceAdjustment ? `${opt.name} (+${formatIDR(opt.priceAdjustment)})` : opt.name;
        }
        return String(s);
      })
      .filter(Boolean);
    return names.join(', ') || 'Standar';
  };
</script>

<div
  in:fly={{ x: 20, duration: 400, delay: 100 }}
  out:fly={{ x: 20, duration: 300 }}
  class="py-4 sm:py-8 max-w-5xl mx-auto text-left"
>
  <div class="flex items-center gap-4 mb-8">
    <Button
      variant="ghost"
      size="icon"
      class="rounded-full hover:scale-105 active:scale-95 transition-all text-slate-600"
      on:click={onBackToCatalog}
    >
      <ArrowLeft size={20} />
    </Button>
    <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
      Selesaikan Pesanan Anda
    </h2>
  </div>

  <div class="flex flex-col lg:flex-row gap-6 lg:gap-10">
    <!-- BAGIAN KIRI: RINGKASAN PESANAN -->
    <div class="flex-1 lg:sticky lg:top-8 self-start">
      <Card variant="elevated" padding="lg" radius="2xl" class="flex flex-col h-fit bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
        <h3 class="text-base font-bold mb-6 text-slate-800 dark:text-slate-100">
          Ringkasan Pesanan
        </h3>

        {#if detailedCart.length === 0}
          <div class="p-8 text-center border border-slate-200 dark:border-slate-700 border-dashed rounded-2xl">
            <p class="font-medium text-slate-500">Keranjang kosong.</p>
            <Button
              variant="primary"
              size="sm"
              class="mt-4 rounded-full"
              on:click={onBackToCatalog}
            >
              Kembali Belanja
            </Button>
          </div>
        {:else}
          <div class="space-y-4 flex-1">
            {#each detailedCart as item, idx}
              {@const itemImg = item.product.image || item.product.imageUrl || item.product.imageUrls?.[0]}
              <Card
                variant="nested"
                padding="xs"
                radius="xl"
                class="flex gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 group hover:bg-slate-100 transition-colors"
              >
                <div class="w-[72px] h-[72px] rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                  {#if itemImg}
                    <img
                      src={itemImg}
                      alt={item.product.name}
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  {:else}
                    <div class="w-full h-full flex items-center justify-center text-slate-400">
                      <span class="text-[10px]">No Foto</span>
                    </div>
                  {/if}
                </div>
                <div class="flex-1 flex flex-col justify-center">
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {item.product.name}
                  </h4>
                  <p class="text-[12px] text-slate-500 mt-0.5">
                    Varian: {getVariantText(item.selections)}
                  </p>
                  <p class="text-[var(--theme-primary,#2563eb)] font-extrabold font-mono mt-1.5 text-sm tracking-tight">
                    {formatIDR(item.price)}
                  </p>
                </div>
                <div class="flex items-center gap-3">
                  <div class="flex flex-col items-center bg-white dark:bg-slate-600 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-500">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="rounded-none h-7 min-h-0 w-8 hover:bg-slate-100 text-slate-500"
                      on:click={() => onUpdateQty(idx, 1)}
                    >
                      <Plus size={14} />
                    </Button>
                    <span class="text-xs font-bold w-8 text-center py-0.5">{item.qty}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="rounded-none h-7 min-h-0 w-8 hover:bg-slate-100 text-slate-500"
                      on:click={() => onUpdateQty(idx, -1)}
                    >
                      <Minus size={14} />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    on:click={() => onRemoveItem(idx)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </Card>
            {/each}
          </div>

          <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-between items-end">
            <span class="font-bold text-slate-700 dark:text-slate-300">Total Harga</span>
            <div class="text-right">
              <p class="text-2xl font-black font-mono text-[var(--theme-primary,#2563eb)] tracking-tight">
                {formatIDR(cartTotal)}
              </p>
              <p class="text-[10px] text-slate-400 mt-1">
                *Belum termasuk ongkos kirim
              </p>
            </div>
          </div>
        {/if}
      </Card>
    </div>

    <!-- BAGIAN KANAN: INFORMASI PENGIRIMAN -->
    <div class="w-full lg:w-[480px]">
      <Card variant="elevated" padding="lg" radius="2xl" class="bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
        <h3 class="text-base font-bold mb-6 text-slate-800 dark:text-slate-100">
          Informasi Pengiriman
        </h3>

        <div class="space-y-5">
          <div class="flex flex-col sm:flex-row gap-5">
            <div class="flex-1">
              <Input
                id="form-name"
                label="Nama Lengkap"
                required={true}
                bind:value={form.name}
                placeholder="Misal: Budi Santoso"
              />
            </div>
            <div class="flex-1">
              <Input
                id="form-phone"
                type="tel"
                label="Nomor WhatsApp"
                required={true}
                bind:value={form.phone}
                placeholder="Contoh: 08123456789"
              />
            </div>
          </div>

          <div>
            <Textarea
              id="form-address"
              label="Alamat Lengkap"
              required={true}
              bind:value={form.address}
              placeholder="Jalan, No Rumah, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Kodepos"
              rows={3}
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

          <Button
            size="lg"
            class="w-full text-white shadow-md border-none flex gap-1.5 sm:gap-2 bg-[#25D366] hover:bg-[#20BA56] px-2 sm:px-4"
            disabled={detailedCart.length === 0}
            on:click={onCheckout}
          >
            <WhatsAppIcon size={18} />
            <span class="sm:hidden text-[13px] whitespace-nowrap">Pesan via WA</span>
            <span class="hidden sm:inline">Kirim Pesanan via WhatsApp</span>
          </Button>
        </div>
      </Card>
    </div>
  </div>
</div>
