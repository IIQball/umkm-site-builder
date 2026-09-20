# Landing Page Components Structure

Struktur landing page telah dipecah dari satu file besar menjadi multiple komponen terpisah untuk better maintainability dan reusability.

## Folder Structure

```
src/components/landing/
├── LandingPage.svelte          # Main orchestrator component
├── sections/                    # Individual section components
│   ├── Navbar.svelte           # Navigation bar
│   ├── Hero.svelte             # Hero section with animations
│   ├── About.svelte            # About section with typewriter
│   ├── Kategori.svelte         # Category/UMKM filter section
│   ├── Featured.svelte         # Featured UMKM carousel
│   ├── Builder.svelte          # No-code builder showcase
│   ├── HowItWorks.svelte       # Steps/process section
│   ├── Testimonial.svelte      # Customer testimonial
│   ├── CTA.svelte              # Call-to-action section
│   └── Footer.svelte           # Footer
├── types/
│   └── index.ts                # TypeScript interfaces
├── utils/
│   ├── constants.ts            # Constants & data
│   └── animations.ts           # GSAP animation functions
```

## Components Overview

### LandingPage.svelte
**Main orchestrator** - menggabungkan semua section dan handle:
- Theme toggle logic
- Global state management
- Animation setup on mount
- All refs binding untuk animations

### Sections

**Navbar.svelte**
- Fixed navigation bar
- Brand logo dengan gradient
- Navigation links
- Action buttons (Login/Register)

**Hero.svelte**
- Hero section dengan sticky scroll animation
- Map visualization (Jawa Timur → Banyuwangi zoom)
- Scroll hint indicator
- "PINOKA" text flying animation ke navbar

**About.svelte**
- Video asset dengan fade-in
- Typewriter animation untuk eyebrow & heading
- Stats display dengan fade-in trigger
- Scroll-trigger based animations

**Kategori.svelte**
- Category filter pills (dengan icons)
- Kecamatan filter chips (horizontal scroll)
- UMKM cards grid dengan filter logic
- Responsive grid (3 cols → 2 cols → 1 col)

**Featured.svelte**
- Featured UMKM carousel (horizontal scroll)
- Card dengan badge, image, location, rating
- Responsive card sizing

**Builder.svelte**
- Three-step builder process
- Browser mockup preview
- Product cards dalam mockup
- WhatsApp CTA button

**HowItWorks.svelte**
- Four-step process timeline
- Gradient numbered steps
- Dashed line connectors between steps
- Responsive: 4 cols → 1 col

**Testimonial.svelte**
- Customer testimonial quote
- Avatar with gradient background
- Image asset dengan drop shadow
- Two-column layout → stacked mobile

**CTA.svelte**
- Call-to-action section dengan gradient background
- Radial gradient overlay
- Image asset
- Two-column layout → stacked mobile

**Footer.svelte**
- Brand section dengan description
- Links columns (Jelajah, For Businesses, Social)
- Copyright info

## Data & Constants

### types/index.ts
TypeScript interfaces untuk:
- `CategoryFilter`
- `UmkmItem`
- `BuilderStep`
- `BuilderProduct`
- `FeaturedItem`
- `HowItWorksStep`

### utils/constants.ts
Exported constants:
- `categoryFilters` - Category options dengan icons
- `categoryIconMap` - Icon mapping untuk categories
- `kecamatanFilters` - List of districts
- `umkmDirectory` - UMKM data
- `builderSteps` - Builder steps
- `builderProducts` - Sample products
- `featured` - Featured UMKM
- `howItWorksSteps` - Process steps
- `fullEyebrow`, `fullH2` - About section text

### utils/animations.ts
GSAP animation functions:
- `setupHeroAnimations()` - Hero scroll trigger & intro timeline
- `setupScrollRevealAnimations()` - Reveals untuk berbagai elements
- `setupAboutScrollAnimation()` - About section typewriter & fade-in

## Key Features

### Responsive Design
Breakpoints:
- Desktop: 1180px max-width
- Tablet: 1024px, 768px
- Mobile: 520px

### Dark/Light Theme
- Toggle button di top-right
- LocalStorage persistence
- CSS custom properties untuk theming

### Animations
- Hero: Map zoom + text animations (scroll-based)
- About: Typewriter effect + video scrub
- Sections: Staggered reveals on scroll
- Cards: 3D rotations & slides

### Mobile Optimizations
- Sticky nav vs fixed nav based on viewport
- Hero section transitions dari sticky to relative layout
- Touch-friendly filter chips (horizontal scroll)
- Responsive typography dengan clamp()

## Usage

Import ke page:
```svelte
import LandingPage from '@/components/landing/LandingPage.svelte';
```

Semua state & animations sudah internal handled. Komponen fully self-contained.

## Maintenance Tips

1. **Menambah data**: Edit `utils/constants.ts`
2. **Mengubah animations**: Edit `utils/animations.ts` atau di komponen individual
3. **Styling**: Masing-masing komponen punya `<style>` block isolated
4. **Types**: Update `types/index.ts` bila ada data baru
5. **Mobile**: Test di berbagai breakpoints saat edit
