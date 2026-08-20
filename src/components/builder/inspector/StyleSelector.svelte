<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let styles: Record<string, string> = {};
  const dispatch = createEventDispatcher();

  const update = (key: string, value: string) => {
    const updated = { ...styles, [key]: value };
    dispatch("change", updated);
  };
</script>

<div class="space-y-2">
  <!-- Font Size -->
  <div class="flex items-center gap-2">
    <label class="text-xs font-medium w-24" for="style-font-size"
      >Font Size</label
    >
    <input
      id="style-font-size"
      type="text"
      placeholder="e.g., 16px"
      class="input input-xs flex-1"
      value={styles.fontSize || ""}
      on:input={(e) => update("fontSize", e.currentTarget.value)}
    />
  </div>

  <!-- Text Color -->
  <div class="flex items-center gap-2">
    <label class="text-xs font-medium w-24" for="style-color">Text Color</label>
    <input
      id="style-color"
      type="color"
      class="input input-xs flex-1"
      value={styles.color || "#000000"}
      on:input={(e) => update("color", e.currentTarget.value)}
    />
  </div>

  <!-- Background Color -->
  <div class="flex items-center gap-2">
    <label class="text-xs font-medium w-24" for="style-bg-color">BG Color</label
    >
    <input
      id="style-bg-color"
      type="color"
      class="input input-xs flex-1"
      value={styles.backgroundColor || "#ffffff"}
      on:input={(e) => update("backgroundColor", e.currentTarget.value)}
    />
  </div>

  <!-- Padding -->
  <div class="flex items-center gap-2">
    <label class="text-xs font-medium w-24" for="style-padding">Padding</label>
    <input
      id="style-padding"
      type="text"
      placeholder="e.g., 8px 16px"
      class="input input-xs flex-1"
      value={styles.padding || ""}
      on:input={(e) => update("padding", e.currentTarget.value)}
    />
  </div>
</div>
