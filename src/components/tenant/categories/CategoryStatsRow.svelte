<script lang="ts">
  import { StatCard } from '@/components/ui';

  export let totalCategories = 0;
  export let activeCategories = 0;
  export let inactiveCategories = 0;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {#key totalCategories}
    <StatCard label="Total Kategori" value={totalCategories} rawValue={totalCategories} icon="layers" cardTheme="dark" badge="Organisasi" footerText="Total kategori dibuat" delayClass="delay-100" />
  {/key}
  {#key activeCategories}
    <StatCard label="Kategori Aktif" value={activeCategories} rawValue={activeCategories} icon="check_circle" cardTheme="default" badge="Aktif" footerText="Kategori yang aktif" delayClass="delay-150" />
  {/key}
  {#key inactiveCategories}
    <StatCard label="Tidak Aktif" value={inactiveCategories} rawValue={inactiveCategories} icon="visibility_off" cardTheme="orange" badge="Tersembunyi" footerText="Kategori tidak ditampilkan" delayClass="delay-200" />
  {/key}
  <StatCard label="Status Organisir" value="—" icon="done_all" cardTheme="blue" badge="Siap" footerText="Kategori terorganisir" delayClass="delay-250" />
</div>

