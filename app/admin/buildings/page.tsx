"use client"

import { useState, useEffect } from "react"
import { Plus, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import { ImageUpload } from "@/components/image-upload"

interface Building {
  id: string
  name: string
  slug: string
  mainImage: string | null
  logo: string | null
  createdAt: string
}

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [mainImage, setMainImage] = useState<string>("")
  const [logo, setLogo] = useState<string>("")

  // Fetch buildings
  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    try {
      const response = await fetch("/api/buildings")
      const data = await response.json()
      setBuildings(data)
    } catch (error) {
      console.error("Error fetching buildings:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/buildings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          mainImage,
          logo,
        }),
      })

      if (response.ok) {
        // Reset form
        setName("")
        setMainImage("")
        setLogo("")
        setIsCreateModalOpen(false)

        // Refresh buildings list
        fetchBuildings()
      }
    } catch (error) {
      console.error("Error creating building:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Buildings</h2>
          <p className="text-muted-foreground">
            Manage your real estate properties
          </p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Building</DialogTitle>
              <DialogDescription>
                Add a new building to your portfolio
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Building Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Melia Miami Brickell"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Main Image</Label>
                <ImageUpload
                  value={mainImage}
                  onChange={setMainImage}
                  label="Upload Main Image"
                />
              </div>

              <div className="space-y-2">
                <Label>Logo</Label>
                <ImageUpload
                  value={logo}
                  onChange={setLogo}
                  label="Upload Logo"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !name}>
                  {isLoading ? "Creating..." : "Create Building"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {buildings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No buildings yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first building
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Building
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {buildings.map((building) => (
            <Link key={building.id} href={`/admin/buildings/${building.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  {building.mainImage && (
                    <div className="relative w-full h-48">
                      <Image
                        src={building.mainImage}
                        alt={building.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      {building.logo && (
                        <div className="relative w-12 h-12">
                          <Image
                            src={building.logo}
                            alt={`${building.name} logo`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{building.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          /{building.slug}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
