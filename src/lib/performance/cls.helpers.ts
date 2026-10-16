/**
 * CLS (Cumulative Layout Shift) Optimization Helper
 * Mencegah layout shifts pada storefront rendering
 * 
 * H14 Frontend Optimization:
 * - Reserve space untuk images sebelum loaded
 * - Set explicit heights/widths pada containers
 * - Defer non-critical layout updates
 * - Monitor CLS metrics
 */

/**
 * Generate inline style untuk image containers
 * Prevents layout shift ketika image di-load
 */
export function getImageContainerStyle(
  aspectRatio: string = '16 / 9',
  width: string = '100%'
): string {
  return `
    width: ${width};
    aspect-ratio: ${aspectRatio};
    background-color: var(--color-skeleton, #f0f0f0);
    overflow: hidden;
  `;
}

/**
 * Generate inline style untuk product card
 * Reserve space untuk semua elements
 */
export function getProductCardStyle(): string {
  return `
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 350px;
  `;
}

/**
 * Generate inline style untuk hero section
 * Prevents shifts saat Google Fonts loaded
 */
export function getHeroSectionStyle(): string {
  return `
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  `;
}

/**
 * Placeholder skeleton style untuk images
 */
export function getSkeletonStyle(height: string = '200px'): string {
  return `
    height: ${height};
    background: linear-gradient(
      90deg,
      var(--color-skeleton, #f0f0f0) 25%,
      var(--color-skeleton-light, #e0e0e0) 50%,
      var(--color-skeleton, #f0f0f0) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  `;
}

/**
 * Keyframe animation untuk skeleton
 */
export function getSkeletonKeyframes(): string {
  return `
    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
}

/**
 * Utility untuk set explicit dimensions pada elements
 * Prevents CLS dari dynamic content
 */
export interface ContainerDimensions {
  width: string | number;
  height: string | number;
  minHeight?: string | number;
}

export function getDimensionStyle(dims: ContainerDimensions): string {
  const styles: string[] = [];
  
  if (dims.width) {
    const widthValue = typeof dims.width === 'number' ? `${dims.width}px` : dims.width;
    styles.push(`width: ${widthValue}`);
  }
  
  if (dims.height) {
    const heightValue = typeof dims.height === 'number' ? `${dims.height}px` : dims.height;
    styles.push(`height: ${heightValue}`);
  }
  
  if (dims.minHeight) {
    const minValue = typeof dims.minHeight === 'number' ? `${dims.minHeight}px` : dims.minHeight;
    styles.push(`min-height: ${minValue}`);
  }
  
  return styles.join('; ');
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
  startTime: number;
}

/**
 * Monitor CLS via PerformanceObserver
 * Report shifts > threshold
 */
export function monitorCLS(threshold: number = 0.1): void {
  if (typeof window === 'undefined') return;
  
  let clsValue = 0;
  
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutEntry = entry as LayoutShiftEntry;
        if (layoutEntry.hadRecentInput) continue; // Ignore user-initiated shifts
        
        const shift = layoutEntry.value;
        clsValue += shift;
        
        if (shift > threshold) {
          console.warn(
            `[CLS] Layout shift detected: ${(shift * 100).toFixed(2)}% ` +
            `at ${new Date(layoutEntry.startTime).toISOString()}`
          );
        }
      }
      
      // Report cumulative if exceeds target
      if (clsValue > 0.1) {
        console.warn(`[CLS] Cumulative CLS: ${(clsValue * 100).toFixed(2)}%`);
      }
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (err) {
    console.warn('[CLS] PerformanceObserver not supported:', err);
  }
}

/**
 * Defer non-critical DOM updates
 * Reduce CLS dari layout recalculation
 */
export async function deferLayout(callback: () => void, delayMs: number = 0): Promise<void> {
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => callback(), { timeout: 2000 });
  } else {
    setTimeout(callback, 100);
  }
}

/**
 * Prevent CLS dari auto-expanding buttons/links
 */
export function getStableButtonStyle(minWidth: string = '100px'): string {
  return `
    min-width: ${minWidth};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  `;
}

/**
 * Create intersection observer untuk lazy-load below-the-fold content
 * Prevents CLS dari loading hidden elements
 */
export function createLazyLoadObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  });
}
