import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

export interface ExportPdfOptions {
  fileName?: string;
  triggerConfetti?: boolean;
  pixelRatio?: number;
  onProgress?: (current: number, total: number) => void;
}

/**
 * Exports multiple HTML elements as a single, multi-page A4 portrait PDF document.
 * Each element is cleanly rendered onto its own dedicated A4 page (210mm x 297mm).
 */
export async function exportMultipleElementsAsA4Pdf(
  elements: (HTMLElement | null)[],
  options: ExportPdfOptions = {}
): Promise<{ success: boolean; error?: string; pageCount?: number }> {
  const validElements = elements.filter((el): el is HTMLElement => el !== null);

  if (validElements.length === 0) {
    return { success: false, error: 'لم يتم العثور على صفحات لتصديرها في ملف الـ PDF.' };
  }

  const {
    fileName = `AdCraft-MultiCampaigns-Brief-${Date.now()}.pdf`,
    triggerConfetti = true,
    pixelRatio = 2,
    onProgress,
  } = options;

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
    let totalGeneratedPages = 0;

    for (let i = 0; i < validElements.length; i++) {
      const el = validElements[i];
      if (onProgress) {
        onProgress(i + 1, validElements.length);
      }

      // Add page for subsequent items
      if (totalGeneratedPages > 0) {
        pdf.addPage();
      }

      // Capture element to high-res PNG
      const imgDataUrl = await toPng(el, {
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

      const imgProps = pdf.getImageProperties(imgDataUrl);
      const contentHeight = (imgProps.height * pageWidth) / imgProps.width;

      if (contentHeight <= pageHeight) {
        // Fits perfectly on single A4 page
        pdf.addImage(imgDataUrl, 'PNG', 0, 0, pageWidth, contentHeight, undefined, 'FAST');
        totalGeneratedPages++;
      } else {
        // Multi-page slicing for this specific oversized element
        let heightLeft = contentHeight;
        let position = 0;

        pdf.addImage(imgDataUrl, 'PNG', 0, position, pageWidth, contentHeight, undefined, 'FAST');
        totalGeneratedPages++;
        heightLeft -= pageHeight;

        while (heightLeft > 5) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgDataUrl, 'PNG', 0, position, pageWidth, contentHeight, undefined, 'FAST');
          totalGeneratedPages++;
          heightLeft -= pageHeight;
        }
      }
    }

    const finalFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(finalFileName);

    if (triggerConfetti) {
      try {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore confetti errors
      }
    }

    return { success: true, pageCount: totalGeneratedPages };
  } catch (err: unknown) {
    console.error('Error generating multi-page PDF:', err);
    const errorMsg = err instanceof Error ? err.message : 'تعذر توليد ملف الـ PDF متعدد الصفحات.';
    return { success: false, error: errorMsg };
  }
}

/**
 * Exports an HTML element as an official A4 portrait PDF document using jsPDF.
 * If the element contains multiple children with class .adcraft-pdf-page,
 * it automatically delegates to exportMultipleElementsAsA4Pdf.
 */
export async function exportElementAsA4Pdf(
  element: HTMLElement | null,
  options: ExportPdfOptions = {}
): Promise<{ success: boolean; error?: string }> {
  if (!element) {
    return { success: false, error: 'وثيقة التقرير غير متوفرة في الصفحة.' };
  }

  // Check if element contains distinct multi-page child sections
  const multiPages = element.querySelectorAll<HTMLElement>('.adcraft-pdf-page');
  if (multiPages.length > 1) {
    return exportMultipleElementsAsA4Pdf(Array.from(multiPages), options);
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

