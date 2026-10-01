export interface SpacingPreset {
  label: string;
  desc: string;
  py: number;
  px: number;
  my: number;
}

export const PADDING_Y_CHIPS = [0, 16, 24, 32, 48, 64, 80, 96];
export const PADDING_X_CHIPS = [0, 8, 16, 24, 32, 40, 48];
export const MARGIN_CHIPS = [0, 8, 16, 24, 32, 48, 64];

export const SPACING_PRESETS: SpacingPreset[] = [
  { label: 'Default', desc: 'Sesuai tema bawaan', py: 0, px: 0, my: 0 },
  { label: 'Rapat', desc: 'Tinggi padat & hemat ruang', py: 16, px: 8, my: 0 },
  { label: 'Standar', desc: 'Proporsi seimbang rekomendasi', py: 32, px: 16, my: 0 },
  { label: 'Lega', desc: 'Kesan premium & lapang', py: 64, px: 24, my: 0 },
  { label: 'Jumbo', desc: 'Seksi utama / hero focus', py: 96, px: 32, my: 16 },
];
