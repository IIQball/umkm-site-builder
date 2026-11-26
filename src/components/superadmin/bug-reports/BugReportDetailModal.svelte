<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Check, Copy, ExternalLink, Paperclip, Save } from 'lucide-svelte';
  import { Badge, Button, Modal, Select, Textarea } from '@/components/ui';
  import { apiFetch } from '@/lib/api/parse-response';
  import { toast } from '@/lib/toast';
  import { formatDate } from '@/lib/utils/format';
  import { BUG_REPORT_STATUSES, type BugReportStatus } from '@/schemas/bug-report.schema';
  import {
    SOURCE_META,
    STATUS_META,
    formatBugFileSize,
    formatBugRoleLabel,
    type BugReportListItem,
  } from './bugReports.helpers';

  export let report: BugReportListItem | null = null;
  export let open = false;

  const dispatch = createEventDispatcher<{ close: void; updated: BugReportListItem }>();

  let statusValue: BugReportStatus = 'unresolved';
  let adminNotesValue = '';
  let lastLoadedId: string | null = null;
  let isSaving = false;
  let copiedId = false;

  const statusOptions = BUG_REPORT_STATUSES.map((st) => ({
    value: st,
    label: STATUS_META[st].label,
  }));

  $: if (report && report.id !== lastLoadedId) {
    lastLoadedId = report.id;
    statusValue = report.status;
    adminNotesValue = report.adminNotes || '';
  }

  $: if (!open) {
    lastLoadedId = null;
  }

  function closeModal() {
    if (isSaving) return;
    open = false;
    dispatch('close');
  }

  function handleStatusChange(event: CustomEvent<Event>) {
    const target = (event.detail.currentTarget ?? event.detail.target) as HTMLSelectElement | null;
    if (target) statusValue = target.value as BugReportStatus;
  }

  async function copyReportId() {
    if (!report || typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(report.id);
      copiedId = true;
      toast.success('ID laporan disalin.');
      setTimeout(() => (copiedId = false), 1500);
    } catch {
      toast.error('Gagal menyalin ID laporan.');
    }
  }

  async function saveUpdate() {
    if (!report || isSaving) return;
    isSaving = true;
    try {
      const result = await apiFetch<BugReportListItem>(`/api/superadmin/bug-reports/${report.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusValue,
          adminNotes: adminNotesValue.trim() || null,
        }),
        fallbackError: 'Gagal memperbarui status laporan bug.',
      });

      if (result.success && result.data) {
        toast.success(result.message || 'Status laporan bug berhasil diperbarui.');
        dispatch('updated', result.data);
        closeModal();
      } else {
        toast.error(result.message, 'Gagal Memperbarui');
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan saat menyimpan pembaruan.');
    } finally {
      isSaving = false;
    }
  }
</script>

<Modal
  open={open && Boolean(report)}
  size="lg"
  closeOnEsc={!isSaving}
  closeOnBackdrop={!isSaving}
  showCloseButton={!isSaving}
  on:close={closeModal}
>
  <svelte:fragment slot="header">
    {#if report}
      <div class="min-w-0 space-y-1">
        <div class="flex items-center gap-2 flex-wrap">
          <Badge variant={SOURCE_META[report.sourceApp].variant} size="sm" dot={false}>
            {SOURCE_META[report.sourceApp].label}
          </Badge>
          <Badge variant={STATUS_META[report.status].variant} size="sm">
            {STATUS_META[report.status].label}
          </Badge>
          <button
            type="button"
            on:click={copyReportId}
            class="inline-flex items-center gap-1 text-2xs font-mono text-muted hover:text-main cursor-pointer"
            title="Salin ID laporan"
          >
            <span>{report.id}</span>
            {#if copiedId}
              <Check size={12} class="text-success" />
            {:else}
              <Copy size={12} />
            {/if}
          </button>
        </div>
        <h2 id="bug-detail-modal-title" class="text-base font-extrabold text-main font-heading break-words">
          {report.title || 'Laporan Masalah Tanpa Judul'}
        </h2>
      </div>
    {/if}
  </svelte:fragment>

  {#if report}
    <div class="space-y-4">
      <div class="space-y-1.5">
        <p class="text-xs font-bold uppercase tracking-wider text-muted">Deskripsi Masalah</p>
        <div class="p-3.5 rounded-2xl bg-nested border border-light text-sm text-main whitespace-pre-wrap break-words leading-relaxed">
          {report.description}
        </div>
      </div>

      {#if report.stepsToReproduce}
        <div class="space-y-1.5">
          <p class="text-xs font-bold uppercase tracking-wider text-muted">Langkah Reproduksi</p>
          <div class="p-3.5 rounded-2xl bg-nested border border-light text-sm text-secondary whitespace-pre-wrap break-words leading-relaxed">
            {report.stepsToReproduce}
          </div>
        </div>
      {/if}

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded-2xl bg-nested border border-light space-y-1 min-w-0">
          <p class="font-bold text-muted">Pelapor</p>
          <p class="text-main font-semibold break-words">
            {report.reporterName || report.reporterEmail || 'Anonim'}
          </p>
          <p class="text-secondary break-all">{report.reporterEmail || 'Tidak mencantumkan email'}</p>
          <p class="text-2xs text-muted">{formatBugRoleLabel(report.reporterRole)}</p>
        </div>

        <div class="p-3 rounded-2xl bg-nested border border-light space-y-1 min-w-0">
          <p class="font-bold text-muted">Waktu &amp; Rute</p>
          <p class="text-main font-medium">
            {formatDate(report.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <p class="font-mono text-2xs text-secondary break-all">{report.routeUrl}</p>
        </div>
      </div>

      <div class="p-3 rounded-2xl bg-nested border border-light space-y-1">
        <p class="text-xs font-bold text-muted">User Agent &amp; Viewport</p>
        <p class="font-mono text-2xs text-secondary break-all">{report.userAgent}</p>
      </div>

      {#if report.attachmentMeta}
        <div class="p-3 rounded-2xl bg-nested border border-light flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5 min-w-0">
            <Paperclip size={16} class="text-primary shrink-0" />
            <div class="min-w-0">
              <p class="text-xs font-semibold text-main truncate">{report.attachmentMeta.name || 'Lampiran'}</p>
              <p class="text-2xs text-muted">
                {report.attachmentMeta.mimeType || 'unknown'} • {formatBugFileSize(report.attachmentMeta.size)}
              </p>
            </div>
          </div>
          {#if report.attachmentMeta.url && /^https?:\/\//i.test(report.attachmentMeta.url)}
            <a
              href={report.attachmentMeta.url}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline shrink-0"
            >
              <span>Buka</span>
              <ExternalLink size={12} />
            </a>
          {/if}
        </div>
      {/if}

      <div class="pt-3 border-t border-light space-y-3">
        <Select
          id="bug-status-select"
          label="Ubah Status Penanganan"
          value={statusValue}
          options={statusOptions}
          on:change={handleStatusChange}
        />

        <Textarea
          id="bug-admin-notes"
          label="Catatan Superadmin"
          bind:value={adminNotesValue}
          rows={3}
          maxlength={2000}
          placeholder="Catat hasil investigasi, commit perbaikan, atau tindak lanjut..."
        />
      </div>
    </div>
  {/if}

  <svelte:fragment slot="footer">
    <Button variant="secondary" size="sm" disabled={isSaving} on:click={closeModal}>Tutup</Button>
    <Button variant="primary" size="sm" loading={isSaving} on:click={saveUpdate}>
      <Save size={14} />
      <span>{isSaving ? 'Menyimpan...' : 'Simpan Status'}</span>
    </Button>
  </svelte:fragment>
</Modal>

