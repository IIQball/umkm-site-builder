export interface SceneCaption {
  id: 'collaboration' | 'decision' | 'breakthrough' | 'showcase' | 'map'
  headline: string
  subtext: string
  frameStart: number
  fadeInEnd: number
  fadeOutStart: number
  frameEnd: number
}

export const HERO_SCENES: readonly SceneCaption[] = [
  {
    id: 'collaboration',
    headline: 'Kolaborasi Nyata<br />di Titik Temu',
    subtext: 'Menyatukan desainer digital dengan wirausaha lokal untuk membangun nilai baru.',
    frameStart: 125,
    fadeInEnd: 145,
    fadeOutStart: 195,
    frameEnd: 215
  },
  {
    id: 'decision',
    headline: 'Satu Aksi<br />Menuju Ruang Baru',
    subtext: 'Langkah awal membawa produk tradisional melampaui batasan fisik.',
    frameStart: 250,
    fadeInEnd: 275,
    fadeOutStart: 375,
    frameEnd: 405
  },
  {
    id: 'breakthrough',
    headline: 'Menembus Batas<br />Tradisional',
    subtext: 'Membuka cakrawala baru ketika teknologi modern dan kearifan lokal berpadu.',
    frameStart: 445,
    fadeInEnd: 475,
    fadeOutStart: 575,
    frameEnd: 605
  },
  {
    id: 'showcase',
    headline: 'Etalase Digital<br />Berkualitas Tinggi',
    subtext: 'Identitas visual modern yang mengangkat daya tawar karya otentik.',
    frameStart: 625,
    fadeInEnd: 650,
    fadeOutStart: 700,
    frameEnd: 725
  },
  {
    id: 'map',
    headline: 'Ekosistem yang<br />Terus Bertumbuh',
    subtext: 'Terhubung ke seluruh sentra wirausaha potensial di Banyuwangi.',
    frameStart: 770,
    fadeInEnd: 790,
    fadeOutStart: 825,
    frameEnd: 839
  }
] as const

/**
 * Menghitung opasitas caption dengan kurva smoothstep (Hermite interpolation)
 * agar transisi masuk dan keluar terasa halus dan sinematik tanpa patahan visual.
 */
export function calculateSceneOpacity(frame: number, scene: SceneCaption): number {
  if (frame < scene.frameStart || frame > scene.frameEnd) return 0
  if (frame >= scene.fadeInEnd && frame <= scene.fadeOutStart) return 1

  if (frame < scene.fadeInEnd) {
    const raw = (frame - scene.frameStart) / (scene.fadeInEnd - scene.frameStart)
    const t = Math.max(0, Math.min(1, raw))
    return t * t * (3 - 2 * t)
  }

  const raw = (scene.frameEnd - frame) / (scene.frameEnd - scene.fadeOutStart)
  const t = Math.max(0, Math.min(1, raw))
  return t * t * (3 - 2 * t)
}
