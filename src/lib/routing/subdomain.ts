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

  const hostParts = trimmedHost.split('.');
  const mainDomainParts = trimmedMainDomain.split('.');

  if (hostParts.length > mainDomainParts.length) {
    return hostParts[0];
  }

  return null;
}
