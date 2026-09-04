/**
 * Smoothly scrolls the canvas preview container to the targeted section or sub-node.
 */
export function scrollToCanvasElement(sectionId: string, nodeId?: string | null): void {
  if (typeof document === 'undefined') return;

  let targetEl: HTMLElement | null = null;

  if (nodeId) {
    // 1. Try explicit sub-node ID
    targetEl = document.getElementById(`node-${sectionId}-${nodeId}`);

    // 2. Try scoped node data-attribute or sub-node class within section container
    if (!targetEl) {
      const sectionContainer = document.getElementById(`section-${sectionId}`) || document.getElementById(sectionId);
      if (sectionContainer) {
        targetEl =
          sectionContainer.querySelector<HTMLElement>(`[data-node-id="${nodeId}"]`) ||
          sectionContainer.querySelector<HTMLElement>(`[data-node="${nodeId}"]`);
      }
    }
  }

  // 3. Fallback to section element container
  if (!targetEl) {
    targetEl = document.getElementById(`section-${sectionId}`) || document.getElementById(sectionId);
  }

  if (targetEl) {
    targetEl.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }
}
