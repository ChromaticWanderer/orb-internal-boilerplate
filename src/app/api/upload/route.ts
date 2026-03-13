import { NextResponse } from "next/server";
import { generatePresignedUploadUrl } from "@/lib/upload/presigned";
import { requireUser } from "@/lib/auth/workos-auth";

export async function POST(request: Request) {
  try {
    // Ensure user is authenticated (throws if not)
    const user = await requireUser();
    const { fileName, contentType } = await request.json();

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "fileName and contentType are required" },
        { status: 400 }
      );
    }

    // Generate a unique key to avoid collisions
    const timestamp = Date.now();
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `uploads/${user.id}/${timestamp}-${sanitizedName}`;

    const { url } = await generatePresignedUploadUrl(key, contentType);

    return NextResponse.json({ url, key });
  } catch (error) {
    console.error("Failed to generate presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
