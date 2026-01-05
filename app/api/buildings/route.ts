import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/buildings - List all buildings or get single building by slug
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    // If slug is provided, return single building with all relations
    if (slug) {
      const building = await prisma.building.findUnique({
        where: { slug },
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
    }

    // Otherwise return all buildings
    const buildings = await prisma.building.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        mainImage: true,
        logo: true,
        createdAt: true,
      },
    })

    return NextResponse.json(buildings)
  } catch (error) {
    console.error("Error fetching buildings:", error)
    return NextResponse.json(
      { error: "Failed to fetch buildings" },
      { status: 500 }
    )
  }
}

// POST /api/buildings - Create a new building
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, mainImage, logo } = body

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    // Check if slug already exists
    const existingBuilding = await prisma.building.findUnique({
      where: { slug },
    })

    if (existingBuilding) {
      // Add a number suffix if slug exists
      let counter = 1
      let newSlug = `${slug}-${counter}`

      while (await prisma.building.findUnique({ where: { slug: newSlug } })) {
        counter++
        newSlug = `${slug}-${counter}`
      }

      const building = await prisma.building.create({
        data: {
          name,
          slug: newSlug,
          mainImage,
          logo,
        },
      })

      return NextResponse.json(building, { status: 201 })
    }

    const building = await prisma.building.create({
      data: {
        name,
        slug,
        mainImage,
        logo,
      },
    })

    return NextResponse.json(building, { status: 201 })
  } catch (error) {
    console.error("Error creating building:", error)
    return NextResponse.json(
      { error: "Failed to create building" },
      { status: 500 }
    )
  }
}
