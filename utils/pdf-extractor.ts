/**
 * Client-side PDF text extraction utility
 * Uses PDF.js to extract text from PDF files before sending to API
 */

/**
 * Extract text from a PDF file
 * @param file - PDF File object
 * @returns Extracted text as a string
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  // Only run in browser
  if (typeof window === "undefined") {
    throw new Error("PDF extraction must run in the browser");
  }

  try {
    // Dynamically import pdfjs-dist only when needed (client-side only)
    const pdfjsLib = await import("pdfjs-dist");

    // Configure PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine all text items from the page
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");

      fullText += pageText + "\n\n";
    }

    return fullText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF file");
  }
}

/**
 * Validate file size and type before processing
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10MB)
 * @returns Validation result
 */
export function validateFile(
  file: File,
  maxSizeMB: number = 10
): { valid: boolean; error?: string } {
  // Check file type
  if (file.type !== "application/pdf") {
    return {
      valid: false,
      error: "Invalid file type. Please upload a PDF file.",
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit.`,
    };
  }

  return { valid: true };
}

/**
 * Validate text length before sending to API
 * @param text - Text to validate
 * @param maxLength - Maximum character length (default: 15000)
 * @returns Validation result
 */
export function validateTextLength(
  text: string,
  maxLength: number = 15000
): { valid: boolean; error?: string } {
  // Check if text is empty
  if (!text || text.trim().length === 0) {
    return {
      valid: false,
      error: "Please provide some text to analyze.",
    };
  }

  // Check if text exceeds maximum length
  if (text.length > maxLength) {
    return {
      valid: false,
      error: `Text exceeds maximum length of ${maxLength} characters.`,
    };
  }

  return { valid: true };
}

