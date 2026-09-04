<script lang="ts">
  import { AlertCircle } from 'lucide-svelte';
</script>

<div class="alert alert-warning gap-3 mb-6" role="status">
  <AlertCircle size={24} />
  <span>
    Data toko belum lengkap. Silakan <a href="/onboarding" class="link link-hover">isi data toko</a> untuk hasil analitik yang lebih akurat.
  </span>
</div>
