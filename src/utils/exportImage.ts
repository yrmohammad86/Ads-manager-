import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

export interface ExportImageOptions {
  fileName?: string;
  pixelRatio?: number;
  quality?: number;
  backgroundColor?: string;
  triggerConfetti?: boolean;
}

/**
 * Downloads an HTML element as a high-resolution PNG image.
 */
export async function exportElementAsPng(
  element: HTMLElement | null,
  options: ExportImageOptions = {}
): Promise<{ success: boolean; dataUrl?: string; error?: string }> {
  if (!element) {
    return { success: false, error: 'العنصر المراد تصديره غير موجود.' };
  }

  const {
    fileName = `AdCraft-Preview-${Date.now()}.png`,
    pixelRatio = 2,
    quality = 0.98,
    backgroundColor = '#09090b',
    triggerConfetti = true,
  } = options;

  try {
    // Primary attempt: high-res 2x with cache busting
    const dataUrl = await toPng(element, {
      pixelRatio,
      quality,
      backgroundColor,
      cacheBust: true,
      filter: (node) => {
        if (node instanceof HTMLElement && node.classList?.contains('no-export')) {
          return false;
        }
        return true;
      },
    });

    // Create download link
    const link = document.createElement('a');
    link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (triggerConfetti) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore confetti errors
      }
    }

    return { success: true, dataUrl };
  } catch (err: unknown) {
    console.warn('First export attempt encountered an issue, retrying with fallback settings...', err);
    try {
      // Fallback attempt: 1x standard resolution without cacheBust
      const fallbackDataUrl = await toPng(element, {
        pixelRatio: 1,
        quality: 0.95,
        backgroundColor,
      });

      const link = document.createElement('a');
      link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
      link.href = fallbackDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (triggerConfetti) {
        try {
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.7 },
          });
        } catch {
          // ignore
        }
      }

      return { success: true, dataUrl: fallbackDataUrl };
    } catch (fallbackErr: unknown) {
      console.error('Export failed completely:', fallbackErr);
      const errorMessage = fallbackErr instanceof Error ? fallbackErr.message : 'فشل تصدير الصورة.';
      return { success: false, error: errorMessage };
    }
  }
}
