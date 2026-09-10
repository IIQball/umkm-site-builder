export interface SampleProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
}

export interface BusinessCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

export interface DirectoryStore {
  id: string;
  name: string;
  subdomain: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  waNumber: string;
  totalViews: number;
  totalWaClicks: number;
  logoUrl: string | null;
  distance: number | null;
  category: BusinessCategory | null;
  sampleProducts?: SampleProduct[];
}

export interface DirectoryMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}
