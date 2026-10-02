<script lang="ts">
  import { onMount } from "svelte";
  import { Card, Table, Pagination } from "@/components/ui";
  import AdminStoreRow from "./merchants/AdminStoreRow.svelte";
  import { addToast } from "@/lib/toast";
  import { formatDate } from "@/lib/utils/format";
  import { getMainDomain } from "@/lib/domain";
  import type { AssistedStoreItem } from "@/types/admin";

  export let stores: AssistedStoreItem[] = [];

  let searchQuery = "";
  let activeFilter: "all" | "published" | "draft" | "nostore" = "all";
  let copiedId: string | null = null;
  let currentPage = 1;
  const pageSize = 10;
  let mainDomain = "localhost:4321";

  onMount(() => {
    mainDomain = getMainDomain();
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      copiedId = text;
      addToast({
        type: "success",
        message: `ID Tenant #${text.slice(0, 8)} disalin!`,
      });
      setTimeout(() => {
        copiedId = null;
      }, 1800);
    } catch {
      // clipboard unavailable
    }
  };

  const isStoreActive = (status: string | null | undefined) =>
    status === "published" || status === "active";

  $: counts = {
    total: stores.length,
    published: stores.filter((s) => isStoreActive(s.status)).length,
    draft: stores.filter((s) => s.id && !isStoreActive(s.status)).length,
    noStore: stores.filter((s) => !s.id).length,
  };

  $: filteredStores = stores.filter((s) => {
    const matchesFilter =
      activeFilter === "all"
        ? true
        : activeFilter === "published"
          ? isStoreActive(s.status)
          : activeFilter === "draft"
            ? s.id && !isStoreActive(s.status)
            : !s.id;

    const q = searchQuery.toLowerCase().trim();
    const ownerName = (s.tenantName || s.owner?.name || "").toLowerCase();
    const ownerEmail = (s.tenantEmail || s.owner?.email || "").toLowerCase();
    const storeName = (s.name || "").toLowerCase();
    const subdomain = (s.subdomain || "").toLowerCase();
    const userId = (s.userId || "").toLowerCase();

    const matchesSearch =
      !q ||
      storeName.includes(q) ||
      subdomain.includes(q) ||
      ownerName.includes(q) ||
      ownerEmail.includes(q) ||
      userId.includes(q);

    return matchesFilter && matchesSearch;
  });

  $: {
    searchQuery;
    activeFilter;
    currentPage = 1;
  }

  $: paginatedStores = filteredStores.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  $: tableHeaders = [
    { label: "Merchant & Toko", align: "left" as const },
    { label: "Subdomain Toko", align: "left" as const, width: "w-56" },
    { label: "Status Toko", align: "left" as const, width: "w-36" },
    { label: "Terdaftar Pada", align: "left" as const, width: "w-36" },
    { label: "Aksi", align: "right" as const, width: "w-64" },
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
    class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs"
      >
        <span class="material-symbols-outlined text-lg">storefront</span>
      </div>
      <div>
        <h3
          class="text-heading-md text-main font-bold font-heading leading-tight"
        >
          Daftar Toko & Merchant Binaan
        </h3>
        <p class="text-body-sm text-secondary mt-0.5 font-sans">
          Daftar seluruh UMKM yang didampingi, status publikasi toko, dan tautan
          akses
        </p>
      </div>
    </div>

    <!-- Actions & Filter Pills -->
    <div class="flex flex-wrap items-center gap-2.5">
      <div class="relative">
        <span
          class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none"
          >search</span
        >
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari toko / tenant / ID..."
          class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary focus:bg-card transition-all w-44 sm:w-52"
        />
      </div>

      <!-- Segmented Status Filter -->
      <div
        class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1 overflow-x-auto"
      >
        <button
          type="button"
          on:click={() => (activeFilter = "all")}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] {activeFilter ===
          'all'
            ? 'bg-main text-canvas dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          Semua ({counts.total})
        </button>
        <button
          type="button"
          on:click={() => (activeFilter = "published")}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter ===
          'published'
            ? 'bg-main text-canvas dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
          Aktif ({counts.published})
        </button>
        <button
          type="button"
          on:click={() => (activeFilter = "draft")}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter ===
          'draft'
            ? 'bg-main text-canvas dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-info"></span>
          Draft ({counts.draft})
        </button>
        <button
          type="button"
          on:click={() => (activeFilter = "nostore")}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter ===
          'nostore'
            ? 'bg-main text-canvas dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-warning"></span>
          Belum Setup ({counts.noStore})
        </button>
      </div>
    </div>
  </div>

  <!-- Content -->
  {#if filteredStores.length === 0}
    <div class="py-16 px-8 flex flex-col items-center text-center">
      <div
        class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs"
      >
        <span class="material-symbols-outlined text-2xl">storefront</span>
      </div>
      <h4 class="text-heading-md font-bold text-main mb-1.5 font-heading">
        Tidak Ada Merchant Ditemukan
      </h4>
      <p
        class="text-body-sm text-secondary max-w-xs leading-relaxed mb-4 font-sans"
      >
        {searchQuery
          ? "Tidak ada toko yang cocok dengan kata kunci pencarian Anda."
          : "Belum ada merchant binaan yang terdaftar dalam program pendampingan."}
      </p>
    </div>
  {:else}
    <Table headers={tableHeaders} minWidth="min-w-[760px]">
      {#each paginatedStores as store (store.userId)}
        <AdminStoreRow
          {store}
          {mainDomain}
          {copiedId}
          {formatDate}
          onCopyId={copyToClipboard}
        />
      {/each}
    </Table>
  {/if}

  {#if filteredStores.length > 0}
    <Pagination
      bind:currentPage
      totalItems={filteredStores.length}
      {pageSize}
    />
  {/if}
</Card>
