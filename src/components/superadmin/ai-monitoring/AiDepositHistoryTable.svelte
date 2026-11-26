<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Card, Table, Pagination, Button, Badge, Input } from "@/components/ui";
  import { formatDate, formatSmartIDR } from "@/lib/utils/format";
  import { Wallet, Search, RefreshCw, ReceiptText, Plus } from "lucide-svelte";
  import type { AiDepositHistoryItem } from "@/types/admin/ai-monitoring.types";

  export let deposits: AiDepositHistoryItem[] = [];
  export let isRefreshing = false;
  export let isSuperAdmin = false;

  const dispatch = createEventDispatcher<{
    refresh: void;
    openDeposit: void;
  }>();

  let searchQuery = "";
  let currentPage = 1;
  const pageSize = 10;

  $: filteredDeposits = deposits.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      d.id.toLowerCase().includes(q) ||
      (d.description && d.description.toLowerCase().includes(q)) ||
      (d.createdByName && d.createdByName.toLowerCase().includes(q)) ||
      (d.createdByEmail && d.createdByEmail.toLowerCase().includes(q)) ||
      String(d.amountUsd).includes(q) ||
      String(d.amountIdr).includes(q)
    );
  });

  $: {
    searchQuery;
    currentPage = 1;
  }

  $: paginatedDeposits = filteredDeposits.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const tableHeaders = [
    { label: "#", align: "center" as const, width: "w-12" },
    { label: "Tanggal & ID", width: "w-52" },
    { label: "Nominal USD", align: "right" as const, width: "w-36" },
    { label: "Nominal IDR", align: "right" as const, width: "w-44" },
    { label: "Kurs Riil", align: "center" as const, width: "w-40" },
    { label: "Keterangan", width: "w-64" },
    { label: "Dicatat Oleh", width: "w-48" },
  ];
</script>

<Card
  variant="bordered"
  padding="none"
  radius="2xl"
  className="shadow-xs overflow-hidden"
>
  <!-- Table Header & Controls -->
  <div
    class="p-5 sm:p-6 border-b border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs"
      >
        <Wallet size={20} />
      </div>
      <div>
        <h3
          class="text-heading-md text-main font-bold font-heading leading-tight"
        >
          Riwayat Deposit Saldo AI
        </h3>
        <p class="text-body-sm text-secondary mt-0.5 font-sans">
          Log transaksi deposit saldo komputasi AI USD dan konversi kurs riil IDR.
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2.5">
      <div class="w-48 sm:w-60">
        <Input
          type="text"
          size="sm"
          fullWidth={false}
          bind:value={searchQuery}
          placeholder="Cari keterangan / admin..."
          class="!rounded-full"
        >
          <svelte:fragment slot="prefix">
            <Search size={14} class="text-muted" />
          </svelte:fragment>
        </Input>
      </div>

      <Button
        variant="secondary"
        size="icon"
        class="!rounded-xl text-muted hover:text-main"
        on:click={() => dispatch("refresh")}
        disabled={isRefreshing}
        title="Segarkan data"
      >
        <RefreshCw size={14} class={isRefreshing ? "animate-spin" : ""} />
      </Button>
    </div>
  </div>

  <!-- Content -->
  {#if filteredDeposits.length === 0}
    <div class="py-16 px-8 flex flex-col items-center text-center">
      <div
        class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs"
      >
        <ReceiptText size={26} />
      </div>
      <h4 class="text-heading-md font-bold text-main mb-1.5 font-heading">
        Belum Ada Catatan Deposit AI
      </h4>
      <p
        class="text-body-sm text-secondary max-w-xs leading-relaxed mb-4 font-sans"
      >
        {searchQuery
          ? "Tidak ada catatan deposit yang cocok dengan pencarian Anda."
          : "Belum ada transaksi deposit saldo AI yang tercatat pada sistem."}
      </p>
      {#if isSuperAdmin && !searchQuery}
        <div class="mt-2">
          <Button
            variant="primary"
            size="sm"
            class="!rounded-full gap-2 font-bold shadow-xs cursor-pointer"
            on:click={() => dispatch("openDeposit")}
          >
            <Plus size={16} />
            <span>Catat Deposit Baru</span>
          </Button>
        </div>
      {/if}
    </div>
  {:else}
    <Table headers={tableHeaders} minWidth="min-w-[850px]">
      {#each paginatedDeposits as deposit, i (deposit.id)}
        <tr class="hover:bg-nested/40 transition-colors">
          <td class="text-center font-mono text-xs text-muted py-3.5 px-4">
            {(currentPage - 1) * pageSize + i + 1}
          </td>
          <td class="py-3.5 px-6">
            <div class="font-mono text-xs font-semibold text-main">
              {deposit.id.slice(0, 14)}...
            </div>
            <div class="text-2xs text-secondary mt-0.5">
              {formatDate(deposit.createdAt)}
            </div>
          </td>
          <td class="py-3.5 px-6 text-right whitespace-nowrap">
            <Badge variant="success" size="sm" dot={false} class="font-mono font-bold">
              +${Number(deposit.amountUsd).toFixed(2)}
            </Badge>
          </td>
          <td class="py-3.5 px-6 text-right whitespace-nowrap">
            <div class="font-mono text-xs font-bold text-main">
              {formatSmartIDR(deposit.amountIdr)}
            </div>
          </td>
          <td class="py-3.5 px-6 text-center whitespace-nowrap">
            <Badge variant="slate" size="sm" dot={false} class="font-mono text-2xs font-semibold">
              1 USD = Rp {deposit.exchangeRate.toLocaleString("id-ID")}
            </Badge>
          </td>
          <td class="py-3.5 px-6">
            <div class="text-xs text-main font-medium truncate max-w-[240px]">
              {deposit.description || "Top up saldo AI"}
            </div>
          </td>
          <td class="py-3.5 px-6">
            <div class="text-xs text-main font-medium truncate max-w-[180px]">
              {deposit.createdByName || "Superadmin"}
            </div>
            {#if deposit.createdByEmail}
              <div class="text-2xs text-secondary truncate max-w-[180px] mt-0.5">
                {deposit.createdByEmail}
              </div>
            {/if}
          </td>
        </tr>
      {/each}
    </Table>

    <!-- Pagination Footer -->
    <Pagination
      bind:currentPage
      totalItems={filteredDeposits.length}
      {pageSize}
    />
  {/if}
</Card>
