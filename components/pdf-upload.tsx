"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUploadThing } from "@/lib/uploadthing"

interface PDFUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  disabled?: boolean
  className?: string
  label?: string
}

export function PDFUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  className,
  label = "Upload PDF",
}: PDFUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        onChange(res[0].url)
        setIsUploading(false)
      }
    },
    onUploadError: (error: Error) => {
      setError(error.message)
      setIsUploading(false)
    },
  })

  const handleFile = async (file: File) => {
    setError("")

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Solo se permiten archivos PDF")
      return
    }

    // Validate file size (32MB)
    const maxSize = 32 * 1024 * 1024
    if (file.size > maxSize) {
      setError("El archivo debe ser menor a 32MB")
      return
    }

    setIsUploading(true)

    try {
      await startUpload([file])
    } catch (err) {
      setError("Error al subir el archivo")
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled || isUploading) return

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isUploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onRemove) {
      onRemove()
    } else {
      onChange("")
    }
  }

  const getFileName = (url: string) => {
    return url.split("/").pop()?.split("?")[0] || "file"
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-all cursor-pointer",
          "hover:border-primary/50 hover:bg-accent/50",
          isDragging && "border-primary bg-accent",
          (disabled || isUploading) && "opacity-50 cursor-not-allowed",
          value ? "border-solid" : "border-dashed",
          !value && "min-h-[150px]"
        )}
      >
        {value ? (
          <div className="space-y-3">
            {/* PDF Preview */}
            <div className="relative w-full h-[600px] border rounded-lg overflow-hidden bg-gray-100">
              <iframe
                src={value}
                className="w-full h-full"
                title="PDF Preview"
              />
            </div>

            {/* File Actions */}
            <div className="p-3 flex items-center justify-between bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{getFileName(value)}</p>
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Abrir en nueva pestaña
                  </a>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleClick}
                  disabled={disabled || isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Cambiar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  disabled={disabled || isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Subiendo...</p>
              </>
            ) : (
              <>
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-1">{label}</p>
                <p className="text-xs text-muted-foreground mb-2">
                  Arrastra y suelta o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground">
                  Max 32MB • PDF
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
