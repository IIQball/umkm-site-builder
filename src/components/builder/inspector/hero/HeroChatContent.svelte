<script lang="ts">
  import { Plus, Trash2 } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { ChatItem } from './heroContent.types';

  export let chatMessages: ChatItem[] = [];
  export let onPropChange: (key: string, value: unknown) => void;

  $: messages =
    Array.isArray(chatMessages) && chatMessages.length > 0
      ? chatMessages
      : [
          { sender: 'in', text: 'Halo Kak! Mau pesan Paket Favorit untuk makan siang ya?', time: '11:15' },
          { sender: 'out', text: 'Siap Kak! Pesanan sudah kami jadwalkan, kurir langsung meluncur jam 11.45 ya', time: '11:16' },
        ];

  function updateMessage(index: number, field: keyof ChatItem, val: string) {
    const next = messages.map((m, i) => (i === index ? { ...m, [field]: val } : m));
    onPropChange('chatMessages', next);
  }

  function addMessage() {
    if (messages.length >= 4) return;
    const lastSender = messages[messages.length - 1]?.sender;
    const nextSender = lastSender === 'in' ? 'out' : 'in';
    const next = [
      ...messages,
      {
        sender: nextSender,
        text: nextSender === 'in' ? 'Bisa dikirim sekarang kak?' : 'Bisa kak, mohon ditunggu ya!',
        time: '11:17',
      },
    ];
    onPropChange('chatMessages', next);
  }

  function removeMessage(index: number) {
    if (messages.length <= 1) return;
    const next = messages.filter((_, i) => i !== index);
    onPropChange('chatMessages', next);
  }
</script>

<div class="space-y-3 pt-3 border-t border-base-300">
  <div class="flex items-center justify-between">
    <span class="block font-semibold text-xs text-base-content/80">
      Simulasi Balon Chat WA ({messages.length}/4)
    </span>
    {#if messages.length < 4}
      <Button
        type="button"
        variant="ghost"
        size="xs"
        on:click={addMessage}
        class="!h-auto !min-h-0 !py-1 !px-2 text-primary gap-1"
      >
        <Plus size={13} />
        Tambah Balon
      </Button>
    {/if}
  </div>

  <span class="block text-[10.5px] text-base-content/50">
    Maksimal 4 balon percakapan agar tampilan hero tetap seimbang dan proporsional.
  </span>

  <div class="space-y-2.5">
    {#each messages as msg, i (i)}
      <div class="p-2.5 rounded-xl bg-base-200/50 border border-base-300 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <span class="text-[11px] font-semibold text-base-content/60">Pesan #{i + 1}</span>
            <span class={`badge badge-xs text-[9px] ${msg.sender === 'in' ? 'badge-neutral' : 'badge-primary text-white'}`}>
              {msg.sender === 'in' ? 'Masuk (Kiri)' : 'Keluar (Kanan)'}
            </span>
          </div>
          {#if messages.length > 1}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              on:click={() => removeMessage(i)}
              class="!w-6 !h-6 !min-h-0 !p-0 text-error hover:text-error/80"
              title="Hapus Pesan"
            >
              <Trash2 size={13} />
            </Button>
          {/if}
        </div>

        <div class="grid grid-cols-3 gap-2">
          <div class="col-span-2">
            <label for="chat-sender-{i}" class="block text-[10px] text-base-content/60 mb-0.5">Posisi Balon</label>
            <select
              id="chat-sender-{i}"
              value={msg.sender}
              on:change={(e) => updateMessage(i, 'sender', e.currentTarget.value as 'in' | 'out')}
              class="select select-bordered select-xs w-full"
            >
              <option value="in">Kiri (Balon Penerima / Pelanggan)</option>
              <option value="out">Kanan (Balon Pengirim / Admin Toko)</option>
            </select>
          </div>

          <div>
            <label for="chat-time-{i}" class="block text-[10px] text-base-content/60 mb-0.5">Waktu</label>
            <input
              id="chat-time-{i}"
              type="text"
              value={msg.time || '11:15'}
              on:input={(e) => updateMessage(i, 'time', e.currentTarget.value)}
              class="input input-bordered input-xs w-full font-mono text-center"
              placeholder="11:15"
            />
          </div>
        </div>

        <div>
          <label for="chat-text-{i}" class="block text-[10px] text-base-content/60 mb-0.5">Teks Pesan</label>
          <textarea
            id="chat-text-{i}"
            rows="2"
            value={msg.text}
            on:input={(e) => updateMessage(i, 'text', e.currentTarget.value)}
            class="textarea textarea-bordered textarea-xs w-full resize-none"
            placeholder="Ketik isi pesan WhatsApp..."
          ></textarea>
        </div>
      </div>
    {/each}
  </div>
</div>
