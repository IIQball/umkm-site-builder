<script lang="ts">
  export let terminalFile: string = 'store-system.sh';
  export let terminalCmd1: string = '$ check --stock ready';
  export let terminalRes1: string = 'Seluruh produk terverifikasi & siap kirim';
  export let terminalCmd2: string = '$ order --instant-whatsapp';
  export let terminalRes2: string = 'Integrasi otomatis pesan WA tanpa ribet';
  export let terminalStatus: string = '_ Siap melayani pelanggan...';
  export let onPropChange: (key: string, value: unknown) => void;
</script>

<div class="space-y-3 pt-3 border-t border-base-300">
  <span class="block font-semibold text-xs text-base-content/80">
    Kustomisasi Kotak Kode Terminal
  </span>

  <div class="space-y-2">
    <div>
      <label for="terminal-file" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Nama Berkas Terminal
      </label>
      <input
        id="terminal-file"
        type="text"
        value={terminalFile}
        on:input={(e) => onPropChange('terminalFile', e.currentTarget.value)}
        class="input input-bordered input-xs w-full font-mono"
        placeholder="store-system.sh"
      />
    </div>

    <div>
      <label for="terminal-cmd1" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Perintah 1
      </label>
      <input
        id="terminal-cmd1"
        type="text"
        value={terminalCmd1}
        on:input={(e) => onPropChange('terminalCmd1', e.currentTarget.value)}
        class="input input-bordered input-xs w-full font-mono"
        placeholder="$ check --stock ready"
      />
    </div>

    <div>
      <label for="terminal-res1" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Hasil Respon 1
      </label>
      <input
        id="terminal-res1"
        type="text"
        value={terminalRes1}
        on:input={(e) => onPropChange('terminalRes1', e.currentTarget.value)}
        class="input input-bordered input-xs w-full"
        placeholder="Seluruh produk terverifikasi & siap kirim"
      />
    </div>

    <div>
      <label for="terminal-cmd2" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Perintah 2
      </label>
      <input
        id="terminal-cmd2"
        type="text"
        value={terminalCmd2}
        on:input={(e) => onPropChange('terminalCmd2', e.currentTarget.value)}
        class="input input-bordered input-xs w-full font-mono"
        placeholder="$ order --instant-whatsapp"
      />
    </div>

    <div>
      <label for="terminal-res2" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Hasil Respon 2
      </label>
      <input
        id="terminal-res2"
        type="text"
        value={terminalRes2}
        on:input={(e) => onPropChange('terminalRes2', e.currentTarget.value)}
        class="input input-bordered input-xs w-full"
        placeholder="Integrasi otomatis pesan WA tanpa ribet"
      />
    </div>

    <div>
      <label for="terminal-status" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Baris Status / Kedipan Kursor
      </label>
      <input
        id="terminal-status"
        type="text"
        value={terminalStatus}
        on:input={(e) => onPropChange('terminalStatus', e.currentTarget.value)}
        class="input input-bordered input-xs w-full font-mono"
        placeholder="_ Siap melayani pelanggan..."
      />
    </div>
  </div>
</div>
