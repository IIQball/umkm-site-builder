export function extractSubdomain(
  host: string,
  mainDomain: string
): string | null {
  if (!host || !mainDomain) {
    return null;
  }

  const trimmedHost = host.toLowerCase().trim();
  const trimmedMainDomain = mainDomain.toLowerCase().trim();

  if (trimmedHost === trimmedMainDomain) {
    return null;
  }

  if (trimmedHost.startsWith('127.0.0.1') || trimmedHost.startsWith('localhost')) {
    return null;
  }

  // Hanya host yang benar-benar berada di bawah mainDomain yang dianggap subdomain tenant
  if (!trimmedHost.endsWith(`.${trimmedMainDomain}`)) {
    return null;
  }

  const subdomain = trimmedHost.slice(0, -(trimmedMainDomain.length + 1));

  // Tolak subdomain bertingkat (a.b.mainDomain)
  return subdomain.includes('.') ? null : subdomain;
}
