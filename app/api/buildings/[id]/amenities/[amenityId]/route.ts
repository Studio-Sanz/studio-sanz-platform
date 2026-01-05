import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// DELETE /api/buildings/[id]/amenities/[amenityId]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; amenityId: string }> }
) {
  try {
    const { amenityId } = await params

    await prisma.amenity.delete({
      where: { id: amenityId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting amenity:", error)
    return NextResponse.json(
      { error: "Failed to delete amenity" },
      { status: 500 }
    )
  }
}
