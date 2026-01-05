import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/buildings/[id]/facade-points - Create facade point
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const facadePoint = await prisma.facadePoint.create({
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
        buildingId: id,
      },
    })

    return NextResponse.json(facadePoint, { status: 201 })
  } catch (error) {
    console.error("Error creating facade point:", error)
    return NextResponse.json(
      { error: "Failed to create facade point" },
      { status: 500 }
    )
  }
}
