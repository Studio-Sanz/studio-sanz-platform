"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface FacadePoint {
  id: string
  name: string
  x: number
  y: number
  images: string[]
  tour3dUrl: string | null
  floorPlan: string | null
}

interface Building {
  id: string
  name: string
  slug: string
  facadeImage: string | null
  facadePoints: FacadePoint[]
}

export default function FacadePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [building, setBuilding] = useState<Building | null>(null)
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

  if (!building || !building.facadeImage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-2xl text-white">Facade not found</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.2,
          ease: "easeIn"
        }}
        className="absolute inset-0 w-full h-screen overflow-hidden"
      >
        <Image
          src={building.facadeImage}
          alt="Building facade"
          fill
          className="object-cover"
        />

        {/* Overlay oscuro sutil para mejorar contraste */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

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
    </div>
  )
}
