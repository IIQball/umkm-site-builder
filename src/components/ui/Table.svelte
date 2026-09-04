<script lang="ts">
  export let headers: Array<{
    key?: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: string;
  }> = [];
  export let striped: boolean = false;
  export let hoverable: boolean = true;
  export let dense: boolean = false;
  export let responsive: boolean = true;
  export let minWidth: string = 'min-w-[600px]';
  let className: string = '';
  export { className as class };

  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
</script>

<div class="{responsive ? 'overflow-x-auto w-full' : 'w-full'} {className}">
  <table class="w-full text-sm {minWidth} border-collapse">
    <thead>
      <tr class="bg-nested/60 border-b border-light">
        {#if $$slots.head}
          <slot name="head" />
        {:else}
          {#each headers as head}
            <th
              class="text-label-caps text-muted {dense ? 'px-4 py-2.5' : 'px-6 py-3.5'} {alignStyles[head.align || 'left']}"
              style={head.width ? `width: ${head.width}` : ''}
            >
              {head.label}
            </th>
          {/each}
        {/if}
      </tr>
    </thead>

    <tbody
      class="divide-y divide-[var(--color-border-light)] {striped ? '[&>tr:nth-child(even)]:bg-nested/30' : ''} {hoverable ? '[&>tr]:hover:bg-nested/40 [&>tr]:transition-colors' : ''}"
    >
      {#if $$slots.default}
        <slot />
      {:else if $$slots.empty}
        <tr>
          <td colspan={headers.length || 1} class="py-12 text-center text-muted">
            <slot name="empty" />
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>
