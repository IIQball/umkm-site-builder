<script lang="ts">
  import { Check } from 'lucide-svelte';
  import type { OnboardingStep } from '../onboarding.types';

  export let currentStep: OnboardingStep = 1;
  export let onStepClick: (step: OnboardingStep) => void;
  export let isEdit: boolean = false;

  interface StepItem {
    num: OnboardingStep;
    label: string;
  }

  let stepsList: StepItem[] = [];
  $: stepsList = [
    { num: 1, label: 'Subdomain' },
    { num: 2, label: 'Profil & Lokasi' },
    { num: 3, label: isEdit ? 'Template & Status' : 'Pilih Template' },
    { num: 4, label: 'Kustomisasi Konten' },
    { num: 5, label: 'Selesai' },
  ];

  $: progressWidth =
    currentStep === 1
      ? '0%'
      : currentStep === 2
      ? '25%'
      : currentStep === 3
      ? '50%'
      : currentStep === 4
      ? '75%'
      : '100%';
</script>

<div class="mb-8 px-2 sm:px-6">
  <div class="flex items-center justify-between relative max-w-2xl mx-auto">
    <div class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-nested border border-light w-full -z-0 rounded-full"></div>
    <div
      class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-300 -z-0 rounded-full"
      style="width: {progressWidth};"
    ></div>

    {#each stepsList as s}
      <div class="relative z-10 flex flex-col items-center">
        <button
          type="button"
          disabled={isEdit ? s.num === 5 && currentStep !== 5 : s.num >= currentStep}
          on:click={() => { if (isEdit ? s.num <= 4 : s.num < currentStep) onStepClick(s.num); }}
          class="w-8 h-8 rounded-full flex items-center justify-center font-bold font-sans text-xs transition-all duration-150 {currentStep > s.num
            ? 'bg-primary text-white shadow-xs ring-4 ring-card cursor-pointer hover:scale-105'
            : currentStep === s.num
            ? 'bg-primary text-white shadow-sm ring-4 ring-primary/20 scale-105'
            : isEdit && s.num <= 4
            ? 'bg-nested text-main border border-light ring-4 ring-card cursor-pointer hover:scale-105'
            : 'bg-nested text-muted border border-light ring-4 ring-card cursor-default'}"
        >
          {#if currentStep > s.num}
            <Check size={13} strokeWidth={3} />
          {:else}
            {s.num}
          {/if}
        </button>
        <span class="text-label-caps mt-1.5 transition-colors hidden sm:block {currentStep >= s.num ? 'text-main font-bold' : 'text-muted'}">
          {s.label}
        </span>
      </div>
    {/each}
  </div>
</div>
