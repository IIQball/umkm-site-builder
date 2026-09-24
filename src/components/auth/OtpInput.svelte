<script lang="ts">
  import { createEventDispatcher, onMount, tick } from 'svelte';

  export let value = '';
  export let length = 6;
  export let disabled = false;
  export let autofocus = true;

  const dispatch = createEventDispatcher();
  
  let inputs: HTMLInputElement[] = [];
  let values = Array(length).fill('');

  // Sync external value to internal array when it changes externally
  $: if (value.length <= length && value !== values.join('')) {
    const chars = value.split('');
    values = Array(length).fill('').map((_, i) => chars[i] || '');
  }

  onMount(() => {
    if (autofocus && inputs[0]) {
      // Small delay to ensure it's rendered and transition is done
      setTimeout(() => inputs[0]?.focus(), 500); 
    }
  });

  async function handleInput(i: number, e: Event) {
    const target = e.target as HTMLInputElement;
    const val = target.value;
    
    // Only allow numbers
    const numVal = val.replace(/[^0-9]/g, '');
    
    if (numVal.length > 1) {
       target.value = numVal[0] || '';
       values[i] = numVal[0] || '';
    } else {
       target.value = numVal;
       values[i] = numVal;
    }

    updateValue();

    // Move to next if typed a number
    if (numVal && i < length - 1) {
      inputs[i + 1].focus();
    }
  }

  function handleKeyDown(i: number, e: KeyboardEvent) {
    if (e.key === 'Backspace') {
      if (!values[i] && i > 0) {
        // If empty, delete previous and move back
        e.preventDefault();
        values[i - 1] = '';
        updateValue();
        inputs[i - 1].focus();
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault();
      inputs[i - 1].focus();
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      e.preventDefault();
      inputs[i + 1].focus();
    }
  }

  function handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    const pastedData = e.clipboardData?.getData('text/plain') || '';
    const numVal = pastedData.replace(/[^0-9]/g, '').slice(0, length);
    
    if (numVal) {
      const chars = numVal.split('');
      values = Array(length).fill('').map((_, i) => chars[i] || values[i]);
      updateValue();
      
      // Focus next empty or last input
      const nextEmptyIndex = values.findIndex(v => !v);
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
      tick().then(() => {
        if (inputs[focusIndex]) inputs[focusIndex].focus();
      });
    }
  }

  function updateValue() {
    value = values.join('');
    dispatch('change', value);
    if (value.length === length) {
      dispatch('complete', value);
    }
  }
  

</script>

<div 
  class="flex items-center justify-center gap-2 sm:gap-3 w-full"
  on:paste={handlePaste}
>
  {#each values as _v, i}
    <input
      bind:this={inputs[i]}
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      maxlength="1"
      {disabled}
      bind:value={values[i]}
      on:input={(e) => handleInput(i, e)}
      on:keydown={(e) => handleKeyDown(i, e)}
      class="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold bg-surface border-2 rounded-xl transition-all duration-300 ease-out focus:scale-105 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 {values[i] ? 'border-primary/50 text-main' : 'border-border text-muted'} {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
    />
  {/each}
</div>
