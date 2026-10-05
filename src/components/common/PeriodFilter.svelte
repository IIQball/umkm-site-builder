<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Calendar } from 'lucide-svelte';
  import { Badge, SearchableSelect } from '@/components/ui';
  import { INDONESIAN_MONTHS } from '@/lib/utils/format';

  export let availableYears: number[] = [new Date().getFullYear()];
  export let selectedYear: number = new Date().getFullYear();
  export let selectedMonth: number | 'all' = 'all';
  export let title: string = 'Filter Periode Data';
  export let description: string = 'Sesuaikan statistik, grafik pertumbuhan, dan data transaksi berdasarkan periode waktu.';
  export let activeBadgePrefix: string = '';

  const dispatch = createEventDispatcher<{
    change: { year: number; month: number | 'all' };
  }>();

  $: monthOptions = [
    { value: 'all', label: 'Semua Bulan (Setahun Penuh)', sublabel: '12 Bulan' },
    ...INDONESIAN_MONTHS.map((m, i) => ({
      value: i + 1,
      label: m,
      sublabel: `Bulan ke-${i + 1}`,
    })),
  ];

  $: yearOptions = (availableYears.length > 0 ? availableYears : [new Date().getFullYear()]).map((y) => ({
    value: y,
    label: `Tahun ${y}`,
    sublabel: y === new Date().getFullYear() ? 'Tahun Ini' : undefined,
  }));

  function handleMonthChange(event: CustomEvent<{ value: string | number }>) {
    const val = event.detail.value;
    selectedMonth = val === 'all' ? 'all' : parseInt(String(val), 10);
    dispatch('change', { year: selectedYear, month: selectedMonth });
  }

  function handleYearChange(event: CustomEvent<{ value: string | number }>) {
    selectedYear = parseInt(String(event.detail.value), 10);
    dispatch('change', { year: selectedYear, month: selectedMonth });
  }

  $: activeFilterBadge =
    selectedMonth === 'all'
      ? `${activeBadgePrefix ? activeBadgePrefix + ' ' : ''}Tahun ${selectedYear} (12 Bulan Penuh)`
      : `${activeBadgePrefix ? activeBadgePrefix + ' ' : ''}${INDONESIAN_MONTHS[(selectedMonth as number) - 1]} ${selectedYear}`;
</script>

<div
  class="bg-card border border-light rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 relative z-20"
>
  <!-- Left Side: Title & Current Status Badge -->
  <div class="flex items-center gap-3">
    <div
      class="w-10 h-10 rounded-xl bg-nested text-main flex items-center justify-center flex-shrink-0 border border-light shadow-2xs"
    >
      <Calendar size={18} class="text-primary" />
    </div>
    <div>
      <div class="flex items-center gap-2">
        <h3 class="text-heading-xs text-main font-bold font-heading">
          {title}
        </h3>
        <Badge variant="primary" size="sm" dot>
          <span>{activeFilterBadge}</span>
        </Badge>
      </div>
      <p class="text-2xs text-secondary mt-0.5 font-sans">
        {description}
      </p>
    </div>
  </div>

  <!-- Right Side: Searchable Year & Month Dropdowns -->
  <div class="flex flex-wrap sm:flex-nowrap items-center gap-3">
    <!-- Searchable Dropdown Bulan -->
    <div class="w-full sm:w-auto sm:min-w-[240px]">
      <SearchableSelect
        value={selectedMonth}
        options={monthOptions}
        placeholder="Pilih Bulan..."
        searchPlaceholder="Cari nama bulan..."
        clearable={false}
        size="sm"
        fullWidth={true}
        on:change={handleMonthChange}
      />
    </div>

    <!-- Searchable Dropdown Tahun -->
    <div class="w-full sm:w-auto sm:min-w-[130px]">
      <SearchableSelect
        value={selectedYear}
        options={yearOptions}
        placeholder="Pilih Tahun..."
        searchPlaceholder="Cari tahun..."
        clearable={false}
        size="sm"
        fullWidth={true}
        on:change={handleYearChange}
      />
    </div>
  </div>
</div>
