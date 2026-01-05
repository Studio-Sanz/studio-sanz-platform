"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Menu, X, Compass, Sparkles, MessageCircle, Download } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Building {
  id: string
  name: string
  slug: string
  logo: string | null
  brochure: string | null
}

export default function BuildingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [building, setBuilding] = useState<Building | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        const response = await fetch(`/api/buildings?slug=${slug}`)
        if (!response.ok) throw new Error("Building not found")
        const data = await response.json()
        setBuilding(data)
      } catch (error) {
        console.error("Error fetching building:", error)
      }
    }

    fetchBuilding()
  }, [slug])

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-8 left-8 z-50 p-4 rounded-2xl
          bg-white/40 backdrop-blur-xl border border-white/50
          shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]
          hover:bg-white/50 hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.3)]
          transition-all duration-300 ease-in-out
          hover:scale-105 active:scale-95"
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <X className="h-8 w-8 text-white drop-shadow-lg" />
        ) : (
          <Menu className="h-8 w-8 text-white drop-shadow-lg" />
        )}
      </button>

      {/* Side Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
              onClick={() => setMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
                mass: 0.8,
              }}
              className="fixed top-6 left-6 bottom-6 w-80 z-40
                bg-white/10 backdrop-blur-3xl
                border border-white/20
                rounded-3xl
                shadow-[0_8px_32px_0_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)_inset]
                overflow-hidden"
            >
              <div className="h-full p-8 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="space-y-8"
                >
                  {/* Logo */}
                  {building?.logo && (
                    <div className="relative w-48 h-24 mx-auto mb-8">
                      <Image
                        src={building.logo}
                        alt={`${building.name} logo`}
                        fill
                        className="object-contain"
                        style={{
                          filter: "brightness(0) invert(1) drop-shadow(0 0 20px rgba(255,255,255,0.3))",
                        }}
                      />
                    </div>
                  )}

                  {[
                    { label: "Inicio", action: () => { router.push(`/build/${slug}`); setMenuOpen(false); }, href: "#", icon: Compass },
                    { label: "Explorar", action: () => { router.push(`/build/${slug}/facade`); setMenuOpen(false); }, href: "#", icon: Sparkles },
                    { label: "Contacto", action: () => { router.push(`/build/${slug}#contact`); setMenuOpen(false); }, href: "#", icon: MessageCircle },
                  ].map((item, index) => (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.15 + index * 0.05,
                        duration: 0.4,
                        type: "spring",
                        damping: 20,
                        stiffness: 300,
                      }}
                      onClick={item.action}
                      className="flex items-center gap-4 text-white text-xl hover:text-white/70 transition-colors tracking-wide
                        hover:translate-x-2 transition-transform duration-300 w-full text-left"
                    >
                      <item.icon className="h-6 w-6" />
                      {item.label}
                    </motion.button>
                  ))}

                  {building?.brochure && (
                    <motion.a
                      href={building.brochure}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.3,
                        duration: 0.4,
                        type: "spring",
                        damping: 20,
                        stiffness: 300,
                      }}
                      className="flex items-center gap-4 text-white text-xl hover:text-white/70 transition-colors tracking-wide
                        hover:translate-x-2 transition-transform duration-300"
                    >
                      <Download className="h-6 w-6" />
                      Descargar Brochure
                    </motion.a>
                  )}
                </motion.div>
              </div>

              {/* Glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Page Content */}
      {children}
    </>
  )
}
