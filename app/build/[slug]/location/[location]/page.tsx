"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
  Share2,
  Download,
  Maximize2,
  Mountain,
  Grid3x3,
  Camera,
  Home,
  Bed,
  Bath,
  Wind,
  Shirt,
  Umbrella,
  Gamepad2,
  Menu,
  X,
  ArrowLeft,
  Images,
  Box,
  ScanEye
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

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

interface Building {
  id: string
  name: string
  slug: string
  facadePoints: FacadePoint[]
}

type ViewMode = 'gallery' | 'views' | 'floorplan' | 'tour'

export default function LocationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const buildingSlug = params.slug as string
  const locationSlug = params.location as string

  const [building, setBuilding] = useState<Building | null>(null)
  const [location, setLocation] = useState<FacadePoint | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('gallery')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/buildings?slug=${buildingSlug}`)
        if (!response.ok) throw new Error("Building not found")
        const data = await response.json()
        setBuilding(data)

        // Find the location by matching slug
        const foundLocation = data.facadePoints.find(
          (point: FacadePoint) =>
            point.name.toLowerCase().replace(/\s+/g, "-") === locationSlug
        )

        if (foundLocation) {
          setLocation(foundLocation)
        }
      } catch (error) {
        console.error("Error fetching location:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [buildingSlug, locationSlug])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: location?.name,
          url: url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      alert("Link copiado al portapapeles")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative">
          <motion.div
            className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-black"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </div>
    )
  }

  if (!building || !location) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-2xl text-black mb-4">Ubicación no encontrada</div>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-full bg-gray-100 border border-gray-200 text-black hover:bg-gray-200 transition-all"
          >
            Volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Blurred Background Image */}
      {location.images.length > 0 && (
        <div className="fixed inset-0 z-0">
          <Image
            src={location.images[0]}
            alt="Background"
            fill
            className="object-cover"
            style={{ filter: 'blur(40px)' }}
            priority
          />
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex h-screen">
          {/* Left Sidebar */}
          <div className="w-[400px] bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
            <div className="p-6 space-y-6">
            {/* Image Swiper */}
            {location.images.length > 0 && (
              <div className="rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 relative">
                <Swiper
                  modules={[Pagination]}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true
                  }}
                  loop
                  className="h-[240px]"
                >
                  {location.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative w-full h-full">
                        <Image
                          src={image}
                          alt={`${location.name} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="absolute bottom-4 right-4 z-10 p-3 rounded-full
                    bg-white/15 backdrop-blur-xl border border-white/30
                    hover:bg-white/25 hover:border-white/50
                    transition-all duration-300 hover:scale-110
                    text-white"
                  title="Compartir"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Location Name */}
            <h1 className="text-2xl font-bold text-black tracking-tight">{location.name}</h1>

            {/* Instalaciones */}
            <div className="rounded-3xl overflow-hidden bg-gray-50 border border-gray-200 p-6">
              <h3 className="text-2xl font-bold text-black mb-4">Instalaciones</h3>

              <div className="space-y-3">
                {location.totalArea && (
                  <>
                    <div className="flex items-center gap-3 text-black">
                      <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                        <Home className="h-5 w-5 text-black flex-shrink-0" />
                      </div>
                      <p className="text-sm">Área Total {location.totalArea} m²</p>
                    </div>
                    <div className="h-px bg-gray-200" />
                  </>
                )}

                {location.internalArea && (
                  <>
                    <div className="flex items-center gap-3 text-black">
                      <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                        <Maximize2 className="h-5 w-5 text-black flex-shrink-0" />
                      </div>
                      <p className="text-sm">Área Interna {location.internalArea} m²</p>
                    </div>
                    <div className="h-px bg-gray-200" />
                  </>
                )}

                {location.externalArea && (
                  <>
                    <div className="flex items-center gap-3 text-black">
                      <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                        <Mountain className="h-5 w-5 text-black flex-shrink-0" />
                      </div>
                      <p className="text-sm">Área Externa {location.externalArea} m²</p>
                    </div>
                    <div className="h-px bg-gray-200" />
                  </>
                )}

                {location.bedrooms !== null && (
                  <>
                    <div className="flex items-center gap-3 text-black">
                      <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                        <Bed className="h-5 w-5 text-black flex-shrink-0" />
                      </div>
                      <p className="text-sm">{location.bedrooms} Recámaras</p>
                    </div>
                    <div className="h-px bg-gray-200" />
                  </>
                )}

                {location.bathrooms !== null && (
                  <>
                    <div className="flex items-center gap-3 text-black">
                      <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                        <Bath className="h-5 w-5 text-black flex-shrink-0" />
                      </div>
                      <p className="text-sm">{location.bathrooms} Baños</p>
                    </div>
                    <div className="h-px bg-gray-200" />
                  </>
                )}

                {location.hasBalcony && (
                  <>
                    <div className="flex items-center gap-3 text-black">
                      <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                        <Wind className="h-5 w-5 text-black flex-shrink-0" />
                      </div>
                      <p className="text-sm">Balcón</p>
                    </div>
                    <div className="h-px bg-gray-200" />
                  </>
                )}

                {location.hasLaundry && (
                  <>
                    <div className="flex items-center gap-3 text-black">
                      <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                        <Shirt className="h-5 w-5 text-black flex-shrink-0" />
                      </div>
                      <p className="text-sm">Lavandería</p>
                    </div>
                    <div className="h-px bg-gray-200" />
                  </>
                )}

                {location.hasTerrace && (
                  <>
                    <div className="flex items-center gap-3 text-black">
                      <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                        <Umbrella className="h-5 w-5 text-black flex-shrink-0" />
                      </div>
                      <p className="text-sm">Terraza</p>
                    </div>
                    <div className="h-px bg-gray-200" />
                  </>
                )}

                {location.hasGameRoom && (
                  <div className="flex items-center gap-3 text-black">
                    <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                      <Gamepad2 className="h-5 w-5 text-black flex-shrink-0" />
                    </div>
                    <p className="text-sm">Salón de Juegos</p>
                  </div>
                )}
              </div>
            </div>

            {/* Brochure Button */}
            {location.brochure && (
              <a
                href={location.brochure}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl
                  bg-gradient-to-r from-blue-500 to-purple-500 border border-blue-600
                  hover:from-blue-600 hover:to-purple-600
                  transition-all duration-300 hover:scale-105
                  text-white font-semibold text-lg shadow-lg"
              >
                <Download className="h-5 w-5" />
                Descargar Brochure
              </a>
            )}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-hidden relative">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="absolute left-6 top-8 z-20 group flex items-center gap-2 px-4 py-3 rounded-full
                bg-black/20 backdrop-blur-xl border border-white/40
                shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.15)]
                hover:bg-black/30 hover:border-white/60
                hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)]
                transition-all duration-500 hover:scale-105"
              title="Regresar"
            >
              <ArrowLeft className="h-5 w-5 text-white drop-shadow-lg" />
              <span className="font-semibold text-sm text-white drop-shadow-lg">Regresar</span>
            </button>

              <AnimatePresence mode="wait">
                {viewMode === 'gallery' && location.images.length > 0 && (
                  <motion.div
                    key="gallery"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <div className="relative w-full h-full">
                      <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{
                          clickable: true,
                          dynamicBullets: true
                        }}
                        loop
                        className="h-full w-full"
                      >
                        {location.images.map((image, index) => (
                          <SwiperSlide key={index}>
                            <div className="relative w-full h-full">
                              <Image
                                src={image}
                                alt={`${location.name} ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </motion.div>
                )}

                {viewMode === 'views' && (
                  <motion.div
                    key="views"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full w-full flex items-center justify-center"
                  >
                    {location.viewImages && location.viewImages.length > 0 ? (
                      <div className="relative w-full h-full">
                        <Swiper
                          modules={[Navigation, Pagination]}
                          navigation
                          pagination={{
                            clickable: true,
                            dynamicBullets: true
                          }}
                          loop
                          className="h-full w-full"
                        >
                          {location.viewImages.map((image, index) => (
                            <SwiperSlide key={index}>
                              <div className="relative w-full h-full">
                                <Image
                                  src={image}
                                  alt={`Vista ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-20">No hay vistas disponibles</p>
                    )}
                  </motion.div>
                )}

                {viewMode === 'floorplan' && (
                  <motion.div
                    key="floorplan"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full w-full"
                  >
                    {location.floorPlan ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={location.floorPlan}
                          alt="Floor plan"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-20">No hay plano disponible</p>
                    )}
                  </motion.div>
                )}

                {viewMode === 'tour' && (
                  <motion.div
                    key="tour"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full w-full"
                  >
                    {location.tour3dUrl ? (
                      <div className="relative w-full h-full">
                        <iframe
                          src={location.tour3dUrl}
                          className="w-full h-full"
                          allowFullScreen
                          title="3D Tour"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-20">No hay recorrido disponible</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            {/* Circular Navigation Buttons - Liquid Glass Style */}
            <div className="absolute right-6 top-8 z-20">
              <button
                onClick={() => setViewMode('gallery')}
                className={`absolute top-0 right-0 group flex items-center justify-end overflow-hidden rounded-full
                  transition-all duration-500 hover:scale-105
                  ${viewMode === 'gallery'
                    ? 'bg-black/30 backdrop-blur-xl border-2 border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] w-40 h-10'
                    : 'bg-black/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.15)] hover:bg-black/30 hover:border-white/60 hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] w-10 h-10 hover:w-40'
                  }`}
                title="Ver Galería"
              >
                <span className={`absolute left-3 whitespace-nowrap font-semibold text-sm text-white drop-shadow-lg
                  transition-opacity duration-500
                  ${viewMode === 'gallery' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  Ver Galería
                </span>
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <Images className="h-4 w-4 text-white drop-shadow-lg" />
                </div>
              </button>

              <button
                onClick={() => setViewMode('views')}
                className={`absolute top-14 right-0 group flex items-center justify-end overflow-hidden rounded-full
                  transition-all duration-500 hover:scale-105
                  ${viewMode === 'views'
                    ? 'bg-black/30 backdrop-blur-xl border-2 border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] w-40 h-10'
                    : 'bg-black/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.15)] hover:bg-black/30 hover:border-white/60 hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] w-10 h-10 hover:w-40'
                  }`}
                title="Vistas"
              >
                <span className={`absolute left-3 whitespace-nowrap font-semibold text-sm text-white drop-shadow-lg
                  transition-opacity duration-500
                  ${viewMode === 'views' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  Vistas
                </span>
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <Camera className="h-4 w-4 text-white drop-shadow-lg" />
                </div>
              </button>

              <button
                onClick={() => setViewMode('floorplan')}
                className={`absolute top-28 right-0 group flex items-center justify-end overflow-hidden rounded-full
                  transition-all duration-500 hover:scale-105
                  ${viewMode === 'floorplan'
                    ? 'bg-black/30 backdrop-blur-xl border-2 border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] w-40 h-10'
                    : 'bg-black/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.15)] hover:bg-black/30 hover:border-white/60 hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] w-10 h-10 hover:w-40'
                  }`}
                title="Planta 3D"
              >
                <span className={`absolute left-3 whitespace-nowrap font-semibold text-sm text-white drop-shadow-lg
                  transition-opacity duration-500
                  ${viewMode === 'floorplan' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  Planta 3D
                </span>
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <Box className="h-4 w-4 text-white drop-shadow-lg" />
                </div>
              </button>

              <button
                onClick={() => setViewMode('tour')}
                className={`absolute top-42 right-0 group flex items-center justify-end overflow-hidden rounded-full
                  transition-all duration-500 hover:scale-105
                  ${viewMode === 'tour'
                    ? 'bg-black/30 backdrop-blur-xl border-2 border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] w-40 h-10'
                    : 'bg-black/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.15)] hover:bg-black/30 hover:border-white/60 hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] w-10 h-10 hover:w-40'
                  }`}
                title="Recorrido Virtual"
              >
                <span className={`absolute left-3 whitespace-nowrap font-semibold text-sm text-white drop-shadow-lg
                  transition-opacity duration-500
                  ${viewMode === 'tour' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  Recorrido
                </span>
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <ScanEye className="h-4 w-4 text-white drop-shadow-lg" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
