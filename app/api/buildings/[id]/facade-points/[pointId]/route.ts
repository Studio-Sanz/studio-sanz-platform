import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PATCH /api/buildings/[id]/facade-points/[pointId]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; pointId: string }> }
) {
  try {
    const { pointId } = await params
    const body = await request.json()
    const {
      name,
      x,
      y,
      images,
      tour3dUrl,
      floorPlan,
      brochure,
      viewImages,
      totalArea,
      internalArea,
      externalArea,
      bedrooms,
      bathrooms,
      hasBalcony,
      hasLaundry,
      hasTerrace,
      hasGameRoom,
    } = body

    const facadePoint = await prisma.facadePoint.update({
      where: { id: pointId },
      data: {
        name,
        x,
        y,
        images: images || [],
        tour3dUrl: tour3dUrl || null,
        floorPlan: floorPlan || null,
        brochure: brochure || null,
        viewImages: viewImages || [],
        totalArea: totalArea || null,
        internalArea: internalArea || null,
        externalArea: externalArea || null,
        bedrooms: bedrooms || null,
        bathrooms: bathrooms || null,
        hasBalcony: hasBalcony ?? false,
        hasLaundry: hasLaundry ?? false,
        hasTerrace: hasTerrace ?? false,
        hasGameRoom: hasGameRoom ?? false,
      },
    })

    return NextResponse.json(facadePoint)
  } catch (error) {
    console.error("Error updating facade point:", error)
    return NextResponse.json(
      { error: "Failed to update facade point" },
      { status: 500 }
    )
  }
}

// DELETE /api/buildings/[id]/facade-points/[pointId]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; pointId: string }> }
) {
  try {
    const { pointId } = await params

    await prisma.facadePoint.delete({
      where: { id: pointId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting facade point:", error)
    return NextResponse.json(
      { error: "Failed to delete facade point" },
      { status: 500 }
    )
  }
}
