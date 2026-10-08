<script lang="ts">
  import { Palette, ArrowUpRight, ShoppingBag, Plus } from 'lucide-svelte';
  import { Card, Badge, Button, Pagination } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';
  import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';
  import type { DesignerTemplateRecord, DesignerCommissionRecord } from './designerDashboard.types';

  export let templates: DesignerTemplateRecord[] = [];
  export let commissions: DesignerCommissionRecord[] = [];

  let currentPage = 1;
  const pageSize = 10;

  $: approvedTemplates = templates.filter((t) => t.status === 'approved');

  $: templateStats = approvedTemplates.map((t) => {
    const tplCommissions = commissions.filter((c) => c.templateId === t.id);
    const salesCount = tplCommissions.length;
    const totalEarned = tplCommissions.reduce((sum, c) => sum + Number(c.designerAmount || 0), 0);
    return {
      ...t,
      salesCount,
      totalEarned,
    };
  }).sort((a, b) => b.salesCount - a.salesCount || b.totalEarned - a.totalEarned);

  $: paginatedStats = templateStats.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  $: totalApprovedSales = templateStats.reduce((sum, t) => sum + t.salesCount, 0);
  $: totalApprovedRevenue = templateStats.reduce((sum, t) => sum + t.totalEarned, 0);

  const getBarColor = (index: number) => {
    const colors = [
      'bg-primary',
      'bg-success',
      'bg-warning',
      'bg-info',
      'bg-secondary',
    ];
    return colors[index % colors.length];
  };
</script>

<Card
  variant="bordered"
  padding="none"
  radius="2xl"
  class="shadow-xs overflow-hidden h-full flex flex-col justify-between"
>
  <!-- Card Header -->
  <div class="p-5 sm:p-6 border-b border-light flex items-center justify-between gap-3">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
        <Palette size={18} />
      </div>
      <div>
        <h3 class="text-heading-sm sm:text-heading-md text-main font-bold font-heading leading-tight">
          Performa Template Publik
        </h3>
        <p class="text-body-xs text-secondary mt-0.5 font-sans">
          Seluruh template aktif di marketplace publik dan total penjualannya
        </p>
      </div>
    </div>

    <a
      href="/designer/templates"
      class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
    >
      <span>Kelola Semua Template</span>
      <ArrowUpRight size={14} />
    </a>
  </div>

  <!-- Content List -->
  <div class="p-5 sm:p-6 flex-1 flex flex-col justify-center">
    {#if templateStats.length === 0}
      <div class="py-12 px-6 flex flex-col items-center text-center">
        <div class="w-12 h-12 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs">
          <Palette size={20} />
        </div>
        <p class="text-sm font-bold text-main font-heading">Belum Ada Template Publik</p>
        <p class="text-xs text-secondary mt-1 max-w-sm font-sans mb-4">
          Template yang telah Anda buat dan disetujui kurasi akan muncul di sini beserta metrik penjualannya.
        </p>
        <Button href="/builder/new" variant="primary" size="sm">
          <Plus size={14} class="mr-1 inline" />
          <span>Buat Template Baru</span>
        </Button>
      </div>
    {:else}
      <div class="space-y-4">
        {#each paginatedStats as tpl, idx (tpl.id)}
          {@const sharePct = totalApprovedSales > 0 ? Math.round((tpl.salesCount / totalApprovedSales) * 100) : 0}
          <div class="p-3.5 sm:p-4 rounded-2xl bg-nested/40 border border-light hover:border-border transition-all">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
              <!-- Template Info -->
              <div class="flex items-center gap-3 min-w-0">
                <span class="w-6 h-6 rounded-lg bg-nested border border-light flex items-center justify-center font-mono text-2xs font-bold text-secondary flex-shrink-0">
                  #{(currentPage - 1) * pageSize + idx + 1}
                </span>
                {#if tpl.thumbnailUrl}
                  <img
                    src={getOptimizedCloudinaryUrl(tpl.thumbnailUrl, 160)}
                    alt={tpl.name}
                    class="w-12 h-9 rounded-xl object-cover border border-light flex-shrink-0 shadow-2xs"
                    loading="lazy"
                  />
                {:else}
                  <div class="w-12 h-9 rounded-xl bg-nested border border-light flex items-center justify-center text-muted flex-shrink-0 shadow-2xs">
                    <Palette size={16} />
                  </div>
                {/if}
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-xs sm:text-sm text-main truncate font-sans">
                      {tpl.name}
                    </span>
                    <Badge variant="success" size="sm" dot>Publik</Badge>
                  </div>
                  <div class="flex items-center gap-2 mt-0.5 text-xs text-secondary font-mono">
                    {#if tpl.categoryName}
                      <span>{tpl.categoryName}</span>
                      <span>•</span>
                    {/if}
                    <span>{tpl.price === 0 ? 'Gratis' : formatIDR(tpl.price)}</span>
                  </div>
                </div>
              </div>

              <!-- Sales & Revenue Stat -->
              <div class="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end flex-shrink-0 text-xs">
                <div class="text-left sm:text-right">
                  <span class="text-xs uppercase tracking-wider text-muted font-bold block">
                    Terjual
                  </span>
                  <div class="flex items-center gap-1 font-mono font-bold text-main">
                    <ShoppingBag size={12} class="text-primary" />
                    <span>{tpl.salesCount}x</span>
                  </div>
                </div>

                <div class="text-right min-w-[90px]">
                  <span class="text-xs uppercase tracking-wider text-muted font-bold block">
                    Pendapatan
                  </span>
                  <span class="font-mono font-bold text-success block">
                    {formatIDR(tpl.totalEarned)}
                  </span>
                </div>
              </div>
            </div>

            <!-- Progress Contribution Bar -->
            <div class="space-y-1">
              <div class="flex items-center justify-between text-xs text-muted font-mono font-semibold">
                <span>Kontribusi Penjualan</span>
                <span>{sharePct}%</span>
              </div>
              <div class="h-2 w-full bg-nested rounded-full overflow-hidden">
                <div
                  class="{getBarColor(idx)} h-full rounded-full transition-all duration-500"
                  style="width: {sharePct}%;"
                ></div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  {#if templateStats.length > pageSize}
    <Pagination
      bind:currentPage
      totalItems={templateStats.length}
      {pageSize}
      size="xs"
      class="border-t border-light px-5 py-3"
    />
  {/if}

  <!-- Card Footer -->
  <div class="px-5 py-3.5 sm:px-6 bg-nested/50 border-t border-light flex flex-wrap items-center justify-between gap-4 text-xs">
    <div class="flex items-center gap-4 sm:gap-6">
      <div>
        <span class="text-xs uppercase tracking-wider text-muted font-bold block">
          Total Template Publik
        </span>
        <span class="font-mono font-bold text-main">
          {approvedTemplates.length} Template
        </span>
      </div>
      <div class="h-6 w-px bg-light"></div>
      <div>
        <span class="text-xs uppercase tracking-wider text-muted font-bold block">
          Akumulasi Terjual
        </span>
        <span class="font-mono font-bold text-primary">
          {totalApprovedSales}x
        </span>
      </div>
      <div class="h-6 w-px bg-light"></div>
      <div>
        <span class="text-xs uppercase tracking-wider text-muted font-bold block">
          Total Komisi
        </span>
        <span class="font-mono font-bold text-success">
          {formatIDR(totalApprovedRevenue)}
        </span>
      </div>
    </div>
  </div>
</Card>
