import { DEFAULT_PLATFORM_REGION } from '@/config/platform';
import { ALL_BANYUWANGI_DISTRICTS } from '@/components/directory/directoryDistricts';

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Extracts latitude and longitude from Google Maps URL patterns.
 * Supports:
 * - Direct query params: ?q=-8.2192,114.3692
 * - Place path with zoom: /@-8.2192,114.3692,15z
 * - Embed / place data params: !3d-8.2208!4d114.1587
 * - Center params: ?ll=-8.2192,114.3692
 */
export function extractCoordinatesFromUrl(urlStr?: string | null): Coordinates | null {
  if (!urlStr || typeof urlStr !== 'string') return null;

  const qMatch = urlStr.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) {
    return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
  }

  const atMatch = urlStr.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  }

  const dMatch = urlStr.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (dMatch) {
    return { lat: parseFloat(dMatch[1]), lng: parseFloat(dMatch[2]) };
  }

  const llMatch = urlStr.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (llMatch) {
    return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  }

  return null;
}

/**
 * Matches district name against known Banyuwangi administrative districts.
 */
export function findDistrictCoordinates(districtName?: string | null): Coordinates | null {
  if (!districtName || typeof districtName !== 'string') return null;
  const normalized = districtName.toLowerCase().replace(/^(kecamatan|kec\.)\s+/i, '').trim();

  const found = ALL_BANYUWANGI_DISTRICTS.find((d) => {
    const dNorm = d.name.toLowerCase().replace(/\s*\(kota\)/i, '').trim();
    return dNorm === normalized || d.name.toLowerCase() === normalized;
  });

  return found ? { lat: found.lat, lng: found.lng } : null;
}

/**
 * Searches address text for known district names.
 * Avoids false matches from "Kab. Banyuwangi" by checking specific districts first.
 */
export function findCoordinatesInAddress(address?: string | null): Coordinates | null {
  if (!address || typeof address !== 'string') return null;

  const addrClean = address
    .replace(/\b(kab\.|kabupaten)\s+banyuwangi\b/gi, '')
    .replace(/\bjawa\s+timur\b/gi, '')
    .trim();

  // 1. Check specific districts first
  for (const district of ALL_BANYUWANGI_DISTRICTS) {
    if (district.name.toLowerCase().includes('banyuwangi')) continue;
    const cleanName = district.name.toLowerCase();
    const regex = new RegExp(`\\b(kec\\.?|kecamatan\\s+)?${cleanName}\\b`, 'i');
    if (regex.test(addrClean)) {
      return { lat: district.lat, lng: district.lng };
    }
  }

  // 2. Check for Banyuwangi Kota if specifically referenced
  const cityDistrict = ALL_BANYUWANGI_DISTRICTS.find((d) => d.name.toLowerCase().includes('banyuwangi'));
  if (cityDistrict) {
    const cityRegex = /\b(kec\.?|kecamatan\s+)?banyuwangi(\s+kota)?\b/i;
    if (cityRegex.test(addrClean)) {
      return { lat: cityDistrict.lat, lng: cityDistrict.lng };
    }
  }

  return null;
}

/**
 * Resolves short links (e.g. maps.app.goo.gl) by following redirect headers.
 */
export async function resolveGoogleMapsCoordinates(googleMapsUrl?: string | null): Promise<Coordinates | null> {
  if (!googleMapsUrl || typeof googleMapsUrl !== 'string') return null;

  const direct = extractCoordinatesFromUrl(googleMapsUrl);
  if (direct) return direct;

  const isShortLink = googleMapsUrl.includes('goo.gl') || googleMapsUrl.includes('maps.app.goo.gl');
  if (isShortLink) {
    try {
      const res = await fetch(googleMapsUrl, {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(3500),
      });
      const resolvedFromHead = extractCoordinatesFromUrl(res.url);
      if (resolvedFromHead) return resolvedFromHead;

      if (!res.ok) {
        const getRes = await fetch(googleMapsUrl, {
          method: 'GET',
          redirect: 'follow',
          signal: AbortSignal.timeout(3500),
        });
        const resolvedFromGet = extractCoordinatesFromUrl(getRes.url);
        if (resolvedFromGet) return resolvedFromGet;
      }
    } catch {
      // safe fallback on network timeout or fetch error
    }
  }

  return null;
}

/**
 * High-level coordinate resolution pipeline for stores.
 * Evaluates: Maps URL -> Short URL -> District Name -> Address String -> Regional Center Fallback.
 */
export async function resolveStoreCoordinates(params: {
  googleMapsUrl?: string | null;
  address?: string | null;
  district?: string | null;
}): Promise<Coordinates> {
  if (params.googleMapsUrl) {
    const fromUrl = await resolveGoogleMapsCoordinates(params.googleMapsUrl);
    if (fromUrl) return fromUrl;
  }

  if (params.district) {
    const fromDistrict = findDistrictCoordinates(params.district);
    if (fromDistrict) return fromDistrict;
  }

  if (params.address) {
    const fromAddress = findCoordinatesInAddress(params.address);
    if (fromAddress) return fromAddress;
  }

  return {
    lat: DEFAULT_PLATFORM_REGION.center.lat,
    lng: DEFAULT_PLATFORM_REGION.center.lng,
  };
}
