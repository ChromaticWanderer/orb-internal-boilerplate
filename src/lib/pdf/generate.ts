import ReactPDF from "@react-pdf/renderer";
import type { ReactElement } from "react";

/**
 * Render a React PDF document to a Buffer.
 *
 * @param document - A React element using @react-pdf/renderer components
 * @returns Buffer containing the rendered PDF
 */
export async function generatePdf(
  document: ReactElement
): Promise<Buffer> {
  const stream = await ReactPDF.renderToStream(document);

  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}
