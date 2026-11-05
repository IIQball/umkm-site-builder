<script lang="ts">
  import { Modal, Button } from '@/components/ui';
  import type { AiAuditLogItem } from '@/types/admin/ai-monitoring.types';
  import {
    formatAuditCost,
    formatAuditDate,
    formatAuditTokens,
    formatResolution,
    getFeatureLabel,
    getQualityBadge,
    getStatusBadge,
  } from './aiAudit.helpers';
  import { ExternalLink, Copy, Check } from 'lucide-svelte';

  export let log: AiAuditLogItem | null = null;
  export let open: boolean = false;

  let copied = false;

  const copyPrompt = async () => {
    if (!log?.promptFinal) return;
    try {
      await navigator.clipboard.writeText(log.promptFinal);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch {
      // ignore
    }
  };

  const handleClose = () => {
    open = false;
  };
</script>

<Modal
  {open}
  title="Detail Audit Pengujian AI"
  description="Informasi komputasi mendalam, token, dan biaya riil eksekusi."
  size="lg"
  on:close={handleClose}
>
  {#if log}
    <div class="space-y-6 text-sm">
      <!-- Header Summary Badge Row -->
      <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-nested/50 rounded-xl border border-light">
        <div class="flex items-center gap-2">
          {#if log.isTesting}
            <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Mode Pengujian (Test)
            </span>
          {:else}
            <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Mode Produksi
            </span>
          {/if}

          <span class="px-2.5 py-1 text-xs font-semibold rounded-full border {getStatusBadge(log.status).cls}">
            {getStatusBadge(log.status).label}
          </span>
        </div>

        <div class="text-xs text-muted font-mono">
          ID: {log.id}
        </div>
      </div>

      <!-- Core Metrics Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="p-3 bg-nested/30 border border-light rounded-xl">
          <div class="text-xs text-muted mb-1">Model</div>
          <div class="font-semibold text-main truncate font-mono text-xs" title={log.modelUsed}>
            {log.modelUsed}
          </div>
        </div>

        <div class="p-3 bg-nested/30 border border-light rounded-xl">
          <div class="text-xs text-muted mb-1">Resolusi</div>
          <div class="font-semibold text-main text-xs">
            {formatResolution(log.sizeRatio)}
          </div>
        </div>

        <div class="p-3 bg-nested/30 border border-light rounded-xl">
          <div class="text-xs text-muted mb-1">Kualitas</div>
          <div class="font-semibold text-xs text-main">
            {getQualityBadge(log.qualityTier).label}
          </div>
        </div>

        <div class="p-3 bg-nested/30 border border-light rounded-xl">
          <div class="text-xs text-muted mb-1">Biaya Riil</div>
          <div class="font-bold text-primary text-xs">
            {formatAuditCost(log.costIdr)}
            <span class="text-2xs text-muted font-normal block font-mono">
              (${log.costUsd.toFixed(4)})
            </span>
          </div>
        </div>
      </div>

      <!-- Token Metrics Details -->
      <div class="p-4 bg-nested/20 border border-light rounded-xl space-y-3">
        <div class="text-xs font-semibold text-main uppercase tracking-wider">
          Statistik Konsumsi Token
        </div>
        <div class="grid grid-cols-3 gap-3 text-center">
          <div class="p-2.5 bg-canvas border border-light rounded-lg">
            <span class="text-2xs text-muted block mb-0.5">Input Tokens</span>
            <span class="font-mono font-bold text-main">{formatAuditTokens(log.inputTokens)}</span>
          </div>
          <div class="p-2.5 bg-canvas border border-light rounded-lg">
            <span class="text-2xs text-muted block mb-0.5">Output Tokens</span>
            <span class="font-mono font-bold text-main">{formatAuditTokens(log.outputTokens)}</span>
          </div>
          <div class="p-2.5 bg-canvas border border-light rounded-lg">
            <span class="text-2xs text-muted block mb-0.5">Total Token</span>
            <span class="font-mono font-bold text-primary">
              {formatAuditTokens(log.inputTokens + log.outputTokens)}
            </span>
          </div>
        </div>
      </div>

      <!-- Context Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div class="p-3 bg-nested/20 border border-light rounded-xl space-y-1">
          <span class="text-muted block">Fitur AI</span>
          <span class="font-medium text-main">{getFeatureLabel(log.featureType)}</span>
        </div>
        <div class="p-3 bg-nested/20 border border-light rounded-xl space-y-1">
          <span class="text-muted block">Waktu Pengujian</span>
          <span class="font-medium text-main">{formatAuditDate(log.createdAt)}</span>
        </div>
      </div>

      <!-- Error Message if failed -->
      {#if log.errorMessage}
        <div class="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
          <span class="text-xs font-semibold text-rose-600 dark:text-rose-400 block">
            Pesan Kesalahan (Error)
          </span>
          <p class="text-xs text-rose-700 dark:text-rose-300 font-mono break-words">
            {log.errorMessage}
          </p>
        </div>
      {/if}

      <!-- Prompt Final -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-main">Prompt Final</span>
          <button
            type="button"
            class="text-2xs text-secondary hover:text-main flex items-center gap-1 transition-colors"
            on:click={copyPrompt}
          >
            {#if copied}
              <Check size={12} class="text-emerald-500" />
              <span class="text-emerald-500">Tersalin</span>
            {:else}
              <Copy size={12} />
              <span>Salin Prompt</span>
            {/if}
          </button>
        </div>
        <div class="p-3 bg-nested border border-light rounded-xl text-xs font-mono text-secondary max-h-36 overflow-y-auto leading-relaxed whitespace-pre-wrap select-all">
          {log.promptFinal || '-'}
        </div>
      </div>

      <!-- Result Image Preview if available -->
      {#if log.cloudinaryUrl}
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-main">Hasil Generasi Gambar</span>
            <a
              href={log.cloudinaryUrl}
              target="_blank"
              rel="noreferrer"
              class="text-2xs text-primary hover:underline flex items-center gap-1"
            >
              <span>Buka di tab baru</span>
              <ExternalLink size={12} />
            </a>
          </div>
          <div class="p-2 bg-nested/40 border border-light rounded-xl flex items-center justify-center">
            <img
              src={log.cloudinaryUrl}
              alt="Hasil Generasi AI"
              class="max-h-48 rounded-lg object-contain"
              loading="lazy"
            />
          </div>
        </div>
      {/if}
    </div>
  {/if}

  <svelte:fragment slot="footer">
    <div class="flex justify-end w-full">
      <Button variant="secondary" size="sm" on:click={handleClose}>
        Tutup
      </Button>
    </div>
  </svelte:fragment>
</Modal>
