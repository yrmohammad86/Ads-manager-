import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

export interface ExportPdfOptions {
  fileName?: string;
  triggerConfetti?: boolean;
  pixelRatio?: number;
}

/**
 * Exports an HTML element as an official A4 portrait PDF document using jsPDF.
 * Handles exact A4 sizing (210mm x 297mm) and multi-page partitioning if content exceeds 1 page.
 */
export async function exportElementAsA4Pdf(
  element: HTMLElement | null,
  options: ExportPdfOptions = {}
): Promise<{ success: boolean; error?: string }> {
  if (!element) {
    return { success: false, error: 'وثيقة التقرير غير متوفرة في الصفحة.' };
  }

  const {
    fileName = `AdCraft-Campaign-Brief-${Date.now()}.pdf`,
    triggerConfetti = true,
    pixelRatio = 2,
  } = options;

  try {
    // 1. Capture element to high-res PNG
    const imgDataUrl = await toPng(element, {
      pixelRatio,
      quality: 0.98,
      backgroundColor: '#ffffff',
      cacheBust: true,
      filter: (node) => {
        if (node instanceof HTMLElement && (node.classList?.contains('no-pdf') || node.classList?.contains('no-export'))) {
          return false;
        }
        return true;
      },
    });

    // 2. Initialize jsPDF in portrait A4 mode
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Calculate scaled image dimensions
    const imgProps = pdf.getImageProperties(imgDataUrl);
    const contentHeight = (imgProps.height * pageWidth) / imgProps.width;

    if (contentHeight <= pageHeight) {
      // Fits on a single A4 page
      pdf.addImage(imgDataUrl, 'PNG', 0, 0, pageWidth, contentHeight, undefined, 'FAST');
    } else {
      // Multi-page slicing for comprehensive campaign briefs
      let heightLeft = contentHeight;
      let position = 0;

      pdf.addImage(imgDataUrl, 'PNG', 0, position, pageWidth, contentHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 5) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgDataUrl, 'PNG', 0, position, pageWidth, contentHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
    }

    // 3. Save PDF
    const finalFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(finalFileName);

    // 4. Trigger celebration confetti
    if (triggerConfetti) {
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore confetti errors
      }
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('Error generating PDF:', err);
    const errorMsg = err instanceof Error ? err.message : 'تعذر توليد ملف الـ PDF.';
    return { success: false, error: errorMsg };
  }
}
