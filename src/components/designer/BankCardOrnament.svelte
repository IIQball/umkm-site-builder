<script lang="ts">
  import { resolveBankKey } from './bankBranding.helpers';

  export let bankCode: string | null | undefined = '';

  $: activeBank = resolveBankKey(bankCode);
</script>

<div class="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
  {#if activeBank === 'BNI'}
    <!-- BNI: Dynamic curving fluid lines in teal and vivid orange -->
    <svg viewBox="0 0 500 300" fill="none" preserveAspectRatio="xMidYMid slice" class="w-full h-full opacity-20">
      <path d="M-50,250 C120,280 220,120 550,160" stroke="#F15A24" stroke-width="6" stroke-linecap="round" />
      <path d="M-20,290 C150,310 260,160 550,200" stroke="#00A39D" stroke-width="3" stroke-linecap="round" stroke-dasharray="12 8" />
      <path d="M100,-40 C220,80 340,30 520,100" stroke="#F15A24" stroke-width="3" opacity="0.8" />
      <path d="M-60,180 C80,220 180,60 520,90" stroke="#0d9488" stroke-width="4" />
      <circle cx="430" cy="70" r="140" stroke="#F15A24" stroke-width="2" opacity="0.3" />
    </svg>
  {:else if activeBank === 'BCA'}
    <!-- BCA: Modern geometric waves and repeating wave lines with navy gradient tones -->
    <svg viewBox="0 0 500 300" fill="none" preserveAspectRatio="xMidYMid slice" class="w-full h-full opacity-25">
      <g stroke="#3b82f6" stroke-width="1.5" opacity="0.6">
        <path d="M-50,80 C80,40 180,140 320,100 C420,70 480,120 550,90" />
        <path d="M-50,120 C80,80 180,180 320,140 C420,110 480,160 550,130" />
        <path d="M-50,160 C80,120 180,220 320,180 C420,150 480,200 550,170" />
        <path d="M-50,200 C80,160 180,260 320,220 C420,190 480,240 550,210" />
      </g>
      <g stroke="#60a5fa" stroke-width="1" opacity="0.3" stroke-dasharray="6 6">
        <path d="M-50,60 C80,20 180,120 320,80 C420,50 480,100 550,70" />
        <path d="M-50,240 C80,200 180,300 320,260 C420,230 480,280 550,250" />
      </g>
      <circle cx="460" cy="50" r="120" stroke="#2563eb" stroke-width="2" opacity="0.4" />
    </svg>
  {:else if activeBank === 'MANDIRI'}
    <!-- Mandiri: Curving golden ribbon motif with deep gold accents in the right corner -->
    <svg viewBox="0 0 500 300" fill="none" preserveAspectRatio="xMidYMid slice" class="w-full h-full opacity-25">
      <path d="M220,-40 C300,60 380,120 540,110 L540,-40 Z" fill="url(#mandiri-gold-grad)" opacity="0.6" />
      <path d="M260,-40 C340,90 420,160 540,150" stroke="#FFB81C" stroke-width="5" stroke-linecap="round" />
      <path d="M300,-40 C370,120 450,200 540,190" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" opacity="0.8" />
      <path d="M340,-40 C400,150 470,230 540,220" stroke="#B45309" stroke-width="1.5" stroke-dasharray="8 6" />
      <defs>
        <linearGradient id="mandiri-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFB81C" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#D97706" stop-opacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  {:else if activeBank === 'BRI'}
    <!-- BRI: Dynamic diagonal lines and bright orange curved accent khas BRI BritAma -->
    <svg viewBox="0 0 500 300" fill="none" preserveAspectRatio="xMidYMid slice" class="w-full h-full opacity-20">
      <g stroke="#38bdf8" stroke-width="2" opacity="0.4">
        <line x1="180" y1="0" x2="380" y2="300" />
        <line x1="220" y1="0" x2="420" y2="300" />
        <line x1="260" y1="0" x2="460" y2="300" />
        <line x1="300" y1="0" x2="500" y2="300" />
      </g>
      <path d="M120,320 C240,240 380,180 540,160" stroke="#F37021" stroke-width="6" stroke-linecap="round" />
      <path d="M160,330 C270,260 400,210 540,195" stroke="#FB923C" stroke-width="2" stroke-linecap="round" stroke-dasharray="8 6" />
    </svg>
  {:else if activeBank === 'BSI'}
    <!-- BSI: Subtle geometric Islamic stylization with emerald and gold curves -->
    <svg viewBox="0 0 500 300" fill="none" preserveAspectRatio="xMidYMid slice" class="w-full h-full opacity-20">
      <g stroke="#00A39D" stroke-width="1.5" opacity="0.5">
        <path d="M420,70 L435,90 L460,90 L440,105 L450,130 L425,115 L405,130 L415,105 L395,90 L420,90 Z" fill="#00A39D" fill-opacity="0.15" />
        <circle cx="425" cy="105" r="50" stroke="#F39200" stroke-width="1.5" opacity="0.6" />
        <circle cx="425" cy="105" r="75" stroke="#00A39D" stroke-width="1" stroke-dasharray="6 4" opacity="0.4" />
      </g>
      <path d="M-50,200 C150,140 280,260 520,210" stroke="#10b981" stroke-width="3" opacity="0.7" />
      <path d="M-20,230 C170,170 300,290 530,240" stroke="#F39200" stroke-width="2" stroke-linecap="round" opacity="0.6" />
    </svg>
  {:else if activeBank === 'CIMB'}
    <!-- CIMB Niaga: Sharp polygon corner folds in dark maroon and fiery red -->
    <svg viewBox="0 0 500 300" fill="none" preserveAspectRatio="xMidYMid slice" class="w-full h-full opacity-20">
      <polygon points="340,-20 520,-20 520,160 410,120" fill="#EE1B24" opacity="0.25" />
      <polygon points="410,120 520,160 520,270 440,220" fill="#B91C1C" opacity="0.3" />
      <line x1="340" y1="-20" x2="520" y2="160" stroke="#EE1B24" stroke-width="3" />
      <line x1="410" y1="120" x2="520" y2="270" stroke="#F87171" stroke-width="2" stroke-dasharray="10 6" />
      <polygon points="-30,220 120,200 40,320" fill="#7E121D" opacity="0.35" />
    </svg>
  {:else if activeBank === 'BTN'}
    <!-- BTN: Clean horizontal stripes with bold golden-yellow accent stripe -->
    <svg viewBox="0 0 500 300" fill="none" preserveAspectRatio="xMidYMid slice" class="w-full h-full opacity-25">
      <g stroke="#3b82f6" stroke-width="1.5" opacity="0.4">
        <line x1="0" y1="60" x2="500" y2="60" />
        <line x1="0" y1="80" x2="500" y2="80" stroke-dasharray="12 8" />
        <line x1="0" y1="180" x2="500" y2="180" stroke-dasharray="8 6" />
        <line x1="0" y1="200" x2="500" y2="200" />
      </g>
      <rect x="0" y="115" width="500" height="12" fill="#FAA61A" opacity="0.6" />
      <rect x="0" y="132" width="500" height="3" fill="#FDE047" opacity="0.4" />
    </svg>
  {:else if activeBank === 'MAYBANK'}
    <!-- Maybank: High-contrast diagonal geometric tiger stripes in golden yellow and dark charcoal -->
    <svg viewBox="0 0 500 300" fill="none" preserveAspectRatio="xMidYMid slice" class="w-full h-full opacity-20">
      <g fill="#FFC72C">
        <polygon points="260,-20 320,-20 440,320 380,320" opacity="0.3" />
        <polygon points="350,-20 390,-20 490,320 450,320" opacity="0.2" />
        <polygon points="180,-20 210,-20 330,320 300,320" opacity="0.15" />
      </g>
      <line x1="300" y1="-20" x2="420" y2="320" stroke="#FDE047" stroke-width="3" stroke-dasharray="14 10" opacity="0.5" />
    </svg>
  {:else if activeBank === 'PERMATA'}
    <!-- Permata: Hexagonal crystal prism bias with bright lime-green accents -->
    <svg viewBox="0 0 500 300" fill="none" preserveAspectRatio="xMidYMid slice" class="w-full h-full opacity-20">
      <g stroke="#84cc16" stroke-width="1.5" fill="none" opacity="0.5">
        <polygon points="400,60 440,35 480,60 480,105 440,130 400,105" fill="#84cc16" fill-opacity="0.1" />
        <polygon points="340,95 380,70 420,95 420,140 380,165 340,140" fill="#22c55e" fill-opacity="0.12" />
        <polygon points="410,135 450,110 490,135 490,180 450,205 410,180" fill="#10b981" fill-opacity="0.08" />
        <line x1="380" y1="70" x2="440" y2="35" stroke="#a3e635" stroke-width="2" />
        <line x1="340" y1="140" x2="400" y2="105" stroke="#a3e635" stroke-width="1.5" stroke-dasharray="6 4" />
      </g>
      <path d="M-30,220 L180,120 L320,200 L530,90" stroke="#84cc16" stroke-width="2" opacity="0.4" />
    </svg>
  {:else}
    <!-- Default / Generic bank transfer decorative rings -->
    <svg viewBox="0 0 500 300" fill="none" preserveAspectRatio="xMidYMid slice" class="w-full h-full opacity-15">
      <circle cx="450" cy="50" r="140" stroke="#f97316" stroke-width="2" opacity="0.3" />
      <circle cx="450" cy="50" r="200" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="8 6" opacity="0.2" />
    </svg>
  {/if}
</div>
