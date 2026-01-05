"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, X, Loader2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  disabled?: boolean
  className?: string
  label?: string
  accept?: string
  maxSizeMB?: number
}

export function FileUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  className,
  label = "Upload File",
  accept = ".pdf",
  maxSizeMB = 10,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>("")
  const [signedUrl, setSignedUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get signed URL when value changes
  useEffect(() => {
    const getSignedUrl = async () => {
      if (!value) {
        setSignedUrl("")
        return
      }

      try {
        // Extract public_id from Cloudinary URL
        // Format: https://res.cloudinary.com/CLOUD/raw/upload/vVERSION/PUBLIC_ID.ext
        const match = value.match(/\/upload\/v\d+\/(.+)$/)
        if (!match) {
          console.error("Could not extract public_id from URL:", value)
          return
        }

        let publicId = match[1] // This includes folder/filename.ext

        // Remove the .pdf extension from publicId
        publicId = publicId.replace(/\.pdf$/, "")

        const response = await fetch("/api/cloudinary/sign-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        })

        const data = await response.json()
        setSignedUrl(data.signedUrl)
      } catch (err) {
        console.error("Error getting signed URL:", err)
      }
    }

    getSignedUrl()
  }, [value])

  const uploadToCloudinary = async (file: File) => {
    // Generate timestamp
    const timestamp = Math.round(new Date().getTime() / 1000)

    // Params to sign
    const paramsToSign = {
      timestamp,
      folder: "buildings",
    }

    // Get signature from backend
    const signResponse = await fetch("/api/cloudinary/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paramsToSign }),
    })

    if (!signResponse.ok) {
      throw new Error("Failed to get signature")
    }

    const { signature } = await signResponse.json()

    // Upload with signature
    const formData = new FormData()
    formData.append("file", file)
    formData.append("timestamp", timestamp.toString())
    formData.append("folder", "buildings")
    formData.append("signature", signature)
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Cloudinary upload error:", errorData)
      throw new Error(errorData.error?.message || "Upload failed")
    }

    const data = await response.json()
    return data.secure_url
  }

  const handleFile = async (file: File) => {
    setError("")

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    setIsUploading(true)

    try {
      const url = await uploadToCloudinary(file)
      onChange(url)
    } catch (err) {
      setError("Failed to upload file. Please try again.")
      console.error("Upload error:", err)
    } finally {
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
    return url.split('/').pop()?.split('?')[0] || 'file'
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
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
              {signedUrl ? (
                <iframe
                  src={signedUrl}
                  className="w-full h-full"
                  title="PDF Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>

            {/* File Actions */}
            <div className="p-3 flex items-center justify-between bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{getFileName(value)}</p>
                  {signedUrl && (
                    <a
                      href={signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Abrir en nueva pestaña
                    </a>
                  )}
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
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-1">{label}</p>
                <p className="text-xs text-muted-foreground mb-2">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Max size: {maxSizeMB}MB • {accept}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
