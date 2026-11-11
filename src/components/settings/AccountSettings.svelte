<script lang="ts">
  import { authClient } from "@/lib/auth-client";
  import { toast } from "@/lib/toast";
  import { Card, Button, Input } from "@/components/ui";
  import type { AuthenticatedUser } from "@/types";
  import AccountPasswordCard from "./AccountPasswordCard.svelte";

  export let userJson: string;

  let parsedUser: Partial<AuthenticatedUser> = {};
  try {
    parsedUser = JSON.parse(userJson) as Partial<AuthenticatedUser>;
  } catch {
    parsedUser = {};
  }

  let newName = parsedUser.name || "";
  let isUpdatingName = false;

  async function handleUpdateName(e: Event) {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Nama tidak boleh kosong.");
      return;
    }
    if (newName === (parsedUser.name || "")) {
      toast.info("Nama belum diubah.");
      return;
    }

    isUpdatingName = true;
    try {
      const { error } = await authClient.updateUser({ name: newName.trim() });
      if (error) throw error;
      toast.success("Nama berhasil diperbarui! Memuat ulang...");
      setTimeout(() => window.location.reload(), 750);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui nama.");
      isUpdatingName = false;
    }
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pb-10">
  <Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden flex flex-col h-full">
    <div class="p-5 sm:p-6 border-b border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
          <span class="material-symbols-outlined text-lg">person</span>
        </div>
        <div>
          <h3 class="text-heading-md text-main font-bold font-heading leading-tight">Profil Akun</h3>
          <p class="text-body-sm text-secondary mt-0.5 font-sans">Kelola informasi publik dan data pribadi Anda.</p>
        </div>
      </div>
    </div>

    <form on:submit={handleUpdateName} class="flex flex-col flex-grow">
      <div class="p-6 md:p-8 space-y-6 flex-grow">
        <Input
          id="email"
          type="email"
          label="Alamat Email"
          value={parsedUser.email || ""}
          disabled={true}
          helper="Email digunakan untuk login dan tidak dapat diganti."
          title="Email tidak dapat diubah"
        />

        <Input
          id="name"
          type="text"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap Anda"
          bind:value={newName}
          required={true}
        />
      </div>

      <div class="p-4 sm:px-6 py-4 border-t border-light flex justify-end mt-auto bg-card">
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="shadow-xs font-bold rounded-2xl w-full sm:w-auto"
          loading={isUpdatingName}
          disabled={isUpdatingName || newName === (parsedUser.name || "")}
        >
          <span class="material-symbols-outlined text-[18px] mr-1.5 icon-filled">save</span>
          <span>Simpan Perubahan</span>
        </Button>
      </div>
    </form>
  </Card>

  <AccountPasswordCard userId={parsedUser.id || ""} />
</div>
