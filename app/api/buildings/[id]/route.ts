import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/buildings/[id] - Get a single building
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const building = await prisma.building.findUnique({
      where: { id },
      include: {
        facadePoints: {
          orderBy: { createdAt: "asc" },
        },
        amenities: {
          orderBy: { order: "asc" },
        },
      },
    })

    if (!building) {
      return NextResponse.json(
        { error: "Building not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(building)
  } catch (error) {
    console.error("Error fetching building:", error)
    return NextResponse.json(
      { error: "Failed to fetch building" },
      { status: 500 }
    )
  }
}

// PATCH /api/buildings/[id] - Update a building
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const building = await prisma.building.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(building)
  } catch (error) {
    console.error("Error updating building:", error)
    return NextResponse.json(
      { error: "Failed to update building" },
      { status: 500 }
    )
  }
}

// DELETE /api/buildings/[id] - Delete a building
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.building.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting building:", error)
    return NextResponse.json(
      { error: "Failed to delete building" },
      { status: 500 }
    )
  }
}
