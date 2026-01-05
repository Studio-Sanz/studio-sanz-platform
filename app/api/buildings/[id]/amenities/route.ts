import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/buildings/[id]/amenities - Create amenity
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, image } = body

    const amenitiesCount = await prisma.amenity.count({
      where: { buildingId: id },
    })

    const amenity = await prisma.amenity.create({
      data: {
        name,
        image,
        order: amenitiesCount,
        buildingId: id,
      },
    })

    return NextResponse.json(amenity, { status: 201 })
  } catch (error) {
    console.error("Error creating amenity:", error)
    return NextResponse.json(
      { error: "Failed to create amenity" },
      { status: 500 }
    )
  }
}
