export interface StageCoordinates {
  x: number
  y: number
  z: number
}

export interface StageData {
  id: string
  targetPin: string
  roleLabel: string
  camera: StageCoordinates
  lookAt: StageCoordinates
  stepBadge: string
  headline: string
  subtitle: string
  cardDesc: string
}

export const MODEL_PATH = '/assets/3d/banyuwangi_map.glb'

export const STEPPER_ITEMS = ['Overview', 'Simpul Usaha', 'Simpul Kreator', 'Gerbang Pasar']

export const BEFORE_STAGE = {
  camera: { x: 0.0382, y: 0.0600, z: 0.0162 },
  lookAt: { x: 0.0002, y: 0.0019, z: 0.0026 }
}

export const STAGES: StageData[] = [
  {
    id: 'stage-0',
    targetPin: 'All',
    roleLabel: 'Ekosistem Banyuwangi',
    camera: { x: 0.0025, y: 0.0323, z: 0.0461 },
    lookAt: { x: 0.0110, y: 0.0027, z: 0.0069 },
    stepBadge: '00 / JARINGAN DIGITAL',
    headline: 'Infrastruktur Ekosistem',
    subtitle: 'Tiga simpul terintegrasi di Banyuwangi',
    cardDesc: 'Koneksi langsung antarpilar kreatif tanpa perantara'
  },
  {
    id: 'stage-1',
    targetPin: 'Pin_Anyaman',
    roleLabel: 'Pelaku Usaha',
    camera: { x: 0.0093, y: 0.0163, z: 0.0308 },
    lookAt: { x: 0.0041, y: 0.0016, z: 0.0076 },
    stepBadge: '01 / SIMPUL USAHA',
    headline: 'Katalog Mandiri',
    subtitle: 'Kendali penuh produk dan transaksi',
    cardDesc: 'Pesanan masuk langsung ke pemilik usaha dengan margin 100% tanpa potongan komisi'
  },
  {
    id: 'stage-2',
    targetPin: 'Pin_Batik',
    roleLabel: 'Desainer Kreatif',
    camera: { x: 0.0256, y: 0.0234, z: -0.0058 },
    lookAt: { x: 0.0031, y: 0.0018, z: 0.0013 },
    stepBadge: '02 / SIMPUL KREATOR',
    headline: 'Kurasi Visual',
    subtitle: 'Standar estetika komersial premium',
    cardDesc: 'Kolaborasi perancang profesional dengan royalti transparan dan perlindungan hak cipta'
  },
  {
    id: 'stage-3',
    targetPin: 'Pin_Kopi',
    roleLabel: 'Konsumen & Pasar',
    camera: { x: -0.0285, y: 0.0141, z: -0.0138 },
    lookAt: { x: -0.0086, y: 0.0025, z: -0.0111 },
    stepBadge: '03 / GERBANG PASAR',
    headline: 'Akses Global',
    subtitle: 'Etalase digital tangan pertama',
    cardDesc: 'Menghubungkan karya unggulan daerah langsung ke pembeli nasional tanpa hambatan rantai pasok'
  }
]
