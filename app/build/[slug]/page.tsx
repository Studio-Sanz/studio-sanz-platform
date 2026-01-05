"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, Phone, Mail, Globe, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
}

interface Amenity {
  id: string
  name: string
  image: string | null
  order: number
}

export default function BuildingPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [building, setBuilding] = useState<Building | null>(null)
  const [showLanding, setShowLanding] = useState(true)
  const [showInitialVideo, setShowInitialVideo] = useState(false)
  const [showFacadeOnly, setShowFacadeOnly] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        const response = await fetch(`/api/buildings?slug=${slug}`)
        if (!response.ok) throw new Error("Building not found")
        const data = await response.json()
        setBuilding(data)
      } catch (error) {
        console.error("Error fetching building:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBuilding()
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="relative">
          <motion.div
            className="w-20 h-20 rounded-full border-4 border-white/10 border-t-white/80"
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

  if (!building) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-2xl text-white">Building not found</div>
      </div>
    )
  }

  // Render different views based on state
  return (
    <div className="fixed inset-0 bg-black">
      <AnimatePresence>
        {showLanding && (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 w-full h-screen overflow-hidden"
          >
        {building.mainImage && (
          <>
            <Image
              src={building.mainImage || "/placeholder.svg"}
              alt={building.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        )}

        <div className="relative h-full flex flex-col items-center justify-center text-white px-4 z-20">
          {building.logo && (
            <div className="relative w-[900px] h-[450px] mb-0 max-w-[90vw] drop-shadow-2xl">
              <Image
                src={building.logo || "/placeholder.svg"}
                alt={`${building.name} logo`}
                fill
                className="object-contain object-bottom"
                style={{
                  filter: "brightness(0) invert(1) drop-shadow(0 0 30px rgba(255,255,255,0.3))",
                }}
              />
            </div>
          )}

          <button
            onClick={() => {
              if (building.initialVideo) {
                setShowInitialVideo(true)
                setShowLanding(false)
              } else {
                setShowLanding(false)
              }
            }}
            className="group relative px-20 py-7 rounded-full overflow-hidden
              bg-white/10 backdrop-blur-xl border border-white/30
              shadow-[0_8px_32px_0_rgba(255,255,255,0.15),inset_0_1px_0_0_rgba(255,255,255,0.3)]
              hover:bg-white/15 hover:border-white/40
              hover:shadow-[0_12px_48px_0_rgba(255,255,255,0.25),inset_0_1px_0_0_rgba(255,255,255,0.4)]
              transition-all duration-500 hover:scale-105"
          >
            <span className="relative z-10 text-white font-bold text-2xl drop-shadow-lg">
              Entrar
            </span>
          </button>
        </div>
      </motion.div>
      )}

      {/* Initial Video (shown after clicking "Entrar" if video exists) */}
      {showInitialVideo && building.initialVideo && (
        <motion.div
          key="video"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: "linear"
          }}
          className="absolute inset-0 w-full h-screen overflow-hidden"
        >
        <video
          src={building.initialVideo}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onEnded={() => {
            setShowInitialVideo(false)
            setShowFacadeOnly(true)
            // Change URL after transition starts
            setTimeout(() => {
              router.replace(`/build/${slug}/facade`)
            }, 500)
          }}
        />
      </motion.div>
      )}

      {/* Facade Only View (shown after video ends) */}
      {showFacadeOnly && building.facadeImage && (
        <motion.div
          key="facade"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{
            duration: 0.5,
            ease: "linear"
          }}
          className="absolute inset-0 w-full h-screen overflow-hidden"
        >
        <Image
          src={building.facadeImage}
          alt="Building facade"
          fill
          className="object-cover"
        />

        {building.facadePoints.map((point) => (
          <motion.div
            key={point.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            onHoverStart={() => setHoveredPoint(point.id)}
            onHoverEnd={() => setHoveredPoint(null)}
          >
            {/* Point Marker */}
            <motion.div
              className="w-8 h-8 rounded-full border-4 border-white shadow-2xl cursor-pointer
                bg-white/20 backdrop-blur-md"
              animate={{
                scale: hoveredPoint === point.id ? 1.5 : 1,
                backgroundColor: hoveredPoint === point.id ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)",
              }}
              transition={{
                type: "spring",
                damping: 15,
                stiffness: 300,
              }}
            />

            {/* Tooltip Card */}
            <AnimatePresence>
              {hoveredPoint === point.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 400,
                    delay: 0.2,
                  }}
                  className="absolute top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
                  style={{ willChange: "auto" }}
                >
                  <div className="relative px-8 py-5 rounded-2xl
                    border border-white/30
                    shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)]
                    min-w-[280px]"
                    style={{
                      background: "rgba(30, 30, 30, 0.85)",
                      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)"
                    }}
                  >
                    {/* Glass shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-2xl" />

                    <div className="relative z-10">
                      <h3 className="text-white font-semibold text-xl mb-4 text-center whitespace-nowrap drop-shadow-lg">
                        {point.name}
                      </h3>
                      <button
                        onClick={() => {
                          const pointSlug = point.name.toLowerCase().replace(/\s+/g, '-')
                          router.push(`/build/${slug}/location/${pointSlug}`)
                        }}
                        className="w-full px-8 py-3 rounded-full
                          bg-white/20 border border-white/40
                          shadow-[0_4px_16px_0_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.3)]
                          hover:bg-white/30 hover:border-white/50
                          hover:shadow-[0_6px_24px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.4)]
                          transition-all duration-300 hover:scale-105
                          text-white font-bold text-base drop-shadow-lg"
                      >
                        Ingresar
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
      )}

      {/* Main Content (shown after clicking "Entrar" when no video) */}
      {!showLanding && !showInitialVideo && !showFacadeOnly && (
        <motion.div
          key="main"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 min-h-screen"
        >
      {/* Hero Section with Video or Image */}
      <section className="relative w-full h-screen">
        {building.initialVideo ? (
          <video
            src={building.initialVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : building.mainImage ? (
          <Image
            src={building.mainImage || "/placeholder.svg"}
            alt={building.name}
            fill
            className="object-cover"
            priority
          />
        ) : null}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <button
          onClick={() => setShowLanding(true)}
          className="fixed top-8 left-8 z-50 p-4 rounded-2xl
            bg-white/10 backdrop-blur-xl border border-white/20
            shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]
            hover:bg-white/20 hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]
            transition-all duration-300 ease-in-out
            hover:scale-105 active:scale-95"
          aria-label="Back to landing"
        >
          <Menu className="h-8 w-8 text-white drop-shadow-lg" />
        </button>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          {building.logo && (
            <div className="relative w-80 h-40 mb-12 drop-shadow-2xl">
              <Image
                src={building.logo || "/placeholder.svg"}
                alt={`${building.name} logo`}
                fill
                className="object-contain brightness-0 invert"
                style={{
                  filter: "brightness(0) invert(1) drop-shadow(0 0 20px rgba(255,255,255,0.3))",
                }}
              />
            </div>
          )}
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 tracking-tight text-balance">
            {building.name}
          </h1>
          {building.address && (
            <p className="text-xl md:text-2xl flex items-center gap-3 text-white/90">
              <MapPin className="h-6 w-6" />
              {building.address}
            </p>
          )}
        </div>
      </section>

      {building.facadeImage && (
        <section id="explore" className="py-20 px-4 bg-neutral-950">
          <div className="container mx-auto">
            <h2 className="text-5xl font-bold text-center mb-16 text-white tracking-tight">Explora el Edificio</h2>
            <div className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={building.facadeImage || "/placeholder.svg"}
                alt="Building facade"
                width={1920}
                height={1080}
                className="w-full h-auto"
              />
              {building.facadePoints.map((point) => (
                <div
                  key={point.id}
                  className="absolute w-8 h-8 rounded-full border-4 border-white shadow-2xl transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300
                    bg-white/20 backdrop-blur-md
                    hover:bg-white/30 hover:scale-150 hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]
                    animate-pulse"
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  title={point.name}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {building.amenities.length > 0 && (
        <section id="amenities" className="py-20 px-4 bg-black">
          <div className="container mx-auto">
            <h2 className="text-5xl font-bold text-center mb-16 text-white tracking-tight">Amenidades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {building.amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className="group relative overflow-hidden rounded-2xl
                    bg-white/5 backdrop-blur-xl border border-white/10
                    shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]
                    hover:bg-white/10 hover:border-white/20
                    hover:shadow-[0_12px_48px_0_rgba(255,255,255,0.1)]
                    transition-all duration-500"
                >
                  {amenity.image && (
                    <div className="relative w-full h-64 overflow-hidden">
                      <Image
                        src={amenity.image || "/placeholder.svg"}
                        alt={amenity.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-center text-white tracking-wide">{amenity.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 px-4 bg-neutral-950">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-5xl font-bold text-center mb-16 text-white tracking-tight">Contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {building.whatsapp && (
              <a
                href={`https://wa.me/${building.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div
                  className="h-full p-8 rounded-2xl
                  bg-white/5 backdrop-blur-xl border border-white/10
                  shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]
                  hover:bg-white/10 hover:border-white/20
                  hover:shadow-[0_12px_48px_0_rgba(255,255,255,0.1)]
                  transition-all duration-500 hover:scale-105 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <MessageCircle className="h-10 w-10 text-green-400 drop-shadow-lg" />
                    <div>
                      <p className="font-semibold text-white text-lg tracking-wide">WhatsApp</p>
                      <p className="text-white/70">{building.whatsapp}</p>
                    </div>
                  </div>
                </div>
              </a>
            )}

            {building.phone && (
              <a href={`tel:${building.phone}`} className="group block">
                <div
                  className="h-full p-8 rounded-2xl
                  bg-white/5 backdrop-blur-xl border border-white/10
                  shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]
                  hover:bg-white/10 hover:border-white/20
                  hover:shadow-[0_12px_48px_0_rgba(255,255,255,0.1)]
                  transition-all duration-500 hover:scale-105 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <Phone className="h-10 w-10 text-blue-400 drop-shadow-lg" />
                    <div>
                      <p className="font-semibold text-white text-lg tracking-wide">Teléfono</p>
                      <p className="text-white/70">{building.phone}</p>
                    </div>
                  </div>
                </div>
              </a>
            )}

            {building.email && (
              <a href={`mailto:${building.email}`} className="group block">
                <div
                  className="h-full p-8 rounded-2xl
                  bg-white/5 backdrop-blur-xl border border-white/10
                  shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]
                  hover:bg-white/10 hover:border-white/20
                  hover:shadow-[0_12px_48px_0_rgba(255,255,255,0.1)]
                  transition-all duration-500 hover:scale-105 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <Mail className="h-10 w-10 text-red-400 drop-shadow-lg" />
                    <div>
                      <p className="font-semibold text-white text-lg tracking-wide">Email</p>
                      <p className="text-white/70 break-all">{building.email}</p>
                    </div>
                  </div>
                </div>
              </a>
            )}

            {building.website && (
              <a href={building.website} target="_blank" rel="noopener noreferrer" className="group block">
                <div
                  className="h-full p-8 rounded-2xl
                  bg-white/5 backdrop-blur-xl border border-white/10
                  shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]
                  hover:bg-white/10 hover:border-white/20
                  hover:shadow-[0_12px_48px_0_rgba(255,255,255,0.1)]
                  transition-all duration-500 hover:scale-105 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <Globe className="h-10 w-10 text-purple-400 drop-shadow-lg" />
                    <div>
                      <p className="font-semibold text-white text-lg tracking-wide">Website</p>
                      <p className="text-white/70 truncate">{building.website}</p>
                    </div>
                  </div>
                </div>
              </a>
            )}
          </div>

          {building.brochure && (
            <div className="mt-12 text-center">
              <a href={building.brochure} target="_blank" rel="noopener noreferrer">
                <button
                  className="px-12 py-5 rounded-full
                  bg-white/10 backdrop-blur-xl border border-white/30
                  shadow-[0_8px_32px_0_rgba(255,255,255,0.15),inset_0_1px_0_0_rgba(255,255,255,0.3)]
                  hover:bg-white/15 hover:border-white/40
                  hover:shadow-[0_12px_48px_0_rgba(255,255,255,0.25),inset_0_1px_0_0_rgba(255,255,255,0.4)]
                  transition-all duration-500 hover:scale-105
                  text-white font-bold text-lg tracking-[0.3em] uppercase"
                >
                  DESCARGAR BROCHURE
                </button>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Map Section */}
      {building.latitude && building.longitude && (
        <section className="py-20 px-4 bg-black">
          <div className="container mx-auto">
            <h2 className="text-5xl font-bold text-center mb-16 text-white tracking-tight">Ubicación</h2>
            <div
              className="w-full h-96 rounded-2xl overflow-hidden
              bg-white/5 backdrop-blur-xl border border-white/10
              shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]
            flex items-center justify-center"
            >
              <p className="text-white/50 text-lg">Map integration (Google Maps / Mapbox)</p>
            </div>
          </div>
        </section>
      )}
    </motion.div>
      )}
    </AnimatePresence>
    </div>
  )
}
