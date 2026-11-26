<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { Bug, Info, Paperclip, Send, X } from 'lucide-svelte';
  import { Button, Input, Modal, Textarea } from '@/components/ui';
  import { apiFetch, extractFieldErrors } from '@/lib/api/parse-response';
  import { toast } from '@/lib/toast';
  import type { BugReportSource } from '@/schemas/bug-report.schema';
  import {
    captureBugEnvironment,
    extractBugAttachmentMeta,
    formatBugAttachmentSize,
    subscribeBugReportModal,
    type BugAttachmentMeta,
  } from './bugReport.helpers';

  export let open = false;
  export let sourceApp: BugReportSource = 'site_builder';
  export let defaultEmail = '';

  const dispatch = createEventDispatcher<{ close: void; submitted: { id: string } }>();

  let title = '';
  let description = '';
  let stepsToReproduce = '';
  let reporterEmail = defaultEmail;
  let showEmailInput = !defaultEmail;
  let attachmentMeta: BugAttachmentMeta | null = null;
  let isSubmitting = false;
  let fieldErrors: Record<string, string> = {};
  let fileInputEl: HTMLInputElement | null = null;

  $: if (defaultEmail && !reporterEmail && !showEmailInput) {
    reporterEmail = defaultEmail;
  }

  onMount(() => {
    return subscribeBugReportModal(() => {
      fieldErrors = {};
      if (!reporterEmail.trim() && defaultEmail) {
        reporterEmail = defaultEmail;
      }
      showEmailInput = !defaultEmail;
      open = true;
    });
  });

  function resetEmailToggle() {
    reporterEmail = defaultEmail;
    showEmailInput = !defaultEmail;
  }

  function closeModal() {
    if (isSubmitting) return;
    open = false;
    fieldErrors = {};
    resetEmailToggle();
    dispatch('close');
  }

  function handleFileChange(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const { meta, error } = extractBugAttachmentMeta(input.files?.[0]);
    if (error) {
      toast.warning(error, 'Lampiran Terlalu Besar');
      input.value = '';
    }
    attachmentMeta = meta;
  }

  function clearAttachment() {
    attachmentMeta = null;
    if (fileInputEl) fileInputEl.value = '';
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    fieldErrors = {};

    const trimmedDesc = description.trim();
    if (trimmedDesc.length < 10) {
      fieldErrors = { description: 'Deskripsi kendala minimal 10 karakter.' };
      toast.warning('Mohon jelaskan kendala minimal 10 karakter.', 'Validasi Form');
      return;
    }

    isSubmitting = true;
    try {
      const { routeUrl, userAgent } = captureBugEnvironment();
      const result = await apiFetch<{ id: string }>('/api/public/bug-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceApp,
          title: title.trim() || '',
          description: trimmedDesc,
          stepsToReproduce: stepsToReproduce.trim() || '',
          routeUrl,
          userAgent,
          reporterEmail: (reporterEmail || defaultEmail).trim(),
          attachmentMeta,
        }),
        fallbackError: 'Gagal mengirim laporan bug. Silakan coba beberapa saat lagi.',
      });

      if (result.success) {
        toast.success(
          result.message || 'Laporan berhasil dikirim. Tim kami akan segera menindaklanjuti.',
          'Laporan Terkirim'
        );
        title = '';
        description = '';
        stepsToReproduce = '';
        clearAttachment();
        resetEmailToggle();
        open = false;
        dispatch('close');
        if (result.data?.id) {
          dispatch('submitted', { id: result.data.id });
        }
      } else {
        fieldErrors = extractFieldErrors(result);
        toast.error(result.message, 'Gagal Mengirim Laporan');
      }
    } catch {
      toast.error('Koneksi bermasalah. Pastikan jaringan internet Anda aktif dan coba lagi.');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<Modal
  bind:open
  size="md"
  closeOnBackdrop={!isSubmitting}
  closeOnEsc={!isSubmitting}
  showCloseButton={!isSubmitting}
  on:close={closeModal}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3.5">
      <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
        <Bug size={18} />
      </div>
      <div class="min-w-0">
        <h3 class="text-heading-md font-bold text-main font-heading leading-tight">
          Laporkan Masalah
        </h3>
        <p class="text-body-sm text-secondary mt-0.5 leading-snug">
          Sampaikan kendala yang Anda temui agar tim kami segera memeriksanya.
        </p>
      </div>
    </div>
  </svelte:fragment>

  <form id="pinoka-bug-report-form" on:submit|preventDefault={handleSubmit} class="space-y-4">
    <Input
      id="bug-title-input"
      label="Judul Singkat (Opsional)"
      bind:value={title}
      placeholder="Contoh: Tombol simpan produk tidak merespons"
      error={fieldErrors.title || ''}
      maxlength={140}
      disabled={isSubmitting}
    />

    <Textarea
      id="bug-desc-input"
      label="Deskripsi Kendala"
      required
      rows={4}
      maxlength={4000}
      bind:value={description}
      placeholder="Ceritakan apa yang terjadi dan pesan error yang muncul..."
      error={fieldErrors.description || ''}
      disabled={isSubmitting}
    />

    <Textarea
      id="bug-steps-input"
      label="Langkah Reproduksi (Opsional)"
      rows={2}
      maxlength={4000}
      bind:value={stepsToReproduce}
      placeholder="1. Buka halaman...&#10;2. Klik tombol..."
      disabled={isSubmitting}
    />

    <div class="form-control w-full">
      <label for="bug-file-input" class="block text-label-caps text-muted mb-1.5">
        Lampiran / Screenshot (Opsional)
      </label>

      {#if attachmentMeta}
        <div class="min-h-[44px] flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-nested border border-light">
          <div class="flex items-center gap-2.5 min-w-0">
            <Paperclip size={16} class="text-primary shrink-0" />
            <div class="min-w-0">
              <p class="text-xs font-semibold text-main truncate">{attachmentMeta.name}</p>
              <p class="text-2xs text-muted">{formatBugAttachmentSize(attachmentMeta.size)}</p>
            </div>
          </div>
          <button
            type="button"
            on:click={clearAttachment}
            disabled={isSubmitting}
            aria-label="Hapus lampiran"
            class="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-error hover:bg-card transition-colors cursor-pointer shrink-0"
          >
            <X size={15} />
          </button>
        </div>
      {:else}
        <input
          bind:this={fileInputEl}
          id="bug-file-input"
          type="file"
          accept="image/png,image/jpeg,image/webp,application/pdf,.txt,.log"
          on:change={handleFileChange}
          disabled={isSubmitting}
          class="sr-only"
        />
        <label
          for="bug-file-input"
          class="min-h-[44px] w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-nested/70 hover:bg-nested border border-dashed border-light hover:border-primary/40 transition-colors cursor-pointer"
        >
          <span class="inline-flex items-center gap-2.5 text-xs font-medium text-secondary">
            <Paperclip size={15} class="text-primary shrink-0" />
            <span>Pilih gambar atau log pendukung (maks. 10 MB)</span>
          </span>
          <span class="text-xs font-semibold text-primary shrink-0">Pilih Berkas</span>
        </label>
      {/if}
    </div>

    {#if showEmailInput || !defaultEmail}
      <Input
        id="bug-email-input"
        type="email"
        label="Email Kontak (Opsional)"
        bind:value={reporterEmail}
        placeholder="nama@domain.com"
        error={fieldErrors.reporterEmail || ''}
        helper="Dipakai tim bila perlu klarifikasi lanjutan."
        maxlength={180}
        disabled={isSubmitting}
      />
    {:else}
      <div class="space-y-1">
        <div class="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-nested/60 border border-light text-xs">
          <span class="text-secondary truncate">
            Email kontak: <strong class="text-main font-semibold">{defaultEmail}</strong>
          </span>
          <button
            type="button"
            on:click={() => (showEmailInput = true)}
            class="text-xs font-semibold text-primary hover:underline cursor-pointer shrink-0"
          >
            Ubah Email
          </button>
        </div>
        <p class="text-2xs text-muted px-1">Dipakai tim bila perlu klarifikasi lanjutan.</p>
      </div>
    {/if}

    <p class="flex items-center gap-2 text-2xs text-muted pt-1">
      <Info size={13} class="shrink-0" />
      <span>Info halaman dan browser disertakan otomatis untuk keperluan investigasi.</span>
    </p>
  </form>

  <svelte:fragment slot="footer">
    <Button
      type="button"
      variant="secondary"
      size="md"
      disabled={isSubmitting}
      on:click={closeModal}
      class="w-full sm:w-auto min-h-[44px]"
    >
      Batal
    </Button>
    <Button
      type="submit"
      form="pinoka-bug-report-form"
      variant="primary"
      size="md"
      loading={isSubmitting}
      disabled={isSubmitting}
      class="w-full sm:w-auto min-h-[44px]"
    >
      <Send size={15} />
      <span>{isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}</span>
    </Button>
  </svelte:fragment>
</Modal>
