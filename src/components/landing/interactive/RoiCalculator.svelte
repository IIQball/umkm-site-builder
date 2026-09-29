<script lang="ts">
  // ROI Calculator
  let dailySales = 10;
  
  // Constants for calculation
  const AVG_PRICE = 50000; // Rp 50,000 per product
  const MARKETPLACE_FEE_PCT = 0.06; // 6% marketplace admin fee
  const DAYS_IN_MONTH = 30;

  $: monthlyRevenue = dailySales * AVG_PRICE * DAYS_IN_MONTH;
  $: monthlySavings = monthlyRevenue * MARKETPLACE_FEE_PCT;
  
  function formatIDR(num: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  }
</script>

<div class="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 dark:border-slate-800 p-8 md:p-12">
  <div class="mb-10 text-center">
    <label for="sales-slider" class="block text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-6">
      Berapa pesanan Anda per hari?
    </label>
    
    <div class="flex items-center justify-center gap-6 mb-4">
      <span class="text-3xl md:text-5xl font-black text-blue-600 dark:text-blue-400">
        {dailySales} <span class="text-xl md:text-2xl font-medium text-slate-500">pesanan</span>
      </span>
    </div>
    
    <div class="relative pt-4 pb-2 w-full max-w-lg mx-auto">
      <input 
        id="sales-slider"
        type="range" 
        min="1" 
        max="100" 
        bind:value={dailySales}
        class="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all"
      >
      <div class="flex justify-between text-xs font-bold text-slate-400 mt-3 px-1">
        <span>1</span>
        <span>50</span>
        <span>100+</span>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50 transition-all duration-300 hover:shadow-md">
      <div class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Potensi Omzet Bulanan</div>
      <div class="text-3xl font-black text-slate-800 dark:text-white flex items-baseline gap-1">
        <span class="text-lg text-slate-400 font-medium">Rp</span>
        {formatIDR(monthlyRevenue).replace('Rp', '').trim()}
      </div>
      <div class="text-xs text-slate-400 mt-2">*Asumsi rata-rata harga Rp50.000/item</div>
    </div>

    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30 transition-all duration-300 hover:shadow-md hover:border-blue-300 relative overflow-hidden">
      <div class="absolute -right-4 -top-4 text-6xl opacity-10">💰</div>
      <div class="relative z-10">
        <div class="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">Penghematan (Bebas Potongan)</div>
        <div class="text-3xl font-black text-blue-700 dark:text-blue-300 flex items-baseline gap-1">
          <span class="text-lg text-blue-500 font-medium">Rp</span>
          {formatIDR(monthlySavings).replace('Rp', '').trim()}
        </div>
        <div class="text-xs text-blue-600/70 dark:text-blue-400/70 mt-2">*Diselamatkan dari potongan admin 6%</div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Custom slider thumb — blue to match primary */
  input[type=range]::-webkit-slider-thumb {
    appearance: none;
    width: 28px;
    height: 28px;
    background: #ffffff;
    border: 3px solid #2563eb;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
    transition: transform 0.1s;
  }
  input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }
  input[type=range]::-webkit-slider-thumb:active {
    transform: scale(0.95);
    background: #eff6ff;
  }

  /* Firefox */
  input[type=range]::-moz-range-thumb {
    width: 28px;
    height: 28px;
    background: #ffffff;
    border: 3px solid #2563eb;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
  }
</style>
