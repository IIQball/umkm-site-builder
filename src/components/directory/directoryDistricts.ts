export interface DistrictOption {
  name: string;
  lat: number;
  lng: number;
  description?: string;
  popular?: boolean;
}

export const BANYUWANGI_POPULAR_DISTRICTS: DistrictOption[] = [
  { name: 'Songgon', lat: -8.2208, lng: 114.1588, description: 'Pusat Kuliner & Wisata Pinus', popular: true },
  { name: 'Banyuwangi (Kota)', lat: -8.2192, lng: 114.3692, description: 'Taman Blambangan & Pusat Kota', popular: true },
  { name: 'Rogojampi', lat: -8.3044, lng: 114.2921, description: 'Sentra UMKM & Akses Bandara', popular: true },
  { name: 'Genteng', lat: -8.3639, lng: 114.1511, description: 'Pusat Perdagangan & Pasar', popular: true },
  { name: 'Giri', lat: -8.2045, lng: 114.3312, description: 'Pendidikan & Perkantoran', popular: true },
  { name: 'Glagah', lat: -8.2285, lng: 114.3168, description: 'Desa Adat Kemiren & Kopi', popular: true },
  { name: 'Srono', lat: -8.3986, lng: 114.2588, description: 'Jalur Lintas & Niaga', popular: true },
];

export const ALL_BANYUWANGI_DISTRICTS: DistrictOption[] = [
  { name: 'Bangorejo', lat: -8.4878, lng: 114.1537 },
  { name: 'Banyuwangi (Kota)', lat: -8.2192, lng: 114.3692 },
  { name: 'Blimbingsari', lat: -8.3308, lng: 114.3411 },
  { name: 'Cluring', lat: -8.4312, lng: 114.2274 },
  { name: 'Gambiran', lat: -8.4115, lng: 114.1352 },
  { name: 'Genteng', lat: -8.3639, lng: 114.1511 },
  { name: 'Giri', lat: -8.2045, lng: 114.3312 },
  { name: 'Glagah', lat: -8.2285, lng: 114.3168 },
  { name: 'Glenmore', lat: -8.3126, lng: 114.0492 },
  { name: 'Kabat', lat: -8.2618, lng: 114.3382 },
  { name: 'Kalibaru', lat: -8.2954, lng: 113.9856 },
  { name: 'Kalipuro', lat: -8.1462, lng: 114.3725 },
  { name: 'Licin', lat: -8.2167, lng: 114.2556 },
  { name: 'Muncar', lat: -8.4333, lng: 114.3333 },
  { name: 'Pesanggaran', lat: -8.5614, lng: 114.0792 },
  { name: 'Purwoharjo', lat: -8.5032, lng: 114.2194 },
  { name: 'Rogojampi', lat: -8.3044, lng: 114.2921 },
  { name: 'Sempu', lat: -8.2917, lng: 114.1624 },
  { name: 'Siliragung', lat: -8.5412, lng: 114.1205 },
  { name: 'Singojuruh', lat: -8.2583, lng: 114.2185 },
  { name: 'Songgon', lat: -8.2208, lng: 114.1588 },
  { name: 'Srono', lat: -8.3986, lng: 114.2588 },
  { name: 'Tegaldlimo', lat: -8.5447, lng: 114.2861 },
  { name: 'Tegalsari', lat: -8.4552, lng: 114.1235 },
  { name: 'Wongsorejo', lat: -7.9542, lng: 114.3985 },
];
