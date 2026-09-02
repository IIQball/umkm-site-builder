<script lang="ts">
  import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-svelte';
  import { slide, fly } from 'svelte/transition';
  import WhatsAppIcon from '../../../ui/WhatsAppIcon.svelte';

  export let detailedCart: any[] = [];
  export let cartTotal: number = 0;
  export let form = {
    name: '',
    phone: '',
    address: '',
    delivery: 'Reguler',
    notes: '',
  };
  export let onBackToCatalog: () => void;
  export let onUpdateQty: (idx: number, delta: number) => void;
  export let onRemoveItem: (idx: number) => void;
  export let onCheckout: () => void;
</script>

<div
  in:fly={{ x: 20, duration: 400, delay: 100 }}
  out:fly={{ x: 20, duration: 300 }}
  class="py-4 sm:py-8 max-w-5xl mx-auto text-left"
>
  <div class="flex items-center gap-4 mb-8">
    <button
      class="btn btn-circle btn-ghost btn-sm hover:scale-105 active:scale-95 transition-all"
      on:click={onBackToCatalog}
    >
      <ArrowLeft size={20} />
    </button>
    <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
      Selesaikan Pesanan Anda
    </h2>
  </div>

  <div class="flex flex-col lg:flex-row gap-6 lg:gap-10">
    <!-- BAGIAN KIRI: RINGKASAN PESANAN -->
    <div class="flex-1 lg:sticky lg:top-8 self-start">
      <div class="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col h-fit">
        <h3 class="text-base font-bold mb-6 text-slate-800 dark:text-slate-100">
          Ringkasan Pesanan
        </h3>

        {#if detailedCart.length === 0}
          <div class="p-8 text-center border border-slate-200 dark:border-slate-700 border-dashed rounded-2xl">
            <p class="font-medium text-slate-500">Keranjang kosong.</p>
            <button
              class="btn btn-sm mt-4 rounded-full bg-[var(--theme-primary,#4f00ff)] text-white hover:brightness-110 border-none hover:scale-105 transition-all"
              on:click={onBackToCatalog}
            >
              Kembali Belanja
            </button>
          </div>
        {:else}
          <div class="space-y-4 flex-1">
            {#each detailedCart as item, idx}
              <div
                class="flex gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl group hover:bg-slate-100 transition-colors"
                transition:slide={{ duration: 300 }}
              >
                <div class="w-[72px] h-[72px] rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                  {#if item.product.imageUrl}
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  {/if}
                </div>
                <div class="flex-1 flex flex-col justify-center">
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {item.product.name}
                  </h4>
                  <p class="text-[12px] text-slate-500 mt-0.5">
                    Varian: {Object.values(item.selections).join(', ')}
                  </p>
                  <p class="text-[var(--theme-primary,#4f00ff)] font-extrabold font-mono mt-1.5 text-sm tracking-tight">
                    Rp {item.price.toLocaleString('id-ID')}
                  </p>
                </div>
                <div class="flex items-center gap-3">
                  <div class="flex flex-col items-center bg-white dark:bg-slate-600 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-500">
                    <button
                      class="btn btn-xs btn-ghost rounded-none h-7 min-h-0 w-8 hover:bg-slate-100 text-slate-500"
                      on:click={() => onUpdateQty(idx, 1)}
                    >
                      <Plus size={14} />
                    </button>
                    <span class="text-xs font-bold w-8 text-center py-0.5">{item.qty}</span>
                    <button
                      class="btn btn-xs btn-ghost rounded-none h-7 min-h-0 w-8 hover:bg-slate-100 text-slate-500"
                      on:click={() => onUpdateQty(idx, -1)}
                    >
                      <Minus size={14} />
                    </button>
                  </div>
                  <button
                    class="btn btn-ghost btn-sm btn-circle text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    on:click={() => onRemoveItem(idx)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            {/each}
          </div>

          <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-between items-end">
            <span class="font-bold text-slate-700 dark:text-slate-300">Total Harga</span>
            <div class="text-right">
              <p class="text-2xl font-black font-mono text-[var(--theme-primary,#4f00ff)] tracking-tight">
                Rp {cartTotal.toLocaleString('id-ID')}
              </p>
              <p class="text-[10px] text-slate-400 mt-1">
                *Belum termasuk ongkos kirim
              </p>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- BAGIAN KANAN: INFORMASI PENGIRIMAN -->
    <div class="w-full lg:w-[480px]">
      <div class="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
        <h3 class="text-base font-bold mb-6 text-slate-800 dark:text-slate-100">
          Informasi Pengiriman
        </h3>

        <div class="space-y-5">
          <div class="flex flex-col sm:flex-row gap-5">
            <div class="flex-1">
              <label for="form-name" class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                Nama Lengkap *
              </label>
              <input
                id="form-name"
                type="text"
                bind:value={form.name}
                placeholder="Misal: Budi Santoso"
                class="input input-sm h-11 w-full rounded-xl bg-slate-50 border-slate-200 focus:border-[var(--theme-primary,#4f00ff)] focus:ring-[var(--theme-primary,#4f00ff)] placeholder:text-slate-400 placeholder:italic placeholder:font-light transition-colors"
              />
            </div>
            <div class="flex-1">
              <label for="form-phone" class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                Nomor WhatsApp *
              </label>
              <input
                id="form-phone"
                type="tel"
                bind:value={form.phone}
                placeholder="Contoh: 08123456789"
                class="input input-sm h-11 w-full rounded-xl bg-slate-50 border-slate-200 focus:border-[var(--theme-primary,#4f00ff)] focus:ring-[var(--theme-primary,#4f00ff)] placeholder:text-slate-400 placeholder:italic placeholder:font-light transition-colors"
              />
            </div>
          </div>

          <div>
            <label for="form-address" class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
              Alamat Lengkap *
            </label>
            <textarea
              id="form-address"
              bind:value={form.address}
              placeholder="Jalan, No Rumah, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Kodepos"
              class="textarea w-full rounded-xl bg-slate-50 border-slate-200 h-24 focus:border-[var(--theme-primary,#4f00ff)] focus:ring-[var(--theme-primary,#4f00ff)] placeholder:text-slate-400 placeholder:italic placeholder:font-light transition-colors pt-3"
            ></textarea>
          </div>

          <div>
            <label for="form-delivery" class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
              Opsi Pengantaran *
            </label>
            <select
              id="form-delivery"
              bind:value={form.delivery}
              class="select select-sm h-11 w-full rounded-xl bg-slate-50 border-slate-200 focus:border-[var(--theme-primary,#4f00ff)] focus:ring-[var(--theme-primary,#4f00ff)] transition-colors"
            >
              <option value="Reguler">Reguler (Estimasi 2-3 Hari)</option>
              <option value="Instan">Instan (Gojek/Grab)</option>
            </select>
          </div>

          <div class="mb-8">
            <label for="form-notes" class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
              Catatan Tambahan (Opsional)
            </label>
            <input
              id="form-notes"
              type="text"
              bind:value={form.notes}
              placeholder="Misal: Warna khusus, patokan rumah"
              class="input input-sm h-11 w-full rounded-xl bg-slate-50 border-slate-200 focus:border-[var(--theme-primary,#4f00ff)] focus:ring-[var(--theme-primary,#4f00ff)] placeholder:text-slate-400 placeholder:italic placeholder:font-light transition-colors"
            />
          </div>

          <button
            class="btn w-full rounded-xl text-white shadow-md border-none flex gap-2 h-12 bg-[#25D366] hover:bg-[#20BA56] hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-sm cursor-pointer"
            disabled={detailedCart.length === 0}
            on:click={onCheckout}
          >
            <WhatsAppIcon size={18} /> Kirim Pesanan via WhatsApp
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
