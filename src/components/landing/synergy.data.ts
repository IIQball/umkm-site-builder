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
    stepBadge: '00 / JARINGAN TERPADU',
    headline: 'Ekosistem Terpadu',
    subtitle: 'Kolaborasi tiga sektor dalam satu wadah',
    cardDesc: 'Menghubungkan pelaku usaha, desainer, dan pembeli secara langsung'
  },
  {
    id: 'stage-1',
    targetPin: 'Pin_Anyaman',
    roleLabel: 'Pelaku Usaha',
    camera: { x: 0.0093, y: 0.0163, z: 0.0308 },
    lookAt: { x: 0.0041, y: 0.0016, z: 0.0076 },
    stepBadge: '01 / TOKO MANDIRI',
    headline: 'Toko Mandiri',
    subtitle: 'Kendali penuh atas produk dan pesanan',
    cardDesc: 'Pesanan diterima langsung oleh pemilik usaha dengan keuntungan utuh tanpa potongan komisi'
  },
  {
    id: 'stage-2',
    targetPin: 'Pin_Batik',
    roleLabel: 'Desainer Kreatif',
    camera: { x: 0.0256, y: 0.0234, z: -0.0058 },
    lookAt: { x: 0.0031, y: 0.0018, z: 0.0013 },
    stepBadge: '02 / DESAIN KREATIF',
    headline: 'Desain Profesional',
    subtitle: 'Tampilan visual modern siap pakai',
    cardDesc: 'Kolaborasi karya desainer lokal dengan sistem royalti yang transparan'
  },
  {
    id: 'stage-3',
    targetPin: 'Pin_Kopi',
    roleLabel: 'Pembeli & Pasar',
    camera: { x: -0.0285, y: 0.0141, z: -0.0138 },
    lookAt: { x: -0.0086, y: 0.0025, z: -0.0111 },
    stepBadge: '03 / JANGKAUAN PASAR',
    headline: 'Jangkauan Luas',
    subtitle: 'Belanja langsung dari produsen asli',
    cardDesc: 'Akses pembelian produk khas daerah tangan pertama tanpa biaya perantara'
  }
]