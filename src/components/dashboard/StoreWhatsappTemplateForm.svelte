<script lang="ts">
  import { CheckCircle, AlertCircle } from 'lucide-svelte';
  import { Button } from '@/components/ui';

  export let storeId: string | undefined = undefined;
  export let initialTemplate = '';

  let template = initialTemplate;
  let submitStatus: 'idle' | 'submitting' | 'success' | 'error' = 'idle';
  let submitMessage = '';

  const DEFAULT_TEMPLATE = `Halo, saya ingin bertanya seputar produk di toko Anda. Boleh minta informasi lebih lanjut?`;

  async function handleSubmit() {
    submitStatus = 'submitting';
    try {
      const endpoint = storeId ? `/api/stores/whatsapp-template?storeId=${storeId}` : '/api/stores/whatsapp-template';
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, storeId }),
      });

      if (res.status === 401) {
        window.location.href = '/auth/login';
        return;
      }

      const data = await res.json();
      if (!data.success) {
        submitStatus = 'error';
        submitMessage = data.error || 'Gagal menyimpan template';
        return;
      }

      submitStatus = 'success';
      submitMessage = 'Template WA berhasil disimpan';
      setTimeout(() => submitStatus = 'idle', 3000);
    } catch (e) {
      submitStatus = 'error';
      submitMessage = 'Terjadi kesalahan jaringan';
    }
  }
</script>

<div class="bg-card rounded-3xl shadow-xl p-6 max-w-2xl border border-border mt-8">
  <h2 class="text-2xl font-bold mb-2">Template Pesan WhatsApp</h2>
  <p class="text-sm text-secondary leading-relaxed mb-6">
    Tentukan pesan bawaan yang akan muncul di layar pelanggan saat mereka menekan tombol "Chat WA" pada navigasi/header.
  </p>

  <div class="form-control w-full">
    <textarea
      bind:value={template}
      placeholder={DEFAULT_TEMPLATE}
      class="textarea textarea-bordered w-full h-48 font-mono text-sm"
    ></textarea>
  </div>

  {#if submitStatus === 'error'}
    <div class="alert alert-error text-sm mt-4">
      <AlertCircle size={16} />
      <span>{submitMessage}</span>
    </div>
  {:else if submitStatus === 'success'}
    <div class="alert alert-success text-sm mt-4">
      <CheckCircle size={16} />
      <span>{submitMessage}</span>
    </div>
  {/if}

  <div class="flex justify-end pt-4 gap-2">
    <Button variant="secondary" size="md" on:click={() => template = DEFAULT_TEMPLATE}>
      Reset Default
    </Button>
    <Button variant="primary" size="md" on:click={handleSubmit} loading={submitStatus === 'submitting'}>
      Simpan Template
    </Button>
  </div>
</div>
