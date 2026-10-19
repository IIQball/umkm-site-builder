<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Card, Table, Pagination, Button } from "@/components/ui";
  import { formatDate, formatSmartIDR } from "@/lib/utils/format";
  import type { AiMonitoringRecentLog } from "@/types/admin/ai-monitoring.types";

  export let logs: AiMonitoringRecentLog[] = [];
  export let isRefreshing = false;

  const dispatch = createEventDispatcher<{
    refresh: void;
  }>();

  let searchQuery = "";
  let selectedStatus: "all" | "success" | "pending" | "failed" = "all";
  let currentPage = 1;
  const pageSize = 10;

  const getFeatureLabel = (type: string) => {
    switch (type) {
      case "logo":
        return "Logo Toko";
      case "packaging_mockup":
        return "Mockup Kemasan";
      case "product_poster":
        return "Poster Produk";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return {
          label: "Sukses",
          cls: "bg-success/10 text-success border-success/20",
        };
      case "failed":
        return {
          label: "Gagal",
          cls: "bg-error/10 text-error border-error/20",
        };
      case "processing":
        return {
          label: "Diproses",
          cls: "bg-primary/10 text-primary border-primary/20",
        };
      case "pending":
        return {
          label: "Menunggu",
          cls: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        };
      default:
        return { label: status, cls: "bg-nested text-secondary border-light" };
    }
  };

  $: counts = {
    total: logs.length,
    success: logs.filter((l) => l.status === "success").length,
    pending: logs.filter(
      (l) => l.status === "pending" || l.status === "processing",
    ).length,
    failed: logs.filter((l) => l.status === "failed").length,
  };

  $: filteredLogs = logs.filter((log) => {
    const matchesStatus =
      selectedStatus === "all"
        ? true
        : selectedStatus === "success"
          ? log.status === "success"
          : selectedStatus === "pending"
            ? log.status === "pending" || log.status === "processing"
            : log.status === "failed";

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      log.id.toLowerCase().includes(q) ||
      log.featureType.toLowerCase().includes(q) ||
      log.modelUsed.toLowerCase().includes(q) ||
      (log.storeName && log.storeName.toLowerCase().includes(q)) ||
      (log.userName && log.userName.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  $: {
    searchQuery;
    selectedStatus;
    currentPage = 1;
  }

  $: paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const tableHeaders = [
    { label: "#", align: "center" as const, width: "w-12" },
    { label: "Waktu & ID", width: "w-56" },
    { label: "Toko & Merchant", width: "w-64" },
    { label: "Fitur AI & Model", width: "w-56" },
    { label: "Token & Biaya", align: "right" as const, width: "w-44" },
    { label: "Status Eksekusi", align: "center" as const, width: "w-36" },
  ];
</script>

<Card
  variant="bordered"
  padding="none"
  radius="2xl"
  className="shadow-xs overflow-hidden"
>
  <!-- Table Header & Controls (Matching superadmin/transactions) -->
  <div
    class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs"
      >
        <span class="material-symbols-outlined text-xl">smart_toy</span>
      </div>
      <div>
        <h3
          class="text-heading-md text-main font-bold font-heading leading-tight"
        >
          Riwayat Eksekusi Generasi AI
        </h3>
        <p class="text-body-sm text-secondary mt-0.5 font-sans">
          Daftar seluruh pesanan generasi AI, rincian penggunaan token, estimasi
          biaya komputasi, dan status eksekusi (hanya baca).
        </p>
      </div>
    </div>

    <!-- Actions & Filter Pills -->
    <div class="flex flex-wrap items-center gap-2.5">
      <div class="relative">
        <span
          class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-sm"
          >search</span
        >
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari fitur / merchant / model..."
          class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary focus:bg-card transition-all w-48 sm:w-60"
        />
      </div>

      <!-- Segmented Status Filter -->
      <div
        class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1 overflow-x-auto"
      >
        <Button
          size="xs"
          variant={selectedStatus === "all" ? "dark" : "ghost"}
          class="!rounded-full !px-3.5 font-bold {selectedStatus === 'all'
            ? 'shadow-2xs'
            : 'text-muted hover:text-main'}"
          on:click={() => (selectedStatus = "all")}
        >
          Semua ({counts.total})
        </Button>
        <Button
          size="xs"
          variant={selectedStatus === "success" ? "dark" : "ghost"}
          class="!rounded-full !px-3.5 font-bold flex items-center gap-1.5 {selectedStatus ===
          'success'
            ? 'shadow-2xs'
            : 'text-muted hover:text-main'}"
          on:click={() => (selectedStatus = "success")}
        >
          <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
          <span>Sukses ({counts.success})</span>
        </Button>
        <Button
          size="xs"
          variant={selectedStatus === "pending" ? "dark" : "ghost"}
          class="!rounded-full !px-3.5 font-bold flex items-center gap-1.5 {selectedStatus ===
          'pending'
            ? 'shadow-2xs'
            : 'text-muted hover:text-main'}"
          on:click={() => (selectedStatus = "pending")}
        >
          <span class="w-1.5 h-1.5 rounded-full bg-warning"></span>
          <span>Menunggu ({counts.pending})</span>
        </Button>
        {#if counts.failed > 0}
          <Button
            size="xs"
            variant={selectedStatus === "failed" ? "dark" : "ghost"}
            class="!rounded-full !px-3.5 font-bold flex items-center gap-1.5 {selectedStatus ===
            'failed'
              ? 'shadow-2xs'
              : 'text-muted hover:text-main'}"
            on:click={() => (selectedStatus = "failed")}
          >
            <span class="w-1.5 h-1.5 rounded-full bg-error"></span>
            <span>Gagal ({counts.failed})</span>
          </Button>
        {/if}
      </div>
    </div>
  </div>

  <!-- Table Content -->
  {#if filteredLogs.length === 0}
    <div class="py-16 px-8 flex flex-col items-center text-center">
      <div
        class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs"
      >
        <span class="material-symbols-outlined text-2xl">smart_toy</span>
      </div>
      <h4 class="text-heading-md font-bold text-main mb-1.5 font-heading">
        Tidak Ada Riwayat Aktivitas AI
      </h4>
      <p
        class="text-body-sm text-secondary max-w-xs leading-relaxed mb-4 font-sans"
      >
        {searchQuery || selectedStatus !== "all"
          ? "Tidak ada aktivitas AI yang sesuai dengan filter pencarian Anda."
          : "Belum ada log aktivitas generasi AI yang tercatat pada sistem."}
      </p>
      {#if selectedStatus === "all" && !searchQuery}
        <div class="mt-5">
          <Button
            variant="primary"
            size="sm"
            class="!rounded-full gap-2 font-bold shadow-xs cursor-pointer"
            on:click={() => dispatch("refresh")}
          >
            <span
              class="material-symbols-outlined text-base {isRefreshing
                ? 'animate-spin'
                : ''}">refresh</span
            >
            <span>{isRefreshing ? "Memperbarui..." : "Perbarui Data AI"}</span>
          </Button>
        </div>
      {/if}
    </div>
  {:else}
    <Table headers={tableHeaders} minWidth="min-w-[900px]">
      {#each paginatedLogs as log, i (log.id)}
        {@const badge = getStatusBadge(log.status)}
        {@const totalTokens = log.inputTokens + log.outputTokens}
        <tr class="hover:bg-nested/40 transition-colors">
          <td class="text-center font-mono text-xs text-muted py-3.5 px-4">
            {(currentPage - 1) * pageSize + i + 1}
          </td>
          <td class="py-3.5 px-6">
            <div class="font-mono text-xs font-semibold text-main">
              {log.id.slice(0, 14)}...
            </div>
            <div class="text-2xs text-secondary mt-0.5">
              {formatDate(log.createdAt)}
            </div>
          </td>
          <td class="py-3.5 px-6">
            <div class="font-medium text-xs text-main truncate max-w-[200px]">
              {log.storeName || "—"}
            </div>
            <div class="text-2xs text-secondary truncate max-w-[200px] mt-0.5">
              {log.userName || "Toko Demo"}
            </div>
          </td>
          <td class="py-3.5 px-6">
            <div
              class="inline-flex items-center gap-1.5 font-medium text-xs text-main"
            >
              <span class="material-symbols-outlined text-xs text-primary"
                >auto_awesome</span
              >
              <span>{getFeatureLabel(log.featureType)}</span>
            </div>
            <div class="text-2xs font-mono text-secondary mt-0.5">
              {log.modelUsed}
            </div>
          </td>
          <td class="py-3.5 px-6 text-right whitespace-nowrap">
            <div class="font-mono text-xs font-bold text-main">
              {formatSmartIDR(log.costIdr)}
            </div>
            <div class="text-2xs font-mono text-secondary mt-0.5">
              {totalTokens.toLocaleString("id-ID")} token
            </div>
          </td>
          <td class="py-3.5 px-6 text-center whitespace-nowrap">
            <span
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-2xs font-bold {badge.cls}"
            >
              <span>{badge.label}</span>
            </span>
            {#if log.errorMessage}
              <p
                class="text-3xs text-error font-mono truncate max-w-[140px] mx-auto mt-0.5"
                title={log.errorMessage}
              >
                {log.errorMessage}
              </p>
            {/if}
          </td>
        </tr>
      {/each}
    </Table>

    <!-- Pagination Footer -->
    <Pagination bind:currentPage totalItems={filteredLogs.length} {pageSize} />
  {/if}
</Card>
