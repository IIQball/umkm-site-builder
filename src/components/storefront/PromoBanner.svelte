<script lang="ts">
  export let text = 'Special Promo!';
  export let link = '#';
  export let bgColor = 'bg-accent';
  export let textColor = 'text-accent-content';
</script>

<a href={link} class="block w-full py-3 px-4 text-center {bgColor} {textColor} font-medium hover:opacity-90 transition-opacity">
  {text}
</a>
