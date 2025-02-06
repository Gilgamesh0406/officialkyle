import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const filename = `ticket-${timestamp}-${file.name}`;
    const path = join(process.cwd(), "public/uploads", filename);

    // Save file
    await writeFile(path, buffer);

    return NextResponse.json({
      success: true,
      filename: `${SITE_URL}/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
