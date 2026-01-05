"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Upload, MapPin, Phone, Mail, Globe, Plus, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ImageUpload } from "@/components/image-upload"
import { VideoUpload } from "@/components/video-upload"
import { PDFUpload } from "@/components/pdf-upload"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

interface Building {
  id: string
  name: string
  slug: string
  mainImage: string | null
  logo: string | null
  latitude: number | null
  longitude: number | null
  address: string | null
  whatsapp: string | null
  phone: string | null
  email: string | null
  website: string | null
  initialVideo: string | null
  facadeImage: string | null
  brochure: string | null
  facadePoints: FacadePoint[]
  amenities: Amenity[]
}

interface FacadePoint {
  id: string
  name: string
  x: number
  y: number
  images: string[]
  tour3dUrl: string | null
  floorPlan: string | null
  brochure: string | null
  viewImages: string[]
  // Installation details
  totalArea: number | null
  internalArea: number | null
  externalArea: number | null
  bedrooms: number | null
  bathrooms: number | null
  hasBalcony: boolean
  hasLaundry: boolean
  hasTerrace: boolean
  hasGameRoom: boolean
}

interface Amenity {
  id: string
  name: string
  image: string | null
  order: number
}

export default function BuildingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const buildingId = params.id as string

  const [building, setBuilding] = useState<Building | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Facade point modal state
  const [isAddingPoint, setIsAddingPoint] = useState(false)
  const [editingPoint, setEditingPoint] = useState<FacadePoint | null>(null)
  const [newPoint, setNewPoint] = useState({
    name: "",
    x: 0,
    y: 0,
    images: [] as string[],
    tour3dUrl: "",
    floorPlan: "",
    brochure: "",
    viewImages: [] as string[],
    totalArea: null as number | null,
    internalArea: null as number | null,
    externalArea: null as number | null,
    bedrooms: null as number | null,
    bathrooms: null as number | null,
    hasBalcony: false,
    hasLaundry: false,
    hasTerrace: false,
    hasGameRoom: false,
  })

  // Amenity modal state
  const [isAddingAmenity, setIsAddingAmenity] = useState(false)
  const [newAmenity, setNewAmenity] = useState({
    name: "",
    image: "",
  })

  // Facade click confirmation state
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    fetchBuilding()
  }, [buildingId])

  const fetchBuilding = async () => {
    try {
      const response = await fetch(`/api/buildings/${buildingId}`)
      const data = await response.json()
      setBuilding(data)
    } catch (error) {
      console.error("Error fetching building:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateBuilding = async (updates: Partial<Building>) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/buildings/${buildingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        fetchBuilding()
      }
    } catch (error) {
      console.error("Error updating building:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!building?.facadeImage) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setClickPosition({ x, y })
    setShowConfirmation(true)
  }

  const confirmAddPoint = () => {
    if (clickPosition) {
      setNewPoint({ ...newPoint, x: clickPosition.x, y: clickPosition.y })
      setShowConfirmation(false)
      setClickPosition(null)
      setIsAddingPoint(true)
    }
  }

  const cancelAddPoint = () => {
    setShowConfirmation(false)
    setClickPosition(null)
  }

  const resetPointForm = () => {
    setNewPoint({
      name: "",
      x: 0,
      y: 0,
      images: [],
      tour3dUrl: "",
      floorPlan: "",
      brochure: "",
      viewImages: [],
      totalArea: null,
      internalArea: null,
      externalArea: null,
      bedrooms: null,
      bathrooms: null,
      hasBalcony: false,
      hasLaundry: false,
      hasTerrace: false,
      hasGameRoom: false,
    })
    setEditingPoint(null)
  }

  const addFacadePoint = async () => {
    try {
      const url = editingPoint
        ? `/api/buildings/${buildingId}/facade-points/${editingPoint.id}`
        : `/api/buildings/${buildingId}/facade-points`

      const response = await fetch(url, {
        method: editingPoint ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPoint),
      })

      if (response.ok) {
        setIsAddingPoint(false)
        resetPointForm()
        fetchBuilding() // Refresh to show new/updated point
      }
    } catch (error) {
      console.error("Error saving facade point:", error)
    }
  }

  const editPoint = (point: FacadePoint) => {
    setNewPoint({
      name: point.name,
      x: point.x,
      y: point.y,
      images: point.images || [],
      tour3dUrl: point.tour3dUrl || "",
      floorPlan: point.floorPlan || "",
      brochure: point.brochure || "",
      viewImages: point.viewImages || [],
      totalArea: point.totalArea,
      internalArea: point.internalArea,
      externalArea: point.externalArea,
      bedrooms: point.bedrooms,
      bathrooms: point.bathrooms,
      hasBalcony: point.hasBalcony,
      hasLaundry: point.hasLaundry,
      hasTerrace: point.hasTerrace,
      hasGameRoom: point.hasGameRoom,
    })
    setEditingPoint(point)
    setIsAddingPoint(true)
  }

  const addAmenity = async () => {
    try {
      const response = await fetch(`/api/buildings/${buildingId}/amenities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAmenity),
      })

      if (response.ok) {
        setIsAddingAmenity(false)
        setNewAmenity({ name: "", image: "" })
        fetchBuilding() // Refresh to show new amenity
      }
    } catch (error) {
      console.error("Error adding amenity:", error)
    }
  }

  const deleteBuilding = async () => {
    if (!confirm("Are you sure you want to delete this building?")) return

    try {
      await fetch(`/api/buildings/${buildingId}`, {
        method: "DELETE",
      })
      router.push("/admin/buildings")
    } catch (error) {
      console.error("Error deleting building:", error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!building) {
    return <div>Building not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/buildings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{building.name}</h2>
            <p className="text-muted-foreground">/{building.slug}</p>
          </div>
        </div>
        <Button variant="destructive" onClick={deleteBuilding}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Main Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Main Information</CardTitle>
          <CardDescription>Basic details about the building</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Image */}
            <div className="space-y-2">
              <Label>Main Image</Label>
              <ImageUpload
                value={building.mainImage || ""}
                onChange={(url) => updateBuilding({ mainImage: url })}
                label="Upload Main Image"
              />
            </div>

            {/* Logo */}
            <div className="space-y-2">
              <Label>Logo</Label>
              <ImageUpload
                value={building.logo || ""}
                onChange={(url) => updateBuilding({ logo: url })}
                label="Upload Logo"
              />
            </div>
          </div>

          <Separator />

          {/* Name and URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Building Name</Label>
              <Input
                id="name"
                value={building.name}
                onChange={(e) =>
                  setBuilding({ ...building, name: e.target.value })
                }
                onBlur={() => updateBuilding({ name: building.name })}
              />
            </div>
            <div className="space-y-2">
              <Label>URL Slug</Label>
              <Input value={building.slug} disabled className="bg-muted" />
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={building.latitude || ""}
                  onChange={(e) =>
                    setBuilding({
                      ...building,
                      latitude: parseFloat(e.target.value) || null,
                    })
                  }
                  onBlur={() => updateBuilding({ latitude: building.latitude })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={building.longitude || ""}
                  onChange={(e) =>
                    setBuilding({
                      ...building,
                      longitude: parseFloat(e.target.value) || null,
                    })
                  }
                  onBlur={() =>
                    updateBuilding({ longitude: building.longitude })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={building.address || ""}
                  onChange={(e) =>
                    setBuilding({ ...building, address: e.target.value })
                  }
                  onBlur={() => updateBuilding({ address: building.address })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={building.whatsapp || ""}
                  onChange={(e) =>
                    setBuilding({ ...building, whatsapp: e.target.value })
                  }
                  onBlur={() => updateBuilding({ whatsapp: building.whatsapp })}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={building.phone || ""}
                  onChange={(e) =>
                    setBuilding({ ...building, phone: e.target.value })
                  }
                  onBlur={() => updateBuilding({ phone: building.phone })}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={building.email || ""}
                  onChange={(e) =>
                    setBuilding({ ...building, email: e.target.value })
                  }
                  onBlur={() => updateBuilding({ email: building.email })}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={building.website || ""}
                  onChange={(e) =>
                    setBuilding({ ...building, website: e.target.value })
                  }
                  onBlur={() => updateBuilding({ website: building.website })}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Initial Video Section */}
      <Card>
        <CardHeader>
          <CardTitle>Initial Video</CardTitle>
          <CardDescription>
            Recommended: 5 seconds duration with last frame matching facade photo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VideoUpload
            value={building.initialVideo || ""}
            onChange={(url) => updateBuilding({ initialVideo: url })}
            label="Upload Initial Video"
            maxSizeMB={100}
          />
        </CardContent>
      </Card>

      {/* Facade Photo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Facade Photo</CardTitle>
          <CardDescription>
            Upload facade photo and click to add interactive points
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!building.facadeImage ? (
            <ImageUpload
              value={building.facadeImage || ""}
              onChange={(url) => updateBuilding({ facadeImage: url })}
              label="Upload Facade Photo"
            />
          ) : (
            <>
              <div className="relative">
                <div
                  className="relative w-full h-[500px] cursor-crosshair border-2 border-dashed border-muted-foreground/20 rounded-lg overflow-hidden"
                  onClick={handleImageClick}
                >
                  <Image
                    src={building.facadeImage}
                    alt="Facade"
                    fill
                    className="object-contain"
                  />
                  {building.facadePoints.map((point) => (
                    <div
                      key={point.id}
                      className="absolute w-5 h-5 bg-primary rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-150 transition-transform animate-pulse"
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                      title={point.name}
                    />
                  ))}

                  {showConfirmation && clickPosition && (
                    <div
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${clickPosition.x}%`, top: `${clickPosition.y}%` }}
                    >
                      <div className="bg-white rounded-lg shadow-xl border-2 border-primary p-4 min-w-[250px]">
                        <p className="text-sm font-medium mb-3">¿Desea agregar un punto aquí?</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              confirmAddPoint()
                            }}
                          >
                            Sí, agregar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              cancelAddPoint()
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="absolute top-2 right-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => updateBuilding({ facadeImage: "" })}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cambiar foto
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Haz click en la imagen para agregar puntos interactivos
              </p>

              {/* Points Carousel */}
              {building.facadePoints.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Puntos Agregados ({building.facadePoints.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {building.facadePoints.map((point) => (
                      <Card
                        key={point.id}
                        className="overflow-hidden hover:shadow-md transition-shadow group relative cursor-pointer"
                        onClick={() => editPoint(point)}
                      >
                        <CardContent className="p-3">
                          {point.images && point.images.length > 0 && (
                            <div className="relative w-full h-32 mb-3 rounded-md overflow-hidden">
                              {point.images.length === 1 ? (
                                <Image
                                  src={point.images[0]}
                                  alt={point.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <Swiper
                                  modules={[Navigation, Pagination]}
                                  navigation
                                  pagination={{ clickable: true }}
                                  className="h-full w-full"
                                  style={{
                                    // @ts-ignore
                                    "--swiper-navigation-size": "20px",
                                    "--swiper-navigation-color": "#fff",
                                    "--swiper-pagination-color": "#fff",
                                    "--swiper-pagination-bullet-inactive-color": "#fff",
                                    "--swiper-pagination-bullet-inactive-opacity": "0.5",
                                  }}
                                >
                                  {point.images.map((image, idx) => (
                                    <SwiperSlide key={idx}>
                                      <div className="relative w-full h-32">
                                        <Image
                                          src={image}
                                          alt={`${point.name} - ${idx + 1}`}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    </SwiperSlide>
                                  ))}
                                </Swiper>
                              )}
                            </div>
                          )}
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <MapPin className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{point.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                Position: {point.x.toFixed(1)}%, {point.y.toFixed(1)}%
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {point.images.length} {point.images.length === 1 ? 'foto' : 'fotos'}
                              </p>
                              {point.tour3dUrl && (
                                <a
                                  href={point.tour3dUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Ver tour 3D
                                </a>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={async (e) => {
                                e.stopPropagation()
                                if (confirm("¿Eliminar este punto?")) {
                                  await fetch(`/api/buildings/${buildingId}/facade-points/${point.id}`, {
                                    method: "DELETE",
                                  })
                                  fetchBuilding()
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Amenities Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Amenities</CardTitle>
              <CardDescription>Building amenities and features</CardDescription>
            </div>
            <Dialog open={isAddingAmenity} onOpenChange={setIsAddingAmenity}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Amenity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Amenity</DialogTitle>
                  <DialogDescription>Add a new amenity to the building</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amenity-name">Name</Label>
                    <Input
                      id="amenity-name"
                      value={newAmenity.name}
                      onChange={(e) =>
                        setNewAmenity({ ...newAmenity, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Image</Label>
                    <ImageUpload
                      value={newAmenity.image}
                      onChange={(url) => setNewAmenity({ ...newAmenity, image: url })}
                      label="Upload Amenity Image"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingAmenity(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={addAmenity} disabled={!newAmenity.name}>
                      Add Amenity
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {building.amenities.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No amenities added yet
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {building.amenities.map((amenity) => (
                <Card key={amenity.id} className="group relative hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {amenity.image && (
                      <div className="relative w-full h-32 mb-2">
                        <Image
                          src={amenity.image}
                          alt={amenity.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{amenity.name}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={async () => {
                          if (confirm("¿Eliminar esta amenidad?")) {
                            await fetch(`/api/buildings/${buildingId}/amenities/${amenity.id}`, {
                              method: "DELETE",
                            })
                            fetchBuilding()
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Brochure Section */}
      <Card>
        <CardHeader>
          <CardTitle>Brochure</CardTitle>
          <CardDescription>Upload building brochure (PDF)</CardDescription>
        </CardHeader>
        <CardContent>
          <PDFUpload
            value={building.brochure || ""}
            onChange={(url) => updateBuilding({ brochure: url })}
            label="Upload Brochure (PDF)"
          />
        </CardContent>
      </Card>

      {/* Facade Point Modal */}
      <Dialog open={isAddingPoint} onOpenChange={(open) => {
        setIsAddingPoint(open)
        if (!open) resetPointForm()
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPoint ? 'Editar' : 'Agregar'} Punto de Fachada</DialogTitle>
            <DialogDescription>
              {editingPoint ? 'Edita' : 'Agrega'} un punto interactivo en la fachada
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Point Name</Label>
              <Input
                value={newPoint.name}
                onChange={(e) =>
                  setNewPoint({ ...newPoint, name: e.target.value })
                }
                placeholder="e.g., Lobby Entrance"
              />
            </div>

            <div className="space-y-3">
              <Label>Photos (Max 5)</Label>
              <div className="grid grid-cols-1 gap-3">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-muted-foreground">
                        Photo {index + 1} {index === 0 && "(Required)"}
                      </Label>
                      {newPoint.images[index] && index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newImages = [...newPoint.images]
                            newImages.splice(index, 1)
                            setNewPoint({ ...newPoint, images: newImages })
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <ImageUpload
                      value={newPoint.images[index] || ""}
                      onChange={(url) => {
                        const newImages = [...newPoint.images]
                        if (url) {
                          newImages[index] = url
                        } else {
                          newImages.splice(index, 1)
                        }
                        setNewPoint({ ...newPoint, images: newImages })
                      }}
                      label={`Upload Photo ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>3D Tour URL (Kuula)</Label>
              <Input
                value={newPoint.tour3dUrl}
                onChange={(e) =>
                  setNewPoint({ ...newPoint, tour3dUrl: e.target.value })
                }
                placeholder="https://kuula.co/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Floor Plan</Label>
              <ImageUpload
                value={newPoint.floorPlan}
                onChange={(url) => setNewPoint({ ...newPoint, floorPlan: url })}
                label="Upload Floor Plan"
              />
            </div>

            <Separator />

            {/* Brochure */}
            <div className="space-y-2">
              <Label>Brochure (PDF)</Label>
              <PDFUpload
                value={newPoint.brochure}
                onChange={(url) => setNewPoint({ ...newPoint, brochure: url })}
                label="Upload Location Brochure"
              />
            </div>

            <Separator />

            {/* View Images */}
            <div className="space-y-3">
              <Label>Vistas Exteriores (Fotos de las vistas)</Label>
              <div className="grid grid-cols-1 gap-3">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-muted-foreground">
                        Vista {index + 1}
                      </Label>
                      {newPoint.viewImages[index] && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newViewImages = [...newPoint.viewImages]
                            newViewImages.splice(index, 1)
                            setNewPoint({ ...newPoint, viewImages: newViewImages })
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <ImageUpload
                      value={newPoint.viewImages[index] || ""}
                      onChange={(url) => {
                        const newViewImages = [...newPoint.viewImages]
                        if (url) {
                          newViewImages[index] = url
                        } else {
                          newViewImages.splice(index, 1)
                        }
                        setNewPoint({ ...newPoint, viewImages: newViewImages })
                      }}
                      label={`Upload Vista ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Installation Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detalles de Instalación</h3>

              {/* Areas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalArea">Área Total (m²)</Label>
                  <Input
                    id="totalArea"
                    type="number"
                    step="0.01"
                    value={newPoint.totalArea || ""}
                    onChange={(e) =>
                      setNewPoint({
                        ...newPoint,
                        totalArea: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    placeholder="120.50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="internalArea">Área Interna (m²)</Label>
                  <Input
                    id="internalArea"
                    type="number"
                    step="0.01"
                    value={newPoint.internalArea || ""}
                    onChange={(e) =>
                      setNewPoint({
                        ...newPoint,
                        internalArea: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    placeholder="100.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="externalArea">Área Externa (m²)</Label>
                  <Input
                    id="externalArea"
                    type="number"
                    step="0.01"
                    value={newPoint.externalArea || ""}
                    onChange={(e) =>
                      setNewPoint({
                        ...newPoint,
                        externalArea: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    placeholder="20.50"
                  />
                </div>
              </div>

              {/* Bedrooms and Bathrooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Recámaras</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={newPoint.bedrooms || ""}
                    onChange={(e) =>
                      setNewPoint({
                        ...newPoint,
                        bedrooms: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    placeholder="3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Baños</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    value={newPoint.bathrooms || ""}
                    onChange={(e) =>
                      setNewPoint({
                        ...newPoint,
                        bathrooms: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    placeholder="2"
                  />
                </div>
              </div>

              {/* Boolean Features */}
              <div className="space-y-3">
                <Label>Amenidades</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasBalcony"
                      checked={newPoint.hasBalcony}
                      onChange={(e) =>
                        setNewPoint({ ...newPoint, hasBalcony: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="hasBalcony" className="font-normal cursor-pointer">
                      Balcón
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasLaundry"
                      checked={newPoint.hasLaundry}
                      onChange={(e) =>
                        setNewPoint({ ...newPoint, hasLaundry: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="hasLaundry" className="font-normal cursor-pointer">
                      Lavandería
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasTerrace"
                      checked={newPoint.hasTerrace}
                      onChange={(e) =>
                        setNewPoint({ ...newPoint, hasTerrace: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="hasTerrace" className="font-normal cursor-pointer">
                      Terraza
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasGameRoom"
                      checked={newPoint.hasGameRoom}
                      onChange={(e) =>
                        setNewPoint({ ...newPoint, hasGameRoom: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="hasGameRoom" className="font-normal cursor-pointer">
                      Salón de Juegos
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingPoint(false)
                  resetPointForm()
                }}
              >
                Cancelar
              </Button>
              <Button onClick={addFacadePoint} disabled={!newPoint.name || newPoint.images.length === 0}>
                {editingPoint ? 'Actualizar' : 'Agregar'} Punto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
