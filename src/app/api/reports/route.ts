import { NextResponse } from "next/server";
import { generatePdf } from "@/lib/pdf/generate";
import { ReportTemplate } from "@/lib/pdf/templates/report-template";
import { requireUser } from "@/lib/auth/workos-auth";
import { createElement } from "react";

export async function GET() {
  try {
    // Ensure user is authenticated (throws if not)
    const user = await requireUser();
    // Example report data — replace with your actual data fetching
    const reportElement = createElement(ReportTemplate, {
      title: "Sample Report",
      subtitle: `Generated for ${user.email}`,
      generatedAt: new Date().toISOString().split("T")[0],
      rows: [
        { label: "Total Items", value: "150" },
        { label: "Active Users", value: "42" },
        { label: "Revenue", value: "$12,500" },
        { label: "Growth", value: "+15%" },
      ],
    });

    const pdfBuffer = await generatePdf(reportElement);

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=report.pdf",
      },
    });
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
