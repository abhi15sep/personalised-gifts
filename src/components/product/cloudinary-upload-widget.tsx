"use client"

import { CldUploadWidget } from "next-cloudinary"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface CloudinaryUploadWidgetProps {
  value?: string
  onUpload: (url: string) => void
  onRemove: () => void
  constraints?: {
    maxFileSizeMB?: number
    allowedTypes?: string[]
  }
}

export function CloudinaryUploadWidget({
  value,
  onUpload,
  onRemove,
  constraints,
}: CloudinaryUploadWidgetProps) {
  const maxFileSize = (constraints?.maxFileSizeMB || 5) * 1024 * 1024
  const allowedTypes = constraints?.allowedTypes || ["png", "jpg", "webp"]
  const acceptStr = allowedTypes.map((t) => `image/${t === "jpg" ? "jpeg" : t}`).join(",")

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "personalisation_uploads"

  if (value) {
    return (
      <div className="relative mt-1 inline-block">
        <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200">
          <Image
            src={value}
            alt="Uploaded personalisation"
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow-sm hover:bg-destructive/80"
        >
          <X className="size-3" />
        </button>
      </div>
    )
  }

  return (
    <CldUploadWidget
      uploadPreset={uploadPreset}
      options={{
        sources: ["local"],
        folder: "personalised-gifts/personalisation",
        maxFileSize,
        clientAllowedFormats: allowedTypes.map((t) => (t === "jpg" ? "jpeg" : t)),
        multiple: false,
        maxFiles: 1,
      }}
      onSuccess={(result) => {
        if (typeof result.info === "object" && result.info?.secure_url) {
          onUpload(result.info.secure_url)
        }
      }}
    >
      {({ open }) => (
        <Button
          type="button"
          variant="outline"
          className="mt-1 w-full border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
          onClick={() => open()}
        >
          <Upload className="mr-2 size-4" />
          Upload Image
          <span className="ml-1 text-xs text-gray-400">
            ({allowedTypes.join(", ").toUpperCase()}, max {constraints?.maxFileSizeMB || 5}MB)
          </span>
        </Button>
      )}
    </CldUploadWidget>
  )
}
