export interface PlatformRegionConfig {
  name: string;
  province: string;
  center: {
    lat: number;
    lng: number;
  };
  defaultZoom: number;
  defaultRadiusKm: number;
}

export const DEFAULT_PLATFORM_REGION: PlatformRegionConfig = {
  name: 'Kabupaten Banyuwangi',
  province: 'Jawa Timur',
  center: {
    lat: -8.2192,
    lng: 114.3692,
  },
  defaultZoom: 12,
  defaultRadiusKm: 10,
};
