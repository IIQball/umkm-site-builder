<script lang="ts">
  import { Eye, EyeOff } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import Input from "@/components/ui/Input.svelte";
  import Button from "@/components/ui/Button.svelte";

  export let password = "";
  export let confirmPassword = "";
  export let errors: Record<string, string> = {};
  export let loading = false;
  export let onInput: (field: string) => void;
  export let onSubmit: (e: Event) => void;

  let showPassword = false;
  let showConfirmPassword = false;
</script>

<form
  novalidate
  on:submit={onSubmit}
  class="space-y-4 w-full absolute top-0 left-0"
  in:fly={{ x: 20, duration: 400, delay: 400, easing: cubicOut }}
  out:fade={{ duration: 300 }}
>
  <div class="text-center mb-4">
    <h3 class="text-main font-bold text-base">Buat Kata Sandi</h3>
    <p class="text-xs text-secondary mt-1">Langkah terakhir, amankan akun Anda</p>
  </div>

  <Input
    type={showPassword ? "text" : "password"}
    id="password"
    bind:value={password}
    label="Kata Sandi"
    error={errors.password}
    on:input={() => onInput("password")}
    placeholder="Minimal 8 karakter"
    autocomplete="new-password"
    size="md"
    fullWidth
  >
    <Button
      variant="ghost"
      size="icon"
      slot="suffix"
      type="button"
      class="text-muted"
      on:click={() => { showPassword = !showPassword; }}
      aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
    >
      {#if showPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
    </Button>
  </Input>

  <Input
    type={showConfirmPassword ? "text" : "password"}
    id="confirmPassword"
    bind:value={confirmPassword}
    label="Konfirmasi Sandi"
    error={errors.confirmPassword}
    on:input={() => onInput("confirmPassword")}
    placeholder="Ketik ulang kata sandi"
    autocomplete="new-password"
    size="md"
    fullWidth
  >
    <Button
      variant="ghost"
      size="icon"
      slot="suffix"
      type="button"
      class="text-muted"
      on:click={() => { showConfirmPassword = !showConfirmPassword; }}
      aria-label={showConfirmPassword ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
    >
      {#if showConfirmPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
    </Button>
  </Input>

  <div class="pt-2 flex items-center gap-3 w-full">
    <Button type="submit" variant="primary" size="md" fullWidth {loading} disabled={loading || !password || !confirmPassword}>
      Selesaikan Registrasi
    </Button>
  </div>
</form>

