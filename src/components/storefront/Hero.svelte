<script lang="ts">
  export let title = 'Default Hero Title';
  export let subtitle = 'Default Hero Subtitle';
  export let buttonText = 'Call to Action';
  export let buttonLink = '#';
  export let align: 'left' | 'center' | 'right' = 'center';
</script>

<div class="hero min-h-[400px] bg-base-200" style="text-align: {align};">
  <div class="hero-content flex-col lg:flex-row">
    <div>
      <h1 class="text-5xl font-bold">{title}</h1>
      <p class="py-6">{subtitle}</p>
      <a href={buttonLink} class="btn btn-primary">{buttonText}</a>
    </div>
  </div>
</div>
