<script lang="ts">
  import {
    CreditCard,
    Palette,
    ShoppingBag,
    FileText,
    User,
    Store,
    ShieldCheck,
    Check,
    Copy,
  } from 'lucide-svelte';
  import { Badge, Button } from '@/components/ui';
  import type { BadgeVariant } from '@/components/tokens/colors';
  import type { OrderTransactionItem } from '@/types/finance';
  import { formatIDR } from '@/lib/currency';
  import { formatDate } from '@/lib/utils/format';

  export let order: OrderTransactionItem;
  export let statusMeta: { variant: BadgeVariant; label: string };
  export let displayId: string;
  export let copiedId: string | null;
  export let isAdmin: boolean = false;
  export let isReadOnly: boolean = false;
  export let hasAdminAssistant: boolean = false;
  export let onCopyId: (id: string) => void;
  export let getPaymentUrl: (order: OrderTransactionItem) => string;
  export let onOpenInvoice: (order: OrderTransactionItem) => void = () => {};


  $: basePrice = order.basePrice !== undefined 
    ? Number(order.basePrice) 
    : Math.max(0, Number(order.amount) - Number(order.adminFee || 0));
  $: adminFee = Number(order.adminFee || 0);
</script>

<tr class="hover:bg-nested/40 transition-colors group">
  <!-- Invoice ID & Created At -->
  <td class="px-6 py-4">
    <div class="flex items-center gap-3">
      <button
        type="button"
        on:click={() => onCopyId(displayId)}
        class="inline-flex items-center gap-1.5 font-mono text-2xs font-bold text-main bg-nested/80 border border-light hover:border-border rounded-xl px-2.5 py-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
        title="Salin ID Invoice"
      >
        <span class="truncate max-w-[120px]">{displayId}</span>
        {#if copiedId === displayId}
          <Check size={12} class="text-success shrink-0" />
        {:else}
          <Copy size={12} class="text-muted shrink-0" />
        {/if}
      </button>
    </div>
    <span class="text-3xs text-secondary mt-1 block font-mono">
      {formatDate(order.createdAt)}
    </span>
  </td>

  <!-- Merchant & Store Info (Admin View Only) -->
  {#if isAdmin}
    <td class="px-4 py-3.5">
      {#if order.adminName || order.adminEmail}
        <!-- Kasus 1: Dibeli oleh Admin -> Data Admin | Data Tenant (Menyamping) -->
        <div class="flex items-center gap-3 min-w-[300px]">
          <!-- Data Admin -->
          <div class="space-y-0.5 min-w-[135px] max-w-[165px]">
            <Badge variant="primary" size="sm" dot={false} class="gap-1 mb-1 font-bold">
              <ShieldCheck size={10} class="shrink-0 text-primary" />
              Admin Pembeli
            </Badge>
            <div class="font-bold text-xs text-main truncate font-sans" title={order.adminName}>
              {order.adminName || 'Admin Pendamping'}
            </div>
            {#if order.adminEmail}
              <div class="text-3xs text-secondary font-mono truncate" title={order.adminEmail}>
                {order.adminEmail}
              </div>
            {/if}
          </div>

          <!-- Divider Pemisah | -->
          <div class="h-10 w-px bg-light flex-shrink-0 self-center"></div>

          <!-- Data Tenant / Merchant -->
          <div class="space-y-0.5 min-w-[140px] max-w-[175px]">
            <Badge variant="secondary" size="sm" dot={false} class="gap-1 mb-1 font-semibold">
              <Store size={10} class="shrink-0 text-secondary" />
              Merchant Binaan
            </Badge>
            <div class="font-bold text-xs text-main truncate font-sans" title={order.merchantName}>
              {order.merchantName || '—'}
            </div>
            {#if order.merchantEmail}
              <div class="text-3xs text-secondary font-mono truncate" title={order.merchantEmail}>
                {order.merchantEmail}
              </div>
            {/if}
            <div class="flex items-center gap-1 text-3xs text-muted truncate pt-0.5" title={order.storeName}>
              <Store size={11} class="text-muted shrink-0" />
              <span class="truncate">{order.storeName || 'Belum Membuat Toko'}</span>
            </div>
          </div>
        </div>
      {:else}
        <!-- Kasus 2: Dibeli Mandiri -> Data Tenant Saja -->
        <div class="space-y-0.5 min-w-[160px] max-w-[200px]">
          <Badge variant="success" size="sm" dot={false} class="gap-1 mb-1 font-bold">
            <User size={10} class="shrink-0 text-success" />
            Dibeli Mandiri (Tenant)
          </Badge>
          <div class="font-bold text-xs text-main truncate font-sans" title={order.merchantName}>
            {order.merchantName || '—'}
          </div>
          {#if order.merchantEmail}
            <div class="text-3xs text-secondary font-mono truncate" title={order.merchantEmail}>
              {order.merchantEmail}
            </div>
          {/if}
          <div class="flex items-center gap-1 text-3xs text-muted truncate pt-0.5" title={order.storeName}>
            <Store size={11} class="text-muted shrink-0" />
            <span class="truncate">{order.storeName || 'Belum Membuat Toko'}</span>
          </div>
        </div>
      {/if}
    </td>
  {/if}

  <!-- Template Details -->
  <td class="px-4 py-4">
    <div class="flex items-center gap-3">
      {#if order.template?.thumbnailUrl}
        <img
          src={order.template.thumbnailUrl}
          alt={order.template.name}
          class="w-12 h-9 rounded-xl object-cover border border-light flex-shrink-0 shadow-2xs"
        />
      {:else}
        <div class="w-12 h-9 rounded-xl bg-nested border border-light flex items-center justify-center text-muted flex-shrink-0 shadow-2xs">
          <Palette size={16} />
        </div>
      {/if}
      <div class="min-w-0 max-w-xs">
        <span class="font-bold text-xs text-main block truncate font-sans">
          {order.template?.name || 'Template Desain Toko'}
        </span>
        <span class="text-3xs text-muted block uppercase font-mono mt-0.5">
          ID: #{order.template?.id ? order.template.id.slice(0, 8) : '—'}
        </span>
      </div>
    </div>
  </td>

  <!-- Admin Pembeli (Tenant View, only for tenants registered by Admin) -->
  {#if !isAdmin && hasAdminAssistant}
    <td class="px-4 py-4">
      {#if order.adminName || order.adminEmail}
        <div class="space-y-1">
          <div class="flex items-center gap-1.5 font-bold text-xs text-main">
            <User size={13} class="text-primary flex-shrink-0" />
            <span class="truncate max-w-[140px]">{order.adminName || 'Admin Pendamping'}</span>
          </div>
          {#if order.adminEmail}
            <span class="text-3xs text-secondary truncate max-w-[140px] block font-mono pl-4">
              {order.adminEmail}
            </span>
          {/if}
          <Badge variant="primary" size="sm" dot={false} class="font-semibold">
            Admin Pembeli
          </Badge>
        </div>
      {:else}
        <span class="text-xs text-muted font-mono">—</span>
      {/if}
    </td>
  {/if}

  <!-- Amount & Fee Breakdown -->
  {#if isAdmin}
    <td class="px-4 py-4 text-right whitespace-nowrap">
      <div class="space-y-1">
        <div class="font-mono text-xs font-black text-main">
          {formatIDR(order.amount)}
        </div>
        <div class="text-3xs text-secondary flex items-center justify-end gap-1.5 font-mono">
          <span>Tpl: {formatIDR(basePrice)}</span>
          {#if adminFee > 0}
            <span class="text-success font-bold bg-success/10 px-1.5 py-0.5 rounded">
              Fee: +{formatIDR(adminFee)}
            </span>
          {/if}
        </div>
      </div>
    </td>
  {:else}
    <td class="px-4 py-4 text-right whitespace-nowrap">
      <span class="inline-flex items-center font-mono text-xs sm:text-sm font-black text-main bg-nested/90 px-2.5 py-1 rounded-xl border border-light">
        {formatIDR(order.amount)}
      </span>
    </td>
  {/if}

  <!-- Status Badge -->
  <td class="px-4 py-4 text-center">
    <div class="inline-flex items-center justify-center">
      <Badge variant={statusMeta.variant} size="sm" dot>
        {statusMeta.label}
      </Badge>
    </div>
  </td>

  <!-- Actions -->
  <td class="px-6 py-4 text-right whitespace-nowrap">
    <div class="flex items-center justify-end gap-2 whitespace-nowrap">
      {#if isReadOnly}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          class="font-bold whitespace-nowrap min-w-[136px] justify-center border-light hover:border-primary/40 active:scale-95 transition-all text-xs px-3.5"
          on:click={() => onOpenInvoice(order)}
        >
          <FileText size={14} class="text-primary shrink-0" />
          <span class="whitespace-nowrap">Lihat Nota</span>
        </Button>
      {:else if order.status === 'pending'}
        <Button
          href={getPaymentUrl(order)}
          variant="orange"
          size="sm"
          class="font-bold whitespace-nowrap min-w-[136px] justify-center px-4"
        >
          <CreditCard size={14} class="shrink-0" />
          <span class="whitespace-nowrap">Bayar Sekarang</span>
        </Button>
      {:else if order.status === 'paid' || order.status === 'success' || order.status === 'completed'}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          class="font-bold whitespace-nowrap min-w-[136px] justify-center border-light hover:border-primary/40 active:scale-95 transition-all text-xs px-3.5"
          on:click={() => onOpenInvoice(order)}
        >
          <FileText size={14} class="text-primary shrink-0" />
          <span class="whitespace-nowrap">Lihat Nota</span>
        </Button>
      {:else}
        <Button
          href="/templates"
          variant="secondary"
          size="sm"
          class="font-bold whitespace-nowrap min-w-[136px] justify-center px-4"
        >
          <ShoppingBag size={14} class="shrink-0" />
          <span class="whitespace-nowrap">Beli Ulang</span>
        </Button>
      {/if}
    </div>
  </td>
</tr>
