<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Calendar } from 'lucide-svelte';
  import { Badge, SearchableSelect } from '@/components/ui';
  import { INDONESIAN_MONTHS } from '@/lib/utils/format';

  export let availableYears: number[] = [new Date().getFullYear()];
  export let selectedYear: number = new Date().getFullYear();
  export let selectedMonth: number | 'all' = 'all';
  export let title: string = 'Filter Periode';
  export let description: string = 'Tampilkan data dan statistik berdasarkan kurun waktu.';
  export let activeBadgePrefix: string = '';

  const dispatch = createEventDispatcher<{
    change: { year: number; month: number | 'all' };
  }>();

  $: monthOptions = [
    { value: 'all', label: 'Semua Bulan' },
    ...INDONESIAN_MONTHS.map((m, i) => ({
      value: i + 1,
      label: m,
    })),
  ];

  $: yearOptions = (availableYears.length > 0 ? availableYears : [new Date().getFullYear()]).map((y) => ({
    value: y,
    label: `${y}`,
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
      ? `${activeBadgePrefix ? activeBadgePrefix + ' ' : ''}${selectedYear}`
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
  <div class="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
    <!-- Searchable Dropdown Bulan -->
    <div class="w-full sm:w-auto sm:min-w-[190px] md:min-w-[210px]">
      <SearchableSelect
        value={selectedMonth}
        options={monthOptions}
        placeholder="Pilih Bulan..."
        searchPlaceholder="Cari nama bulan..."
        clearable={false}
        size="sm"
        fullWidth={true}
        popoverWidth="w-full min-w-full sm:min-w-[210px] sm:max-w-[240px]"
        on:change={handleMonthChange}
      />
    </div>

    <!-- Searchable Dropdown Tahun -->
    <div class="w-full sm:w-auto sm:min-w-[110px] md:min-w-[120px]">
      <SearchableSelect
        value={selectedYear}
        options={yearOptions}
        placeholder="Pilih Tahun..."
        searchPlaceholder="Cari tahun..."
        clearable={false}
        size="sm"
        align="right"
        fullWidth={true}
        searchable={yearOptions.length > 5}
        popoverWidth="w-full min-w-full sm:w-36 sm:min-w-[120px]"
        on:change={handleYearChange}
      />
    </div>
  </div>
</div>
