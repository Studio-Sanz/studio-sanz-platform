import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { publicId } = body

    // Add .pdf extension back
    const fullPublicId = `${publicId}.pdf`

    // Generate signed URL using Cloudinary's built-in method
    const signedUrl = cloudinary.url(fullPublicId, {
      resource_type: "raw",
      type: "upload",
      sign_url: true,
      secure: true,
    })

    return NextResponse.json({ signedUrl })
  } catch (error) {
    console.error("Error generating signed URL:", error)
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    )
  }
}
